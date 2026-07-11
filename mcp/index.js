import { Server } from "@modelcontextprotocol/sdk/server/index.js";
import { StdioServerTransport } from "@modelcontextprotocol/sdk/server/stdio.js";
import {
  CallToolRequestSchema,
  ListToolsRequestSchema,
} from "@modelcontextprotocol/sdk/types.js";
import fs from "fs";
import path from "path";
import { fileURLToPath } from "url";

// Load environment variables manually for ESM module simplicity
const __dirname = path.dirname(fileURLToPath(import.meta.url));
const envPath = path.join(__dirname, ".env");
const envContent = fs.readFileSync(envPath, "utf-8");
const env = {};
envContent.split("\n").forEach((line) => {
  const match = line.match(/^\s*([\w.\-]+)\s*=\s*(.*)?\s*$/);
  if (match) {
    let value = match[2] || "";
    if (value.startsWith('"') && value.endsWith('"')) {
      value = value.slice(1, -1);
    }
    env[match[1]] = value;
  }
});

const CLIENT_ID = env.GOOGLE_ADS_CLIENT_ID;
const CLIENT_SECRET = env.GOOGLE_ADS_CLIENT_SECRET;
const REFRESH_TOKEN = env.GOOGLE_ADS_REFRESH_TOKEN;
const DEVELOPER_TOKEN = env.GOOGLE_ADS_DEVELOPER_TOKEN;
const CLIENT_CUSTOMER_ID = env.GOOGLE_ADS_CLIENT_CUSTOMER_ID;
const MANAGER_CUSTOMER_ID = env.GOOGLE_ADS_MANAGER_CUSTOMER_ID;

// Helper to get Google Ads Access Token using OAuth2 Refresh Token
async function getAccessToken() {
  const response = await fetch("https://oauth2.googleapis.com/token", {
    method: "POST",
    headers: { "Content-Type": "application/x-www-form-urlencoded" },
    body: new URLSearchParams({
      client_id: CLIENT_ID,
      client_secret: CLIENT_SECRET,
      refresh_token: REFRESH_TOKEN,
      grant_type: "refresh_token",
    }),
  });
  const data = await response.json();
  if (data.error) {
    throw new Error(`Auth Error: ${data.error_description || data.error}`);
  }
  return data.access_token;
}

// Helper to query Google Ads REST API v21
async function queryGoogleAds(query) {
  const accessToken = await getAccessToken();
  const response = await fetch(`https://googleads.googleapis.com/v21/customers/${CLIENT_CUSTOMER_ID}/googleAds:search`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      "developer-token": DEVELOPER_TOKEN,
      "Authorization": `Bearer ${accessToken}`,
      "login-customer-id": MANAGER_CUSTOMER_ID, // Required for manager account developer token auth
    },
    body: JSON.stringify({ query }),
  });
  
  const text = await response.text();
  let data;
  try {
    data = JSON.parse(text);
  } catch (e) {
    throw new Error(`Google API Server Error (Status ${response.status}): ${text}`);
  }
  
  if (data.error) {
    throw new Error(`Google Ads API Error: ${JSON.stringify(data.error, null, 2)}`);
  }
  
  return data.results || [];
}

// Initialize MCP Server
const server = new Server(
  {
    name: "google-ads-mcp-server",
    version: "1.0.0",
  },
  {
    capabilities: {
      tools: {},
    },
  }
);

// Define tools schemas
const TOOLS = [
  {
    name: "get_campaign_report",
    description: "Get performance metrics (impressions, clicks, cost, conversions) for all campaigns.",
    inputSchema: {
      type: "object",
      properties: {},
    },
  },
  {
    name: "get_keyword_report",
    description: "List all active keywords in the client account along with clicks, impressions, cost, and match type.",
    inputSchema: {
      type: "object",
      properties: {},
    },
  },
  {
    name: "mutate_campaign_budget",
    description: "Update the daily budget of a campaign in Chilean Pesos (CLP).",
    inputSchema: {
      type: "object",
      properties: {
        campaignId: { type: "string", description: "The ID of the campaign to edit" },
        newBudgetAmountCLP: { type: "number", description: "The new daily budget in CLP (e.g. 5000)" },
      },
      required: ["campaignId", "newBudgetAmountCLP"],
    },
  },
];

server.setRequestHandler(ListToolsRequestSchema, async () => {
  return {
    tools: TOOLS,
  };
});

server.setRequestHandler(CallToolRequestSchema, async (request) => {
  const { name, arguments: args } = request.params;
  
  try {
    if (name === "get_campaign_report") {
      const query = `
        SELECT 
          campaign.id, 
          campaign.name, 
          campaign.status, 
          campaign.advertising_channel_type,
          metrics.impressions, 
          metrics.clicks, 
          metrics.cost_micros, 
          metrics.conversions 
        FROM campaign
      `;
      const results = await queryGoogleAds(query);
      
      const formatted = results.map(row => {
        const cost = (parseInt(row.metrics?.costMicros || 0) / 1000000).toLocaleString("es-CL", { style: "currency", currency: "CLP" });
        return {
          name: row.campaign.name,
          id: row.campaign.id,
          status: row.campaign.status,
          channel: row.campaign.advertisingChannelType,
          impressions: row.metrics?.impressions || 0,
          clicks: row.metrics?.clicks || 0,
          cost,
          conversions: row.metrics?.conversions || 0
        };
      });

      return {
        content: [{ type: "text", text: JSON.stringify(formatted, null, 2) }],
      };
    }
    
    if (name === "get_keyword_report") {
      const query = `
        SELECT 
          ad_group.name,
          ad_group_criterion.criterion_id,
          ad_group_criterion.keyword.text,
          ad_group_criterion.keyword.match_type,
          ad_group_criterion.status,
          metrics.impressions,
          metrics.clicks,
          metrics.cost_micros
        FROM ad_group_criterion
        WHERE ad_group_criterion.type = 'KEYWORD'
      `;
      const results = await queryGoogleAds(query);
      
      const formatted = results.map(row => {
        const cost = (parseInt(row.metrics?.costMicros || 0) / 1000000).toLocaleString("es-CL", { style: "currency", currency: "CLP" });
        return {
          adGroup: row.adGroup.name,
          keywordId: row.adGroupCriterion.criterionId,
          text: row.adGroupCriterion.keyword.text,
          matchType: row.adGroupCriterion.keyword.matchType,
          status: row.adGroupCriterion.status,
          impressions: row.metrics?.impressions || 0,
          clicks: row.metrics?.clicks || 0,
          cost
        };
      });

      return {
        content: [{ type: "text", text: JSON.stringify(formatted, null, 2) }],
      };
    }

    if (name === "mutate_campaign_budget") {
      const { campaignId, newBudgetAmountCLP } = args;
      const accessToken = await getAccessToken();
      
      // 1. First retrieve the specific campaign budget resource name associated with the campaign
      const campaignQuery = `SELECT campaign.id, campaign.name, campaign.campaign_budget FROM campaign WHERE campaign.id = '${campaignId}'`;
      const campaignInfo = await queryGoogleAds(campaignQuery);
      
      if (!campaignInfo || campaignInfo.length === 0) {
        throw new Error(`Campaign with ID ${campaignId} not found.`);
      }
      
      const budgetResourceName = campaignInfo[0].campaign.campaignBudget;
      
      // 2. Convert CLP budget to micros (CLP amount * 1,000,000)
      const amountMicros = Math.round(newBudgetAmountCLP * 1000000);
      
      // 3. Mutate campaign budget
      const response = await fetch(`https://googleads.googleapis.com/v21/${budgetResourceName}:mutate`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          "developer-token": DEVELOPER_TOKEN,
          "Authorization": `Bearer ${accessToken}`,
          "login-customer-id": MANAGER_CUSTOMER_ID,
        },
        body: JSON.stringify({
          operations: [
            {
              update: {
                resourceName: budgetResourceName,
                amountMicros: amountMicros.toString()
              },
              updateMask: "amountMicros"
            }
          ]
        }),
      });

      const text = await response.text();
      let mutateData = JSON.parse(text);
      
      if (mutateData.error) {
        throw new Error(`Budget Mutate Error: ${JSON.stringify(mutateData.error, null, 2)}`);
      }
      
      return {
        content: [{ type: "text", text: `Successfully updated campaign daily budget to ${newBudgetAmountCLP.toLocaleString("es-CL", { style: "currency", currency: "CLP" })} (Resource: ${budgetResourceName})` }],
      };
    }
    
    throw new Error(`Tool not found: ${name}`);
  } catch (error) {
    return {
      isError: true,
      content: [{ type: "text", text: error.message }],
    };
  }
});

// Run server using stdio transport
const transport = new StdioServerTransport();
await server.connect(transport);
console.error("🚀 Google Ads MCP Server running on Stdio transport");

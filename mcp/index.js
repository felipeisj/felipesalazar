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

// Google retires API versions roughly a year after release; a retired version
// answers 404 on every call. Bump this when that happens (v21 died before 2026-11-08).
const API_VERSION = "v26";

// Helper to query the Google Ads REST API
async function queryGoogleAds(query) {
  const accessToken = await getAccessToken();
  const response = await fetch(`https://googleads.googleapis.com/${API_VERSION}/customers/${CLIENT_CUSTOMER_ID}/googleAds:search`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      "developer-token": DEVELOPER_TOKEN,
      "Authorization": `Bearer ${accessToken}`,
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

// Generic helper for collection-level mutate calls (creates and updates),
// e.g. resourcePath "campaigns", "adGroups", "adGroupCriteria", "adGroupAds".
async function mutateGoogleAds(resourcePath, operations) {
  const accessToken = await getAccessToken();
  const response = await fetch(`https://googleads.googleapis.com/${API_VERSION}/customers/${CLIENT_CUSTOMER_ID}/${resourcePath}:mutate`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      "developer-token": DEVELOPER_TOKEN,
      "Authorization": `Bearer ${accessToken}`,
    },
    body: JSON.stringify({ operations }),
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

function resourceId(resourceName) {
  return resourceName.split("/").pop();
}

// Report period. Without a segments.date filter GAQL aggregates over an
// undefined span, so reports always carry an explicit period.
const DATE_RANGES = [
  "TODAY",
  "YESTERDAY",
  "LAST_7_DAYS",
  "LAST_14_DAYS",
  "LAST_30_DAYS",
  "THIS_MONTH",
  "LAST_MONTH",
  "ALL_TIME",
];
const DEFAULT_DATE_RANGE = "LAST_30_DAYS";
const ISO_DATE = /^\d{4}-\d{2}-\d{2}$/;

const PERIOD_PROPERTIES = {
  date_range: {
    type: "string",
    enum: DATE_RANGES,
    description: `Predefined period (default ${DEFAULT_DATE_RANGE}). ALL_TIME = no date filter.`,
  },
  since: {
    type: "string",
    description: "Start date YYYY-MM-DD, inclusive. Use together with 'until'; takes precedence over date_range.",
  },
  until: {
    type: "string",
    description: "End date YYYY-MM-DD, inclusive. Use together with 'since'.",
  },
};

// Returns the GAQL condition for the requested period (null for ALL_TIME) and
// a label echoed in the response. Values are validated against the enum/regex
// before being interpolated into the query.
function buildPeriod(args = {}) {
  const { date_range, since, until } = args;
  if (since || until) {
    if (!since || !until) throw new Error("'since' and 'until' must be used together (YYYY-MM-DD).");
    if (!ISO_DATE.test(since) || !ISO_DATE.test(until)) throw new Error("'since'/'until' must be YYYY-MM-DD.");
    if (since > until) throw new Error("'since' cannot be after 'until'.");
    return { where: `segments.date BETWEEN '${since}' AND '${until}'`, label: { since, until } };
  }
  const range = date_range || DEFAULT_DATE_RANGE;
  if (!DATE_RANGES.includes(range)) {
    throw new Error(`Invalid date_range '${range}'. Options: ${DATE_RANGES.join(", ")}.`);
  }
  if (range === "ALL_TIME") return { where: null, label: { date_range: "ALL_TIME" } };
  return { where: `segments.date DURING ${range}`, label: { date_range: range } };
}

function costFromMicros(micros) {
  const costCLP = Math.round(parseInt(micros || 0) / 1000000);
  return { costCLP, cost: costCLP.toLocaleString("es-CL", { style: "currency", currency: "CLP" }) };
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
    description: `Get performance metrics (impressions, clicks, cost, conversions) for all campaigns over a period (default ${DEFAULT_DATE_RANGE}; use since/until for a specific month). The response echoes the period used.`,
    inputSchema: {
      type: "object",
      properties: PERIOD_PROPERTIES,
    },
  },
  {
    name: "get_keyword_report",
    description: `List keywords in the client account with clicks, impressions, cost, and match type over a period (default ${DEFAULT_DATE_RANGE}; use since/until for a specific month). Keywords with no activity in the period may be omitted. The response echoes the period used.`,
    inputSchema: {
      type: "object",
      properties: PERIOD_PROPERTIES,
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
  {
    name: "create_search_campaign",
    description: "Create a new Search campaign with a daily budget in CLP. SAFETY: the campaign is always created with status PAUSED regardless of input — it never starts spending on its own. Activating it (ENABLED) must be done manually in the Google Ads UI.",
    inputSchema: {
      type: "object",
      properties: {
        campaignName: { type: "string", description: "Name for the new campaign" },
        dailyBudgetCLP: { type: "number", description: "Daily budget in CLP (e.g. 5000)" },
      },
      required: ["campaignName", "dailyBudgetCLP"],
    },
  },
  {
    name: "create_ad_group",
    description: "Create a new ad group under an existing campaign. Ad group is created ENABLED, but it will not spend while the parent campaign is PAUSED.",
    inputSchema: {
      type: "object",
      properties: {
        campaignId: { type: "string", description: "ID of the parent campaign" },
        adGroupName: { type: "string", description: "Name for the new ad group" },
        cpcBidCLP: { type: "number", description: "Optional max CPC bid in CLP" },
      },
      required: ["campaignId", "adGroupName"],
    },
  },
  {
    name: "add_keywords",
    description: "Add positive keywords to an ad group.",
    inputSchema: {
      type: "object",
      properties: {
        adGroupId: { type: "string", description: "ID of the ad group" },
        keywords: {
          type: "array",
          description: "List of keywords to add",
          items: {
            type: "object",
            properties: {
              text: { type: "string", description: "Keyword text" },
              matchType: { type: "string", description: "EXACT, PHRASE, or BROAD" },
            },
            required: ["text", "matchType"],
          },
        },
      },
      required: ["adGroupId", "keywords"],
    },
  },
  {
    name: "add_negative_keywords",
    description: "Add negative keywords to an ad group (to exclude irrelevant searches).",
    inputSchema: {
      type: "object",
      properties: {
        adGroupId: { type: "string", description: "ID of the ad group" },
        keywords: {
          type: "array",
          description: "List of negative keywords to add",
          items: {
            type: "object",
            properties: {
              text: { type: "string", description: "Keyword text" },
              matchType: { type: "string", description: "EXACT, PHRASE, or BROAD" },
            },
            required: ["text", "matchType"],
          },
        },
      },
      required: ["adGroupId", "keywords"],
    },
  },
  {
    name: "create_responsive_search_ad",
    description: "Create a Responsive Search Ad in an ad group. Headlines max 15 (30 chars each), descriptions max 4 (90 chars each) — validated before calling the API.",
    inputSchema: {
      type: "object",
      properties: {
        adGroupId: { type: "string", description: "ID of the ad group" },
        headlines: { type: "array", items: { type: "string" }, description: "Ad headlines (max 15, 30 chars each)" },
        descriptions: { type: "array", items: { type: "string" }, description: "Ad descriptions (max 4, 90 chars each)" },
        finalUrl: { type: "string", description: "Landing page URL for the ad" },
      },
      required: ["adGroupId", "headlines", "descriptions", "finalUrl"],
    },
  },
  {
    name: "pause_campaign",
    description: "Pause an existing campaign (stops it from spending). Safe/conservative direction, symmetric to mutate_campaign_budget.",
    inputSchema: {
      type: "object",
      properties: {
        campaignId: { type: "string", description: "ID of the campaign to pause" },
      },
      required: ["campaignId"],
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
      const period = buildPeriod(args);
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
        ${period.where ? `WHERE ${period.where}` : ""}
      `;
      const results = await queryGoogleAds(query);

      const formatted = results.map(row => ({
        name: row.campaign.name,
        id: row.campaign.id,
        status: row.campaign.status,
        channel: row.campaign.advertisingChannelType,
        impressions: row.metrics?.impressions || 0,
        clicks: row.metrics?.clicks || 0,
        ...costFromMicros(row.metrics?.costMicros),
        conversions: row.metrics?.conversions || 0
      }));

      return {
        content: [{ type: "text", text: JSON.stringify({ period: period.label, campaigns: formatted }, null, 2) }],
      };
    }

    if (name === "get_keyword_report") {
      const period = buildPeriod(args);
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
        FROM keyword_view
        ${period.where ? `WHERE ${period.where}` : ""}
      `;
      const results = await queryGoogleAds(query);

      const formatted = results.map(row => ({
        adGroup: row.adGroup.name,
        keywordId: row.adGroupCriterion.criterionId,
        text: row.adGroupCriterion.keyword.text,
        matchType: row.adGroupCriterion.keyword.matchType,
        status: row.adGroupCriterion.status,
        impressions: row.metrics?.impressions || 0,
        clicks: row.metrics?.clicks || 0,
        ...costFromMicros(row.metrics?.costMicros)
      }));

      return {
        content: [{ type: "text", text: JSON.stringify({ period: period.label, keywords: formatted }, null, 2) }],
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
      const response = await fetch(`https://googleads.googleapis.com/${API_VERSION}/${budgetResourceName}:mutate`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          "developer-token": DEVELOPER_TOKEN,
          "Authorization": `Bearer ${accessToken}`,
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

    if (name === "create_search_campaign") {
      const { campaignName, dailyBudgetCLP } = args;

      // 1. Create the campaign budget first
      const budgetResults = await mutateGoogleAds("campaignBudgets", [
        {
          create: {
            name: `${campaignName} Budget`,
            amountMicros: Math.round(dailyBudgetCLP * 1000000).toString(),
            explicitlyShared: false,
          },
        },
      ]);
      const budgetResourceName = budgetResults[0].resourceName;

      // 2. Create the campaign itself. status is ALWAYS PAUSED — not exposed as an input.
      const campaignResults = await mutateGoogleAds("campaigns", [
        {
          create: {
            name: campaignName,
            advertisingChannelType: "SEARCH",
            status: "PAUSED",
            campaignBudget: budgetResourceName,
            maximizeConversions: {},
            networkSettings: {
              targetGoogleSearch: true,
              targetSearchNetwork: false,
              targetContentNetwork: false,
              targetPartnerSearchNetwork: false,
            },
          },
        },
      ]);
      const campaignResourceName = campaignResults[0].resourceName;
      const campaignId = resourceId(campaignResourceName);

      return {
        content: [{
          type: "text",
          text: `Campaign "${campaignName}" created with id ${campaignId} and daily budget ${dailyBudgetCLP.toLocaleString("es-CL", { style: "currency", currency: "CLP" })}.\nStatus: PAUSED — it will NOT spend until you enable it manually in the Google Ads UI.`,
        }],
      };
    }

    if (name === "create_ad_group") {
      const { campaignId, adGroupName, cpcBidCLP } = args;
      const create = {
        name: adGroupName,
        campaign: `customers/${CLIENT_CUSTOMER_ID}/campaigns/${campaignId}`,
        status: "ENABLED",
        type: "SEARCH_STANDARD",
      };
      if (cpcBidCLP) {
        create.cpcBidMicros = Math.round(cpcBidCLP * 1000000).toString();
      }

      const results = await mutateGoogleAds("adGroups", [{ create }]);
      const adGroupId = resourceId(results[0].resourceName);

      return {
        content: [{
          type: "text",
          text: `Ad group "${adGroupName}" created with id ${adGroupId} under campaign ${campaignId} (parent campaign is PAUSED, so this will not spend yet).`,
        }],
      };
    }

    if (name === "add_keywords" || name === "add_negative_keywords") {
      const { adGroupId, keywords } = args;
      const negative = name === "add_negative_keywords";

      const operations = keywords.map((kw) => ({
        create: {
          adGroup: `customers/${CLIENT_CUSTOMER_ID}/adGroups/${adGroupId}`,
          status: "ENABLED",
          negative,
          keyword: {
            text: kw.text,
            matchType: kw.matchType.toUpperCase(),
          },
        },
      }));

      const results = await mutateGoogleAds("adGroupCriteria", operations);

      return {
        content: [{
          type: "text",
          text: `Added ${results.length} ${negative ? "negative " : ""}keyword(s) to ad group ${adGroupId}.`,
        }],
      };
    }

    if (name === "create_responsive_search_ad") {
      const { adGroupId, headlines, descriptions, finalUrl } = args;

      if (headlines.length > 15) {
        throw new Error(`Too many headlines (${headlines.length}) — max 15.`);
      }
      const longHeadline = headlines.find((h) => h.length > 30);
      if (longHeadline) {
        throw new Error(`Headline exceeds 30 characters: "${longHeadline}" (${longHeadline.length} chars).`);
      }
      if (descriptions.length > 4) {
        throw new Error(`Too many descriptions (${descriptions.length}) — max 4.`);
      }
      const longDescription = descriptions.find((d) => d.length > 90);
      if (longDescription) {
        throw new Error(`Description exceeds 90 characters: "${longDescription}" (${longDescription.length} chars).`);
      }

      const results = await mutateGoogleAds("adGroupAds", [
        {
          create: {
            adGroup: `customers/${CLIENT_CUSTOMER_ID}/adGroups/${adGroupId}`,
            status: "ENABLED",
            ad: {
              finalUrls: [finalUrl],
              responsiveSearchAd: {
                headlines: headlines.map((text) => ({ text })),
                descriptions: descriptions.map((text) => ({ text })),
              },
            },
          },
        },
      ]);

      return {
        content: [{
          type: "text",
          text: `Responsive search ad created (id ${resourceId(results[0].resourceName)}) in ad group ${adGroupId} with ${headlines.length} headlines and ${descriptions.length} descriptions.`,
        }],
      };
    }

    if (name === "pause_campaign") {
      const { campaignId } = args;
      const results = await mutateGoogleAds("campaigns", [
        {
          update: {
            resourceName: `customers/${CLIENT_CUSTOMER_ID}/campaigns/${campaignId}`,
            status: "PAUSED",
          },
          updateMask: "status",
        },
      ]);

      return {
        content: [{ type: "text", text: `Campaign ${campaignId} paused. (Resource: ${results[0].resourceName})` }],
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

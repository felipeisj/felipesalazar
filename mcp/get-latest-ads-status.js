import fs from "fs";
import path from "path";
import { fileURLToPath } from "url";

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
  return data.access_token;
}

async function run() {
  try {
    const accessToken = await getAccessToken();

    // 1. Campaign summary
    const campaignQuery = `
      SELECT 
        campaign.name, 
        metrics.impressions, 
        metrics.clicks, 
        metrics.cost_micros, 
        metrics.conversions 
      FROM campaign
      WHERE campaign.name = 'CL_Search_FelipeServicios'
    `;
    const campResponse = await fetch(`https://googleads.googleapis.com/v21/customers/${CLIENT_CUSTOMER_ID}/googleAds:search`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "developer-token": DEVELOPER_TOKEN,
        "Authorization": `Bearer ${accessToken}`,
      },
      body: JSON.stringify({ query: campaignQuery }),
    });
    const campData = await campResponse.json();

    console.log("=== DESEMPEÑO TOTAL HASTA HOY ===");
    if (campData.results && campData.results.length > 0) {
      const row = campData.results[0];
      const cost = parseInt(row.metrics?.costMicros || 0) / 1000000;
      console.log(`Campaña: ${row.campaign.name}`);
      console.log(`Impresiones: ${row.metrics?.impressions || 0}`);
      console.log(`Clics: ${row.metrics?.clicks || 0}`);
      console.log(`Costo Total: ${cost.toLocaleString("es-CL", { style: "currency", currency: "CLP" })}`);
      console.log(`Conversiones Totales: ${row.metrics?.conversions || 0}`);
    }

    // 2. Search terms breakdown
    const searchTermsQuery = `
      SELECT 
        search_term_view.search_term,
        metrics.impressions,
        metrics.clicks,
        metrics.cost_micros,
        metrics.conversions
      FROM search_term_view
      WHERE metrics.clicks > 0
    `;
    const stResponse = await fetch(`https://googleads.googleapis.com/v21/customers/${CLIENT_CUSTOMER_ID}/googleAds:search`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "developer-token": DEVELOPER_TOKEN,
        "Authorization": `Bearer ${accessToken}`,
      },
      body: JSON.stringify({ query: searchTermsQuery }),
    });
    const stData = await stResponse.json();

    console.log("\n=== TÉRMINOS DE BÚSQUEDA QUE CONVIRTIERON O TUVIERON CLICS ===");
    if (stData.results && stData.results.length > 0) {
      stData.results.forEach((row) => {
        const cost = parseInt(row.metrics?.costMicros || 0) / 1000000;
        if (row.metrics?.clicks > 0) {
          console.log(`- "${row.searchTermView.searchTerm}": Impresiones: ${row.metrics?.impressions || 0} | Clics: ${row.metrics?.clicks || 0} | Costo: ${cost.toLocaleString("es-CL", { style: "currency", currency: "CLP" })} | Conversiones: ${row.metrics?.conversions || 0}`);
        }
      });
    }

  } catch (err) {
    console.error("Error:", err.message);
  }
}
run();

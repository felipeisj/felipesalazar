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

// Nuevos Ajustes
const TARGET_CUSTOMER_ID = "6200109421";   // La cuenta cliente nueva bajo el administrador
const MANAGER_CUSTOMER_ID = "1629756396";  // El administrador

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
    console.log(`🔄 Probando acceso a la cuenta cliente ${TARGET_CUSTOMER_ID} usando administrador ${MANAGER_CUSTOMER_ID}...`);
    const accessToken = await getAccessToken();
    const query = "SELECT campaign.id, campaign.name, campaign.status FROM campaign";
    
    const response = await fetch(`https://googleads.googleapis.com/v21/customers/${TARGET_CUSTOMER_ID}/googleAds:search`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "developer-token": DEVELOPER_TOKEN,
        "Authorization": `Bearer ${accessToken}`,
        "login-customer-id": MANAGER_CUSTOMER_ID, // Requerido para cuentas gestionadas por MCC
      },
      body: JSON.stringify({ query }),
    });
    
    const text = await response.text();
    console.log(text);
  } catch (err) {
    console.error("Error:", err.message);
  }
}
run();

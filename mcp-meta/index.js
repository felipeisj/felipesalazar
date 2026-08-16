import { Server } from "@modelcontextprotocol/sdk/server/index.js";
import { StdioServerTransport } from "@modelcontextprotocol/sdk/server/stdio.js";
import {
  CallToolRequestSchema,
  ListToolsRequestSchema,
} from "@modelcontextprotocol/sdk/types.js";
import fs from "fs";
import path from "path";
import { fileURLToPath } from "url";

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const envPath = path.join(__dirname, ".env");

let META_ACCESS_TOKEN = process.env.META_ACCESS_TOKEN || "";
let META_AD_ACCOUNT_ID = process.env.META_AD_ACCOUNT_ID || "";

if (fs.existsSync(envPath)) {
  const envContent = fs.readFileSync(envPath, "utf-8");
  envContent.split("\n").forEach((line) => {
    const match = line.match(/^\s*([\w.\-]+)\s*=\s*(.*)?\s*$/);
    if (match) {
      let value = match[2] || "";
      if (value.startsWith('"') && value.endsWith('"')) {
        value = value.slice(1, -1);
      }
      if (match[1] === "META_ACCESS_TOKEN") META_ACCESS_TOKEN = value;
      if (match[1] === "META_AD_ACCOUNT_ID") META_AD_ACCOUNT_ID = value;
    }
  });
}

// Clean Ad Account ID to format act_XXXXXXXXX
function formatAdAccountId(id) {
  if (!id) return "";
  return id.startsWith("act_") ? id : `act_${id}`;
}

const server = new Server(
  {
    name: "meta-ads-mcp",
    version: "1.0.0",
  },
  {
    capabilities: {
      tools: {},
    },
  }
);

server.setRequestHandler(ListToolsRequestSchema, async () => {
  return {
    tools: [
      {
        name: "meta_get_campaigns",
        description: "Obtiene las campañas activas o pausadas de tu cuenta de Meta Ads (Instagram / Facebook).",
        inputSchema: {
          type: "object",
          properties: {},
        },
      },
      {
        name: "meta_get_insights",
        description: "Obtiene métricas en vivo de rendimiento (Gasto, Impresiones, Clics, Alcance y Leads) de tu cuenta de Meta Ads.",
        inputSchema: {
          type: "object",
          properties: {
            date_preset: {
              type: "string",
              description: "Rango de fechas (ej: 'today', 'yesterday', 'last_7d', 'last_30d', 'maximum')",
            },
          },
        },
      },
      {
        name: "meta_get_leads",
        description: "Recupera los datos de contacto (leads) generados en tus formularios instantáneos de Instagram/Facebook.",
        inputSchema: {
          type: "object",
          properties: {
            form_id: {
              type: "string",
              description: "ID del formulario de clientes potenciales (opcional).",
            },
          },
        },
      },
      {
        name: "meta_create_campaign",
        description: "Crea una campaña nueva de Meta Ads. SEGURIDAD: nace SIEMPRE en status PAUSED, no es parametrizable — nunca empieza a gastar sola. Activarla es un paso manual en Meta Ads Manager.",
        inputSchema: {
          type: "object",
          properties: {
            name: { type: "string", description: "Nombre de la campaña" },
            objective: { type: "string", description: "Objetivo ODAX de Meta (ej: OUTCOME_LEADS, OUTCOME_TRAFFIC, OUTCOME_ENGAGEMENT). Default OUTCOME_LEADS." },
            special_ad_categories: { type: "array", items: { type: "string" }, description: "Categorías especiales de anuncio si aplica (ej: HOUSING). Default ninguna." },
          },
          required: ["name"],
        },
      },
      {
        name: "meta_create_ad_set",
        description: "Crea un ad set (conjunto de anuncios) bajo una campaña existente, con presupuesto diario y segmentación. SEGURIDAD: nace SIEMPRE en status PAUSED, aunque la campaña padre esté activa.",
        inputSchema: {
          type: "object",
          properties: {
            name: { type: "string", description: "Nombre del ad set" },
            campaign_id: { type: "string", description: "ID de la campaña padre" },
            daily_budget_clp: { type: "number", description: "Presupuesto diario en CLP (ej: 5000). CLP es moneda sin decimales en Meta, se envía tal cual, sin multiplicar por 100." },
            optimization_goal: { type: "string", description: "Meta ej: LEAD_GENERATION, LINK_CLICKS, REACH. Default LEAD_GENERATION." },
            billing_event: { type: "string", description: "Ej: IMPRESSIONS. Default IMPRESSIONS." },
            countries: { type: "array", items: { type: "string" }, description: "Códigos de país ISO para segmentar (default ['CL'])." },
            age_min: { type: "number", description: "Edad mínima (default 18)" },
            age_max: { type: "number", description: "Edad máxima (default 65)" },
          },
          required: ["name", "campaign_id", "daily_budget_clp"],
        },
      },
      {
        name: "meta_create_ad_creative",
        description: "Crea un creative (mensaje + imagen + link) reutilizable para armar un anuncio. No gasta plata por sí solo — solo existe cuando se usa en meta_create_ad.",
        inputSchema: {
          type: "object",
          properties: {
            name: { type: "string", description: "Nombre interno del creative" },
            page_id: { type: "string", description: "ID de la página de Facebook/Instagram conectada a la cuenta publicitaria" },
            message: { type: "string", description: "Texto principal del anuncio" },
            link: { type: "string", description: "URL de destino (landing page)" },
            picture_url: { type: "string", description: "URL pública de la imagen a usar (opcional)" },
            call_to_action_type: { type: "string", description: "Ej: LEARN_MORE, CONTACT_US, SIGN_UP. Default LEARN_MORE." },
          },
          required: ["name", "page_id", "message", "link"],
        },
      },
      {
        name: "meta_create_ad",
        description: "Crea un anuncio dentro de un ad set, usando un creative ya existente. SEGURIDAD: nace SIEMPRE en status PAUSED.",
        inputSchema: {
          type: "object",
          properties: {
            name: { type: "string", description: "Nombre del anuncio" },
            adset_id: { type: "string", description: "ID del ad set padre" },
            creative_id: { type: "string", description: "ID del creative (de meta_create_ad_creative)" },
          },
          required: ["name", "adset_id", "creative_id"],
        },
      },
      {
        name: "meta_pause_campaign",
        description: "Pausa una campaña existente (frena el gasto). Dirección segura/conservadora, simétrica a pause_campaign de Google Ads.",
        inputSchema: {
          type: "object",
          properties: {
            campaign_id: { type: "string", description: "ID de la campaña a pausar" },
          },
          required: ["campaign_id"],
        },
      },
      {
        name: "meta_update_adset_budget",
        description: "Actualiza el presupuesto diario (CLP) de un ad set existente.",
        inputSchema: {
          type: "object",
          properties: {
            adset_id: { type: "string", description: "ID del ad set a editar" },
            new_daily_budget_clp: { type: "number", description: "Nuevo presupuesto diario en CLP" },
          },
          required: ["adset_id", "new_daily_budget_clp"],
        },
      },
    ],
  };
});

// Generic POST helper for Graph API writes — nested objects are JSON-encoded per field,
// matching how the Graph API expects form-encoded params.
async function graphPost(path, params) {
  const body = new URLSearchParams();
  for (const [key, value] of Object.entries(params)) {
    if (value === undefined || value === null) continue;
    body.append(key, typeof value === "string" ? value : JSON.stringify(value));
  }
  body.append("access_token", META_ACCESS_TOKEN);

  const res = await fetch(`https://graph.facebook.com/v20.0/${path}`, {
    method: "POST",
    body,
  });
  const data = await res.json();
  if (data.error) {
    throw new Error(data.error.message);
  }
  return data;
}

server.setRequestHandler(CallToolRequestSchema, async (request) => {
  const { name, arguments: args } = request.params;
  const accountId = formatAdAccountId(META_AD_ACCOUNT_ID);

  if (!META_ACCESS_TOKEN || !accountId) {
    return {
      content: [
        {
          type: "text",
          text: "⚠️ Falta configurar META_ACCESS_TOKEN o META_AD_ACCOUNT_ID en el archivo mcp-meta/.env",
        },
      ],
      isError: true,
    };
  }

  try {
    if (name === "meta_get_campaigns") {
      const url = `https://graph.facebook.com/v20.0/${accountId}/campaigns?fields=id,name,status,objective,daily_budget,lifetime_budget&access_token=${META_ACCESS_TOKEN}`;
      const res = await fetch(url);
      const data = await res.json();

      if (data.error) {
        throw new Error(data.error.message);
      }

      return {
        content: [
          {
            type: "text",
            text: JSON.stringify(data.data || [], null, 2),
          },
        ],
      };
    }

    if (name === "meta_get_insights") {
      const preset = args?.date_preset || "last_7d";
      const url = `https://graph.facebook.com/v20.0/${accountId}/insights?fields=spend,impressions,clicks,reach,cpc,cpm,actions&date_preset=${preset}&access_token=${META_ACCESS_TOKEN}`;
      const res = await fetch(url);
      const data = await res.json();

      if (data.error) {
        throw new Error(data.error.message);
      }

      return {
        content: [
          {
            type: "text",
            text: JSON.stringify(data.data || [], null, 2),
          },
        ],
      };
    }

    if (name === "meta_get_leads") {
      const formId = args?.form_id;
      let url = "";
      if (formId) {
        url = `https://graph.facebook.com/v20.0/${formId}/leads?access_token=${META_ACCESS_TOKEN}`;
      } else {
        url = `https://graph.facebook.com/v20.0/${accountId}/leads?access_token=${META_ACCESS_TOKEN}`;
      }
      const res = await fetch(url);
      const data = await res.json();

      if (data.error) {
        throw new Error(data.error.message);
      }

      return {
        content: [
          {
            type: "text",
            text: JSON.stringify(data.data || [], null, 2),
          },
        ],
      };
    }

    if (name === "meta_create_campaign") {
      const { name: campaignName, objective, special_ad_categories } = args;
      const resolvedObjective = objective || "OUTCOME_LEADS";

      const data = await graphPost(`${accountId}/campaigns`, {
        name: campaignName,
        objective: resolvedObjective,
        status: "PAUSED", // SEGURIDAD: no es parametrizable, nunca nace activa
        special_ad_categories: special_ad_categories || [],
      });

      return {
        content: [{
          type: "text",
          text: `Campaña "${campaignName}" creada (id ${data.id}, objetivo ${resolvedObjective}).\nEstado: PAUSED — no va a gastar hasta que la actives manualmente en Meta Ads Manager.`,
        }],
      };
    }

    if (name === "meta_create_ad_set") {
      const {
        name: adSetName,
        campaign_id,
        daily_budget_clp,
        optimization_goal,
        billing_event,
        countries,
        age_min,
        age_max,
      } = args;

      const data = await graphPost(`${accountId}/adsets`, {
        name: adSetName,
        campaign_id,
        daily_budget: Math.round(daily_budget_clp),
        billing_event: billing_event || "IMPRESSIONS",
        optimization_goal: optimization_goal || "LEAD_GENERATION",
        bid_strategy: "LOWEST_COST_WITHOUT_CAP",
        targeting: {
          geo_locations: { countries: countries || ["CL"] },
          age_min: age_min || 18,
          age_max: age_max || 65,
        },
        status: "PAUSED", // SEGURIDAD: nace pausado aunque la campaña padre esté activa
      });

      return {
        content: [{
          type: "text",
          text: `Ad set "${adSetName}" creado (id ${data.id}) bajo campaña ${campaign_id}, presupuesto diario $${daily_budget_clp.toLocaleString("es-CL")} CLP.\nEstado: PAUSED.`,
        }],
      };
    }

    if (name === "meta_create_ad_creative") {
      const { name: creativeName, page_id, message, link, picture_url, call_to_action_type } = args;

      const linkData = {
        message,
        link,
        call_to_action: { type: call_to_action_type || "LEARN_MORE", value: { link } },
      };
      if (picture_url) linkData.picture = picture_url;

      const data = await graphPost(`${accountId}/adcreatives`, {
        name: creativeName,
        object_story_spec: { page_id, link_data: linkData },
      });

      return {
        content: [{ type: "text", text: `Creative "${creativeName}" creado (id ${data.id}).` }],
      };
    }

    if (name === "meta_create_ad") {
      const { name: adName, adset_id, creative_id } = args;

      const data = await graphPost(`${accountId}/ads`, {
        name: adName,
        adset_id,
        creative: { creative_id },
        status: "PAUSED", // SEGURIDAD: no es parametrizable, nunca nace activo
      });

      return {
        content: [{
          type: "text",
          text: `Anuncio "${adName}" creado (id ${data.id}) en ad set ${adset_id}.\nEstado: PAUSED — revisalo y activalo manualmente en Meta Ads Manager cuando esté listo.`,
        }],
      };
    }

    if (name === "meta_pause_campaign") {
      const { campaign_id } = args;
      await graphPost(`${campaign_id}`, { status: "PAUSED" });

      return {
        content: [{ type: "text", text: `Campaña ${campaign_id} pausada.` }],
      };
    }

    if (name === "meta_update_adset_budget") {
      const { adset_id, new_daily_budget_clp } = args;
      await graphPost(`${adset_id}`, { daily_budget: Math.round(new_daily_budget_clp) });

      return {
        content: [{ type: "text", text: `Presupuesto diario del ad set ${adset_id} actualizado a $${new_daily_budget_clp.toLocaleString("es-CL")} CLP.` }],
      };
    }

    throw new Error(`Herramienta no encontrada: ${name}`);
  } catch (err) {
    return {
      content: [
        {
          type: "text",
          text: `❌ Error de Meta Marketing API: ${err.message}`,
        },
      ],
      isError: true,
    };
  }
});

async function main() {
  const transport = new StdioServerTransport();
  await server.connect(transport);
}

main().catch((err) => {
  console.error("Error fatal en Meta Ads MCP server:", err);
  process.exit(1);
});

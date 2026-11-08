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

// v20.0 expiró y Meta ya la servía como v25.0 (header facebook-api-version);
// se fija explícita para que un auto-upgrade no cambie el comportamiento sin aviso.
const GRAPH_VERSION = "v25.0";
const GRAPH = `https://graph.facebook.com/${GRAPH_VERSION}`;

const ENV_KEYS = [
  "META_ACCESS_TOKEN",
  "META_AD_ACCOUNT_ID",
  "META_BUSINESS_ID",
  "META_APP_ID",
  "META_APP_SECRET",
  "WA_TEST_PHONE_NUMBER_ID",
];
const cfg = Object.fromEntries(ENV_KEYS.map((k) => [k, process.env[k] || ""]));

if (fs.existsSync(envPath)) {
  const envContent = fs.readFileSync(envPath, "utf-8");
  envContent.split("\n").forEach((line) => {
    const match = line.match(/^\s*([\w.\-]+)\s*=\s*(.*)?\s*$/);
    if (match) {
      let value = (match[2] || "").trim();
      if (value.startsWith('"') && value.endsWith('"')) {
        value = value.slice(1, -1);
      }
      if (ENV_KEYS.includes(match[1])) cfg[match[1]] = value;
    }
  });
}

const META_ACCESS_TOKEN = cfg.META_ACCESS_TOKEN;
// Negocio dueño de la app y del system user (Freelance felipe salazar).
const META_BUSINESS_ID = cfg.META_BUSINESS_ID || "1363720281759908";
// App "MPF Rental" — la app de WhatsApp/Embedded Signup de crm-leads.
const META_APP_ID = cfg.META_APP_ID || "1357627829882329";
const META_APP_SECRET = cfg.META_APP_SECRET;
// Único número al que wa_send_test_message puede enviar (Test WABA, +1 555-670-0751).
const WA_TEST_PHONE_NUMBER_ID = cfg.WA_TEST_PHONE_NUMBER_ID || "1229761910231504";

// Clean Ad Account ID to format act_XXXXXXXXX
function formatAdAccountId(id) {
  if (!id) return "";
  return id.startsWith("act_") ? id : `act_${id}`;
}

// ---------------------------------------------------------------------------
// WhatsApp Business Platform (Cloud API + Business Management API)
//
// El token es de un system user ADMIN del negocio: alcanza las WABAs propias
// (owned) y las de clientes conectadas por Embedded Signup (client). Toda tool
// de escritura recibe el waba_id / phone_number_id explícito — no hay default,
// para que nunca se toque la WABA de un tenant por accidente.
// ---------------------------------------------------------------------------
// Sin cuenta publicitaria por defecto (antes quedaba fija en la de Vilugron vía
// META_AD_ACCOUNT_ID): cada tool de anuncios recibe la cuenta del cliente explícita.
const AD_ACCOUNT = { type: "string", description: "ID de la cuenta publicitaria, con o sin prefijo act_ (ver meta_list_ad_accounts)" };
const AD_ACCOUNT_TOOLS = new Set([
  "meta_get_campaigns",
  "meta_get_insights",
  "meta_create_campaign",
  "meta_create_ad_set",
  "meta_create_ad_creative",
  "meta_create_ad",
]);

const WABA_ID = { type: "string", description: "ID de la WhatsApp Business Account (ver wa_list_wabas)" };
const PHONE_ID = { type: "string", description: "phone_number_id del número (ver wa_list_phone_numbers)" };

const WA_TOOLS = [
  {
    name: "wa_list_wabas",
    description: "Lista las cuentas de WhatsApp Business (WABAs) a las que llega el token: las propias del negocio (owned) y las de clientes conectadas por Embedded Signup (client), con sus números. Solo lectura.",
    inputSchema: {
      type: "object",
      properties: {
        include_numbers: { type: "boolean", description: "Incluir los números de cada WABA (default true)" },
      },
    },
  },
  {
    name: "wa_list_phone_numbers",
    description: "Números de una WABA con estado (CONNECTED/PENDING), calidad, verificación, plataforma (CLOUD_API o NOT_APPLICABLE = no registrado), límite de mensajería y throughput. Solo lectura.",
    inputSchema: { type: "object", properties: { waba_id: WABA_ID }, required: ["waba_id"] },
  },
  {
    name: "wa_list_templates",
    description: "Plantillas de mensaje de una WABA (nombre, estado de revisión, categoría, idioma, componentes). Solo lectura.",
    inputSchema: {
      type: "object",
      properties: {
        waba_id: WABA_ID,
        status: { type: "string", description: "Filtrar por estado: APPROVED, PENDING, REJECTED, PAUSED, DISABLED (opcional)" },
        name: { type: "string", description: "Filtrar por nombre de plantilla (opcional)" },
      },
      required: ["waba_id"],
    },
  },
  {
    name: "wa_get_subscribed_apps",
    description: "Apps suscritas a los webhooks de una WABA (si la app de crm-leads no aparece, esa WABA no le manda mensajes entrantes). Solo lectura.",
    inputSchema: { type: "object", properties: { waba_id: WABA_ID }, required: ["waba_id"] },
  },
  {
    name: "wa_get_business_profile",
    description: "Perfil de empresa de WhatsApp de un número (descripción, dirección, email, sitios, rubro, foto). Solo lectura.",
    inputSchema: { type: "object", properties: { phone_number_id: PHONE_ID }, required: ["phone_number_id"] },
  },
  {
    name: "wa_get_costs",
    description: "Costo de Meta por cuenta de WhatsApp (pricing_analytics): mensajes entregados y costo por mes/día, separado por categoría (MARKETING, UTILITY, AUTHENTICATION, SERVICE) y tipo (REGULAR, FREE_CUSTOMER_SERVICE, FREE_ENTRY_POINT). Sin waba_id recorre todas las WABAs. Moneda = la de cada WABA. Solo lectura.",
    inputSchema: {
      type: "object",
      properties: {
        waba_id: { type: "string", description: "ID de la WABA (opcional; sin él, todas)" },
        since: { type: "string", description: "Fecha inicio YYYY-MM-DD (default: hace 90 días)" },
        until: { type: "string", description: "Fecha fin YYYY-MM-DD (default: hoy)" },
        granularity: { type: "string", enum: ["MONTHLY", "DAILY"], description: "Default MONTHLY" },
      },
    },
  },
  {
    name: "wa_get_app_webhooks",
    description: "Configuración de webhooks a nivel de app (callback URL y campos suscritos por objeto). Requiere META_APP_SECRET en mcp-meta/.env. Solo lectura.",
    inputSchema: { type: "object", properties: {} },
  },
  {
    name: "wa_create_template",
    description: "ESCRITURA. Crea una plantilla de mensaje en una WABA. Nace en revisión de Meta (PENDING); no envía nada. La categoría la puede reclasificar Meta (UTILITY→MARKETING cambia el costo). Confirmar con el usuario antes de ejecutar.",
    inputSchema: {
      type: "object",
      properties: {
        waba_id: WABA_ID,
        name: { type: "string", description: "Nombre en snake_case minúsculas (ej: aviso_cotizacion_vendedor)" },
        category: { type: "string", enum: ["UTILITY", "MARKETING", "AUTHENTICATION"], description: "Categoría de la plantilla" },
        language: { type: "string", description: "Código de idioma (ej: es, es_CL, en_US). Default es" },
        components: {
          type: "array",
          items: { type: "object" },
          description: "Componentes según la API de Meta. Ej: [{\"type\":\"BODY\",\"text\":\"Hola {{1}}\",\"example\":{\"body_text\":[[\"Juan\"]]}}]",
        },
      },
      required: ["waba_id", "name", "category", "components"],
    },
  },
  {
    name: "wa_delete_template",
    description: "ESCRITURA IRREVERSIBLE. Borra una plantilla de una WABA (todas sus traducciones, o solo una si se pasa template_id). El nombre queda bloqueado 4 semanas. Si el bot la usa (ej: aviso_cotizacion_vendedor) deja de poder enviarla. Confirmar con el usuario antes de ejecutar.",
    inputSchema: {
      type: "object",
      properties: {
        waba_id: WABA_ID,
        name: { type: "string", description: "Nombre de la plantilla" },
        template_id: { type: "string", description: "ID de una traducción puntual (opcional; sin él borra todas)" },
      },
      required: ["waba_id", "name"],
    },
  },
  {
    name: "wa_subscribe_app",
    description: "ESCRITURA. Suscribe la app del token (MPF Rental) a los webhooks de una WABA. Opcional: override_callback_uri para mandar los eventos de ESA WABA a otra URL (útil por tenant). Confirmar con el usuario antes de ejecutar.",
    inputSchema: {
      type: "object",
      properties: {
        waba_id: WABA_ID,
        override_callback_uri: { type: "string", description: "URL alternativa de webhook solo para esta WABA (opcional)" },
        verify_token: { type: "string", description: "Verify token del override (obligatorio si se usa override_callback_uri)" },
      },
      required: ["waba_id"],
    },
  },
  {
    name: "wa_request_verification_code",
    description: "ESCRITURA. Pide a Meta que envíe un código de verificación (SMS o llamada) al número, para verificarlo antes de registrarlo. Le llega al teléfono real del dueño. Confirmar con el usuario antes de ejecutar.",
    inputSchema: {
      type: "object",
      properties: {
        phone_number_id: PHONE_ID,
        code_method: { type: "string", enum: ["SMS", "VOICE"], description: "Default SMS" },
        language: { type: "string", description: "Idioma del mensaje (default es)" },
      },
      required: ["phone_number_id"],
    },
  },
  {
    name: "wa_verify_code",
    description: "ESCRITURA. Confirma el código de verificación recibido por SMS/llamada (paso previo a wa_register_phone).",
    inputSchema: {
      type: "object",
      properties: { phone_number_id: PHONE_ID, code: { type: "string", description: "Código recibido (6 dígitos)" } },
      required: ["phone_number_id", "code"],
    },
  },
  {
    name: "wa_register_phone",
    description: "ESCRITURA. Registra un número en la Cloud API con un PIN de verificación en dos pasos (6 dígitos). Si el número ya tenía PIN, hay que usar ese mismo. NO usar en números coexistence (app WhatsApp Business + API). Confirmar con el usuario antes de ejecutar.",
    inputSchema: {
      type: "object",
      properties: { phone_number_id: PHONE_ID, pin: { type: "string", description: "PIN de 6 dígitos" } },
      required: ["phone_number_id", "pin"],
    },
  },
  {
    name: "wa_send_test_message",
    description: "ESCRITURA. Envía un mensaje SOLO desde el número de prueba (WA_TEST_PHONE_NUMBER_ID, Test WABA) — está fijo en código, no se puede usar con números reales de clientes. Por defecto manda la plantilla hello_world. El destinatario debe estar en la lista de números permitidos del número de prueba.",
    inputSchema: {
      type: "object",
      properties: {
        to: { type: "string", description: "Número destino en formato internacional sin + (ej: 56912345678)" },
        template_name: { type: "string", description: "Plantilla a enviar (default hello_world)" },
        language: { type: "string", description: "Idioma de la plantilla (default en_US)" },
        text: { type: "string", description: "Si se pasa, manda texto libre en vez de plantilla (solo funciona dentro de la ventana de 24 h)" },
      },
      required: ["to"],
    },
  },
  {
    name: "wa_set_app_webhook",
    description: "ESCRITURA DE ALTO RIESGO. Cambia la callback URL y campos del webhook de WhatsApp de TODA la app: afecta a todos los tenants y al bot en producción. Meta valida la URL con un GET al verify_token antes de aceptarla. Requiere META_APP_SECRET. Confirmar con el usuario mostrando la config actual (wa_get_app_webhooks) antes de ejecutar.",
    inputSchema: {
      type: "object",
      properties: {
        callback_url: { type: "string", description: "URL HTTPS del webhook (ej: https://<crm>/api/webhooks/whatsapp)" },
        verify_token: { type: "string", description: "Verify token que espera el endpoint" },
        fields: { type: "array", items: { type: "string" }, description: "Campos a suscribir (default [\"messages\"])" },
      },
      required: ["callback_url", "verify_token"],
    },
  },
];

class GraphError extends Error {}

// Request genérico a la Graph API con token en header (no en la URL) y body JSON.
async function graphRequest(method, path, { query, body, token } = {}) {
  const url = new URL(`${GRAPH}/${path}`);
  for (const [k, v] of Object.entries(query || {})) {
    if (v !== undefined && v !== null && v !== "") url.searchParams.set(k, String(v));
  }
  const headers = { Authorization: `Bearer ${token || META_ACCESS_TOKEN}` };
  if (body) headers["Content-Type"] = "application/json";
  const res = await fetch(url, { method, headers, body: body ? JSON.stringify(body) : undefined });
  const data = await res.json().catch(() => ({}));
  if (!res.ok || data.error) {
    const e = data.error || {};
    const detail = [e.error_user_title, e.error_user_msg].filter(Boolean).join(" — ");
    throw new GraphError(
      `${e.message || `HTTP ${res.status}`} (code ${e.code ?? "?"}${e.error_subcode ? `/${e.error_subcode}` : ""})${detail ? ` · ${detail}` : ""}`
    );
  }
  return data;
}

function appToken() {
  if (!META_APP_SECRET) {
    throw new GraphError("Falta META_APP_SECRET en mcp-meta/.env (App settings → Basic → App secret en developers.facebook.com).");
  }
  return `${META_APP_ID}|${META_APP_SECRET}`;
}

const isId = (v) => typeof v === "string" && /^\d{5,25}$/.test(v);
function requireId(value, label) {
  if (!isId(value)) throw new GraphError(`${label} inválido: se espera un ID numérico de Meta.`);
  return value;
}

const PHONE_FIELDS = [
  "display_phone_number",
  "verified_name",
  "status",
  "quality_rating",
  "code_verification_status",
  "name_status",
  "platform_type",
  "throughput",
  "whatsapp_business_manager_messaging_limit",
  "is_on_biz_app",
].join(",");

async function listWabas() {
  const [owned, client] = await Promise.all(
    ["owned", "client"].map((kind) =>
      graphRequest("GET", `${META_BUSINESS_ID}/${kind}_whatsapp_business_accounts`, {
        query: { fields: "id,name,currency,timezone_id,account_review_status", limit: 100 },
      })
    )
  );
  return [
    ...(owned.data || []).map((w) => ({ ...w, ownership: "owned (tu negocio)" })),
    ...(client.data || []).map((w) => ({ ...w, ownership: "client (Embedded Signup)" })),
  ];
}

// Token de página (derivado del system user) para endpoints de Lead Ads. Se
// cachea en memoria y nunca se devuelve en la respuesta de una tool.
const pageTokens = new Map();
async function pageToken(pageId) {
  requireId(pageId, "page_id");
  if (!pageTokens.has(pageId)) {
    const r = await graphRequest("GET", pageId, { query: { fields: "access_token" } });
    if (!r.access_token) throw new GraphError(`El token no tiene acceso de página a ${pageId} (asignar la página al system user en Business Settings).`);
    pageTokens.set(pageId, r.access_token);
  }
  return pageTokens.get(pageId);
}

const json = (data) => ({ content: [{ type: "text", text: JSON.stringify(data, null, 2) }] });
const text = (t) => ({ content: [{ type: "text", text: t }] });

async function handleWhatsappTool(name, args = {}) {
  switch (name) {
    case "wa_list_wabas": {
      const includeNumbers = args.include_numbers !== false;
      const wabas = await listWabas();
      if (includeNumbers) {
        await Promise.all(
          wabas.map(async (w) => {
            try {
              const r = await graphRequest("GET", `${w.id}/phone_numbers`, { query: { fields: PHONE_FIELDS } });
              w.phone_numbers = r.data || [];
            } catch (err) {
              w.phone_numbers_error = err.message;
            }
          })
        );
      }
      return json({ business_id: META_BUSINESS_ID, wabas });
    }

    case "wa_list_phone_numbers": {
      const r = await graphRequest("GET", `${requireId(args.waba_id, "waba_id")}/phone_numbers`, {
        query: { fields: PHONE_FIELDS },
      });
      return json(r.data || []);
    }

    case "wa_list_templates": {
      const r = await graphRequest("GET", `${requireId(args.waba_id, "waba_id")}/message_templates`, {
        query: { fields: "id,name,status,category,language,components,rejected_reason", status: args.status, name: args.name, limit: 200 },
      });
      return json({ total: (r.data || []).length, templates: r.data || [] });
    }

    case "wa_get_subscribed_apps": {
      const r = await graphRequest("GET", `${requireId(args.waba_id, "waba_id")}/subscribed_apps`);
      return json(r.data || []);
    }

    case "wa_get_business_profile": {
      const r = await graphRequest("GET", `${requireId(args.phone_number_id, "phone_number_id")}/whatsapp_business_profile`, {
        query: { fields: "about,address,description,email,profile_picture_url,websites,vertical" },
      });
      return json(r.data || r);
    }

    case "wa_get_costs": {
      const toUnix = (d, fallback) => {
        if (!d) return fallback;
        if (!/^\d{4}-\d{2}-\d{2}$/.test(d)) throw new GraphError(`Fecha inválida "${d}": usar YYYY-MM-DD.`);
        return Math.floor(new Date(`${d}T04:00:00Z`).getTime() / 1000);
      };
      const now = Math.floor(Date.now() / 1000);
      const start = toUnix(args.since, now - 90 * 86400);
      const end = Math.min(toUnix(args.until, now), now);
      if (start >= end) throw new GraphError("since debe ser anterior a until.");
      const granularity = args.granularity === "DAILY" ? "DAILY" : "MONTHLY";
      const day = (s) => new Intl.DateTimeFormat("sv-SE", { timeZone: "America/Santiago" }).format(new Date(s * 1000));

      const targets = args.waba_id
        ? [{ id: requireId(args.waba_id, "waba_id") }]
        : (await listWabas()).map((w) => ({ id: w.id, ownership: w.ownership }));
      const field = `pricing_analytics.start(${start}).end(${end}).granularity(${granularity}).dimensions(["PRICING_CATEGORY","PRICING_TYPE"])`;

      const cuentas = await Promise.all(
        targets.map(async (t) => {
          try {
            const r = await graphRequest("GET", t.id, { query: { fields: `name,currency,${field}` } });
            const points = r.pricing_analytics?.data?.[0]?.data_points || [];
            const porCategoria = {};
            const periodos = {};
            let total = 0;
            for (const p of points) {
              const cost = p.cost || 0;
              total += cost;
              const cat = `${p.pricing_category}/${p.pricing_type}`;
              porCategoria[cat] ??= { mensajes: 0, costo: 0 };
              porCategoria[cat].mensajes += p.volume || 0;
              porCategoria[cat].costo += cost;
              const per = day(p.start);
              periodos[per] ??= { mensajes: 0, costo: 0 };
              periodos[per].mensajes += p.volume || 0;
              periodos[per].costo += cost;
            }
            // El promedio por mensaje solo tiene sentido dentro de una categoría/tipo:
            // en un período se mezclan mensajes gratis y pagados.
            const round = (o, withAvg) =>
              Object.fromEntries(
                Object.entries(o).map(([k, v]) => [
                  k,
                  {
                    mensajes: v.mensajes,
                    costo: Math.round(v.costo * 100) / 100,
                    ...(withAvg && v.mensajes && v.costo ? { costo_por_mensaje: Math.round((v.costo / v.mensajes) * 100) / 100 } : {}),
                  },
                ])
              );
            return {
              waba_id: t.id,
              nombre: r.name,
              ownership: t.ownership,
              moneda: r.currency || "(sin moneda: no factura o es de prueba)",
              costo_total: Math.round(total * 100) / 100,
              por_categoria: round(porCategoria, true),
              por_periodo: round(periodos, false),
            };
          } catch (err) {
            return { waba_id: t.id, error: err.message };
          }
        })
      );
      return json({ rango: `${day(start)} → ${day(end)}`, granularidad: granularity, cuentas });
    }

    case "wa_get_app_webhooks": {
      const r = await graphRequest("GET", `${META_APP_ID}/subscriptions`, { token: appToken() });
      return json(r.data || []);
    }

    case "wa_create_template": {
      const { name: tplName, category, components } = args;
      if (!/^[a-z0-9_]{1,512}$/.test(tplName || "")) {
        throw new GraphError("name debe ser snake_case en minúsculas (a-z, 0-9, _).");
      }
      if (!Array.isArray(components) || components.length === 0) {
        throw new GraphError("components debe ser un arreglo no vacío.");
      }
      const r = await graphRequest("POST", `${requireId(args.waba_id, "waba_id")}/message_templates`, {
        body: { name: tplName, category, language: args.language || "es", components },
      });
      return text(`Plantilla "${tplName}" creada (id ${r.id}). Estado: ${r.status || "PENDING"} · categoría asignada: ${r.category || category}.\nMeta la revisa antes de que se pueda enviar; consultá el estado con wa_list_templates.`);
    }

    case "wa_delete_template": {
      await graphRequest("DELETE", `${requireId(args.waba_id, "waba_id")}/message_templates`, {
        query: { name: args.name, hsm_id: args.template_id },
      });
      return text(`Plantilla "${args.name}"${args.template_id ? ` (traducción ${args.template_id})` : " (todas sus traducciones)"} borrada de la WABA ${args.waba_id}.`);
    }

    case "wa_subscribe_app": {
      const { override_callback_uri, verify_token } = args;
      if (override_callback_uri && !verify_token) {
        throw new GraphError("override_callback_uri requiere verify_token.");
      }
      const r = await graphRequest("POST", `${requireId(args.waba_id, "waba_id")}/subscribed_apps`, {
        body: override_callback_uri ? { override_callback_uri, verify_token } : undefined,
      });
      return text(`App suscrita a los webhooks de la WABA ${args.waba_id} (success: ${r.success}).${override_callback_uri ? ` Callback override: ${override_callback_uri}` : ""}`);
    }

    case "wa_request_verification_code": {
      await graphRequest("POST", `${requireId(args.phone_number_id, "phone_number_id")}/request_code`, {
        body: { code_method: args.code_method || "SMS", language: args.language || "es" },
      });
      return text(`Código de verificación solicitado por ${args.code_method || "SMS"} para el número ${args.phone_number_id}. Cuando llegue, confirmalo con wa_verify_code.`);
    }

    case "wa_verify_code": {
      await graphRequest("POST", `${requireId(args.phone_number_id, "phone_number_id")}/verify_code`, {
        body: { code: String(args.code) },
      });
      return text(`Número ${args.phone_number_id} verificado. Siguiente paso: wa_register_phone con un PIN de 6 dígitos.`);
    }

    case "wa_register_phone": {
      if (!/^\d{6}$/.test(String(args.pin || ""))) throw new GraphError("pin debe tener exactamente 6 dígitos.");
      await graphRequest("POST", `${requireId(args.phone_number_id, "phone_number_id")}/register`, {
        body: { messaging_product: "whatsapp", pin: String(args.pin) },
      });
      const info = await graphRequest("GET", args.phone_number_id, { query: { fields: PHONE_FIELDS } }).catch(() => null);
      return text(`Número ${args.phone_number_id} registrado en la Cloud API.${info ? `\nEstado actual: ${info.status} · plataforma ${info.platform_type} · ${info.display_phone_number}` : ""}\nGuardá el PIN: Meta lo pide para volver a registrar o migrar el número.`);
    }

    case "wa_send_test_message": {
      // SEGURIDAD: el emisor está fijo en el número de prueba; no es parametrizable.
      const to = String(args.to || "").replace(/[^\d]/g, "");
      if (!/^\d{8,15}$/.test(to)) throw new GraphError("to debe ser un número internacional sin + (8 a 15 dígitos).");
      const body = args.text
        ? { messaging_product: "whatsapp", to, type: "text", text: { body: args.text } }
        : {
            messaging_product: "whatsapp",
            to,
            type: "template",
            template: { name: args.template_name || "hello_world", language: { code: args.language || "en_US" } },
          };
      const r = await graphRequest("POST", `${WA_TEST_PHONE_NUMBER_ID}/messages`, { body });
      return text(`Mensaje enviado desde el número de prueba ${WA_TEST_PHONE_NUMBER_ID} a ${to} (message id ${r.messages?.[0]?.id ?? "?"}).`);
    }

    case "wa_set_app_webhook": {
      const { callback_url, verify_token } = args;
      if (!/^https:\/\//.test(callback_url || "")) throw new GraphError("callback_url debe ser HTTPS.");
      const r = await graphRequest("POST", `${META_APP_ID}/subscriptions`, {
        token: appToken(),
        body: {
          object: "whatsapp_business_account",
          callback_url,
          verify_token,
          fields: (args.fields && args.fields.length ? args.fields : ["messages"]).join(","),
          include_values: true,
        },
      });
      return text(`Webhook de WhatsApp de la app ${META_APP_ID} actualizado → ${callback_url} (success: ${r.success}).`);
    }

    default:
      return null;
  }
}

const server = new Server(
  {
    name: "meta-ads-mcp",
    version: "1.1.0",
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
        description: "Obtiene las campañas (activas o pausadas) de una cuenta publicitaria de Meta Ads. Solo lectura.",
        inputSchema: {
          type: "object",
          properties: { ad_account_id: AD_ACCOUNT },
          required: ["ad_account_id"],
        },
      },
      {
        name: "meta_get_insights",
        description: "Métricas en vivo (gasto, impresiones, clics, alcance, CPC, CPM, acciones/leads) de una cuenta publicitaria, total o desglosado por campaña. Solo lectura.",
        inputSchema: {
          type: "object",
          properties: {
            ad_account_id: AD_ACCOUNT,
            date_preset: {
              type: "string",
              description: "Rango de fechas (ej: 'today', 'yesterday', 'last_7d', 'last_30d', 'last_90d', 'this_month', 'last_month', 'maximum'). Default last_7d",
            },
            level: { type: "string", enum: ["account", "campaign"], description: "Total de la cuenta o una fila por campaña (default account)" },
          },
          required: ["ad_account_id"],
        },
      },
      {
        name: "meta_list_ad_accounts",
        description: "Lista las cuentas publicitarias a las que llega el token (id, nombre, moneda, estado, negocio dueño). Usar antes de cualquier tool de anuncios para elegir la cuenta del cliente. Solo lectura.",
        inputSchema: { type: "object", properties: {} },
      },
      {
        name: "meta_list_pages",
        description: "Lista las páginas de Facebook a las que llega el token y qué puede hacer en cada una (tasks). Solo lectura.",
        inputSchema: { type: "object", properties: {} },
      },
      {
        name: "meta_list_lead_forms",
        description: "Lista los formularios instantáneos (Lead Ads) de una página, con estado y cantidad de leads. Solo lectura.",
        inputSchema: {
          type: "object",
          properties: { page_id: { type: "string", description: "ID de la página (ver meta_list_pages)" } },
          required: ["page_id"],
        },
      },
      {
        name: "meta_get_leads",
        description: "Leads (datos de contacto) de un formulario instantáneo de Instagram/Facebook. Requiere el permiso leads_retrieval en el token y acceso a leads de la página (Business Settings → Integraciones → Acceso a clientes potenciales). Contiene datos personales: no copiarlos fuera del CRM del cliente. Solo lectura.",
        inputSchema: {
          type: "object",
          properties: {
            page_id: { type: "string", description: "ID de la página dueña del formulario" },
            form_id: { type: "string", description: "ID del formulario (ver meta_list_lead_forms)" },
            limit: { type: "number", description: "Máximo de leads a traer (default 50)" },
          },
          required: ["page_id", "form_id"],
        },
      },
      {
        name: "meta_create_campaign",
        description: "Crea una campaña nueva de Meta Ads. SEGURIDAD: nace SIEMPRE en status PAUSED, no es parametrizable — nunca empieza a gastar sola. Activarla es un paso manual en Meta Ads Manager.",
        inputSchema: {
          type: "object",
          properties: {
            ad_account_id: AD_ACCOUNT,
            name: { type: "string", description: "Nombre de la campaña" },
            objective: { type: "string", description: "Objetivo ODAX de Meta (ej: OUTCOME_LEADS, OUTCOME_TRAFFIC, OUTCOME_ENGAGEMENT). Default OUTCOME_LEADS." },
            special_ad_categories: { type: "array", items: { type: "string" }, description: "Categorías especiales de anuncio si aplica (ej: HOUSING). Default ninguna." },
          },
          required: ["ad_account_id", "name"],
        },
      },
      {
        name: "meta_create_ad_set",
        description: "Crea un ad set (conjunto de anuncios) bajo una campaña existente, con presupuesto diario y segmentación. SEGURIDAD: nace SIEMPRE en status PAUSED, aunque la campaña padre esté activa.",
        inputSchema: {
          type: "object",
          properties: {
            ad_account_id: AD_ACCOUNT,
            name: { type: "string", description: "Nombre del ad set" },
            campaign_id: { type: "string", description: "ID de la campaña padre" },
            daily_budget_clp: { type: "number", description: "Presupuesto diario en CLP (ej: 5000). CLP es moneda sin decimales en Meta, se envía tal cual, sin multiplicar por 100." },
            optimization_goal: { type: "string", description: "Meta ej: LEAD_GENERATION, LINK_CLICKS, REACH. Default LEAD_GENERATION." },
            billing_event: { type: "string", description: "Ej: IMPRESSIONS. Default IMPRESSIONS." },
            countries: { type: "array", items: { type: "string" }, description: "Códigos de país ISO para segmentar (default ['CL'])." },
            age_min: { type: "number", description: "Edad mínima (default 18)" },
            age_max: { type: "number", description: "Edad máxima (default 65)" },
          },
          required: ["ad_account_id", "name", "campaign_id", "daily_budget_clp"],
        },
      },
      {
        name: "meta_create_ad_creative",
        description: "Crea un creative (mensaje + imagen + link) reutilizable para armar un anuncio. No gasta plata por sí solo — solo existe cuando se usa en meta_create_ad.",
        inputSchema: {
          type: "object",
          properties: {
            ad_account_id: AD_ACCOUNT,
            name: { type: "string", description: "Nombre interno del creative" },
            page_id: { type: "string", description: "ID de la página de Facebook/Instagram conectada a la cuenta publicitaria" },
            message: { type: "string", description: "Texto principal del anuncio" },
            link: { type: "string", description: "URL de destino (landing page)" },
            picture_url: { type: "string", description: "URL pública de la imagen a usar (opcional)" },
            call_to_action_type: { type: "string", description: "Ej: LEARN_MORE, CONTACT_US, SIGN_UP. Default LEARN_MORE." },
          },
          required: ["ad_account_id", "name", "page_id", "message", "link"],
        },
      },
      {
        name: "meta_create_ad",
        description: "Crea un anuncio dentro de un ad set, usando un creative ya existente. SEGURIDAD: nace SIEMPRE en status PAUSED.",
        inputSchema: {
          type: "object",
          properties: {
            ad_account_id: AD_ACCOUNT,
            name: { type: "string", description: "Nombre del anuncio" },
            adset_id: { type: "string", description: "ID del ad set padre" },
            creative_id: { type: "string", description: "ID del creative (de meta_create_ad_creative)" },
          },
          required: ["ad_account_id", "name", "adset_id", "creative_id"],
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
      ...WA_TOOLS,
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

  const res = await fetch(`${GRAPH}/${path}`, {
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
  const accountId = formatAdAccountId(args?.ad_account_id);

  if (name.startsWith("wa_")) {
    if (!META_ACCESS_TOKEN) {
      return { content: [{ type: "text", text: "⚠️ Falta META_ACCESS_TOKEN en mcp-meta/.env" }], isError: true };
    }
    try {
      const result = await handleWhatsappTool(name, args || {});
      if (result) return result;
      throw new GraphError(`Herramienta no encontrada: ${name}`);
    } catch (err) {
      return { content: [{ type: "text", text: `❌ Error de WhatsApp API: ${err.message}` }], isError: true };
    }
  }

  if (!META_ACCESS_TOKEN) {
    return { content: [{ type: "text", text: "⚠️ Falta META_ACCESS_TOKEN en mcp-meta/.env" }], isError: true };
  }
  if (AD_ACCOUNT_TOOLS.has(name) && !/^act_\d{5,25}$/.test(accountId)) {
    return {
      content: [{ type: "text", text: "⚠️ Falta ad_account_id (o no es un ID válido). No hay cuenta publicitaria por defecto: usá meta_list_ad_accounts para elegir la del cliente." }],
      isError: true,
    };
  }

  try {
    if (name === "meta_list_ad_accounts") {
      const r = await graphRequest("GET", "me/adaccounts", {
        query: { fields: "id,name,currency,account_status,amount_spent,business{id,name}", limit: 100 },
      });
      return json(r.data || []);
    }

    if (name === "meta_list_pages") {
      const r = await graphRequest("GET", "me/accounts", { query: { fields: "id,name,category,tasks", limit: 100 } });
      return json(r.data || []);
    }

    if (name === "meta_list_lead_forms") {
      const r = await graphRequest("GET", `${requireId(args?.page_id, "page_id")}/leadgen_forms`, {
        token: await pageToken(args.page_id),
        query: { fields: "id,name,status,leads_count,created_time,locale", limit: 100 },
      });
      return json(r.data || []);
    }

    if (name === "meta_get_leads") {
      const r = await graphRequest("GET", `${requireId(args?.form_id, "form_id")}/leads`, {
        token: await pageToken(args?.page_id),
        query: {
          fields: "id,created_time,field_data,ad_id,ad_name,campaign_id,campaign_name,platform,is_organic",
          limit: Math.min(Math.max(Number(args?.limit) || 50, 1), 500),
        },
      });
      return json(r.data || []);
    }

    if (name === "meta_get_campaigns") {
      const r = await graphRequest("GET", `${accountId}/campaigns`, {
        query: { fields: "id,name,status,effective_status,objective,daily_budget,lifetime_budget,created_time", limit: 200 },
      });
      return json(r.data || []);
    }

    if (name === "meta_get_insights") {
      const level = args?.level === "campaign" ? "campaign" : "account";
      const r = await graphRequest("GET", `${accountId}/insights`, {
        query: {
          level,
          date_preset: args?.date_preset || "last_7d",
          fields: `${level === "campaign" ? "campaign_id,campaign_name," : ""}account_currency,spend,impressions,clicks,reach,cpc,cpm,actions,cost_per_action_type`,
          limit: 200,
        },
      });
      return json(r.data || []);
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

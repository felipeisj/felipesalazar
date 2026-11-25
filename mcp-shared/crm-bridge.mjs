/**
 * Cliente del puente de anuncios de crm-leads (`/api/v1/ads/*`).
 *
 * Permite que los MCP `meta-ads` y `google-ads` operen la cuenta de UNA empresa
 * del CRM sin tener sus tokens: el CRM pone el token de la empresa y aplica sus
 * reglas (solo su cuenta, lo creado nace PAUSED, activar nunca, sin borrar).
 *
 * Config en el `.env` de cada MCP:
 *   CRM_URL=https://app.mpfrental.cl
 *   CRM_ADS_KEYS=metal-austral:sk_live_xxx,otra-empresa:sk_live_yyy
 * Las keys las crea un superadmin en CRM → Configuración → Empresas → API keys
 * con el uso "MCP de anuncios".
 */

export class CrmBridgeError extends Error {}

export function createCrmBridge({ url, keys }) {
  const base = (url || "").replace(/\/+$/, "");
  const keyByTenant = new Map(
    (keys || "")
      .split(",")
      .map((pair) => pair.trim())
      .filter(Boolean)
      .map((pair) => {
        const i = pair.indexOf(":");
        return [pair.slice(0, i).trim(), pair.slice(i + 1).trim()];
      })
      .filter(([t, k]) => t && k),
  );
  const connections = new Map();

  async function call(tenant, method, path, body) {
    if (!base) throw new CrmBridgeError("Falta CRM_URL en el .env del MCP.");
    const key = keyByTenant.get(tenant);
    if (!key) {
      throw new CrmBridgeError(
        `No hay API key para la empresa "${tenant}" (CRM_ADS_KEYS). Empresas configuradas: ${[...keyByTenant.keys()].join(", ") || "ninguna"}.`,
      );
    }
    const res = await fetch(`${base}${path}`, {
      method,
      headers: { Authorization: `Bearer ${key}`, ...(body ? { "Content-Type": "application/json" } : {}) },
      body: body ? JSON.stringify(body) : undefined,
    });
    const data = await res.json().catch(() => ({}));
    if (!res.ok || data.error) {
      throw new CrmBridgeError(`CRM (${res.status}): ${data.error?.message || res.statusText}`);
    }
    return data.data;
  }

  return {
    tenants: () => [...keyByTenant.keys()],
    has: (tenant) => keyByTenant.has(tenant),
    /** Cuentas conectadas de la empresa (cacheado por proceso). */
    async connection(tenant) {
      if (!connections.has(tenant)) connections.set(tenant, await call(tenant, "GET", "/api/v1/ads"));
      return connections.get(tenant);
    },
    report: (tenant, range) =>
      call(tenant, "GET", `/api/v1/ads/campaigns?range=${encodeURIComponent(range || "last_30")}`),
    meta: (tenant, req) => call(tenant, "POST", "/api/v1/ads/meta", req),
    googleSearch: (tenant, query) => call(tenant, "POST", "/api/v1/ads/google", { action: "search", query }),
    googleMutate: (tenant, resource, operations) =>
      call(tenant, "POST", "/api/v1/ads/google", { action: "mutate", resource, operations }),
  };
}

export const CRM_TENANT_PROP = {
  type: "string",
  description:
    "Empresa del CRM (id del tenant, ej. 'metal-austral'). Si se indica, la tool opera la cuenta conectada por ESA empresa en crm-leads (sin usar tu token): solo su cuenta, lo creado nace PAUSED y activar se hace a mano. Ver crm_list_tenants.",
};

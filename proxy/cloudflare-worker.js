// Proxy gratuit (Cloudflare Workers) pour les données du DGEQ: contourne le blocage CORS du navigateur.
// Routes: /api/resultats et /api/candidatures
const SOURCES = {
  "/api/resultats": "https://donnees.electionsquebec.qc.ca/production/provincial/resultats/resultats.json",
  "/api/candidatures": "https://donnees.electionsquebec.qc.ca/production/provincial/candidatures/candidatures.json"
};
const CORS = { "Access-Control-Allow-Origin": "*" };

export default {
  async fetch(req) {
    const path = new URL(req.url).pathname;
    if (req.method === "OPTIONS") {
      return new Response(null, { headers: { ...CORS, "Access-Control-Allow-Methods": "GET", "Access-Control-Allow-Headers": "*" } });
    }
    const src = SOURCES[path];
    if (!src) return new Response("Introuvable", { status: 404, headers: CORS });
    const json = { ...CORS, "Content-Type": "application/json; charset=utf-8" };
    try {
      const r = await fetch(src, {
        headers: { "User-Agent": "Mozilla/5.0 (compatible; soiree-electorale/1.0)", "Accept": "application/json,*/*", "Accept-Language": "fr-CA,fr;q=0.9" },
        cf: { cacheTtl: path === "/api/resultats" ? 15 : 600, cacheEverything: true }
      });
      if (!r.ok) return new Response(JSON.stringify({ error: `DGEQ HTTP ${r.status}` }), { status: 502, headers: { ...json, "Cache-Control": "no-store" } });
      const body = (await r.text()).replace(/^\uFEFF/, "");
      return new Response(body, { headers: { ...json, "Cache-Control": "public, max-age=10" } });
    } catch (e) {
      return new Response(JSON.stringify({ error: String((e && e.message) || e) }), { status: 502, headers: { ...json, "Cache-Control": "no-store" } });
    }
  }
};

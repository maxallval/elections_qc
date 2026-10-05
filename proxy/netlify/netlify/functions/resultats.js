// Proxy des résultats du DGEQ: contourne le blocage CORS du navigateur.
// Exposé sur /api/resultats (voir netlify.toml). Node 18+ (fetch intégré).
const SOURCE = "https://donnees.electionsquebec.qc.ca/production/provincial/resultats/resultats.json";

exports.handler = async () => {
  const base = { "Access-Control-Allow-Origin": "*", "Content-Type": "application/json; charset=utf-8" };
  try {
    const r = await fetch(SOURCE, {
      headers: {
        "User-Agent": "Mozilla/5.0 (compatible; soiree-electorale/1.0)",
        "Accept": "application/json,*/*",
        "Accept-Language": "fr-CA,fr;q=0.9"
      }
    });
    if (!r.ok) {
      return { statusCode: 502, headers: { ...base, "Cache-Control": "no-store" }, body: JSON.stringify({ error: `DGEQ HTTP ${r.status}` }) };
    }
    const body = (await r.text()).replace(/^\uFEFF/, "");
    return {
      statusCode: 200,
      headers: { ...base, "Cache-Control": "public, max-age=10", "Netlify-CDN-Cache-Control": "public, s-maxage=15" },
      body
    };
  } catch (e) {
    return { statusCode: 502, headers: { ...base, "Cache-Control": "no-store" }, body: JSON.stringify({ error: String((e && e.message) || e) }) };
  }
};

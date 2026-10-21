// big12-board Worker: a cron that refreshes records into D1, a small JSON API,
// and the static page (public/) served as Workers static assets.

import { runBatch, rebuildDocs, UA } from "./refresh.js";
import { SCHOOLS } from "./schools.js";
import { localDate } from "./season.js";

const json = (body, init = {}) => new Response(JSON.stringify(body), {
  ...init,
  headers: { "content-type": "application/json; charset=utf-8", "access-control-allow-origin": "*", ...(init.headers || {}) },
});

// /probe only fetches these hosts, so it can't be used as an open proxy.
const PROBE_HOSTS = new Set(["site.api.espn.com", ...SCHOOLS.flatMap(s => [s.domain, "www." + s.domain])]);

async function probe(request, env) {
  if (env.PROBE_ENABLED !== "true") return new Response("Not found", { status: 404 });
  const q = new URL(request.url).searchParams;
  // b: base64url-encoded target, for URLs whose own query string some clients mangle.
  let u = q.get("u");
  if (!u && q.get("b")) { try { u = atob(q.get("b").replace(/-/g, "+").replace(/_/g, "/")); } catch { u = null; } }
  let target;
  try { target = new URL(u); } catch { return json({ error: "bad url" }, { status: 400 }); }
  if (target.protocol !== "https:" || !PROBE_HOSTS.has(target.host)) return json({ error: "host not allowed" }, { status: 403 });
  const t0 = Date.now();
  let status = 0, ctype = null, body = "", error = null;
  try {
    const res = await fetch(target, { headers: { "user-agent": UA }, signal: AbortSignal.timeout(15_000) });
    status = res.status; ctype = res.headers.get("content-type");
    body = await res.text();
  } catch (e) { error = String(e?.message || e); }
  await env.DB.prepare("INSERT OR REPLACE INTO probe (url, status, ctype, bytes, body, fetched_at) VALUES (?1, ?2, ?3, ?4, ?5, ?6)")
    .bind(target.href, status, ctype, body.length, body.slice(0, 1_500_000), Date.now()).run();
  return json({ url: target.href, status, ctype, bytes: body.length, ms: Date.now() - t0, error, stored: true });
}

async function schools(env) {
  const { results } = await env.DB.prepare("SELECT school, json, updated_at FROM docs").all();
  const order = new Map(SCHOOLS.map((s, i) => [s.id, i]));
  results.sort((a, b) => order.get(a.school) - order.get(b.school));
  const asOfs = results.map(r => { try { return JSON.parse(r.json.slice(0, 400).match(/"asOf":("[^"]*"|null)/)?.[1] || "null"); } catch { return null; } }).filter(Boolean);
  const asOf = asOfs.length ? asOfs.sort().at(-1) : null;
  // Concatenate stored JSON rather than parse it: page views stay cheap.
  const body = `{"asOf":${JSON.stringify(asOf)},"schools":[${results.map(r => r.json).join(",")}]}`;
  return new Response(body, { headers: { "content-type": "application/json; charset=utf-8", "cache-control": "public, max-age=60", "access-control-allow-origin": "*" } });
}

async function status(env) {
  const { results } = await env.DB.prepare(
    "SELECT key, layer, phase, url, last_attempt, last_ok, last_status, last_error, fail_count, (data IS NOT NULL) AS has_data FROM pages ORDER BY fail_count DESC, key"
  ).all();
  const n = (f) => results.filter(f).length;
  return json({
    pages: results.length,
    withData: n(r => r.has_data),
    failing: n(r => r.fail_count > 0),
    byLayer: { espn: n(r => r.layer === "espn" && r.has_data), site: n(r => r.layer === "site" && r.has_data) },
    problems: results.filter(r => r.fail_count > 0).slice(0, 100),
    runs: (await env.DB.prepare("SELECT id, started, finished, picked, error FROM runs ORDER BY id DESC LIMIT 10").all()).results,
  });
}

export default {
  async fetch(request, env, ctx) {
    const { pathname } = new URL(request.url);
    if (pathname === "/api/schools") return schools(env);
    if (pathname === "/api/status") return status(env);
    if (pathname === "/probe") return probe(request, env);
    if (pathname === "/api/refresh" && request.method === "POST" && env.ADMIN_KEY && request.headers.get("x-admin-key") === env.ADMIN_KEY) {
      return json({ fetched: await runBatch(env) });
    }
    if (pathname === "/api/rebuild" && request.method === "POST" && env.ADMIN_KEY && request.headers.get("x-admin-key") === env.ADMIN_KEY) {
      await rebuildDocs(env, SCHOOLS.map(s => s.id));
      return json({ rebuilt: SCHOOLS.length });
    }
    return env.ASSETS.fetch(request);
  },
  async scheduled(event, env, ctx) {
    // Each run logs a start row first and fills it in at the end, so a run that dies
    // (CPU limit, exception) shows up as a start with no finish.
    const started = Date.now();
    let id = null;
    try {
      id = (await env.DB.prepare("INSERT INTO runs (started) VALUES (?1) RETURNING id").bind(started).first())?.id;
    } catch {}
    try {
      const keys = await runBatch(env);
      if (id) {
        await env.DB.batch([
          env.DB.prepare("UPDATE runs SET finished = ?1, picked = ?2 WHERE id = ?3").bind(Date.now(), keys.join(" "), id),
          env.DB.prepare("DELETE FROM runs WHERE id < ?1").bind(id - 500),
        ]);
      }
    } catch (e) {
      if (id) await env.DB.prepare("UPDATE runs SET finished = ?1, error = ?2 WHERE id = ?3").bind(Date.now(), String(e?.stack || e).slice(0, 1000), id).run();
      throw e;
    }
  },
};

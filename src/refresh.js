// The cron's job: pick a few due pages, fetch them politely, parse, store.
// Small batches on a frequent cron keep each run well inside the Workers CPU limit
// and spread requests across school sites instead of bursting them.

import { sourcesFor } from "./sources.js";
import { parseEspnSchedule } from "./espn.js";
import { parseSidearm } from "./sidearm.js";
import { BY_ID } from "./schools.js";
import { localDate } from "./season.js";
import { assembleSchool } from "./assemble.js";

export const UA = "Mozilla/5.0 (compatible; Big12RecordsBoard/1.0; +https://github.com/alexanderhwolf/ncaa-stats)";

// caps: how many pages of each layer one run may take. ESPN schedules are ~350 KB of JSON
// (~5 ms CPU to parse); school pages are ~1 ms. One ESPN page per run keeps a run well
// inside the free plan's 10 ms CPU limit.
export function pickDue(sources, rows, now, caps = { espn: 1, site: 2 }, perHost = 2) {
  if (typeof caps === "number") caps = { espn: caps, site: caps };
  const byKey = new Map(rows.map(r => [r.key, r]));
  const due = [];
  for (const s of sources) {
    const r = byKey.get(s.key);
    if (!r || r.url !== s.url || r.last_attempt == null) { due.push({ s, at: 0 }); continue; }
    const backoff = r.fail_count ? Math.min(2 ** r.fail_count, 16) : 1;
    // Failures retry sooner than a full TTL but back off: 30 min, 1 h, 2 h ... capped.
    const wait = r.fail_count ? Math.min(30 * backoff, s.ttl) : s.ttl;
    if (now - r.last_attempt >= wait * 60_000) due.push({ s, at: r.last_attempt });
  }
  // Oldest first; among equals, current regular season before postseason before last season.
  const rank = s => (s.phase === "cur" ? 0 : 2) + (s.key.endsWith("|3") ? 1 : 0);
  due.sort((a, b) => a.at - b.at || rank(a.s) - rank(b.s));
  const hosts = new Map(), layers = new Map();
  const pick = [];
  for (const { s } of due) {
    const h = new URL(s.url).host;
    if ((hosts.get(h) || 0) >= perHost) continue;
    if ((layers.get(s.layer) || 0) >= (caps[s.layer] ?? 0)) continue;
    hosts.set(h, (hosts.get(h) || 0) + 1);
    layers.set(s.layer, (layers.get(s.layer) || 0) + 1);
    pick.push(s);
    if (pick.length >= (caps.espn || 0) + (caps.site || 0)) break;
  }
  return pick;
}

const CONF_IDS = new Set(Object.values(BY_ID).map(s => String(s.espnId)));

export function parse(s, body) {
  if (s.layer === "espn") return parseEspnSchedule(JSON.parse(body), BY_ID[s.school].espnId, CONF_IDS);
  return parseSidearm(body, { Y: s.Y, isFallBallSport: s.fam === "spring" });
}

export async function runBatch(env, now = Date.now()) {
  const today = localDate(new Date(now));
  const sources = sourcesFor(today);
  const { results: rows } = await env.DB.prepare("SELECT key, url, last_attempt, fail_count FROM pages").all();
  const pick = pickDue(sources, rows, now, { espn: Number(env.ESPN_PER_RUN || 1), site: Number(env.SITE_PER_RUN || 2) });
  for (const s of pick) {
    let status = 0, err = null, data = null;
    try {
      const res = await fetch(s.url, { headers: { "user-agent": UA, accept: s.layer === "espn" ? "application/json" : "text/html" }, signal: AbortSignal.timeout(15_000), cf: { cacheTtl: 0 } });
      status = res.status;
      if (res.ok) {
        const parsed = parse(s, await res.text());
        if (s.layer === "site" && !parsed.events.length && !parsed.record.overall) err = "no schedule table found";
        else data = JSON.stringify(parsed);
      } else err = `HTTP ${status}`;
    } catch (e) {
      err = String(e?.message || e).slice(0, 200);
    }
    await env.DB.prepare(
      `INSERT INTO pages (key, school, layer, ref, phase, url, ttl_min, last_attempt, last_ok, last_status, last_error, fail_count, data)
       VALUES (?1, ?2, ?3, ?4, ?5, ?6, ?7, ?8, ?9, ?10, ?11, ?12, ?13)
       ON CONFLICT(key) DO UPDATE SET
         url = excluded.url, ttl_min = excluded.ttl_min, last_attempt = excluded.last_attempt,
         last_status = excluded.last_status, last_error = excluded.last_error,
         last_ok = COALESCE(excluded.last_ok, pages.last_ok),
         fail_count = CASE WHEN excluded.data IS NULL THEN pages.fail_count + 1 ELSE 0 END,
         data = CASE WHEN excluded.url <> pages.url THEN excluded.data ELSE COALESCE(excluded.data, pages.data) END`
    ).bind(s.key, s.school, s.layer, s.ref, s.phase, s.url, s.ttl, now, data ? now : null, status, err, data ? 0 : 1, data).run();
  }
  const touched = [...new Set(pick.map(s => s.school))];
  await rebuildDocs(env, touched, today, now);
  return pick.map(s => s.key);
}

// Re-assemble the given schools' documents from their stored pages.
export async function rebuildDocs(env, schoolIds, today = localDate(), now = Date.now()) {
  const stmts = [];
  for (const id of schoolIds) {
    const { results } = await env.DB.prepare("SELECT key, url, last_ok, last_error, fail_count, data FROM pages WHERE school = ?1").bind(id).all();
    const doc = assembleSchool(BY_ID[id], results, today);
    stmts.push(env.DB.prepare("INSERT OR REPLACE INTO docs (school, json, updated_at) VALUES (?1, ?2, ?3)").bind(id, JSON.stringify(doc), now));
  }
  if (stmts.length) await env.DB.batch(stmts);
}

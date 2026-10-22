// The cron's job: pick a few due pages, fetch them politely, parse, store.
// Small batches on a frequent cron keep each run well inside the Workers CPU limit
// and spread requests across school sites instead of bursting them.

import { sourcesFor, tfrrsMeetSources, wmtEventSources, confStandingsSources, sidearmApiSources } from "./sources.js";
import { parseSidearmSports, parseSidearmSchedule, scheduleIdFromPage } from "./sidearmApi.js";
import { parseStandings } from "./big12.js";
import { parseWmtSchedules, parseWmtEvents } from "./wmt.js";
import { parseTeamPage, parseMeetPage } from "./tfrrs.js";
import { parseEspnSchedule } from "./espn.js";
import { parseSidearm, parseRegular } from "./sidearm.js";
import { BY_ID, espnTeamId, membersIn, HISTORY_YEARS, teamMatches } from "./schools.js";
import { localDate, startYear } from "./season.js";
import { assembleSchool, assembleSeason } from "./assemble.js";

// Some sites (big12sports.com) set a cookie and redirect back to the same URL; a fetch that
// follows redirects without keeping cookies loops until "Too many redirects". This follows
// redirects by hand and carries the cookies along, up to 6 hops.
export async function fetchKeepingCookies(url, init = {}) {
  const jar = new Map();
  let u = url;
  for (let hop = 0; hop < 6; hop++) {
    const headers = { ...(init.headers || {}) };
    if (jar.size) headers.cookie = [...jar].map(([k, v]) => `${k}=${v}`).join("; ");
    const res = await fetch(u, { ...init, headers, redirect: "manual" });
    const set = typeof res.headers.getSetCookie === "function" ? res.headers.getSetCookie() : (res.headers.get("set-cookie") ? [res.headers.get("set-cookie")] : []);
    for (const c of set) { const m = String(c).match(/^\s*([^=;\s]+)=([^;]*)/); if (m) jar.set(m[1], m[2]); }
    if (res.status < 300 || res.status >= 400 || !res.headers.get("location")) return res;
    u = new URL(res.headers.get("location"), u).href;
  }
  throw new Error("Too many redirects (with cookies kept)");
}

export const UA = "Mozilla/5.0 (compatible; Big12RecordsBoard/1.0; +https://github.com/alexanderhwolf/ncaa-stats)";

// caps: how many pages of each layer one run may take (ESPN_PER_RUN / SITE_PER_RUN).
// An ESPN schedule is ~350 KB of JSON (~5 ms CPU); a school page ~1 ms.
// Small stable hash, so equal-priority pages interleave across schools instead of
// walking one school's site page after page (Arizona answered 403 to that).
const h32 = str => { let h = 2166136261; for (let i = 0; i < str.length; i++) h = Math.imul(h ^ str.charCodeAt(i), 16777619); return h >>> 0; };

export function pickDue(sources, rows, now, caps = { espn: 1, site: 2 }, perHost = 1) {
  if (typeof caps === "number") caps = { espn: caps, site: caps };
  const byKey = new Map(rows.map(r => [r.key, r]));
  const due = [];
  for (const s of sources) {
    const r = byKey.get(s.key);
    if (!r || r.url !== s.url || r.last_attempt == null) { due.push({ s, at: 0 }); continue; }
    const backoff = r.fail_count ? Math.min(2 ** r.fail_count, 16) : 1;
    // Failures retry sooner than a full TTL but back off: 30 min, 1 h, 2 h ... capped.
    // A past season's page that's simply not there (404: the program didn't exist yet) won't
    // appear later, so it waits the full TTL instead of retrying.
    const gone = s.phase === "hist" && r.last_status === 404;
    const wait = r.fail_count && !gone ? Math.min(30 * backoff, s.ttl) : s.ttl;
    if (now - r.last_attempt >= wait * 60_000) due.push({ s, at: r.last_attempt });
  }
  // Past seasons (backfill) only use what's left after current and last season.
  // Then oldest first; among equals, current regular season before postseason before last season.
  const hist = s => (s.phase === "hist" ? 1 : 0);
  const rank = s => (s.phase === "cur" ? 0 : 2) + (s.key.endsWith("|3") ? 1 : 0);
  // Backfill fills the most recent seasons first, so the year selector fills in from the top.
  due.sort((a, b) => hist(a.s) - hist(b.s) || (hist(a.s) ? b.s.Y - a.s.Y : 0) || a.at - b.at || rank(a.s) - rank(b.s) || h32(a.s.key) - h32(b.s.key));
  const hosts = new Map(), layers = new Map();
  const pick = [];
  for (const { s } of due) {
    const h = new URL(s.url).host;
    // ESPN is one big API host; the per-host cap is for school sites.
    if (s.layer === "site" && (hosts.get(h) || 0) >= perHost) continue;
    if ((layers.get(s.layer) || 0) >= (caps[s.layer] ?? 0)) continue;
    hosts.set(h, (hosts.get(h) || 0) + 1);
    layers.set(s.layer, (layers.get(s.layer) || 0) + 1);
    pick.push(s);
    if (pick.length >= (caps.espn || 0) + (caps.site || 0)) break;
  }
  return pick;
}

// That season's conference members' ESPN ids, per sport (soccer has its own id space).
const confIds = (sport, Y) => new Set(membersIn(Y).map(s => espnTeamId(s, sport)).filter(Boolean));
const CONF = {};

export function parse(s, body) {
  if (s.layer === "espn") return parseEspnSchedule(JSON.parse(body), s.teamId || espnTeamId(BY_ID[s.school], s.ref), CONF[`${s.ref}|${s.Y}`] ??= confIds(s.ref, s.Y));
  if (s.reg) return parseRegular(body);
  if (s.tfrrs === "team") return parseTeamPage(body);
  if (s.tfrrs === "meet") return parseMeetPage(body);
  if (s.conf) return parseStandings(body);
  if (s.sapi === "sports") return parseSidearmSports(JSON.parse(body));
  if (s.sapi === "schedule") return parseSidearmSchedule(JSON.parse(body));
  if (s.sidx) return scheduleIdFromPage(body);
  if (s.wmt === "catalog") return parseWmtSchedules(JSON.parse(body));
  if (s.wmt === "events") return parseWmtEvents(JSON.parse(body), BY_ID[s.school].tz);
  return parseSidearm(body, { Y: s.Y, isFallBallSport: s.fam === "spring" });
}

// Every page the queue knows about: the fixed list plus pages discovered from stored ones
// (TFRRS meets from team pages, WMT seasons from season lists).
export async function allSources(env, today) {
  const sources = sourcesFor(today);
  const { results: tfTeams } = await env.DB.prepare("SELECT school, data FROM pages WHERE key LIKE '%|tfrrs|team-%' AND data IS NOT NULL").all();
  const teamData = tfTeams.map(r => { try { return { school: r.school, ...JSON.parse(r.data) }; } catch { return { school: r.school, meets: [] }; } });
  sources.push(...tfrrsMeetSources(teamData, today));
  const { results: cats } = await env.DB.prepare("SELECT school, ref, data FROM pages WHERE key LIKE '%|wmt|cat-%' AND data IS NOT NULL").all();
  sources.push(...wmtEventSources(cats.map(r => { try { return { school: r.school, slug: r.ref, ...JSON.parse(r.data) }; } catch { return { school: r.school, slug: r.ref, schedules: [] }; } }), today));
  const { results: sCats } = await env.DB.prepare("SELECT school, data FROM pages WHERE key LIKE '%|sapi|sports|cat' AND data IS NOT NULL").all();
  const { results: sIdx } = await env.DB.prepare("SELECT key, data FROM pages WHERE key LIKE '%|sidx|%' AND data IS NOT NULL").all();
  const parse1 = (d, fb) => { try { return JSON.parse(d); } catch { return fb; } };
  sources.push(...sidearmApiSources(sCats.map(r => ({ school: r.school, ...parse1(r.data, { sports: [] }) })), sIdx.map(r => ({ key: r.key, ...parse1(r.data, {}) })), today));
  const { results: confCats } = await env.DB.prepare("SELECT ref, data FROM pages WHERE key LIKE 'conf|b12|%|cat' AND data IS NOT NULL").all();
  sources.push(...confStandingsSources(confCats.map(r => { try { return { path: r.ref, ...JSON.parse(r.data) }; } catch { return { path: r.ref, seasons: [] }; } }), today));
  return { sources, teamData };
}

export async function runBatch(env, now = Date.now()) {
  const today = localDate(new Date(now));
  const { sources, teamData } = await allSources(env, today);
  const { results: rows } = await env.DB.prepare("SELECT key, url, last_attempt, fail_count, last_status FROM pages").all();
  const pick = pickDue(sources, rows, now, { espn: Number(env.ESPN_PER_RUN || 1), site: Number(env.SITE_PER_RUN || 2) });
  for (const s of pick) {
    let status = 0, err = null, data = null;
    try {
      const res = await (s.conf ? fetchKeepingCookies : fetch)(s.url, { headers: { "user-agent": UA, accept: s.layer === "espn" ? "application/json" : "text/html" }, signal: AbortSignal.timeout(15_000), cf: { cacheTtl: 0 } });
      status = res.status;
      if (res.ok) {
        const parsed = parse(s, await res.text());
        // A regular page without event headings (other templates) is a valid, empty answer.
        if (s.conf === "season" && !parsed.rows.length) err = "no standings table found";
        else if (s.sidx && !parsed.scheduleId) err = "no schedule id on the page";
        else if (s.layer === "site" && !s.reg && !s.tfrrs && !s.wmt && !s.conf && !s.sapi && !s.sidx && !parsed.events.length && !parsed.record.overall) err = "no schedule table found";
        // A wrong team id returns some other school's schedule; never store it.
        else if (s.layer === "espn" && !teamMatches(BY_ID[s.school], parsed.teamName)) err = `wrong team (${parsed.teamName})`;
        else data = JSON.stringify(parsed);
      } else if (s.layer === "espn" && [400, 404, 500].includes(status) && (s.phase === "cur" || s.key.endsWith("|3"))) {
        // ESPN answers 400 or 500 for a season or postseason that doesn't exist yet (baseball
        // 2027 in October). That's "nothing scheduled", not a failure.
        data = JSON.stringify({ events: [], label: null, teamName: null, empty: true });
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
  const Y = startYear(today);
  // A TFRRS meet page touches every school whose team page lists that meet.
  const meetSchools = id => teamData.filter(t => (t.meets || []).some(m => m.id === id)).map(t => t.school);
  // A Big 12 standings page touches every member that season (and the current board when
  // it's this season or last, which off-season tiles show).
  const confPicks = pick.filter(s => s.conf === "season");
  const touched = [...new Set([
    ...pick.filter(s => s.phase !== "hist" && !s.conf).flatMap(s => s.tfrrs === "meet" ? meetSchools(s.ref) : [s.school]),
    ...confPicks.filter(s => s.Y >= startYear(today) - 1).flatMap(() => membersIn(startYear(today)).map(m => m.id)),
  ])];
  await rebuildDocs(env, touched.filter(id => membersIn(Y).some(m => m.id === id)), today, now);
  // Past-season documents: last season (prev pages) and older ones (hist pages).
  const seasons = [...new Set(pick.filter(s => s.phase !== "cur" && !s.conf).map(s => `${s.school}|${s.phase === "prev" ? Y - 1 : s.Y}`))];
  const pairs = seasons.map(k => { const [id, y] = k.split("|"); return { id, y: +y }; })
    .concat(confPicks.filter(s => s.Y < Y).flatMap(s => membersIn(s.Y).map(m => ({ id: m.id, y: s.Y }))));
  // Plus a few season documents that don't exist yet (last season's, right after deploy).
  const have = new Set((await env.DB.prepare("SELECT school || '|' || year AS k FROM hist_docs").all()).results.map(r => r.k));
  const missing = [];
  for (let y = Y - 1; y >= Y - HISTORY_YEARS && missing.length < 3; y--) for (const m of membersIn(y)) if (!have.has(`${m.id}|${y}`) && missing.length < 3) missing.push({ id: m.id, y });
  await rebuildSeasons(env, [...pairs, ...missing], today, now);
  return pick.map(s => s.key);
}

// Re-assemble finished-season documents ({ id, y } pairs) into hist_docs.
export async function rebuildSeasons(env, pairs, today = localDate(), now = Date.now()) {
  const Y = startYear(today);
  const stmts = [];
  for (const { id, y } of pairs) {
    const school = BY_ID[id];
    if (!school || y >= Y) continue;
    const like = y === Y - 1 ? `${id}|%|prev%` : `${id}|%|y${y}%`;
    // Plus WMT season lists, so a season the school has no schedule for can say so.
    const { results } = await env.DB.prepare("SELECT key, url, last_ok, last_status, last_error, fail_count, data FROM pages WHERE key LIKE ?1 OR key LIKE ?2 OR key LIKE ?3").bind(like, `${id}|wmt|cat-%`, `conf|b12|%|y${y}`).all();
    const doc = assembleSeason(school, results, y, Y, today);
    stmts.push(env.DB.prepare("INSERT OR REPLACE INTO hist_docs (school, year, json, updated_at) VALUES (?1, ?2, ?3, ?4)").bind(id, y, JSON.stringify(doc), now));
  }
  if (stmts.length) await env.DB.batch(stmts);
}

// Re-assemble the given schools' documents from their stored pages.
export async function rebuildDocs(env, schoolIds, today = localDate(), now = Date.now()) {
  const stmts = [];
  for (const id of schoolIds) {
    const { results } = await env.DB.prepare("SELECT key, url, last_ok, last_error, fail_count, data FROM pages WHERE school = ?1 AND phase IN ('cur', 'prev')").bind(id).all();
    // Plus the Big 12 standings for this season and last.
    const Yc = startYear(today);
    const { results: cr } = await env.DB.prepare("SELECT key, url, last_ok, data FROM pages WHERE key LIKE ?1 OR key LIKE ?2").bind(`conf|b12|%|y${Yc}`, `conf|b12|%|y${Yc - 1}`).all();
    results.push(...cr);
    // Plus the TFRRS meet pages this school's team pages list.
    const ids = new Set();
    for (const r of results) if (r.key.includes("|tfrrs|team-") && r.data) { try { for (const m of JSON.parse(r.data).meets || []) if (m.xc) ids.add(m.id); } catch {} }
    if (ids.size) {
      const keys = [...ids].map(i => `_tfrrs|meet|${i}`);
      for (let i = 0; i < keys.length; i += 50) {
        const part = keys.slice(i, i + 50);
        const { results: mr } = await env.DB.prepare(`SELECT key, url, last_ok, data FROM pages WHERE key IN (${part.map((_, j) => "?" + (j + 1)).join(",")})`).bind(...part).all();
        results.push(...mr);
      }
    }
    const doc = assembleSchool(BY_ID[id], results, today);
    stmts.push(env.DB.prepare("INSERT OR REPLACE INTO docs (school, json, updated_at) VALUES (?1, ?2, ?3)").bind(id, JSON.stringify(doc), now));
  }
  if (stmts.length) await env.DB.batch(stmts);
}

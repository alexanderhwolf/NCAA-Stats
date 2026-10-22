// Sidearm's JSON API (/api/v2, the one the schools' own Nuxt pages use). The text schedule
// pages we read for records leave out meet placings; the API carries them in
// result.postscoreInfo ("3rd/12", "T5th/8", "1st - 31 pts."), one row per round or day.
//   /api/v2/Sports          every sport with its current schedule id
//   /api/v2/Schedule/<id>   one season's schedule
// Older seasons' ids aren't in the API: they're read from the season's regular schedule page,
// whose embedded Nuxt payload (devalue-encoded) holds the schedule object.
// Parsers never throw; anything unexpected parses to empty lists.

import { normPlace } from "./sidearm.js";

export function parseSidearmSports(json) {
  const rows = Array.isArray(json) ? json : [];
  return { sports: rows.filter(s => s && s.scheduleId).map(s => ({ id: s.id, slug: s.globalSportNameSlug || null, short: s.shortName || null, title: s.title || null, scheduleId: s.scheduleId, gender: s.globalSportGender || null })) };
}

// Our sport (slug, g) -> the API's sport, by its site slug, then by short name.
export function apiSportFor(sports, sp) {
  const want = sp.slug;
  return (sports || []).find(s => s.slug === want) || (sports || []).find(s => s.short === want) || null;
}

export function parseSidearmSchedule(json) {
  const out = { label: json?.title || null, events: [] };
  for (const g of Array.isArray(json?.games) ? json.games : []) {
    const date = String(g?.date || "").slice(0, 10);
    if (!/^\d{4}-\d{2}-\d{2}$/.test(date)) continue;
    const info = String(g?.result?.postscoreInfo || "").trim();
    if (!info) continue;
    const opp = g?.opponent?.title || g?.tournament?.title || null;
    // Combined pages post both teams: "M: 3rd/12 | W: 5th/12".
    const mw = info.match(/M:\s*([^|]+)\|\s*W:\s*(.+)$/i);
    if (mw) {
      for (const [gg, p] of [["Men", mw[1]], ["Women", mw[2]]]) { const pl = normPlace(p); if (pl) out.events.push({ date, opp, g: gg, place: pl }); }
    } else {
      const pl = normPlace(info);
      if (pl) out.events.push({ date, opp, g: null, place: pl });
    }
  }
  return out;
}

// The schedule id of a regular schedule page's season, from its __NUXT_DATA__ payload: the
// object with a games array and a title naming a schedule.
export function scheduleIdFromPage(html) {
  const m = String(html || "").match(/<script[^>]*id="__NUXT_DATA__"[^>]*>([\s\S]*?)<\/script>/);
  if (!m) return { scheduleId: null, title: null };
  let arr;
  try { arr = JSON.parse(m[1]); } catch { return { scheduleId: null, title: null }; }
  if (!Array.isArray(arr)) return { scheduleId: null, title: null };
  // devalue: every value is an index into arr; objects map keys to indices. Only what's needed
  // to find the schedule is resolved, so this stays cheap on a large payload.
  const WRAP = new Set(["Reactive", "ShallowReactive", "Ref", "ShallowRef", "EmptyRef", "Set", "Map", "Date", "NuxtError"]);
  const at = i => (typeof i === "number" ? arr[i] : undefined);
  for (let i = 0; i < arr.length; i++) {
    const v = arr[i];
    if (!v || typeof v !== "object" || Array.isArray(v) || !("games" in v) || !("title" in v) || !("id" in v)) continue;
    const title = at(v.title), games = at(v.games), id = at(v.id);
    if (typeof title === "string" && /Schedule/i.test(title) && Array.isArray(games) && typeof id === "number" && !WRAP.has(games[0])) return { scheduleId: id, title };
  }
  return { scheduleId: null, title: null };
}

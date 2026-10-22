// Layer 2b: schools on the WMT Digital platform (BYU, UCF, Cincinnati, Arizona State) publish
// their schedules through an open JSON API on the athletics site itself (/website-api), the
// one their own schedule pages load. Every sport and every season back decades, with results:
// scores for head-to-head events, and the school's own placing text for meets
// ("1st - 19 points", "9th (Kate Walker - T-6th)").
//   /website-api/schedules?filter[sport.id]=<id>   one row per season: "Women's Volleyball 2026"
//   /website-api/schedule-events?filter[schedule_id]=<id>&include=scheduleEventResult
// Parsers never throw; anything unexpected parses to empty lists.

import { localDate } from "./season.js";

const Q = s => s.replace(/\[/g, "%5B").replace(/\]/g, "%5D");
export const wmtSchedulesUrl = (domain, sportId) => `https://${domain}/website-api/schedules?${Q("filter[sport.id]")}=${sportId}&per_page=200`;
export const wmtEventsUrl = (domain, scheduleId) => `https://${domain}/website-api/schedule-events?${Q("filter[schedule_id]")}=${scheduleId}&include=scheduleEventResult&per_page=200&sort=datetime`;

export function parseWmtSchedules(json) {
  const rows = Array.isArray(json?.data) ? json.data : [];
  return { schedules: rows.filter(s => s && s.id != null).map(s => ({ id: s.id, name: String(s.name || ""), seasonId: s.season_id ?? null })) };
}

// Which schedule is the season starting in Y. WMT names seasons the way the school does:
// fall "2026", spring "2027" (Baseball 2027), academic "2026-2027"; the 2020 fall seasons
// played in spring 2021 are "2020-2021".
export function scheduleFor(schedules, fam, Y) {
  const a = `${Y}-${Y + 1}`, b = `${Y}-${String((Y + 1) % 100).padStart(2, "0")}`;
  const want = fam === "fall" ? [`${Y}`, a] : fam === "spring" ? [`${Y + 1}`, a] : [a, b];
  for (const w of want) {
    const hit = (schedules || []).find(s => new RegExp(`(^|\\s)${w}$`).test(s.name.trim()));
    if (hit) return hit;
  }
  return null;
}

const num = v => { const n = parseFloat(v); return Number.isFinite(n) ? String(+n.toFixed(2)).replace(/\.0+$/, "") : null; };
const PLACE = /^(T-)?(\d{1,3})(st|nd|rd|th)\b(?:\s*(?:\/|of)\s*(\d{1,3}))?/i;

export function parseWmtEvents(json, tz) {
  const out = { label: null, record: { overall: null, conf: null, streak: null }, events: [] };
  const rows = Array.isArray(json?.data) ? json.data : [];
  for (const e of rows) {
    if (!e?.datetime) continue;
    const start = new Date(e.datetime);
    if (isNaN(start)) continue;
    const date = localDate(start, tz);
    const endD = e.datetime_end ? localDate(new Date(e.datetime_end), tz) : null;
    const r = e.schedule_event_result || {};
    const w = num(r.winning_score), l = num(r.losing_score);
    let result = null, place = null;
    if (r.result === "win" && w != null) result = `W ${w}-${l ?? 0}`;
    else if (r.result === "loss" && w != null) result = `L ${l ?? 0}-${w}`;
    else if (r.result === "tie" && w != null) result = `T ${w}-${l ?? w}`;
    else if (r.text) {
      const m = String(r.text).trim().match(PLACE);
      if (m) place = `${m[1] ? "T-" : ""}${m[2]}${m[3].toLowerCase()}${m[4] ? " of " + m[4] : ""}`;
    }
    const time = e.is_all_day || e.tba ? null
      : new Intl.DateTimeFormat("en-US", { timeZone: tz, hour: "numeric", minute: "2-digit" }).format(start);
    out.events.push({
      date, end: endD && endD !== date ? endD : null, time,
      at: e.venue_type === "home" ? "Home" : e.venue_type === "away" ? "Away" : e.venue_type === "neutral" ? "Neutral" : null,
      opp: String(e.opponent_name || e.opponent_school_name || "TBA").replace(/^(#|No\.\s*)\d+\s+/i, "").trim(),
      location: e.location || null, tournament: null,
      result, place, raw: r.text || null,
      exhibition: !!e.is_exhibition, conf: e.is_conference ? true : null,
      canceled: /cancel|postpon/i.test(e.status || "") || undefined,
      g: null,
    });
  }
  out.events.sort((a, b) => a.date.localeCompare(b.date));
  return out;
}

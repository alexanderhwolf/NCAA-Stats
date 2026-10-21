// Layer 1: ESPN's public site JSON (site.api.espn.com). Undocumented and unlicensed:
// it can change without notice, so every field read here is optional and the parser
// returns { events: [] } rather than throwing on an unexpected shape.
// The shape assumed below MUST be confirmed against real responses captured with /probe
// (see test/fixtures/). Anything not confirmed is marked TODO(verify).

import { localDate } from "./season.js";

const PATHS = {
  football: "football/college-football",
  "mens-basketball": "basketball/mens-college-basketball",
  "womens-basketball": "basketball/womens-college-basketball",
  "womens-volleyball": "volleyball/womens-college-volleyball",
  "mens-volleyball": "volleyball/mens-college-volleyball",
  "womens-soccer": "soccer/usa.ncaa.w.1",
  "mens-soccer": "soccer/usa.ncaa.m.1",
  baseball: "baseball/college-baseball",
  softball: "baseball/college-softball",
};

// Soccer numbers its season types per league (14226 for 2026 women's soccer, confirmed
// Oct 21, 2026), so seasontype=2 returns nothing there: soccer is fetched by season alone.
export const isSoccer = espnSport => /soccer/.test(espnSport);

export function espnUrl(espnSport, teamId, season, seasontype) {
  const p = PATHS[espnSport];
  if (!p) return null;
  const base = `https://site.api.espn.com/apis/site/v2/sports/${p}/teams/${teamId}/schedule?season=${season}`;
  return isSoccer(espnSport) ? base : `${base}&seasontype=${seasontype}`;
}

const num = v => {
  if (v == null) return null;
  if (typeof v === "object") v = v.value ?? v.displayValue;
  const n = Number(v);
  return Number.isFinite(n) ? n : null;
};

const strip = s => String(s || "").replace(/^(#|No\.\s*)\d+\s+/i, "").trim();

// confIds: ESPN ids of the other conference members. This endpoint doesn't flag conference
// games (conferenceCompetition is absent, confirmed Oct 21, 2026), so a regular-season game
// against a member counts as a conference game.
export function parseEspnSchedule(json, teamId, confIds = new Set()) {
  const out = { events: [], label: null, teamName: null };
  if (!json || typeof json !== "object") return out;
  out.teamName = json.team?.displayName ?? null;
  out.label = json.requestedSeason?.displayName ?? json.season?.displayName ?? null; // TODO(verify)
  for (const ev of json.events || []) {
    const c = ev.competitions?.[0];
    if (!c) continue;
    const comps = c.competitors || [];
    const me = comps.find(x => String(x.team?.id ?? x.id) === String(teamId));
    const opp = comps.find(x => x !== me);
    if (!me) continue;
    const st = c.status?.type || ev.status?.type || {};
    const done = st.completed === true || st.state === "post";
    const iso = c.date || ev.date;
    const when = iso ? new Date(iso) : null;
    const neutral = c.neutralSite === true;
    const at = neutral ? "Neutral" : me.homeAway === "home" ? "Home" : me.homeAway === "away" ? "Away" : null;
    let result = null;
    if (done) {
      const a = num(me.score), b = num(opp?.score);
      if (a != null && b != null) {
        const r = me.winner === true ? "W" : opp?.winner === true ? "L" : a > b ? "W" : a < b ? "L" : "T";
        result = `${r} ${a}-${b}`;
      } else if (/cancel|postpon/i.test(st.description || "")) {
        result = null;
      }
    }
    // 1 pre, 2 regular, 3 post for most sports; soccer uses league-specific ids (14226),
    // so "regular" means anything that isn't pre or post.
    const seasonType = ev.seasonType?.type ?? null;
    const regular = seasonType !== 1 && seasonType !== 3;
    out.events.push({
      date: when ? localDate(when) : null,
      time: when && (ev.timeValid == null || !!ev.timeValid) ? new Intl.DateTimeFormat("en-US", { timeZone: "America/Chicago", hour: "numeric", minute: "2-digit" }).format(when) + " CT" : null,
      at,
      opp: strip(opp?.team?.location || opp?.team?.shortDisplayName || opp?.team?.displayName || ""),
      result,
      exhibition: seasonType === 1,
      conf: c.conferenceCompetition === true || (regular && confIds.has(String(opp?.team?.id ?? opp?.id))),
      oppId: opp ? String(opp.team?.id ?? opp.id ?? "") : null,
      post: seasonType === 3,
      canceled: /cancel|postpon/i.test(st.description || ""),
      note: c.notes?.[0]?.headline ?? null,
    });
  }
  return out;
}

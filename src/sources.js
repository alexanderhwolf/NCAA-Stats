// Every page the refresh queue knows about, derived from the school config and today's date.
// Keys are stable across a season; the URL moves when the season rolls over.

import { SCHOOLS, espnTeamId, memberIn, HISTORY_YEARS } from "./schools.js";
import { espnUrl, isSoccer } from "./espn.js";
import { family, startYear, sidearmSeason, espnSeason, addDays } from "./season.js";

export const TTL_CUR_MIN = 180;          // current season: every 3 hours
export const TTL_PREV_MIN = 7 * 24 * 60; // finished season: weekly is plenty
export const TTL_HIST_MIN = 60 * 24 * 60; // seasons before last: finished, so every 60 days
export const TTL_POST_MIN = 24 * 60;     // current postseason list: daily (TODO: every 3 h during each sport's postseason)

export function sourcesFor(today) {
  const Y = startYear(today);
  const out = [];
  for (const s of SCHOOLS) {
    const seenSlug = new Set();
    for (const sp of s.sports) {
      const fam = family(sp);
      for (const [phase, y] of [["cur", Y], ["prev", Y - 1]]) {
        if (!memberIn(s, y)) continue;
        const ttl = phase === "cur" ? TTL_CUR_MIN : TTL_PREV_MIN;
        if (sp.layer === "espn") {
          const teamId = espnTeamId(s, sp.espn);
          if (!teamId) continue;
          for (const st of isSoccer(sp.espn) ? [2] : [2, 3]) {
            out.push({
              key: `${s.id}|espn|${sp.espn}|${phase}|${st}`, school: s.id, layer: "espn", ref: sp.espn, phase,
              ttl: phase === "cur" && st === 3 ? TTL_POST_MIN : ttl,
              url: espnUrl(sp.espn, teamId, espnSeason(fam, y), st), Y: y, fam, teamId,
            });
          }
        } else if (s.platform === "sidearm") {
          if (seenSlug.has(sp.slug + phase)) continue; // men's and women's share one page
          seenSlug.add(sp.slug + phase);
          out.push({
            key: `${s.id}|site|${sp.slug}|${phase}`, school: s.id, layer: "site", ref: sp.slug, phase, ttl,
            url: `https://${s.domain}/sports/${sp.slug}/schedule/text/${sidearmSeason(fam, y)}`, Y: y, fam,
          });
          // Meet sports: the regular schedule page carries the placings (src/sidearm.js parseRegular).
          if (sp.kind === "meet" && phase === "cur") {
            out.push({
              key: `${s.id}|reg|${sp.slug}|cur`, school: s.id, layer: "site", ref: sp.slug, phase, ttl, reg: true,
              url: `https://${s.domain}/sports/${sp.slug}/schedule`, Y: y, fam,
            });
          }
        }
      }
    }
  }
  // TFRRS team pages (cross country): one per school and gender. Meet pages are added at run
  // time from what these list (tfrrsMeetSources).
  for (const s of SCHOOLS) {
    if (!s.tfrrs || !memberIn(s, Y)) continue;
    for (const [g, slug] of Object.entries(s.tfrrs)) {
      if (!slug) continue;
      out.push({ key: `${s.id}|tfrrs|team-${g}|cur`, school: s.id, layer: "site", ref: slug, phase: "cur", ttl: TTL_CUR_MIN, tfrrs: "team",
        url: `https://www.tfrrs.org/teams/xc/${slug}.html`, Y, fam: "fall" });
    }
  }
  out.push(...historySources(Y));
  return out;
}

// Cross country meet pages listed on the stored TFRRS team pages, this season and last.
// Shared by every school at the meet (school "_tfrrs"). Recent meets refresh every 3 hours
// while results settle; older ones monthly.
export function tfrrsMeetSources(teamPages, today) {
  const Y = startYear(today), seen = new Map();
  for (const tp of teamPages) for (const m of tp?.meets || []) {
    if (!m.xc || m.date < `${Y - 1}-07-01` || m.date > today) continue;
    if (seen.has(m.id)) continue;
    const recent = (m.end || m.date) >= addDays(today, -10);
    seen.set(m.id, { key: `_tfrrs|meet|${m.id}`, school: "_tfrrs", layer: "site", ref: m.id, phase: "cur", ttl: recent ? TTL_CUR_MIN : 30 * 24 * 60, tfrrs: "meet", url: m.url, Y, fam: "fall" });
  }
  return [...seen.values()];
}

// Seasons before last, back HISTORY_YEARS, for schools that were members that season.
// Sidearm schools: every sport from the school's own text schedule, whose record line is the
// school's official count. ESPN's older seasons are incomplete (TCU women's soccer 2016 lists
// 5 matches), so ESPN is used only where the school site isn't readable, and those schools
// only joined in 2023 or later.
export function historySources(Y) {
  const out = [];
  for (let y = Y - HISTORY_YEARS; y <= Y - 2; y++) {
    for (const s of SCHOOLS) {
      if (!memberIn(s, y)) continue;
      const seen = new Set();
      for (const sp of s.sports) {
        const fam = family(sp);
        if (s.platform === "sidearm") {
          if (seen.has(sp.slug)) continue;
          seen.add(sp.slug);
          out.push({ key: `${s.id}|site|${sp.slug}|y${y}`, school: s.id, layer: "site", ref: sp.slug, phase: "hist", ttl: TTL_HIST_MIN,
            url: `https://${s.domain}/sports/${sp.slug}/schedule/text/${sidearmSeason(fam, y)}`, Y: y, fam });
        } else if (sp.layer === "espn") {
          const teamId = espnTeamId(s, sp.espn);
          if (!teamId) continue;
          for (const st of isSoccer(sp.espn) ? [2] : [2, 3]) {
            out.push({ key: `${s.id}|espn|${sp.espn}|y${y}|${st}`, school: s.id, layer: "espn", ref: sp.espn, phase: "hist", ttl: TTL_HIST_MIN,
              url: espnUrl(sp.espn, teamId, espnSeason(fam, y), st), Y: y, fam, teamId });
          }
        }
      }
    }
  }
  return out;
}

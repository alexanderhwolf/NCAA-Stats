// Every page the refresh queue knows about, derived from the school config and today's date.
// Keys are stable across a season; the URL moves when the season rolls over.

import { SCHOOLS, espnTeamId } from "./schools.js";
import { espnUrl, isSoccer } from "./espn.js";
import { family, startYear, sidearmSeason, espnSeason } from "./season.js";

export const TTL_CUR_MIN = 180;          // current season: every 3 hours
export const TTL_PREV_MIN = 7 * 24 * 60; // finished season: weekly is plenty
export const TTL_POST_MIN = 24 * 60;     // current postseason list: daily (TODO: every 3 h during each sport's postseason)

export function sourcesFor(today) {
  const Y = startYear(today);
  const out = [];
  for (const s of SCHOOLS) {
    const seenSlug = new Set();
    for (const sp of s.sports) {
      const fam = family(sp);
      for (const [phase, y] of [["cur", Y], ["prev", Y - 1]]) {
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
        }
      }
    }
  }
  return out;
}

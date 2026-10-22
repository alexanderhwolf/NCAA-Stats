// Layer 3: TFRRS (tfrrs.org), the results service most college cross country and track meets
// post to. Two page kinds:
//   team page  /teams/xc/<slug>.html  "Latest Results": every meet the team ran, with links
//   meet page  /results/xc/<id>/<name> "Team Results" tables (men, women): place, team, score
// A meet page covers every school at that meet, so one fetch places several Big 12 teams.
// Like the other parsers, these never throw: an unexpected page parses to empty lists.

const MON = { january: 1, february: 2, march: 3, april: 4, may: 5, june: 6, july: 7, august: 8, september: 9, october: 10, november: 11, december: 12 };
const iso = (y, m, d) => `${y}-${String(m).padStart(2, "0")}-${String(d).padStart(2, "0")}`;
const clean = s => String(s || "").replace(/<[^>]+>/g, " ").replace(/&amp;/g, "&").replace(/&nbsp;/g, " ").replace(/\s+/g, " ").trim();

// "October 16, 2026", "June 10-13, 2026", "April  1- 4, 2026", "October 31-November 1, 2026"
export function parseTfrrsDate(s) {
  const t = clean(s).toLowerCase();
  let m = t.match(/^([a-z]+)\s+(\d{1,2})\s*-\s*([a-z]+)\s+(\d{1,2}),\s*(\d{4})$/);
  if (m && MON[m[1]] && MON[m[3]]) return { date: iso(+m[5], MON[m[1]], +m[2]), end: iso(+m[5], MON[m[3]], +m[4]) };
  m = t.match(/^([a-z]+)\s+(\d{1,2})(?:\s*-\s*(\d{1,2}))?,\s*(\d{4})$/);
  if (m && MON[m[1]]) return { date: iso(+m[4], MON[m[1]], +m[2]), end: m[3] ? iso(+m[4], MON[m[1]], +m[3]) : null };
  return null;
}

export function parseTeamPage(html) {
  const out = { meets: [] };
  const s = String(html || "");
  const i = s.search(/LATEST RESULTS/i);
  if (i < 0) return out;
  const body = s.slice(i, s.indexOf("</table>", i) + 8);
  for (const row of body.matchAll(/<tr>\s*<td>([\s\S]*?)<\/td>\s*<td>\s*<a[^>]*href="([^"]+)"[^>]*>([\s\S]*?)<\/a>/g)) {
    const d = parseTfrrsDate(row[1]);
    const href = row[2];
    const id = href.match(/\/results\/(?:xc\/)?(\d+)\//)?.[1];
    if (!d || !id) continue;
    out.meets.push({ ...d, name: clean(row[3]), id, xc: /\/results\/xc\//.test(href), url: new URL(href, "https://www.tfrrs.org").href });
  }
  return out;
}

// { teams: { Men: [{ pl, slug, name, score }], Women: [...] } } from the "Team Results" tables.
// Teams that didn't field a scoring five aren't in these tables at all.
export function parseMeetPage(html) {
  const out = { name: null, teams: {} };
  const s = String(html || "");
  out.name = clean(s.match(/<h3[^>]*class="[^"]*panel-title[^"]*"[^>]*>([\s\S]*?)<\/h3>/)?.[1]) || null;
  for (const h of s.matchAll(/<h3[^>]*>\s*((?:Men|Women)[^<]*?Team Results)/g)) {
    const g = /^Women/.test(h[1]) ? "Women" : "Men";
    const start = h.index;
    const tb = s.indexOf("<tbody", start), end = s.indexOf("</table>", start);
    if (tb < 0 || end < tb) continue;
    const rows = [];
    for (const tr of s.slice(tb, end).matchAll(/<tr>([\s\S]*?)<\/tr>/g)) {
      const pl = tr[1].match(/<td>\s*(\d+)\s*<\/td>/)?.[1];
      const a = tr[1].match(/href="[^"]*\/teams\/(?:xc\/)?([A-Z]{2}_college_[mf]_[^."]+)\.html"[^>]*>([\s\S]*?)<\/a>/);
      const score = tr[1].match(/id="team_score_\d+">\s*(\d+)\s*</)?.[1];
      if (pl && a) rows.push({ pl: +pl, slug: a[1], name: clean(a[2]), score: score ? +score : null });
    }
    // A meet can list several races per gender (varsity, open); keep the first, the varsity race.
    if (rows.length && !out.teams[g]) out.teams[g] = rows;
  }
  return out;
}

const ord = n => n + (n % 100 >= 11 && n % 100 <= 13 ? "th" : ["th", "st", "nd", "rd"][n % 10] || "th");

// The place string for one school at one meet, or null when it didn't place as a team.
export function placeAt(meet, slug, g) {
  const rows = meet?.teams?.[g];
  const r = rows?.find(x => x.slug === slug);
  if (!r) return null;
  const tied = rows.filter(x => x.pl === r.pl).length > 1;
  return `${tied ? "T-" : ""}${ord(r.pl)} of ${rows.length}`;
}

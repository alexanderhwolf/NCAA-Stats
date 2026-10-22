// The Big 12's own standings (big12sports.com): the official conference and overall record of
// every member, for each head-to-head sport, with every season back to 2005 in a season list.
// Used as the official check on the game-by-game sources (ESPN's softball schedules, for one,
// can miss games: Texas Tech 2026 was 61-10 official, 55-6 on ESPN).
//
// The page's desktop columns don't line up with their headers on some sports (baseball), but the
// mobile cells (aria-hidden) are always School, Big 12, Overall, so those are what's read.

export const B12_HOST = "big12sports.com";
// Our sport (name, g) -> the conference site's standings page. Soccer's default page has no
// table, so it's addressed by a season id; its season list still names every season.
export const STANDINGS = [
  { name: "Football", g: "Men", path: "football", url: "/standings.aspx?path=football" },
  { name: "Volleyball", g: "Women", path: "vb", url: "/standings.aspx?path=vb" },
  { name: "Soccer", g: "Women", path: "soc", url: "/standings.aspx?standings=238" },
  { name: "Basketball", g: "Men", path: "mbball", url: "/standings.aspx?path=mbball" },
  { name: "Basketball", g: "Women", path: "wbball", url: "/standings.aspx?path=wbball" },
  { name: "Baseball", g: "Men", path: "baseball", url: "/standings.aspx?path=baseball" },
  { name: "Softball", g: "Women", path: "softball", url: "/standings.aspx?path=softball" },
  { name: "Tennis", g: "Men", path: "mten", url: "/standings.aspx?path=mten" },
  { name: "Tennis", g: "Women", path: "wten", url: "/standings.aspx?path=wten" },
  { name: "Equestrian", g: "Women", path: "equest", url: "/standings.aspx?path=equest" },
  { name: "Gymnastics", g: "Women", path: "gym", url: "/standings.aspx?path=gym" },
  { name: "Wrestling", g: "Men", path: "wrestling", url: "/standings.aspx?path=wrestling" },
  { name: "Lacrosse", g: "Women", path: "wlax", url: "/standings.aspx?path=wlax" },
  { name: "Beach Volleyball", g: "Women", path: "wbvball", url: "/standings.aspx?path=wbvball" },
];
export const standingsFor = sp => STANDINGS.find(x => x.name === sp.name && x.g === sp.g) || null;

const clean = s => String(s || "").replace(/<[^>]+>/g, " ").replace(/&amp;/g, "&").replace(/&nbsp;/g, " ").replace(/\s+/g, " ").trim();

export function parseStandings(html) {
  const s = String(html || "");
  const out = { title: null, seasons: [], rows: [] };
  out.title = clean(s.match(/<caption[^>]*>([\s\S]*?)<\/caption>/i)?.[1]) || clean(s.match(/<title>([\s\S]*?)<\/title>/i)?.[1]).split(" - ")[0] || null;
  const sel = s.match(/<select[^>]*ddl_past_standings[^>]*>([\s\S]*?)<\/select>/i)?.[1] || "";
  for (const o of sel.matchAll(/<option[^>]*value="(\d+)"[^>]*>([\s\S]*?)<\/option>/gi)) out.seasons.push({ id: +o[1], title: clean(o[2]) });
  const tb = s.match(/<table[^>]*sidearm-standings-table[^>]*>[\s\S]*?<tbody>([\s\S]*?)<\/tbody>/i)?.[1] || "";
  for (const tr of tb.matchAll(/<tr[^>]*>([\s\S]*?)<\/tr>/gi)) {
    const cells = [...tr[1].matchAll(/<td[^>]*aria-hidden="true"[^>]*>([\s\S]*?)<\/td>/gi)].map(m => m[1]);
    if (cells.length < 3) continue;
    const school = clean(cells[0].match(/<a[^>]*>([\s\S]*?)<\/a>/i)?.[1] || cells[0]);
    const conf = clean(cells[1]), overall = clean(cells[2]);
    if (school && /^\d+-\d+(-\d+)?$/.test(overall)) out.rows.push({ school, conf: /^\d+-\d+(-\d+)?$/.test(conf) ? conf : null, overall });
  }
  return out;
}

// Is this season-list title the season starting in Y? Titles follow the school-site style
// ("2026 Volleyball", "2025-26 Men's Basketball"), but tennis and gymnastics are titled by
// their spring year ("2026 Men's Tennis" is 2025-26).
export function standingsSeasonMatches(title, fam, Y) {
  const t = String(title || "");
  const range = `${Y}-${String((Y + 1) % 100).padStart(2, "0")}`;
  if (fam === "fall") return new RegExp(`(^|\\D)${Y}(?!-)(\\D|$)`).test(t);
  if (t.includes(range)) return fam === "academic";
  return new RegExp(`(^|\\D)${Y + 1}(?!-)(\\D|$)`).test(t);
}

export const recParts = r => { const p = String(r || "").split("-").map(Number); return p.length >= 2 && p.every(Number.isFinite) ? { w: p[0], l: p[1], t: p[2] || 0 } : null; };

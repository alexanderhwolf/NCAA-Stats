// Layer 2: a school's Sidearm text-only schedule page, /sports/<slug>/schedule/<season>/text.
// It has record lines (Overall, Conference, Streak ...) and one table with the columns
// Date | Time | At | Opponent | Location | Tournament | Result.
// The parser reads the table by header name, not position, and never trusts class names.
// Confirm against real pages captured with /probe (test/fixtures/).

import { yearFor } from "./season.js";

const MONTHS = { jan: 1, feb: 2, mar: 3, apr: 4, may: 5, jun: 6, jul: 7, aug: 8, sep: 9, sept: 9, oct: 10, nov: 11, dec: 12 };

const ENT = { amp: "&", lt: "<", gt: ">", quot: '"', apos: "'", nbsp: " ", ndash: "-", mdash: "-", rsquo: "'", lsquo: "'", ldquo: '"', rdquo: '"' };
export function text(html) {
  return String(html || "")
    .replace(/<(script|style)[\s\S]*?<\/\1>/gi, " ")
    .replace(/<br\s*\/?>/gi, " ")
    .replace(/<\/?(?:td|th|tr|table|thead|tbody|div|p|li|ul|ol|span|h\d|section|header|footer|dt|dd|dl)\b[^>]*>/gi, " ")
    .replace(/<[^>]+>/g, "")
    .replace(/&#(\d+);/g, (_, n) => String.fromCharCode(+n))
    .replace(/&#x([0-9a-f]+);/gi, (_, n) => String.fromCharCode(parseInt(n, 16)))
    .replace(/&([a-z]+);/gi, (m, n) => ENT[n.toLowerCase()] ?? m)
    .replace(/[–—]/g, "-")
    .replace(/\s+/g, " ")
    .trim();
}

function tables(html) {
  const out = [];
  const re = /<table[\s\S]*?<\/table>/gi;
  let m;
  while ((m = re.exec(html))) {
    const rows = [];
    const rr = /<tr[\s\S]*?<\/tr>/gi;
    let r;
    while ((r = rr.exec(m[0]))) {
      const cells = [];
      const cr = /<t([hd])[^>]*>([\s\S]*?)<\/t\1>/gi;
      let c;
      while ((c = cr.exec(r[0]))) cells.push(text(c[2]));
      if (cells.length) rows.push(cells);
    }
    out.push(rows);
  }
  return out;
}

function recordLines(t) {
  const rec = s => s && s.replace(/\s+/g, "");
  const grab = re => { const m = t.match(re); return m ? rec(m[1]) : null; };
  const streak = t.match(/Streak\s*:?\s*([WLT])\s*-?\s*(\d+)/i);
  return {
    overall: grab(/Overall\s*:?\s*(\d+\s*-\s*\d+(?:\s*-\s*\d+)?)/i),
    conf: grab(/Conf(?:erence)?\.?\s*:?\s*(\d+\s*-\s*\d+(?:\s*-\s*\d+)?)/i),
    streak: streak ? streak[1].toUpperCase() + streak[2] : null,
  };
}

function parseDate(s, Y) {
  const m = String(s).match(/([A-Za-z]{3,4})\.?\s+(\d{1,2})/);
  if (!m) return null;
  const mo = MONTHS[m[1].toLowerCase()];
  if (!mo) return null;
  const y = yearFor(mo, Y);
  const date = `${y}-${String(mo).padStart(2, "0")}-${String(+m[2]).padStart(2, "0")}`;
  // "Oct 19-21" or "Oct 30 (Fri) - Nov 1 (Sun)": keep the last day as end.
  let end = null;
  const r1 = String(s).match(/[A-Za-z]{3,4}\.?\s+\d{1,2}\s*(?:\([A-Za-z]+\))?\s*-\s*(\d{1,2})\b(?!\s*:)/);
  const r2 = String(s).match(/-\s*([A-Za-z]{3,4})\.?\s+(\d{1,2})/);
  if (r2 && MONTHS[r2[1].toLowerCase()]) {
    const mo2 = MONTHS[r2[1].toLowerCase()];
    end = `${yearFor(mo2, Y)}-${String(mo2).padStart(2, "0")}-${String(+r2[2]).padStart(2, "0")}`;
  } else if (r1) {
    end = `${y}-${String(mo).padStart(2, "0")}-${String(+r1[1]).padStart(2, "0")}`;
  }
  return { date, end };
}

const AT = s => /^home$|^vs\.?$/i.test(s) ? "Home" : /^away$|^at$|^@$/i.test(s) ? "Away" : /^neutral$|^n$/i.test(s) ? "Neutral" : (s || null);
const EXH = /\bexh(ibition)?\b|scrimmage|intrasquad|alumni|fall ball|blue.?white|gold vs\.? blue/i;
const PLACE = /\b(T-?)?(\d{1,2})(st|nd|rd|th)\b(?:\s*(?:of|\/)\s*(\d{1,3}))?/i;

function genderOf(row) {
  const s = row.join(" ");
  const men = /\((M|Men)\)|\bMen'?s\b/i.test(s);
  const women = /\((W|Women)\)|\bWomen'?s\b/i.test(s);
  return men && !women ? "Men" : women && !men ? "Women" : null;
}

// Each event carries g ("Men"/"Women"/null) from gender markers in the row, so a page shared
// by men's and women's teams can be split later (src/assemble.js).
export function parseSidearm(html, { Y, isFallBallSport = false } = {}) {
  const out = { label: null, record: { overall: null, conf: null, streak: null }, events: [] };
  if (!html) return out;
  // The text page is ~330 KB, almost all of it app scaffolding. The schedule lives in <main>
  // (about 9 KB); cutting to it first keeps parsing inside the Workers CPU limit.
  html = String(html);
  const m0 = html.indexOf("<main"), m1 = html.indexOf("</main>");
  if (m0 >= 0 && m1 > m0) html = html.slice(m0, m1);
  const t = text(html);
  const h1 = html.match(/<h1[^>]*>([\s\S]*?)<\/h1>/i);
  out.label = h1 ? text(h1[1]) : null;
  const tbl = tables(html).find(rows => rows[0] && rows[0].some(h => /opponent/i.test(h)) && rows[0].some(h => /date/i.test(h)));
  // Record lines sit outside the schedule table.
  out.record = recordLines(t.replace(tbl ? tbl.flat().join(" ") : "", " "));
  if (!tbl) return out;
  const head = tbl[0].map(h => h.toLowerCase());
  const col = name => { const i = head.findIndex(h => h === name); return i >= 0 ? i : head.findIndex(h => h.split(/\W+/).includes(name)); };
  const ix = { date: col("date"), time: col("time"), at: col("at"), opp: col("opponent"), loc: col("location"), tour: col("tournament"), res: col("result") };
  for (const row of tbl.slice(1)) {
    const get = k => (ix[k] >= 0 ? row[ix[k]] ?? "" : "");
    const d = parseDate(get("date"), Y);
    if (!d) continue;
    const rg = genderOf(row);
    const res = get("res").trim().replace(/^[-\u2013\u2014]$/, "");
    const opp = get("opp").replace(/^(#|No\.\s*)\d+\s+/i, "").replace(/\s*\*$/, "").trim();
    const mo = Number(d.date.slice(5, 7));
    const exhibition = EXH.test(opp + " " + get("tour") + " " + res) || (isFallBallSport && mo >= 8);
    const wl = res.match(/^(W|L|T)(?=[\s,]|$)[,\s]*(.*)$/i);
    const pl = !wl && res.match(PLACE);
    out.events.push({
      date: d.date,
      end: d.end,
      time: get("time") || null,
      at: AT(get("at")),
      opp: opp.replace(/\s*[\[(](exh\.?|exhibition)[\])]/i, "").trim(),
      location: get("loc") || null,
      tournament: get("tour") || null,
      result: wl ? `${wl[1].toUpperCase()} ${wl[2].replace(/\s+/g, "")}`.trim() : null,
      place: pl ? `${pl[1] ? "T-" : ""}${pl[2]}${pl[3].toLowerCase()}${pl[4] ? " of " + pl[4] : ""}` : null,
      raw: res || null,
      exhibition,
      conf: /\*/.test(get("opp")) || null,
      g: rg,
    });
  }
  return out;
}

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
  // The season heading ("2026 Cross Country Schedule"). Some templates put a screen-reader h1
  // with the site name first (Texas Tech: "Texas Tech University Athletics"), so prefer the h1
  // that names a season; with none, the label stays null rather than a site name.
  const h1s = [...html.matchAll(/<h1[^>]*>([\s\S]*?)<\/h1>/gi)].map(m => text(m[1]));
  out.label = h1s.find(h => /\b(19|20)\d\d\b/.test(h)) || null;
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
    // "-" and "N -" are placeholders for "no result posted".
    const res = get("res").trim().replace(/^(?:[A-Z]\s*)?[-\u2013\u2014]$/, "");
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
  out.events = mergeRounds(out.events);
  return out;
}

// Golf, tennis and multi-day meets list one row per day. Fold consecutive rows for the same
// event (same name, a day or less apart) into one, keeping the first date, the last date as
// end, and the latest result or place.
export function mergeRounds(events) {
  const out = [];
  const key = x => `${x.opp}|${x.tournament || ""}|${x.g || ""}`;
  for (const e of events) {
    const prev = out[out.length - 1];
    if (prev && key(prev) === key(e) && !prev.result && dayGap(prev.end || prev.date, e.date) <= 1) {
      prev.end = e.end || e.date;
      prev.result = e.result || prev.result;
      prev.place = e.place || prev.place;
      prev.raw = e.raw || prev.raw;
      continue;
    }
    out.push({ ...e });
  }
  return out;
}
const dayGap = (a, b) => Math.round((Date.parse(b) - Date.parse(a)) / 86_400_000);

// ---------------------------------------------------------------------------------------
// The regular schedule page (/sports/<slug>/schedule). Its text-only twin leaves meet
// placings out, but on TCU's page template each event carries a screen-reader heading:
//   "Completed Event: Cross Country at Arturo Barrios Invitational on October 16, 2026 , , M: 10th | W: 19th"
//   "Completed Event: Women's Golf versus Jim West Challenge on October 19, 2026 , , 1st/11"
//   "Completed Event: Triathlon at Navy Collegiate Cup on October 4, 2026 , , 1st Place (286 Points)"
// Other templates (Baylor, BYU) have no such headings; then this returns no events.
const MONTHS_LONG = { january: 1, february: 2, march: 3, april: 4, may: 5, june: 6, july: 7, august: 8, september: 9, october: 10, november: 11, december: 12 };

function normPlace(s) {
  s = String(s || "").trim();
  const m = s.match(/^(T-?)?(\d{1,2})(st|nd|rd|th)\b(?:\s*(?:place)?\s*(?:\/|of)\s*(\d{1,3}))?/i);
  return m ? `${m[1] ? "T-" : ""}${m[2]}${m[3].toLowerCase()}${m[4] ? " of " + m[4] : ""}` : null;
}

export function parseRegular(html) {
  const out = { events: [], headings: 0 };
  const re = /<h3 class="sr-only"[^>]*>([\s\S]*?)<\/h3>/g;
  let m;
  while ((m = re.exec(String(html || "")))) {
    out.headings++;
    const t = text(m[1].replace(/<!--[\s\S]*?-->/g, ""));
    const h = t.match(/^Completed Event:\s*.+?\s(?:at|versus|vs\.?)\s(.+?)\son\s([A-Za-z]+)\s(\d{1,2}),\s(\d{4})\s*(.*)$/);
    if (!h) continue;
    const mo = MONTHS_LONG[h[2].toLowerCase()];
    if (!mo) continue;
    const date = `${h[4]}-${String(mo).padStart(2, "0")}-${String(+h[3]).padStart(2, "0")}`;
    const rest = h[5].replace(/^[\s,]+/, "").trim();
    const base = { date, opp: h[1].trim() };
    if (/cancel|postpon/i.test(rest)) { out.events.push({ ...base, g: null, place: null, canceled: true }); continue; }
    const mw = rest.match(/M:\s*([^|]+)\|\s*W:\s*(.+)$/i);
    if (mw) {
      out.events.push({ ...base, g: "Men", place: normPlace(mw[1]) });
      out.events.push({ ...base, g: "Women", place: normPlace(mw[2]) });
    } else {
      const p = normPlace(rest);
      if (p) out.events.push({ ...base, g: null, place: p });
    }
  }
  return out;
}

// Fill placings into a meet sport's text-page events from regular-page events: same date
// (or within a multi-day event's span) and the same gender when the page splits them.
// For multi-round events the latest round's standing is the finish.
export function mergePlacings(events, reg, g) {
  if (!reg?.length) return events;
  return events.map(e => {
    if (e.place || e.result) return e;
    const end = e.end || e.date;
    const hits = reg.filter(r => r.date >= e.date && r.date <= end && (!r.g || g === "Coed" || r.g === g));
    if (!hits.length) return e;
    const last = hits.sort((a, b) => a.date.localeCompare(b.date)).at(-1);
    if (last.canceled) return { ...e, canceled: true };
    return { ...e, place: last.place, placeFrom: "schedule page" };
  });
}

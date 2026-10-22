// Turns stored page rows into one document per school, in the same shape the page reads:
// { id, school, nickname, site, asOf, sports: [...], week: [...], unverified: [...] }.

import { membersIn, teamMatches } from "./schools.js";
import { family, sidearmSeason, startYear, addDays } from "./season.js";
import { mergePlacings } from "./sidearm.js";
import { placeAt } from "./tfrrs.js";
import { standingsFor, recParts } from "./big12.js";

const MON = ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"];
const md = iso => (iso ? `${MON[+iso.slice(5, 7) - 1]} ${+iso.slice(8, 10)}` : "");
const dash = s => String(s || "").replace(/-/g, "–");

const IN_SEASON_GRACE_DAYS = 21;

function dedupe(events) {
  const seen = new Set();
  return events.filter(e => {
    const k = `${e.date}|${(e.opp || "").toLowerCase()}|${e.time || ""}`;
    if (seen.has(k)) return false;
    seen.add(k);
    return true;
  }).sort((a, b) => (a.date || "").localeCompare(b.date || ""));
}

// Only a label that names a season can say a page is for the wrong one. Pages stored before
// the parser fix carry the site name ("Iowa State University Athletics") as label.
const namesSeason = l => !!l && /\b(19|20)\d\d\b/.test(l);

// Cross country team places from TFRRS for the fall season starting in Y, merged into the
// school's own schedule events by date (or added when the schedule doesn't list the meet).
// A meet whose results are up but where the team didn't score is marked noTeamScore, so it
// isn't reported as "result not posted yet".
const isXC = sp => /Cross Country/.test(sp.name);
function tfrrsMerge(school, sp, data, events, Y) {
  if (!school.tfrrs || !isXC(sp)) return events;
  const gs = (sp.g === "Coed" ? ["Men", "Women"] : [sp.g]).filter(g => school.tfrrs[g]);
  if (!gs.length) return events;
  const lo = `${Y}-07-01`, hi = `${Y + 1}-01-31`;
  const byMeet = new Map();
  for (const g of gs) {
    const team = data(`${school.id}|tfrrs|team-${g}|cur`);
    for (const m of team?.meets || []) {
      if (!m.xc || m.date < lo || m.date > hi) continue;
      const meet = data(`_tfrrs|meet|${m.id}`);
      if (!meet) continue; // not fetched yet: leave the schedule as it is
      const x = byMeet.get(m.id) || { date: m.date, end: m.end, name: m.name, places: {} };
      x.places[g] = placeAt(meet, school.tfrrs[g], g);
      byMeet.set(m.id, x);
    }
  }
  const out = events.map(e => ({ ...e }));
  for (const m of byMeet.values()) {
    const parts = gs.filter(g => m.places[g]).map(g => (gs.length > 1 ? `${g} ` : "") + m.places[g]);
    const place = parts.length ? parts.join(" · ") : null;
    const last = m.end || m.date;
    const e = out.find(x => !x.exhibition && x.date >= addDays(m.date, -1) && x.date <= addDays(last, 1));
    if (e) { if (!e.place) { e.place = place; e.noTeamScore = !place; } }
    else out.push({ date: m.date, end: m.end, time: null, at: null, opp: m.name, location: null, tournament: null, result: null, place, raw: null, exhibition: false, conf: null, g: null, noTeamScore: !place });
  }
  return out.sort((a, b) => (a.date || "").localeCompare(b.date || ""));
}

// The official record for this sport and season, checked against the game-by-game count:
//   - Sidearm schools' ESPN sports: the school's own schedule page states its official record
//     (ESPN's lists can miss games: Texas Tech softball 2025-26, ESPN 55-6, official 61-10).
//   - Big 12 standings, when stored (the conference site currently refuses the Worker, so the
//     standings sources are off; see B12_ENABLED in src/sources.js).
// A finished season shows the official record; in season the official source can trail the
// latest game, so the game-by-game count stands when it has more games. Either way a
// disagreement is kept in check for the page to show.
function applyOfficial(out, overall, conf, source, live) {
  const off = recParts(overall);
  if (!off) return out;
  const str = r => `${r.w}-${r.l}${r.t ? "-" + r.t : ""}`;
  const ours = Number.isFinite(out.w) && Number.isFinite(out.l) ? { w: out.w, l: out.l, t: out.t || 0 } : null;
  const agrees = !!ours && str(ours) === str(off);
  out.check = { source, record: str(off), conf: conf || null, ours: ours ? str(ours) : null, agrees };
  if (agrees) return out;
  // In season, an official source with fewer games is just behind (school text pages can lag a
  // game or two); that's not a disagreement worth flagging.
  if (live && ours && off.w + off.l + off.t < ours.w + ours.l + ours.t) { out.check.behind = true; return out; }
  if (!live || !ours || off.w + off.l + off.t >= ours.w + ours.l + ours.t) {
    Object.assign(out, { w: off.w, l: off.l, t: off.t, recordSource: source });
    if (conf) out.conf = conf;
    if (!ours) out.notes = `Record from the ${source}; game-by-game results aren't available.`;
  }
  return out;
}

function reconcile(out, sp, school, data, y, live, Ycur) {
  if (sp.kind !== "h2h") return out;
  if (school.platform === "sidearm" && sp.layer === "espn" && y >= Ycur - 1) {
    const page = data(`${school.id}|site|${sp.slug}|${y === Ycur ? "cur" : "prev"}`);
    const season = sidearmSeason(family(sp), y);
    if (page?.record?.overall && !(namesSeason(page.label) && !page.label.includes(season))) {
      return applyOfficial(out, page.record.overall, page.record.conf, "school's schedule page", live);
    }
  }
  const st = standingsFor(sp);
  const row = st && data(`conf|b12|${st.path}|y${y}`)?.rows?.find(r => r.school === school.name);
  return row ? applyOfficial(out, row.overall, row.conf, "Big 12 standings", live) : out;
}

const letter = r => (r && /^[WLT]\b/.test(r) ? r[0] : null);

export function summarize(sport, events, recordLine, today) {
  const counted = events.filter(e => letter(e.result) && !e.exhibition && !e.canceled);
  const tally = list => list.reduce((a, e) => (a[letter(e.result)]++, a), { W: 0, L: 0, T: 0 });
  const all = tally(counted);
  const confT = tally(counted.filter(e => e.conf));
  let w = all.W, l = all.L, t = all.T, conf = counted.some(e => e.conf) ? `${confT.W}-${confT.L}${confT.T ? "-" + confT.T : ""}` : null, streak = null;
  if (counted.length) {
    const last = letter(counted[counted.length - 1].result);
    let n = 0;
    for (let i = counted.length - 1; i >= 0 && letter(counted[i].result) === last; i--) n++;
    streak = last + n;
  }
  // The school's own record line wins when present: it reflects their official count.
  if (recordLine?.overall) {
    const p = recordLine.overall.split("-").map(Number);
    if (p.length >= 2 && p.every(Number.isFinite)) { [w, l] = p; t = p[2] || 0; }
    if (recordLine.conf) conf = recordLine.conf;
    if (recordLine.streak) streak = recordLine.streak;
  }
  const finishes = events.filter(e => e.place || e.noTeamScore).map(e => ({ date: e.end || e.date, event: e.opp || e.tournament || "Event", place: e.place || null }));
  const upcoming = events.filter(e => !e.result && !e.place && (e.end || e.date) >= today && !e.canceled);
  const next = upcoming.find(e => !e.exhibition) || upcoming[0] || null;
  const lastGame = counted[counted.length - 1] || null;
  // A meet sport is under way once a non-exhibition event has finished, posted place or not
  // (many schools never post golf or cross country placings on the schedule page).
  const hasResults = sport.kind === "meet"
    ? finishes.length > 0 || events.some(e => !e.exhibition && (e.end || e.date) < today)
    : counted.length > 0 || (!!recordLine?.overall && (w + l + t) > 0);
  // Competed this season (an event date has passed), whether or not a result was posted.
  const played = events.some(e => !e.exhibition && !e.canceled && (e.end || e.date) < today);
  // Past events with nothing posted: say so on the tile ("result not posted yet").
  const pending = events.filter(e => !e.exhibition && !e.canceled && !e.result && !e.place && !e.noTeamScore && (e.end || e.date) < today && (e.end || e.date) >= addDays(today, -21))
    .slice(-2).map(e => `${e.opp || e.tournament || "Event"} (${md(e.end || e.date)}): result not posted yet`);
  const lastFinish = events.filter(e => e.place).at(-1) || null;
  return { w, l, t, conf, streak, finishes, next, lastGame, lastFinish, hasResults, upcoming, played, pending };
}

function shape(sport, sm, phase, season, source) {
  const meet = sport.kind === "meet";
  const ev = e => e && { date: e.date, time: e.time || null, opp: e.opp || e.tournament || "TBA", at: e.at || null };
  return {
    slug: sport.slug, name: sport.name, g: sport.g, kind: sport.kind,
    status: phase, season,
    w: meet ? null : sm.w, l: meet ? null : sm.l, t: meet ? null : sm.t,
    conf: meet ? null : sm.conf, confName: !meet && sm.conf ? "Conf" : null,
    streak: meet || phase !== "in" ? null : sm.streak,
    last: !meet && sm.lastGame ? { date: sm.lastGame.date, opp: sm.lastGame.opp, at: sm.lastGame.at, result: sm.lastGame.result } : null,
    next: ev(sm.next),
    finishes: meet ? sm.finishes : null,
    pending: phase === "in" ? (sm.pending || []) : [],
    summary: phase !== "in" ? finalNote(sport, sm) : null, notes: null, source,
  };
}

// How a finished season ended: its last game (with ESPN's or the school's event label, e.g.
// "NCAA Tournament - Elite 8") or, for a meet sport, its last posted finish.
function finalNote(sport, sm) {
  if (sport.kind === "meet") {
    const f = sm.lastFinish;
    return f ? `Last finish: ${f.place} at ${f.opp || f.tournament || "event"}, ${md(f.end || f.date)}` : null;
  }
  const g = sm.lastGame;
  if (!g) return null;
  const where = g.at === "Away" ? "at" : "vs";
  const label = g.note || (g.tournament && !/^\s*$/.test(g.tournament) ? g.tournament : null);
  return `Last game: ${dash(g.result)} ${where} ${g.opp}${label ? ` (${label})` : ""}, ${md(g.date)}`;
}

export function assembleSchool(school, rows, today) {
  const Y = startYear(today);
  const byKey = new Map(rows.map(r => [r.key, r]));
  const data = k => { const r = byKey.get(k); try { return r?.data ? JSON.parse(r.data) : null; } catch { return null; } };
  const sports = [], week = [], unverified = [];
  const shared = new Set(school.sports.filter((s, i, a) => a.findIndex(x => x.slug === s.slug) !== i).map(s => s.slug));

  for (const sp of school.sports) {
    const fam = family(sp);
    let cur, prev, curUrl, prevUrl, curRows, prevRows;
    // WMT schools read every sport from their own site; until a sport's WMT pages have been
    // fetched at all (right after the switch), the ESPN pages already stored stand in.
    const wmtFetched = school.platform === "wmt" && rows.some(r => r.key.startsWith(`${school.id}|wmt|${sp.slug}|`));
    const isWmt = school.platform === "wmt" && (wmtFetched || sp.layer !== "espn");
    if (sp.layer === "espn" && !isWmt) {
      const k = ph => [2, 3].map(st => `${school.id}|espn|${sp.espn}|${ph}|${st}`);
      curRows = k("cur").map(x => byKey.get(x)).filter(Boolean);
      prevRows = k("prev").map(x => byKey.get(x)).filter(Boolean);
      // ESPN's "nothing there" answers (400 for a season it hasn't published) are stored as empty;
      // if every page for a season is empty, that's no data, not a 0-0 record.
      const merge = keys => { const ds = keys.map(data).filter(d => d && teamMatches(school, d.teamName)); return ds.some(d => !d.empty) ? { events: dedupe(ds.flatMap(d => d.events)), record: null } : null; };
      cur = merge(k("cur")); prev = merge(k("prev"));
      curUrl = curRows[0]?.url; prevUrl = prevRows[0]?.url;
    } else {
      const base = `${school.id}|${isWmt ? "wmt" : "site"}|${sp.slug}`;
      const kc = `${base}|cur`, kp = `${base}|prev`;
      curRows = [byKey.get(kc)].filter(Boolean); prevRows = [byKey.get(kp)].filter(Boolean);
      const split = d => {
        if (!d) return null;
        if (!shared.has(sp.slug)) return d;
        // A shared page: keep this gender's rows plus unmarked rows; the combined record line doesn't apply.
        return { ...d, events: d.events.filter(e => !e.g || e.g === sp.g), record: null };
      };
      cur = split(data(kc)); prev = split(data(kp));
      curUrl = curRows[0]?.url; prevUrl = prevRows[0]?.url;
      // Meet placings the text page leaves out come from the regular schedule page.
      const reg = sp.kind === "meet" && !isWmt ? data(`${school.id}|reg|${sp.slug}|cur`) : null;
      if (cur && reg?.events?.length) cur = { ...cur, events: mergePlacings(cur.events, reg.events, sp.g) };
      // Placings from the Sidearm API (src/sidearmApi.js), matched to the season by its title.
      if (!isWmt && sp.kind === "meet") {
        for (const k of ["cur", "prev"]) {
          const api = data(`${school.id}|sapi|${sp.slug}|${k}`);
          if (!api?.events?.length) continue;
          const lbl = api.label || "";
          if (cur && lbl.includes(sidearmSeason(fam, Y))) cur = { ...cur, events: mergePlacings(cur.events, api.events, sp.g) };
          else if (prev && lbl.includes(sidearmSeason(fam, Y - 1))) prev = { ...prev, events: mergePlacings(prev.events, api.events, sp.g) };
        }
      }
    }
    const label = sp.g === "Coed" ? sp.name : `${sp.g}'s ${sp.name.toLowerCase()}`;
    // Shown as schools write it ("2025-26", "2026"), whichever source the numbers came from.
    const curSeason = sidearmSeason(fam, Y);
    const prevSeason = sidearmSeason(fam, Y - 1);
    // A school page asked for a season it hasn't posted quietly serves its latest one
    // (gymnastics asked for 2026-27 answers "2025-26 Gymnastics Schedule"). Those rows aren't
    // this season: keep them out of the record, and leave last season to the prev page.
    if (sp.layer === "site" && namesSeason(cur?.label) && !cur.label.includes(curSeason)) {
      cur = { ...cur, record: null, events: cur.events.filter(e => (e.end || e.date) >= today).map(e => ({ ...e, exhibition: true })) };
    }

    // Cross country with TFRRS: merge team places; where the school site isn't readable,
    // TFRRS alone is the schedule.
    const tf = school.tfrrs && isXC(sp);
    if (tf) {
      const readable = school.platform === "sidearm" || school.platform === "wmt";
      if (!readable) { cur = { events: [], record: null }; prev = { events: [], record: null }; }
      else { cur ??= { events: [], record: null }; prev ??= { events: [], record: null }; }
      cur = cur && { ...cur, events: tfrrsMerge(school, sp, data, cur.events, Y) };
      prev = prev && { ...prev, events: tfrrsMerge(school, sp, data, prev.events, Y - 1) };
      if (cur && !cur.events.length && !cur.record?.overall) cur = null;
      if (prev && !prev.events.length && !prev.record?.overall) prev = null;
    }
    if (sp.layer === "site" && school.platform !== "sidearm" && !isWmt && !tf) {
      sports.push({ ...shape(sp, { finishes: [] }, "off", null, null), w: null, l: null, notes: "This school's site isn't supported yet." });
      continue;
    }
    if (!cur && !prev) {
      const failing = [...curRows, ...prevRows].find(r => r.last_error);
      unverified.push(`${label}: ${failing ? "source failing (" + failing.last_error + ")" : "not fetched yet"}`);
      sports.push({ ...shape(sp, { finishes: [] }, "off", null, curUrl || null), w: null, l: null, notes: failing ? "Source unavailable right now." : "Waiting for first refresh." });
      continue;
    }
    const smCur = cur ? summarize(sp, cur.events, cur.record, today) : null;
    const lastDate = smCur?.lastGame?.date || smCur?.finishes?.at(-1)?.date || null;
    const recent = lastDate && lastDate >= addDays(today, -IN_SEASON_GRACE_DAYS);
    if (smCur?.hasResults && (smCur.upcoming.some(e => !e.exhibition) || recent)) {
      sports.push(shape(sp, smCur, "in", curSeason, curUrl));
    } else if (smCur?.hasResults) {
      sports.push(shape(sp, smCur, "off", curSeason, curUrl));
    } else if (smCur?.played && smCur.upcoming.length) {
      // In season, but the school's page hasn't posted results (TCU swimming lists its meets
      // with blank results and 0-0). Say so rather than show a 0-0 or call it off-season.
      sports.push({ ...shape(sp, smCur, "in", curSeason, curUrl), w: null, l: null, t: null, conf: null, streak: null, last: null,
        notes: "In season, but the school's schedule page hasn't posted results yet." });
    } else {
      const smPrev = prev ? summarize(sp, prev.events, prev.record, today) : null;
      const out = smPrev ? shape(sp, smPrev, "off", prevSeason, prevUrl) : { ...shape(sp, { finishes: [] }, "off", prevSeason, prevUrl), w: null, l: null };
      out.next = smCur?.next ? { date: smCur.next.date, time: smCur.next.time || null, opp: smCur.next.opp || smCur.next.tournament || "TBA", at: smCur.next.at || null } : null;
      out.last = null;
      if (!smPrev) unverified.push(`${label}: last season not available`);
      sports.push(out);
    }
    for (const e of cur?.events || []) {
      const end = e.end || e.date;
      if (end >= today && e.date <= addDays(today, 6)) {
        week.push({ date: e.date < today ? today : e.date, time: e.time || null, sport: sp.name, g: sp.g, opp: (e.opp || e.tournament || "TBA") + (e.exhibition ? " (exhibition)" : ""), at: e.at || null, result: e.result || e.place || null });
      }
    }
  }
  // Official Big 12 records: in-season tiles against this season's standings, off-season tiles
  // against the season they show.
  for (const out of sports) {
    const sp = school.sports.find(x => x.slug === out.slug && x.name === out.name && x.g === out.g);
    if (!sp) continue;
    const y = out.status === "in" || out.season === sidearmSeason(family(sp), Y) ? Y : Y - 1;
    reconcile(out, sp, school, data, y, out.status === "in", Y);
  }
  const okTimes = rows.map(r => r.last_ok).filter(Boolean);
  const seen = new Set();
  return {
    id: school.id, school: school.name, nickname: school.nickname, site: `https://${school.domain}`,
    asOf: okTimes.length ? new Date(Math.max(...okTimes)).toISOString() : null,
    sports,
    week: week.filter(e => { const k = `${e.date}|${e.sport}|${e.g}|${e.opp}`; if (seen.has(k)) return false; seen.add(k); return true; }),
    unverified,
  };
}

// A finished season (y, an academic start year before the current one), every sport final.
// Last season reads the "prev" pages the current board already keeps; older seasons read the
// "y<year>" history pages (src/sources.js historySources). status is "final" throughout.
export function assembleSeason(school, rows, y, Ycur, today) {
  const isPrev = y === Ycur - 1;
  const tag = isPrev ? "prev" : `y${y}`;
  const byKey = new Map(rows.map(r => [r.key, r]));
  const data = k => { const r = byKey.get(k); try { return r?.data ? JSON.parse(r.data) : null; } catch { return null; } };
  const shared = new Set(school.sports.filter((s, i, a) => a.findIndex(x => x.slug === s.slug) !== i).map(s => s.slug));
  const sports = [], unverified = [];
  const season = `${y}-${String((y + 1) % 100).padStart(2, "0")}`;
  for (const sp of school.sports) {
    const fam = family(sp);
    const label = sp.g === "Coed" ? sp.name : `${sp.g}'s ${sp.name.toLowerCase()}`;
    const sideSeason = sidearmSeason(fam, y);
    // Which pages hold this sport for this season.
    const isWmt = school.platform === "wmt";
    const useEspn = sp.layer === "espn" && !isWmt && (isPrev || school.platform !== "sidearm");
    let keys;
    if (useEspn) keys = [2, 3].map(st => `${school.id}|espn|${sp.espn}|${tag}|${st}`);
    else if (school.platform === "sidearm") keys = [`${school.id}|site|${sp.slug}|${tag}`];
    else if (isWmt) keys = [`${school.id}|wmt|${sp.slug}|${tag}`];
    else {
      sports.push({ ...shape(sp, { finishes: [] }, "final", season, null), w: null, l: null, notes: "This school's site isn't supported yet." });
      continue;
    }
    const got = keys.map(k => ({ row: byKey.get(k), d: data(k) }));
    let d = null;
    const ds = got.map(x => x.d).filter(x => x && (!useEspn || teamMatches(school, x.teamName)));
    if (ds.some(x => !x.empty)) {
      d = useEspn ? { events: dedupe(ds.flatMap(x => x.events)), record: null } : ds[0];
      if (!useEspn && shared.has(sp.slug)) d = { ...d, events: d.events.filter(e => !e.g || e.g === sp.g), record: null };
      if (d && isWmt) d = { ...d, events: tfrrsMerge(school, sp, data, d.events, y) };
    }
    const url = got.find(x => x.row)?.row.url || null;
    // A school page asked for an old season sometimes answers with a different one.
    let why = null;
    if (d && !useEspn && namesSeason(d.label) && !d.label.includes(sideSeason)) { why = `the school's page didn't have ${sideSeason}`; d = null; }
    if (!d) {
      const bad = got.map(x => x.row).find(r => r && r.last_error);
      // WMT: the season list says whether a schedule exists for this season at all.
      const cat = isWmt ? data(`${school.id}|wmt|cat-${sp.slug}|cat`) : null;
      if (!why && cat && !got.some(x => x.row)) why = `no ${sideSeason} schedule on the school's site (the program may not have existed then)`;
      if (!why) why = !got.some(x => x.row) ? "not fetched yet"
        : bad?.last_status === 404 ? `no schedule page for ${sideSeason} (the program may not have existed then)`
        : bad ? `source failing (${bad.last_error})` : "not fetched yet";
      unverified.push(`${label}: ${why}`);
      sports.push(reconcile({ ...shape(sp, { finishes: [] }, "final", season, url), w: null, l: null, notes: why === "not fetched yet" ? "Still collecting this season." : "Not available for this season." }, sp, school, data, y, false, Ycur));
      continue;
    }
    const sm = summarize(sp, d.events, d.record, today);
    const out = { ...shape(sp, sm, "final", season, url), next: null, last: null };
    if (sp.kind === "h2h" && !sm.hasResults) {
      Object.assign(out, { w: null, l: null, t: null, conf: null, notes: "No results posted for this season." });
    }
    sports.push(reconcile(out, sp, school, data, y, false, Ycur));
  }
  const okTimes = rows.map(r => r.last_ok).filter(Boolean);
  return {
    id: school.id, school: school.name, nickname: school.nickname, site: `https://${school.domain}`,
    year: y, season, asOf: okTimes.length ? new Date(Math.max(...okTimes)).toISOString() : null,
    sports, week: [], unverified,
  };
}

export function assembleAll(rows, today) {
  const by = new Map();
  for (const r of rows) (by.get(r.school) || by.set(r.school, []).get(r.school)).push(r);
  const schools = membersIn(startYear(today)).map(s => assembleSchool(s, by.get(s.id) || [], today));
  const okTimes = rows.map(r => r.last_ok).filter(Boolean);
  return { asOf: okTimes.length ? new Date(Math.max(...okTimes)).toISOString() : null, today, schools };
}

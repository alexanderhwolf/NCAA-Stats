// Turns stored page rows into one document per school, in the same shape the page reads:
// { id, school, nickname, site, asOf, sports: [...], week: [...], unverified: [...] }.

import { SCHOOLS } from "./schools.js";
import { family, sidearmSeason, startYear, addDays } from "./season.js";

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
  const finishes = events.filter(e => e.place).map(e => ({ date: e.end || e.date, event: e.opp || e.tournament || "Event", place: e.place }));
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
  return { w, l, t, conf, streak, finishes, next, lastGame, hasResults, upcoming, played };
}

function shape(sport, sm, phase, season, source) {
  const meet = sport.kind === "meet";
  const ev = e => e && { date: e.date, time: e.time || null, opp: e.opp || e.tournament || "TBA", at: e.at || null };
  return {
    slug: sport.slug, name: sport.name, g: sport.g, kind: sport.kind,
    status: phase, season,
    w: meet ? null : sm.w, l: meet ? null : sm.l, t: meet ? null : sm.t,
    conf: meet ? null : sm.conf, confName: !meet && sm.conf ? "Conf" : null,
    streak: meet || phase === "off" ? null : sm.streak,
    last: !meet && sm.lastGame ? { date: sm.lastGame.date, opp: sm.lastGame.opp, at: sm.lastGame.at, result: sm.lastGame.result } : null,
    next: ev(sm.next),
    finishes: meet ? sm.finishes : null,
    summary: null, notes: null, source,
  };
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
    if (sp.layer === "espn") {
      const k = ph => [2, 3].map(st => `${school.id}|espn|${sp.espn}|${ph}|${st}`);
      curRows = k("cur").map(x => byKey.get(x)).filter(Boolean);
      prevRows = k("prev").map(x => byKey.get(x)).filter(Boolean);
      const merge = keys => { const ds = keys.map(data).filter(Boolean); return ds.length ? { events: dedupe(ds.flatMap(d => d.events)), record: null } : null; };
      cur = merge(k("cur")); prev = merge(k("prev"));
      curUrl = curRows[0]?.url; prevUrl = prevRows[0]?.url;
    } else {
      const kc = `${school.id}|site|${sp.slug}|cur`, kp = `${school.id}|site|${sp.slug}|prev`;
      curRows = [byKey.get(kc)].filter(Boolean); prevRows = [byKey.get(kp)].filter(Boolean);
      const split = d => {
        if (!d) return null;
        if (!shared.has(sp.slug)) return d;
        // A shared page: keep this gender's rows plus unmarked rows; the combined record line doesn't apply.
        return { ...d, events: d.events.filter(e => !e.g || e.g === sp.g), record: null };
      };
      cur = split(data(kc)); prev = split(data(kp));
      curUrl = curRows[0]?.url; prevUrl = prevRows[0]?.url;
    }
    const label = sp.g === "Coed" ? sp.name : `${sp.g}'s ${sp.name.toLowerCase()}`;
    // Shown as schools write it ("2025-26", "2026"), whichever source the numbers came from.
    const curSeason = sidearmSeason(fam, Y);
    const prevSeason = sidearmSeason(fam, Y - 1);
    // A school page asked for a season it hasn't posted quietly serves its latest one
    // (gymnastics asked for 2026-27 answers "2025-26 Gymnastics Schedule"). Those rows aren't
    // this season: keep them out of the record, and leave last season to the prev page.
    if (sp.layer === "site" && cur?.label && !cur.label.includes(curSeason)) {
      cur = { ...cur, record: null, events: cur.events.filter(e => (e.end || e.date) >= today).map(e => ({ ...e, exhibition: true })) };
    }

    if (sp.layer === "site" && school.platform !== "sidearm") {
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

export function assembleAll(rows, today) {
  const by = new Map();
  for (const r of rows) (by.get(r.school) || by.set(r.school, []).get(r.school)).push(r);
  const schools = SCHOOLS.map(s => assembleSchool(s, by.get(s.id) || [], today));
  const okTimes = rows.map(r => r.last_ok).filter(Boolean);
  return { asOf: okTimes.length ? new Date(Math.max(...okTimes)).toISOString() : null, today, schools };
}

import { test } from "node:test";
import assert from "node:assert/strict";
import { summarize, assembleSchool } from "../src/assemble.js";
import { BY_ID } from "../src/schools.js";
import { sourcesFor } from "../src/sources.js";
import { pickDue } from "../src/refresh.js";

const today = "2026-10-21";
const ev = (date, result, extra = {}) => ({ date, result, opp: "X", at: "Home", ...extra });

test("tally, conference and streak from events", () => {
  const sm = summarize({ kind: "h2h" }, [ev("2026-09-01", "W 3-0"), ev("2026-09-05", "L 1-3", { conf: true }), ev("2026-09-09", "W 3-2", { conf: true }), ev("2026-09-12", "W 3-1"), ev("2026-08-20", "W 3-0", { exhibition: true }), ev("2026-10-30", null)], null, today);
  assert.deepEqual([sm.w, sm.l, sm.t, sm.conf, sm.streak], [3, 1, 0, "1-1", "W2"]);
  assert.equal(sm.next.date, "2026-10-30");
});

test("school record line overrides the count", () => {
  const sm = summarize({ kind: "h2h" }, [ev("2026-09-01", "W 3-0")], { overall: "5-7-1", conf: "2-5", streak: "L3" }, today);
  assert.deepEqual([sm.w, sm.l, sm.t, sm.conf, sm.streak], [5, 7, 1, "2-5", "L3"]);
});

test("in season vs off season", () => {
  const school = { ...BY_ID.tcu, sports: [BY_ID.tcu.sports.find(s => s.slug === "womens-volleyball"), BY_ID.tcu.sports.find(s => s.slug === "baseball")] };
  const vb = { events: [ev("2026-10-18", "L 0-3"), ev("2026-10-23", null)], record: null };
  const bbPrev = { events: [ev("2026-05-20", "L 2-5"), ev("2026-03-01", "W 4-1")], record: null };
  const bbCur = { events: [ev("2027-02-19", null, { opp: "Virginia" })], record: null };
  const rows = [
    { key: "tcu|espn|womens-volleyball|cur|2", url: "u1", data: JSON.stringify(vb), last_ok: 1 },
    { key: "tcu|espn|baseball|cur|2", url: "u2", data: JSON.stringify(bbCur), last_ok: 1 },
    { key: "tcu|espn|baseball|prev|2", url: "u3", data: JSON.stringify(bbPrev), last_ok: 1 },
  ];
  const doc = assembleSchool(school, rows, today);
  const [v, b] = doc.sports;
  assert.equal(v.status, "in");
  assert.deepEqual([v.w, v.l], [0, 1]);
  assert.equal(b.status, "off");
  assert.deepEqual([b.w, b.l], [1, 1]);
  assert.equal(b.next.opp, "Virginia");
  assert.equal(doc.week.length, 1);
});

test("every configured sport has a source, keys are unique", () => {
  const src = sourcesFor(today);
  assert.equal(new Set(src.map(s => s.key)).size, src.length);
  assert.ok(src.every(s => s.url.startsWith("https://")));
});

test("queue: layer caps, one page per school site, spread across schools", () => {
  const src = sourcesFor(today);
  const pick = pickDue(src, [], Date.now(), { espn: 3, site: 4 });
  const site = pick.filter(s => s.layer === "site").map(s => new URL(s.url).host);
  assert.equal(pick.filter(s => s.layer === "espn").length, 3);
  assert.equal(site.length, 4);
  assert.equal(new Set(site).size, 4, "never two pages from one school site in a run");
  assert.ok(new Set(pick.map(s => s.school)).size > 1, "not one school at a time");
});

test("soccer uses ESPN's soccer team ids", () => {
  const src = sourcesFor(today).filter(s => s.school === "arizona" && s.layer === "espn" && s.ref === "womens-soccer");
  assert.ok(src.every(s => s.url.includes("/teams/20503/")));
});

test("a school page serving an older season doesn't count as this season", () => {
  const sp = BY_ID.arizona.sports.find(s => s.slug === "womens-gymnastics");
  const school = { ...BY_ID.arizona, sports: [sp] };
  const stale = { label: "2025-26 Gymnastics Schedule", record: { overall: "13-4" }, events: [ev("2026-02-06", "W 197-195")] };
  const prev = { label: "2025-26 Gymnastics Schedule", record: { overall: "13-4" }, events: [ev("2026-02-06", "W 197-195")] };
  const rows = [
    { key: "arizona|site|womens-gymnastics|cur", url: "c", data: JSON.stringify(stale), last_ok: 1 },
    { key: "arizona|site|womens-gymnastics|prev", url: "p", data: JSON.stringify(prev), last_ok: 1 },
  ];
  const [g] = assembleSchool(school, rows, today).sports;
  assert.equal(g.status, "off");
  assert.equal(g.season, "2025-26");
  assert.deepEqual([g.w, g.l], [13, 4]);
});

test("in season with no posted results says so instead of 0-0 or off-season", () => {
  const sp = BY_ID.tcu.sports.find(s => s.slug === "swimming-and-diving" && s.g === "Women");
  const school = { ...BY_ID.tcu, sports: [sp] };
  const cur = { label: "2026-27 Swimming and Diving Schedule", record: { overall: "0-0" }, events: [ev("2026-10-03", null, { opp: "at Arkansas" }), ev("2026-10-30", null, { opp: "SMU" })] };
  const [s] = assembleSchool(school, [{ key: "tcu|site|swimming-and-diving|cur", url: "u", data: JSON.stringify(cur), last_ok: 1 }], today).sports;
  assert.equal(s.status, "in");
  assert.equal(s.w, null);
  assert.match(s.notes, /hasn't posted results/);
});

test("a finished season says how it ended; past events with nothing posted say so", () => {
  const bb = BY_ID.tcu.sports.find(s => s.espn === "womens-basketball");
  const school = { ...BY_ID.tcu, sports: [bb] };
  const prev = { events: [ev("2026-03-01", "W 70-60"), ev("2026-03-30", "L 60-72", { opp: "South Carolina", at: "Neutral", note: "NCAA Tournament - Elite 8", post: true })] };
  const rows = [{ key: "tcu|espn|womens-basketball|prev|2", url: "p", data: JSON.stringify(prev), last_ok: 1 }];
  const [s] = assembleSchool(school, rows, today).sports;
  assert.equal(s.status, "off");
  assert.equal(s.summary, "Last game: L 60–72 vs South Carolina (NCAA Tournament - Elite 8), Mar 30");

  const xc = BY_ID.tcu.sports.find(x => x.slug === "cross-country" && x.g === "Men");
  const cur = { label: "2026 Cross Country", events: [ev("2026-09-26", null, { opp: "Cowboy Jamboree", place: "7th" }), ev("2026-10-16", null, { opp: "Arturo Barrios Invitational" }), ev("2026-10-31", null, { opp: "Big 12 Championships" })] };
  const [x] = assembleSchool({ ...BY_ID.tcu, sports: [xc] }, [{ key: "tcu|site|cross-country|cur", url: "c", data: JSON.stringify(cur), last_ok: 1 }], today).sports;
  assert.equal(x.status, "in");
  assert.deepEqual(x.pending, ["Arturo Barrios Invitational (Oct 16): result not posted yet"]);
});

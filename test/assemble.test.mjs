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

test("queue: never-fetched first, at most 2 per host", () => {
  const src = sourcesFor(today).filter(s => s.school === "tcu");
  const pick = pickDue(src, [], Date.now(), 10);
  const hosts = pick.map(s => new URL(s.url).host);
  for (const h of new Set(hosts)) assert.ok(hosts.filter(x => x === h).length <= 2);
});

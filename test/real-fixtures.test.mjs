// Real responses captured through /probe on Oct 21, 2026 (test/fixtures/). Unlike the synthetic
// tests, these pin the parsers to what the sites actually send.
import { test } from "node:test";
import assert from "node:assert/strict";
import { readFileSync } from "node:fs";
import { parseSidearm } from "../src/sidearm.js";
import { parseEspnSchedule } from "../src/espn.js";
import { summarize } from "../src/assemble.js";

const fx = f => readFileSync(new URL(`./fixtures/${f}`, import.meta.url), "utf8");

test("TCU women's soccer 2026 text page", () => {
  const r = parseSidearm(fx("tcu-womens-soccer-2026.html"), { Y: 2026 });
  assert.equal(r.label, "2026 Women's Soccer Schedule");
  assert.deepEqual(r.record, { overall: "5-7-1", conf: "2-5-0", streak: "L3" });
  const ex = r.events.filter(e => e.exhibition);
  assert.deepEqual(ex.map(e => e.opp), ["Oklahoma", "Dallas Trinity FC"]);
  assert.equal(ex[0].result, null, "an unplayed '-' is not a result");
  const wis = r.events.find(e => e.opp === "Wisconsin");
  assert.deepEqual([wis.date, wis.at, wis.result], ["2026-08-13", "Away", "W 1-0"]);
  // The rows must agree with the site's own record line.
  const sm = summarize({ kind: "h2h" }, r.events, null, "2026-10-21");
  assert.deepEqual([sm.w, sm.l, sm.t], [5, 7, 1]);
});

test("TCU women's soccer 2025 text page (last season)", () => {
  const r = parseSidearm(fx("tcu-womens-soccer-2025.html"), { Y: 2025 });
  assert.equal(r.label, "2025 Women's Soccer Schedule");
  assert.equal(r.record.overall, "18-3-3");
  assert.ok(r.events.every(e => e.date.startsWith("2025-")));
});

test("ESPN football schedule events", () => {
  const conf = new Set(["239", "277", "2628"]);
  const r = parseEspnSchedule(JSON.parse(fx("espn-tcu-football-2026-two-events.json")), 2628, conf);
  const [bay, wvu] = r.events;
  assert.deepEqual([bay.date, bay.at, bay.opp, bay.result, bay.conf], ["2026-10-17", "Away", "Baylor", "W 17-6", true]);
  assert.deepEqual([wvu.date, wvu.at, wvu.opp, wvu.result, wvu.conf], ["2026-10-24", "Home", "West Virginia", null, true]);
  assert.match(wvu.time, /CT$/);
});

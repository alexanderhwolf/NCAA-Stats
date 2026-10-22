// WMT schools' JSON API (src/wmt.js). Fixture: real BYU responses trimmed to the fields read.
import { test } from "node:test";
import assert from "node:assert/strict";
import { readFileSync } from "node:fs";
import { parseWmtEvents, parseWmtSchedules, scheduleFor } from "../src/wmt.js";
import { wmtEventSources } from "../src/sources.js";
import { assembleSchool } from "../src/assemble.js";
import { BY_ID } from "../src/schools.js";

const fx = JSON.parse(readFileSync(new URL("./fixtures/wmt-byu-events-trimmed.json", import.meta.url), "utf8"));

test("events: scores, venues, exhibitions, meet places", () => {
  const vb = parseWmtEvents(fx.volleyball, "America/Denver");
  assert.deepEqual(vb.events.map(e => [e.date, e.at, e.result, e.exhibition]), [
    ["2026-08-22", "Home", "W 3-0", true], ["2026-08-28", "Neutral", "W 3-2", false], ["2026-08-29", "Away", "W 3-1", false]]);
  assert.equal(vb.events[1].time, "12:00 PM");
  const golf = parseWmtEvents(fx.golf, "America/Denver");
  assert.deepEqual(golf.events.map(e => e.place), ["9th", "1st"]);
  assert.equal(golf.events[0].result, null);
});

test("season lists: fall, spring, academic and the 2020-21 fall season", () => {
  const sch = parseWmtSchedules({ data: [
    { id: 773, name: "Women's Volleyball 2023", season_id: 2 }, { id: 776, name: "Women's Volleyball 2020-2021", season_id: 81 },
    { id: 25, name: "Baseball 2023" }, { id: 176, name: "Men's Basketball 2025-2026" } ] }).schedules;
  assert.equal(scheduleFor(sch, "fall", 2023).id, 773);
  assert.equal(scheduleFor(sch, "fall", 2020).id, 776);
  // Each list is one sport's; these two are checked against their own sport's rows.
  assert.equal(scheduleFor(sch.filter(s => /Baseball/.test(s.name)), "spring", 2022).id, 25); // 2022-23: Baseball 2023
  assert.equal(scheduleFor(sch.filter(s => /Basketball/.test(s.name)), "academic", 2025).id, 176);
  assert.equal(scheduleFor(sch, "fall", 2019), null);
});

test("season pages come from the stored season lists, members only", () => {
  const src = wmtEventSources([{ school: "byu", slug: "womens-volleyball", schedules: [
    { id: 1626, name: "Women's Volleyball 2026" }, { id: 900, name: "Women's Volleyball 2025" }, { id: 773, name: "Women's Volleyball 2023" }, { id: 1, name: "Women's Volleyball 2019" } ] }], "2026-10-21");
  assert.deepEqual(src.map(s => [s.key, s.phase]), [["byu|wmt|womens-volleyball|y2023", "hist"], ["byu|wmt|womens-volleyball|prev", "prev"], ["byu|wmt|womens-volleyball|cur", "cur"]]);
  assert.ok(src[2].url.includes("filter%5Bschedule_id%5D=1626"));
});

test("a WMT school's document reads every sport from its own site", () => {
  const rows = [
    { key: "byu|wmt|womens-volleyball|cur", url: "u", last_ok: 1, data: JSON.stringify(parseWmtEvents(fx.volleyball, "America/Denver")) },
    { key: "byu|wmt|womens-golf|cur", url: "u", last_ok: 1, data: JSON.stringify(parseWmtEvents(fx.golf, "America/Denver")) },
  ];
  const doc = assembleSchool(BY_ID.byu, rows, "2026-09-30");
  const vb = doc.sports.find(s => s.name === "Volleyball" && s.g === "Women");
  assert.equal(`${vb.w}-${vb.l}`, "2-0"); // the exhibition isn't counted
  const golf = doc.sports.find(s => s.name === "Golf" && s.g === "Women");
  assert.deepEqual(golf.finishes.map(f => f.place), ["9th", "1st"]);
  assert.ok(!doc.sports.some(s => s.notes === "This school's site isn't supported yet."));
});

test("until a sport's WMT pages exist, stored ESPN pages stand in", () => {
  const espn = JSON.stringify({ events: [{ date: "2026-09-01", result: "W 3-0", opp: "X", at: "Home" }, { date: "2026-11-01", result: null, opp: "Y", at: "Home" }], teamName: "BYU Cougars" });
  const doc = assembleSchool(BY_ID.byu, [{ key: "byu|espn|womens-volleyball|cur|2", url: "u", last_ok: 1, data: espn }], "2026-10-21");
  const vb = doc.sports.find(s => s.name === "Volleyball" && s.g === "Women");
  assert.equal(`${vb.w}-${vb.l}`, "1-0");
});

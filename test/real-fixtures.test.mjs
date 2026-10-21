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

import { parseRegular, mergePlacings } from "../src/sidearm.js";

test("TCU regular schedule pages: cross country, golf and triathlon placings", () => {
  const xc = parseRegular(fx("tcu-regular-cross-country.html")).events;
  const barrios = xc.filter(e => e.opp === "Arturo Barrios Invitational");
  assert.deepEqual(barrios.map(e => [e.date, e.g, e.place]), [["2026-10-16", "Men", "10th"], ["2026-10-16", "Women", "19th"]]);
  const golf = parseRegular(fx("tcu-regular-womens-golf.html")).events;
  assert.deepEqual(golf.find(e => e.date === "2026-10-19").place, "1st of 11");
  assert.ok(golf.some(e => e.opp === "The Ally" && e.canceled));
  const tri = parseRegular(fx("tcu-regular-triathlon.html")).events;
  assert.deepEqual(tri.find(e => e.date === "2026-10-04").place, "1st");
});

test("placings merge into the text page's events by date and gender", () => {
  const reg = parseRegular(fx("tcu-regular-womens-golf.html")).events;
  const textEvents = [{ date: "2026-10-18", end: "2026-10-19", opp: "Jim West Challenge", place: null, result: null }];
  assert.equal(mergePlacings(textEvents, reg, "Women")[0].place, "1st of 11");
  const xc = parseRegular(fx("tcu-regular-cross-country.html")).events;
  const e = [{ date: "2026-10-16", opp: "Arturo Barrios Invitational", place: null, result: null }];
  assert.equal(mergePlacings(e, xc, "Men")[0].place, "10th");
  assert.equal(mergePlacings(e, xc, "Women")[0].place, "19th");
});

// Texas Tech's text page (captured through /probe Oct 21, 2026; trimmed to <main> and three rows).
// Its first h1 is a screen-reader site name; the season heading is the second h1.
test("Texas Tech: label comes from the season heading, so in-season meets aren't treated as stale", async () => {
  const { parseSidearm } = await import("../src/sidearm.js");
  const { assembleSchool } = await import("../src/assemble.js");
  const { BY_ID } = await import("../src/schools.js");
  const parsed = parseSidearm(fx("ttu-cross-country-2026-main.html"), { Y: 2026 });
  assert.equal(parsed.label, "2026 Cross Country Schedule");
  const rows = [{ key: "texas-tech|site|cross-country|cur", url: "https://texastech.com/sports/cross-country/schedule/text/2026", last_ok: 1, data: JSON.stringify(parsed) }];
  const doc = assembleSchool(BY_ID["texas-tech"], rows, "2026-10-21");
  const xc = doc.sports.find(s => s.name === "Cross Country");
  assert.equal(xc.status, "in");
  assert.ok(xc.pending.some(p => /Arturo Barrios Invite/.test(p)));
  assert.equal(xc.next.opp, "Big 12 Cross Country Championships");
});

test("ESPN: another school's schedule is rejected, and all-empty seasons aren't a 0-0 record", async () => {
  const { teamMatches, BY_ID, espnTeamId } = await import("../src/schools.js");
  const { assembleSchool } = await import("../src/assemble.js");
  assert.equal(espnTeamId(BY_ID["oklahoma-state"], "baseball"), "110");
  assert.equal(espnTeamId(BY_ID["texas-tech"], "softball"), "613");
  assert.equal(teamMatches(BY_ID["oklahoma-state"], "Missouri State Bears"), false);
  assert.equal(teamMatches(BY_ID["texas-tech"], "Texas Tech Lady Raiders"), true);
  const empty = JSON.stringify({ events: [], label: null, teamName: null, empty: true });
  const rows = ["prev|2", "prev|3", "cur|2", "cur|3"].map(k => ({ key: `texas-tech|espn|baseball|${k}`, url: "u", last_ok: 1, data: empty }));
  const bb = assembleSchool(BY_ID["texas-tech"], rows, "2026-10-21").sports.find(s => s.name === "Baseball");
  assert.equal(bb.w, null);
});

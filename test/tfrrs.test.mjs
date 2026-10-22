// TFRRS (cross country). Fixtures are real captures through /probe on Oct 21, 2026, trimmed to
// the parts the parser reads; the trimmed tables keep only a few rows, so "of N" counts here are
// the fixture's, not the meet's.
import { test } from "node:test";
import assert from "node:assert/strict";
import { readFileSync } from "node:fs";
import { parseTeamPage, parseMeetPage, parseTfrrsDate, placeAt } from "../src/tfrrs.js";
import { parseSidearm } from "../src/sidearm.js";
import { assembleSchool } from "../src/assemble.js";
import { BY_ID } from "../src/schools.js";
import { tfrrsMeetSources } from "../src/sources.js";

const fx = f => readFileSync(new URL(`./fixtures/${f}`, import.meta.url), "utf8");

test("dates", () => {
  assert.deepEqual(parseTfrrsDate("October 16, 2026"), { date: "2026-10-16", end: null });
  assert.deepEqual(parseTfrrsDate("April  1- 4, 2026"), { date: "2026-04-01", end: "2026-04-04" });
  assert.deepEqual(parseTfrrsDate("October 31-November 1, 2026"), { date: "2026-10-31", end: "2026-11-01" });
});

test("team page lists meets; cross country ones are flagged", () => {
  const t = parseTeamPage(fx("tfrrs-team-ttu-m-trimmed.html"));
  assert.equal(t.meets.length, 5);
  assert.deepEqual(t.meets[0], { date: "2026-10-16", end: null, name: "Arturo Barrios Invitational", id: "28372", xc: true, url: "https://www.tfrrs.org/results/xc/28372/Arturo_Barrios_Invitational" });
  assert.equal(t.meets.filter(m => m.xc).length, 3);
  // Meet pages to fetch: cross country only, this season and last, nothing in the future.
  const src = tfrrsMeetSources([t], "2026-10-21");
  assert.deepEqual(src.map(s => s.ref).sort(), ["27247", "28300", "28372"]);
});

test("meet page: team places per gender; a team that didn't score has no place", () => {
  const m = parseMeetPage(fx("tfrrs-meet-arturo-barrios-trimmed.html"));
  assert.equal(m.teams.Men.length, 2);
  assert.equal(placeAt(m, "TX_college_f_Texas_Tech", "Women"), "22nd of 2");
  assert.equal(placeAt(m, "TX_college_m_Texas_Tech", "Men"), null);
  assert.equal(placeAt(m, "TX_college_m_Houston", "Men"), "3rd of 2");
});

test("Texas Tech (coed tile): TFRRS places fill the school's blank schedule", () => {
  const sched = parseSidearm(fx("ttu-cross-country-2026-main.html"), { Y: 2026 });
  const team = parseTeamPage(fx("tfrrs-team-ttu-m-trimmed.html"));
  const meet = parseMeetPage(fx("tfrrs-meet-arturo-barrios-trimmed.html"));
  const row = (key, d) => ({ key, url: "u", last_ok: 1, data: JSON.stringify(d) });
  const rows = [
    row("texas-tech|site|cross-country|cur", sched),
    row("texas-tech|tfrrs|team-Men|cur", team),
    row("texas-tech|tfrrs|team-Women|cur", team), // same meet list for the test
    row("_tfrrs|meet|28372", meet),
  ];
  const xc = assembleSchool(BY_ID["texas-tech"], rows, "2026-10-21").sports.find(s => s.name === "Cross Country");
  const f = xc.finishes.find(x => x.event === "Arturo Barrios Invite");
  assert.equal(f.place, "Women 22nd of 2");
  assert.ok(!xc.pending.some(p => /Arturo Barrios/.test(p)), "results are up, so not 'not posted'");
});

// Sidearm API placings (src/sidearmApi.js). Schedule values are TCU women's golf 2025-26 as the
// API returned them in a browser on Oct 21, 2026, trimmed to the fields read. The Nuxt payload
// test is SYNTHETIC: a minimal devalue array shaped like the real one (schedule at index 3).
import { test } from "node:test";
import assert from "node:assert/strict";
import { parseSidearmSchedule, parseSidearmSports, apiSportFor, scheduleIdFromPage } from "../src/sidearmApi.js";
import { sidearmApiSources } from "../src/sources.js";
import { assembleSchool } from "../src/assemble.js";
import { BY_ID } from "../src/schools.js";

const golf = { title: "2025-26 Women's Golf Schedule", games: [
  { date: "2025-08-29T00:00:00", opponent: { title: "Carmel Cup" }, result: { postscoreInfo: "T5th/8" } },
  { date: "2025-08-31T00:00:00", opponent: { title: "Carmel Cup" }, result: { postscoreInfo: "8th/8" } },
  { date: "2025-09-20T00:00:00", opponent: { title: "Schooner Fall Classic" }, result: { postscoreInfo: "4th/16" } },
  { date: "2025-10-20T00:00:00", opponent: { title: "Future Event" }, result: { postscoreInfo: "" } } ] };

test("schedule: placings per round, normalized", () => {
  const p = parseSidearmSchedule(golf);
  assert.equal(p.label, "2025-26 Women's Golf Schedule");
  assert.deepEqual(p.events.map(e => [e.date, e.place]), [["2025-08-29", "T-5th of 8"], ["2025-08-31", "8th of 8"], ["2025-09-20", "4th of 16"]]);
  assert.deepEqual(parseSidearmSchedule({ games: [{ date: "2026-09-05T07:45:00", result: { postscoreInfo: "1st - 31 pts. " } }] }).events[0].place, "1st");
});

test("sport matching and sources: current schedule, last season's page for its id, then its schedule", () => {
  const sports = parseSidearmSports([{ id: 15, globalSportNameSlug: "womens-golf", shortName: "wgolf", title: "Women's Golf", scheduleId: 777 }]).sports;
  assert.equal(apiSportFor(sports, { slug: "womens-golf" }).scheduleId, 777);
  let src = sidearmApiSources([{ school: "tcu", sports }], [], "2026-10-21");
  assert.deepEqual(src.map(s => s.key), ["tcu|sapi|womens-golf|cur", "tcu|sidx|womens-golf|prev"]);
  assert.equal(src[1].url, "https://gofrogs.com/sports/womens-golf/schedule/2025-26");
  src = sidearmApiSources([{ school: "tcu", sports }], [{ key: "tcu|sidx|womens-golf|prev", scheduleId: 752 }], "2026-10-21");
  assert.equal(src.find(s => s.key === "tcu|sapi|womens-golf|prev").url, "https://gofrogs.com/api/v2/Schedule/752");
});

test("schedule id from a regular page's Nuxt payload (synthetic payload)", () => {
  const payload = [["ShallowReactive", 1], { data: 2 }, { s: 3 }, { id: 4, title: 5, games: 6 }, 752, "2025-26 Women's Golf Schedule", [7], { x: 1 }];
  const html = `<html><script type="application/json" id="__NUXT_DATA__" data-ssr="true">${JSON.stringify(payload)}</script></html>`;
  assert.deepEqual(scheduleIdFromPage(html), { scheduleId: 752, title: "2025-26 Women's Golf Schedule" });
  assert.deepEqual(scheduleIdFromPage("<html></html>"), { scheduleId: null, title: null });
});

test("API placings fill last season's golf finishes, last round wins", () => {
  const text = { label: "2025-26 Women's Golf Schedule", record: { overall: null, conf: null, streak: null }, events: [
    { date: "2025-08-29", end: "2025-08-31", opp: "Carmel Cup", result: null, place: null, exhibition: false, g: null },
    { date: "2025-09-20", end: "2025-09-21", opp: "Schooner Fall Classic", result: null, place: null, exhibition: false, g: null } ] };
  const rows = [
    { key: "tcu|site|womens-golf|prev", url: "u", last_ok: 1, data: JSON.stringify(text) },
    { key: "tcu|sapi|womens-golf|prev", url: "u", last_ok: 1, data: JSON.stringify(parseSidearmSchedule(golf)) },
  ];
  const g = assembleSchool(BY_ID.tcu, rows, "2026-10-21").sports.find(s => s.name === "Golf" && s.g === "Women");
  assert.deepEqual(g.finishes.map(f => [f.event, f.place]), [["Carmel Cup", "8th of 8"], ["Schooner Fall Classic", "4th of 16"]]);
});

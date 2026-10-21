// Synthetic response in the shape ESPN's schedule endpoint is believed to use. Confirm against a real capture.
import { test } from "node:test";
import assert from "node:assert/strict";
import { parseEspnSchedule, espnUrl } from "../src/espn.js";

const sample = {
  team: { id: "2628", displayName: "TCU Horned Frogs" },
  events: [
    { date: "2026-10-17T23:00Z", seasonType: { type: 2 }, competitions: [{ neutralSite: false, conferenceCompetition: true,
      status: { type: { completed: true, state: "post" } },
      competitors: [
        { homeAway: "home", team: { id: "239", location: "Baylor" }, score: { value: 6 }, winner: false },
        { homeAway: "away", team: { id: "2628", location: "TCU" }, score: { value: 17 }, winner: true }] }] },
    { date: "2026-10-24T16:00Z", seasonType: { type: 2 }, competitions: [{ neutralSite: false, conferenceCompetition: true,
      status: { type: { completed: false, state: "pre" } },
      competitors: [
        { homeAway: "home", team: { id: "2628", location: "TCU" } },
        { homeAway: "away", team: { id: "277", location: "West Virginia" } }] }] },
  ],
};

test("results are from the team's side", () => {
  const r = parseEspnSchedule(sample, 2628);
  assert.equal(r.events.length, 2);
  assert.deepEqual([r.events[0].date, r.events[0].at, r.events[0].opp, r.events[0].result, r.events[0].conf], ["2026-10-17", "Away", "Baylor", "W 17-6", true]);
  assert.equal(r.events[1].result, null);
  assert.equal(r.events[1].at, "Home");
});

test("bad input never throws", () => {
  assert.deepEqual(parseEspnSchedule(null, 1).events, []);
  assert.deepEqual(parseEspnSchedule({ events: [{}] }, 1).events, []);
});

test("urls", () => {
  assert.equal(espnUrl("womens-soccer", 2628, 2026, 2), "https://site.api.espn.com/apis/site/v2/sports/soccer/usa.ncaa.w.1/teams/2628/schedule?season=2026&seasontype=2");
  assert.equal(espnUrl("rowing", 1, 2026, 2), null);
});

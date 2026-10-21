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
  assert.equal(espnUrl("womens-soccer", 20518, 2026, 2), "https://site.api.espn.com/apis/site/v2/sports/soccer/usa.ncaa.w.1/teams/20518/schedule?season=2026");
  assert.equal(espnUrl("football", 2628, 2026, 3), "https://site.api.espn.com/apis/site/v2/sports/football/college-football/teams/2628/schedule?season=2026&seasontype=3");
  assert.equal(espnUrl("rowing", 1, 2026, 2), null);
});

test("soccer's league-specific season type counts as regular season", () => {
  const ev = { date: "2026-10-17T00:00Z", seasonType: { type: 14226 }, competitions: [{ status: { type: { completed: true } },
    competitors: [{ homeAway: "home", team: { id: "20522", location: "Baylor" }, score: { value: 1 }, winner: true },
                  { homeAway: "away", team: { id: "20518", location: "TCU" }, score: { value: 0 }, winner: false }] }] };
  const [e] = parseEspnSchedule({ events: [ev] }, 20518, new Set(["20522"])).events;
  assert.deepEqual([e.result, e.conf, e.exhibition], ["L 0-1", true, false]);
});

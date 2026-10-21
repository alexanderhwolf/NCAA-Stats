// Synthetic page modeled on rows seen Oct 21, 2026. Replace with real captures in test/fixtures/ once /probe runs.
import { test } from "node:test";
import assert from "node:assert/strict";
import { parseSidearm, text } from "../src/sidearm.js";

const page = `<html><head><title>2026 Women's Volleyball Schedule - Example U</title></head><body>
<div class="record"><span>Overall</span><span>12-5</span><span>0.706</span>
<span>Conference</span><span>5-2</span><span>0.714</span><span>Streak</span><span>L1</span></div>
<table><thead><tr><th>Date</th><th>Time</th><th>At</th><th>Opponent</th><th>Location</th><th>Tournament</th><th>Result</th></tr></thead>
<tbody>
<tr><td>Aug 13 (Thu)</td><td>5:30 p.m.</td><td>Away</td><td>Missouri State [Exhibition]</td><td>Springfield, Mo.</td><td></td><td>W 3-0</td></tr>
<tr><td>Aug 28 (Fri)</td><td>5:30 p.m. CT</td><td>Away</td><td>#4 Pittsburgh</td><td>Pittsburgh, Pa.</td><td>Opening Spike Classic</td><td>L 1-3</td></tr>
<tr><td>Oct 18 (Sun)</td><td>1 p.m.</td><td>Home</td><td>Baylor *</td><td>Lawrence, Kan.</td><td></td><td>W 3-1</td></tr>
<tr><td>Oct 23 (Fri)</td><td>7 p.m.</td><td>Away</td><td>TCU *</td><td>Fort Worth, Texas</td><td></td><td></td></tr>
</tbody></table></body></html>`;

test("record lines are read outside the table", () => {
  const r = parseSidearm(page, { Y: 2026 });
  assert.deepEqual(r.record, { overall: "12-5", conf: "5-2", streak: "L1" });
});

test("rows parse by header name", () => {
  const r = parseSidearm(page, { Y: 2026 });
  assert.equal(r.events.length, 4);
  assert.equal(r.events[0].exhibition, true);
  assert.equal(r.events[0].opp, "Missouri State");
  assert.deepEqual([r.events[1].date, r.events[1].at, r.events[1].opp, r.events[1].result], ["2026-08-28", "Away", "Pittsburgh", "L 1-3"]);
  assert.equal(r.events[2].conf, true);
  assert.equal(r.events[3].result, null);
});

test("spring season dates roll into the next year, fall ball is exhibition", () => {
  const html = `<table><tr><th>Date</th><th>At</th><th>Opponent</th><th>Result</th></tr>
  <tr><td>Oct 17 (Sat)</td><td>Home</td><td>Pima CC</td><td>W 5-2</td></tr>
  <tr><td>Feb 13 (Fri)</td><td>Neutral</td><td>Virginia</td><td></td></tr></table>`;
  const r = parseSidearm(html, { Y: 2026, isFallBallSport: true });
  assert.equal(r.events[0].date, "2026-10-17");
  assert.equal(r.events[0].exhibition, true);
  assert.equal(r.events[1].date, "2027-02-13");
  assert.equal(r.events[1].at, "Neutral");
});

test("meet places and multi-day ranges", () => {
  const html = `<table><tr><th>Date</th><th>Opponent</th><th>Result</th></tr>
  <tr><td>Oct 19 (Mon) - Oct 21 (Wed)</td><td>Abilene Christian Intercollegiate</td><td>T-3rd of 15</td></tr>
  <tr><td>Sep 4 (Fri)</td><td>John McKenzie Invitational (M)</td><td>2nd</td></tr></table>`;
  const r = parseSidearm(html, { Y: 2026 });
  assert.equal(r.events[0].end, "2026-10-21");
  assert.equal(r.events[0].place, "T-3rd of 15");
  assert.equal(r.events[1].place, "2nd");
  assert.equal(r.events[1].g, "Men");
});

test("entities and tags collapse to text", () => {
  assert.equal(text("<b>Texas&nbsp;A&amp;M</b>&#39;s"), "Texas A&M's");
});

test("golf rounds fold into one event; 'N -' is not a result", () => {
  const html = `<table><tr><th>Date</th><th>Opponent</th><th>Result</th></tr>
  <tr><td>Sep 18 (Fri)</td><td>Fighting Illini Invitational</td><td>N -</td></tr>
  <tr><td>Sep 19 (Sat)</td><td>Fighting Illini Invitational</td><td></td></tr>
  <tr><td>Sep 20 (Sun)</td><td>Fighting Illini Invitational</td><td>3rd</td></tr>
  <tr><td>Oct 4 (Sun)</td><td>Trinity Forest Invitational</td><td>N -</td></tr></table>`;
  const r = parseSidearm(html, { Y: 2026 });
  assert.equal(r.events.length, 2);
  assert.deepEqual([r.events[0].date, r.events[0].end, r.events[0].place], ["2026-09-18", "2026-09-20", "3rd"]);
  assert.equal(r.events[1].raw, null);
});

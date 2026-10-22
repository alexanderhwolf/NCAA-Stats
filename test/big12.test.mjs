// Big 12 standings (src/big12.js). Fixtures: real big12sports.com pages, trimmed to two rows.
import { test } from "node:test";
import assert from "node:assert/strict";
import { readFileSync } from "node:fs";
import { parseStandings, standingsSeasonMatches } from "../src/big12.js";
import { confStandingsSources } from "../src/sources.js";
import { assembleSchool, assembleSeason } from "../src/assemble.js";
import { BY_ID } from "../src/schools.js";

const fx = f => readFileSync(new URL(`./fixtures/${f}`, import.meta.url), "utf8");

test("standings: school, conference and overall from the mobile cells", () => {
  const vb = parseStandings(fx("big12-standings-vb-trimmed.html"));
  assert.equal(vb.title, "2026 Volleyball Standings");
  assert.deepEqual(vb.rows, [{ school: "BYU", conf: "7-0", overall: "15-1" }, { school: "Arizona State", conf: "6-1", overall: "15-3" }]);
  assert.deepEqual(vb.seasons[1], { id: 224, title: "2025 Volleyball Standings" });
  // Baseball's desktop headers are shifted; the mobile cells still read right.
  const bb = parseStandings(fx("big12-standings-baseball-trimmed.html"));
  assert.deepEqual(bb.rows[0], { school: "Kansas", conf: "22-8", overall: "45-18" });
});

test("season titles", () => {
  assert.ok(standingsSeasonMatches("2026 Monster Energy Big 12 Football Standings", "fall", 2026));
  assert.ok(standingsSeasonMatches("2025-26 Men's Basketball Standings", "academic", 2025));
  assert.ok(!standingsSeasonMatches("2025-26 Men's Basketball Standings", "academic", 2026));
  assert.ok(standingsSeasonMatches("2026 Baseball Standings", "spring", 2025));
  assert.ok(standingsSeasonMatches("2026 Men's Tennis Standings", "academic", 2025)); // tennis: spring year
  assert.ok(!standingsSeasonMatches("2026-27 Big 12 Wrestling Standings", "academic", 2025));
  assert.ok(standingsSeasonMatches("2026-27 Big 12 Wrestling Standings", "academic", 2026));
});

test("season pages come from each sport's season list", () => {
  const vb = parseStandings(fx("big12-standings-vb-trimmed.html"));
  const src = confStandingsSources([{ path: "vb", seasons: vb.seasons }], "2026-10-21");
  assert.deepEqual(src.map(s => [s.key, s.phase]).slice(-2), [["conf|b12|vb|y2025", "cur"], ["conf|b12|vb|y2026", "cur"]]);
  assert.equal(src.at(-1).url, "https://big12sports.com/standings.aspx?standings=237");
});

const ev = (date, result) => ({ date, result, opp: "X", at: "Home" });
const standings = (school, conf, overall) => JSON.stringify({ title: "t", seasons: [], rows: [{ school, conf, overall }] });

test("a finished season shows the official record and says where the sources disagree", () => {
  // Texas Tech softball 2025-26: ESPN's schedule has 55-6; the Big 12 lists 61-10.
  const games = [...Array(55)].map((_, i) => ev(`2026-03-${String(1 + (i % 28)).padStart(2, "0")}`, "W 5-1")).concat([...Array(6)].map(() => ev("2026-04-10", "L 1-2")));
  const espn = JSON.stringify({ events: games.map((e, i) => ({ ...e, opp: "Team " + i })), teamName: "Texas Tech Red Raiders" });
  const rows = [
    { key: "texas-tech|espn|softball|prev|2", url: "u", last_ok: 1, data: espn },
    { key: "conf|b12|softball|y2025", url: "u", last_ok: 1, data: standings("Texas Tech", "21-3", "61-10") },
  ];
  const sb = assembleSchool(BY_ID["texas-tech"], rows, "2026-10-21").sports.find(s => s.name === "Softball");
  assert.equal(`${sb.w}-${sb.l}`, "61-10");
  assert.equal(sb.conf, "21-3");
  assert.deepEqual(sb.check, { source: "Big 12 standings", record: "61-10", conf: "21-3", ours: "55-6", agrees: false });
});

test("in season, a game-by-game count ahead of the standings stands; agreement is recorded", () => {
  const vbEvents = JSON.stringify({ label: null, record: { overall: null, conf: null, streak: null }, events: [ev("2026-09-01", "W 3-0"), ev("2026-09-05", "W 3-1"), ev("2026-10-30", null)] });
  const base = [{ key: "byu|wmt|womens-volleyball|cur", url: "u", last_ok: 1, data: vbEvents }];
  const lag = assembleSchool(BY_ID.byu, [...base, { key: "conf|b12|vb|y2026", url: "u", last_ok: 1, data: standings("BYU", "0-0", "1-0") }], "2026-10-21").sports.find(s => s.name === "Volleyball" && s.g === "Women");
  assert.equal(`${lag.w}-${lag.l}`, "2-0");
  assert.equal(lag.check.agrees, false);
  const same = assembleSchool(BY_ID.byu, [...base, { key: "conf|b12|vb|y2026", url: "u", last_ok: 1, data: standings("BYU", "0-0", "2-0") }], "2026-10-21").sports.find(s => s.name === "Volleyball" && s.g === "Women");
  assert.equal(same.check.agrees, true);
});

test("a past season with no game-by-game source still gets the official record", () => {
  const doc = assembleSeason(BY_ID.tcu, [{ key: "conf|b12|wten|y2020", url: "u", last_ok: 1, data: standings("TCU", "5-2", "14-6") }], 2020, 2026, "2026-10-21");
  const wt = doc.sports.find(s => s.name === "Tennis" && s.g === "Women");
  assert.equal(`${wt.w}-${wt.l}`, "14-6");
  assert.match(wt.notes, /Big 12 standings/);
});

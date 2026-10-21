// Past seasons: membership by year, history sources, queue priority and season assembly.
// Uses the real TCU women's soccer 2025 text page (test/fixtures/) for the season document.
import { test } from "node:test";
import assert from "node:assert/strict";
import { readFileSync } from "node:fs";
import { BY_ID, membersIn } from "../src/schools.js";
import { sourcesFor, historySources } from "../src/sources.js";
import { pickDue } from "../src/refresh.js";
import { parseSidearm } from "../src/sidearm.js";
import { assembleSeason } from "../src/assemble.js";

const today = "2026-10-21";
const fx = f => readFileSync(new URL(`./fixtures/${f}`, import.meta.url), "utf8");

test("membership follows the conference as it was", () => {
  const ids = y => membersIn(y).map(s => s.id).sort();
  assert.equal(ids(2016).length, 10);
  assert.ok(ids(2019).includes("texas") && ids(2019).includes("oklahoma") && !ids(2019).includes("byu"));
  assert.equal(ids(2023).length, 14);
  assert.ok(ids(2023).includes("byu") && ids(2023).includes("texas") && !ids(2023).includes("utah"));
  assert.equal(ids(2024).length, 16);
  assert.ok(!ids(2024).includes("texas") && ids(2024).includes("utah"));
});

test("current sources leave out former members; history covers members only", () => {
  assert.ok(!sourcesFor(today).some(s => s.phase !== "hist" && (s.school === "texas" || s.school === "oklahoma")));
  const h = historySources(2026);
  assert.ok(h.some(s => s.school === "texas" && s.Y === 2019));
  assert.ok(!h.some(s => s.school === "texas" && s.Y === 2024));
  assert.ok(!h.some(s => s.school === "arizona" && s.Y < 2024));
  assert.deepEqual([...new Set(h.map(s => s.Y))].sort(), [2016, 2017, 2018, 2019, 2020, 2021, 2022, 2023, 2024]);
  // Sidearm schools: the school's own page for every sport, with the season in the URL.
  const t = h.find(s => s.key === "tcu|site|womens-soccer|y2019");
  assert.equal(t.url, "https://gofrogs.com/sports/womens-soccer/schedule/text/2019");
  assert.equal(h.find(s => s.key === "tcu|site|mens-basketball|y2019").url, "https://gofrogs.com/sports/mens-basketball/schedule/text/2019-20");
  // Not Sidearm: ESPN only, and only from when they joined.
  assert.ok(h.some(s => s.key.startsWith("byu|espn|football|y2023")));
  assert.ok(!h.some(s => s.school === "byu" && s.layer === "site"));
});

test("backfill only gets what current and last season leave, newest season first", () => {
  const src = [
    { key: "tcu|site|a|y2016", school: "tcu", layer: "site", phase: "hist", ttl: 1e6, url: "https://a.example/1", Y: 2016 },
    { key: "kansas|site|a|y2024", school: "kansas", layer: "site", phase: "hist", ttl: 1e6, url: "https://b.example/1", Y: 2024 },
    { key: "baylor|site|a|cur", school: "baylor", layer: "site", phase: "cur", ttl: 180, url: "https://c.example/1", Y: 2026 },
  ];
  const pick = pickDue(src, [], Date.now(), { espn: 0, site: 2 });
  assert.deepEqual(pick.map(s => s.key), ["baylor|site|a|cur", "kansas|site|a|y2024"]);
});

test("a past season's missing page waits the full TTL", () => {
  const now = Date.now();
  const src = [{ key: "tcu|site|a|y2016", school: "tcu", layer: "site", phase: "hist", ttl: 60 * 24 * 60, url: "https://a.example/1", Y: 2016 }];
  const rows = [{ key: "tcu|site|a|y2016", url: "https://a.example/1", last_attempt: now - 24 * 3600e3, fail_count: 1, last_status: 404 }];
  assert.equal(pickDue(src, rows, now, { espn: 0, site: 2 }).length, 0);
});

test("season document: official record from the school's page, unavailable sports say why", () => {
  const parsed = parseSidearm(fx("tcu-womens-soccer-2025.html"), { Y: 2025 });
  const rows = [
    { key: "tcu|site|womens-soccer|y2025", url: "https://gofrogs.com/sports/womens-soccer/schedule/text/2025", last_ok: 1, data: JSON.stringify(parsed) },
    { key: "tcu|site|triathlon|y2025", url: "https://gofrogs.com/sports/triathlon/schedule/text/2025", last_status: 404, last_error: "HTTP 404", fail_count: 1, data: null },
    // A page that answered with a different season than asked.
    { key: "tcu|site|womens-rifle|y2025", url: "https://gofrogs.com/sports/womens-rifle/schedule/text/2025-26", last_ok: 1, data: JSON.stringify({ label: "2026-27 Rifle Schedule", events: [], record: {} }) },
  ];
  // Pretend it's 2027-28 so 2025-26 is an older season (history pages, not "prev").
  const doc = assembleSeason(BY_ID.tcu, rows, 2025, 2027, "2027-10-21");
  assert.equal(doc.season, "2025-26");
  const soc = doc.sports.find(s => s.name === "Soccer" && s.g === "Women");
  assert.equal(soc.status, "final");
  assert.equal(`${soc.w}-${soc.l}-${soc.t}`, parsed.record.overall.split("-").concat("0").slice(0, 3).join("-"));
  assert.equal(soc.next, null);
  const tri = doc.sports.find(s => s.name === "Triathlon");
  assert.equal(tri.w, null);
  assert.ok(doc.unverified.some(u => /triathlon: no schedule page for 2025/i.test(u)));
  assert.ok(doc.unverified.some(u => /rifle: the school's page didn't have 2025-26/i.test(u)));
  assert.ok(doc.unverified.some(u => /football: not fetched yet/i.test(u)));
});

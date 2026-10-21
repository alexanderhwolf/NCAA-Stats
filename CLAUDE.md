# NCAA-Stats (big12-board Worker) — notes for Claude

Alex directs from his phone; Claude builds. Deploys run only when Alex starts the Deploy workflow by hand (Actions → Deploy → Run workflow); that's the approval gate, since environment reviewers aren't available on a private repo without Enterprise. Pushes run tests only. Don't deploy any other way unless Alex asks.

## Layout
- `src/index.js` routes: `/api/schools`, `/api/status`, `/probe`, `/api/refresh` + `/api/rebuild` (POST, `x-admin-key`), else static assets.
- `src/schools.js` — the 16 schools, colors, ESPN team ids, sports and Sidearm slugs. Generated once from the Oct 21, 2026 snapshot; now hand-edited.
- `src/sources.js` — every fetchable page for today's date. `src/season.js` — season naming (fall / spring / academic).
- `src/refresh.js` — the cron queue. `src/assemble.js` — school documents in the page's schema.
- `src/espn.js`, `src/sidearm.js` — parsers. Both must stay non-throwing on unexpected input.
- D1 tables: `pages` (queue + parsed data), `docs` (assembled per school), `probe` (raw captures), `runs` (one row per cron run).
- Sidearm season URLs are `/sports/<slug>/schedule/text/<season>` (season AFTER `text`; `/schedule/<season>/text` is a 404). ESPN team schedules don't flag conference games; a regular-season game vs a Big 12 member counts as conference.

## Past seasons (year selector)
- `memberIn()` / `membersIn()` in `src/schools.js`: the Big 12 as it was each season. Texas and Oklahoma are in `SCHOOLS` for 2016-17 to 2023-24 only; current sources skip non-members.
- `historySources()` (phase `hist`, keys `school|site|slug|y2019`): Sidearm schools read every sport from the school's text page; non-Sidearm schools use ESPN. ESPN's pre-2020 seasons are incomplete (TCU women's soccer 2016: 5 matches), so don't switch Sidearm history to ESPN.
- Backfill only uses capacity left after cur/prev, newest season first. Season docs live in `hist_docs`; last season is assembled from `prev` pages.

## Rules
- Plain JS ESM, no build step. Tests: `node --test`. wrangler pinned at 4.120.0; use `npm run`, not `npx wrangler`.
- Never guess a number. If a source fails, the sport shows as unavailable and the school's `unverified` list says why.
- Tests with synthetic fixtures are marked as such. Prefer real captures from `/probe` in `test/fixtures/`.
- The account is on Workers Paid (30 s CPU per run). Be polite to school sites: keep `ESPN_PER_RUN` / `SITE_PER_RUN` small and the 2-per-host cap. An ESPN schedule is ~350 KB JSON (~5 ms CPU to parse); a school page ~1 ms after trimming to `<main>`.
- `/probe` only fetches ESPN and the 16 school domains. Turn it off (`PROBE_ENABLED: "false"`) once fixtures are captured.

## Lessons from the first manual collection (Oct 21, 2026)
- Sidearm `/schedule/text` pages are sometimes stale vs the normal schedule page (Baylor and Colorado football, Houston soccer).
- BYU, UCF and Cincinnati `/schedule/text` errored through WebFetch; check from the Worker before assuming they're broken.
- ESPN through WebFetch looked weeks stale (likely the fetch tool's cache); confirm freshness from the Worker.

# NCAA-Stats: Big 12 records board

Every sport, all 16 Big 12 schools: win-loss records, meet finishes, this week's schedule and a department scorecard.

One Cloudflare Worker does everything:
- **Cron (every minute)** fetches up to 3 ESPN pages and 4 school pages that are due (never two from the same school site), parses them, stores results in D1, and rebuilds the affected schools' documents.
- **`GET /api/schools`** returns all 16 school documents (stitched from stored JSON; no parsing per request).
- **`GET /api/status`** shows queue health: pages with data, failing pages and why.
- **Static page** (`public/index.html`) renders the board from `/api/schools`.

## Two data layers
| Layer | Sports | Source | Parser |
|---|---|---|---|
| 1 | Football, basketball, volleyball, soccer, baseball, softball | ESPN site JSON (`site.api.espn.com`), undocumented | `src/espn.js` |
| 2 | Everything else (equestrian, rifle, golf, swimming, tennis, track...) | The school's Sidearm text-only schedule page | `src/sidearm.js` |

Each page refreshes every 3 hours for the current season and weekly for last season. Failures back off (30 min, 1 h, 2 h ...) and show up in `/api/status`. Never more than 2 requests to one host per run. A run that dies shows in `/api/status` → `runs` as a start with no finish.

Arizona State's site isn't Sidearm, so its layer-2 sports show "not supported yet".

## Setup (once)
1. **Cloudflare API token** → GitHub secret `CLOUDFLARE_API_TOKEN` (Settings → Secrets and variables → Actions).
   Create it in the Cloudflare dashboard from the "Edit Cloudflare Workers" template; make sure it includes **D1: Edit**.
2. **Deploy** → Actions → Deploy → Run workflow. Tests run first; the deploy only happens when you start it.
   Every push runs the tests (CI workflow) but never deploys.

The D1 database (`big12-board`, id in `wrangler.jsonc`) and its tables already exist. To re-apply the schema: `npm run schema:remote`.

## Verifying sources with /probe
While `PROBE_ENABLED` is `"true"`, `GET /probe?u=<https url>` fetches an ESPN or Big 12 school URL from the Worker and stores the raw response in the `probe` table (read it with `wrangler d1 execute` or the Cloudflare connector). That's how parser fixtures in `test/fixtures/` are captured. Turn it off once the parsers are verified.

## Commands
```
npm test                # unit tests (node --test)
npm run dev             # local Worker (local D1; outbound fetches may be blocked in sandboxes)
npm run deploy          # manual deploy (CI normally does this)
npm run tail            # live logs
```

## Known gaps
- ESPN's feed is unofficial and unlicensed. It can change shape or vanish; check ESPN's terms before monetizing. The adapter is isolated so a licensed feed (Genius Sports, Sportradar) can replace it.
- Many schools don't post fall golf, cross country or tennis placings; those tiles stay empty until they do.
- Titles (`public/titles.json`) are a manual list for 2025-26.

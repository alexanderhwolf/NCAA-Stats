-- One row per fetchable page (an ESPN schedule or a school's text-only schedule page).
-- The refresh queue and the parsed result live together: the cron picks due rows,
-- fetches, parses and writes `data` back. /api/schools assembles from these rows.
CREATE TABLE IF NOT EXISTS pages (
  key          TEXT PRIMARY KEY,     -- school|layer|ref|phase[|seasontype]
  school       TEXT NOT NULL,
  layer        TEXT NOT NULL,        -- espn | site
  ref          TEXT NOT NULL,        -- espn sport key, or the site slug
  phase        TEXT NOT NULL,        -- cur | prev
  url          TEXT NOT NULL,
  ttl_min      INTEGER NOT NULL,
  last_attempt INTEGER,              -- epoch ms
  last_ok      INTEGER,              -- epoch ms of the last successful parse
  last_status  INTEGER,              -- HTTP status of the last attempt (0 = network error)
  last_error   TEXT,
  fail_count   INTEGER NOT NULL DEFAULT 0,
  data         TEXT                  -- parsed JSON from the last successful fetch
);
CREATE INDEX IF NOT EXISTS pages_school ON pages(school);

-- Raw responses captured by /probe, for building parser fixtures. Safe to empty anytime.
CREATE TABLE IF NOT EXISTS probe (
  url        TEXT PRIMARY KEY,
  status     INTEGER,
  ctype      TEXT,
  bytes      INTEGER,
  body       TEXT,
  fetched_at INTEGER
);

-- One assembled document per school, rebuilt by the cron whenever that school's pages refresh.
-- /api/schools only concatenates these, so a page view does no parsing.
CREATE TABLE IF NOT EXISTS docs (
  school     TEXT PRIMARY KEY,
  json       TEXT NOT NULL,
  updated_at INTEGER NOT NULL
);

-- One row per cron run: a start with no finish means the run died (CPU limit or crash).
-- Pruned to the last 500 runs by the cron.
CREATE TABLE IF NOT EXISTS runs (
  id       INTEGER PRIMARY KEY AUTOINCREMENT,
  started  INTEGER NOT NULL,
  finished INTEGER,
  picked   TEXT,
  error    TEXT
);

-- One assembled document per school per finished season (academic start year), for the
-- year selector. Last season comes from the "prev" pages, older ones from "y<year>" pages.
CREATE TABLE IF NOT EXISTS hist_docs (
  school     TEXT NOT NULL,
  year       INTEGER NOT NULL,
  json       TEXT NOT NULL,
  updated_at INTEGER NOT NULL,
  PRIMARY KEY (school, year)
);

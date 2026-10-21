// Season math. Three families, because schools label seasons three ways:
//   fall    single year, played Aug-Dec:       Sidearm "2026",    ESPN season=2026
//   spring  single year, played Jan-Jun:       Sidearm "2027",    ESPN season=2027 (fall ball Sep-Nov 2026 lists here too)
//   academic two-year, played Oct-Jun:          Sidearm "2026-27", ESPN season=2027
// "Start year" Y is the calendar year the academic year begins (2026 for 2026-27).

const FALL = new Set(["Football", "Soccer", "Cross Country", "Triathlon"]);
const SPRING = new Set(["Baseball", "Softball", "Beach Volleyball", "Lacrosse", "Water Polo"]);

export function family(sport) {
  if (sport.name === "Volleyball") return sport.g === "Men" ? "spring" : "fall";
  if (FALL.has(sport.name)) return "fall";
  if (SPRING.has(sport.name)) return "spring";
  return "academic";
}

// The local date (YYYY-MM-DD) in the conference's home time zone.
export const TZ = "America/Chicago";
export function localDate(d = new Date(), tz = TZ) {
  return new Intl.DateTimeFormat("en-CA", { timeZone: tz, year: "numeric", month: "2-digit", day: "2-digit" }).format(d);
}

export function startYear(today) {
  const [y, m] = today.split("-").map(Number);
  return m >= 7 ? y : y - 1;
}

// offset 0 = current season, -1 = previous season.
export function sidearmSeason(fam, Y) {
  if (fam === "fall") return String(Y);
  if (fam === "spring") return String(Y + 1);
  return `${Y}-${String((Y + 1) % 100).padStart(2, "0")}`;
}
export function espnSeason(fam, Y) {
  return fam === "fall" ? Y : Y + 1;
}

// Year for a "Mon D" date found on a page for the season that starts in Y.
export function yearFor(month, Y) {
  return month >= 7 ? Y : Y + 1;
}

export function addDays(iso, n) {
  const d = new Date(iso + "T12:00:00Z");
  d.setUTCDate(d.getUTCDate() + n);
  return d.toISOString().slice(0, 10);
}

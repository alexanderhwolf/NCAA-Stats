// Department standings math, shared by both page designs (index.html, night.html).
//
// Two numbers per school:
//   pct  all counted games combined (ties count half). A 30-match volleyball season weighs
//        five times a six-game football start.
//   adj  the average of each counted sport's own win percentage, every sport weighted equally.
//        A sport a school doesn't play, or whose record isn't available, simply drops out of
//        its average instead of counting for or against it.
// And what was left out, with why, so the page can say when a comparison isn't equal.
window.B12 = (() => {
  // The default "fair" view: the three fall team sports nearly every school plays.
  const CORE = [
    { name: "Football", g: "Men" },
    { name: "Volleyball", g: "Women" },
    { name: "Soccer", g: "Women" },
  ];
  const isRecord = s => s && s.kind === "h2h" && s.status === "in" && Number.isFinite(s.w) && Number.isFinite(s.l);
  const pct = (w, l, t = 0) => { const n = w + l + t; return n ? (w + t / 2) / n : null; };
  const label = s => (s.g === "Coed" ? "" : s.g + "'s ") + s.name.toLowerCase();

  function dept(doc, scope) {
    const sports = doc?.sports || [];
    const counted = [], missing = [];
    if (scope === "core") {
      for (const c of CORE) {
        const s = sports.find(x => x.name === c.name && x.g === c.g);
        if (!s) missing.push({ ...c, reason: "no program" });
        else if (isRecord(s)) counted.push(s);
        else missing.push({ ...c, reason: "record not available yet" });
      }
    } else {
      for (const s of sports) {
        if (isRecord(s)) counted.push(s);
        else if (s.kind === "h2h" && s.status === "in") missing.push({ name: s.name, g: s.g, reason: "record not available yet" });
      }
    }
    let w = 0, l = 0, t = 0;
    const per = counted.map(s => {
      w += s.w; l += s.l; t += s.t || 0;
      return { name: s.name, g: s.g, w: s.w, l: s.l, t: s.t || 0, pct: pct(s.w, s.l, s.t || 0) };
    });
    const adj = per.length ? per.reduce((a, x) => a + x.pct, 0) / per.length : null;
    return { w, l, t, n: counted.length, pct: pct(w, l, t), adj, per, missing };
  }

  const fmtPct = p => (p == null ? "—" : p.toFixed(3).replace(/^0/, ""));
  const rec = (w, l, t) => `${w}–${l}${t ? "–" + t : ""}`;

  // The breakdown shown when a school's ⓘ is opened. esc: the page's HTML escaper.
  function breakdown(d, esc) {
    const got = d.per.length
      ? d.per.map(x => `<li><b>${esc(label(x))}</b> ${rec(x.w, x.l, x.t)} <span>(${fmtPct(x.pct)})</span></li>`).join("")
      : `<li>No sport with a confirmed record yet.</li>`;
    const miss = d.missing.map(x => `<li><b>${esc(label(x))}</b> ${esc(x.reason)}</li>`).join("");
    return `<div class="bd"><p class="bd-h">Counted</p><ul>${got}</ul>${miss ? `<p class="bd-h">Not counted</p><ul>${miss}</ul>` : ""}
      <p class="bd-n">Pct ${fmtPct(d.pct)}: all ${d.w + d.l + d.t} games together. Adj. ${fmtPct(d.adj)}: the average of the ${d.n} sport${d.n === 1 ? "" : "s"} above, each weighted equally.</p></div>`;
  }

  // The disclaimer under the table, or "" when every school is compared on the same sports.
  function disclaimer(rows, scope, esc) {
    if (scope === "all") {
      const ns = rows.map(r => r.d.n);
      return `Schools sponsor different sports, so this view isn't an equal comparison (${Math.min(...ns)} to ${Math.max(...ns)} sports per school). Adj. weights each sport equally so long seasons don't dominate.`;
    }
    // Grouped by sport and reason, so a gap shared by several schools reads as one line.
    const groups = new Map();
    for (const r of rows) for (const m of r.d.missing) {
      const k = `${label(m)}, ${m.reason}`;
      (groups.get(k) || groups.set(k, []).get(k)).push(r.s.name);
    }
    if (!groups.size) return "";
    const parts = [...groups].map(([k, names]) => `${esc(k[0].toUpperCase() + k.slice(1))}: ${names.map(esc).join(", ")}.`);
    return `† Not an equal comparison. ${parts.join(" ")} Adj. averages only the sports each school has a record in, so a missing sport doesn't count for or against it.`;
  }

  const HOW = `<p><b>FB · VB · SOC</b> counts men's football, women's volleyball and women's soccer: the three fall team sports nearly every Big 12 school plays. <b>All sports</b> counts every men's and women's sport in season with a confirmed win–loss record.</p>
    <p><b>Pct</b> puts all of a school's games together (ties count half). <b>Adj.</b> averages each sport's own win percentage, so every sport counts equally and a sport a school doesn't play doesn't count against it.</p>
    <p>Meet sports (golf, cross country, track, swimming invitationals) have no win–loss record and aren't included. Tap ⓘ on a school to see exactly what counted.</p>`;

  return { CORE, dept, breakdown, disclaimer, HOW, fmtPct, rec, label };
})();

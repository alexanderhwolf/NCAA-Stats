// Department standings math, shared by all three page designs (index, drawing, night).
//
// Two numbers per school:
//   pct     all of the school's counted games combined (ties count half). Schools sponsor
//           different sports and have records in different ones, so this isn't an equal
//           comparison; the page marks the gaps with † and says what they are.
//   common  the same calculation, but only over sports EVERY school has a record in right now.
//           A sport one school doesn't sponsor, or whose record isn't available yet, drops out
//           for everyone, so every school is measured on exactly the same sports.
window.B12 = (() => {
  // The default view: the three fall team sports nearly every school plays.
  const CORE = [
    { name: "Football", g: "Men" },
    { name: "Volleyball", g: "Women" },
    { name: "Soccer", g: "Women" },
  ];
  const isRecord = s => s && s.kind === "h2h" && s.status === "in" && Number.isFinite(s.w) && Number.isFinite(s.l);
  const pct = (w, l, t = 0) => { const n = w + l + t; return n ? (w + t / 2) / n : null; };
  const label = s => (s.g === "Coed" ? "" : s.g + "'s ") + s.name.toLowerCase();
  const key = s => `${s.g}|${s.name}`;
  const find = (doc, c) => (doc?.sports || []).find(x => x.name === c.name && x.g === c.g);

  // The sports in this scope that every loaded school has a record in, and why the others
  // were left out. allDocs: every school's document.
  function common(allDocs, scope) {
    const cands = scope === "core" ? CORE
      : [...new Map(allDocs.flatMap(d => (d.sports || []).filter(isRecord)).map(s => [key(s), { name: s.name, g: s.g }])).values()];
    const keep = [], dropped = [];
    for (const c of cands) {
      const noProgram = [], noRecord = [];
      for (const d of allDocs) {
        const s = find(d, c);
        if (!s) noProgram.push(d.school);
        else if (!isRecord(s)) noRecord.push(d.school);
      }
      if (!noProgram.length && !noRecord.length) keep.push(c);
      else dropped.push({ ...c, noProgram, noRecord });
    }
    return { keep, dropped };
  }

  function tally(list) {
    let w = 0, l = 0, t = 0;
    for (const s of list) { w += s.w; l += s.l; t += s.t || 0; }
    return { w, l, t };
  }

  function dept(doc, scope, allDocs = [doc]) {
    const sports = doc?.sports || [];
    const counted = [], missing = [];
    if (scope === "core") {
      for (const c of CORE) {
        const s = find(doc, c);
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
    const { w, l, t } = tally(counted);
    const per = counted.map(s => ({ name: s.name, g: s.g, w: s.w, l: s.l, t: s.t || 0, pct: pct(s.w, s.l, s.t || 0) }));
    const cm = common(allDocs, scope);
    const cs = cm.keep.map(c => find(doc, c)).filter(isRecord);
    const ct = tally(cs);
    return { w, l, t, n: counted.length, pct: pct(w, l, t), per, missing,
      common: cm.keep.length ? pct(ct.w, ct.l, ct.t) : null, commonRec: ct, commonInfo: cm };
  }

  const fmtPct = p => (p == null ? "—" : p.toFixed(3).replace(/^0/, ""));
  const rec = (w, l, t) => `${w}–${l}${t ? "–" + t : ""}`;
  const listOf = a => a.length <= 1 ? a.join("") : a.slice(0, -1).join(", ") + " and " + a.at(-1);
  const lc = s => s.toLowerCase();
  const commonNames = d => listOf(d.commonInfo.keep.map(x => lc(label(x))));

  // The breakdown shown when a school's ⓘ is opened. esc: the page's HTML escaper.
  function breakdown(d, esc) {
    const got = d.per.length
      ? d.per.map(x => `<li><b>${esc(label(x))}</b> ${rec(x.w, x.l, x.t)} <span>(${fmtPct(x.pct)})</span></li>`).join("")
      : `<li>No sport with a confirmed record yet.</li>`;
    const miss = d.missing.map(x => `<li><b>${esc(label(x))}</b> ${esc(x.reason)}</li>`).join("");
    const cm = d.commonInfo.keep.length
      ? `Common ${fmtPct(d.common)}: ${rec(d.commonRec.w, d.commonRec.l, d.commonRec.t)} in ${esc(commonNames(d))} only, the sport${d.commonInfo.keep.length === 1 ? "" : "s"} every school has a record in.`
      : `Common: no sport has a record at every school yet.`;
    return `<div class="bd"><p class="bd-h">Counted in Pct</p><ul>${got}</ul>${miss ? `<p class="bd-h">Not counted</p><ul>${miss}</ul>` : ""}
      <p class="bd-n">Pct ${fmtPct(d.pct)}: all ${d.w + d.l + d.t} games together. ${cm}</p></div>`;
  }

  // The note under the table: what Common covers, and what Pct leaves unequal.
  function disclaimer(rows, scope, esc) {
    if (!rows.length) return "";
    const d = rows[0].d, info = d.commonInfo;
    const what = info.keep.length
      ? `Common counts only ${esc(commonNames(d))}, the sport${info.keep.length === 1 ? "" : "s"} every school has a record in right now, so it's the equal comparison.`
      : `Common is blank until one sport has a record at every school.`;
    if (scope === "all") {
      const ns = rows.map(r => r.d.n);
      return `${what} Pct counts each school's own sports (${Math.min(...ns)} to ${Math.max(...ns)} per school), so it isn't an equal comparison.`;
    }
    const why = info.dropped.map(x => {
      const p = [];
      if (x.noProgram.length) p.push(`${listOf(x.noProgram.map(esc))} ${x.noProgram.length === 1 ? "has" : "have"} no program`);
      if (x.noRecord.length) p.push(`no record yet for ${listOf(x.noRecord.map(esc))}`);
      return `${esc(lc(label(x)))} (${p.join("; ")})`;
    });
    return `${what}${why.length ? ` Left out: ${why.join(", ")}.` : ""}${rows.some(r => r.d.missing.length) ? " † Pct for these schools is missing a sport the others have, so it isn't an equal comparison." : ""}`;
  }

  const HOW = `<p><b>Football · volleyball · soccer</b> counts men's football, women's volleyball and women's soccer: the three fall team sports nearly every Big 12 school plays. <b>All sports</b> counts every men's and women's sport in season with a confirmed win–loss record.</p>
    <p><b>Pct</b> puts all of a school's games together (ties count half). Schools sponsor different sports, so Pct isn't always an equal comparison; † marks the schools where it isn't.</p>
    <p><b>Common</b> is the same calculation using only the sports every school has a record in right now. If one school doesn't play a sport, or its record isn't available yet, that sport drops out for everyone. It's the equal comparison, and it widens as more seasons start.</p>
    <p>Meet sports (golf, cross country, track, swimming invitationals) have no win–loss record and aren't included. Tap ⓘ on a school to see exactly what counted.</p>`;

  return { CORE, dept, common, breakdown, disclaimer, HOW, fmtPct, rec, label };
})();

// fetchKeepingCookies against a SYNTHETIC server: sets a cookie and redirects to itself until
// the cookie comes back (the loop big12sports.com put the Worker's plain fetch in).
import { test } from "node:test";
import assert from "node:assert/strict";
import { fetchKeepingCookies } from "../src/refresh.js";

test("a cookie-then-redirect site loads", async () => {
  const real = globalThis.fetch;
  let calls = 0;
  globalThis.fetch = async (u, init) => {
    calls++;
    if ((init.headers.cookie || "").includes("visid=abc")) return new Response("<table>ok</table>", { status: 200 });
    return new Response("", { status: 302, headers: { location: u, "set-cookie": "visid=abc; path=/; HttpOnly" } });
  };
  try {
    const res = await fetchKeepingCookies("https://big12sports.com/standings.aspx?path=vb", { headers: { "user-agent": "t" } });
    assert.equal(await res.text(), "<table>ok</table>");
    assert.equal(calls, 2);
  } finally { globalThis.fetch = real; }
});

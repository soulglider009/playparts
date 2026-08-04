import assert from "node:assert/strict";
import test from "node:test";

async function render(path = "/") {
  const workerUrl = new URL("../dist/server/index.js", import.meta.url);
  workerUrl.searchParams.set("test", `${process.pid}-${Date.now()}`);
  const { default: worker } = await import(workerUrl.href);

  return worker.fetch(
    new Request(`http://localhost${path}`, {
      headers: { accept: "text/html" },
    }),
    {
      ASSETS: {
        fetch: async () => new Response("Not found", { status: 404 }),
      },
    },
    {
      waitUntil() {},
      passThroughOnException() {},
    },
  );
}

test("server-renders the Playparts skill browser", async () => {
  const response = await render();
  assert.equal(response.status, 200);
  assert.match(response.headers.get("content-type") ?? "", /^text\/html\b/i);

  const html = await response.text();
  assert.match(html, /<title>Playparts/);
  assert.match(html, /Skills for making AI web games more easily/);
  assert.match(html, /NEXT BUILD/);
  assert.match(html, /Submit a part/);
  assert.match(html, /good-water/);
  assert.doesNotMatch(html, /codex-preview|Your site is taking shape/);
});

test("server-renders comparison first on the skill page", async () => {
  const response = await render("/skills/good-water");
  assert.equal(response.status, 200);

  const html = await response.text();
  assert.match(html, /Basic \/ crafted/);
  assert.match(html, /BASIC PASS/);
  assert.match(html, /CRAFTED PASS/);
  assert.match(html, /ABOUT THIS PART/);
  assert.match(html, /Not yet claimed/);
});

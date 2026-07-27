import test from "node:test";
import assert from "node:assert/strict";

import app from "../src/app.js";

test("exposes a lightweight health endpoint", async () => {
    const server = await new Promise((resolve) => {
        const instance = app.listen(0, "127.0.0.1", () => resolve(instance));
    });
    const { port } = server.address();

    try {
        const response = await fetch(`http://127.0.0.1:${port}/health`);

        assert.equal(response.status, 200);
        assert.equal(response.headers.get("cache-control"), "no-store");
        assert.deepEqual(await response.json(), { success: true, status: "ok" });
    } finally {
        await new Promise((resolve, reject) => server.close((error) => error ? reject(error) : resolve()));
    }
});

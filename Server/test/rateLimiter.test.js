import test from "node:test";
import assert from "node:assert/strict";
import express from "express";

import { createSubmissionLimiter } from "../src/middleware/rateLimiter.js";

test("blocks requests that exceed the per-IP submission limit", async () => {
    const app = express();
    app.set("trust proxy", false);
    app.post("/", createSubmissionLimiter({ max: 2, message: "Rate limit reached." }), (req, res) => {
        res.status(204).end();
    });

    const server = await new Promise((resolve) => {
        const instance = app.listen(0, "127.0.0.1", () => resolve(instance));
    });
    const { port } = server.address();

    try {
        const url = `http://127.0.0.1:${port}/`;
        assert.equal((await fetch(url, { method: "POST" })).status, 204);
        assert.equal((await fetch(url, { method: "POST" })).status, 204);

        const limited = await fetch(url, { method: "POST" });
        assert.equal(limited.status, 429);
        assert.equal(limited.headers.get("ratelimit-policy"), "2;w=60");
        assert.deepEqual(await limited.json(), {
            success: false,
            message: "Rate limit reached.",
        });
    } finally {
        await new Promise((resolve, reject) => server.close((error) => error ? reject(error) : resolve()));
    }
});

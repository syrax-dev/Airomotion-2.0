import test from "node:test";
import assert from "node:assert/strict";

import app from "../src/app.js";
import { MAX_REQUEST_BODY_SIZE } from "../src/utils/constants.js";

test("rejects oversized and malformed JSON before routing", async () => {
    const server = await new Promise((resolve) => {
        const instance = app.listen(0, "127.0.0.1", () => resolve(instance));
    });
    const { port } = server.address();

    try {
        const response = await fetch(`http://127.0.0.1:${port}/api/enquiry`, {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ message: "x".repeat(101 * 1024) }),
        });

        assert.equal(response.status, 413);
        assert.deepEqual(await response.json(), {
            success: false,
            message: `Request body must be ${MAX_REQUEST_BODY_SIZE} or smaller.`,
        });

        const malformed = await fetch(`http://127.0.0.1:${port}/api/enquiry`, {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: '{"message":',
        });
        assert.equal(malformed.status, 400);
        assert.deepEqual(await malformed.json(), {
            success: false,
            message: "Malformed JSON request body.",
        });
    } finally {
        await new Promise((resolve, reject) => server.close((error) => error ? reject(error) : resolve()));
    }
});

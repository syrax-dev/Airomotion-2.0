import test from "node:test";
import assert from "node:assert/strict";

import { rejectHoneypotSubmission } from "../src/middleware/honeypot.middleware.js";

test("silently absorbs submissions that fill the honeypot", () => {
    let statusCode;
    let ended = false;
    let nextCalled = false;
    const res = {
        status: (code) => {
            statusCode = code;
            return { end: () => { ended = true; } };
        },
    };

    rejectHoneypotSubmission(
        { body: { website: "https://spam.example" }, id: "test", originalUrl: "/api/enquiry" },
        res,
        () => { nextCalled = true; },
    );

    assert.equal(statusCode, 204);
    assert.equal(ended, true);
    assert.equal(nextCalled, false);
});

test("allows submissions with an empty honeypot", () => {
    let nextCalled = false;

    rejectHoneypotSubmission(
        { body: { website: "" } },
        {},
        () => { nextCalled = true; },
    );

    assert.equal(nextCalled, true);
});

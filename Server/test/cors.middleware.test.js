import test from "node:test";
import assert from "node:assert/strict";

import {
    createCorsOptions,
    getAllowedCorsOrigins,
} from "../src/middleware/cors.middleware.js";

const validateOrigin = (options, origin) => new Promise((resolve) => {
    options.origin(origin, (error, permitted) => resolve({ error, permitted }));
});

test("uses the configured production origin and rejects other websites", async () => {
    const allowedOrigins = getAllowedCorsOrigins({
        clientUrl: "https://www.airomotion.example/",
        nodeEnv: "production",
    });
    const options = createCorsOptions(allowedOrigins);

    assert.deepEqual([...allowedOrigins], ["https://www.airomotion.example"]);
    assert.deepEqual(await validateOrigin(options, "https://www.airomotion.example"), {
        error: null,
        permitted: true,
    });

    const rejected = await validateOrigin(options, "https://attacker.example");
    assert.equal(rejected.permitted, undefined);
    assert.equal(rejected.error.status, 403);
});

test("never permits wildcard CORS and requires a production origin", () => {
    assert.throws(
        () => getAllowedCorsOrigins({ clientUrl: "*", nodeEnv: "production" }),
        /cannot be '\*'/,
    );
    assert.throws(
        () => getAllowedCorsOrigins({ clientUrl: "", nodeEnv: "production" }),
        /CLIENT_URL must be configured/,
    );
});

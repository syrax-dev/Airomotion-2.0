import test from "node:test";
import assert from "node:assert/strict";

import errorHandler from "../src/middleware/error.middleware.js";
import { MAX_PDF_SIZE_MB } from "../src/utils/constants.js";

test("returns 413 with the configured limit for oversized uploads", () => {
    let response;
    const res = {
        status: (code) => ({ json: (body) => { response = { code, body }; } }),
    };

    errorHandler(
        { name: "MulterError", code: "LIMIT_FILE_SIZE", message: "File too large" },
        { id: "test-request" },
        res,
    );

    assert.equal(response.code, 413);
    assert.equal(response.body.success, false);
    assert.equal(response.body.message, `Invoice PDF must be ${MAX_PDF_SIZE_MB} MB or smaller.`);
});

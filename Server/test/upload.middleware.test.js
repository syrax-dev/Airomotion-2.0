import test from "node:test";
import assert from "node:assert/strict";

import {
    detectMimeTypeFromContent,
    hasPdfMagicBytes,
    validatePdfStructure,
} from "../src/middleware/upload.middleware.js";

const validPdf = Buffer.from("%PDF-1.7\n1 0 obj\n<< >>\nendobj\n%%EOF\n", "ascii");

test("recognises a PDF by its binary header and EOF marker", () => {
    assert.equal(hasPdfMagicBytes(validPdf), true);
    assert.equal(detectMimeTypeFromContent(validPdf), "application/pdf");
});

test("rejects an executable renamed with a .pdf extension", () => {
    const renamedExecutable = Buffer.from("MZ\x90\x00not a PDF", "binary");

    assert.equal(hasPdfMagicBytes(renamedExecutable), false);
    assert.equal(detectMimeTypeFromContent(renamedExecutable), null);
});

test("rejects content that only spoofs a PDF prefix", () => {
    const spoofedHeader = Buffer.from("%PDF-not-a-version\nmalicious payload", "ascii");

    assert.equal(hasPdfMagicBytes(spoofedHeader), false);
});

test("rejects a valid PDF when its declared MIME type does not match", () => {
    let response;
    let nextCalled = false;

    validatePdfStructure(
        { file: { buffer: validPdf, mimetype: "application/octet-stream" } },
        { status: (code) => ({ json: (body) => { response = { code, body }; } }) },
        () => { nextCalled = true; },
    );

    assert.equal(nextCalled, false);
    assert.equal(response.code, 400);
    assert.equal(response.body.success, false);
});

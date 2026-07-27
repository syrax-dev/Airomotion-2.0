import test from "node:test";
import assert from "node:assert/strict";
import net from "node:net";

import {
    ScannerUnavailableError,
    parseClamAvResponse,
    scanBufferWithClamAv,
    scanUploadedBuffer,
} from "../src/services/antivirus.service.js";

test("accepts ClamAV clean results", () => {
    assert.equal(parseClamAvResponse("stream: OK\0"), "clean");
});

test("recognises ClamAV malware detections", () => {
    assert.equal(parseClamAvResponse("stream: Eicar-Test-Signature FOUND\0"), "infected");
});

test("treats malformed scanner responses as errors", () => {
    assert.equal(parseClamAvResponse("stream: scan failed\0"), "error");
    assert.equal(parseClamAvResponse("unexpected OK\0"), "error");
});

test("fails closed when a scanner has not been configured", async () => {
    const originalHost = process.env.CLAMAV_HOST;
    const originalSocket = process.env.CLAMAV_SOCKET;
    delete process.env.CLAMAV_HOST;
    delete process.env.CLAMAV_SOCKET;

    try {
        await assert.rejects(
            scanUploadedBuffer(Buffer.from("%PDF-1.7\n%%EOF\n", "ascii")),
            ScannerUnavailableError,
        );
    } finally {
        if (originalHost === undefined) delete process.env.CLAMAV_HOST;
        else process.env.CLAMAV_HOST = originalHost;
        if (originalSocket === undefined) delete process.env.CLAMAV_SOCKET;
        else process.env.CLAMAV_SOCKET = originalSocket;
    }
});

test("streams the upload to ClamAV and accepts a clean response", async () => {
    const payload = Buffer.from("%PDF-1.7\n%%EOF\n", "ascii");
    const commandLength = Buffer.byteLength("zINSTREAM\0", "ascii");
    const expectedLength = commandLength + 4 + payload.length + 4;
    const scanner = net.createServer((socket) => {
        let received = Buffer.alloc(0);
        socket.on("data", (chunk) => {
            received = Buffer.concat([received, chunk]);
            if (received.length >= expectedLength) socket.end("stream: OK\0");
        });
    });

    await new Promise((resolve) => scanner.listen(0, "127.0.0.1", resolve));
    const { port } = scanner.address();

    try {
        const result = await scanBufferWithClamAv(payload, {
            host: "127.0.0.1",
            port,
            timeoutMs: 1_000,
        });
        assert.equal(result, "clean");
    } finally {
        await new Promise((resolve, reject) => scanner.close((error) => error ? reject(error) : resolve()));
    }
});

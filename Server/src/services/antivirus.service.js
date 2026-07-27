import net from "node:net";
import "../config/env.js";

const CLAMAV_PORT = 3310;
const CLAMAV_TIMEOUT_MS = 10_000;
const CLAMAV_CHUNK_SIZE = 64 * 1024;

export class MalwareDetectedError extends Error {
    constructor() {
        super("The uploaded file failed the security scan.");
        this.name = "MalwareDetectedError";
        this.status = 422;
    }
}

export class ScannerUnavailableError extends Error {
    constructor() {
        super("File scanning is temporarily unavailable. Please try again later.");
        this.name = "ScannerUnavailableError";
        this.status = 503;
    }
}

const readScannerConfig = () => {
    const socketPath = process.env.CLAMAV_SOCKET?.trim();
    const timeoutMs = Number.parseInt(process.env.CLAMAV_TIMEOUT_MS ?? `${CLAMAV_TIMEOUT_MS}`, 10);

    if (!Number.isInteger(timeoutMs) || timeoutMs < 1) {
        throw new ScannerUnavailableError();
    }

    if (socketPath) {
        return {
            socketPath,
            timeoutMs,
        };
    }

    const host = process.env.CLAMAV_HOST?.trim();
    const port = Number.parseInt(process.env.CLAMAV_PORT ?? `${CLAMAV_PORT}`, 10);
    if (!host || !Number.isInteger(port) || port < 1 || port > 65535) {
        throw new ScannerUnavailableError();
    }

    return { host, port, timeoutMs };
};

export const parseClamAvResponse = (response) => {
    const normalized = response.replace(/\0/g, "").trim();

    if (/^[^:\r\n]+:\s*OK$/i.test(normalized)) return "clean";
    if (/^[^:\r\n]+:\s*.+\sFOUND$/i.test(normalized)) return "infected";

    return "error";
};

const writeToSocket = (socket, data) => new Promise((resolve, reject) => {
    const onError = (error) => {
        socket.off("error", onError);
        reject(error);
    };

    socket.once("error", onError);
    const written = socket.write(data, () => {
        socket.off("error", onError);
        resolve();
    });

    void written;
});

export const scanBufferWithClamAv = (buffer, config) => new Promise((resolve, reject) => {
    const socket = config.socketPath
        ? net.createConnection({ path: config.socketPath })
        : net.createConnection({ host: config.host, port: config.port });
    let response = "";
    let settled = false;

    const finish = (callback, value) => {
        if (settled) return;
        settled = true;
        socket.destroy();
        callback(value);
    };

    socket.setTimeout(config.timeoutMs);
    socket.once("timeout", () => finish(reject, new Error("ClamAV scan timed out.")));
    socket.once("error", (error) => finish(reject, error));
    socket.on("data", (chunk) => {
        response += chunk.toString("utf8");
        if (response.includes("\0") || response.includes("\n")) {
            finish(resolve, parseClamAvResponse(response));
        }
    });
    socket.once("end", () => finish(resolve, parseClamAvResponse(response)));

    socket.once("connect", async () => {
        try {
            await writeToSocket(socket, Buffer.from("zINSTREAM\0", "ascii"));

            for (let offset = 0; offset < buffer.length; offset += CLAMAV_CHUNK_SIZE) {
                const chunk = buffer.subarray(offset, offset + CLAMAV_CHUNK_SIZE);
                const length = Buffer.allocUnsafe(4);
                length.writeUInt32BE(chunk.length);
                await writeToSocket(socket, length);
                await writeToSocket(socket, chunk);
            }

            await writeToSocket(socket, Buffer.alloc(4));
        } catch (error) {
            finish(reject, error);
        }
    });
});

export const scanUploadedBuffer = async (buffer) => {
    if (!Buffer.isBuffer(buffer) || buffer.length === 0) {
        throw new ScannerUnavailableError();
    }

    const config = readScannerConfig();
    let result;

    try {
        result = await scanBufferWithClamAv(buffer, config);
    } catch {
        throw new ScannerUnavailableError();
    }

    if (result === "infected") {
        throw new MalwareDetectedError();
    }

    if (result !== "clean") {
        throw new ScannerUnavailableError();
    }
};

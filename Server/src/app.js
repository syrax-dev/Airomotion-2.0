import "./config/env.js";
import express from "express";
import cors from "cors";
import helmet from "helmet";
import morgan from "morgan";
import { requestLogger, info, warn } from "./utils/logger.js";
import {
    ENDPOINTS,
    MAX_REQUEST_BODY_SIZE,
    MAX_URLENCODED_PARAMETERS,
} from "./utils/constants.js";
import { createCorsOptions, getAllowedCorsOrigins } from "./middleware/cors.middleware.js";

import limiter from "./middleware/rateLimiter.js";
import routes from "./routes/index.js";
import errorHandler from "./middleware/error.middleware.js";

const app = express();

// The API is deployed behind one reverse proxy. This makes req.ip (and thus
// the rate-limit key) the real client IP rather than the proxy's address.
// Set TRUST_PROXY_HOPS if the deployment has a different proxy depth.
const trustProxyHops = Number.parseInt(process.env.TRUST_PROXY_HOPS ?? "1", 10);
app.set("trust proxy", Number.isInteger(trustProxyHops) && trustProxyHops >= 0 ? trustProxyHops : 1);

app.use(helmet());

const allowedCorsOrigins = getAllowedCorsOrigins();
app.use(cors(createCorsOptions(allowedCorsOrigins)));

// lightweight request logging (app-level)
app.use(requestLogger);
app.use(morgan("dev"));

// Apply the broad per-IP limit before any body is parsed. Route-specific
// submission/upload limiters provide the stricter limits below.
app.use(limiter);

// JSON and URL-encoded form submissions are intentionally small. Multipart
// invoice uploads bypass these parsers and are limited separately by multer.
app.use(express.json({ limit: MAX_REQUEST_BODY_SIZE, strict: true }));
app.use(express.urlencoded({
    extended: false,
    limit: MAX_REQUEST_BODY_SIZE,
    parameterLimit: MAX_URLENCODED_PARAMETERS,
}));

app.get("/", (req, res) => {
    res.status(200).json({
        success: true,
        message: "AIROMOTION Backend Running 🚀",
    });
});

// Liveness endpoint for infrastructure checks and an external uptime monitor.
// It intentionally does not call Apps Script or Drive.
app.get("/health", (req, res) => {
    res.set("Cache-Control", "no-store");
    res.status(200).json({
        success: true,
        status: "ok",
    });
});

app.use("/api", routes);

app.use((req, res) => {
    info('Route not found', { path: req.originalUrl, knownEndpoints: ENDPOINTS });
    res.status(404).json({
        success: false,
        message: "Route not found.",
    });
});
app.use(errorHandler);

export default app;

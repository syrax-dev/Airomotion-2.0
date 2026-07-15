import express from "express";
import cors from "cors";
import helmet from "helmet";
import morgan from "morgan";
import dotenv from "dotenv";
import { requestLogger, info, warn } from "./utils/logger.js";
import { ENDPOINTS } from "./utils/constants.js";

import limiter from "./middleware/rateLimiter.js";
import routes from "./routes/index.js";
import errorHandler from "./middleware/error.middleware.js";

// app.js is imported before server.js reaches dotenv.config() because ESM
// dependencies are evaluated first. Load it here before reading CLIENT_URL for
// the CORS configuration.
dotenv.config();

const app = express();

app.use(helmet());

app.use(
    cors({
        origin: process.env.CLIENT_URL,
        credentials: true,
    })
);

// lightweight request logging (app-level)
app.use(requestLogger);
app.use(morgan("dev"));

app.use(express.json({ limit: "15mb" }));
app.use(express.urlencoded({ extended: true }));

app.use(limiter);

app.get("/", (req, res) => {
    res.status(200).json({
        success: true,
        message: "AIROMOTION Backend Running 🚀",
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

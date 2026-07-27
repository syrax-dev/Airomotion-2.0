const DEVELOPMENT_ORIGINS = [
    "http://localhost:5173",
    "http://127.0.0.1:5173",
];

const normalizeOrigin = (value) => {
    const url = new URL(value);
    if (url.protocol !== "http:" && url.protocol !== "https:") {
        throw new Error("CORS origins must be HTTP(S) URLs.");
    }
    return url.origin;
};

/**
 * Returns the only browser origins allowed to call the API. Production must
 * explicitly set CLIENT_URL; there is intentionally no wildcard fallback.
 */
export const getAllowedCorsOrigins = ({
    clientUrl = process.env.CLIENT_URL,
    nodeEnv = process.env.NODE_ENV,
} = {}) => {
    const configuredOrigin = clientUrl?.trim();

    if (!configuredOrigin) {
        if (nodeEnv === "production") {
            throw new Error("CLIENT_URL must be configured in production; wildcard CORS is not allowed.");
        }

        return new Set(DEVELOPMENT_ORIGINS);
    }

    if (configuredOrigin === "*") {
        throw new Error("CLIENT_URL cannot be '*'. Configure an explicit frontend origin.");
    }

    return new Set([normalizeOrigin(configuredOrigin)]);
};

/** Builds strict CORS options for the `cors` middleware. */
export const createCorsOptions = (allowedOrigins) => ({
    origin(origin, callback) {
        // Requests without an Origin header are non-browser clients such as
        // health checks or server-to-server calls, so CORS does not apply.
        if (!origin || allowedOrigins.has(origin)) {
            return callback(null, true);
        }

        const error = new Error("Origin is not allowed by CORS.");
        error.status = 403;
        return callback(error);
    },
    credentials: true,
    methods: ["GET", "POST", "OPTIONS"],
    allowedHeaders: ["Content-Type"],
    maxAge: 86_400,
    optionsSuccessStatus: 204,
});

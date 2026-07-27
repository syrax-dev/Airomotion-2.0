import rateLimit from "express-rate-limit";

const RATE_LIMIT_WINDOW_MS = 60 * 1000;

export const createSubmissionLimiter = ({ max, message }) => rateLimit({
    windowMs: RATE_LIMIT_WINDOW_MS,
    max,
    standardHeaders: true,
    legacyHeaders: false,
    statusCode: 429,
    message: {
        success: false,
        message,
    },
});

// Broad safety net for non-submission API traffic.
export const globalLimiter = rateLimit({
    windowMs: 15 * 60 * 1000,
    max: 100,
    standardHeaders: true,
    legacyHeaders: false,

    message: {
        success: false,
        message: "Too many requests. Please try again later.",
    },
});

// Per-IP form submission limits. These route middleware run before validation,
// upload buffering, malware scanning, and any outbound request.
export const enquiryLimiter = createSubmissionLimiter({
    max: 10,
    message: "Too many enquiry requests. Please try again in a minute.",
});

export const registrationLimiter = createSubmissionLimiter({
    max: 5,
    message: "Too many product registration attempts. Please try again in a minute.",
});

export default globalLimiter;

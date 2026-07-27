import { error as logError } from "../utils/logger.js";
import { MAX_PDF_SIZE_MB, MAX_REQUEST_BODY_SIZE } from "../utils/constants.js";

const errorHandler = (err, req, res, next) => {
    // Log detailed error and stack trace internally on the server
    logError('Unhandled error', {
        id: req.id,
        message: err.message,
        stack: err.stack
    });

    const isProduction = process.env.NODE_ENV === "production";
    const status = err.status || 500;

    if (err.type === "entity.too.large" || status === 413) {
        return res.status(413).json({
            success: false,
            message: `Request body must be ${MAX_REQUEST_BODY_SIZE} or smaller.`,
        });
    }

    if (err.type === "entity.parse.failed") {
        return res.status(400).json({
            success: false,
            message: "Malformed JSON request body.",
        });
    }

    if (err.name === "MulterError") {
        const message = err.code === "LIMIT_FILE_SIZE"
            ? `Invoice PDF must be ${MAX_PDF_SIZE_MB} MB or smaller.`
            : "File upload error.";

        return res.status(err.code === "LIMIT_FILE_SIZE" ? 413 : 400).json({
            success: false,
            message,
        });
    }

    // Determine the response message (mask internal errors in production)
    let message = err.message || "Internal Server Error";
    if (isProduction && status >= 500) {
        message = "Internal Server Error";
    }

    return res.status(status).json({
        success: false,
        message,
    });
};

export default errorHandler;

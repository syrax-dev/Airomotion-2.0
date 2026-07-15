import { error as logError } from "../utils/logger.js";

const errorHandler = (err, req, res, next) => {
    logError('Unhandled error', { message: err.message, stack: err.stack });

    if (err.name === "MulterError") {
        return res.status(400).json({
            success: false,
            message: err.message,
        });
    }

    return res.status(err.status || 500).json({
        success: false,
        message: err.message || "Internal Server Error",
    });
};

export default errorHandler;
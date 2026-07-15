import { error as logError } from "./logger.js";

const asyncHandler = (fn) => {
    return (req, res, next) => {
        Promise.resolve(fn(req, res, next)).catch((err) => {
            logError('asyncHandler caught error', { message: err.message, stack: err.stack });
            next(err);
        });
    };
};

export default asyncHandler;
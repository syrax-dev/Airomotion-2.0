import { warn } from "../utils/logger.js";

const isHoneypotFilled = (value) => {
    if (typeof value === "string") return value.trim().length > 0;
    return value !== undefined && value !== null;
};

/**
 * Silently absorbs automated form submissions that fill the hidden `website`
 * field. A 204 prevents bots from learning which field exposed them, while no
 * validation, scan, external request, or storage operation is performed.
 */
export const rejectHoneypotSubmission = (req, res, next) => {
    if (!isHoneypotFilled(req.body?.website)) return next();

    warn("Honeypot submission blocked", { id: req.id, path: req.originalUrl });
    return res.status(204).end();
};

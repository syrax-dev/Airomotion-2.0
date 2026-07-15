import { validationResult } from "express-validator";
import { warn } from "../utils/logger.js";

const validate = (req, res, next) => {
    const errors = validationResult(req);

    if (!errors.isEmpty()) {
        const mapped = errors.array().map((error) => ({
            field: error.path,
            message: error.msg,
        }));

        warn('Validation failed', { errors: mapped, path: req.originalUrl });

        return res.status(400).json({
            success: false,
            message: "Validation failed.",
            errors: mapped,
        });
    }

    next();
};

export default validate;
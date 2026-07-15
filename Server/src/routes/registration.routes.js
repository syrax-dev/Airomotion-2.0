import { Router } from "express";

import validate from "../middleware/validate.middleware.js";

import registrationValidator from "../validators/registration.validator.js";

import { submitRegistration } from "../controllers/registration.controller.js";

import { info } from "../utils/logger.js";
import { ENDPOINTS } from "../utils/constants.js";

const router = Router();

router.post(
    "/",
    registrationValidator,
    validate,
    submitRegistration
);

info(`Loaded route ${ENDPOINTS.PRODUCT_REGISTRATION}`);

export default router;

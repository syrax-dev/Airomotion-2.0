import { Router } from "express";

import validate from "../middleware/validate.middleware.js";
import upload, { validatePdfStructure } from "../middleware/upload.middleware.js";
import { rejectHoneypotSubmission } from "../middleware/honeypot.middleware.js";

import registrationValidator from "../validators/registration.validator.js";

import { submitRegistration } from "../controllers/registration.controller.js";
import { registrationLimiter } from "../middleware/rateLimiter.js";

import { info } from "../utils/logger.js";
import { ENDPOINTS } from "../utils/constants.js";

const router = Router();

router.post("/", registrationLimiter, upload.single("invoicePdf"), rejectHoneypotSubmission, validatePdfStructure, registrationValidator, validate, submitRegistration);

info(`Loaded route ${ENDPOINTS.PRODUCT_REGISTRATION}`);

export default router;

import { Router } from "express";

import { submitEnquiry } from "../controllers/enquiry.controller.js";
import validate from "../middleware/validate.middleware.js";
import enquiryValidator from "../validators/enquiry.validator.js";
import { enquiryLimiter } from "../middleware/rateLimiter.js";
import { rejectHoneypotSubmission } from "../middleware/honeypot.middleware.js";

import { info } from "../utils/logger.js";
import { ENDPOINTS } from "../utils/constants.js";

const router = Router();

router.post("/", enquiryLimiter, rejectHoneypotSubmission, enquiryValidator, validate, submitEnquiry);

info(`Loaded route ${ENDPOINTS.ENQUIRY}`);

export default router;

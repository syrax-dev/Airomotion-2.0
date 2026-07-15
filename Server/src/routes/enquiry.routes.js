import { Router } from "express";

import { submitEnquiry } from "../controllers/enquiry.controller.js";
import validate from "../middleware/validate.middleware.js";
import enquiryValidator from "../validators/enquiry.validator.js";

import { info } from "../utils/logger.js";
import { ENDPOINTS } from "../utils/constants.js";

const router = Router();

router.post(
    "/",
    enquiryValidator,
    validate,
    submitEnquiry
);

info(`Loaded route ${ENDPOINTS.ENQUIRY}`);

export default router;
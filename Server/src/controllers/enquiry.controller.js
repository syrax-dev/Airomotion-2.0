import asyncHandler from "../utils/asyncHandler.js";
import { sendToAppsScript } from "../services/appscript.services.js";
import { successResponse } from "../utils/response.js";
import { info, error as logError } from "../utils/logger.js";
import { ENDPOINTS, METHODS } from "../utils/constants.js";

export const submitEnquiry = asyncHandler(async (req, res) => {
    info(`${METHODS.POST} submitEnquiry called`, { endpoint: ENDPOINTS.ENQUIRY, body: req.body });
    const result = await sendToAppsScript({
        formType: "enquiry",
        ...req.body,
    });

    if (result.formType !== "enquiry" || result.destination !== "Enquiries") {
        const error = new Error(
            "Apps Script did not confirm the Enquiries sheet. " +
            "Deploy the latest Google Apps Script version and try again."
        );
        error.status = 502;
        throw error;
    }

    info(`${METHODS.POST} submitEnquiry success`, { endpoint: ENDPOINTS.ENQUIRY, response: result });

    return successResponse(res, "Enquiry saved to Enquiries.", {
        destination: result.destination,
    });
});

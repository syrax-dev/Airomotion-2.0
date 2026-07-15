import asyncHandler from "../utils/asyncHandler.js";
import { sendToAppsScript } from "../services/appscript.services.js";
import { successResponse } from "../utils/response.js";
import { info, error as logError } from "../utils/logger.js";
import { ENDPOINTS, METHODS } from "../utils/constants.js";

export const submitRegistration = asyncHandler(async (req, res) => {
    info(`${METHODS.POST} submitRegistration called`, { endpoint: ENDPOINTS.PRODUCT_REGISTRATION, body: req.body });

    // Prepare payload with all expected fields
    const payload = {
        formType: "registration",
        name: req.body.name || "",
        phone: req.body.phone || "",
        email: req.body.email || "",
        address: req.body.address || "",
        productCategory: req.body.productCategory || "",
        productName: req.body.productName || "",
        modelNumber: req.body.modelNumber || "",
        serialNumber: req.body.serialNumber || "",
        purchaseDate: req.body.purchaseDate || "",
        installationDate: req.body.installationDate || "",
        notes: req.body.notes || "",
        timestamp: new Date().toISOString(),
    };

    info(`${METHODS.POST} submitRegistration payload prepared`, { payload });

    const result = await sendToAppsScript(payload);

    // Never report success when an outdated Apps Script deployment writes to
    // another tab. The current script returns its actual destination.
    if (result.formType !== "registration" || result.destination !== "Product Registration") {
        const error = new Error(
            "Apps Script did not confirm the Product Registration sheet. " +
            "Deploy the latest Google Apps Script version and try again."
        );
        error.status = 502;
        throw error;
    }

    info(`${METHODS.POST} submitRegistration success`, { endpoint: ENDPOINTS.PRODUCT_REGISTRATION, response: result });

    return successResponse(res, "Product registration saved to Product Registration.", {
        destination: result.destination,
    });
});

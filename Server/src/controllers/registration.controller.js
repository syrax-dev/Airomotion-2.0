import fs from "fs/promises";
import asyncHandler from "../utils/asyncHandler.js";
import { sendToAppsScript } from "../services/appscript.services.js";
import { prepareInvoicePdfForAppsScript } from "../services/drive.service.js";
import { successResponse } from "../utils/response.js";
import { info, error as logError } from "../utils/logger.js";
import { ENDPOINTS, METHODS } from "../utils/constants.js";
import { sanitizeTextInput } from "../utils/sanitize.js";

export const submitRegistration = asyncHandler(async (req, res) => {
    info(`${METHODS.POST} submitRegistration called [ID: ${req.id}]`, { endpoint: ENDPOINTS.PRODUCT_REGISTRATION });

    if (!req.file) {
        const error = new Error("Invoice PDF is required.");
        error.status = 400;
        throw error;
    }

    let invoice;
    try {
        invoice = await prepareInvoicePdfForAppsScript({ file: req.file });
    } catch (err) {
        if (req.file?.path) {
            await fs.unlink(req.file.path).catch(() => {});
        }
        throw err;
    }

    // Apps Script receives the base64 PDF and creates the Drive file itself.
    const payload = {
        formType: "registration",
        name: sanitizeTextInput(req.body.name) || "",
        phone: sanitizeTextInput(req.body.phone) || "",
        email: sanitizeTextInput(req.body.email) || "",
        address: sanitizeTextInput(req.body.address) || "",
        productCategory: sanitizeTextInput(req.body.productCategory) || "",
        productName: sanitizeTextInput(req.body.productName) || "",
        modelNumber: sanitizeTextInput(req.body.modelNumber) || "",
        serialNumber: sanitizeTextInput(req.body.serialNumber) || "",
        purchaseDate: sanitizeTextInput(req.body.purchaseDate) || "",
        installationDate: sanitizeTextInput(req.body.installationDate) || "",
        invoicePdf: invoice.invoicePdf,
        invoiceFileName: invoice.invoiceFileName,
        invoiceFolderId: invoice.invoiceFolderId,
        notes: sanitizeTextInput(req.body.notes) || "",
        timestamp: new Date().toISOString(),
    };

    info(`${METHODS.POST} submitRegistration payload prepared`, {
        formType: payload.formType,
        serialNumber: payload.serialNumber,
        invoice: {
            fileName: invoice.invoiceFileName,
            folderId: invoice.invoiceFolderId,
            encoded: true,
        },
    });

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

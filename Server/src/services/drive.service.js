import fs from "fs/promises";
import { getInvoicesFolderId } from "../config/drive.js";

/**
 * Sanitizes a filename to prevent path traversal or malicious naming patterns.
 * Retains only alphanumeric characters, underscores, and hyphens, and enforces a .pdf extension.
 */
export const sanitizeFilename = (filename) => {
    if (!filename) return `invoice-${Date.now()}.pdf`;

    const parts = filename.split(".");
    const ext = parts.pop();
    const name = parts.join(".");

    // Keep only safe characters and truncate if overly long
    const cleanName = name
        .replace(/[^a-zA-Z0-9_-]/g, "_")
        .substring(0, 100);

    return `${cleanName || "invoice"}.pdf`;
};

/**
 * Builds the fields expected by the Apps Script doPost handler. The script
 * creates the Drive file, so no Google API client or service-account key is
 * needed by this server.
 */
export const prepareInvoicePdfForAppsScript = async ({ file }) => {
    let fileBuffer;

    if (file.buffer) {
        fileBuffer = file.buffer;
    } else if (file.path) {
        fileBuffer = await fs.readFile(file.path);
        // Clean up temp file immediately after reading it into memory
        await fs.unlink(file.path).catch((err) => {
            // Log but don't crash if unlink fails
            console.error("Failed to delete temp file:", err);
        });
    } else {
        throw new Error("Invoice PDF is required.");
    }

    const sanitizedName = sanitizeFilename(file.originalname);

    return {
        invoicePdf: fileBuffer.toString("base64"),
        invoiceFileName: sanitizedName,
        invoiceFolderId: getInvoicesFolderId(),
    };
};

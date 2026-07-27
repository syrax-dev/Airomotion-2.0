import { error as logError } from "../utils/logger.js";
import { scanUploadedBuffer } from "../services/antivirus.service.js";

export const scanUploadedPdf = async (req, res, next) => {
    if (!req.file) return next();

    try {
        await scanUploadedBuffer(req.file.buffer);
        return next();
    } catch (error) {
        logError("Invoice malware scan failed", {
            id: req.id,
            reason: error.name,
        });

        return res.status(error.status ?? 503).json({
            success: false,
            message: error.message || "File scanning is temporarily unavailable. Please try again later.",
        });
    }
};

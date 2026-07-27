import multer from "multer";
import {
    MAX_PDF_SIZE,
    MAX_MULTIPART_FIELD_SIZE,
    MAX_REGISTRATION_FIELDS,
    MAX_REGISTRATION_PARTS,
    ALLOWED_MIME_TYPES,
} from "../utils/constants.js";

const PDF_HEADER = /^%PDF-(?:1\.[0-7]|2\.0)(?:[\r\n\t\f ]|$)/;
const PDF_EOF_MARKER = "%%EOF";
const PDF_TRAILER_SCAN_BYTES = 1024;

/**
 * Identifies a PDF from its binary structure rather than its filename.
 *
 * A PDF must begin with a PDF version header and end with an EOF marker. The
 * latter prevents arbitrary content that merely starts with "%PDF" from
 * passing as an invoice. This is deliberately performed on the bounded multer
 * buffer before any downstream scanner, parser, or external service sees it.
 */
export const hasPdfMagicBytes = (buffer) => {
    if (!Buffer.isBuffer(buffer) || buffer.length === 0) {
        return false;
    }

    const header = buffer.subarray(0, 16).toString("ascii");
    if (!PDF_HEADER.test(header)) {
        return false;
    }

    const trailerStart = Math.max(0, buffer.length - PDF_TRAILER_SCAN_BYTES);
    return buffer.subarray(trailerStart).toString("ascii").includes(PDF_EOF_MARKER);
};

export const detectMimeTypeFromContent = (buffer) => (
    hasPdfMagicBytes(buffer) ? "application/pdf" : null
);

const upload = multer({
    // Keeping the size-limited upload in memory means rejected bytes are never
    // written to a shared temporary directory.
    storage: multer.memoryStorage(),

    limits: {
        // Enforced by multer while streaming: the request never reaches the
        // PDF validation or registration handler once this is exceeded.
        fileSize: MAX_PDF_SIZE,
        files: 1,
        fieldSize: MAX_MULTIPART_FIELD_SIZE,
        fields: MAX_REGISTRATION_FIELDS,
        parts: MAX_REGISTRATION_PARTS,
        fieldNameSize: 100,
        headerPairs: 50,
    },

    fileFilter(req, file, cb) {
        // This is metadata supplied by the client, so it is only an early
        // allow-list. validatePdfStructure verifies the actual bytes below.
        if (!ALLOWED_MIME_TYPES.includes(file.mimetype)) {
            return cb(
                new Error("Only PDF files are allowed.")
            );
        }

        // The extension is retained for clear user feedback; it is not relied
        // upon as a security control.
        const originalName = file.originalname || "";
        if (!originalName.toLowerCase().endsWith(".pdf")) {
            return cb(
                new Error("File extension must be .pdf.")
            );
        }

        cb(null, true);
    },
});

/**
 * Validates the declared MIME type against MIME inferred from the PDF's magic
 * bytes and basic structural markers. This must be mounted immediately after
 * multer and before anything that scans or processes req.file.
 */
export const validatePdfStructure = (req, res, next) => {
    if (!req.file) {
        return next();
    }

    const detectedMimeType = detectMimeTypeFromContent(req.file.buffer);
    if (detectedMimeType !== "application/pdf" || req.file.mimetype !== detectedMimeType) {
        return res.status(400).json({
            success: false,
            message: "Invalid file content. Upload a genuine PDF document.",
        });
    }

    return next();
};

export default upload;

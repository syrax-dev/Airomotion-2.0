import multer from "multer";
import {
    MAX_PDF_SIZE,
    ALLOWED_MIME_TYPES,
} from "../utils/constants.js";

const storage = multer.memoryStorage();

const upload = multer({
    storage,

    limits: {
        fileSize: MAX_PDF_SIZE,
    },

    fileFilter(req, file, cb) {
        if (!ALLOWED_MIME_TYPES.includes(file.mimetype)) {
            return cb(
                new Error("Only PDF files are allowed.")
            );
        }

        cb(null, true);
    },
});

export default upload;
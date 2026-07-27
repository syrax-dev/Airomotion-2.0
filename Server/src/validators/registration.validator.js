import { body } from "express-validator";

export default [
    body("name")
        .trim()
        .notEmpty()
        .withMessage("Name is required.")
        .escape(),

    body("phone")
        .trim()
        .notEmpty()
        .withMessage("Phone number is required.")
        .isLength({ min: 10, max: 15 })
        .withMessage("Phone number must be between 10 and 15 characters.")
        .matches(/^\+?[0-9\s\-()]+$/)
        .withMessage("Invalid phone number format."),

    body("email")
        .trim()
        .isEmail()
        .withMessage("Invalid email address.")
        .normalizeEmail(),

    body("address")
        .trim()
        .notEmpty()
        .withMessage("Address is required.")
        .escape(),

    body("productCategory")
        .trim()
        .notEmpty()
        .withMessage("Product Category is required.")
        .escape(),

    body("productName")
        .trim()
        .notEmpty()
        .withMessage("Product Name is required.")
        .escape(),

    body("modelNumber")
        .trim()
        .notEmpty()
        .withMessage("Model Number is required.")
        .escape(),

    body("serialNumber")
        .trim()
        .notEmpty()
        .withMessage("Serial Number is required.")
        .matches(/^[a-zA-Z0-9\-_/]+$/)
        .withMessage("Serial number must contain only letters, numbers, hyphens, underscores, or slashes.")
        .escape(),

    body("purchaseDate")
        .notEmpty()
        .withMessage("Purchase Date is required.")
        .bail()
        .isISO8601({ strict: true })
        .withMessage("Purchase Date must be a valid date."),

    body("installationDate")
        .notEmpty()
        .withMessage("Installation Date is required.")
        .bail()
        .isISO8601({ strict: true })
        .withMessage("Installation Date must be a valid date.")
        .bail()
        .custom((installationDate, { req }) => {
            if (installationDate < req.body.purchaseDate) {
                throw new Error("Installation Date cannot be before the Purchase Date.");
            }

            return true;
        }),

    body("notes")
        .optional({ checkFalsy: true })
        .trim()
        .isLength({ min: 10 })
        .withMessage("Notes must be at least 10 characters.")
        .escape(),
];

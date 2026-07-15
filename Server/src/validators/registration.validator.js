import { body } from "express-validator";

export default [
    body("name")
        .trim()
        .notEmpty()
        .withMessage("Name is required."),

    body("phone")
        .trim()
        .notEmpty()
        .withMessage("Phone number is required."),

    body("email")
        .trim()
        .isEmail()
        .withMessage("Invalid email address."),

    body("address")
        .trim()
        .notEmpty()
        .withMessage("Address is required."),

    body("productCategory")
        .trim()
        .notEmpty()
        .withMessage("Product Category is required."),

    body("productName")
        .trim()
        .notEmpty()
        .withMessage("Product Name is required."),

    body("modelNumber")
        .trim()
        .notEmpty()
        .withMessage("Model Number is required."),

    body("serialNumber")
        .trim()
        .notEmpty()
        .withMessage("Serial Number is required."),

    body("purchaseDate")
        .notEmpty()
        .withMessage("Purchase Date is required."),

    body("installationDate")
        .notEmpty()
        .withMessage("Installation Date is required."),

    body("notes")
        .trim()
        .isLength({ min: 10 })
        .withMessage("Notes must be at least 10 characters."),
];
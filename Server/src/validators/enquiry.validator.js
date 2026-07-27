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

    body("propertyType")
        .trim()
        .notEmpty()
        .withMessage("Property Type is required.")
        .escape(),

    body("productCategory")
        .trim()
        .notEmpty()
        .withMessage("Product Category is required.")
        .escape(),

    body("message")
        .trim()
        .notEmpty()
        .withMessage("Message is required.")
        .isLength({ max: 1000 })
        .withMessage("Message is too long.")
        .escape(),
];
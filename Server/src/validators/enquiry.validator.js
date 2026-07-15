import { body } from "express-validator";

export default [
    body("name")
        .trim()
        .notEmpty()
        .withMessage("Name is required."),

    body("phone")
        .trim()
        .notEmpty()
        .withMessage("Phone number is required.")
        .isLength({ min: 10, max: 15 })
        .withMessage("Invalid phone number."),

    body("email")
        .trim()
        .isEmail()
        .withMessage("Invalid email address."),

    body("propertyType")
        .trim()
        .notEmpty()
        .withMessage("Property Type is required."),

    body("productCategory")
        .trim()
        .notEmpty()
        .withMessage("Product Category is required."),

    body("message")
        .trim()
        .notEmpty()
        .withMessage("Message is required.")
        .isLength({ max: 1000 })
        .withMessage("Message is too long."),
];
// middlewares/validateRegister.js

const { body, validationResult } = require("express-validator");

const validateRegister = [
  body("name")
    .trim()
    .notEmpty().withMessage("Name is required")
    .isLength({ min: 2 }).withMessage("Name must be at least 2 characters"),

  body("email")
    .trim()
    .notEmpty().withMessage("Email is required")
    .isEmail().withMessage("Invalid email format"),

  body("password")
    .notEmpty().withMessage("Password is required")
    .isLength({ min: 5 }).withMessage("Password must be at least 5 characters"),

  body("publicKey")
    .notEmpty().withMessage("Public key is required")
    .isHexadecimal().withMessage("Public key must be a hexadecimal string")
    .isLength({ min: 64 }).withMessage("Public key too short or invalid"),

  // Final error-handling middleware
  (req, res, next) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({
        message: "Validation failed",
        errors: errors.array(),
      });
    }
    next();
  },
];

module.exports = validateRegister;

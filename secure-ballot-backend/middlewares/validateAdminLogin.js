// middlewares/validateAdminLogin.js

const { body, validationResult } = require("express-validator");

const validateAdminLogin = [
  body("email")
    .trim()
    .notEmpty().withMessage("Email is required")
    .isEmail().withMessage("Invalid email format"),

  body("password")
    .notEmpty().withMessage("Password is required")
    .isLength({ min: 5 }).withMessage("Password must be at least 5 characters"),

  // Final middleware to return validation errors (if any)
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

module.exports = validateAdminLogin;

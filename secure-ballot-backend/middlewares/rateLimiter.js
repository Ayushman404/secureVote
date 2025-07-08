const rateLimit = require("express-rate-limit");

const limiter = rateLimit({
  windowMs: 1 * 60 * 1000, // 1 minute
  max: 7, // limit each IP to 5 requests per windowMs
  message: {
    status: 429,
    error: "Too many requests, please try again after a minute.",
  },
  standardHeaders: true, // Return rate limit info in the `RateLimit-*` headers
  legacyHeaders: false,
});

module.exports = limiter;

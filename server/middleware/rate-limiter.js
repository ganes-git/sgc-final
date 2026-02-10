/**
 * Rate Limiter Middleware
 * Enforces a limit of 15 requests per minute per IP.
 */

const rateLimit = require('express-rate-limit');

const limiter = rateLimit({
    windowMs: 60 * 1000, // 1 minute
    max: 15, // Limit each IP to 15 requests per `window` (here, per 1 minute)
    standardHeaders: true, // Return rate limit info in the `RateLimit-*` headers
    legacyHeaders: false, // Disable the `X-RateLimit-*` headers
    message: {
        error: "Too many requests, please try again later.",
        status: "RATE_LIMIT_EXCEEDED"
    }
});

module.exports = limiter;

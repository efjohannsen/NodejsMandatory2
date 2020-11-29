const rateLimiter = require("express-rate-limit");

//rate limiting
const authLimiter = rateLimiter({
    windowMs: 10 * 60 * 1000, // 10 minutes
    max: 6 // limit each IP to 6 requests per windowMs
});

module.exports = authLimiter
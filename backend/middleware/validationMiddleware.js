const { validationResult } = require('express-validator');

// Middleware to validate request data using express-validator.
// Accepts an array of validation chains (e.g. check('email').isEmail())
// Returns a handler that runs those chains and then checks for errors.
const validate = (validations = []) => {
    return async (req, res, next) => {
        try {
            // Run validation chains
            for (const validation of validations) {
                if (typeof validation.run === 'function') {
                    // express-validator check() returns a middleware with run()
                    await validation.run(req);
                }
            }

            // Gather validation result
            const result = validationResult(req);
            if (!result || typeof result.isEmpty !== 'function') {
                // Defensive: if something is wrong with express-validator, allow request
                return next();
            }

            if (result.isEmpty()) {
                return next();
            }

            const rawErrors = typeof result.array === 'function' ? result.array() : [];
            const errors = Array.isArray(rawErrors)
                ? rawErrors.map(err => (err && err.msg ? err.msg : `${err?.param || 'field'} is invalid`))
                : [];


            return res.status(400).json({
                success: false,
                errors
            });
        } catch (err) {
            // Ensure the middleware never crashes
            console.error('Validation middleware error:', err);
            return res.status(500).json({
                success: false,
                errors: ['Internal validation error']
            });
        }
    };
};

module.exports = validate;
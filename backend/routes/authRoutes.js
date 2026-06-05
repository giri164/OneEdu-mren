const express = require('express');
const rateLimit = require('express-rate-limit');
const { register, login, getMe, updateDetails, updatePassword } = require('../controllers/authController');
const { protect } = require('../middleware/authMiddleware');
const validate = require('../middleware/validationMiddleware');
const { auth: authSchemas } = require('../middleware/validationSchemas');

const router = express.Router();

// Rate limiter for auth routes (protect against brute force)
const authLimiter = rateLimit({
    windowMs: 15 * 60 * 1000, // 15 minutes
    max: 20, // limit each IP to 20 requests per windowMs
    standardHeaders: true,
    legacyHeaders: false,
    message: {
        success: false,
        message: 'Too many requests from this IP, please try again later.'
    }
});

// Register route validation
router.post('/register', authLimiter, validate(authSchemas.register), register);

// Login route validation
router.post('/login', authLimiter, validate(authSchemas.login), login);

router.get('/me', protect, getMe);
router.put('/updatedetails', protect, validate(authSchemas.updateDetails), updateDetails);
router.put('/updatepassword', protect, validate(authSchemas.updatePassword), updatePassword);

module.exports = router;

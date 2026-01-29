const User = require('../models/User');
const LoginLog = require('../models/LoginLog');
const jwt = require('jsonwebtoken');

// Register user
exports.register = async (req, res) => {
    try {
        const { name, email, password, role } = req.body;

        const user = await User.create({
            name,
            email,
            password,
            role: role || 'user'
        });

        sendTokenResponse(user, 201, res);
    } catch (err) {
        console.error('Registration Error:', err);
        res.status(400).json({ success: false, message: err.message });
    }
};

// Login user
exports.login = async (req, res) => {
    try {
        const { email, password } = req.body;

        // Validate email & password
        if (!email || !password) {
            return res.status(400).json({ success: false, message: 'Please provide an email and password' });
        }

        // Check for user
        const user = await User.findOne({ email }).select('+password');

        if (!user) {
            // Log failed login attempt
            await LoginLog.create({
                email,
                userName: 'Unknown',
                status: 'failed',
                failureReason: 'User not found',
                ipAddress: req.ip || req.connection.remoteAddress,
                userAgent: req.get('user-agent')
            });
            return res.status(401).json({ success: false, message: 'Invalid credentials' });
        }

        // Check if password matches
        const isMatch = await user.matchPassword(password);

        if (!isMatch) {
            // Log failed login attempt
            await LoginLog.create({
                user: user._id,
                email: user.email,
                userName: user.name,
                status: 'failed',
                failureReason: 'Invalid password',
                ipAddress: req.ip || req.connection.remoteAddress,
                userAgent: req.get('user-agent')
            });
            return res.status(401).json({ success: false, message: 'Invalid credentials' });
        }

        // Log successful login
        await LoginLog.create({
            user: user._id,
            email: user.email,
            userName: user.name,
            status: 'success',
            ipAddress: req.ip || req.connection.remoteAddress,
            userAgent: req.get('user-agent')
        });

        sendTokenResponse(user, 200, res);
    } catch (err) {
        console.error('Login Error:', err);
        res.status(400).json({ success: false, message: err.message });
    }
};

// Get current logged in user
exports.getMe = async (req, res) => {
    try {
        const user = await User.findById(req.user.id)
            .populate('stream')
            .populate({
                path: 'courseProgress.course',
                select: 'title skill type provider duration link description role'
            });
        res.status(200).json({ success: true, data: user });
    } catch (err) {
        res.status(400).json({ success: false, message: err.message });
    }
};

// Update user details
exports.updateDetails = async (req, res) => {
    try {
        const fieldsToUpdate = {
            name: req.body.name,
            avatar: req.body.avatar
        };

        const user = await User.findByIdAndUpdate(req.user.id, fieldsToUpdate, {
            new: true,
            runValidators: true
        });

        res.status(200).json({
            success: true,
            data: user
        });
    } catch (err) {
        res.status(400).json({ success: false, message: err.message });
    }
};

// Update password
exports.updatePassword = async (req, res) => {
    try {
        const user = await User.findById(req.user.id).select('+password');

        // Check current password
        if (!(await user.matchPassword(req.body.currentPassword))) {
            return res.status(401).json({ success: false, message: 'Password is incorrect' });
        }

        user.password = req.body.newPassword;
        await user.save();

        sendTokenResponse(user, 200, res);
    } catch (err) {
        res.status(400).json({ success: false, message: err.message });
    }
};

// Helper function to get token from model, create cookie and send response
const sendTokenResponse = (user, statusCode, res) => {
    // Create token
    const token = jwt.sign({ id: user._id }, process.env.JWT_SECRET, {
        expiresIn: process.env.JWT_EXPIRE
    });

    res.status(statusCode).json({
        success: true,
        token,
        user: {
            _id: user._id,
            name: user.name,
            email: user.email,
            role: user.role,
            avatar: user.avatar,
            stream: user.stream,
            skillProgress: user.skillProgress,
            courseProgress: user.courseProgress
        }
    });
};

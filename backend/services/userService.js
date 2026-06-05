const User = require('../models/User');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');

class UserService {
    // Create a new user
    async createUser(userData) {
        const { name, email, password, role = 'user' } = userData;

        // Check if user exists
        const existingUser = await User.findOne({ email });
        if (existingUser) {
            throw new Error('User already exists');
        }

        // Hash password
        const salt = await bcrypt.genSalt(10);
        const hashedPassword = await bcrypt.hash(password, salt);

        // Create user
        const user = await User.create({
            name,
            email,
            password: hashedPassword,
            role
        });

        return user;
    }

    // Authenticate user
    async authenticateUser(email, password) {
        const user = await User.findOne({ email }).select('+password');
        if (!user) {
            throw new Error('Invalid credentials');
        }

        const isMatch = await bcrypt.compare(password, user.password);
        if (!isMatch) {
            throw new Error('Invalid credentials');
        }

        return user;
    }

    // Generate JWT token
    generateToken(userId) {
        return jwt.sign({ id: userId }, process.env.JWT_SECRET, {
            expiresIn: process.env.JWT_EXPIRE || '30d'
        });
    }

    // Get user by ID
    async getUserById(id) {
        return await User.findById(id);
    }

    // Update user profile
    async updateUserProfile(id, updateData) {
        return await User.findByIdAndUpdate(id, updateData, {
            new: true,
            runValidators: true
        });
    }

    // Get user's resume
    async getUserResume(id) {
        const user = await User.findById(id).select('resume');
        return user.resume || null;
    }

    // Save user's resume
    async saveUserResume(id, resumeData) {
        return await User.findByIdAndUpdate(
            id,
            { resume: resumeData },
            { new: true }
        );
    }
}

module.exports = new UserService();
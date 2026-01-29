const Stream = require('../models/Stream');
const SubDomain = require('../models/SubDomain');
const Role = require('../models/Role');
const Course = require('../models/Course');
const Job = require('../models/Job');
const Feedback = require('../models/Feedback');
const LoginLog = require('../models/LoginLog');
const User = require('../models/User');

// --- Stream Controllers ---
exports.getStreams = async (req, res) => {
    try {
        const streams = await Stream.find();
        res.status(200).json({ success: true, data: streams });
    } catch (err) {
        res.status(400).json({ success: false, message: err.message });
    }
};

exports.createStream = async (req, res) => {
    try {
        const stream = await Stream.create(req.body);
        res.status(201).json({ success: true, data: stream });
    } catch (err) {
        res.status(400).json({ success: false, message: err.message });
    }
};

exports.updateStream = async (req, res) => {
    try {
        const stream = await Stream.findByIdAndUpdate(req.params.id, req.body, { new: true, runValidators: true });
        res.status(200).json({ success: true, data: stream });
    } catch (err) {
        res.status(400).json({ success: false, message: err.message });
    }
};

exports.deleteStream = async (req, res) => {
    try {
        await Stream.findByIdAndDelete(req.params.id);
        res.status(200).json({ success: true, data: {} });
    } catch (err) {
        res.status(400).json({ success: false, message: err.message });
    }
};

// --- Subdomain Controllers ---
exports.createSubStream = async (req, res) => {
    try {
        const subdomain = await SubDomain.create(req.body);
        res.status(201).json({ success: true, data: subdomain });
    } catch (err) {
        res.status(400).json({ success: false, message: err.message });
    }
};

exports.updateSubStream = async (req, res) => {
    try {
        const subdomain = await SubDomain.findByIdAndUpdate(req.params.id, req.body, { new: true, runValidators: true });
        if (!subdomain) {
            return res.status(404).json({ success: false, message: 'Sub-stream not found' });
        }
        res.status(200).json({ success: true, data: subdomain });
    } catch (err) {
        res.status(400).json({ success: false, message: err.message });
    }
};

exports.deleteSubStream = async (req, res) => {
    try {
        await SubDomain.findByIdAndDelete(req.params.id);
        res.status(200).json({ success: true, data: {} });
    } catch (err) {
        res.status(400).json({ success: false, message: err.message });
    }
};

// --- Role Controllers ---
exports.getAllRoles = async (req, res) => {
    try {
        const roles = await Role.find().populate({
            path: 'subDomain',
            populate: { path: 'stream' }
        });
        res.status(200).json({ success: true, data: roles });
    } catch (err) {
        res.status(400).json({ success: false, message: err.message });
    }
};

exports.createRole = async (req, res) => {
    try {
        const role = await Role.create(req.body);
        res.status(201).json({ success: true, data: role });
    } catch (err) {
        res.status(400).json({ success: false, message: err.message });
    }
};

exports.updateRole = async (req, res) => {
    try {
        const role = await Role.findByIdAndUpdate(req.params.id, req.body, { new: true });
        res.status(200).json({ success: true, data: role });
    } catch (err) {
        res.status(400).json({ success: false, message: err.message });
    }
};

exports.deleteRole = async (req, res) => {
    try {
        await Role.findByIdAndDelete(req.params.id);
        res.status(200).json({ success: true, data: {} });
    } catch (err) {
        res.status(400).json({ success: false, message: err.message });
    }
};

// --- Course Controllers ---
exports.getAllCourses = async (req, res) => {
    try {
        const courses = await Course.find();
        res.status(200).json({ success: true, data: courses });
    } catch (err) {
        res.status(400).json({ success: false, message: err.message });
    }
};

exports.addCourse = async (req, res) => {
    try {
        const course = await Course.create(req.body);
        res.status(201).json({ success: true, data: course });
    } catch (err) {
        res.status(400).json({ success: false, message: err.message });
    }
};

exports.updateCourse = async (req, res) => {
    try {
        const course = await Course.findByIdAndUpdate(req.params.id, req.body, { new: true, runValidators: true });
        if (!course) {
            return res.status(404).json({ success: false, message: 'Course not found' });
        }
        res.status(200).json({ success: true, data: course });
    } catch (err) {
        res.status(400).json({ success: false, message: err.message });
    }
};

exports.deleteCourse = async (req, res) => {
    try {
        const course = await Course.findByIdAndDelete(req.params.id);
        if (!course) {
            return res.status(404).json({ success: false, message: 'Course not found' });
        }
        res.status(200).json({ success: true, data: {} });
    } catch (err) {
        res.status(400).json({ success: false, message: err.message });
    }
};

// --- Job Controllers ---
exports.addJob = async (req, res) => {
    try {
        const job = await Job.create(req.body);
        res.status(201).json({ success: true, data: job });
    } catch (err) {
        res.status(400).json({ success: false, message: err.message });
    }
};

// --- Feedback Management ---
exports.getAllFeedback = async (req, res) => {
    try {
        const feedbacks = await Feedback.find().populate('user', 'name email');
        res.status(200).json({ success: true, data: feedbacks });
    } catch (err) {
        res.status(400).json({ success: false, message: err.message });
    }
};

// Get all login logs
exports.getLoginLogs = async (req, res) => {
    try {
        const logs = await LoginLog.find()
            .populate('user', 'name email role')
            .sort({ loginTime: -1 })
            .limit(100);
        res.status(200).json({ success: true, data: logs });
    } catch (err) {
        res.status(400).json({ success: false, message: err.message });
    }
};

// Get login logs statistics
exports.getLoginLogsStats = async (req, res) => {
    try {
        const totalLogins = await LoginLog.countDocuments();
        const successfulLogins = await LoginLog.countDocuments({ status: 'success' });
        const failedLogins = await LoginLog.countDocuments({ status: 'failed' });
        const uniqueUsers = await LoginLog.distinct('user');
        
        // Get logins in last 7 days
        const sevenDaysAgo = new Date(Date.now() - 7 * 24 * 60 * 60 * 1000);
        const loginsLastWeek = await LoginLog.countDocuments({ 
            loginTime: { $gte: sevenDaysAgo },
            status: 'success'
        });

        res.status(200).json({ 
            success: true, 
            data: {
                totalLogins,
                successfulLogins,
                failedLogins,
                uniqueUsers: uniqueUsers.length,
                loginsLastWeek
            }
        });
    } catch (err) {
        res.status(400).json({ success: false, message: err.message });
    }
};

// Get all registered users
exports.getAllUsers = async (req, res) => {
    try {
        const users = await User.find()
            .select('-password')
            .populate('stream', 'name')
            .sort({ createdAt: -1 });
        
        res.status(200).json({ 
            success: true, 
            data: users,
            total: users.length
        });
    } catch (err) {
        res.status(400).json({ success: false, message: err.message });
    }
};

// Get user registration statistics
exports.getUserStats = async (req, res) => {
    try {
        const totalUsers = await User.countDocuments();
        const adminUsers = await User.countDocuments({ role: 'admin' });
        const regularUsers = await User.countDocuments({ role: 'user' });
        
        // Users registered today
        const today = new Date();
        today.setHours(0, 0, 0, 0);
        const usersToday = await User.countDocuments({ createdAt: { $gte: today } });
        
        // Users registered this week
        const sevenDaysAgo = new Date(Date.now() - 7 * 24 * 60 * 60 * 1000);
        const usersThisWeek = await User.countDocuments({ createdAt: { $gte: sevenDaysAgo } });
        
        res.status(200).json({ 
            success: true, 
            data: {
                totalUsers,
                adminUsers,
                regularUsers,
                usersToday,
                usersThisWeek
            }
        });
    } catch (err) {
        res.status(400).json({ success: false, message: err.message });
    }
};

// Delete a login log
exports.deleteLoginLog = async (req, res) => {
    try {
        const { id } = req.params;
        const deletedLog = await LoginLog.findByIdAndDelete(id);
        
        if (!deletedLog) {
            return res.status(404).json({ success: false, message: 'Login log not found' });
        }
        
        res.status(200).json({ 
            success: true, 
            message: 'Login log deleted successfully',
            data: deletedLog
        });
    } catch (err) {
        res.status(400).json({ success: false, message: err.message });
    }
};

// Delete all login logs for a specific user
exports.deleteUserLoginLogs = async (req, res) => {
    try {
        const { userId } = req.params;
        const result = await LoginLog.deleteMany({ user: userId });
        
        res.status(200).json({ 
            success: true, 
            message: `${result.deletedCount} login logs deleted`,
            deletedCount: result.deletedCount
        });
    } catch (err) {
        res.status(400).json({ success: false, message: err.message });
    }
};

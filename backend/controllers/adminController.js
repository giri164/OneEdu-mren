const Stream = require('../models/Stream');
const SubDomain = require('../models/SubDomain');
const Role = require('../models/Role');
const Course = require('../models/Course');
const Job = require('../models/Job');
const Feedback = require('../models/Feedback');

// --- Stream Controllers ---
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
exports.createSubDomain = async (req, res) => {
    try {
        const subdomain = await SubDomain.create(req.body);
        res.status(201).json({ success: true, data: subdomain });
    } catch (err) {
        res.status(400).json({ success: false, message: err.message });
    }
};

exports.deleteSubDomain = async (req, res) => {
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

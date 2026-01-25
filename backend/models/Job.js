const mongoose = require('mongoose');

const jobSchema = new mongoose.Schema({
    title: {
        type: String,
        required: [true, 'Job title is required']
    },
    role: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Role',
        required: true
    },
    company: {
        type: String,
        required: true
    },
    salaryRange: {
        type: String,
        required: true
    },
    location: {
        type: String
    },
    link: {
        type: String
    },
    description: {
        type: String
    }
}, { timestamps: true });

module.exports = mongoose.model('Job', jobSchema);

const mongoose = require('mongoose');

const courseSchema = new mongoose.Schema({
    title: {
        type: String,
        required: [true, 'Course title is required']
    },
    skill: {
        type: String,
        required: [true, 'Associated skill is required']
    },
    // Optional relations to organize courses by platform hierarchy
    stream: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Stream',
        default: null
    },
    subDomain: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'SubDomain',
        default: null
    },
    role: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Role',
        default: null
    },
    type: {
        type: String,
        enum: ['Free', 'Paid'],
        required: true
    },
    provider: {
        type: String,
        required: true
    },
    duration: {
        type: String
    },
    link: {
        type: String,
        required: true
    },
    description: {
        type: String
    },
    certifications: [{
        name: String,
        type: {
            type: String,
            enum: ['Free', 'Paid']
        },
        link: String
    }],
    targetCompanies: [String]
}, { timestamps: true });

module.exports = mongoose.model('Course', courseSchema);

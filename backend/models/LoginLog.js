const mongoose = require('mongoose');

const loginLogSchema = new mongoose.Schema({
    user: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
        required: true
    },
    email: {
        type: String,
        required: true
    },
    userName: {
        type: String,
        required: true
    },
    loginTime: {
        type: Date,
        default: Date.now
    },
    ipAddress: {
        type: String,
        default: null
    },
    userAgent: {
        type: String,
        default: null
    },
    status: {
        type: String,
        enum: ['success', 'failed'],
        default: 'success'
    },
    failureReason: {
        type: String,
        default: null
    }
}, { timestamps: true });

module.exports = mongoose.model('LoginLog', loginLogSchema);

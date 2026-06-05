const mongoose = require('mongoose');

const notificationSchema = new mongoose.Schema({
    user: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
        required: true
    },
    title: {
        type: String,
        required: true
    },
    message: {
        type: String,
        required: true
    },
    type: {
        type: String,
        enum: ['interview_reminder', 'job_deadline', 'certification_suggestion', 'career_tip', 'application_update', 'skill_reminder'],
        required: true
    },
    priority: {
        type: String,
        enum: ['low', 'medium', 'high', 'urgent'],
        default: 'medium'
    },
    isRead: {
        type: Boolean,
        default: false
    },
    relatedJob: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Job'
    },
    relatedCourse: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Course'
    },
    actionUrl: {
        type: String // URL to redirect user when they click the notification
    },
    scheduledFor: {
        type: Date // For scheduled notifications
    },
    sentAt: {
        type: Date,
        default: Date.now
    }
}, {
    timestamps: true
});

// Index for efficient queries
notificationSchema.index({ user: 1, isRead: 1, createdAt: -1 });
notificationSchema.index({ scheduledFor: 1 }); // For scheduled notifications

module.exports = mongoose.model('Notification', notificationSchema);
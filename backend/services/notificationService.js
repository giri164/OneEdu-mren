const Notification = require('../models/Notification');
const User = require('../models/User');
const JobApplication = require('../models/JobApplication');

class NotificationService {
    // Create a notification
    async createNotification(notificationData) {
        const notification = await Notification.create(notificationData);
        return notification;
    }

    // Get user's notifications
    async getUserNotifications(userId, limit = 20, offset = 0) {
        return await Notification.find({ user: userId })
            .sort({ createdAt: -1 })
            .limit(limit)
            .skip(offset)
            .populate('relatedJob', 'title company')
            .populate('relatedCourse', 'title');
    }

    // Mark notification as read
    async markAsRead(notificationId, userId) {
        return await Notification.findOneAndUpdate(
            { _id: notificationId, user: userId },
            { isRead: true },
            { new: true }
        );
    }

    // Mark all notifications as read for a user
    async markAllAsRead(userId) {
        return await Notification.updateMany(
            { user: userId, isRead: false },
            { isRead: true }
        );
    }

    // Get unread count
    async getUnreadCount(userId) {
        return await Notification.countDocuments({ user: userId, isRead: false });
    }

    // Delete notification
    async deleteNotification(notificationId, userId) {
        return await Notification.findOneAndDelete({ _id: notificationId, user: userId });
    }

    // Send interview reminder (called when interview is scheduled)
    async sendInterviewReminder(userId, jobId, interviewDate) {
        const daysUntilInterview = Math.ceil((new Date(interviewDate) - new Date()) / (1000 * 60 * 60 * 24));

        if (daysUntilInterview <= 3 && daysUntilInterview > 0) {
            await this.createNotification({
                user: userId,
                title: 'Interview Reminder',
                message: `You have an interview in ${daysUntilInterview} day${daysUntilInterview > 1 ? 's' : ''}. Prepare well!`,
                type: 'interview_reminder',
                priority: daysUntilInterview === 1 ? 'urgent' : 'high',
                relatedJob: jobId,
                actionUrl: `/applications`
            });
        }
    }

    // Send job application deadline reminder
    async sendJobDeadlineReminder(userId, jobId, deadline) {
        const hoursUntilDeadline = Math.ceil((new Date(deadline) - new Date()) / (1000 * 60 * 60));

        if (hoursUntilDeadline <= 24 && hoursUntilDeadline > 0) {
            await this.createNotification({
                user: userId,
                title: 'Application Deadline Approaching',
                message: `Job application deadline in ${hoursUntilDeadline} hour${hoursUntilDeadline > 1 ? 's' : ''}. Don't miss out!`,
                type: 'job_deadline',
                priority: hoursUntilDeadline <= 6 ? 'urgent' : 'high',
                relatedJob: jobId,
                actionUrl: `/job-recommendations`
            });
        }
    }

    // Send certification suggestions based on user's skills/interests
    async sendCertificationSuggestions(userId) {
        const user = await User.findById(userId).select('skillProgress interests');

        if (!user.skillProgress || user.skillProgress.length === 0) {
            return;
        }

        const userSkills = user.skillProgress.map(s => s.skill.toLowerCase());

        // Simple certification suggestions based on skills
        const certificationSuggestions = {
            'javascript': 'Consider taking the JavaScript certification to advance your web development career.',
            'react': 'React certification would strengthen your frontend development skills.',
            'python': 'Python certification is highly valued in data science and AI roles.',
            'java': 'Java certification opens doors to enterprise software development.',
            'sql': 'Database certifications like Oracle or Microsoft SQL Server are in high demand.',
            'aws': 'AWS certifications are essential for cloud computing careers.',
            'machine learning': 'Consider AI/ML certifications from Google or Microsoft.',
            'cybersecurity': 'Security certifications like CompTIA Security+ are valuable.'
        };

        const relevantSuggestions = Object.entries(certificationSuggestions)
            .filter(([skill]) => userSkills.some(userSkill => userSkill.includes(skill)))
            .slice(0, 2); // Limit to 2 suggestions

        for (const [skill, message] of relevantSuggestions) {
            await this.createNotification({
                user: userId,
                title: 'Certification Suggestion',
                message: message,
                type: 'certification_suggestion',
                priority: 'medium',
                actionUrl: '/career-recommendations'
            });
        }
    }

    // Send career tips periodically
    async sendCareerTip(userId) {
        const careerTips = [
            'Networking is key to career growth. Connect with professionals in your field regularly.',
            'Continuous learning is essential. Dedicate time each week to learning new skills.',
            'Update your resume regularly to reflect your latest achievements and skills.',
            'Prepare for interviews by practicing common questions and researching the company.',
            'Set clear career goals and create a roadmap to achieve them.',
            'Seek feedback from mentors and colleagues to improve your performance.',
            'Build a personal brand through LinkedIn and professional blogging.',
            'Take ownership of your projects and demonstrate leadership qualities.'
        ];

        const randomTip = careerTips[Math.floor(Math.random() * careerTips.length)];

        await this.createNotification({
            user: userId,
            title: 'Career Tip',
            message: randomTip,
            type: 'career_tip',
            priority: 'low',
            actionUrl: '/dashboard'
        });
    }

    // Send application status updates
    async sendApplicationUpdate(userId, applicationId, newStatus) {
        const application = await JobApplication.findById(applicationId).populate('job', 'title company');

        if (!application) return;

        const statusMessages = {
            'accepted': `Congratulations! Your application for ${application.job.title} at ${application.job.company} has been accepted.`,
            'rejected': `Your application for ${application.job.title} at ${application.job.company} has been reviewed. Keep applying!`,
            'interview_scheduled': `Great news! You have an interview scheduled for ${application.job.title} at ${application.job.company}.`
        };

        const message = statusMessages[newStatus] || `Your application status for ${application.job.title} has been updated to ${newStatus}.`;

        await this.createNotification({
            user: userId,
            title: 'Application Update',
            message: message,
            type: 'application_update',
            priority: newStatus === 'accepted' ? 'high' : 'medium',
            relatedJob: application.job._id,
            actionUrl: '/applications'
        });
    }

    // Send skill development reminders
    async sendSkillReminder(userId) {
        const user = await User.findById(userId).select('skillProgress');

        if (!user.skillProgress || user.skillProgress.length === 0) {
            await this.createNotification({
                user: userId,
                title: 'Start Building Skills',
                message: 'Add your current skills to your profile to get personalized recommendations and job matches.',
                type: 'skill_reminder',
                priority: 'medium',
                actionUrl: '/profile'
            });
        } else {
            await this.createNotification({
                user: userId,
                title: 'Keep Learning',
                message: 'Regular skill development is key to career advancement. Check out new courses and certifications.',
                type: 'skill_reminder',
                priority: 'low',
                actionUrl: '/dashboard'
            });
        }
    }

    // Schedule periodic notifications (this would be called by a cron job)
    async sendPeriodicNotifications() {
        const users = await User.find({ role: 'user' });

        for (const user of users) {
            // Send career tips (weekly)
            if (Math.random() < 0.1) { // 10% chance per user per run
                await this.sendCareerTip(user._id);
            }

            // Send certification suggestions (bi-weekly)
            if (Math.random() < 0.05) { // 5% chance
                await this.sendCertificationSuggestions(user._id);
            }

            // Send skill reminders (monthly)
            if (Math.random() < 0.02) { // 2% chance
                await this.sendSkillReminder(user._id);
            }
        }
    }
}

module.exports = new NotificationService();
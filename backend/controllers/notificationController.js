const notificationService = require('../services/notificationService');

// Get user's notifications
exports.getNotifications = async (req, res) => {
    try {
        const { limit = 20, offset = 0 } = req.query;
        const notifications = await notificationService.getUserNotifications(
            req.user.id,
            parseInt(limit),
            parseInt(offset)
        );

        res.status(200).json({
            success: true,
            data: notifications
        });
    } catch (err) {
        console.error('Error in getNotifications:', err);
        res.status(400).json({ success: false, message: err.message });
    }
};

// Get unread notification count
exports.getUnreadCount = async (req, res) => {
    try {
        const count = await notificationService.getUnreadCount(req.user.id);

        res.status(200).json({
            success: true,
            data: { unreadCount: count }
        });
    } catch (err) {
        console.error('Error in getUnreadCount:', err);
        res.status(400).json({ success: false, message: err.message });
    }
};

// Mark notification as read
exports.markAsRead = async (req, res) => {
    try {
        const { id } = req.params;
        const notification = await notificationService.markAsRead(id, req.user.id);

        if (!notification) {
            return res.status(404).json({ success: false, message: 'Notification not found' });
        }

        res.status(200).json({
            success: true,
            data: notification
        });
    } catch (err) {
        console.error('Error in markAsRead:', err);
        res.status(400).json({ success: false, message: err.message });
    }
};

// Mark all notifications as read
exports.markAllAsRead = async (req, res) => {
    try {
        await notificationService.markAllAsRead(req.user.id);

        res.status(200).json({
            success: true,
            message: 'All notifications marked as read'
        });
    } catch (err) {
        console.error('Error in markAllAsRead:', err);
        res.status(400).json({ success: false, message: err.message });
    }
};

// Delete notification
exports.deleteNotification = async (req, res) => {
    try {
        const { id } = req.params;
        const notification = await notificationService.deleteNotification(id, req.user.id);

        if (!notification) {
            return res.status(404).json({ success: false, message: 'Notification not found' });
        }

        res.status(200).json({
            success: true,
            message: 'Notification deleted successfully'
        });
    } catch (err) {
        console.error('Error in deleteNotification:', err);
        res.status(400).json({ success: false, message: err.message });
    }
};

// Test endpoint to create sample notifications (for development)
exports.createTestNotification = async (req, res) => {
    try {
        const { title, message, type, priority = 'medium' } = req.body;

        const notification = await notificationService.createNotification({
            user: req.user.id,
            title,
            message,
            type,
            priority
        });

        res.status(201).json({
            success: true,
            data: notification
        });
    } catch (err) {
        console.error('Error in createTestNotification:', err);
        res.status(400).json({ success: false, message: err.message });
    }
};
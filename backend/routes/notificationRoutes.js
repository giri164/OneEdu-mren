const express = require('express');
const {
    getNotifications,
    getUnreadCount,
    markAsRead,
    markAllAsRead,
    deleteNotification,
    createTestNotification
} = require('../controllers/notificationController');
const { protect } = require('../middleware/authMiddleware');
const validate = require('../middleware/validationMiddleware');
const { notifications: notificationSchemas } = require('../middleware/validationSchemas');

const router = express.Router();

// All notification routes require authentication
router.use(protect);

router.get('/', getNotifications);
router.get('/unread-count', getUnreadCount);
router.put('/:id/read', markAsRead);
router.put('/mark-all-read', markAllAsRead);
router.delete('/:id', deleteNotification);

// Test endpoint (remove in production)
router.post('/test', validate(notificationSchemas.createTest), createTestNotification);

module.exports = router;
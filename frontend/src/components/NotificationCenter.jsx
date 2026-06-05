import { useState, useEffect } from 'react';
import axios from '../api/axios';
import {
    Bell,
    Check,
    Trash2,
    ExternalLink,
    Clock,
    AlertTriangle,
    Info,
    CheckCircle
} from 'lucide-react';

const NotificationCenter = () => {
    const [notifications, setNotifications] = useState([]);
    const [unreadCount, setUnreadCount] = useState(0);
    const [loading, setLoading] = useState(true);
    const [showDropdown, setShowDropdown] = useState(false);
    const [error, setError] = useState('');

    useEffect(() => {
        fetchNotifications();
        fetchUnreadCount();
    }, []);

    const fetchNotifications = async () => {
        try {
            const response = await axios.get('/notifications?limit=10');
            setNotifications(response.data.data);
        } catch (err) {
            setError('Failed to load notifications');
            console.error('Notifications error:', err);
        } finally {
            setLoading(false);
        }
    };

    const fetchUnreadCount = async () => {
        try {
            const response = await axios.get('/notifications/unread-count');
            setUnreadCount(response.data.data.unreadCount);
        } catch (err) {
            console.error('Unread count error:', err);
        }
    };

    const markAsRead = async (notificationId) => {
        try {
            await axios.put(`/notifications/${notificationId}/read`);
            setNotifications(prev =>
                prev.map(notif =>
                    notif._id === notificationId
                        ? { ...notif, isRead: true }
                        : notif
                )
            );
            setUnreadCount(prev => Math.max(0, prev - 1));
        } catch (err) {
            console.error('Mark as read error:', err);
        }
    };

    const markAllAsRead = async () => {
        try {
            await axios.put('/notifications/mark-all-read');
            setNotifications(prev =>
                prev.map(notif => ({ ...notif, isRead: true }))
            );
            setUnreadCount(0);
        } catch (err) {
            console.error('Mark all as read error:', err);
        }
    };

    const deleteNotification = async (notificationId) => {
        try {
            await axios.delete(`/notifications/${notificationId}`);
            setNotifications(prev => prev.filter(notif => notif._id !== notificationId));
            // Update unread count if the deleted notification was unread
            const deletedNotif = notifications.find(n => n._id === notificationId);
            if (deletedNotif && !deletedNotif.isRead) {
                setUnreadCount(prev => Math.max(0, prev - 1));
            }
        } catch (err) {
            console.error('Delete notification error:', err);
        }
    };

    const getNotificationIcon = (type) => {
        switch (type) {
            case 'interview_reminder':
                return <Clock className="text-orange-500" size={20} />;
            case 'job_deadline':
                return <AlertTriangle className="text-red-500" size={20} />;
            case 'certification_suggestion':
                return <CheckCircle className="text-green-500" size={20} />;
            case 'career_tip':
                return <Info className="text-blue-500" size={20} />;
            case 'application_update':
                return <Check className="text-purple-500" size={20} />;
            case 'skill_reminder':
                return <Bell className="text-yellow-500" size={20} />;
            default:
                return <Bell className="text-gray-500" size={20} />;
        }
    };

    const getPriorityColor = (priority) => {
        switch (priority) {
            case 'urgent':
                return 'border-l-red-500';
            case 'high':
                return 'border-l-orange-500';
            case 'medium':
                return 'border-l-yellow-500';
            case 'low':
                return 'border-l-green-500';
            default:
                return 'border-l-gray-500';
        }
    };

    const formatTimeAgo = (date) => {
        const now = new Date();
        const notificationDate = new Date(date);
        const diffInHours = Math.floor((now - notificationDate) / (1000 * 60 * 60));

        if (diffInHours < 1) return 'Just now';
        if (diffInHours < 24) return `${diffInHours}h ago`;

        const diffInDays = Math.floor(diffInHours / 24);
        if (diffInDays < 7) return `${diffInDays}d ago`;

        return notificationDate.toLocaleDateString();
    };

    return (
        <div className="relative">
            {/* Notification Bell Button */}
            <button
                onClick={() => setShowDropdown(!showDropdown)}
                className="relative p-2 text-gray-700 dark:text-amber-100 hover:text-primary dark:hover:text-amber-200 transition"
                title="Notifications"
            >
                <Bell size={20} />
                {unreadCount > 0 && (
                    <span className="absolute -top-1 -right-1 bg-red-500 text-white text-xs rounded-full h-5 w-5 flex items-center justify-center">
                        {unreadCount > 99 ? '99+' : unreadCount}
                    </span>
                )}
            </button>

            {/* Notification Dropdown */}
            {showDropdown && (
                <div className="absolute right-0 mt-2 w-96 bg-white dark:bg-slate-800 rounded-lg shadow-xl border border-gray-200 dark:border-slate-600 z-50">
                    {/* Header */}
                    <div className="p-4 border-b border-gray-200 dark:border-slate-600">
                        <div className="flex items-center justify-between">
                            <h3 className="text-lg font-semibold text-gray-900 dark:text-white">
                                Notifications
                            </h3>
                            {unreadCount > 0 && (
                                <button
                                    onClick={markAllAsRead}
                                    className="text-sm text-primary hover:text-secondary transition"
                                >
                                    Mark all read
                                </button>
                            )}
                        </div>
                    </div>

                    {/* Notifications List */}
                    <div className="max-h-96 overflow-y-auto">
                        {loading ? (
                            <div className="p-4 text-center">
                                <div className="animate-spin rounded-full h-6 w-6 border-b-2 border-primary mx-auto mb-2"></div>
                                <p className="text-sm text-gray-600 dark:text-gray-400">Loading...</p>
                            </div>
                        ) : notifications.length === 0 ? (
                            <div className="p-8 text-center">
                                <Bell className="mx-auto h-8 w-8 text-gray-400 mb-2" />
                                <p className="text-sm text-gray-600 dark:text-gray-400">
                                    No notifications yet
                                </p>
                            </div>
                        ) : (
                            notifications.map((notification) => (
                                <div
                                    key={notification._id}
                                    className={`p-4 border-b border-gray-100 dark:border-slate-700 hover:bg-gray-50 dark:hover:bg-slate-700 transition ${
                                        !notification.isRead ? 'bg-blue-50 dark:bg-slate-700/50' : ''
                                    } ${getPriorityColor(notification.priority)} border-l-4`}
                                >
                                    <div className="flex items-start gap-3">
                                        <div className="flex-shrink-0 mt-1">
                                            {getNotificationIcon(notification.type)}
                                        </div>
                                        <div className="flex-1 min-w-0">
                                            <div className="flex items-start justify-between">
                                                <h4 className="text-sm font-medium text-gray-900 dark:text-white truncate">
                                                    {notification.title}
                                                </h4>
                                                <div className="flex items-center gap-1 ml-2">
                                                    {!notification.isRead && (
                                                        <button
                                                            onClick={() => markAsRead(notification._id)}
                                                            className="text-blue-500 hover:text-blue-700 transition"
                                                            title="Mark as read"
                                                        >
                                                            <Check size={14} />
                                                        </button>
                                                    )}
                                                    <button
                                                        onClick={() => deleteNotification(notification._id)}
                                                        className="text-red-500 hover:text-red-700 transition"
                                                        title="Delete"
                                                    >
                                                        <Trash2 size={14} />
                                                    </button>
                                                </div>
                                            </div>
                                            <p className="text-sm text-gray-600 dark:text-gray-300 mt-1">
                                                {notification.message}
                                            </p>
                                            <div className="flex items-center justify-between mt-2">
                                                <span className="text-xs text-gray-500 dark:text-gray-400">
                                                    {formatTimeAgo(notification.createdAt)}
                                                </span>
                                                {notification.actionUrl && (
                                                    <a
                                                        href={notification.actionUrl}
                                                        className="text-xs text-primary hover:text-secondary transition flex items-center gap-1"
                                                        onClick={() => setShowDropdown(false)}
                                                    >
                                                        View <ExternalLink size={12} />
                                                    </a>
                                                )}
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            ))
                        )}
                    </div>

                    {/* Footer */}
                    {notifications.length > 0 && (
                        <div className="p-3 border-t border-gray-200 dark:border-slate-600 text-center">
                            <button
                                onClick={() => setShowDropdown(false)}
                                className="text-sm text-primary hover:text-secondary transition"
                            >
                                View all notifications
                            </button>
                        </div>
                    )}
                </div>
            )}

            {/* Overlay to close dropdown */}
            {showDropdown && (
                <div
                    className="fixed inset-0 z-40"
                    onClick={() => setShowDropdown(false)}
                ></div>
            )}
        </div>
    );
};

export default NotificationCenter;
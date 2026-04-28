const express = require('express');
const router = express.Router();
const { protect, authorize } = require('../middleware/auth');
const {
  getNotifications,
  getUnreadCount,
  markAsRead,
  markAllAsRead,
  createNotification,
  broadcastNotification,
  deleteNotification
} = require('../controllers/notificationController');

// User routes (protected)
router.get('/', protect, getNotifications);
router.get('/unread-count', protect, getUnreadCount);
router.put('/read-all', protect, markAllAsRead);
router.put('/:id/read', protect, markAsRead);
router.delete('/:id', protect, deleteNotification);

// Admin routes
router.post('/', protect, authorize('admin'), createNotification);
router.post('/broadcast', protect, authorize('admin'), broadcastNotification);

module.exports = router;

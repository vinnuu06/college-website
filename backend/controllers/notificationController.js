const Notification = require('../models/Notification');

// @desc    Get user notifications
// @route   GET /api/notifications
// @access  Private
exports.getNotifications = async (req, res) => {
  try {
    const { page = 1, limit = 20, unreadOnly = false } = req.query;
    const filter = { recipient: req.user.id };
    
    if (unreadOnly === 'true') {
      filter.isRead = false;
    }

    const notifications = await Notification.find(filter)
      .sort({ createdAt: -1 })
      .skip((page - 1) * limit)
      .limit(parseInt(limit))
      .populate('sender', 'name email');

    const total = await Notification.countDocuments(filter);
    const unreadCount = await Notification.countDocuments({ 
      recipient: req.user.id, 
      isRead: false 
    });

    res.status(200).json({
      success: true,
      count: notifications.length,
      total,
      unreadCount,
      page: parseInt(page),
      pages: Math.ceil(total / limit),
      notifications
    });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// @desc    Get unread count
// @route   GET /api/notifications/unread-count
// @access  Private
exports.getUnreadCount = async (req, res) => {
  try {
    const count = await Notification.countDocuments({ 
      recipient: req.user.id, 
      isRead: false 
    });

    res.status(200).json({ success: true, count });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// @desc    Mark notification as read
// @route   PUT /api/notifications/:id/read
// @access  Private
exports.markAsRead = async (req, res) => {
  try {
    const notification = await Notification.findOneAndUpdate(
      { _id: req.params.id, recipient: req.user.id },
      { isRead: true, readAt: Date.now() },
      { new: true }
    );

    if (!notification) {
      return res.status(404).json({ success: false, message: 'Notification not found' });
    }

    res.status(200).json({ success: true, notification });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// @desc    Mark all notifications as read
// @route   PUT /api/notifications/read-all
// @access  Private
exports.markAllAsRead = async (req, res) => {
  try {
    await Notification.updateMany(
      { recipient: req.user.id, isRead: false },
      { isRead: true, readAt: Date.now() }
    );

    res.status(200).json({ success: true, message: 'All notifications marked as read' });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// @desc    Create notification (admin/system)
// @route   POST /api/notifications
// @access  Private/Admin
exports.createNotification = async (req, res) => {
  try {
    const { recipient, title, message, type, category, priority, link, expiresAt } = req.body;

    const notification = await Notification.create({
      recipient,
      title,
      message,
      type: type || 'info',
      category: category || 'general',
      priority: priority || 'medium',
      link,
      sender: req.user.id,
      expiresAt
    });

    // Emit Real-time Notification
    const io = req.app.get('io');
    if (io) {
      io.to(recipient.toString()).emit('newNotification', notification);
    }

    res.status(201).json({ success: true, notification });
  } catch (error) {
    res.status(400).json({ success: false, message: error.message });
  }
};

// @desc    Send broadcast notification to all users or by role
// @route   POST /api/notifications/broadcast
// @access  Private/Admin
exports.broadcastNotification = async (req, res) => {
  try {
    const { title, message, type, category, priority, targetRole } = req.body;
    const User = require('../models/User');

    const filter = targetRole ? { role: targetRole } : {};
    const users = await User.find(filter).select('_id');

    const notifications = users.map(user => ({
      recipient: user._id,
      title,
      message,
      type: type || 'announcement',
      category: category || 'general',
      priority: priority || 'medium',
      sender: req.user.id
    }));

    await Notification.insertMany(notifications);

    // Emit Real-time Broadcast
    const io = req.app.get('io');
    if (io) {
      if (targetRole) {
        // Since we don't have a role-room strategy yet, we emit to all but client handles filtering
        // Or better: emit to a general 'broadcast' room
        io.emit('broadcastNotification', { title, message, type, targetRole });
      } else {
        io.emit('broadcastNotification', { title, message, type });
      }
    }

    res.status(201).json({
      success: true,
      message: `Broadcast sent to ${users.length} users`,
      recipientCount: users.length
    });
  } catch (error) {
    res.status(400).json({ success: false, message: error.message });
  }
};

// @desc    Delete notification
// @route   DELETE /api/notifications/:id
// @access  Private
exports.deleteNotification = async (req, res) => {
  try {
    const notification = await Notification.findOneAndDelete({
      _id: req.params.id,
      recipient: req.user.id
    });

    if (!notification) {
      return res.status(404).json({ success: false, message: 'Notification not found' });
    }

    res.status(200).json({ success: true, message: 'Notification deleted' });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

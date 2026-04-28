const express = require('express');
const router = express.Router();
const { protect, authorize } = require('../middleware/auth');
const {
  createEvent,
  getAllEvents,
  getEventById,
  updateEvent,
  deleteEvent,
  registerForEvent,
  getEventStats
} = require('../controllers/eventController');

// Public routes
router.get('/', getAllEvents);
router.get('/stats/overview', getEventStats);
router.get('/:id', getEventById);

// Protected routes
router.post('/:id/register', protect, registerForEvent);

// Admin routes
router.post('/', protect, authorize('admin', 'faculty'), createEvent);
router.put('/:id', protect, authorize('admin'), updateEvent);
router.delete('/:id', protect, authorize('admin'), deleteEvent);

module.exports = router;

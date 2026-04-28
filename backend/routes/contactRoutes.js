const express = require('express');
const router = express.Router();
const { protect, authorize } = require('../middleware/auth');
const {
  submitContact,
  getAllContacts,
  getContactById,
  updateContact,
  deleteContact,
  getContactStats
} = require('../controllers/contactController');

// Public route
router.post('/', submitContact);

// Admin routes
router.get('/stats', protect, authorize('admin'), getContactStats);
router.get('/', protect, authorize('admin'), getAllContacts);
router.get('/:id', protect, authorize('admin'), getContactById);
router.put('/:id', protect, authorize('admin'), updateContact);
router.delete('/:id', protect, authorize('admin'), deleteContact);

module.exports = router;

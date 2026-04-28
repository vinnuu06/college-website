const express = require('express');
const router = express.Router();
const { protect, authorize } = require('../middleware/auth');
const {
  createAdmission,
  getAllAdmissions,
  getAdmissionsByCourse,
  getAdmissionsByStatus,
  getAdmissionById,
  updateAdmissionStatus,
  verifyDocuments,
  getAdmissionStats
} = require('../controllers/admissionController');

// Public route - Create admission application
router.post('/apply', createAdmission);

// Protected routes - Admin only (specific routes before parameterized routes)
router.get('/stats', protect, authorize('admin'), getAdmissionStats);
router.get('/all', protect, authorize('admin'), getAllAdmissions);
router.get('/status/:status', protect, authorize('admin'), getAdmissionsByStatus);
router.get('/course/:courseId', protect, authorize('admin'), getAdmissionsByCourse);
router.put('/:id/status', protect, authorize('admin'), updateAdmissionStatus);
router.put('/:id/verify', protect, authorize('admin'), verifyDocuments);
router.get('/:id', protect, authorize('admin'), getAdmissionById);

module.exports = router;

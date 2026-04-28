const express = require('express');
const router = express.Router();
const { protect, authorize } = require('../middleware/auth');
const {
  getDashboardStats,
  getStudentDashboard,
  getFacultyDashboard
} = require('../controllers/dashboardController');

// Admin dashboard stats
router.get('/stats', protect, authorize('admin'), getDashboardStats);

// Student dashboard
router.get('/student/:id', protect, getStudentDashboard);

// Faculty dashboard
router.get('/faculty/:id', protect, getFacultyDashboard);

module.exports = router;

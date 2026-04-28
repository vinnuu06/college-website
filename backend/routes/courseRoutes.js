const express = require('express');
const router = express.Router();
const {
  createCourse,
  getAllCourses,
  getCourseById,
  getCourseByCode,
  updateCourse,
  deleteCourse,
  addSubjects,
  getCourseStats,
  getEnrolledStudents
} = require('../controllers/courseController');
const { protect, authorize } = require('../middleware/auth');

// Get course statistics
router.get('/stats', getCourseStats);

// Get course by code (BCA, BBA, BCom)
router.get('/code/:courseCode', getCourseByCode);

// Create course (admin only)
router.post('/', protect, authorize('admin'), createCourse);

// Get all courses
router.get('/', getAllCourses);

// Get course by ID
router.get('/get/:id', getCourseById);

// Update course (admin only)
router.put('/:id', protect, authorize('admin'), updateCourse);

// Add subjects to course (admin only)
router.put('/:id/subjects', protect, authorize('admin'), addSubjects);

// Get enrolled students for a course
router.get('/:id/students', protect, authorize('faculty', 'admin'), getEnrolledStudents);

// Delete/Deactivate course (admin only)
router.delete('/:id', protect, authorize('admin'), deleteCourse);

module.exports = router;

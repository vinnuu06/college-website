const express = require('express');
const router = express.Router();
const { protect, authorize } = require('../middleware/auth');
const { 
  markBulkAttendance, 
  getStudentAttendance, 
  getCourseAttendance 
} = require('../controllers/attendanceController');

router.post('/bulk', protect, authorize('faculty', 'admin'), markBulkAttendance);
router.get('/student/:studentId', protect, getStudentAttendance);
router.get('/course/:courseId', protect, authorize('faculty', 'admin'), getCourseAttendance);

module.exports = router;

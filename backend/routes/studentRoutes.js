const express = require('express');
const router = express.Router();
const {
  getStudentProfile,
  getStudentAcademics,
  getAllStudents,
  updateStudentProfile,
  enrollCourse
} = require('../controllers/studentController');
const { protect, authorize } = require('../middleware/auth');

router.get('/', protect, authorize('admin'), getAllStudents);
router.get('/:id', protect, getStudentProfile);
router.get('/:id/academics', protect, getStudentAcademics);
router.put('/:id', protect, updateStudentProfile);
router.post('/:id/enroll/:courseId', protect, enrollCourse);

module.exports = router;

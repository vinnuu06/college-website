const express = require('express');
const router = express.Router();
const {
  createAcademic,
  getTranscript,
  getAllAcademics,
  updateAcademic,
  getStudentsBySemester
} = require('../controllers/academicController');
const { protect, authorize } = require('../middleware/auth');

router.post('/', protect, authorize('admin', 'faculty'), createAcademic);
router.get('/', protect, authorize('admin'), getAllAcademics);
router.get('/transcript/:studentId', protect, getTranscript);
router.put('/:id', protect, authorize('admin', 'faculty'), updateAcademic);
router.get('/semester/:semester', protect, authorize('admin'), getStudentsBySemester);

module.exports = router;

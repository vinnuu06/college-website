const express = require('express');
const router = express.Router();
const { protect, authorize } = require('../middleware/auth');
const { createExam, getExams, updateExam } = require('../controllers/examController');

router.get('/', getExams);
router.post('/', protect, authorize('admin'), createExam);
router.put('/:id', protect, authorize('admin'), updateExam);

module.exports = router;

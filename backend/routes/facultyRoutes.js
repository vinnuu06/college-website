const express = require('express');
const router = express.Router();
const {
  getFacultyProfile,
  getAllFaculty,
  updateFacultyProfile,
  addSkills,
  addAchievement,
  getFacultyAchievements,
  getFacultySkills
} = require('../controllers/facultyController');
const { protect, authorize } = require('../middleware/auth');

router.get('/', getAllFaculty);
router.get('/:id', getFacultyProfile);
router.get('/:id/skills', getFacultySkills);
router.get('/:id/achievements', getFacultyAchievements);
router.put('/:id', protect, updateFacultyProfile);
router.post('/:id/skills', protect, authorize('faculty', 'admin'), addSkills);
router.post('/:id/achievements', protect, authorize('faculty', 'admin'), addAchievement);

module.exports = router;

const express = require('express');
const router = express.Router();
const {
  createPlacement,
  getAllPlacements,
  getPlacementStats,
  getPlacementById,
  updatePlacement,
  getPlacementsByYear,
  getPlacementsByCourse,
  addCompanies,
  addStudentToPlacement,
  getTopCompanies
} = require('../controllers/placementController');
const { protect, authorize } = require('../middleware/auth');

// Public routes
router.get('/', getAllPlacements);
router.get('/stats', getPlacementStats);
router.get('/companies', getTopCompanies);
router.get('/year/:year', getPlacementsByYear);
router.get('/course/:courseId', getPlacementsByCourse);
router.get('/:id', getPlacementById);

// Admin protected routes
router.post('/', protect, authorize('admin'), createPlacement);
router.put('/:id', protect, authorize('admin'), updatePlacement);
router.post('/:id/companies', protect, authorize('admin'), addCompanies);
router.post('/:id/students', protect, authorize('admin'), addStudentToPlacement);

module.exports = router;

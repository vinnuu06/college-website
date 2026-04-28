const express = require('express');
const router = express.Router();
const multer = require('multer');
const path = require('path');
const { protect, authorize } = require('../middleware/auth');
const { uploadResume, uploadMaterial } = require('../controllers/uploadController');
const { storage: cloudinaryStorage } = require('../config/cloudinary');

// Multer Storage Configuration (Local Fallback)
const localStorage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, 'backend/uploads/');
  },
  filename: function (req, file, cb) {
    const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1e9);
    cb(null, file.fieldname + '-' + uniqueSuffix + path.extname(file.originalname));
  }
});

// Check if Cloudinary is configured
const isCloudinaryConfigured = 
  process.env.CLOUDINARY_CLOUD_NAME && 
  process.env.CLOUDINARY_CLOUD_NAME !== 'your_cloud_name';

const storage = isCloudinaryConfigured ? cloudinaryStorage : localStorage;

// File Filter
const fileFilter = (req, file, cb) => {
  const allowedTypes = /pdf|doc|docx|ppt|pptx|jpg|jpeg|png/;
  const extname = allowedTypes.test(path.extname(file.originalname).toLowerCase());
  const mimetype = allowedTypes.test(file.mimetype);

  if (extname && mimetype) {
    return cb(null, true);
  } else {
    cb(new Error('Only documents and images are allowed!'));
  }
};

const upload = multer({
  storage: storage,
  limits: { fileSize: 10 * 1024 * 1024 }, // Increased to 10MB for cloud
  fileFilter: fileFilter
});

// Routes
router.post('/resume', protect, authorize('student'), upload.single('resume'), uploadResume);
router.post('/material/:courseId', protect, authorize('faculty', 'admin'), upload.single('material'), uploadMaterial);

module.exports = router;

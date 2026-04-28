const Student = require('../models/Student');
const Course = require('../models/Course');
const path = require('path');
const fs = require('fs');

// @desc    Upload Student Resume
// @route   POST /api/upload/resume
// @access  Private (Student)
exports.uploadResume = async (req, res) => {
  try {
    if (!req.file) {
      return res.status(400).json({ success: false, message: 'Please upload a file' });
    }

    const studentId = req.user.id;
    const student = await Student.findOne({ userId: studentId });

    if (!student) {
      return res.status(404).json({ success: false, message: 'Student profile not found' });
    }

    // Delete old resume if it exists (only if it was a local file)
    if (student.resumeUrl && student.resumeUrl.startsWith('/uploads/')) {
      const oldPath = path.join(__dirname, '..', student.resumeUrl);
      if (fs.existsSync(oldPath)) {
        fs.unlinkSync(oldPath);
      }
    }

    // Determine File URL (Cloudinary provides path as the full URL, Local provides filename)
    const fileUrl = req.file.path.startsWith('http') 
      ? req.file.path 
      : `/uploads/${req.file.filename}`;

    student.resumeUrl = fileUrl;
    await student.save();

    res.status(200).json({
      success: true,
      message: 'Resume uploaded successfully',
      resumeUrl: fileUrl
    });
  } catch (error) {
    console.error('Upload Error:', error);
    res.status(500).json({ success: false, message: 'Server error during upload' });
  }
};

// @desc    Upload Course Material
// @route   POST /api/upload/material/:courseId
// @access  Private (Faculty/Admin)
exports.uploadMaterial = async (req, res) => {
  try {
    if (!req.file) {
      return res.status(400).json({ success: false, message: 'Please upload a file' });
    }

    const { courseId } = req.params;
    const { title } = req.body;

    const course = await Course.findById(courseId);

    if (!course) {
      return res.status(404).json({ success: false, message: 'Course not found' });
    }

    const fileUrl = req.file.path.startsWith('http') 
      ? req.file.path 
      : `/uploads/${req.file.filename}`;
    
    course.materials.push({
      title: title || req.file.originalname,
      fileUrl: fileUrl
    });

    await course.save();

    res.status(200).json({
      success: true,
      message: 'Material uploaded successfully',
      material: {
        title: title || req.file.originalname,
        fileUrl: fileUrl
      }
    });
  } catch (error) {
    console.error('Upload Error:', error);
    res.status(500).json({ success: false, message: 'Server error during upload' });
  }
};

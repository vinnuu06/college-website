const Student = require('../models/Student');
const Academic = require('../models/Academic');
const Course = require('../models/Course');

// @desc    Get student profile
// @route   GET /api/students/:id
// @access  Private
exports.getStudentProfile = async (req, res) => {
  try {
    const student = await Student.findOne({ userId: req.params.id })
      .populate('userId')
      .populate('courses');

    if (!student) {
      return res.status(404).json({ success: false, message: 'Student not found' });
    }

    res.status(200).json({ success: true, student });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// @desc    Get student academics
// @route   GET /api/students/:id/academics
// @access  Private
exports.getStudentAcademics = async (req, res) => {
  try {
    const student = await Student.findOne({ userId: req.params.id });
    if (!student) {
      return res.status(404).json({ success: false, message: 'Student not found' });
    }

    const academics = await Academic.find({ studentId: student._id })
      .populate('courseId');

    res.status(200).json({ success: true, academics });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// @desc    Get all students
// @route   GET /api/students
// @access  Private/Admin
exports.getAllStudents = async (req, res) => {
  try {
    const students = await Student.find()
      .populate('userId')
      .populate('courses');

    res.status(200).json({ success: true, count: students.length, students });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// @desc    Update student profile
// @route   PUT /api/students/:id
// @access  Private
exports.updateStudentProfile = async (req, res) => {
  try {
    const student = await Student.findOneAndUpdate(
      { userId: req.params.id },
      req.body,
      { new: true, runValidators: true }
    ).populate('userId');

    if (!student) {
      return res.status(404).json({ success: false, message: 'Student not found' });
    }

    res.status(200).json({ success: true, student });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// @desc    Enroll student in course
// @route   POST /api/students/:id/enroll/:courseId
// @access  Private
exports.enrollCourse = async (req, res) => {
  try {
    const student = await Student.findOneAndUpdate(
      { userId: req.params.id },
      { $push: { courses: req.params.courseId } },
      { new: true }
    ).populate('courses');

    if (!student) {
      return res.status(404).json({ success: false, message: 'Student not found' });
    }

    res.status(200).json({ success: true, student });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

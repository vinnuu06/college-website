const Course = require('../models/Course');

// Create course (Admin only)
exports.createCourse = async (req, res) => {
  try {
    const { courseCode, courseName, description, duration, eligibility, subjects, totalSeats } = req.body;

    // Validate course code
    if (!['BCA', 'BBA', 'BCom'].includes(courseCode)) {
      return res.status(400).json({
        success: false,
        message: 'Course code must be BCA, BBA, or BCom'
      });
    }

    // Check if course already exists
    const existingCourse = await Course.findOne({ courseCode });
    if (existingCourse) {
      return res.status(400).json({
        success: false,
        message: `${courseCode} course already exists`
      });
    }

    const course = await Course.create({
      courseCode,
      courseName,
      description,
      duration,
      eligibility,
      subjects: subjects || [],
      totalSeats
    });

    res.status(201).json({
      success: true,
      message: 'Course created successfully',
      course
    });
  } catch (error) {
    res.status(400).json({
      success: false,
      message: error.message
    });
  }
};

// Get all active courses
exports.getAllCourses = async (req, res) => {
  try {
    const courses = await Course.find({ isActive: true })
      .populate('faculty')
      .sort({ courseCode: 1 });

    res.status(200).json({
      success: true,
      count: courses.length,
      courses
    });
  } catch (error) {
    res.status(400).json({
      success: false,
      message: error.message
    });
  }
};

// Get course by ID
exports.getCourseById = async (req, res) => {
  try {
    const course = await Course.findById(req.params.id)
      .populate('faculty');

    if (!course) {
      return res.status(404).json({
        success: false,
        message: 'Course not found'
      });
    }

    res.status(200).json({
      success: true,
      course
    });
  } catch (error) {
    res.status(400).json({
      success: false,
      message: error.message
    });
  }
};

// Get course by code
exports.getCourseByCode = async (req, res) => {
  try {
    const { courseCode } = req.params;

    if (!['BCA', 'BBA', 'BCom'].includes(courseCode)) {
      return res.status(400).json({
        success: false,
        message: 'Invalid course code'
      });
    }

    const course = await Course.findOne({ courseCode, isActive: true })
      .populate('faculty');

    if (!course) {
      return res.status(404).json({
        success: false,
        message: `${courseCode} course not found`
      });
    }

    res.status(200).json({
      success: true,
      course
    });
  } catch (error) {
    res.status(400).json({
      success: false,
      message: error.message
    });
  }
};

// Update course (Admin only)
exports.updateCourse = async (req, res) => {
  try {
    const { id } = req.params;
    const { courseName, description, eligibility, subjects, totalSeats, isActive } = req.body;

    const course = await Course.findByIdAndUpdate(
      id,
      {
        courseName,
        description,
        eligibility,
        subjects,
        totalSeats,
        isActive,
        updatedAt: Date.now()
      },
      { new: true, runValidators: true }
    );

    if (!course) {
      return res.status(404).json({
        success: false,
        message: 'Course not found'
      });
    }

    res.status(200).json({
      success: true,
      message: 'Course updated successfully',
      course
    });
  } catch (error) {
    res.status(400).json({
      success: false,
      message: error.message
    });
  }
};

// Delete course (Admin only - soft delete)
exports.deleteCourse = async (req, res) => {
  try {
    const { id } = req.params;

    const course = await Course.findByIdAndUpdate(
      id,
      { isActive: false, updatedAt: Date.now() },
      { new: true }
    );

    if (!course) {
      return res.status(404).json({
        success: false,
        message: 'Course not found'
      });
    }

    res.status(200).json({
      success: true,
      message: 'Course deactivated successfully',
      course
    });
  } catch (error) {
    res.status(400).json({
      success: false,
      message: error.message
    });
  }
};

// Add subjects to course
exports.addSubjects = async (req, res) => {
  try {
    const { id } = req.params;
    const { subjects } = req.body;

    const course = await Course.findByIdAndUpdate(
      id,
      { subjects, updatedAt: Date.now() },
      { new: true, runValidators: true }
    );

    if (!course) {
      return res.status(404).json({
        success: false,
        message: 'Course not found'
      });
    }

    res.status(200).json({
      success: true,
      message: 'Subjects added successfully',
      course
    });
  } catch (error) {
    res.status(400).json({
      success: false,
      message: error.message
    });
  }
};

// Get course statistics
exports.getCourseStats = async (req, res) => {
  try {
    const stats = {
      totalCourses: await Course.countDocuments(),
      activeCourses: await Course.countDocuments({ isActive: true }),
      bca: await Course.findOne({ courseCode: 'BCA' }),
      bba: await Course.findOne({ courseCode: 'BBA' }),
      bcom: await Course.findOne({ courseCode: 'BCom' })
    };

    res.status(200).json({
      success: true,
      stats
    });
    } catch (error) {
    res.status(400).json({
      success: false,
      message: error.message
    });
  }
};

// Get students enrolled in a course
exports.getEnrolledStudents = async (req, res) => {
  try {
    const { id } = req.params;
    const Student = require('../models/Student');
    
    const students = await Student.find({ courses: id })
      .populate('userId', 'name email')
      .sort({ rollNumber: 1 });

    res.status(200).json({
      success: true,
      count: students.length,
      students
    });
  } catch (error) {
    res.status(400).json({
      success: false,
      message: error.message
    });
  }
};

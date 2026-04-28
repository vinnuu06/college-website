const Academic = require('../models/Academic');
const Course = require('../models/Course');
const Student = require('../models/Student');

// @desc    Create or update academic record
// @route   POST /api/academics
// @access  Private/Admin/Faculty
exports.createAcademic = async (req, res) => {
  try {
    const { studentId, semester, courseId, marks, academicYear } = req.body;

    const academic = await Academic.create({
      studentId,
      semester,
      courseId,
      marks,
      academicYear
    });

    res.status(201).json({ success: true, academic });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// @desc    Get student transcript
// @route   GET /api/academics/transcript/:studentId
// @access  Private
exports.getTranscript = async (req, res) => {
  try {
    const student = await Student.findOne({ userId: req.params.studentId });
    if (!student) {
      return res.status(404).json({ success: false, message: 'Student not found' });
    }

    const academics = await Academic.find({ studentId: student._id })
      .populate('courseId');

    // Calculate CGPA
    let totalCredits = 0;
    let totalPoints = 0;
    const gradePoints = { 'A+': 4, 'A': 4, 'B': 3, 'C': 2, 'D': 1, 'F': 0 };

    academics.forEach(record => {
      if (record.credits) {
        totalCredits += record.credits;
        totalPoints += gradePoints[record.grade] * record.credits;
      }
    });

    const cgpa = totalCredits > 0 ? (totalPoints / totalCredits).toFixed(2) : 0;

    res.status(200).json({
      success: true,
      student: { name: student.userId },
      academics,
      cgpa
    });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// @desc    Get all academics
// @route   GET /api/academics
// @access  Private/Admin
exports.getAllAcademics = async (req, res) => {
  try {
    const academics = await Academic.find()
      .populate('studentId')
      .populate('courseId');

    res.status(200).json({ success: true, count: academics.length, academics });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// @desc    Update academic record
// @route   PUT /api/academics/:id
// @access  Private/Admin/Faculty
exports.updateAcademic = async (req, res) => {
  try {
    const academic = await Academic.findByIdAndUpdate(
      req.params.id,
      req.body,
      { new: true, runValidators: true }
    ).populate('studentId').populate('courseId');

    if (!academic) {
      return res.status(404).json({ success: false, message: 'Academic record not found' });
    }

    res.status(200).json({ success: true, academic });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// @desc    Get student by semester
// @route   GET /api/academics/semester/:semester
// @access  Private/Admin
exports.getStudentsBySemester = async (req, res) => {
  try {
    const students = await Student.find({ semester: req.params.semester });
    const academics = await Academic.find()
      .where('studentId').in(students.map(s => s._id))
      .populate('studentId')
      .populate('courseId');

    res.status(200).json({ success: true, count: academics.length, academics });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

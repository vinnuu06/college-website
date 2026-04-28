const Exam = require('../models/Exam');

// @desc    Schedule a new exam
// @route   POST /api/exams
// @access  Private (Admin)
exports.createExam = async (req, res) => {
  try {
    const exam = await Exam.create(req.body);
    res.status(201).json({ success: true, exam });
  } catch (error) {
    res.status(400).json({ success: false, message: error.message });
  }
};

// @desc    Get all exams (with filters)
// @route   GET /api/exams
// @access  Public
exports.getExams = async (req, res) => {
  try {
    const { courseId, semester, type } = req.query;
    const query = {};
    if (courseId) query.course = courseId;
    if (semester) query.semester = semester;
    if (type) query.examType = type;

    const exams = await Exam.find(query).populate('course', 'courseName courseCode').sort({ startDate: -1 });
    res.status(200).json({ success: true, exams });
  } catch (error) {
    res.status(400).json({ success: false, message: error.message });
  }
};

// @desc    Update exam status (e.g., Declare Results)
// @route   PUT /api/exams/:id
// @access  Private (Admin)
exports.updateExam = async (req, res) => {
  try {
    const exam = await Exam.findByIdAndUpdate(req.params.id, req.body, { new: true });
    res.status(200).json({ success: true, exam });
  } catch (error) {
    res.status(400).json({ success: false, message: error.message });
  }
};

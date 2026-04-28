const Faculty = require('../models/Faculty');
const Course = require('../models/Course');

// @desc    Get faculty profile
// @route   GET /api/faculty/:id
// @access  Private
exports.getFacultyProfile = async (req, res) => {
  try {
    const faculty = await Faculty.findOne({ userId: req.params.id })
      .populate('userId')
      .populate('coursesTaught');

    if (!faculty) {
      return res.status(404).json({ success: false, message: 'Faculty not found' });
    }

    res.status(200).json({ success: true, faculty });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// @desc    Get all faculty
// @route   GET /api/faculty
// @access  Public
exports.getAllFaculty = async (req, res) => {
  try {
    const faculty = await Faculty.find()
      .populate('userId')
      .populate('coursesTaught');

    res.status(200).json({ success: true, count: faculty.length, faculty });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// @desc    Update faculty profile
// @route   PUT /api/faculty/:id
// @access  Private
exports.updateFacultyProfile = async (req, res) => {
  try {
    const faculty = await Faculty.findOneAndUpdate(
      { userId: req.params.id },
      req.body,
      { new: true, runValidators: true }
    ).populate('userId');

    if (!faculty) {
      return res.status(404).json({ success: false, message: 'Faculty not found' });
    }

    res.status(200).json({ success: true, faculty });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// @desc    Add skills to faculty
// @route   POST /api/faculty/:id/skills
// @access  Private
exports.addSkills = async (req, res) => {
  try {
    const { skills } = req.body;
    const faculty = await Faculty.findOneAndUpdate(
      { userId: req.params.id },
      { skills },
      { new: true }
    );

    if (!faculty) {
      return res.status(404).json({ success: false, message: 'Faculty not found' });
    }

    res.status(200).json({ success: true, faculty });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// @desc    Add achievement to faculty
// @route   POST /api/faculty/:id/achievements
// @access  Private
exports.addAchievement = async (req, res) => {
  try {
    const { title, description, date, award } = req.body;
    const faculty = await Faculty.findOneAndUpdate(
      { userId: req.params.id },
      { $push: { achievements: { title, description, date, award } } },
      { new: true }
    );

    if (!faculty) {
      return res.status(404).json({ success: false, message: 'Faculty not found' });
    }

    res.status(200).json({ success: true, faculty });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// @desc    Get faculty achievements
// @route   GET /api/faculty/:id/achievements
// @access  Public
exports.getFacultyAchievements = async (req, res) => {
  try {
    const faculty = await Faculty.findOne({ userId: req.params.id });

    if (!faculty) {
      return res.status(404).json({ success: false, message: 'Faculty not found' });
    }

    res.status(200).json({ success: true, achievements: faculty.achievements });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// @desc    Get faculty skills
// @route   GET /api/faculty/:id/skills
// @access  Public
exports.getFacultySkills = async (req, res) => {
  try {
    const faculty = await Faculty.findOne({ userId: req.params.id });

    if (!faculty) {
      return res.status(404).json({ success: false, message: 'Faculty not found' });
    }

    res.status(200).json({ success: true, skills: faculty.skills });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

const Course = require('../models/Course');
const Faculty = require('../models/Faculty');
const Event = require('../models/Event');

// @desc    Global Search across courses, faculty, and events
// @route   GET /api/search
// @access  Public
exports.globalSearch = async (req, res) => {
  try {
    const { q } = req.query;

    if (!q || q.length < 2) {
      return res.status(400).json({ success: false, message: 'Search query must be at least 2 characters' });
    }

    const searchRegex = new RegExp(q, 'i');

    // Search Courses
    const courses = await Course.find({
      $or: [
        { courseName: searchRegex },
        { courseCode: searchRegex },
        { description: searchRegex }
      ],
      isActive: true
    }).limit(5);

    // Search Faculty
    const faculty = await Faculty.find({
      isActive: true
    }).populate({
      path: 'userId',
      match: { name: searchRegex },
      select: 'name email'
    }).limit(5);
    
    // Filter out faculty where name didn't match (since populate match returns null for userId if no match)
    const filteredFaculty = faculty.filter(f => f.userId !== null);

    // Search Events
    const events = await Event.find({
      $or: [
        { title: searchRegex },
        { description: searchRegex },
        { category: searchRegex }
      ]
    }).limit(5);

    res.status(200).json({
      success: true,
      results: {
        courses,
        faculty: filteredFaculty,
        events
      },
      count: courses.length + filteredFaculty.length + events.length
    });
  } catch (error) {
    console.error('Search Error:', error);
    res.status(500).json({ success: false, message: 'Error performing search' });
  }
};

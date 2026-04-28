const User = require('../models/User');
const Student = require('../models/Student');
const Faculty = require('../models/Faculty');
const Course = require('../models/Course');
const Placement = require('../models/Placement');
const Admission = require('../models/Admission');
const Event = require('../models/Event');
const Contact = require('../models/Contact');
const Notification = require('../models/Notification');

// @desc    Get comprehensive dashboard stats
// @route   GET /api/dashboard/stats
// @access  Private/Admin
exports.getDashboardStats = async (req, res) => {
  try {
    const [
      totalStudents,
      totalFaculty,
      totalAdmins,
      totalCourses,
      activeCourses,
      totalAdmissions,
      pendingAdmissions,
      approvedAdmissions,
      totalPlacements,
      totalEvents,
      upcomingEvents,
      totalContacts,
      newContacts
    ] = await Promise.all([
      Student.countDocuments(),
      Faculty.countDocuments(),
      User.countDocuments({ role: 'admin' }),
      Course.countDocuments(),
      Course.countDocuments({ isActive: true }),
      Admission.countDocuments(),
      Admission.countDocuments({ status: 'Pending' }),
      Admission.countDocuments({ status: 'Approved' }),
      Placement.countDocuments(),
      Event.countDocuments(),
      Event.countDocuments({ status: 'upcoming', date: { $gte: new Date() } }),
      Contact.countDocuments(),
      Contact.countDocuments({ status: 'new' })
    ]);

    // Placement statistics
    const allPlacements = await Placement.find();
    let totalPlaced = 0;
    let totalEnrolled = 0;
    let highestPackage = 0;
    let avgPackageSum = 0;
    let avgPackageCount = 0;

    allPlacements.forEach(p => {
      totalPlaced += p.placedStudents || 0;
      totalEnrolled += p.totalStudents || 0;
      if (p.highestPackage > highestPackage) highestPackage = p.highestPackage;
      if (p.averagePackage > 0) {
        avgPackageSum += p.averagePackage;
        avgPackageCount++;
      }
    });

    const overallPlacementRate = totalEnrolled > 0 
      ? ((totalPlaced / totalEnrolled) * 100).toFixed(1) 
      : 0;

    const overallAvgPackage = avgPackageCount > 0 
      ? (avgPackageSum / avgPackageCount).toFixed(2) 
      : 0;

    // Recent activity
    const recentAdmissions = await Admission.find()
      .sort({ createdAt: -1 })
      .limit(5)
      .populate('courseApplied', 'courseName courseCode');

    const recentEvents = await Event.find()
      .sort({ date: 1 })
      .limit(5);

    // Department-wise breakdown
    const departmentBreakdown = await Student.aggregate([
      { $group: { _id: '$department', count: { $sum: 1 } } },
      { $sort: { count: -1 } }
    ]);

    // Course-wise enrollment
    const courseEnrollment = await Course.find({ isActive: true })
      .select('courseCode courseName enrolledStudents totalSeats');

    res.status(200).json({
      success: true,
      stats: {
        users: {
          students: totalStudents,
          faculty: totalFaculty,
          admins: totalAdmins,
          total: totalStudents + totalFaculty + totalAdmins
        },
        courses: {
          total: totalCourses,
          active: activeCourses,
          enrollment: courseEnrollment
        },
        admissions: {
          total: totalAdmissions,
          pending: pendingAdmissions,
          approved: approvedAdmissions,
          recent: recentAdmissions
        },
        placements: {
          totalRecords: totalPlacements,
          totalPlaced: totalPlaced,
          totalEnrolled: totalEnrolled,
          overallRate: parseFloat(overallPlacementRate),
          highestPackage,
          averagePackage: parseFloat(overallAvgPackage)
        },
        events: {
          total: totalEvents,
          upcoming: upcomingEvents,
          recent: recentEvents
        },
        contacts: {
          total: totalContacts,
          new: newContacts
        },
        departments: departmentBreakdown
      }
    });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// @desc    Get student dashboard stats
// @route   GET /api/dashboard/student/:id
// @access  Private
exports.getStudentDashboard = async (req, res) => {
  try {
    const student = await Student.findOne({ userId: req.params.id })
      .populate('userId', 'name email phone')
      .populate('courses');

    if (!student) {
      return res.status(404).json({ success: false, message: 'Student not found' });
    }

    const Academic = require('../models/Academic');
    const academics = await Academic.find({ studentId: student._id })
      .populate('courseId');

    // Calculate GPA
    let totalCredits = 0;
    let totalPoints = 0;
    const gradePoints = { 'A+': 10, 'A': 9, 'B': 8, 'C': 7, 'D': 6, 'F': 0 };

    academics.forEach(record => {
      if (record.credits) {
        totalCredits += record.credits;
        totalPoints += (gradePoints[record.grade] || 0) * record.credits;
      }
    });

    const cgpa = totalCredits > 0 ? (totalPoints / totalCredits).toFixed(2) : 0;

    // Get notifications
    const notifications = await Notification.find({ recipient: req.params.id, isRead: false })
      .sort({ createdAt: -1 })
      .limit(5);

    // Get upcoming events
    const events = await Event.find({
      status: 'upcoming',
      date: { $gte: new Date() },
      targetAudience: { $in: ['all', 'students'] }
    }).sort({ date: 1 }).limit(5);

    res.status(200).json({
      success: true,
      dashboard: {
        profile: student,
        academics: {
          records: academics,
          cgpa: parseFloat(cgpa),
          totalCredits,
          totalSubjects: academics.length
        },
        notifications,
        upcomingEvents: events,
        coursesEnrolled: student.courses?.length || 0
      }
    });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// @desc    Get faculty dashboard stats
// @route   GET /api/dashboard/faculty/:id
// @access  Private
exports.getFacultyDashboard = async (req, res) => {
  try {
    const faculty = await Faculty.findOne({ userId: req.params.id })
      .populate('userId', 'name email phone')
      .populate('coursesTaught');

    if (!faculty) {
      return res.status(404).json({ success: false, message: 'Faculty not found' });
    }

    const notifications = await Notification.find({ recipient: req.params.id, isRead: false })
      .sort({ createdAt: -1 })
      .limit(5);

    const events = await Event.find({
      status: 'upcoming',
      date: { $gte: new Date() },
      targetAudience: { $in: ['all', 'faculty'] }
    }).sort({ date: 1 }).limit(5);

    // Students in taught courses
    const courseIds = faculty.coursesTaught?.map(c => c._id) || [];
    const studentsInCourses = await Student.countDocuments({ courses: { $in: courseIds } });

    res.status(200).json({
      success: true,
      dashboard: {
        profile: faculty,
        coursesTaught: faculty.coursesTaught?.length || 0,
        studentsManaged: studentsInCourses,
        skills: faculty.skills || [],
        achievements: faculty.achievements || [],
        notifications,
        upcomingEvents: events
      }
    });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

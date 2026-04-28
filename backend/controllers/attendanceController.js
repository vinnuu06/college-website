const Attendance = require('../models/Attendance');
const Student = require('../models/Student');
const Course = require('../models/Course');

// @desc    Mark attendance for multiple students
// @route   POST /api/attendance/bulk
// @access  Private (Faculty/Admin)
exports.markBulkAttendance = async (req, res) => {
  try {
    const { courseId, date, attendanceData } = req.body; // attendanceData: [{ studentId, status, remarks }]
    const facultyId = req.user.id;

    if (!courseId || !attendanceData || !Array.isArray(attendanceData)) {
      return res.status(400).json({ success: false, message: 'Please provide courseId and attendance array' });
    }

    const attendanceRecords = attendanceData.map(item => ({
      student: item.studentId,
      course: courseId,
      date: new Date(date || Date.now()),
      status: item.status || 'Present',
      remarks: item.remarks || '',
      markedBy: facultyId
    }));

    // Use bulkWrite for performance and to handle potential duplicates (index)
    const ops = attendanceRecords.map(record => ({
      updateOne: {
        filter: { student: record.student, course: record.course, date: record.date },
        update: { $set: record },
        upsert: true
      }
    }));

    await Attendance.bulkWrite(ops);

    res.status(200).json({
      success: true,
      message: `Attendance marked for ${attendanceData.length} students`
    });
  } catch (error) {
    console.error('Attendance Error:', error);
    res.status(500).json({ success: false, message: 'Error marking attendance' });
  }
};

// @desc    Get attendance summary for a student
// @route   GET /api/attendance/student/:studentId
// @access  Private
exports.getStudentAttendance = async (req, res) => {
  try {
    const { studentId } = req.params;
    
    // Get all records for student
    const records = await Attendance.find({ student: studentId }).populate('course', 'courseName courseCode');

    // Group by course to calculate percentage
    const summary = {};
    records.forEach(rec => {
      const cid = rec.course._id.toString();
      if (!summary[cid]) {
        summary[cid] = {
          courseName: rec.course.courseName,
          courseCode: rec.course.courseCode,
          total: 0,
          present: 0
        };
      }
      summary[cid].total++;
      if (rec.status === 'Present' || rec.status === 'Late') {
        summary[cid].present++;
      }
    });

    const finalSummary = Object.values(summary).map(s => ({
      ...s,
      percentage: ((s.present / s.total) * 100).toFixed(2)
    }));

    res.status(200).json({
      success: true,
      summary: finalSummary,
      totalRecords: records.length
    });
  } catch (error) {
    console.error('Attendance Summary Error:', error);
    res.status(500).json({ success: false, message: 'Error fetching attendance summary' });
  }
};

// @desc    Get attendance for a specific course (Faculty view)
// @route   GET /api/attendance/course/:courseId
// @access  Private (Faculty/Admin)
exports.getCourseAttendance = async (req, res) => {
  try {
    const { courseId } = req.params;
    const { date } = req.query;

    const query = { course: courseId };
    if (date) {
      const startOfDay = new Date(date);
      startOfDay.setHours(0, 0, 0, 0);
      const endOfDay = new Date(date);
      endOfDay.setHours(23, 59, 59, 999);
      query.date = { $gte: startOfDay, $lte: endOfDay };
    }

    const records = await Attendance.find(query)
      .populate({
        path: 'student',
        populate: { path: 'userId', select: 'name' }
      })
      .sort({ date: -1 });

    res.status(200).json({
      success: true,
      count: records.length,
      records
    });
  } catch (error) {
    console.error('Course Attendance Error:', error);
    res.status(500).json({ success: false, message: 'Error fetching course attendance' });
  }
};

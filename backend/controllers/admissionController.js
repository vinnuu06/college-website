const Admission = require('../models/Admission');
const Course = require('../models/Course');
const { sendEmail } = require('../utils/emailService');

// Create admission application
exports.createAdmission = async (req, res) => {
  try {
    const { fullName, email, phone, marks, courseApplied, address, dob, qualifying10Marks, qualifying12Marks } = req.body;

    // Validate course exists
    const course = await Course.findById(courseApplied);
    if (!course) {
      return res.status(404).json({ success: false, message: 'Course not found' });
    }

    // Check if admission already exists for this email
    const existingAdmission = await Admission.findOne({ email });
    if (existingAdmission) {
      return res.status(400).json({ success: false, message: 'Admission application already exists for this email' });
    }

    const admission = await Admission.create({
      fullName,
      email,
      phone,
      marks,
      percentage: (marks / 100) * 100,
      courseApplied,
      address,
      dob,
      qualifying10Marks,
      qualifying12Marks
    });

    res.status(201).json({
      success: true,
      message: 'Admission application submitted successfully',
      admission
    });
  } catch (error) {
    res.status(400).json({
      success: false,
      message: error.message
    });
  }
};

// Get all admissions (Admin only)
exports.getAllAdmissions = async (req, res) => {
  try {
    const admissions = await Admission.find()
      .populate('courseApplied', 'courseName courseCode')
      .sort({ createdAt: -1 });

    res.status(200).json({
      success: true,
      count: admissions.length,
      admissions
    });
  } catch (error) {
    res.status(400).json({
      success: false,
      message: error.message
    });
  }
};

// Get admissions by course
exports.getAdmissionsByCourse = async (req, res) => {
  try {
    const { courseId } = req.params;

    const admissions = await Admission.find({ courseApplied: courseId })
      .populate('courseApplied', 'courseName courseCode')
      .sort({ createdAt: -1 });

    res.status(200).json({
      success: true,
      count: admissions.length,
      admissions
    });
  } catch (error) {
    res.status(400).json({
      success: false,
      message: error.message
    });
  }
};

// Get admissions by status
exports.getAdmissionsByStatus = async (req, res) => {
  try {
    const { status } = req.params;

    if (!['Pending', 'Approved', 'Rejected', 'Waitlisted'].includes(status)) {
      return res.status(400).json({ success: false, message: 'Invalid status' });
    }

    const admissions = await Admission.find({ status })
      .populate('courseApplied', 'courseName courseCode')
      .sort({ createdAt: -1 });

    res.status(200).json({
      success: true,
      count: admissions.length,
      admissions
    });
  } catch (error) {
    res.status(400).json({
      success: false,
      message: error.message
    });
  }
};

// Get admission by ID
exports.getAdmissionById = async (req, res) => {
  try {
    const { id } = req.params;

    const admission = await Admission.findById(id)
      .populate('courseApplied');

    if (!admission) {
      return res.status(404).json({ success: false, message: 'Admission not found' });
    }

    res.status(200).json({
      success: true,
      admission
    });
  } catch (error) {
    res.status(400).json({
      success: false,
      message: error.message
    });
  }
};

// Update admission status (Admin only)
exports.updateAdmissionStatus = async (req, res) => {
  try {
    const { id } = req.params;
    const { status, notes } = req.body;

    if (!['Pending', 'Approved', 'Rejected', 'Waitlisted'].includes(status)) {
      return res.status(400).json({ success: false, message: 'Invalid status' });
    }

    const admission = await Admission.findByIdAndUpdate(
      id,
      { status, notes, admittedDate: status === 'Approved' ? Date.now() : null },
      { new: true, runValidators: true }
    );

    if (!admission) {
      return res.status(404).json({ success: false, message: 'Admission not found' });
    }

    // Send Email Notification
    const emailSubject = `Update regarding your Admission Application - ${status}`;
    const emailTitle = `Admission Status: ${status}`;
    const emailMessage = `Dear ${admission.fullName},\n\nYour application for admission to Bellari Business College has been updated to <b>${status}</b>.\n\n${notes ? `<b>Admin Notes:</b> ${notes}` : ''}\n\nPlease contact the admission office for further instructions.`;
    
    await sendEmail(admission.email, emailSubject, emailTitle, emailMessage);

    res.status(200).json({
      success: true,
      message: `Admission status updated to ${status}`,
      admission
    });
  } catch (error) {
    res.status(400).json({
      success: false,
      message: error.message
    });
  }
};

// Verify documents
exports.verifyDocuments = async (req, res) => {
  try {
    const { id } = req.params;

    const admission = await Admission.findByIdAndUpdate(
      id,
      { documentVerified: true },
      { new: true }
    );

    if (!admission) {
      return res.status(404).json({ success: false, message: 'Admission not found' });
    }

    res.status(200).json({
      success: true,
      message: 'Documents verified',
      admission
    });
  } catch (error) {
    res.status(400).json({
      success: false,
      message: error.message
    });
  }
};

// Get admission statistics
exports.getAdmissionStats = async (req, res) => {
  try {
    const stats = {
      totalApplications: await Admission.countDocuments(),
      approved: await Admission.countDocuments({ status: 'Approved' }),
      rejected: await Admission.countDocuments({ status: 'Rejected' }),
      pending: await Admission.countDocuments({ status: 'Pending' }),
      waitlisted: await Admission.countDocuments({ status: 'Waitlisted' }),
      documentVerified: await Admission.countDocuments({ documentVerified: true }),
      averageMarks: await Admission.aggregate([
        { $group: { _id: null, avgMarks: { $avg: '$marks' } } }
      ])
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

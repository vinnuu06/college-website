const mongoose = require('mongoose');

const examSchema = new mongoose.Schema({
  course: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Course',
    required: true
  },
  semester: {
    type: Number,
    required: true
  },
  examType: {
    type: String,
    enum: ['Internal', 'Semester-End', 'Lab-Exam', 'Supplementary'],
    required: true
  },
  title: {
    type: String,
    required: true
  },
  startDate: {
    type: Date,
    required: true
  },
  endDate: {
    type: Date,
    required: true
  },
  timetableUrl: {
    type: String,
    default: ''
  },
  resultsDeclared: {
    type: Boolean,
    default: false
  },
  academicYear: {
    type: String,
    required: true
  },
  createdAt: {
    type: Date,
    default: Date.now
  }
});

module.exports = mongoose.model('Exam', examSchema);

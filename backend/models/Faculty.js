const mongoose = require('mongoose');

const facultySchema = new mongoose.Schema({
  userId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  employeeId: {
    type: String,
    required: true,
    unique: true
  },
  department: {
    type: String,
    required: true
  },
  designation: {
    type: String,
    required: true
  },
  specialization: String,
  qualification: String,
  skills: [String],
  achievements: [{
    title: String,
    description: String,
    date: Date,
    award: String
  }],
  coursesTaught: [{
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Course'
  }],
  experience: Number,
  joinDate: {
    type: Date,
    default: Date.now
  },
  isActive: {
    type: Boolean,
    default: true
  },
  createdAt: {
    type: Date,
    default: Date.now
  }
});

module.exports = mongoose.model('Faculty', facultySchema);

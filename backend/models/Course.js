const mongoose = require('mongoose');

const courseSchema = new mongoose.Schema({
  courseCode: {
    type: String,
    required: [true, 'Please provide a course code'],
    unique: true,
    enum: ['BCA', 'BBA', 'B.Com', 'M.Com']
  },
  department: {
    type: String,
    required: true
  },
  courseName: {
    type: String,
    required: [true, 'Please provide a course name']
  },
  description: {
    type: String,
    required: true
  },
  duration: {
    type: Number,
    required: [true, 'Please provide course duration in years'],
    min: 1,
    max: 6
  },
  eligibility: {
    type: String,
    required: [true, 'Please provide eligibility criteria']
  },
  curriculum: [{
    semester: Number,
    subjects: [{
      name: String,
      credits: Number
    }]
  }],
  totalSeats: {
    type: Number,
    required: true,
    min: 1
  },
  enrolledStudents: {
    type: Number,
    default: 0
  },
  faculty: [{
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Faculty'
  }],
  isActive: {
    type: Boolean,
    default: true
  },
  materials: [{
    title: String,
    fileUrl: String,
    uploadDate: { type: Date, default: Date.now }
  }],
  createdAt: {
    type: Date,
    default: Date.now
  },
  updatedAt: {
    type: Date,
    default: Date.now
  }
});

courseSchema.index({ courseCode: 1 });
courseSchema.index({ createdAt: -1 });

module.exports = mongoose.model('Course', courseSchema);

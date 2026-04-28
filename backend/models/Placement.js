const mongoose = require('mongoose');

const placementSchema = new mongoose.Schema({
  course: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Course',
    required: [true, 'Please provide course']
  },
  academicYear: {
    type: String,
    required: [true, 'Please provide academic year']
  },
  totalStudents: {
    type: Number,
    required: [true, 'Please provide total students'],
    min: 0
  },
  placedStudents: {
    type: Number,
    required: [true, 'Please provide number of placed students'],
    min: 0
  },
  placementPercentage: {
    type: Number,
    default: 0,
    min: 0,
    max: 100
  },
  highestPackage: {
    type: Number,
    default: 0,
    min: 0
  },
  averagePackage: {
    type: Number,
    default: 0,
    min: 0
  },
  lowestPackage: {
    type: Number,
    default: 0,
    min: 0
  },
  companies: [{
    companyName: {
      type: String,
      required: true
    },
    position: String,
    ctcOffered: Number,
    studentCount: Number,
    joiningDate: Date
  }],
  students: [{
    studentId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Student'
    },
    companyName: String,
    position: String,
    salary: Number,
    joiningDate: Date,
    status: {
      type: String,
      enum: ['Placed', 'Not Placed'],
      default: 'Not Placed'
    }
  }],
  remarks: String,
  createdAt: {
    type: Date,
    default: Date.now
  },
  updatedAt: {
    type: Date,
    default: Date.now
  }
});

// Auto-calculate placement percentage
placementSchema.pre('save', function(next) {
  if (this.totalStudents > 0) {
    this.placementPercentage = (this.placedStudents / this.totalStudents) * 100;
  }
  this.updatedAt = Date.now();
  next();
});

placementSchema.index({ course: 1, academicYear: 1 });
placementSchema.index({ academicYear: 1 });

module.exports = mongoose.model('Placement', placementSchema);

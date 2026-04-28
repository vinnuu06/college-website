const mongoose = require('mongoose');

const academicSchema = new mongoose.Schema({
  studentId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Student',
    required: true
  },
  semester: {
    type: Number,
    required: true
  },
  courseId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Course',
    required: true
  },
  marks: {
    internals: Number,
    externals: Number,
    total: Number
  },
  grade: String,
  credits: Number,
  academicYear: String,
  createdAt: {
    type: Date,
    default: Date.now
  }
});

// Automatically calculate total and grade
academicSchema.pre('save', function(next) {
  if (this.marks.internals && this.marks.externals) {
    this.marks.total = this.marks.internals + this.marks.externals;
    
    if (this.marks.total >= 90) this.grade = 'A+';
    else if (this.marks.total >= 80) this.grade = 'A';
    else if (this.marks.total >= 70) this.grade = 'B';
    else if (this.marks.total >= 60) this.grade = 'C';
    else if (this.marks.total >= 50) this.grade = 'D';
    else this.grade = 'F';
  }
  next();
});

module.exports = mongoose.model('Academic', academicSchema);

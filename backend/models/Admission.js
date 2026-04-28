const mongoose = require('mongoose');

const admissionSchema = new mongoose.Schema({
  fullName: {
    type: String,
    required: [true, 'Please provide full name'],
    trim: true
  },
  email: {
    type: String,
    required: [true, 'Please provide email'],
    unique: true,
    lowercase: true,
    match: [
      /^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/,
      'Please provide a valid email'
    ]
  },
  phone: {
    type: String,
    required: [true, 'Please provide phone number'],
    unique: true
  },
  marks: {
    type: Number,
    required: [true, 'Please provide marks obtained'],
    min: 0,
    max: 100
  },
  percentage: {
    type: Number,
    required: true,
    min: 0,
    max: 100
  },
  courseApplied: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Course',
    required: true
  },
  status: {
    type: String,
    enum: ['Pending', 'Approved', 'Rejected', 'Waitlisted'],
    default: 'Pending'
  },
  address: String,
  dob: Date,
  qualifying10Marks: Number,
  qualifying12Marks: Number,
  documentVerified: {
    type: Boolean,
    default: false
  },
  admittedDate: Date,
  notes: String,
  createdAt: {
    type: Date,
    default: Date.now
  },
  updatedAt: {
    type: Date,
    default: Date.now
  }
});

// Auto-calculate percentage from marks
admissionSchema.pre('save', function(next) {
  if (this.marks) {
    this.percentage = (this.marks / 100) * 100;
  }
  this.updatedAt = Date.now();
  next();
});

admissionSchema.index({ email: 1 });
admissionSchema.index({ phone: 1 });
admissionSchema.index({ courseApplied: 1 });
admissionSchema.index({ status: 1 });

module.exports = mongoose.model('Admission', admissionSchema);

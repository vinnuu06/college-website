const mongoose = require('mongoose');

const transactionSchema = new mongoose.Schema({
  user: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  amount: {
    type: Number,
    required: true
  },
  currency: {
    type: String,
    default: 'INR'
  },
  purpose: {
    type: String,
    enum: ['Admission Fee', 'Semester Fee', 'Exam Fee', 'Other'],
    required: true
  },
  status: {
    type: String,
    enum: ['Pending', 'Success', 'Failed'],
    default: 'Pending'
  },
  paymentMethod: {
    type: String,
    default: 'Simulation'
  },
  transactionId: {
    type: String,
    unique: true
  },
  referenceId: {
    type: String // e.g. Admission ID or Student Roll No
  },
  paidAt: {
    type: Date
  },
  createdAt: {
    type: Date,
    default: Date.now
  }
});

module.exports = mongoose.model('Transaction', transactionSchema);

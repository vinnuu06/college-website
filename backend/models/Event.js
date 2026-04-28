const mongoose = require('mongoose');

const eventSchema = new mongoose.Schema({
  title: {
    type: String,
    required: [true, 'Please provide event title'],
    trim: true
  },
  description: {
    type: String,
    required: [true, 'Please provide event description']
  },
  eventType: {
    type: String,
    enum: ['Academic', 'Orientation', 'Workshop', 'Fest', 'Placement', 'Sports', 'Cultural', 'Other'],
    required: true
  },
  date: {
    type: Date,
    required: [true, 'Please provide event date']
  },
  endDate: Date,
  time: String,
  venue: {
    type: String,
    required: [true, 'Please provide venue']
  },
  organizer: {
    type: String,
    default: 'Ballari Business College'
  },
  targetAudience: {
    type: String,
    enum: ['all', 'students', 'faculty', 'bca', 'bba', 'bcom'],
    default: 'all'
  },
  maxParticipants: {
    type: Number,
    default: 0
  },
  registeredParticipants: [{
    userId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User'
    },
    registeredAt: {
      type: Date,
      default: Date.now
    }
  }],
  status: {
    type: String,
    enum: ['upcoming', 'ongoing', 'completed', 'cancelled'],
    default: 'upcoming'
  },
  isPinned: {
    type: Boolean,
    default: false
  },
  imageUrl: String,
  tags: [String],
  createdBy: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User'
  },
  createdAt: {
    type: Date,
    default: Date.now
  },
  updatedAt: {
    type: Date,
    default: Date.now
  }
});

eventSchema.index({ date: 1 });
eventSchema.index({ status: 1 });
eventSchema.index({ eventType: 1 });

module.exports = mongoose.model('Event', eventSchema);

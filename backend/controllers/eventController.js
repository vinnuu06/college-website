const Event = require('../models/Event');

// @desc    Create event
// @route   POST /api/events
// @access  Private/Admin
exports.createEvent = async (req, res) => {
  try {
    const eventData = { ...req.body, createdBy: req.user.id };
    const event = await Event.create(eventData);

    res.status(201).json({
      success: true,
      message: 'Event created successfully',
      event
    });
  } catch (error) {
    res.status(400).json({ success: false, message: error.message });
  }
};

// @desc    Get all events
// @route   GET /api/events
// @access  Public
exports.getAllEvents = async (req, res) => {
  try {
    const { status, type, upcoming, limit = 50 } = req.query;
    const filter = {};

    if (status) filter.status = status;
    if (type) filter.eventType = type;
    if (upcoming === 'true') {
      filter.date = { $gte: new Date() };
      filter.status = { $in: ['upcoming', 'ongoing'] };
    }

    const events = await Event.find(filter)
      .sort({ isPinned: -1, date: 1 })
      .limit(parseInt(limit))
      .populate('createdBy', 'name');

    res.status(200).json({
      success: true,
      count: events.length,
      events
    });
  } catch (error) {
    res.status(400).json({ success: false, message: error.message });
  }
};

// @desc    Get event by ID
// @route   GET /api/events/:id
// @access  Public
exports.getEventById = async (req, res) => {
  try {
    const event = await Event.findById(req.params.id)
      .populate('createdBy', 'name')
      .populate('registeredParticipants.userId', 'name email');

    if (!event) {
      return res.status(404).json({ success: false, message: 'Event not found' });
    }

    res.status(200).json({ success: true, event });
  } catch (error) {
    res.status(400).json({ success: false, message: error.message });
  }
};

// @desc    Update event
// @route   PUT /api/events/:id
// @access  Private/Admin
exports.updateEvent = async (req, res) => {
  try {
    const event = await Event.findByIdAndUpdate(
      req.params.id,
      { ...req.body, updatedAt: Date.now() },
      { new: true, runValidators: true }
    );

    if (!event) {
      return res.status(404).json({ success: false, message: 'Event not found' });
    }

    res.status(200).json({ success: true, message: 'Event updated', event });
  } catch (error) {
    res.status(400).json({ success: false, message: error.message });
  }
};

// @desc    Delete event
// @route   DELETE /api/events/:id
// @access  Private/Admin
exports.deleteEvent = async (req, res) => {
  try {
    const event = await Event.findByIdAndDelete(req.params.id);

    if (!event) {
      return res.status(404).json({ success: false, message: 'Event not found' });
    }

    res.status(200).json({ success: true, message: 'Event deleted' });
  } catch (error) {
    res.status(400).json({ success: false, message: error.message });
  }
};

// @desc    Register for event
// @route   POST /api/events/:id/register
// @access  Private
exports.registerForEvent = async (req, res) => {
  try {
    const event = await Event.findById(req.params.id);

    if (!event) {
      return res.status(404).json({ success: false, message: 'Event not found' });
    }

    if (event.status === 'cancelled' || event.status === 'completed') {
      return res.status(400).json({ success: false, message: 'Cannot register for this event' });
    }

    // Check if already registered
    const alreadyRegistered = event.registeredParticipants.some(
      p => p.userId.toString() === req.user.id
    );

    if (alreadyRegistered) {
      return res.status(400).json({ success: false, message: 'Already registered for this event' });
    }

    // Check max participants
    if (event.maxParticipants > 0 && event.registeredParticipants.length >= event.maxParticipants) {
      return res.status(400).json({ success: false, message: 'Event is full' });
    }

    event.registeredParticipants.push({ userId: req.user.id });
    await event.save();

    res.status(200).json({
      success: true,
      message: 'Registered successfully',
      participantCount: event.registeredParticipants.length
    });
  } catch (error) {
    res.status(400).json({ success: false, message: error.message });
  }
};

// @desc    Get event statistics
// @route   GET /api/events/stats/overview
// @access  Public
exports.getEventStats = async (req, res) => {
  try {
    const stats = {
      total: await Event.countDocuments(),
      upcoming: await Event.countDocuments({ status: 'upcoming' }),
      ongoing: await Event.countDocuments({ status: 'ongoing' }),
      completed: await Event.countDocuments({ status: 'completed' }),
      cancelled: await Event.countDocuments({ status: 'cancelled' }),
      byType: await Event.aggregate([
        { $group: { _id: '$eventType', count: { $sum: 1 } } }
      ]),
      totalParticipants: await Event.aggregate([
        { $unwind: '$registeredParticipants' },
        { $count: 'total' }
      ])
    };

    res.status(200).json({ success: true, stats });
  } catch (error) {
    res.status(400).json({ success: false, message: error.message });
  }
};

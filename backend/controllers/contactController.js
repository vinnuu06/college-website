const Contact = require('../models/Contact');

// @desc    Submit contact form
// @route   POST /api/contact
// @access  Public
exports.submitContact = async (req, res) => {
  try {
    const { name, email, phone, subject, message, category } = req.body;

    const contact = await Contact.create({
      name,
      email,
      phone,
      subject,
      message,
      category: category || 'general',
      ipAddress: req.ip
    });

    res.status(201).json({
      success: true,
      message: 'Your message has been sent successfully. We will get back to you soon!',
      contact: { id: contact._id, name: contact.name, subject: contact.subject }
    });
  } catch (error) {
    res.status(400).json({ success: false, message: error.message });
  }
};

// @desc    Get all contact submissions
// @route   GET /api/contact
// @access  Private/Admin
exports.getAllContacts = async (req, res) => {
  try {
    const { status, category, page = 1, limit = 20 } = req.query;
    const filter = {};

    if (status) filter.status = status;
    if (category) filter.category = category;

    const contacts = await Contact.find(filter)
      .sort({ createdAt: -1 })
      .skip((page - 1) * limit)
      .limit(parseInt(limit))
      .populate('respondedBy', 'name');

    const total = await Contact.countDocuments(filter);

    res.status(200).json({
      success: true,
      count: contacts.length,
      total,
      page: parseInt(page),
      pages: Math.ceil(total / limit),
      contacts
    });
  } catch (error) {
    res.status(400).json({ success: false, message: error.message });
  }
};

// @desc    Get contact by ID
// @route   GET /api/contact/:id
// @access  Private/Admin
exports.getContactById = async (req, res) => {
  try {
    const contact = await Contact.findById(req.params.id)
      .populate('respondedBy', 'name email');

    if (!contact) {
      return res.status(404).json({ success: false, message: 'Contact submission not found' });
    }

    res.status(200).json({ success: true, contact });
  } catch (error) {
    res.status(400).json({ success: false, message: error.message });
  }
};

// @desc    Update contact status and respond
// @route   PUT /api/contact/:id
// @access  Private/Admin
exports.updateContact = async (req, res) => {
  try {
    const { status, response, priority } = req.body;
    const updateData = {};

    if (status) updateData.status = status;
    if (priority) updateData.priority = priority;
    if (response) {
      updateData.response = response;
      updateData.respondedBy = req.user.id;
      updateData.respondedAt = Date.now();
    }

    const contact = await Contact.findByIdAndUpdate(
      req.params.id,
      updateData,
      { new: true, runValidators: true }
    );

    if (!contact) {
      return res.status(404).json({ success: false, message: 'Contact submission not found' });
    }

    res.status(200).json({ success: true, message: 'Contact updated', contact });
  } catch (error) {
    res.status(400).json({ success: false, message: error.message });
  }
};

// @desc    Delete contact
// @route   DELETE /api/contact/:id
// @access  Private/Admin
exports.deleteContact = async (req, res) => {
  try {
    const contact = await Contact.findByIdAndDelete(req.params.id);

    if (!contact) {
      return res.status(404).json({ success: false, message: 'Contact submission not found' });
    }

    res.status(200).json({ success: true, message: 'Contact deleted' });
  } catch (error) {
    res.status(400).json({ success: false, message: error.message });
  }
};

// @desc    Get contact statistics
// @route   GET /api/contact/stats
// @access  Private/Admin
exports.getContactStats = async (req, res) => {
  try {
    const stats = {
      total: await Contact.countDocuments(),
      new: await Contact.countDocuments({ status: 'new' }),
      inProgress: await Contact.countDocuments({ status: 'in_progress' }),
      resolved: await Contact.countDocuments({ status: 'resolved' }),
      closed: await Contact.countDocuments({ status: 'closed' }),
      byCategory: await Contact.aggregate([
        { $group: { _id: '$category', count: { $sum: 1 } } }
      ]),
      byPriority: await Contact.aggregate([
        { $group: { _id: '$priority', count: { $sum: 1 } } }
      ]),
      avgResponseTime: await Contact.aggregate([
        { $match: { respondedAt: { $exists: true } } },
        {
          $project: {
            responseTime: { $subtract: ['$respondedAt', '$createdAt'] }
          }
        },
        { $group: { _id: null, avg: { $avg: '$responseTime' } } }
      ])
    };

    res.status(200).json({ success: true, stats });
  } catch (error) {
    res.status(400).json({ success: false, message: error.message });
  }
};

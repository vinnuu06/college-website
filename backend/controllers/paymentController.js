const Transaction = require('../models/Transaction');
const crypto = require('crypto');

// @desc    Initiate a payment (Simulated Order Creation)
// @route   POST /api/payment/initiate
// @access  Private
exports.initiatePayment = async (req, res) => {
  try {
    const { amount, purpose, referenceId } = req.body;

    const transactionId = 'BBC-' + crypto.randomBytes(4).toString('hex').toUpperCase();

    const transaction = await Transaction.create({
      user: req.user.id,
      amount,
      purpose,
      referenceId,
      transactionId,
      status: 'Pending'
    });

    res.status(201).json({
      success: true,
      transaction
    });
  } catch (error) {
    res.status(400).json({ success: false, message: error.message });
  }
};

// @desc    Verify/Complete payment (Simulated)
// @route   POST /api/payment/verify
// @access  Private
exports.verifyPayment = async (req, res) => {
  try {
    const { transactionId } = req.body;

    const transaction = await Transaction.findOne({ transactionId, user: req.user.id });

    if (!transaction) {
      return res.status(404).json({ success: false, message: 'Transaction not found' });
    }

    // In a real app, you would check Razorpay/Stripe signature here
    transaction.status = 'Success';
    transaction.paidAt = Date.now();
    await transaction.save();

    res.status(200).json({
      success: true,
      message: 'Payment verified successfully',
      transaction
    });
  } catch (error) {
    res.status(400).json({ success: false, message: error.message });
  }
};

// @desc    Get user transactions
// @route   GET /api/payment/history
// @access  Private
exports.getPaymentHistory = async (req, res) => {
  try {
    const history = await Transaction.find({ user: req.user.id }).sort({ createdAt: -1 });
    res.status(200).json({ success: true, history });
  } catch (error) {
    res.status(400).json({ success: false, message: error.message });
  }
};

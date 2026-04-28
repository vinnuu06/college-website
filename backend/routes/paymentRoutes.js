const express = require('express');
const router = express.Router();
const { protect } = require('../middleware/auth');
const { initiatePayment, verifyPayment, getPaymentHistory } = require('../controllers/paymentController');

router.post('/initiate', protect, initiatePayment);
router.post('/verify', protect, verifyPayment);
router.get('/history', protect, getPaymentHistory);

module.exports = router;

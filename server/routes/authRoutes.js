const express = require('express');
const router = express.Router();
const { registerUser, loginUser, getUserProfile, redeemPoints, applyVoucher, markVoucherUsed } = require('../controllers/authController');
const { protect } = require('../middleware/authMiddleware');

router.post('/register', registerUser);
router.post('/login', loginUser);
router.get('/profile', protect, getUserProfile);
router.post('/redeem', protect, redeemPoints);
router.post('/apply-voucher', protect, applyVoucher);
router.post('/mark-voucher-used', protect, markVoucherUsed);

module.exports = router;

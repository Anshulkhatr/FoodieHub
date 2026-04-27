const express = require('express');
const router = express.Router();
const { registerUser, loginUser, getUserProfile, redeemPoints, applyVoucher, markVoucherUsed, getAllUsers, deleteUser, updateUserProfile } = require('../controllers/authController');
const { protect } = require('../middleware/authMiddleware');
const { admin } = require('../middleware/adminMiddleware');


router.post('/register', registerUser);
router.post('/login', loginUser);
router.get('/profile', protect, getUserProfile);
router.put('/profile', protect, updateUserProfile);
router.post('/redeem', protect, redeemPoints);
router.post('/apply-voucher', protect, applyVoucher);
router.post('/mark-voucher-used', protect, markVoucherUsed);

// Admin Routes
router.get('/users', protect, admin, getAllUsers);
router.delete('/users/:id', protect, admin, deleteUser);


module.exports = router;

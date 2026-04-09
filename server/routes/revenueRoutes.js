const express = require('express');
const router = express.Router();
const { getRevenueStats } = require('../controllers/revenueController');
const { protect } = require('../middleware/authMiddleware');
const { admin } = require('../middleware/adminMiddleware');

router.get('/', protect, admin, getRevenueStats);

module.exports = router;

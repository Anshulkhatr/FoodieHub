const express = require('express');
const router = express.Router();
const { generateDescription, getOrderStatusAI } = require('../controllers/aiController');
const { protect } = require('../middleware/authMiddleware');
const { admin } = require('../middleware/adminMiddleware');

// Route: POST /api/admin/ai/generate
// Access: Private (Admin Only)
router.post('/generate', protect, admin, generateDescription);

// Route: POST /api/admin/ai/order-status
// Access: Private (User/Admin)
router.post('/order-status', protect, getOrderStatusAI);

module.exports = router;

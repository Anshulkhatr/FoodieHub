const express = require('express');
const router = express.Router();
const { createOrder, getMyOrders, getAllOrders, updateStatus } = require('../controllers/orderController');
const { protect } = require('../middleware/authMiddleware');
const { admin } = require('../middleware/adminMiddleware');

router.route('/')
  .post(protect, createOrder)
  .get(protect, admin, getAllOrders);

router.route('/mine').get(protect, getMyOrders);

router.route('/:id/status').put(protect, admin, updateStatus);

module.exports = router;

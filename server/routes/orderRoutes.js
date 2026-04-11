const express = require('express');
const router = express.Router();
const { createOrder, getMyOrders, getAllOrders, updateStatus, deleteOrder } = require('../controllers/orderController');
const { protect } = require('../middleware/authMiddleware');
const { admin } = require('../middleware/adminMiddleware');

router.route('/')
  .post(protect, createOrder)
  .get(protect, admin, getAllOrders);

router.route('/mine').get(protect, getMyOrders);

router.route('/:id/status').put(protect, updateStatus);
router.route('/:id').delete(protect, admin, deleteOrder);

module.exports = router;

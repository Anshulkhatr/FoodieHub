const express = require('express');
const router = express.Router();
const { getMenu, getAllMenuAdmin, addItem, updateItem, deleteItem } = require('../controllers/menuController');
const { protect } = require('../middleware/authMiddleware');
const { admin } = require('../middleware/adminMiddleware');

router.route('/')
  .get(getMenu)
  .post(protect, admin, addItem);

router.route('/admin')
  .get(protect, admin, getAllMenuAdmin);

router.route('/:id')
  .put(protect, admin, updateItem)
  .delete(protect, admin, deleteItem);

module.exports = router;

const Order = require('../models/Order');

const getRevenueStats = async (req, res) => {
  try {
    const revenue = await Order.aggregate([
      { $match: { status: 'Delivered' } },
      { $group: { _id: null, totalRevenue: { $sum: "$totalPrice" }, count: { $sum: 1 } } }
    ]);
    res.json(revenue.length > 0 ? revenue[0] : { totalRevenue: 0, count: 0 });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

module.exports = { getRevenueStats };

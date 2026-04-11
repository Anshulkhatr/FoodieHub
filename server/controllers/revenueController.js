const Order = require('../models/Order');

const getRevenueStats = async (req, res) => {
  const { period = 'weekly' } = req.query;
  const now = new Date();
  let startDate;
  let format;
  let groupType;

  try {
    if (period === 'weekly') {
      startDate = new Date(now.getTime() - (7 * 24 * 60 * 60 * 1000));
      format = '%a'; // Mon, Tue...
      groupType = 'day';
    } else if (period === 'monthly') {
      startDate = new Date(now.getTime() - (30 * 24 * 60 * 60 * 1000));
      format = '%d %b'; // 01 Jan
      groupType = 'day';
    } else if (period === 'yearly') {
      startDate = new Date(now.getFullYear(), 0, 1); // Start of current year
      format = '%b'; // Jan, Feb...
      groupType = 'month';
    }

    const matchStage = {
      $match: {
        status: 'Delivered',
        createdAt: { $gte: startDate }
      }
    };

    const groupStage = {
      $group: {
        _id: {
          $dateToString: { format: format, date: "$createdAt" }
        },
        revenue: { $sum: "$totalPrice" },
        count: { $sum: 1 },
        sortDate: { $first: "$createdAt" } // to sort correctly
      }
    };

    const sortStage = { $sort: { sortDate: 1 } };

    const stats = await Order.aggregate([matchStage, groupStage, sortStage]);

    // Calculate totals
    const totalRevenue = stats.reduce((acc, curr) => acc + curr.revenue, 0);
    const totalOrders = stats.reduce((acc, curr) => acc + curr.count, 0);

    // Format breakdown for frontend
    const breakdown = stats.map(item => ({
      label: item._id,
      value: item.revenue,
      count: item.count
    }));

    res.json({
      period,
      totalRevenue,
      totalOrders,
      avgOrderValue: totalOrders > 0 ? totalRevenue / totalOrders : 0,
      breakdown
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

module.exports = { getRevenueStats };

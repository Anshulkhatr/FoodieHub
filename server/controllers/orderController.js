const Order = require('../models/Order');
const User = require('../models/User');

const createOrder = async (req, res) => {
  const { items, totalPrice } = req.body;
  if (items && items.length === 0) {
    return res.status(400).json({ message: 'No order items' });
  }

  try {
    const order = new Order({ 
      user: req.user._id, 
      items, 
      totalPrice,
      status: 'Preparing',
      statusHistory: [{ status: 'Preparing' }]
    });
    
    const createdOrder = await order.save();

    // Award Loyalty Points: 10 points per 1 unit of currency (e.g. ₹1)
    const user = await User.findById(req.user._id);
    if (user) {
      user.loyaltyPoints += Math.floor(Number(totalPrice || 0) * 10);
      await user.save();
    }

    res.status(201).json(createdOrder);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

const getMyOrders = async (req, res) => {
  try {
    const orders = await Order.find({ user: req.user._id })
      .populate('items.menuItem')
      .sort({ createdAt: -1 });

    const updatedOrders = await Promise.all(orders.map(async (order) => {
      try {
        const ageInMinutes = (Date.now() - new Date(order.createdAt).getTime()) / 60000;
        let newStatus = null;

        if (order.status === 'Preparing' && ageInMinutes >= 8) {
          newStatus = 'Ready';
        } else if (order.status === 'Ready' && ageInMinutes >= 12) {
          newStatus = 'Out for Delivery';
        }

        if (newStatus && order.status !== newStatus) {
           const freshOrder = await Order.findById(order._id);
           freshOrder.status = newStatus;
           freshOrder.statusHistory.push({ status: newStatus });
           await freshOrder.save();
           return await Order.findById(order._id).populate('items.menuItem');
        }
      } catch (err) {
        console.error(`Auto-transition failed for order ${order._id}:`, err);
      }
      return order;
    }));

    res.json(updatedOrders);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

const getAllOrders = async (req, res) => {
  try {
    const orders = await Order.find({})
      .populate('user', 'id name')
      .populate('items.menuItem')
      .sort({ createdAt: -1 });

    const updatedOrders = await Promise.all(orders.map(async (order) => {
      try {
        const ageInMinutes = (Date.now() - new Date(order.createdAt).getTime()) / 60000;
        let newStatus = null;

        if (order.status === 'Preparing' && ageInMinutes >= 8) {
          newStatus = 'Ready';
        } else if (order.status === 'Ready' && ageInMinutes >= 12) {
          newStatus = 'Out for Delivery';
        }

        if (newStatus && order.status !== newStatus) {
           const freshOrder = await Order.findById(order._id);
           freshOrder.status = newStatus;
           freshOrder.statusHistory.push({ status: newStatus });
           await freshOrder.save();
           return await Order.findById(order._id).populate('user', 'id name').populate('items.menuItem');
        }
      } catch (err) {
        console.error(`Auto-transition failed for order ${order._id}:`, err);
      }
      return order;
    }));

    res.json(updatedOrders);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

const updateStatus = async (req, res) => {
  try {
    const order = await Order.findById(req.params.id);
    if (!order) {
      return res.status(404).json({ message: 'Order not found' });
    }

    // Permission Check
    const isAdmin = req.user.role === 'admin';
    const isOwner = order.user.toString() === req.user._id.toString();

    if (!isAdmin) {
      if (!isOwner) {
        return res.status(403).json({ message: 'Not authorized to update this order' });
      }
      if (req.body.status !== 'Delivered') {
        return res.status(403).json({ message: 'Users can only update status to Delivered' });
      }
    }

    if (req.body.status && req.body.status !== order.status) {
        order.status = req.body.status;
        order.statusHistory.push({ status: req.body.status });
    }
    
    const updatedOrder = await order.save();
    res.json(updatedOrder);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

const deleteOrder = async (req, res) => {
  try {
    const order = await Order.findById(req.params.id);
    if (!order) {
      return res.status(404).json({ message: 'Order not found' });
    }

    if (order.status !== 'Delivered') {
      return res.status(400).json({ message: 'Only delivered orders can be deleted' });
    }

    await Order.findByIdAndDelete(req.params.id);
    res.json({ message: 'Order removed' });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

module.exports = { createOrder, getMyOrders, getAllOrders, updateStatus, deleteOrder };

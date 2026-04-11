const Order = require('../models/Order');

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
      status: 'Preparing' // Force initial status to Preparing
    });
    const createdOrder = await order.save();
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
          // Move to Out for Delivery after 12 mins total (8m prep + 4m ready)
          newStatus = 'Out for Delivery';
        }

        if (newStatus) {
          const freshOrder = await Order.findByIdAndUpdate(order._id, { status: newStatus }, { new: true })
            .populate('items.menuItem');
          return freshOrder;
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

        if (newStatus) {
          const freshOrder = await Order.findByIdAndUpdate(order._id, { status: newStatus }, { new: true })
            .populate('user', 'id name')
            .populate('items.menuItem');
          return freshOrder;
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

    order.status = req.body.status || order.status;
    const updatedOrder = await order.save();
    res.json(updatedOrder);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

module.exports = { createOrder, getMyOrders, getAllOrders, updateStatus };

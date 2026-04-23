const MenuItem = require('../models/MenuItem');
const Order = require('../models/Order');

const getMenu = async (req, res) => {
  try {
    const menu = await MenuItem.find({ isAvailable: true });
    res.json(menu);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

const getMenuItemById = async (req, res) => {
  try {
    const item = await MenuItem.findById(req.params.id);
    if (!item) return res.status(404).json({ message: 'Item not found' });
    const related = await MenuItem.find({
      _id: { $ne: item._id },
      category: item.category,
      isAvailable: true,
    }).limit(6);
    res.json({ item, related });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

const getAllMenuAdmin = async (req, res) => {
  try {
    const menu = await MenuItem.find();
    res.json(menu);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

const addItem = async (req, res) => {
  try {
    const item = new MenuItem(req.body);
    const createdItem = await item.save();
    res.status(201).json(createdItem);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
};

const updateItem = async (req, res) => {
  try {
    const item = await MenuItem.findByIdAndUpdate(req.params.id, req.body, { new: true });
    if (item) res.json(item);
    else res.status(404).json({ message: 'Item not found' });
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
};

const deleteItem = async (req, res) => {
  try {
    const item = await MenuItem.findByIdAndDelete(req.params.id);
    if (item) res.json({ message: 'Item removed' });
    else res.status(404).json({ message: 'Item not found' });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

const getRecommendations = async (req, res) => {
  try {
    const userId = req.user._id;
    const pastOrders = await Order.find({ user: userId }).populate('items.menuItem');
    
    // Analyze favorite categories
    const categoryCounts = {};
    pastOrders.forEach(order => {
      order.items.forEach(item => {
        if (item.menuItem) {
          const cat = item.menuItem.category;
          categoryCounts[cat] = (categoryCounts[cat] || 0) + 1;
        }
      });
    });

    // Get top categories
    const topCategories = Object.keys(categoryCounts).sort((a, b) => categoryCounts[b] - categoryCounts[a]).slice(0, 2);

    let recommendations;
    if (topCategories.length > 0) {
      // Recommend from top categories + top popularity
      recommendations = await MenuItem.find({
        category: { $in: topCategories },
        isAvailable: true
      }).sort({ popularityScore: -1 }).limit(10);
    } else {
      // No history, recommend by popularity
      recommendations = await MenuItem.find({ isAvailable: true })
        .sort({ popularityScore: -1 })
        .limit(10);
    }

    res.json(recommendations);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

module.exports = { 
  getMenu, 
  getMenuItemById, 
  getAllMenuAdmin, 
  addItem, 
  updateItem, 
  deleteItem,
  getRecommendations 
};

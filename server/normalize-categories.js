const mongoose = require('mongoose');
const MenuItem = require('./models/MenuItem');
require('dotenv').config();

const mapping = {
  'chinese': 'Chinese',
  'authentic indian': 'North Indian',
  'Paneer': 'North Indian',
  'Oreo': 'Desserts',
  'Tea': 'Beverages',
  'Drinks': 'Beverages',
  'sweet': 'Desserts',
  'italian': 'Pasta',
  'namkeen and breakfast': 'Fast Food',
  'indian namkeen': 'Fast Food',
  'Breads': 'North Indian',
  'Breakfast': 'Fast Food',
  'Sides': 'Fast Food',
  'Cakes': 'Desserts'
};

const normalize = async () => {
  try {
    await mongoose.connect(process.env.MONGO_URI);
    console.log('Connected to MongoDB for normalization...');

    const items = await MenuItem.find();
    console.log(`Found ${items.length} items. Starting normalization...`);

    let updatedCount = 0;
    for (const item of items) {
      const targetCategory = mapping[item.category] || item.category;
      
      // Also ensure Title Case for everything else just in case
      const finalCategory = targetCategory.charAt(0).toUpperCase() + targetCategory.slice(1);

      if (item.category !== finalCategory) {
        item.category = finalCategory;
        await item.save();
        updatedCount++;
      }
    }

    console.log(`Successfully normalized ${updatedCount} items.`);
    process.exit(0);
  } catch (err) {
    console.error('Normalization failed:', err);
    process.exit(1);
  }
};

normalize();

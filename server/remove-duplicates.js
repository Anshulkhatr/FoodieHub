const mongoose = require('mongoose');
const dotenv = require('dotenv');
const MenuItem = require('./models/MenuItem');

dotenv.config();

const removeDuplicates = async () => {
  try {
    await mongoose.connect(process.env.MONGO_URI);
    console.log('✅ Connected to MongoDB');

    const allItems = await MenuItem.find({});
    console.log(`Found ${allItems.length} total items.`);

    const seenNames = new Set();
    const duplicateIds = [];

    for (const item of allItems) {
      if (seenNames.has(item.name.toLowerCase())) {
        duplicateIds.push(item._id);
      } else {
        seenNames.add(item.name.toLowerCase());
      }
    }

    if (duplicateIds.length > 0) {
      console.log(`Found ${duplicateIds.length} duplicate items. Removing...`);
      const result = await MenuItem.deleteMany({ _id: { $in: duplicateIds } });
      console.log(`✅ Successfully removed ${result.deletedCount} duplicate items!`);
    } else {
      console.log(`No duplicate items found.`);
    }

    mongoose.disconnect();
    console.log('✅ Disconnected from MongoDB');
  } catch (err) {
    console.error('❌ Deletion failed:', err.message);
    process.exit(1);
  }
};

removeDuplicates();

const mongoose = require('mongoose');

const mongoURI = 'mongodb://127.0.0.1:27017/restaurent';

const MenuItemSchema = new mongoose.Schema({
  name: String,
  price: Number,
  originalPrice: Number,
  category: String
});

const MenuItem = mongoose.model('MenuItem', MenuItemSchema);

async function seedDeals() {
  try {
    await mongoose.connect(mongoURI);
    console.log('Connected to MongoDB');

    const items = await MenuItem.find({});
    console.log(`Found ${items.length} items`);

    let updatedCount = 0;
    for (let i = 0; i < items.length; i++) {
       // Give 40% of items a deal if they don't have one
       if (!items[i].originalPrice || items[i].originalPrice <= items[i].price) {
          if (Math.random() > 0.6) {
             const discountPercent = 10 + Math.floor(Math.random() * 30);
             items[i].originalPrice = Math.round(items[i].price / (1 - discountPercent/100));
             await items[i].save();
             updatedCount++;
          }
       }
    }

    console.log(`Updated ${updatedCount} items with original prices.`);
    process.exit(0);
  } catch (err) {
    console.error(err);
    process.exit(1);
  }
}

seedDeals();

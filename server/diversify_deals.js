const mongoose = require('mongoose');

const mongoURI = 'mongodb+srv://admin:adminn@cluster0.dnellwt.mongodb.net/foodiehub-db?appName=Cluster0';

const MenuItemSchema = new mongoose.Schema({
  name: String,
  price: Number,
  originalPrice: Number,
  category: String
});

const MenuItem = mongoose.model('MenuItem', MenuItemSchema);

async function diversifyDeals() {
  try {
    await mongoose.connect(mongoURI);
    console.log('Connected to MongoDB');

    // Reset deals first to ensure clean state
    await MenuItem.updateMany({}, { $unset: { originalPrice: "" } });

    // Pick 12 diverse items to have deals
    const categories = [
       'North Indian', 'South Indian', 'Biryani', 'Pizzas', 
       'Chinese', 'Fast Food', 'Cakes', 'Desserts', 'Beverages'
    ];

    let itemsWithDeals = 0;
    for (const cat of categories) {
       const itemsInCat = await MenuItem.find({ category: cat }).limit(2);
       for (const item of itemsInCat) {
          const discountPercent = 15 + Math.floor(Math.random() * 25);
          item.originalPrice = Math.round(item.price / (1 - discountPercent/100));
          await item.save();
          itemsWithDeals++;
          console.log(`Added deal to: ${item.name} (${cat})`);
       }
    }

    console.log(`Successfully added diverse deals to ${itemsWithDeals} items.`);
    process.exit(0);
  } catch (err) {
    console.error(err);
    process.exit(1);
  }
}

diversifyDeals();

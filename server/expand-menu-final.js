const mongoose = require('mongoose');
const MenuItem = require('./models/MenuItem');
require('dotenv').config();

const newItems = [
  // ─── Burgers (7 more) ──────────────────────────────────────
  { name: "BBQ Bacon Burger", desc: "Smoky BBQ sauce, crispy bacon, cheddar, and caramelized onions.", price: 290, category: "Burgers", image: "https://images.unsplash.com/photo-1594212699903-ec8a3eca50f5?w=600&auto=format&fit=crop&q=80", isAvailable: true },
  { name: "Mushroom Swiss Burger", desc: "Topped with sautéed mushrooms and melted Swiss cheese on a brioche bun.", price: 270, category: "Burgers", image: "https://images.unsplash.com/photo-1550547660-d9450f859349?w=600&auto=format&fit=crop&q=80", isAvailable: true },
  { name: "Spicy Jalapeno Burger", desc: "Fiery jalapenos, pepper jack cheese, and chipotle mayo for a spicy kick.", price: 260, category: "Burgers", image: "https://images.unsplash.com/photo-1568901346375-23c9450c58cd?w=600&auto=format&fit=crop&q=80", isAvailable: true },
  { name: "Double Cheese Smash Burger", desc: "Two smashed beef patties, double American cheese, and pickles.", price: 320, category: "Burgers", image: "https://images.unsplash.com/photo-1571091718767-18b5b1457add?w=600&auto=format&fit=crop&q=80", isAvailable: true },
  { name: "Crispy Chicken Zinger", desc: "Golden fried chicken breast with lettuce and creamy mayo.", price: 230, category: "Burgers", image: "https://images.unsplash.com/photo-1513185158878-8d8ae148b767?w=600&auto=format&fit=crop&q=80", isAvailable: true },
  { name: "Falafel Burger", desc: "Mediterranean-style falafel patty with tahini sauce and pickled cucumbers.", price: 210, category: "Burgers", image: "https://images.unsplash.com/photo-1525059696034-4967a8e1dca2?w=600&auto=format&fit=crop&q=80", isAvailable: true },
  { name: "Truffle Beef Burger", desc: "Premium beef patty with truffle aioli, arugula, and fontina cheese.", price: 350, category: "Burgers", image: "https://images.unsplash.com/photo-1586190848861-99aa4a171e90?w=600&auto=format&fit=crop&q=80", isAvailable: true },

  // ─── Pasta (5 more) ────────────────────────────────────────
  { name: "Penne Arrabbiata", desc: "Spiced tomato sauce with garlic and dried red chili peppers.", price: 280, category: "Pasta", image: "https://images.unsplash.com/photo-1563379926898-05f4575a45d8?w=600&auto=format&fit=crop&q=80", isAvailable: true },
  { name: "Creamy Alfredo", desc: "Classic fettuccine tossed in a rich butter and parmesan cheese sauce.", price: 320, category: "Pasta", image: "https://images.unsplash.com/photo-1645112481355-06be092d6342?w=600&auto=format&fit=crop&q=80", isAvailable: true },
  { name: "Basil Pesto Pasta", desc: "Fusilli with fresh basil pesto, pine nuts, and parmesan shavings.", price: 310, category: "Pasta", image: "https://images.unsplash.com/photo-1473093226795-af9932fe5856?w=600&auto=format&fit=crop&q=80", isAvailable: true },
  { name: "Spaghetti Bolognese", desc: "Hearty meat sauce with tomatoes, herbs, and slow-cooked minced beef.", price: 380, category: "Pasta", image: "https://images.unsplash.com/photo-1551183053-bf91a1d81141?w=600&auto=format&fit=crop&q=80", isAvailable: true },
  { name: "Lasagna Bolognese", desc: "Layered pasta with rich meat sauce, bechamel, and melted mozzarella.", price: 420, category: "Pasta", image: "https://images.unsplash.com/photo-1619895092538-128341789043?w=600&auto=format&fit=crop&q=80", isAvailable: true },

  // ─── Starters (5 more) ──────────────────────────────────────
  { name: "Cheese Jalapeno Poppers", desc: "Crispy breaded jalapenos stuffed with gooey melted cheese.", price: 180, category: "Starters", image: "https://images.unsplash.com/photo-1534422298391-e4f8c170db76?w=600&auto=format&fit=crop&q=80", isAvailable: true },
  { name: "Garlic Bread with Cheese", desc: "Toasted baguette slices with garlic butter and a blanket of mozzarella.", price: 150, category: "Starters", image: "https://images.unsplash.com/photo-1573140247632-f8fd74997d5c?w=600&auto=format&fit=crop&q=80", isAvailable: true },
  { name: "Crispy Chicken Tenders", desc: "Hand-breaded white meat chicken strips with honey mustard dip.", price: 240, category: "Starters", image: "https://images.unsplash.com/photo-1562967916-eb82221dfb92?w=600&auto=format&fit=crop&q=80", isAvailable: true },
  { name: "Paneer Tikka", desc: "Cottage cheese cubes marinated in yogurt and spices, grilled in a tandoor.", price: 280, category: "Starters", image: "https://images.unsplash.com/photo-1599487488170-d11ec9c172f0?w=600&auto=format&fit=crop&q=80", isAvailable: true },
  { name: "Honey Chilli Potato", desc: "Crispy potato fingers tossed in a sweet and spicy honey chili sauce.", price: 210, category: "Starters", image: "https://images.unsplash.com/photo-1589647363585-f4a7d3877b10?w=600&auto=format&fit=crop&q=80", isAvailable: true }
];

const expand = async () => {
  try {
    await mongoose.connect(process.env.MONGO_URI);
    console.log('Connected to MongoDB for expansion...');

    const inserted = await MenuItem.insertMany(newItems);
    console.log(`Successfully added ${inserted.length} NEW menu items.`);

    process.exit(0);
  } catch (err) {
    console.error('Expansion failed:', err);
    process.exit(1);
  }
};

expand();

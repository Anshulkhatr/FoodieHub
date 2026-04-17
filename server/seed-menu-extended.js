const mongoose = require('mongoose');
const dotenv = require('dotenv');
const MenuItem = require('./models/MenuItem');

dotenv.config();

const menuItems = [
  // ─── North Indian ──────────────────────────────────────
  {
    name: "Chicken Tikka Masala",
    desc: "Chunks of tandoor-kissed chicken simmered in a luscious tomato-cream gravy enriched with Kashmiri spices and fenugreek.",
    price: 380, category: "North Indian",
    image: "https://images.unsplash.com/photo-1565557623262-b51c2513a641?w=600&auto=format&fit=crop&q=80", isAvailable: true
  },
  {
    name: "Shahi Paneer",
    desc: "Royal Mughal-style cottage cheese in a saffron-infused cashew-cream gravy with cardamom and rose water.",
    price: 290, category: "North Indian",
    image: "https://images.unsplash.com/photo-1631452180519-c014fe946bc7?w=600&auto=format&fit=crop&q=80", isAvailable: true
  },
  {
    name: "Kadhai Chicken",
    desc: "Bold, semi-dry chicken cooked with freshly-ground spices, capsicum, tomatoes, and onions in a wok (kadhai).",
    price: 340, category: "North Indian",
    image: "https://images.unsplash.com/photo-1603360946369-dc9bb6258143?w=600&auto=format&fit=crop&q=80", isAvailable: true
  },
  {
    name: "Sarson Da Saag",
    desc: "Slow-cooked mustard and spinach greens with makki ki roti, topped with a dollop of white butter. Pure Punjab comfort.",
    price: 260, category: "North Indian",
    image: "https://images.unsplash.com/photo-1546833998-877b37c2e5c6?w=600&auto=format&fit=crop&q=80", isAvailable: true
  },
  {
    name: "Aloo Paratha",
    desc: "Golden whole-wheat flatbread stuffed with spiced mashed potato, served with homemade white butter and pickle.",
    price: 120, category: "North Indian",
    image: "https://images.unsplash.com/photo-1601050690597-df0568f70950?w=600&auto=format&fit=crop&q=80", isAvailable: true
  },
  {
    name: "Mutton Korma",
    desc: "Slow-braised mutton in a velvety, aromatic gravy of whole spices, almonds, and caramelized onions.",
    price: 520, category: "North Indian",
    image: "https://images.unsplash.com/photo-1574484284002-952d92456975?w=600&auto=format&fit=crop&q=80", isAvailable: true
  },
  {
    name: "Rajma Chawal",
    desc: "Earthy kidney beans slow-cooked in a thick tangy masala, served with steamed Basmati rice. North India's soulmate.",
    price: 180, category: "North Indian",
    image: "https://images.unsplash.com/photo-1585172088140-b7a41c80bf2a?w=600&auto=format&fit=crop&q=80", isAvailable: true
  },
  {
    name: "Chole Bhature",
    desc: "Spiced chickpea masala paired with pillowy, deep-fried leavened bread. A classic Punjabi indulgence.",
    price: 160, category: "North Indian",
    image: "https://images.unsplash.com/photo-1626132647523-66a5f4f34df3?w=600&auto=format&fit=crop&q=80", isAvailable: true
  },

  // ─── South Indian ─────────────────────────────────────
  {
    name: "Masala Dosa",
    desc: "Paper-thin fermented rice crepe filled with a tangy potato-onion masala, served with sambar and three chutneys.",
    price: 140, category: "South Indian",
    image: "https://images.unsplash.com/photo-1630383249896-424e482df921?w=600&auto=format&fit=crop&q=80", isAvailable: true
  },
  {
    name: "Idli Sambhar",
    desc: "Fluffy steamed rice-lentil cakes paired with a hearty tamarind-lentil sambar and coconut chutney.",
    price: 100, category: "South Indian",
    image: "https://images.unsplash.com/photo-1589301760014-d929f3979dbc?w=600&auto=format&fit=crop&q=80", isAvailable: true
  },
  {
    name: "Kerala Fish Curry",
    desc: "Coastal Kerala-style fish cooked in a coconut milk and raw mango gravy with ground spices and curry leaves.",
    price: 420, category: "South Indian",
    image: "https://images.unsplash.com/photo-1512058564366-18510be2db19?w=600&auto=format&fit=crop&q=80", isAvailable: true
  },
  {
    name: "Chettinad Chicken",
    desc: "Fiery dry-roasted Chettinad masala with fresh kalpasi and marathi mokku spices — one of India's boldest curries.",
    price: 380, category: "South Indian",
    image: "https://images.unsplash.com/photo-1603360946369-dc9bb6258143?w=600&auto=format&fit=crop&q=80", isAvailable: true
  },
  {
    name: "Medu Vada",
    desc: "Crispy fried lentil donuts with a fluffy inside, served with fresh coconut chutney and hot sambar.",
    price: 90, category: "South Indian",
    image: "https://images.unsplash.com/photo-1567188040759-fb8a883dc6d8?w=600&auto=format&fit=crop&q=80", isAvailable: true
  },
  {
    name: "Appam with Stew",
    desc: "Lacy fermented rice hoppers paired with a delicate, mild vegetable or chicken coconut-milk stew.",
    price: 180, category: "South Indian",
    image: "https://images.unsplash.com/photo-1589301760014-d929f3979dbc?w=600&auto=format&fit=crop&q=80", isAvailable: true
  },
  {
    name: "Pesarattu",
    desc: "Thin green moong dal crepe topped with grated ginger and onion, served with allam (ginger) chutney.",
    price: 110, category: "South Indian",
    image: "https://images.unsplash.com/photo-1630383249896-424e482df921?w=600&auto=format&fit=crop&q=80", isAvailable: true
  },

  // ─── Biryani & Rice ───────────────────────────────────
  {
    name: "Hyderabadi Dum Biryani",
    desc: "Aromatic Basmati layered with marinated meat, saffron, caramelized onions, and sealed with dough and slow-cooked dum.",
    price: 460, category: "Biryani",
    image: "https://images.unsplash.com/photo-1563379091339-03b21ab4a4f8?w=600&auto=format&fit=crop&q=80", isAvailable: true
  },
  {
    name: "Mutton Biryani",
    desc: "Tender mutton on the bone slow-cooked with whole spices, saffron milk, fried onions, and mint in dum-style.",
    price: 520, category: "Biryani",
    image: "https://images.unsplash.com/photo-1589302168068-964664d93dc0?w=600&auto=format&fit=crop&q=80", isAvailable: true
  },
  {
    name: "Prawn Biryani",
    desc: "Jumbo prawns cooked with coastal spices, layered with fragrant Basmati, fried onions, and fresh mint.",
    price: 540, category: "Biryani",
    image: "https://images.unsplash.com/photo-1563379091339-03b21ab4a4f8?w=600&auto=format&fit=crop&q=80", isAvailable: true
  },
  {
    name: "Veg Dum Biryani",
    desc: "Mixed garden vegetables and paneer layered with aromatic Basmati, saffron, and caramelized onions, slow-cooked dum style.",
    price: 280, category: "Biryani",
    image: "https://images.unsplash.com/photo-1589302168068-964664d93dc0?w=600&auto=format&fit=crop&q=80", isAvailable: true
  },

  // ─── Pizzas ──────────────────────────────────────────
  {
    name: "Pepperoni Passion",
    desc: "Generously loaded with premium pepperoni slices on a rich tomato base with stretchy mozzarella and fresh basil.",
    price: 380, category: "Pizzas",
    image: "https://images.unsplash.com/photo-1628840042765-356cda07504e?w=600&auto=format&fit=crop&q=80", isAvailable: true
  },
  {
    name: "BBQ Chicken Pizza",
    desc: "Smoky BBQ sauce base with grilled chicken, caramelized onions, jalapeños, and a blend of mozzarella and cheddar.",
    price: 420, category: "Pizzas",
    image: "https://images.unsplash.com/photo-1565299624946-b28f40a0ae38?w=600&auto=format&fit=crop&q=80", isAvailable: true
  },
  {
    name: "Peri Peri Paneer Pizza",
    desc: "Peri-peri spiced cottage cheese, corn, and bell peppers on a herbed tomato base with mozzarella.",
    price: 350, category: "Pizzas",
    image: "https://images.unsplash.com/photo-1574071318508-1cdbab80d002?w=600&auto=format&fit=crop&q=80", isAvailable: true
  },
  {
    name: "Four Cheese Pizza",
    desc: "An indulgent white pizza with mozzarella, Gorgonzola, Parmesan, and Fontina, finished with a drizzle of truffle honey.",
    price: 480, category: "Pizzas",
    image: "https://images.unsplash.com/photo-1628840042765-356cda07504e?w=600&auto=format&fit=crop&q=80", isAvailable: true
  },
  {
    name: "Veggie Supreme Pizza",
    desc: "Colorful medley of olives, mushrooms, corn, capsicum, onions, and jalapenos on a classic marinara base.",
    price: 320, category: "Pizzas",
    image: "https://images.unsplash.com/photo-1565299624946-b28f40a0ae38?w=600&auto=format&fit=crop&q=80", isAvailable: true
  },

  // ─── Chinese ──────────────────────────────────────────
  {
    name: "Chicken Manchurian",
    desc: "Crispy fried chicken tossed in a bold, tangy, soy-ginger-garlic sauce with spring onions. Indo-Chinese at its finest.",
    price: 300, category: "Chinese",
    image: "https://images.unsplash.com/photo-1563379091339-03b21ab4a4f8?w=600&auto=format&fit=crop&q=80", isAvailable: true
  },
  {
    name: "Veg Hakka Noodles",
    desc: "Stir-fried thin noodles with julienned vegetables, soy sauce, and chilli oil — light, smoky and irresistible.",
    price: 220, category: "Chinese",
    image: "https://images.unsplash.com/photo-1541014741259-de529411b96a?w=600&auto=format&fit=crop&q=80", isAvailable: true
  },
  {
    name: "Chilli Paneer",
    desc: "Crispy cottage cheese tossed in a fiery Chinese-style sauce with green chillies, peppers, and spring onions.",
    price: 280, category: "Chinese",
    image: "https://images.unsplash.com/photo-1567188040759-fb8a883dc6d8?w=600&auto=format&fit=crop&q=80", isAvailable: true
  },
  {
    name: "Prawn Fried Rice",
    desc: "Wok-tossed jasmine rice with tiger prawns, egg, soy sauce, sesame oil, and fresh vegetables over high heat.",
    price: 340, category: "Chinese",
    image: "https://images.unsplash.com/photo-1512058564366-18510be2db19?w=600&auto=format&fit=crop&q=80", isAvailable: true
  },
  {
    name: "Dim Sum Basket",
    desc: "Steamed pork and prawn dumplings, veg crystal dumplings, and har gow — served with soy and chilli dipping sauces.",
    price: 360, category: "Chinese",
    image: "https://images.unsplash.com/photo-1563245372-f21724e3856d?w=600&auto=format&fit=crop&q=80", isAvailable: true
  },
  {
    name: "Kung Pao Chicken",
    desc: "Stir-fried diced chicken with dried red chillies, Sichuan peppercorns, peanuts, and a sweet-spicy dark sauce.",
    price: 320, category: "Chinese",
    image: "https://images.unsplash.com/photo-1606755962773-d324e0a13086?w=600&auto=format&fit=crop&q=80", isAvailable: true
  },

  // ─── Fast Food ─────────────────────────────────────────
  {
    name: "Loaded Nachos",
    desc: "Crispy corn tortilla chips piled with spiced beef, jalapeños, sour cream, pico de gallo, and melted cheese sauce.",
    price: 280, category: "Fast Food",
    image: "https://images.unsplash.com/photo-1548940740-204726a19be3?w=600&auto=format&fit=crop&q=80", isAvailable: true
  },
  {
    name: "Chicken Hot Dog",
    desc: "Grilled all-chicken sausage in a toasted brioche bun with yellow mustard, caramelised onions, and house relish.",
    price: 200, category: "Fast Food",
    image: "https://images.unsplash.com/photo-1619740455993-9d622a39ece1?w=600&auto=format&fit=crop&q=80", isAvailable: true
  },
  {
    name: "Pav Bhaji",
    desc: "Mumbai's iconic street food — buttery spiced vegetable mash served with toasted, butter-laden pav and sliced onions.",
    price: 150, category: "Fast Food",
    image: "https://images.unsplash.com/photo-1626132647523-66a5f4f34df3?w=600&auto=format&fit=crop&q=80", isAvailable: true
  },
  {
    name: "Club Sandwich",
    desc: "Triple-decker toasted bread with grilled chicken, streaky bacon, egg mayo, lettuce, tomato, and cheddar.",
    price: 260, category: "Fast Food",
    image: "https://images.unsplash.com/photo-1528735602780-2552fd46c7af?w=600&auto=format&fit=crop&q=80", isAvailable: true
  },
  {
    name: "Samosa Chaat",
    desc: "Crushed samosas topped with tangy chickpea curry, sweet yogurt, tamarind chutney, and three crunchy toppings.",
    price: 130, category: "Fast Food",
    image: "https://images.unsplash.com/photo-1567188040759-fb8a883dc6d8?w=600&auto=format&fit=crop&q=80", isAvailable: true
  },

  // ─── Cakes & Pastries ─────────────────────────────────
  {
    name: "Black Forest Cake",
    desc: "Layers of moist chocolate sponge, Chantilly cream, Kirsch-soaked cherries, and hand-shaved Belgian dark chocolate.",
    price: 380, category: "Cakes",
    image: "https://images.unsplash.com/photo-1578985545062-69928b1d9587?w=600&auto=format&fit=crop&q=80", isAvailable: true
  },
  {
    name: "Lotus Biscoff Cheesecake",
    desc: "No-bake creamy cheesecake on a Lotus Biscoff crust, swirled with caramelised speculoos spread and cookie crumble.",
    price: 340, category: "Cakes",
    image: "https://images.unsplash.com/photo-1565958011703-44f9829ba187?w=600&auto=format&fit=crop&q=80", isAvailable: true
  },
  {
    name: "Red Velvet Cake",
    desc: "Vibrant crimson layers of velvet sponge with a hint of cocoa, sandwiched and frosted with thick cream cheese icing.",
    price: 360, category: "Cakes",
    image: "https://images.unsplash.com/photo-1614707267537-b85aaf00c4b7?w=600&auto=format&fit=crop&q=80", isAvailable: true
  },
  {
    name: "Belgian Chocolate Truffle Cake",
    desc: "Decadent layers of 70% dark chocolate ganache sponge, sealed with a mirror-glaze truffle finish.",
    price: 420, category: "Cakes",
    image: "https://images.unsplash.com/photo-1578985545062-69928b1d9587?w=600&auto=format&fit=crop&q=80", isAvailable: true
  },
  {
    name: "Blueberry Muffin",
    desc: "Bakery-style oversized muffin studded with plump fresh blueberries and a crunchy pearl sugar streusel topping.",
    price: 120, category: "Cakes",
    image: "https://images.unsplash.com/photo-1607958996333-41aef7caefaa?w=600&auto=format&fit=crop&q=80", isAvailable: true
  },
  {
    name: "French Croissant",
    desc: "Buttery, flaky all-butter croissant laminated with 27 delicate layers — golden and honeyed on the outside, pillowy within.",
    price: 130, category: "Cakes",
    image: "https://images.unsplash.com/photo-1555507036-ab1f4038808a?w=600&auto=format&fit=crop&q=80", isAvailable: true
  },
  {
    name: "Pineapple Pastry",
    desc: "Fresh cream and pineapple layered between soft vanilla sponge, frosted with whipped cream and glazed pineapple.",
    price: 110, category: "Cakes",
    image: "https://images.unsplash.com/photo-1565958011703-44f9829ba187?w=600&auto=format&fit=crop&q=80", isAvailable: true
  },

  // ─── Desserts ─────────────────────────────────────────
  {
    name: "Rasmalai",
    desc: "Spongy chenna patties soaked in chilled, saffron-and-cardamom-scented reduced milk, garnished with pistachios.",
    price: 160, category: "Desserts",
    image: "https://images.unsplash.com/photo-1590080875515-8a3a8dc5735e?w=600&auto=format&fit=crop&q=80", isAvailable: true
  },
  {
    name: "Kheer",
    desc: "Creamy slow-cooked rice pudding with saffron, cardamom, almonds, and a rose water finish. Served warm or chilled.",
    price: 120, category: "Desserts",
    image: "https://images.unsplash.com/photo-1488477181946-6428a0291777?w=600&auto=format&fit=crop&q=80", isAvailable: true
  },
  {
    name: "Crème Brûlée",
    desc: "Classic French vanilla custard with a paper-thin caramelized sugar crust — crack through it to rich, silky bliss.",
    price: 260, category: "Desserts",
    image: "https://images.unsplash.com/photo-1470124182917-cc6e71b22ecc?w=600&auto=format&fit=crop&q=80", isAvailable: true
  },
  {
    name: "Churros with Chocolate",
    desc: "Freshly fried cinnamon-sugar dusted Spanish churros served with a pot of rich, warm Valrhona dark chocolate.",
    price: 200, category: "Desserts",
    image: "https://images.unsplash.com/photo-1624353365286-3f8d62daad51?w=600&auto=format&fit=crop&q=80", isAvailable: true
  },
  {
    name: "Kulfi Falooda",
    desc: "Saffron-pistachio kulfi on a bed of rose falooda, vermicelli, sabja seeds, and chilled rose milk.",
    price: 180, category: "Desserts",
    image: "https://images.unsplash.com/photo-1553361371-9b22f78e8b1d?w=600&auto=format&fit=crop&q=80", isAvailable: true
  },

  // ─── Beverages ────────────────────────────────────────
  {
    name: "Strawberry Milkshake",
    desc: "Thick, creamy milkshake blended with fresh strawberries and premium vanilla ice cream, topped with whipped cream.",
    price: 160, category: "Beverages",
    image: "https://images.unsplash.com/photo-1579954115545-a95591f28bfc?w=600&auto=format&fit=crop&q=80", isAvailable: true
  },
  {
    name: "Masala Chai",
    desc: "Aromatic Indian spiced tea brewed with ginger, cardamom, cinnamon, and cloves, simmered with full-cream milk.",
    price: 60, category: "Beverages",
    image: "https://images.unsplash.com/photo-1567449303183-ae0d6ed1498e?w=600&auto=format&fit=crop&q=80", isAvailable: true
  },
  {
    name: "Virgin Mojito",
    desc: "Muddled fresh mint, lime juice, and sugar topped with chilled sparkling water and a generous handful of crushed ice.",
    price: 120, category: "Beverages",
    image: "https://images.unsplash.com/photo-1513558161293-cdaf765ed2fd?w=600&auto=format&fit=crop&q=80", isAvailable: true
  },
  {
    name: "Blue Lagoon",
    desc: "Refreshing lemon and blue curacao-flavoured mocktail with a splash of sprite and swirls of fairy-blue.",
    price: 140, category: "Beverages",
    image: "https://images.unsplash.com/photo-1551024709-8f23befc6f87?w=600&auto=format&fit=crop&q=80", isAvailable: true
  },
  {
    name: "Fresh Orange Juice",
    desc: "Hand-squeezed Nagpur oranges, served chilled with no added sugar, preservatives, or compromise.",
    price: 100, category: "Beverages",
    image: "https://images.unsplash.com/photo-1600271886742-f049cd451bba?w=600&auto=format&fit=crop&q=80", isAvailable: true
  },
  {
    name: "Iced Matcha Latte",
    desc: "Japanese ceremonial-grade matcha whisked with oat milk and poured over ice. Earthy, creamy, energizing.",
    price: 200, category: "Beverages",
    image: "https://images.unsplash.com/photo-1536256263959-770b48d82b0a?w=600&auto=format&fit=crop&q=80", isAvailable: true
  },
  {
    name: "Chocolate Frappe",
    desc: "Blended Belgian chocolate, espresso, milk, and ice cream — topped with whipped cream and chocolate shavings.",
    price: 220, category: "Beverages",
    image: "https://images.unsplash.com/photo-1461023058943-07fcbe16d735?w=600&auto=format&fit=crop&q=80", isAvailable: true
  },
  {
    name: "Rose Sharbat",
    desc: "Chilled rose syrup sharbat with fresh basil seeds (sabja), blended with lemon and icy rose water.",
    price: 80, category: "Beverages",
    image: "https://images.unsplash.com/photo-1513558161293-cdaf765ed2fd?w=600&auto=format&fit=crop&q=80", isAvailable: true
  },
];

const seed = async () => {
  try {
    await mongoose.connect(process.env.MONGO_URI);
    console.log('✅ Connected to MongoDB');
    const inserted = await MenuItem.insertMany(menuItems);
    console.log(`✅ Successfully seeded ${inserted.length} menu items!`);
    mongoose.disconnect();
    console.log('✅ Disconnected from MongoDB');
  } catch (err) {
    console.error('❌ Seeding failed:', err.message);
    process.exit(1);
  }
};

seed();

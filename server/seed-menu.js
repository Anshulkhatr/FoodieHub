const mongoose = require('mongoose');
const dotenv = require('dotenv');
const MenuItem = require('./models/MenuItem');

dotenv.config();

const menuItems = [
  // ─── Starters & Appetizers ───────────────────────────────
  {
    name: "Truffle Arancini",
    desc: "Crispy Italian rice balls infused with black truffle and aged Parmesan, served with a roasted garlic aioli dipping sauce.",
    price: 320,
    category: "Starters",
    image: "https://images.unsplash.com/photo-1565299507177-b0ac66763828?w=600&auto=format&fit=crop&q=80",
    isAvailable: true
  },
  {
    name: "Chicken Seekh Kebab",
    desc: "Minced chicken blended with fresh herbs, green chillies, and aromatic spices, skewered and chargrilled to perfection.",
    price: 280,
    category: "Starters",
    image: "https://images.unsplash.com/photo-1599487488170-d11ec9c172f0?w=600&auto=format&fit=crop&q=80",
    isAvailable: true
  },
  {
    name: "Crispy Calamari",
    desc: "Golden-fried squid rings lightly coated in seasoned flour, served with a zesty marinara sauce and a wedge of lemon.",
    price: 350,
    category: "Starters",
    image: "https://images.unsplash.com/photo-1625944525533-473f1a3d54e7?w=600&auto=format&fit=crop&q=80",
    isAvailable: true
  },
  {
    name: "Paneer Tikka",
    desc: "Cubes of fresh cottage cheese marinated in spiced yogurt and char-grilled in a tandoor, served with mint chutney.",
    price: 250,
    category: "Starters",
    image: "https://images.unsplash.com/photo-1567188040759-fb8a883dc6d8?w=600&auto=format&fit=crop&q=80",
    isAvailable: true
  },
  {
    name: "Bruschetta al Pomodoro",
    desc: "Toasted sourdough topped with vine-ripe tomatoes, fresh basil, extra-virgin olive oil, and a hint of balsamic glaze.",
    price: 180,
    category: "Starters",
    image: "https://images.unsplash.com/photo-1572695157366-5e585ab2b69f?w=600&auto=format&fit=crop&q=80",
    isAvailable: true
  },

  // ─── Mains ───────────────────────────────────────────────
  {
    name: "Butter Chicken",
    desc: "Slow-cooked tender chicken in a silky, richly spiced tomato-cream sauce — the definitive comfort classic, reimagined.",
    price: 380,
    category: "Mains",
    image: "https://images.unsplash.com/photo-1603894584373-5ac82b2ae398?w=600&auto=format&fit=crop&q=80",
    isAvailable: true
  },
  {
    name: "Grilled Sea Bass",
    desc: "Whole sea bass marinated in Mediterranean herbs, grilled skin-crisp, served on a bed of saffron cauliflower purée.",
    price: 650,
    category: "Mains",
    image: "https://images.unsplash.com/photo-1519708227418-c8fd9a32b7a2?w=600&auto=format&fit=crop&q=80",
    isAvailable: true
  },
  {
    name: "Lamb Rogan Josh",
    desc: "Slow-braised Kashmiri lamb shanks in a bold, aromatic sauce of whole spices, Kashmiri chillies, and caramelized onions.",
    price: 520,
    category: "Mains",
    image: "https://images.unsplash.com/photo-1574484284002-952d92456975?w=600&auto=format&fit=crop&q=80",
    isAvailable: true
  },
  {
    name: "Truffle Mushroom Risotto",
    desc: "Carnaroli rice cooked low-and-slow with wild porcini mushrooms, finished with black truffle oil and shaved Grana Padano.",
    price: 480,
    category: "Mains",
    image: "https://images.unsplash.com/photo-1476124369491-e7addf5db371?w=600&auto=format&fit=crop&q=80",
    isAvailable: true
  },
  {
    name: "Palak Paneer",
    desc: "Velvety spinach purée simmered with whole spices, enriched with tangy yogurt, and studded with cubes of fresh cottage cheese.",
    price: 260,
    category: "Mains",
    image: "https://images.unsplash.com/photo-1585937421612-70a008356fbe?w=600&auto=format&fit=crop&q=80",
    isAvailable: true
  },
  {
    name: "BBQ Pulled Pork Sandwich",
    desc: "Slow-smoked pulled pork with house-made bourbon BBQ sauce on a toasted brioche bun, topped with crunchy slaw.",
    price: 340,
    category: "Mains",
    image: "https://images.unsplash.com/photo-1568901346375-23c9450c58cd?w=600&auto=format&fit=crop&q=80",
    isAvailable: true
  },
  {
    name: "Chicken Biryani",
    desc: "Fragrant long-grain Basmati rice layered with marinated chicken, saffron, fried onions, and slow-cooked dum-style.",
    price: 380,
    category: "Mains",
    image: "https://images.unsplash.com/photo-1563379091339-03b21ab4a4f8?w=600&auto=format&fit=crop&q=80",
    isAvailable: true
  },
  {
    name: "Prawn Masala",
    desc: "Jumbo tiger prawns cooked in a fiery, aromatic coastal masala of fresh coconut, tomatoes, tamarind, and curry leaves.",
    price: 580,
    category: "Mains",
    image: "https://images.unsplash.com/photo-1512058564366-18510be2db19?w=600&auto=format&fit=crop&q=80",
    isAvailable: true
  },
  {
    name: "Margherita Pizza",
    desc: "Neapolitan-style thin-crust pizza with San Marzano tomatoes, fresh buffalo mozzarella, and hand-torn basil leaves.",
    price: 320,
    category: "Mains",
    image: "https://images.unsplash.com/photo-1574071318508-1cdbab80d002?w=600&auto=format&fit=crop&q=80",
    isAvailable: true
  },
  {
    name: "Dal Makhani",
    desc: "Whole black lentils slow-cooked overnight on a wood fire with tomatoes, butter, and cream — a North Indian legend.",
    price: 240,
    category: "Mains",
    image: "https://images.unsplash.com/photo-1546833998-877b37c2e5c6?w=600&auto=format&fit=crop&q=80",
    isAvailable: true
  },

  // ─── Burgers & Wraps ─────────────────────────────────────
  {
    name: "The Classic Smash Burger",
    desc: "Dual smash patties of chuck-brisket blend, American cheese, pickles, diced onion, and special sauce in a potato bun.",
    price: 360,
    category: "Burgers",
    image: "https://images.unsplash.com/photo-1586190848861-99aa4a171e90?w=600&auto=format&fit=crop&q=80",
    isAvailable: true
  },
  {
    name: "Crispy Chicken Burger",
    desc: "Buttermilk-brined fried chicken thigh with honey-sriracha mayo, pickled jalapeños, and shredded lettuce in a toasted bun.",
    price: 320,
    category: "Burgers",
    image: "https://images.unsplash.com/photo-1606755962773-d324e0a13086?w=600&auto=format&fit=crop&q=80",
    isAvailable: true
  },
  {
    name: "Paneer Tikka Wrap",
    desc: "Grilled tandoori paneer with caramelized onions, roasted peppers, and chipotle mint chutney, snugly wrapped in a roomali roti.",
    price: 220,
    category: "Burgers",
    image: "https://images.unsplash.com/photo-1626700051175-6818013e1d4f?w=600&auto=format&fit=crop&q=80",
    isAvailable: true
  },

  // ─── Pasta & Noodles ─────────────────────────────────────
  {
    name: "Carbonara Classica",
    desc: "Al dente spaghetti tossed with a silky sauce of fresh eggs, Pecorino Romano, guanciale, and cracked black pepper.",
    price: 380,
    category: "Pasta",
    image: "https://images.unsplash.com/photo-1612874742237-6526221588e3?w=600&auto=format&fit=crop&q=80",
    isAvailable: true
  },
  {
    name: "Thai Pad See Ew",
    desc: "Wide flat rice noodles stir-fried in sweet soy sauce with Chinese broccoli, egg, and your choice of chicken or tofu.",
    price: 290,
    category: "Pasta",
    image: "https://images.unsplash.com/photo-1559314809-0d155014e29e?w=600&auto=format&fit=crop&q=80",
    isAvailable: true
  },
  {
    name: "Chicken Aglio e Olio",
    desc: "Spaghetti sautéed in golden garlic-infused olive oil with grilled chicken strips, chilli flakes, and parsley.",
    price: 310,
    category: "Pasta",
    image: "https://images.unsplash.com/photo-1621996346565-e3dbc646d9a9?w=600&auto=format&fit=crop&q=80",
    isAvailable: true
  },
  {
    name: "Ramen Tonkotsu",
    desc: "Rich pork bone broth simmered for 12 hours, served with handmade wavy noodles, chashu pork, soft boiled egg, and nori.",
    price: 420,
    category: "Pasta",
    image: "https://images.unsplash.com/photo-1569050467447-ce54b3bbc37d?w=600&auto=format&fit=crop&q=80",
    isAvailable: true
  },

  // ─── Breads & Sides ──────────────────────────────────────
  {
    name: "Garlic Naan",
    desc: "Fluffy, buttery leavened flatbread fresh from a tandoor, generously brushed with roasted garlic butter and fresh coriander.",
    price: 80,
    category: "Breads",
    image: "https://images.unsplash.com/photo-1599487488170-d11ec9c172f0?w=600&auto=format&fit=crop&q=80",
    isAvailable: true
  },
  {
    name: "Truffle Fries",
    desc: "Crispy shoestring fries tossed in white truffle oil and sea salt, topped with fresh Parmesan shavings and chives.",
    price: 200,
    category: "Sides",
    image: "https://images.unsplash.com/photo-1573080496219-bb080dd4f877?w=600&auto=format&fit=crop&q=80",
    isAvailable: true
  },
  {
    name: "Miso Soup",
    desc: "Traditional Japanese dashi broth with white miso paste, silken tofu, wakame seaweed, and sliced spring onions.",
    price: 120,
    category: "Sides",
    image: "https://images.unsplash.com/photo-1540648639573-8c848de23f0a?w=600&auto=format&fit=crop&q=80",
    isAvailable: true
  },
  {
    name: "Caesar Salad",
    desc: "Crisp romaine lettuce with house-made Caesar dressing, shaved Parmesan, house-baked croutons, and a soft-poached egg.",
    price: 240,
    category: "Sides",
    image: "https://images.unsplash.com/photo-1546793665-c74683f339c1?w=600&auto=format&fit=crop&q=80",
    isAvailable: true
  },

  // ─── Desserts ────────────────────────────────────────────
  {
    name: "Gulab Jamun",
    desc: "Soft milk-solid dumplings soaked in rose-scented saffron sugar syrup, served warm with a scoop of vanilla kulfi.",
    price: 160,
    category: "Desserts",
    image: "https://images.unsplash.com/photo-1590080875515-8a3a8dc5735e?w=600&auto=format&fit=crop&q=80",
    isAvailable: true
  },
  {
    name: "Tiramisu",
    desc: "Layers of espresso-soaked Savoiardi ladyfingers and mascarpone cream, dusted with premium Dutch-process cocoa.",
    price: 280,
    category: "Desserts",
    image: "https://images.unsplash.com/photo-1571877227200-a0d98ea607e9?w=600&auto=format&fit=crop&q=80",
    isAvailable: true
  },
  {
    name: "Molten Lava Cake",
    desc: "A warm Valrhona dark chocolate cake with a gooey liquid centre, served with salted caramel ice cream and berry coulis.",
    price: 320,
    category: "Desserts",
    image: "https://images.unsplash.com/photo-1624353365286-3f8d62daad51?w=600&auto=format&fit=crop&q=80",
    isAvailable: true
  },
  {
    name: "Mango Panna Cotta",
    desc: "Silky Italian cream dessert infused with vanilla bean, topped with a vibrant Alphonso mango coulis and fresh mint.",
    price: 220,
    category: "Desserts",
    image: "https://images.unsplash.com/photo-1488477181946-6428a0291777?w=600&auto=format&fit=crop&q=80",
    isAvailable: true
  },

  // ─── Drinks ──────────────────────────────────────────────
  {
    name: "Fresh Lime Soda",
    desc: "Hand-squeezed lime juice with chilled sparkling soda, a pinch of black salt, and a sprig of fresh mint. Sweet or salted.",
    price: 90,
    category: "Drinks",
    image: "https://images.unsplash.com/photo-1513558161293-cdaf765ed2fd?w=600&auto=format&fit=crop&q=80",
    isAvailable: true
  },
  {
    name: "Mango Lassi",
    desc: "Blended ripe Alphonso mangoes with thick hung curd, a touch of cardamom, and a drizzle of honey. Cool and refreshing.",
    price: 140,
    category: "Drinks",
    image: "https://images.unsplash.com/photo-1553361371-9b22f78e8b1d?w=600&auto=format&fit=crop&q=80",
    isAvailable: true
  },
  {
    name: "Cold Brew Coffee",
    desc: "Single-origin Ethiopian beans steeped cold for 20 hours, served over ice with a choice of oat milk or classic cream.",
    price: 180,
    category: "Drinks",
    image: "https://images.unsplash.com/photo-1461023058943-07fcbe16d735?w=600&auto=format&fit=crop&q=80",
    isAvailable: true
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

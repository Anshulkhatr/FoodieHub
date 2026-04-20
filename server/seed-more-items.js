const mongoose = require('mongoose');
const dotenv = require('dotenv');
const MenuItem = require('./models/MenuItem');

dotenv.config();

const additionalMenuItems = [
  // ─── North Indian (10 items) ────────────────────────────────
  { name: "Butter Chicken", desc: "Classic tandoori chicken simmered in a smooth, buttery tomato sauce.", price: 400, category: "North Indian", image: "https://images.unsplash.com/photo-1603360946369-dc9bb6258143?w=600&auto=format&fit=crop&q=80", isAvailable: true },
  { name: "Palak Paneer", desc: "Fresh cottage cheese cubes in a thick paste of pureed spinach, seasoned with garlic and garam masala.", price: 310, category: "North Indian", image: "https://images.unsplash.com/photo-1601050690597-df0568f70950?w=600&auto=format&fit=crop&q=80", isAvailable: true },
  { name: "Dal Makhani", desc: "Whole black lentils and red kidney beans slow-cooked with butter and cream.", price: 250, category: "North Indian", image: "https://images.unsplash.com/photo-1546833998-877b37c2e5c6?w=600&auto=format&fit=crop&q=80", isAvailable: true },
  { name: "Paneer Butter Masala", desc: "Cottage cheese cooked in a rich and creamy tomato and cashew nut gravy.", price: 330, category: "North Indian", image: "https://images.unsplash.com/photo-1631452180519-c014fe946bc7?w=600&auto=format&fit=crop&q=80", isAvailable: true },
  { name: "Bhindi Masala", desc: "Stir-fried okra sautéed with onions, tomatoes, and tangy spices.", price: 220, category: "North Indian", image: "https://images.unsplash.com/photo-1585172088140-b7a41c80bf2a?w=600&auto=format&fit=crop&q=80", isAvailable: true },
  { name: "Rogan Josh", desc: "Aromatic lamb dish of Persian origin, heavily spiced with Kashmiri chilies.", price: 480, category: "North Indian", image: "https://images.unsplash.com/photo-1574484284002-952d92456975?w=600&auto=format&fit=crop&q=80", isAvailable: true },
  { name: "Navratan Korma", desc: "A rich, creamy mixed vegetable curry featuring nine distinct ingredients.", price: 300, category: "North Indian", image: "https://images.unsplash.com/photo-1626132647523-66a5f4f34df3?w=600&auto=format&fit=crop&q=80", isAvailable: true },
  { name: "Baingan Bharta", desc: "Smoky roasted eggplant mashed and cooked with Indian spices.", price: 240, category: "North Indian", image: "https://images.unsplash.com/photo-1565557623262-b51c2513a641?w=600&auto=format&fit=crop&q=80", isAvailable: true },
  { name: "Kadhi Pakora", desc: "Deep-fried gram flour fritters steeped in a tangy yogurt gravy.", price: 210, category: "North Indian", image: "https://images.unsplash.com/photo-1546833998-877b37c2e5c6?w=600&auto=format&fit=crop&q=80", isAvailable: true },
  { name: "Malai Kofta", desc: "Fried balls of potato and paneer in a rich, mild, and creamy gravy.", price: 340, category: "North Indian", image: "https://images.unsplash.com/photo-1631452180519-c014fe946bc7?w=600&auto=format&fit=crop&q=80", isAvailable: true },

  // ─── South Indian (10 items) ────────────────────────────────
  { name: "Rava Dosa", desc: "Crispy, porous crepe made from semolina, cumin, and green chilies.", price: 130, category: "South Indian", image: "https://images.unsplash.com/photo-1630383249896-424e482df921?w=600&auto=format&fit=crop&q=80", isAvailable: true },
  { name: "Uttapam", desc: "Thick pancake made from fermented rice and lentil batter, topped with tomatoes and onions.", price: 150, category: "South Indian", image: "https://images.unsplash.com/photo-1589301760014-d929f3979dbc?w=600&auto=format&fit=crop&q=80", isAvailable: true },
  { name: "Lemon Rice", desc: "Tangy and flavorful rice tempered with mustard seeds, curry leaves, and peanuts.", price: 120, category: "South Indian", image: "https://images.unsplash.com/photo-1630383249896-424e482df921?w=600&auto=format&fit=crop&q=80", isAvailable: true },
  { name: "Tamarind Rice", desc: "Authentic puliyogare with a deep tangy and spicy tamarind flavor.", price: 130, category: "South Indian", image: "https://images.unsplash.com/photo-1567188040759-fb8a883dc6d8?w=600&auto=format&fit=crop&q=80", isAvailable: true },
  { name: "Chicken 65", desc: "Spicy, deep-fried chicken bites flavored with curry leaves and red chilies.", price: 290, category: "South Indian", image: "https://images.unsplash.com/photo-1603360946369-dc9bb6258143?w=600&auto=format&fit=crop&q=80", isAvailable: true },
  { name: "Bisibelebath", desc: "A spicy, holistic Karnataka dish consisting of rice, lentils, and vegetables.", price: 180, category: "South Indian", image: "https://images.unsplash.com/photo-1589301760014-d929f3979dbc?w=600&auto=format&fit=crop&q=80", isAvailable: true },
  { name: "Malabar Parotta", desc: "Layered, flaky flatbread typical to Kerala and Tamil Nadu, perfect for curries.", price: 60, category: "South Indian", image: "https://images.unsplash.com/photo-1630383249896-424e482df921?w=600&auto=format&fit=crop&q=80", isAvailable: true },
  { name: "Avial", desc: "A thick mixture of vegetables and coconut, seasoned with coconut oil and curry leaves.", price: 210, category: "South Indian", image: "https://images.unsplash.com/photo-1512058564366-18510be2db19?w=600&auto=format&fit=crop&q=80", isAvailable: true },
  { name: "Mysore Masala Dosa", desc: "Crispy dosa slathered with spicy red chutney and stuffed with potato masala.", price: 160, category: "South Indian", image: "https://images.unsplash.com/photo-1630383249896-424e482df921?w=600&auto=format&fit=crop&q=80", isAvailable: true },
  { name: "Paniyaram", desc: "Savory bite-sized rice balls cooked in a special pan, served with coconut chutney.", price: 110, category: "South Indian", image: "https://images.unsplash.com/photo-1567188040759-fb8a883dc6d8?w=600&auto=format&fit=crop&q=80", isAvailable: true },

  // ─── Biryani (10 items) ─────────────────────────────────────
  { name: "Lucknowi Biryani", desc: "Subtly spiced, fragrant biryani where meat and rice are cooked together in a sealed pot.", price: 470, category: "Biryani", image: "https://images.unsplash.com/photo-1563379091339-03b21ab4a4f8?w=600&auto=format&fit=crop&q=80", isAvailable: true },
  { name: "Kolkata Biryani", desc: "Famous for its subtle flavor and the inclusion of large, spiced potatoes.", price: 430, category: "Biryani", image: "https://images.unsplash.com/photo-1589302168068-964664d93dc0?w=600&auto=format&fit=crop&q=80", isAvailable: true },
  { name: "Ambur Biryani", desc: "A distinct South Indian biryani made with seeraga samba rice and a robust chili paste.", price: 410, category: "Biryani", image: "https://images.unsplash.com/photo-1563379091339-03b21ab4a4f8?w=600&auto=format&fit=crop&q=80", isAvailable: true },
  { name: "Sindhi Biryani", desc: "Highly aromatic biryani characterized by the generous use of roasted spices and dried plums.", price: 490, category: "Biryani", image: "https://images.unsplash.com/photo-1589302168068-964664d93dc0?w=600&auto=format&fit=crop&q=80", isAvailable: true },
  { name: "Chicken Tikka Biryani", desc: "Smoky, tandoor-roasted chicken tikka layered with spiced basmati rice.", price: 450, category: "Biryani", image: "https://images.unsplash.com/photo-1563379091339-03b21ab4a4f8?w=600&auto=format&fit=crop&q=80", isAvailable: true },
  { name: "Fish Biryani", desc: "Tender fish fillets cooked with coastal spices and layered with fragrant rice.", price: 520, category: "Biryani", image: "https://images.unsplash.com/photo-1589302168068-964664d93dc0?w=600&auto=format&fit=crop&q=80", isAvailable: true },
  { name: "Egg Biryani", desc: "Boiled and pan-fried eggs nested in a bed of flavorful masala and layered rice.", price: 320, category: "Biryani", image: "https://images.unsplash.com/photo-1563379091339-03b21ab4a4f8?w=600&auto=format&fit=crop&q=80", isAvailable: true },
  { name: "Paneer Tikka Biryani", desc: "Cubes of marinated, grilled paneer mixed with fragrant biryani rice.", price: 350, category: "Biryani", image: "https://images.unsplash.com/photo-1589302168068-964664d93dc0?w=600&auto=format&fit=crop&q=80", isAvailable: true },
  { name: "Mushroom Biryani", desc: "Earthy mushrooms slow-cooked perfectly with robust spices and basmati rice.", price: 310, category: "Biryani", image: "https://images.unsplash.com/photo-1563379091339-03b21ab4a4f8?w=600&auto=format&fit=crop&q=80", isAvailable: true },
  { name: "Keema Biryani", desc: "Minced mutton cooked with strong aromatics, elegantly layered with saffron rice.", price: 540, category: "Biryani", image: "https://images.unsplash.com/photo-1589302168068-964664d93dc0?w=600&auto=format&fit=crop&q=80", isAvailable: true },

  // ─── Pizzas (10 items) ──────────────────────────────────────
  { name: "Margherita Pizza", desc: "The timeless classic featuring a simple tomato sauce base, fresh mozzarella, and aromatic basil leaves.", price: 250, category: "Pizzas", image: "https://images.unsplash.com/photo-1628840042765-356cda07504e?w=600&auto=format&fit=crop&q=80", isAvailable: true },
  { name: "Hawaiian Pizza", desc: "Sweet and savory combination of juicy pineapple chunks, savory ham, and melty mozzarella on a classic crust.", price: 350, category: "Pizzas", image: "https://images.unsplash.com/photo-1565299624946-b28f40a0ae38?w=600&auto=format&fit=crop&q=80", isAvailable: true },
  { name: "Meat Lovers Pizza", desc: "Packed with pepperoni, Italian sausage, bacon, and ground beef for the ultimate carnivore delight.", price: 480, category: "Pizzas", image: "https://images.unsplash.com/photo-1574071318508-1cdbab80d002?w=600&auto=format&fit=crop&q=80", isAvailable: true },
  { name: "Veggie Delight Pizza", desc: "A colorful garden mix of bell peppers, onions, tomatoes, black olives, and mushrooms.", price: 300, category: "Pizzas", image: "https://images.unsplash.com/photo-1565299624946-b28f40a0ae38?w=600&auto=format&fit=crop&q=80", isAvailable: true },
  { name: "Mushroom Truffle Pizza", desc: "Earthy mushrooms with roasted garlic, fresh thyme, and a decadent drizzle of truffle oil.", price: 450, category: "Pizzas", image: "https://images.unsplash.com/photo-1628840042765-356cda07504e?w=600&auto=format&fit=crop&q=80", isAvailable: true },
  { name: "Buffalo Chicken Pizza", desc: "Spicy buffalo sauce, tender grilled chicken, red onions, mozzarella, and a cooling blue cheese drizzle.", price: 400, category: "Pizzas", image: "https://images.unsplash.com/photo-1574071318508-1cdbab80d002?w=600&auto=format&fit=crop&q=80", isAvailable: true },
  { name: "Pesto Chicken Pizza", desc: "Vibrant basil pesto base topped with grilled chicken, sun-dried tomatoes, and mozzarella cheese.", price: 420, category: "Pizzas", image: "https://images.unsplash.com/photo-1565299624946-b28f40a0ae38?w=600&auto=format&fit=crop&q=80", isAvailable: true },
  { name: "Spinach and Feta Pizza", desc: "A Mediterranean-inspired pie with creamy feta, fresh baby spinach, red onions, and Kalamata olives.", price: 380, category: "Pizzas", image: "https://images.unsplash.com/photo-1628840042765-356cda07504e?w=600&auto=format&fit=crop&q=80", isAvailable: true },
  { name: "Mexican Green Wave Pizza", desc: "Spicy Mexican flavors with jalapenos, corn, onions, tomatoes, and a kick of fiery seasoning.", price: 370, category: "Pizzas", image: "https://images.unsplash.com/photo-1574071318508-1cdbab80d002?w=600&auto=format&fit=crop&q=80", isAvailable: true },
  { name: "Tandoori Paneer Pizza", desc: "Indian fusion flatbread with marinated tandoori paneer, red onions, bell peppers, and fresh cilantro.", price: 390, category: "Pizzas", image: "https://images.unsplash.com/photo-1565299624946-b28f40a0ae38?w=600&auto=format&fit=crop&q=80", isAvailable: true },

  // ─── Chinese (10 items) ─────────────────────────────────────
  { name: "Veg Spring Rolls", desc: "Crispy fried rolls filled with a savory mix of shredded cabbage, carrots, and glass noodles.", price: 180, category: "Chinese", image: "https://images.unsplash.com/photo-1541014741259-de529411b96a?w=600&auto=format&fit=crop&q=80", isAvailable: true },
  { name: "Gobi Manchurian", desc: "Crispy cauliflower florets tossed in a sweet, sour, and mildly spicy Manchurian sauce.", price: 240, category: "Chinese", image: "https://images.unsplash.com/photo-1567188040759-fb8a883dc6d8?w=600&auto=format&fit=crop&q=80", isAvailable: true },
  { name: "Sweet and Sour Chicken", desc: "Battered chicken chunks stir-fried with bell peppers and pineapple in a classic tangry sauce.", price: 320, category: "Chinese", image: "https://images.unsplash.com/photo-1563379091339-03b21ab4a4f8?w=600&auto=format&fit=crop&q=80", isAvailable: true },
  { name: "Veg Fried Rice", desc: "Wok-tossed long grain rice packed with finely diced green beans, carrots, and spring onions.", price: 200, category: "Chinese", image: "https://images.unsplash.com/photo-1512058564366-18510be2db19?w=600&auto=format&fit=crop&q=80", isAvailable: true },
  { name: "Chilli Chicken Dry", desc: "A popular Indo-Chinese starter with bite-sized chicken chunks tossed in fiery red chili sauce.", price: 280, category: "Chinese", image: "https://images.unsplash.com/photo-1567188040759-fb8a883dc6d8?w=600&auto=format&fit=crop&q=80", isAvailable: true },
  { name: "Chicken Noodle Soup", desc: "A comforting bowl of clear chicken broth, noodles, and subtle hints of ginger and soy.", price: 180, category: "Chinese", image: "https://images.unsplash.com/photo-1606755962773-d324e0a13086?w=600&auto=format&fit=crop&q=80", isAvailable: true },
  { name: "Szechuan Fried Rice", desc: "Spike up your meal with this spicy, smoky fried rice made with fiery Szechuan sauce.", price: 230, category: "Chinese", image: "https://images.unsplash.com/photo-1512058564366-18510be2db19?w=600&auto=format&fit=crop&q=80", isAvailable: true },
  { name: "Garlic Prawns", desc: "Stir-fried tiger prawns completely bathed in a rich, buttery, roasted garlic sauce.", price: 420, category: "Chinese", image: "https://images.unsplash.com/photo-1563379091339-03b21ab4a4f8?w=600&auto=format&fit=crop&q=80", isAvailable: true },
  { name: "Paneer Fried Rice", desc: "Fluffy rice wok-tossed with soft paneer cubes, vegetables, and a hint of soy sauce.", price: 250, category: "Chinese", image: "https://images.unsplash.com/photo-1512058564366-18510be2db19?w=600&auto=format&fit=crop&q=80", isAvailable: true },
  { name: "Vegetable Chop Suey", desc: "Crispy fried noodles submerged in a thick, sweet and savory vegetable sauce.", price: 260, category: "Chinese", image: "https://images.unsplash.com/photo-1541014741259-de529411b96a?w=600&auto=format&fit=crop&q=80", isAvailable: true },

  // ─── Fast Food (10 items) ───────────────────────────────────
  { name: "Classic Cheeseburger", desc: "A juicy beef patty topped with melted American cheese, lettuce, tomato, and house burger sauce.", price: 250, category: "Fast Food", image: "https://images.unsplash.com/photo-1568901346375-23c9450c58cd?w=600&auto=format&fit=crop&q=80", isAvailable: true },
  { name: "Veggie Burger", desc: "A hearty spiced potato and peas patty inside a toasted bun with mayo and fresh veggies.", price: 180, category: "Fast Food", image: "https://images.unsplash.com/photo-1550547660-d9450f859349?w=600&auto=format&fit=crop&q=80", isAvailable: true },
  { name: "French Fries", desc: "Perfectly golden and crispy crinkle-cut fries generously dusted with salt.", price: 100, category: "Fast Food", image: "https://images.unsplash.com/photo-1576107232684-1279f390859f?w=600&auto=format&fit=crop&q=80", isAvailable: true },
  { name: "Onion Rings", desc: "Thick-cut, batter-fried onion rings served piping hot with a tangy dipping sauce.", price: 140, category: "Fast Food", image: "https://images.unsplash.com/photo-1628840042765-356cda07504e?w=600&auto=format&fit=crop&q=80", isAvailable: true },
  { name: "Chicken Wings", desc: "Six pieces of juicy chicken wings tossed in fiery Buffalo or sweet BBQ sauce.", price: 280, category: "Fast Food", image: "https://images.unsplash.com/photo-1603360946369-dc9bb6258143?w=600&auto=format&fit=crop&q=80", isAvailable: true },
  { name: "Loaded Fries", desc: "Our signature french fries completely smothered in liquid cheese sauce and jalapeños.", price: 190, category: "Fast Food", image: "https://images.unsplash.com/photo-1576107232684-1279f390859f?w=600&auto=format&fit=crop&q=80", isAvailable: true },
  { name: "Veg Wrap", desc: "A soft tortilla wrapped around a mixture of seasoned veggies, cheese, and spicy mayo.", price: 160, category: "Fast Food", image: "https://images.unsplash.com/photo-1626132647523-66a5f4f34df3?w=600&auto=format&fit=crop&q=80", isAvailable: true },
  { name: "Grilled Chicken Sandwich", desc: "A beautifully grilled chicken breast with greens, tomato slices, and honey mustard.", price: 210, category: "Fast Food", image: "https://images.unsplash.com/photo-1528735602780-2552fd46c7af?w=600&auto=format&fit=crop&q=80", isAvailable: true },
  { name: "Tacos", desc: "Two hard-shell or soft-shell tacos loaded with seasoned meat, lettuce, cheese, and salsa.", price: 240, category: "Fast Food", image: "https://images.unsplash.com/photo-1548940740-204726a19be3?w=600&auto=format&fit=crop&q=80", isAvailable: true },
  { name: "Quesadilla", desc: "A giant flour tortilla filled with melted mixed cheeses and optional grilled chicken, served with sour cream.", price: 260, category: "Fast Food", image: "https://images.unsplash.com/photo-1619740455993-9d622a39ece1?w=600&auto=format&fit=crop&q=80", isAvailable: true },

  // ─── Cakes (10 items) ───────────────────────────────────────
  { name: "Vanilla Sponge Cake", desc: "A light, fluffy vanilla cake that perfectly balances sweetness and airy texture.", price: 250, category: "Cakes", image: "https://images.unsplash.com/photo-1578985545062-69928b1d9587?w=600&auto=format&fit=crop&q=80", isAvailable: true },
  { name: "Chocolate Fudge Cake", desc: "Densly packed, incredibly rich dark chocolate layers engulfed in shiny fudge frosting.", price: 380, category: "Cakes", image: "https://images.unsplash.com/photo-1614707267537-b85aaf00c4b7?w=600&auto=format&fit=crop&q=80", isAvailable: true },
  { name: "Carrot Cake", desc: "Moist sponge imbued with freshly grated carrots, cinnamon, and a rich cream cheese frosting.", price: 340, category: "Cakes", image: "https://images.unsplash.com/photo-1565958011703-44f9829ba187?w=600&auto=format&fit=crop&q=80", isAvailable: true },
  { name: "Lemon Drizzle Cake", desc: "A zesty and bright lemon sponge heavily soaked in a tart and sweet lemon syrup.", price: 300, category: "Cakes", image: "https://images.unsplash.com/photo-1578985545062-69928b1d9587?w=600&auto=format&fit=crop&q=80", isAvailable: true },
  { name: "Coffee Walnut Cake", desc: "Rich espresso-steeped layers intertwined with crunchy toasted walnuts.", price: 360, category: "Cakes", image: "https://images.unsplash.com/photo-1614707267537-b85aaf00c4b7?w=600&auto=format&fit=crop&q=80", isAvailable: true },
  { name: "Tiramisu Cake", desc: "A brilliant cake homage to the classic Italian dessert with mascarpone and coffee.", price: 420, category: "Cakes", image: "https://images.unsplash.com/photo-1565958011703-44f9829ba187?w=600&auto=format&fit=crop&q=80", isAvailable: true },
  { name: "Strawberry Shortcake", desc: "Delicate vanilla layers sandwiched between heaps of whipped cream and fresh strawberries.", price: 350, category: "Cakes", image: "https://images.unsplash.com/photo-1578985545062-69928b1d9587?w=600&auto=format&fit=crop&q=80", isAvailable: true },
  { name: "Marble Cake", desc: "A beautiful swirl of vanilla and chocolate batters baked into a single glorious pound cake.", price: 280, category: "Cakes", image: "https://images.unsplash.com/photo-1614707267537-b85aaf00c4b7?w=600&auto=format&fit=crop&q=80", isAvailable: true },
  { name: "Black Forest Pastry", desc: "A single delightfully sized slice featuring kirsch-soaked sponge, cherries, and whipped cream.", price: 150, category: "Cakes", image: "https://images.unsplash.com/photo-1565958011703-44f9829ba187?w=600&auto=format&fit=crop&q=80", isAvailable: true },
  { name: "Chocolate Truffle Pastry", desc: "Individual portion of our dense chocolate truffle cake, perfect with a cup of coffee.", price: 160, category: "Cakes", image: "https://images.unsplash.com/photo-1578985545062-69928b1d9587?w=600&auto=format&fit=crop&q=80", isAvailable: true },

  // ─── Desserts (10 items) ────────────────────────────────────
  { name: "Gulab Jamun", desc: "Deep-fried milk-solid variations drenched in a sweet, sticky cardamon-rose syrup.", price: 120, category: "Desserts", image: "https://images.unsplash.com/photo-1590080875515-8a3a8dc5735e?w=600&auto=format&fit=crop&q=80", isAvailable: true },
  { name: "Gajar Ka Halwa", desc: "A beloved Indian winter dessert made by slow cooking grated carrots with milk and dry fruits.", price: 150, category: "Desserts", image: "https://images.unsplash.com/photo-1488477181946-6428a0291777?w=600&auto=format&fit=crop&q=80", isAvailable: true },
  { name: "Brownie with Ice Cream", desc: "A warm, intensely fudgy chocolate brownie topped with melting vanilla bean ice cream.", price: 210, category: "Desserts", image: "https://images.unsplash.com/photo-1470124182917-cc6e71b22ecc?w=600&auto=format&fit=crop&q=80", isAvailable: true },
  { name: "Tiramisu", desc: "Layers of coffee-soaked ladyfingers enveloped in rich mascarpone and dusted with cocoa.", price: 280, category: "Desserts", image: "https://images.unsplash.com/photo-1553361371-9b22f78e8b1d?w=600&auto=format&fit=crop&q=80", isAvailable: true },
  { name: "Panna Cotta", desc: "A silky, smooth set cream dessert, perfectly balanced with a tart mixed berry compote.", price: 260, category: "Desserts", image: "https://images.unsplash.com/photo-1470124182917-cc6e71b22ecc?w=600&auto=format&fit=crop&q=80", isAvailable: true },
  { name: "Cheesecake", desc: "A simple yet perfect slice of classic New York-style baked cheesecake.", price: 240, category: "Desserts", image: "https://images.unsplash.com/photo-1553361371-9b22f78e8b1d?w=600&auto=format&fit=crop&q=80", isAvailable: true },
  { name: "Chocolate Lava Cake", desc: "Bite into this heavenly cake to release a river of molten, oozing chocolate from the center.", price: 220, category: "Desserts", image: "https://images.unsplash.com/photo-1470124182917-cc6e71b22ecc?w=600&auto=format&fit=crop&q=80", isAvailable: true },
  { name: "Fruit Trifle", desc: "A delightful glass layered with sponge cake, custard, fresh fruit pieces, and whipped cream.", price: 190, category: "Desserts", image: "https://images.unsplash.com/photo-1553361371-9b22f78e8b1d?w=600&auto=format&fit=crop&q=80", isAvailable: true },
  { name: "Jalebi", desc: "Crispy, spiral-shaped batter fried to perfection, dipped in a bright saffron sugar syrup.", price: 100, category: "Desserts", image: "https://images.unsplash.com/photo-1590080875515-8a3a8dc5735e?w=600&auto=format&fit=crop&q=80", isAvailable: true },
  { name: "Rabdi", desc: "A luxurious, sweet, condensed-milk-based dish loaded with layers of malai (cream) and nuts.", price: 180, category: "Desserts", image: "https://images.unsplash.com/photo-1488477181946-6428a0291777?w=600&auto=format&fit=crop&q=80", isAvailable: true },

  // ─── Beverages (10 items) ───────────────────────────────────
  { name: "Cold Coffee", desc: "A timeless thick blend of instant coffee, chilled milk, and a scoop of vanilla ice cream.", price: 150, category: "Beverages", image: "https://images.unsplash.com/photo-1461023058943-07fcbe16d735?w=600&auto=format&fit=crop&q=80", isAvailable: true },
  { name: "Lemon Iced Tea", desc: "Briskly brewed black tea served on ice, heavily infused with fresh sunny lemon slices.", price: 120, category: "Beverages", image: "https://images.unsplash.com/photo-1513558161293-cdaf765ed2fd?w=600&auto=format&fit=crop&q=80", isAvailable: true },
  { name: "Peach Iced Tea", desc: "A sweet, fruity, and immensely refreshing chilled tea flavored with peach nectar.", price: 130, category: "Beverages", image: "https://images.unsplash.com/photo-1551024709-8f23befc6f87?w=600&auto=format&fit=crop&q=80", isAvailable: true },
  { name: "Mango Lassi", desc: "India's favorite yogurt-based cooler, blended seamlessly with sweet Alphonso mango pulp.", price: 160, category: "Beverages", image: "https://images.unsplash.com/photo-1600271886742-f049cd451bba?w=600&auto=format&fit=crop&q=80", isAvailable: true },
  { name: "Sweet Lassi", desc: "Traditional sweetened and chilled yogurt drink churned to a delightfully frothy consistency.", price: 110, category: "Beverages", image: "https://images.unsplash.com/photo-1579954115545-a95591f28bfc?w=600&auto=format&fit=crop&q=80", isAvailable: true },
  { name: "Cola", desc: "Classic, instantly refreshing fizzy cola served straight up over ice cubes.", price: 60, category: "Beverages", image: "https://images.unsplash.com/photo-1600271886742-f049cd451bba?w=600&auto=format&fit=crop&q=80", isAvailable: true },
  { name: "Diet Cola", desc: "A crisp, zero-calorie cola beverage for guilt-free refreshment.", price: 70, category: "Beverages", image: "https://images.unsplash.com/photo-1551024709-8f23befc6f87?w=600&auto=format&fit=crop&q=80", isAvailable: true },
  { name: "Cappuccino", desc: "A velvety, robust Italian coffee drink with equal parts espresso, steamed milk, and milk foam.", price: 140, category: "Beverages", image: "https://images.unsplash.com/photo-1536256263959-770b48d82b0a?w=600&auto=format&fit=crop&q=80", isAvailable: true },
  { name: "Espresso", desc: "A small, intense, intensely concentrated shot of coffee featuring a rich, golden crema.", price: 100, category: "Beverages", image: "https://images.unsplash.com/photo-1461023058943-07fcbe16d735?w=600&auto=format&fit=crop&q=80", isAvailable: true },
  { name: "Green Tea", desc: "Healthy, antioxidant-rich tea brewed from unoxidized leaves, served hot and soothing.", price: 90, category: "Beverages", image: "https://images.unsplash.com/photo-1567449303183-ae0d6ed1498e?w=600&auto=format&fit=crop&q=80", isAvailable: true }
];

const seedAdditional = async () => {
  try {
    await mongoose.connect(process.env.MONGO_URI);
    console.log('✅ Connected to MongoDB');
    
    const inserted = await MenuItem.insertMany(additionalMenuItems);
    console.log(`✅ Successfully seeded ${inserted.length} ADDITIONAL menu items!`);
    
    mongoose.disconnect();
    console.log('✅ Disconnected from MongoDB');
  } catch (err) {
    console.error('❌ Additional seeding failed:', err.message);
    process.exit(1);
  }
};

seedAdditional();

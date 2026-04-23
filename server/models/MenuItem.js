const mongoose = require('mongoose');

const menuItemSchema = new mongoose.Schema({
  name: { type: String, required: true },
  desc: { type: String, required: true },
  price: { type: Number, required: true },
  originalPrice: { type: Number },
  category: { type: String, required: true },
  image: { type: String, required: true },
  externalLink: { type: String, default: '' },
  isAvailable: { type: Boolean, default: true },
  tags: [{ type: String }],
  popularityScore: { type: Number, default: 0 },
}, { timestamps: true });

module.exports = mongoose.model('MenuItem', menuItemSchema);

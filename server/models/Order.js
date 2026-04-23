const mongoose = require('mongoose');

const orderSchema = new mongoose.Schema({
  user: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  items: [
    {
      menuItem: { type: mongoose.Schema.Types.ObjectId, ref: 'MenuItem', required: true },
      quantity: { type: Number, required: true },
      price: { type: Number, required: true },
    }
  ],
  totalPrice: { type: Number, required: true },
  status: {
    type: String,
    enum: ['Pending', 'Preparing', 'Ready', 'Out for Delivery', 'Delivered'],
    default: 'Pending',
  },
  statusHistory: [
    {
      status: { type: String },
      timestamp: { type: Date, default: Date.now }
    }
  ],
}, { timestamps: true });

module.exports = mongoose.model('Order', orderSchema);

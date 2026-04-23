const User = require('../models/User');
const jwt = require('jsonwebtoken');

const generateToken = (id) => {
  return jwt.sign({ id }, process.env.JWT_SECRET, { expiresIn: '30d' });
};

const generateVoucherCode = () => {
  const chars = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789';
  return 'FH-' + Array.from({ length: 8 }, () => chars[Math.floor(Math.random() * chars.length)]).join('');
};

const COUPON_META = {
  'Free Dessert':     { type: 'free_item',   value: 0,  category: 'Desserts' },
  '15% Off Total':    { type: 'percentage',  value: 15, category: null },
  'Free Main Course': { type: 'free_item',   value: 0,  category: 'Mains' },
};

const registerUser = async (req, res) => {
  const { name, email, password, role } = req.body;
  try {
    const userExists = await User.findOne({ email });
    if (userExists) return res.status(400).json({ message: 'User already exists' });

    const user = await User.create({ name, email, password, role });
    if (user) {
      res.status(201).json({
        _id: user._id, name: user.name, email: user.email, role: user.role,
        loyaltyPoints: user.loyaltyPoints,
        token: generateToken(user._id)
      });
    } else {
      res.status(400).json({ message: 'Invalid user data' });
    }
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

const loginUser = async (req, res) => {
  const { email, password } = req.body;
  try {
    const user = await User.findOne({ email });
    if (user && (await user.matchPassword(password))) {
      res.json({
        _id: user._id, name: user.name, email: user.email, role: user.role,
        loyaltyPoints: user.loyaltyPoints,
        token: generateToken(user._id)
      });
    } else {
      res.status(401).json({ message: 'Invalid email or password' });
    }
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

const getUserProfile = async (req, res) => {
  try {
    const user = await User.findById(req.user._id);
    if (user) {
      res.json({
        _id: user._id,
        name: user.name,
        email: user.email,
        role: user.role,
        loyaltyPoints: user.loyaltyPoints,
        vouchers: user.vouchers,
      });
    } else {
      res.status(404).json({ message: 'User not found' });
    }
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

const redeemPoints = async (req, res) => {
  const { cost, title } = req.body;
  try {
    const user = await User.findById(req.user._id);
    if (!user) return res.status(404).json({ message: 'User not found' });
    if (user.loyaltyPoints < cost) {
      return res.status(400).json({ message: 'Not enough points' });
    }

    const meta = COUPON_META[title];
    if (!meta) return res.status(400).json({ message: 'Unknown coupon type' });

    const code = generateVoucherCode();
    user.loyaltyPoints -= cost;
    user.vouchers.push({ code, title, ...meta });
    await user.save();

    res.json({
      message: `Redeemed: ${title}`,
      loyaltyPoints: user.loyaltyPoints,
      voucherCode: code,
      voucher: { code, title, ...meta, isUsed: false },
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

const applyVoucher = async (req, res) => {
  const { code, cartTotal } = req.body;
  try {
    const user = await User.findById(req.user._id);
    if (!user) return res.status(404).json({ message: 'User not found' });

    const voucher = user.vouchers.find(v => v.code === code.toUpperCase() && !v.isUsed);
    if (!voucher) return res.status(400).json({ message: 'Invalid or already used voucher code' });

    let discount = 0;
    if (voucher.type === 'percentage') {
      discount = Math.floor((cartTotal * voucher.value) / 100);
    }
    // free_item discount is handled on the frontend by removing the cheapest eligible item price

    res.json({
      valid: true,
      title: voucher.title,
      type: voucher.type,
      value: voucher.value,
      category: voucher.category,
      discount,
      code: voucher.code,
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

const markVoucherUsed = async (req, res) => {
  const { code } = req.body;
  try {
    const user = await User.findById(req.user._id);
    if (!user) return res.status(404).json({ message: 'User not found' });
    const voucher = user.vouchers.find(v => v.code === code);
    if (voucher) { voucher.isUsed = true; await user.save(); }
    res.json({ message: 'Voucher marked as used' });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

module.exports = { registerUser, loginUser, getUserProfile, redeemPoints, applyVoucher, markVoucherUsed };

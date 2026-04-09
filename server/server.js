const express = require('express');
const cors = require('cors');
const dotenv = require('dotenv');
const connectDB = require('./config/db');
const path = require('path');

dotenv.config();
const app = express();

connectDB();

// Handle CORS with wildcard changes to prevent errors
app.use(cors({
  origin: '*',
  methods: ['GET', 'POST', 'PUT', 'DELETE', 'PATCH', 'OPTIONS'],
  credentials: true
}));

app.use(express.json());

// Import Routes
app.use('/api/auth', require('./routes/authRoutes'));
app.use('/api/menu', require('./routes/menuRoutes'));
app.use('/api/orders', require('./routes/orderRoutes'));
app.use('/api/admin/revenue', require('./routes/revenueRoutes'));

// Serve Frontend for Production Deployment
const buildPath = path.join(__dirname, '../client/dist');
app.use(express.static(buildPath));

app.get('*', (req, res) => {
  if (req.url.startsWith('/api')) {
    return res.status(404).json({ message: 'API Route Not Found' });
  }
  res.sendFile(path.join(buildPath, 'index.html'));
});

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});

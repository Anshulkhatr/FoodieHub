const mongoose = require('mongoose');
const User = require('./models/User');
const dotenv = require('dotenv');

dotenv.config();

const seedAdmin = async () => {
  try {
    await mongoose.connect(process.env.MONGO_URI);
    
    // Check if admin already exists
    const adminExists = await User.findOne({ email: 'admin@gmail.com' });
    
    if (adminExists) {
      // Reset password to 'password' for testing
      adminExists.password = 'password';
      await adminExists.save();
      console.log('Admin password reset to: password');
    } else {
      // Create new admin
      await User.create({
        name: 'Admin User',
        email: 'admin@gmail.com',
        password: 'password',
        role: 'admin'
      });
      console.log('Admin user created successfully');
    }
    
    process.exit(0);
  } catch (error) {
    console.error('Error seeding admin:', error);
    process.exit(1);
  }
};

seedAdmin();

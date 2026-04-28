const mongoose = require('mongoose');
const dotenv = require('dotenv');
const User = require('../models/User');
const path = require('path');

dotenv.config({ path: path.join(__dirname, '../.env') });

const seedAdmin = async () => {
  try {
    await mongoose.connect(process.env.MONGODB_URI);
    console.log('Connected to DB');

    // Create Admin
    await User.deleteMany({ role: 'admin' });
    await User.create({
      name: 'System Admin',
      email: 'admin@ballari.edu',
      password: 'admin123',
      role: 'admin'
    });

    console.log('Admin account created: admin@ballari.edu / admin123');

    // Create Student
    await User.deleteMany({ role: 'student' });
    await User.create({
      name: 'Arun Kumar',
      email: 'arun.kumar@student.ballari.edu',
      password: 'student123',
      role: 'student'
    });
    console.log('Student account created: arun.kumar@student.ballari.edu / student123');

    process.exit();
  } catch (error) {
    console.error(error);
    process.exit(1);
  }
};

seedAdmin();

const mongoose = require('mongoose');
const dotenv = require('dotenv');
const User = require('./models/User');
const path = require('path');

dotenv.config({ path: path.join(__dirname, '.env') });

const checkUsers = async () => {
  try {
    await mongoose.connect(process.env.MONGODB_URI);
    console.log('Connected to DB');

    const admin = await User.findOne({ email: 'admin@ballari.edu' });
    console.log('Admin found:', admin ? 'YES' : 'NO');
    if (admin) console.log('Admin Role:', admin.role);

    const faculty = await User.findOne({ role: 'faculty' });
    console.log('First Faculty found:', faculty ? faculty.email : 'NONE');

    process.exit();
  } catch (error) {
    console.error(error);
    process.exit(1);
  }
};

checkUsers();

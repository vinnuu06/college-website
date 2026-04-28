const mongoose = require('mongoose');
const dotenv = require('dotenv');
const User = require('../models/User');
const Faculty = require('../models/Faculty');
const path = require('path');

dotenv.config({ path: path.join(__dirname, '../.env') });

const facultyData = [
  { name: 'Mr. Venkatesulu Somapalli', dept: 'Department of Computer Science', role: 'HOD / Asst. Professor', email: 'venkatesulu@ballari.edu' },
  { name: 'Mr. Udaya Kumar L.M.', dept: 'Department of Commerce', role: 'HOD / Asst. Professor', email: 'udaya.kumar@ballari.edu' },
  { name: 'Mrs. S. Nuzhath Farheen', dept: 'Department of Business Administration', role: 'Dean Academics / Asst. Prof.', email: 'nuzhath@ballari.edu' },
  { name: 'Ms. Pearl Sahana Mitra', dept: 'Department of Business Administration', role: 'Dean Placement / Asst. Prof.', email: 'pearl@ballari.edu' },
  { name: 'Mrs. M. Usha Rani', dept: 'Department of Computer Science', role: 'Assistant Professor', email: 'usha.rani@ballari.edu' },
  { name: 'Ms. Priscilla Shruthi', dept: 'Department of Computer Science', role: 'Assistant Professor', email: 'priscilla@ballari.edu' },
  { name: 'Mr. Vamshi Krishna C.', dept: 'Department of Computer Science', role: 'Assistant Professor', email: 'vamshi@ballari.edu' },
  { name: 'Mrs. Nazneen Kauser', dept: 'Department of Computer Science', role: 'Assistant Professor', email: 'nazneen@ballari.edu' },
  { name: 'Mrs. Sneha J.', dept: 'Department of Commerce', role: 'Assistant Professor', email: 'sneha@ballari.edu' },
  { name: 'Mrs. B. Fameeda', dept: 'Department of Commerce', role: 'Assistant Professor', email: 'fameeda@ballari.edu' },
  { name: 'Mr. Chaitanya B.', dept: 'Department of Commerce & Mgmt', role: 'Assistant Professor', email: 'chaitanya@ballari.edu' },
  { name: 'Mr. Kiran Kumar K.', dept: 'Placement Cell', role: 'Corporate Relation Officer', email: 'kirankumar@ballari.edu' },
  { name: 'Ms. Meghana S.', dept: 'Department of Business Administration', role: 'Assistant Professor', email: 'meghana@ballari.edu' },
  { name: 'Mr. Yaresh Kumar Bisa', dept: 'English', role: 'Assistant Professor', email: 'yaresh@ballari.edu' },
  { name: 'Mrs. B. Shyamala', dept: 'English', role: 'Assistant Professor', email: 'shyamala@ballari.edu' },
  { name: 'Mrs. Sarvamangala S.', dept: 'Kannada', role: 'Assistant Professor', email: 'sarvamangala@ballari.edu' }
];

const seedFaculty = async () => {
  try {
    await mongoose.connect(process.env.MONGODB_URI);
    console.log('Connected to Database...');

    // Clear existing faculty (optional - comment out if you want to keep existing)
    const facultyUsers = await User.find({ role: 'faculty' });
    const facultyUserIds = facultyUsers.map(u => u._id);
    await Faculty.deleteMany({ userId: { $in: facultyUserIds } });
    await User.deleteMany({ role: 'faculty' });
    
    console.log('Registering official faculty members...');

    for (const f of facultyData) {
      // 1. Create User Account
      const user = await User.create({
        name: f.name,
        email: f.email,
        password: 'faculty123',
        role: 'faculty'
      });

      // 2. Create Faculty Profile
      await Faculty.create({
        userId: user._id,
        employeeId: 'BBC-' + Math.floor(1000 + Math.random() * 9000),
        department: f.dept,
        designation: f.role,
        qualification: 'MA/M.Sc/MBA/M.Com'
      });
      
      console.log(`Registered: ${f.name} (${f.email})`);
    }

    console.log('====================================');
    console.log('All Faculty Members Registered Successfully!');
    process.exit();
  } catch (error) {
    console.error('Seeding Error:', error);
    process.exit(1);
  }
};

seedFaculty();

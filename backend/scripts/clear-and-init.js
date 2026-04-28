/**
 * Database Reset Script — Clears all demo data and creates a fresh Admin account.
 * Run: node scripts/clear-and-init.js
 */
require('dotenv').config({ path: __dirname + '/../.env' });
const mongoose = require('mongoose');

// Models
const User = require('../models/User');
const Student = require('../models/Student');
const Faculty = require('../models/Faculty');
const Admin = require('../models/Admin');
const Course = require('../models/Course');
const Placement = require('../models/Placement');
const Admission = require('../models/Admission');
const Event = require('../models/Event');
const Notification = require('../models/Notification');
const Attendance = require('../models/Attendance');
const Exam = require('../models/Exam');
const Transaction = require('../models/Transaction');
const Book = require('../models/Book');
const LibraryRecord = require('../models/LibraryRecord');

const resetDatabase = async () => {
  try {
    console.log('🧹 Starting database reset...');
    await mongoose.connect(process.env.MONGODB_URI);
    console.log('✅ Connected to MongoDB');

    // Clear all collections
    const collections = [
      User, Student, Faculty, Admin, Course, Placement, 
      Admission, Event, Notification, Attendance, 
      Exam, Transaction, Book, LibraryRecord
    ];

    console.log('🗑️  Deleting all demo records...');
    for (const model of collections) {
      await model.deleteMany({});
      console.log(`   - Cleared ${model.modelName}`);
    }

    // Create Initial Super Admin
    console.log('👤 Creating Fresh Super Admin...');
    const adminUser = await User.create({
      name: 'System Administrator',
      email: 'admin@bellari.edu',
      password: 'admin123', // User should change this after login
      role: 'admin',
      phone: '+91 00000 00000'
    });

    await Admin.create({
      userId: adminUser._id,
      adminType: 'Super Admin',
      permissions: ['manage_students', 'manage_faculty', 'manage_courses', 'manage_placements', 'manage_admissions', 'manage_events']
    });

    console.log('\n✨ DATABASE CLEARED SUCCESSFULLY!');
    console.log('========================================');
    console.log('🔑 New Admin Credentials:');
    console.log('   Email:    admin@bellari.edu');
    console.log('   Password: admin123');
    console.log('========================================');
    console.log('🚀 You can now log in and start adding real courses, faculty, and students.');

    process.exit(0);
  } catch (error) {
    console.error('❌ Reset failed:', error.message);
    process.exit(1);
  }
};

resetDatabase();

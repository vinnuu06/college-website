const mongoose = require('mongoose');
const dotenv = require('dotenv');
const Course = require('../models/Course');
const path = require('path');

dotenv.config({ path: path.join(__dirname, '../.env') });

const courses = [
  {
    courseCode: 'BCA',
    courseName: 'Bachelor of Computer Applications',
    department: 'Department of Computer Science',
    duration: 3,
    totalSeats: 60,
    description: 'A comprehensive program focusing on software development, computer networking, and information technology applications.',
    eligibility: '10+2 / PUC II (Science or Commerce with Math preferred)',
    curriculum: [
      {
        semester: 1,
        subjects: [
          { name: 'Computer Fundamentals & Office Automation', credits: 4 },
          { name: 'Programming in C', credits: 4 },
          { name: 'Mathematical Foundation', credits: 4 },
          { name: 'C Programming Lab', credits: 2 }
        ]
      }
    ]
  },
  {
    courseCode: 'BBA',
    courseName: 'Bachelor of Business Administration',
    department: 'Department of Business Administration',
    duration: 3,
    totalSeats: 60,
    description: 'Preparing future business leaders with deep insights into management, marketing, and strategic decision making.',
    eligibility: '10+2 / PUC II in any stream',
    curriculum: [
      {
        semester: 1,
        subjects: [
          { name: 'Management Principles & Practice', credits: 4 },
          { name: 'Fundamentals of Business Accounting', credits: 4 },
          { name: 'Marketing Management', credits: 4 }
        ]
      }
    ]
  },
  {
    courseCode: 'B.Com',
    courseName: 'Bachelor of Commerce',
    department: 'Department of Commerce',
    duration: 3,
    totalSeats: 100,
    description: 'Foundation for professional excellence in accounting, finance, and trade operations.',
    eligibility: '10+2 / PUC II in any stream (Commerce preferred)',
    curriculum: [
      {
        semester: 1,
        subjects: [
          { name: 'Financial Accounting', credits: 4 },
          { name: 'Management Principles & Applications', credits: 4 },
          { name: 'Principles of Marketing', credits: 4 }
        ]
      }
    ]
  },
  {
    courseCode: 'M.Com',
    courseName: 'Master of Commerce',
    department: 'Department of Commerce',
    duration: 2,
    totalSeats: 40,
    description: 'Advanced postgraduate study focusing on business research, policy, and higher financial management.',
    eligibility: 'B.Com / BBA degree with 50% aggregate',
    curriculum: [
      {
        semester: 1,
        subjects: [
          { name: 'Business Environment & Policy', credits: 4 },
          { name: 'Advanced Financial Management', credits: 4 },
          { name: 'Organizational Behaviour', credits: 4 },
          { name: 'Marketing Management', credits: 4 }
        ]
      }
    ]
  }
];

const seedAcademics = async () => {
  try {
    await mongoose.connect(process.env.MONGODB_URI);
    console.log('Connected to Database for Seeding...');

    // Clear existing courses
    await Course.deleteMany();
    console.log('Cleared existing courses.');

    // Insert real data
    await Course.insertMany(courses);
    console.log('Successfully seeded official Academic Programs!');

    process.exit();
  } catch (error) {
    console.error('Seeding Error:', error);
    process.exit(1);
  }
};

seedAcademics();

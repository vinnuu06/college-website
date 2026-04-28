const mongoose = require('mongoose');
const dotenv = require('dotenv');
const Event = require('../models/Event'); // Assuming this exists or I will create it
const path = require('path');

dotenv.config({ path: path.join(__dirname, '../.env') });

const events = [
  {
    title: 'UG Admissions 2026-27 Open',
    description: 'Applications for BBA, BCA, and B.Com are now open for the 2026-27 academic cycle. Apply via UUCMS portal or visit campus.',
    date: new Date('2026-04-15'),
    eventType: 'Academic',
    venue: 'Campus / UUCMS Portal',
    organizer: 'Admission Cell'
  },
  {
    title: 'Orientation Day 2026',
    description: 'Welcome ceremony for the new batches of UG and PG students. Detailed schedule will be shared soon.',
    date: new Date('2026-09-01'),
    eventType: 'Orientation',
    venue: 'Main Auditorium',
    organizer: 'Academic Dept'
  },
  {
    title: 'CA/CS/CMA Coaching Orientation',
    description: 'Orientation session for professional coaching in collaboration with Yeshas Academy. Mandatory for interested students.',
    date: new Date('2026-05-10'),
    eventType: 'Workshop',
    venue: 'Seminar Hall',
    organizer: 'Placement Cell'
  },
  {
    title: 'Kala Utsav - Web Expo',
    description: 'Annual cultural and technical showcase by the Designers Club. Students will exhibit web design and creative projects.',
    date: new Date('2026-06-20'),
    eventType: 'Cultural',
    venue: 'Exhibition Area',
    organizer: 'Designers Club'
  }
];

const seedEvents = async () => {
  try {
    await mongoose.connect(process.env.MONGODB_URI);
    console.log('Connected to Database...');

    await Event.deleteMany();
    await Event.insertMany(events);
    
    console.log('Successfully seeded official Events & Announcements!');
    process.exit();
  } catch (error) {
    console.error('Seeding Error:', error);
    process.exit(1);
  }
};

seedEvents();

/**
 * Database Seeder — Real data for Ballari Business College
 * Run: node seeder.js
 */
require('dotenv').config({ path: __dirname + '/.env' });
const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');

// Models
const User = require('./models/User');
const Student = require('./models/Student');
const Faculty = require('./models/Faculty');
const Admin = require('./models/Admin');
const Course = require('./models/Course');
const Placement = require('./models/Placement');
const Admission = require('./models/Admission');
const Event = require('./models/Event');
const Notification = require('./models/Notification');

const seedDatabase = async () => {
  try {
    console.log('🌱 Starting database seed with REAL Ballari Business College data...');
    await mongoose.connect(process.env.MONGODB_URI);
    console.log('✅ Connected to MongoDB');

    // Clear existing data
    console.log('🗑️  Clearing existing data...');
    await Promise.all([
      User.deleteMany({}), Student.deleteMany({}), Faculty.deleteMany({}),
      Admin.deleteMany({}), Course.deleteMany({}), Placement.deleteMany({}),
      Admission.deleteMany({}), Event.deleteMany({}), Notification.deleteMany({})
    ]);

    // ========== COURSES (Real BBC Programs) ==========
    console.log('📚 Creating courses...');
    const courses = await Course.create([
      {
        courseCode: 'BCA', courseName: 'Bachelor of Computer Applications',
        department: 'Department of Computer Science',
        description: 'A 3-year undergraduate program focusing on computer applications, programming, databases, networking, and software engineering. Affiliated to Vijayanagara Sri Krishnadevaraya University (VSKU), Ballari.',
        duration: 3, eligibility: '10+2 with Mathematics or Computer Science with minimum 45% marks',
        totalSeats: 60, enrolledStudents: 52,
        curriculum: [
          { semester: 1, subjects: [{ name: 'Problem Solving using C', credits: 4 }, { name: 'Digital Electronics', credits: 3 }, { name: 'Mathematics-I', credits: 4 }] },
          { semester: 2, subjects: [{ name: 'Data Structures using C', credits: 4 }, { name: 'Discrete Mathematics', credits: 4 }] },
          { semester: 3, subjects: [{ name: 'Object Oriented Programming (Java)', credits: 4 }, { name: 'DBMS', credits: 4 }] },
          { semester: 4, subjects: [{ name: 'Operating Systems', credits: 3 }, { name: 'Software Engineering', credits: 4 }, { name: 'Web Technologies', credits: 4 }] },
          { semester: 5, subjects: [{ name: 'Python Programming', credits: 4 }, { name: 'Computer Networks', credits: 3 }] },
          { semester: 6, subjects: [{ name: 'Cloud Computing', credits: 3 }, { name: 'Project Work', credits: 6 }] }
        ]
      },
      {
        courseCode: 'BBA', courseName: 'Bachelor of Business Administration',
        department: 'Department of Business Administration',
        description: 'A 3-year undergraduate program covering business strategy, marketing, HR management, finance, and entrepreneurship. Affiliated to VSKU, Ballari.',
        duration: 3, eligibility: '10+2 from any stream with minimum 45% marks',
        totalSeats: 60, enrolledStudents: 48,
        curriculum: [
          { semester: 1, subjects: [{ name: 'Principles of Management', credits: 4 }, { name: 'Business Economics', credits: 4 }] },
          { semester: 2, subjects: [{ name: 'Financial Accounting', credits: 4 }, { name: 'Marketing Management', credits: 4 }] },
          { semester: 3, subjects: [{ name: 'Human Resource Management', credits: 4 }, { name: 'Business Law', credits: 3 }] },
          { semester: 4, subjects: [{ name: 'Strategic Management', credits: 4 }, { name: 'International Business', credits: 3 }] },
          { semester: 5, subjects: [{ name: 'Entrepreneurship Development', credits: 4 }, { name: 'Supply Chain Management', credits: 3 }] },
          { semester: 6, subjects: [{ name: 'Business Analytics', credits: 4 }, { name: 'Project Work', credits: 6 }] }
        ]
      },
      {
        courseCode: 'B.Com', courseName: 'Bachelor of Commerce',
        department: 'Department of Commerce',
        description: 'A 3-year undergraduate program specializing in accounting, finance, taxation, and auditing. Affiliated to VSKU, Ballari.',
        duration: 3, eligibility: '10+2 Commerce stream with minimum 45% marks',
        totalSeats: 100, enrolledStudents: 88,
        curriculum: [
          { semester: 1, subjects: [{ name: 'Financial Accounting-I', credits: 4 }, { name: 'Business Organisation', credits: 3 }] },
          { semester: 2, subjects: [{ name: 'Corporate Accounting', credits: 4 }, { name: 'Cost Accounting', credits: 4 }] },
          { semester: 3, subjects: [{ name: 'Income Tax', credits: 4 }, { name: 'Business Statistics', credits: 3 }] },
          { semester: 4, subjects: [{ name: 'Auditing', credits: 4 }, { name: 'Management Accounting', credits: 4 }] },
          { semester: 5, subjects: [{ name: 'GST & Indirect Taxes', credits: 3 }, { name: 'Banking & Insurance', credits: 3 }] },
          { semester: 6, subjects: [{ name: 'Financial Management', credits: 4 }, { name: 'Project Work', credits: 6 }] }
        ]
      },
      {
        courseCode: 'M.Com', courseName: 'Master of Commerce',
        department: 'Department of Commerce',
        description: 'A 2-year postgraduate program in advanced commerce, accounting, taxation, and financial management. Affiliated to VSKU, Ballari.',
        duration: 2, eligibility: 'B.Com or equivalent degree with minimum 50% marks',
        totalSeats: 40, enrolledStudents: 28,
        curriculum: [
          { semester: 1, subjects: [{ name: 'Advanced Accounting', credits: 4 }, { name: 'Business Research Methods', credits: 3 }] },
          { semester: 2, subjects: [{ name: 'Corporate Tax Planning', credits: 4 }, { name: 'Financial Markets', credits: 4 }] },
          { semester: 3, subjects: [{ name: 'Strategic Financial Management', credits: 4 }, { name: 'International Finance', credits: 3 }] },
          { semester: 4, subjects: [{ name: 'Dissertation', credits: 8 }] }
        ]
      }
    ]);

    // ========== ADMIN (Principal / System Admin) ==========
    console.log('👤 Creating admin...');
    const adminUser = await User.create({
      name: 'Dr. K. Raghavendra Rao',
      email: 'admin@ballari.edu',
      password: 'admin123',
      role: 'admin',
      phone: '08392 266777'
    });
    await Admin.create({
      userId: adminUser._id, adminType: 'Super Admin',
      permissions: ['manage_students', 'manage_faculty', 'manage_courses', 'manage_placements', 'manage_admissions', 'manage_events']
    });

    // ========== FACULTY (Real BBC Staff) ==========
    console.log('👨‍🏫 Creating real faculty members...');
    const facultyData = [
      { name: 'Mr. Venkatesulu Somapalli', email: 'venkatesulu@ballari.edu', dept: 'Department of Computer Science', designation: 'HOD / Asst. Professor', qualification: 'M.Sc (CS), M.Phil', specialization: 'Data Structures & Algorithms', experience: 12, skills: ['C', 'Java', 'Data Structures', 'DBMS', 'Python'] },
      { name: 'Mr. Udaya Kumar L.M.', email: 'udaya.kumar@ballari.edu', dept: 'Department of Commerce', designation: 'HOD / Asst. Professor', qualification: 'M.Com, NET', specialization: 'Financial Accounting & Taxation', experience: 14, skills: ['Accounting', 'Taxation', 'Tally', 'Auditing', 'GST'] },
      { name: 'Mrs. S. Nuzhath Farheen', email: 'nuzhath@ballari.edu', dept: 'Department of Business Administration', designation: 'Dean Academics / Asst. Prof.', qualification: 'MBA, NET', specialization: 'Strategic Management & HR', experience: 10, skills: ['HRM', 'Strategic Planning', 'Marketing', 'Leadership'] },
      { name: 'Ms. Pearl Sahana Mitra', email: 'pearl@ballari.edu', dept: 'Department of Business Administration', designation: 'Dean Placement / Asst. Prof.', qualification: 'MBA, UGC-NET', specialization: 'Marketing & Corporate Relations', experience: 8, skills: ['Placement Training', 'Corporate Relations', 'Marketing', 'Communication'] },
      { name: 'Mrs. M. Usha Rani', email: 'usha.rani@ballari.edu', dept: 'Department of Computer Science', designation: 'Assistant Professor', qualification: 'MCA, M.Phil', specialization: 'Web Technologies & Databases', experience: 9, skills: ['HTML/CSS', 'JavaScript', 'PHP', 'MySQL', 'MongoDB'] },
      { name: 'Ms. Priscilla Shruthi', email: 'priscilla@ballari.edu', dept: 'Department of Computer Science', designation: 'Assistant Professor', qualification: 'M.Sc (IT)', specialization: 'Programming & Software Engineering', experience: 6, skills: ['Java', 'Python', 'Software Engineering', 'C++', 'React'] },
      { name: 'Mr. Vamshi Krishna C.', email: 'vamshi@ballari.edu', dept: 'Department of Computer Science', designation: 'Assistant Professor', qualification: 'MCA', specialization: 'Networking & Cloud Computing', experience: 5, skills: ['Networking', 'Cloud Computing', 'Linux', 'AWS', 'Docker'] },
      { name: 'Mrs. Nazneen Kauser', email: 'nazneen@ballari.edu', dept: 'Department of Computer Science', designation: 'Assistant Professor', qualification: 'M.Sc (CS)', specialization: 'Operating Systems & IoT', experience: 7, skills: ['OS Concepts', 'IoT', 'Embedded Systems', 'C', 'Arduino'] },
      { name: 'Mrs. Sneha J.', email: 'sneha@ballari.edu', dept: 'Department of Commerce', designation: 'Assistant Professor', qualification: 'M.Com, SET', specialization: 'Cost & Management Accounting', experience: 6, skills: ['Cost Accounting', 'Management Accounting', 'Tally', 'Excel'] },
      { name: 'Mrs. B. Fameeda', email: 'fameeda@ballari.edu', dept: 'Department of Commerce', designation: 'Assistant Professor', qualification: 'M.Com, NET', specialization: 'Banking & Financial Services', experience: 8, skills: ['Banking', 'Insurance', 'Financial Management', 'Investment'] },
      { name: 'Mr. Chaitanya B.', email: 'chaitanya@ballari.edu', dept: 'Department of Commerce & Mgmt', designation: 'Assistant Professor', qualification: 'MBA, M.Com', specialization: 'Business Law & Ethics', experience: 5, skills: ['Business Law', 'Corporate Governance', 'Ethics', 'Entrepreneurship'] },
      { name: 'Mr. Kiran Kumar K.', email: 'kirankumar@ballari.edu', dept: 'Placement Cell', designation: 'Corporate Relation Officer', qualification: 'MBA (HR)', specialization: 'Training & Placements', experience: 7, skills: ['Placement Coordination', 'Industry Relations', 'Soft Skills', 'Resume Building'] },
      { name: 'Ms. Meghana S.', email: 'meghana@ballari.edu', dept: 'Department of Business Administration', designation: 'Assistant Professor', qualification: 'MBA, NET', specialization: 'Finance & Operations', experience: 4, skills: ['Financial Analysis', 'Operations Management', 'Project Management'] },
      { name: 'Mr. Yaresh Kumar Bisa', email: 'yaresh@ballari.edu', dept: 'English', designation: 'Assistant Professor', qualification: 'MA (English), NET', specialization: 'Business English & Communication', experience: 10, skills: ['Business English', 'Communication Skills', 'Technical Writing'] },
      { name: 'Mrs. B. Shyamala', email: 'shyamala@ballari.edu', dept: 'English', designation: 'Assistant Professor', qualification: 'MA (English)', specialization: 'English Literature & Grammar', experience: 8, skills: ['English Grammar', 'Literature', 'Creative Writing'] },
      { name: 'Mrs. Sarvamangala S.', email: 'sarvamangala@ballari.edu', dept: 'Kannada', designation: 'Assistant Professor', qualification: 'MA (Kannada), NET', specialization: 'Kannada Language & Literature', experience: 11, skills: ['Kannada Literature', 'Translation', 'Cultural Studies'] }
    ];

    const facultyUsers = [];
    for (let i = 0; i < facultyData.length; i++) {
      const f = facultyData[i];
      const user = await User.create({
        name: f.name, email: f.email, password: 'faculty123', role: 'faculty',
        phone: `+91 ${Math.floor(9000000000 + Math.random() * 999999999)}`
      });
      const faculty = await Faculty.create({
        userId: user._id,
        employeeId: `BBC-${String(i + 1).padStart(3, '0')}`,
        department: f.dept, designation: f.designation,
        specialization: f.specialization, qualification: f.qualification,
        experience: f.experience, skills: f.skills,
        coursesTaught: [courses[i % courses.length]._id]
      });
      facultyUsers.push({ user, faculty });
    }

    // ========== STUDENTS (Realistic BBC student names) ==========
    console.log('🎓 Creating students...');
    const studentList = [
      // BCA Students
      { name: 'Vinay Kumar H.', dept: 'Department of Computer Science', sem: 4, course: 0 },
      { name: 'Aishwarya R.', dept: 'Department of Computer Science', sem: 4, course: 0 },
      { name: 'Manoj K.', dept: 'Department of Computer Science', sem: 2, course: 0 },
      { name: 'Shreya B. Patil', dept: 'Department of Computer Science', sem: 6, course: 0 },
      { name: 'Rakesh Gowda M.', dept: 'Department of Computer Science', sem: 6, course: 0 },
      { name: 'Priya Darshini S.', dept: 'Department of Computer Science', sem: 2, course: 0 },
      { name: 'Sanjay Reddy N.', dept: 'Department of Computer Science', sem: 4, course: 0 },
      { name: 'Kavitha M.', dept: 'Department of Computer Science', sem: 4, course: 0 },
      { name: 'Naveen Kumar T.', dept: 'Department of Computer Science', sem: 6, course: 0 },
      { name: 'Deepa R.', dept: 'Department of Computer Science', sem: 2, course: 0 },
      // BBA Students
      { name: 'Abhishek S.', dept: 'Department of Business Administration', sem: 4, course: 1 },
      { name: 'Fathima Zahra', dept: 'Department of Business Administration', sem: 2, course: 1 },
      { name: 'Harsha V.', dept: 'Department of Business Administration', sem: 6, course: 1 },
      { name: 'Anjali Kumari', dept: 'Department of Business Administration', sem: 4, course: 1 },
      { name: 'Mohammed Irfan', dept: 'Department of Business Administration', sem: 2, course: 1 },
      { name: 'Divya Shree K.', dept: 'Department of Business Administration', sem: 6, course: 1 },
      { name: 'Suresh Babu R.', dept: 'Department of Business Administration', sem: 4, course: 1 },
      { name: 'Pallavi M.', dept: 'Department of Business Administration', sem: 2, course: 1 },
      // B.Com Students
      { name: 'Ramesh H.', dept: 'Department of Commerce', sem: 4, course: 2 },
      { name: 'Lakshmi Devi B.', dept: 'Department of Commerce', sem: 6, course: 2 },
      { name: 'Karthik Naik G.', dept: 'Department of Commerce', sem: 2, course: 2 },
      { name: 'Shwetha S.', dept: 'Department of Commerce', sem: 4, course: 2 },
      { name: 'Basavaraj P.', dept: 'Department of Commerce', sem: 6, course: 2 },
      { name: 'Pooja N.', dept: 'Department of Commerce', sem: 2, course: 2 },
      { name: 'Vikas Kumar D.', dept: 'Department of Commerce', sem: 4, course: 2 },
      { name: 'Sunitha R.', dept: 'Department of Commerce', sem: 6, course: 2 },
      { name: 'Anand M.', dept: 'Department of Commerce', sem: 2, course: 2 },
      { name: 'Ranjitha K.', dept: 'Department of Commerce', sem: 4, course: 2 },
      // M.Com Students
      { name: 'Arun Prasad T.', dept: 'Department of Commerce', sem: 2, course: 3 },
      { name: 'Savitha G.', dept: 'Department of Commerce', sem: 2, course: 3 },
    ];

    const studentUsers = [];
    for (let i = 0; i < studentList.length; i++) {
      const s = studentList[i];
      const emailSlug = s.name.toLowerCase().replace(/[\.\s]+/g, '.').replace(/[^a-z0-9.]/g, '').replace(/\.+$/, '').replace(/^\.+/, '');
      const user = await User.create({
        name: s.name, email: `${emailSlug}@student.ballari.edu`,
        password: 'student123', role: 'student',
        phone: `+91 ${Math.floor(7000000000 + Math.random() * 2999999999)}`
      });
      const student = await Student.create({
        userId: user._id,
        rollNumber: `BBC${2024}${String(i + 1).padStart(3, '0')}`,
        department: s.dept, semester: s.sem,
        cgpa: parseFloat((Math.random() * 2.5 + 7).toFixed(2)),
        courses: [courses[s.course]._id], isActive: true
      });
      studentUsers.push({ user, student });
    }

    // ========== PLACEMENTS (Real recruiter companies for BBC) ==========
    console.log('💼 Creating placement records...');
    const companies = [
      { companyName: 'Infosys', position: 'System Engineer Trainee', ctcOffered: 350000, studentCount: 8 },
      { companyName: 'Wipro', position: 'Project Engineer', ctcOffered: 380000, studentCount: 6 },
      { companyName: 'TCS', position: 'Asst. System Engineer', ctcOffered: 360000, studentCount: 12 },
      { companyName: 'ICICI Bank', position: 'Relationship Manager', ctcOffered: 300000, studentCount: 5 },
      { companyName: 'HDFC Bank', position: 'Sales Officer', ctcOffered: 280000, studentCount: 4 },
      { companyName: 'Accenture', position: 'Associate Analyst', ctcOffered: 450000, studentCount: 3 },
      { companyName: 'Amazon (Warehouse)', position: 'Operations Executive', ctcOffered: 320000, studentCount: 4 },
      { companyName: 'Bajaj Finserv', position: 'Business Development Executive', ctcOffered: 300000, studentCount: 6 },
    ];

    for (const course of courses) {
      await Placement.create({
        course: course._id, academicYear: '2025-2026',
        totalStudents: course.enrolledStudents,
        placedStudents: Math.floor(course.enrolledStudents * 0.82),
        highestPackage: 600000, averagePackage: 350000, lowestPackage: 240000,
        companies: companies.slice(0, 5),
        remarks: `Placement season ongoing for ${course.courseCode}`
      });
      await Placement.create({
        course: course._id, academicYear: '2024-2025',
        totalStudents: course.totalSeats - 8,
        placedStudents: Math.floor((course.totalSeats - 8) * 0.78),
        highestPackage: 500000, averagePackage: 320000, lowestPackage: 220000,
        companies: companies.slice(2, 7),
        remarks: `Completed placement for ${course.courseCode}`
      });
    }

    // ========== ADMISSIONS ==========
    console.log('📝 Creating admission applications...');
    const admissionData = [
      { name: 'Sahana M.', course: 0 }, { name: 'Abhinav R.', course: 1 },
      { name: 'Tanvi P.', course: 2 }, { name: 'Girish K.', course: 0 },
      { name: 'Rashmi S.', course: 1 }, { name: 'Varun T.', course: 2 },
      { name: 'Amitha L.', course: 0 }, { name: 'Naveen B.', course: 3 },
      { name: 'Shruti D.', course: 2 }, { name: 'Kiran H.', course: 1 },
    ];
    for (let i = 0; i < admissionData.length; i++) {
      const a = admissionData[i];
      const marks = Math.floor(Math.random() * 25) + 60;
      await Admission.create({
        fullName: a.name,
        email: `${a.name.toLowerCase().replace(/[\.\s]+/g, '.').replace(/[^a-z0-9.]/g, '').replace(/\.+$/, '').replace(/^\.+/, '')}@gmail.com`,
        phone: `+91 ${Math.floor(8000000000 + Math.random() * 1999999999)}`,
        marks, percentage: marks,
        courseApplied: courses[a.course]._id,
        status: ['Pending', 'Approved', 'Approved', 'Pending', 'Waitlisted'][i % 5],
        address: 'Ballari, Karnataka - 583103',
        qualifying10Marks: Math.floor(Math.random() * 15) + 75,
        qualifying12Marks: Math.floor(Math.random() * 20) + 65
      });
    }

    // ========== EVENTS ==========
    console.log('📅 Creating events...');
    const now = new Date();
    await Event.create([
      {
        title: 'Annual Day Celebration 2026',
        description: 'Annual Day featuring cultural performances, prize distribution, and chief guest address. All students and parents are invited.',
        eventType: 'Cultural', date: new Date(now.getTime() + 10 * 86400000),
        time: '10:00 AM', venue: 'BBC Main Auditorium',
        organizer: 'Ballari Business College', targetAudience: 'all',
        maxParticipants: 500, status: 'upcoming', isPinned: true,
        tags: ['annual_day', 'cultural', 'celebration'], createdBy: adminUser._id
      },
      {
        title: 'Campus Recruitment Drive — TCS & Infosys',
        description: 'On-campus placement drive for final year BCA, B.Com, and BBA students. Carry updated resume and college ID.',
        eventType: 'Placement', date: new Date(now.getTime() + 14 * 86400000),
        time: '9:30 AM', venue: 'Seminar Hall, Block A',
        organizer: 'Training & Placement Cell', targetAudience: 'students',
        maxParticipants: 120, status: 'upcoming', isPinned: true,
        tags: ['placement', 'tcs', 'infosys'], createdBy: adminUser._id
      },
      {
        title: 'Workshop: Web Development with React & Node.js',
        description: 'Hands-on 2-day workshop on modern full-stack web development using React.js and Node.js. Open to BCA students.',
        eventType: 'Workshop', date: new Date(now.getTime() + 5 * 86400000),
        time: '2:00 PM', venue: 'Computer Lab 2',
        organizer: 'Department of Computer Science', targetAudience: 'bca',
        maxParticipants: 50, status: 'upcoming',
        tags: ['workshop', 'react', 'nodejs', 'web_dev'], createdBy: adminUser._id
      },
      {
        title: 'Guest Lecture: GST & Taxation in Modern India',
        description: 'Guest lecture by CA Prakash Hegde on recent GST amendments and practical taxation challenges for B.Com and M.Com students.',
        eventType: 'Academic', date: new Date(now.getTime() + 3 * 86400000),
        time: '11:00 AM', venue: 'Seminar Hall, Block B',
        organizer: 'Department of Commerce', targetAudience: 'bcom',
        maxParticipants: 100, status: 'upcoming',
        tags: ['commerce', 'gst', 'taxation', 'guest_lecture'], createdBy: adminUser._id
      },
      {
        title: 'Inter-College Sports Meet 2026',
        description: 'Annual sports competition — cricket, volleyball, athletics, chess. Register through your department HOD.',
        eventType: 'Sports', date: new Date(now.getTime() + 21 * 86400000),
        endDate: new Date(now.getTime() + 23 * 86400000),
        time: '8:00 AM', venue: 'BBC Sports Ground',
        organizer: 'Physical Education Dept.', targetAudience: 'all',
        maxParticipants: 200, status: 'upcoming',
        tags: ['sports', 'cricket', 'athletics'], createdBy: adminUser._id
      }
    ]);

    // ========== NOTIFICATIONS ==========
    console.log('🔔 Creating notifications...');
    for (const s of studentUsers) {
      await Notification.create([
        {
          recipient: s.user._id,
          title: 'Welcome to Ballari Business College!',
          message: 'Your student account is active. Explore your dashboard for academics, attendance, placements, and events.',
          type: 'success', category: 'system', priority: 'high'
        },
        {
          recipient: s.user._id,
          title: 'Campus Recruitment Drive — Register Now',
          message: 'TCS & Infosys campus drive is coming up. Register through the Placement Cell before the deadline.',
          type: 'announcement', category: 'event', priority: 'medium'
        }
      ]);
    }

    // ========== SUMMARY ==========
    console.log('\n========================================');
    console.log('✅ DATABASE SEEDED SUCCESSFULLY!');
    console.log('========================================');
    console.log(`📚 Courses: ${courses.length} (BCA, BBA, B.Com, M.Com)`);
    console.log(`👤 Admin: 1 (admin@ballari.edu / admin123)`);
    console.log(`👨‍🏫 Faculty: ${facultyUsers.length} (password: faculty123)`);
    console.log(`🎓 Students: ${studentUsers.length} (password: student123)`);
    console.log(`💼 Placements: ${courses.length * 2}`);
    console.log(`📝 Admissions: ${admissionData.length}`);
    console.log(`📅 Events: 5`);
    console.log(`🔔 Notifications: ${studentUsers.length * 2}`);
    console.log('========================================\n');
    console.log('🔑 Login Credentials:');
    console.log('  Admin:   admin@ballari.edu / admin123');
    console.log('  Faculty: venkatesulu@ballari.edu / faculty123');
    console.log('  Student: vinay.kumar.h.@student.ballari.edu / student123');
    console.log('');
    process.exit(0);
  } catch (error) {
    console.error('❌ Seeding failed:', error);
    process.exit(1);
  }
};

seedDatabase();

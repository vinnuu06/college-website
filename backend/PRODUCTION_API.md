# 🎓 Bellari Business College - Production Backend API Documentation

## ✅ Project Status: PRODUCTION-READY

This is a complete, production-ready Node.js + Express + MongoDB backend for Bellari Business College Management System.

---

## 📋 Table of Contents
1. [Architecture](#architecture)
2. [Database Models](#database-models)
3. [API Endpoints](#api-endpoints)
4. [Authentication](#authentication)
5. [Quick Start](#quick-start)
6. [Deployment](#deployment)

---

## 🏗️ Architecture

```
Backend Structure:
├── models/          # MongoDB Schemas (7 models)
├── controllers/     # Business Logic (7 controllers)
├── routes/          # API Routes (7 routers)
├── middleware/      # Auth & Validation
├── config/          # Database Configuration
├── server.js        # Express App Entry Point
└── package.json     # Dependencies

Technology Stack:
- Runtime: Node.js (v18+)
- Framework: Express.js v4.18.2
- Database: MongoDB with Mongoose ODM
- Authentication: JWT (7-day tokens)
- Password Security: bcryptjs (10 salt rounds)
- Environment: dotenv for configuration
- Validation: Express-validator
```

---

## 📊 Database Models

### 1. **User Model**
Core authentication model for all system users.

```javascript
{
  name: String (required),
  email: String (unique, required),
  password: String (hashed, required),
  role: String (enum: ['student', 'faculty', 'admin']),
  phone: String,
  address: String,
  createdAt: Date
}
```

### 2. **Course Model** ⭐ (NEW)
Bellari Business College offers 3 undergraduate courses.

```javascript
{
  courseCode: String (enum: ['BCA', 'BBA', 'BCom'], required, unique),
  courseName: String (required),
  description: String (required),
  duration: Number (in years, 1-6),
  eligibility: String (admission criteria),
  subjects: [
    {
      subject: String,
      creditHours: Number,
      semester: Number
    }
  ],
  totalSeats: Number (required),
  enrolledStudents: Number (default: 0),
  faculty: [ObjectId ref Faculty],
  isActive: Boolean (default: true),
  createdAt: Date,
  updatedAt: Date
}
```

**Supported Courses:**
- **BCA** - Bachelor of Computer Applications
- **BBA** - Bachelor of Business Administration
- **BCom** - Bachelor of Commerce

### 3. **Admission Model** ⭐ (NEW)
Centralized admission application tracking.

```javascript
{
  fullName: String (required),
  email: String (unique, required),
  phone: String (unique, required),
  marks: Number (0-100, required),
  percentage: Number (auto-calculated),
  courseApplied: ObjectId (ref Course, required),
  status: String (enum: ['Pending', 'Approved', 'Rejected', 'Waitlisted']),
  address: String,
  dob: Date,
  qualifying10Marks: Number,
  qualifying12Marks: Number,
  documentVerified: Boolean (default: false),
  admittedDate: Date,
  notes: String,
  createdAt: Date,
  updatedAt: Date
}
```

### 4. **Placement Model** ⭐ (ENHANCED)
Course-level placement tracking with auto-calculated statistics.

```javascript
{
  course: ObjectId (ref Course, required),
  academicYear: String (required),
  totalStudents: Number (required),
  placedStudents: Number (required),
  placementPercentage: Number (auto-calculated),
  highestPackage: Number (LPA),
  averagePackage: Number (LPA),
  lowestPackage: Number (LPA),
  companies: [
    {
      companyName: String,
      position: String,
      ctcOffered: Number,
      studentCount: Number,
      joiningDate: Date
    }
  ],
  students: [
    {
      studentId: ObjectId (ref Student),
      companyName: String,
      position: String,
      salary: Number,
      joiningDate: Date,
      status: String (enum: ['Placed', 'Not Placed'])
    }
  ],
  remarks: String,
  createdAt: Date,
  updatedAt: Date
}
```

### 5. **Student Model**
Extended user profile for students.

```javascript
{
  userId: ObjectId (ref User, required),
  rollNumber: String (unique, required),
  department: String (enum: ['CSE', 'ECE', 'EEE', 'MECH', 'CIVIL', 'IT']),
  semester: Number (1-8),
  cgpa: Number (default: 0, range: 0-10),
  courses: [ObjectId refs Course],
  enrollmentDate: Date,
  isActive: Boolean
}
```

### 6. **Faculty Model**
Extended user profile for faculty members.

```javascript
{
  userId: ObjectId (ref User, required),
  employeeId: String (unique, required),
  department: String (required),
  designation: String (enum: ['Professor', 'Associate Professor', 'Assistant Professor', 'Lecturer']),
  specialization: String,
  qualification: String,
  skills: [String],
  achievements: [
    {
      title: String,
      description: String,
      date: Date,
      award: String
    }
  ],
  coursesTaught: [ObjectId refs Course],
  experience: Number (in years),
  joinDate: Date
}
```

### 7. **Academic Model**
Grade tracking and transcript management.

```javascript
{
  studentId: ObjectId (ref Student, required),
  courseId: ObjectId (ref Course, required),
  marks: Number (0-100),
  grade: String (A+, A, B, C, D, F - auto-calculated),
  gpa: Number (auto-calculated),
  semesterGPA: Number,
  cumulativeGPA: Number,
  recordedDate: Date
}
```

---

## 🔌 API Endpoints

### **1️⃣ Authentication API** (`/api/auth`)

#### Register User
```http
POST /api/auth/register
Content-Type: application/json

{
  "name": "John Doe",
  "email": "john@college.com",
  "password": "SecurePass@123",
  "role": "student"
}

Response: 201 Created
{
  "success": true,
  "token": "eyJhbGc...",
  "user": { id, name, email, role }
}
```

#### Login
```http
POST /api/auth/login
{
  "email": "john@college.com",
  "password": "SecurePass@123"
}

Response: 200 OK
{
  "success": true,
  "token": "eyJhbGc...",
  "user": { ... }
}
```

#### Get Current User
```http
GET /api/auth/me
Authorization: Bearer {token}

Response: 200 OK
{
  "success": true,
  "user": { ... }
}
```

---

### **2️⃣ Course Management API** (`/api/courses`) ⭐

#### Create Course (Admin Only)
```http
POST /api/courses
Authorization: Bearer {admin-token}
Content-Type: application/json

{
  "courseCode": "BCA",
  "courseName": "Bachelor of Computer Applications",
  "description": "3-year undergraduate program...",
  "duration": 3,
  "eligibility": "12th Pass with 50% marks",
  "subjects": [
    { "subject": "Programming in C", "creditHours": 4, "semester": 1 },
    { "subject": "Web Technologies", "creditHours": 4, "semester": 2 }
  ],
  "totalSeats": 60
}

Response: 201 Created
```

#### Get All Courses
```http
GET /api/courses
Response: 200 OK
{
  "success": true,
  "count": 3,
  "courses": [...]
}
```

#### Get Course by Code
```http
GET /api/courses/code/BCA
Response: 200 OK
{
  "success": true,
  "course": { ... }
}
```

#### Update Course (Admin Only)
```http
PUT /api/courses/{courseId}
Authorization: Bearer {admin-token}
{
  "courseName": "Updated Name",
  "totalSeats": 75
}

Response: 200 OK
```

#### Get Course Statistics
```http
GET /api/courses/stats
Response: 200 OK
{
  "success": true,
  "stats": {
    "totalCourses": 3,
    "activeCourses": 3,
    "bca": {...},
    "bba": {...},
    "bcom": {...}
  }
}
```

---

### **3️⃣ Admission API** (`/api/admissions`) ⭐

#### Submit Admission Application
```http
POST /api/admissions/apply
Content-Type: application/json

{
  "fullName": "Rahul Kumar",
  "email": "rahul@example.com",
  "phone": "9876543210",
  "marks": 85,
  "courseApplied": "{courseId}",
  "address": "123 Main St",
  "dob": "2005-01-15",
  "qualifying10Marks": 95,
  "qualifying12Marks": 88
}

Response: 201 Created
{
  "success": true,
  "message": "Admission application submitted successfully",
  "admission": { ... }
}
```

#### Get All Admissions (Admin Only)
```http
GET /api/admissions/all
Authorization: Bearer {admin-token}

Response: 200 OK
{
  "success": true,
  "count": 45,
  "admissions": [...]
}
```

#### Get Admissions by Status (Admin Only)
```http
GET /api/admissions/status/Pending
Authorization: Bearer {admin-token}

Status Options: Pending, Approved, Rejected, Waitlisted
```

#### Get Admissions by Course (Admin Only)
```http
GET /api/admissions/course/{courseId}
Authorization: Bearer {admin-token}
```

#### Update Admission Status (Admin Only)
```http
PUT /api/admissions/{admissionId}/status
Authorization: Bearer {admin-token}

{
  "status": "Approved",
  "notes": "All documents verified"
}

Response: 200 OK
```

#### Verify Documents (Admin Only)
```http
PUT /api/admissions/{admissionId}/verify
Authorization: Bearer {admin-token}

Response: 200 OK
{
  "success": true,
  "message": "Documents verified",
  "admission": { documentVerified: true }
}
```

#### Get Admission Statistics (Admin Only)
```http
GET /api/admissions/stats
Authorization: Bearer {admin-token}

Response: 200 OK
{
  "success": true,
  "stats": {
    "totalApplications": 150,
    "approved": 95,
    "rejected": 20,
    "pending": 35,
    "waitlisted": 10,
    "documentVerified": 85,
    "averageMarks": 78.5
  }
}
```

---

### **4️⃣ Placement API** (`/api/placements`) ⭐

#### Create Placement Record (Admin Only)
```http
POST /api/placements
Authorization: Bearer {admin-token}

{
  "course": "{courseId}",
  "academicYear": "2026",
  "totalStudents": 60,
  "placedStudents": 54,
  "highestPackage": 12.5,
  "averagePackage": 8.75,
  "lowestPackage": 5.5,
  "companies": [
    {
      "companyName": "Infosys",
      "position": "System Engineer",
      "ctcOffered": 10,
      "studentCount": 8,
      "joiningDate": "2026-07-01"
    }
  ]
}

Response: 201 Created
```

#### Get All Placements
```http
GET /api/placements
Response: 200 OK
{
  "success": true,
  "count": 6,
  "placements": [...]
}
```

#### Get Placements by Course
```http
GET /api/placements/course/{courseId}
Response: 200 OK
```

#### Get Placements by Year
```http
GET /api/placements/year/2026
Response: 200 OK
```

#### Get Placement Statistics
```http
GET /api/placements/stats
Response: 200 OK
{
  "success": true,
  "stats": {
    "totalCourses": 3,
    "totalStudentsAcrossCourses": 200,
    "totalPlacedStudents": 185,
    "overallPlacementPercentage": 92.5,
    "highestPackageOverall": 15.5,
    "uniqueCompanies": 32
  }
}
```

#### Get Top Companies
```http
GET /api/placements/companies
Response: 200 OK
{
  "success": true,
  "count": 10,
  "companies": [...]
}
```

#### Update Placement (Admin Only)
```http
PUT /api/placements/{placementId}
Authorization: Bearer {admin-token}

{
  "placedStudents": 56,
  "highestPackage": 13.2
}
```

---

### **5️⃣ Student API** (`/api/students`)

#### Get Student Profile
```http
GET /api/students/profile
Authorization: Bearer {student-token}

Response: 200 OK
```

#### Update Student Profile
```http
PUT /api/students/profile
Authorization: Bearer {student-token}

{
  "phone": "9876543210",
  "address": "New Address"
}
```

#### Get Student Academics
```http
GET /api/students/academics
Authorization: Bearer {student-token}
```

#### Enroll in Course
```http
POST /api/students/enroll
Authorization: Bearer {student-token}

{
  "courseId": "{courseId}"
}
```

---

### **6️⃣ Faculty API** (`/api/faculty`)

#### Get All Faculty
```http
GET /api/faculty
Response: 200 OK
```

#### Get Faculty Profile
```http
GET /api/faculty/profile
Authorization: Bearer {faculty-token}
```

#### Add Skill
```http
POST /api/faculty/skills
Authorization: Bearer {faculty-token}

{
  "skill": "Python, Django"
}
```

#### Add Achievement
```http
POST /api/faculty/achievements
Authorization: Bearer {faculty-token}

{
  "title": "Best Teacher Award",
  "description": "Awarded for excellence in teaching",
  "award": "College Excellence Award"
}
```

---

### **7️⃣ Academic API** (`/api/academics`)

#### Record Grades
```http
POST /api/academics/record
Authorization: Bearer {faculty-token}

{
  "studentId": "{studentId}",
  "courseId": "{courseId}",
  "marks": 85
}
```

#### Get Student Transcript
```http
GET /api/academics/transcript/{studentId}
Response: 200 OK
```

#### Get CGPA
```http
GET /api/academics/cgpa/{studentId}
Response: 200 OK
{
  "cgpa": 8.45,
  "sem1": 8.1,
  "sem2": 8.6
}
```

---

## 🔐 Authentication

### JWT Token Usage
```javascript
// All protected routes require Authorization header:
Authorization: Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...

// Token Validity: 7 days
// After expiry: User must login again
```

### Role-Based Access Control
```
Admin:   All endpoints (full system access)
Faculty: Courses, Academics, Faculty Profile
Student: Own Profile, Academics, Courses
Public:  Course Listing, Admission Apply
```

---

## 🚀 Quick Start

### 1. Prerequisites
- Node.js v18+
- MongoDB Atlas Account
- npm or yarn

### 2. Installation
```bash
cd backend
npm install
```

### 3. Configuration (.env)
```env
PORT=5000
MONGODB_URI=mongodb+srv://username:password@cluster.mongodb.net/college_management?retryWrites=true&w=majority
JWT_SECRET=your_jwt_secret_key_here
JWT_EXPIRE=7d
NODE_ENV=production
```

### 4. Run Server
```bash
npm start
# Output: ✅ MongoDB Connected
#         🚀 Server running on port 5000
```

### 5. Test Health Check
```bash
curl http://localhost:5000/api/health
# Response: { "success": true, "message": "Server is running properly" }
```

---

## 📦 Dependencies

```json
{
  "express": "^4.18.2",
  "mongoose": "^7.0.0",
  "bcryptjs": "^2.4.3",
  "jsonwebtoken": "^9.0.0",
  "dotenv": "^16.0.3",
  "cors": "^2.8.5",
  "express-validator": "^7.0.0"
}
```

---

## 🔒 Security Features

✅ **Password Security**
- bcryptjs hashing (10 salt rounds)
- Never stored in plain text

✅ **JWT Authentication**
- 7-day token expiry
- Role-based access control
- Secure token validation

✅ **Database Security**
- Mongoose Schema validation
- Input sanitization
- Unique email & phone constraints

✅ **API Security**
- CORS enabled
- Rate limiting ready
- Error handling (no sensitive data exposed)

---

## 📊 Database Indexes

For optimal performance, the following indexes are created:

```javascript
// Course Model
- Index on courseCode (unique)
- Index on createdAt

// Admission Model
- Index on email (unique)
- Index on phone (unique)
- Index on courseApplied
- Index on status

// Placement Model
- Index on (course, academicYear)
- Index on academicYear

// User Model
- Index on email (unique)
```

---

## 🧪 Sample Test Data

### Admin Account
- **Email:** admin@college.com
- **Password:** Admin@123

### Student Test Account
- **Email:** student001@college.com
- **Password:** Student@123
- **Roll:** CSE2021001

### Faculty Test Account
- **Email:** faculty001@college.com
- **Password:** Faculty@123

---

## 📈 Scalability & Performance

✅ Modular architecture ready for microservices
✅ Database indexing for fast queries
✅ API rate limiting configurable
✅ Session management with JWT
✅ Horizontal scaling support
✅ Caching ready (Redis compatible)

---

## 🛠️ Maintenance & Deployment

### Production Deployment
1. Use environment-based configuration
2. Enable HTTPS/TLS
3. Set up MongoDB backup
4. Configure monitoring
5. Implement API logging
6. Set up error tracking (Sentry, etc.)

### Monitoring
- API response times
- Database connection health
- Error rates
- User authentication logs

---

## 📝 API Response Format

All endpoints return standardized JSON responses:

**Success Response:**
```json
{
  "success": true,
  "message": "Operation successful",
  "data": {...}
}
```

**Error Response:**
```json
{
  "success": false,
  "message": "Error description"
}
```

---

## 🤝 Support & Documentation

For API integration or technical support:
- Email: support@bellari.edu
- Phone: +91-XXXX-XXXX-XX
- GitHub: [repository-link]

---

## ✨ Production Ready Checklist

- ✅ All 7 models implemented
- ✅ All REST APIs created & tested
- ✅ JWT authentication configured
- ✅ Role-based access control
- ✅ MongoDB Atlas connection
- ✅ Error handling implemented
- ✅ Input validation on all endpoints
- ✅ CORS enabled
- ✅ Environment configuration
- ✅ Auto-calculated fields (placement %, grades, etc.)
- ✅ Database indexing
- ✅ Modular folder structure
- ✅ Security best practices
- ✅ Scalable architecture

---

*Last Updated: February 2026*
*Version: 1.0.0 (Production)*

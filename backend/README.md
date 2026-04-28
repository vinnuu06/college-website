# College Management System Backend

A complete Node.js + Express backend for college management system with MongoDB.

## Features

- **Authentication**: JWT-based authentication for Student, Faculty, and Admin roles
- **Student Management**: Student profiles, academics, course enrollment
- **Faculty Management**: Faculty profiles, skills, achievements, courses taught
- **Academic Management**: Course records, grades, GPA calculation, transcripts
- **Placement Management**: Placement records, statistics, company tracking
- **Course Management**: Course creation, enrollment, department-wise courses

## Prerequisites

- Node.js (v14 or higher)
- MongoDB (local or MongoDB Atlas)
- npm

## Installation

1. Clone or download the backend folder

2. Install dependencies:
```bash
npm install
```

3. Create a `.env` file in the backend directory:
```
PORT=5000
MONGODB_URI=mongodb://localhost:27017/college_management
JWT_SECRET=your_jwt_secret_key_change_this_in_production
JWT_EXPIRE=7d
NODE_ENV=development
```

4. Make sure MongoDB is running

## Starting the Server

Development mode (with auto-reload):
```bash
npm run dev
```

Production mode:
```bash
npm start
```

Server will run on http://localhost:5000

## API Endpoints

### Authentication
- `POST /api/auth/register` - Register new user
- `POST /api/auth/login` - Login user
- `GET /api/auth/me` - Get current user info

### Students
- `GET /api/students` - Get all students (Admin only)
- `GET /api/students/:id` - Get student profile
- `GET /api/students/:id/academics` - Get student academics
- `PUT /api/students/:id` - Update student profile
- `POST /api/students/:id/enroll/:courseId` - Enroll in course

### Faculty
- `GET /api/faculty` - Get all faculty
- `GET /api/faculty/:id` - Get faculty profile
- `GET /api/faculty/:id/skills` - Get faculty skills
- `GET /api/faculty/:id/achievements` - Get faculty achievements
- `PUT /api/faculty/:id` - Update faculty profile
- `POST /api/faculty/:id/skills` - Add skills
- `POST /api/faculty/:id/achievements` - Add achievement

### Academics
- `POST /api/academics` - Create academic record (Admin/Faculty)
- `GET /api/academics` - Get all academics (Admin only)
- `GET /api/academics/transcript/:studentId` - Get student transcript
- `PUT /api/academics/:id` - Update academic record
- `GET /api/academics/semester/:semester` - Get students by semester

### Placements
- `POST /api/placements` - Create placement (Admin)
- `GET /api/placements` - Get all placements
- `GET /api/placements/stats/overview` - Get placement statistics
- `GET /api/placements/student/:studentId` - Get student placement
- `PUT /api/placements/:id` - Update placement
- `GET /api/placements/year/:academicYear` - Get placements by year

### Courses
- `POST /api/courses` - Create course (Admin/Faculty)
- `GET /api/courses` - Get all courses
- `GET /api/courses/:id` - Get course details
- `PUT /api/courses/:id` - Update course
- `GET /api/courses/department/:department` - Get courses by department

## Frontend Integration

1. Include the API module in your HTML:
```html
<script src="/js/api.js"></script>
```

2. Use the APIs in your JavaScript:

### Login Example
```javascript
// Login
const result = await API.auth.login('student@email.com', 'password123');
if (result.success) {
  console.log('Logged in:', result.user);
}
```

### Get Student Profile
```javascript
const userId = 'user_id_here';
const profile = await API.student.getProfile(userId);
console.log(profile);
```

### Get Faculty Achievements
```javascript
const userId = 'faculty_id_here';
const achievements = await API.faculty.getAchievements(userId);
console.log(achievements);
```

### Get Placement Statistics
```javascript
const stats = await API.placement.getStats();
console.log(stats);
```

### Get Student Academics
```javascript
const userId = 'student_id_here';
const academics = await API.student.getAcademics(userId);
console.log(academics);
```

## Testing the API

You can use Postman or curl to test the APIs:

### Register a Student
```bash
curl -X POST http://localhost:5000/api/auth/register \
  -H "Content-Type: application/json" \
  -d '{
    "name": "John Doe",
    "email": "john@college.com",
    "password": "password123",
    "role": "student",
    "phone": "9999999999",
    "rollNumber": "CSE001",
    "department": "CSE",
    "semester": 1
  }'
```

### Login
```bash
curl -X POST http://localhost:5000/api/auth/login \
  -H "Content-Type: application/json" \
  -d '{
    "email": "john@college.com",
    "password": "password123"
  }'
```

### Register a Faculty
```bash
curl -X POST http://localhost:5000/api/auth/register \
  -H "Content-Type: application/json" \
  -d '{
    "name": "Dr. Jane Smith",
    "email": "jane@college.com",
    "password": "password123",
    "role": "faculty",
    "phone": "8888888888",
    "employeeId": "FAC001",
    "department": "CSE",
    "designation": "Associate Professor"
  }'
```

## Database Models

### User
- name, email, password (hashed), role, phone, address, createdAt

### Student
- userId, rollNumber, department, semester, cgpa, courses, enrollmentDate, isActive

### Faculty
- userId, employeeId, department, designation, specialization, skills, achievements, coursesTaught

### Admin
- userId, adminType, department, permissions, joinDate

### Course
- courseCode, courseName, description, credits, semester, department, instructor, students

### Academic
- studentId, semester, courseId, marks (internals, externals, total), grade, academicYear

### Placement
- companyName, position, salary, studentId, placementDate, status, joiningDate

## Error Handling

All API responses follow this format:

Success:
```json
{
  "success": true,
  "data": { ... }
}
```

Error:
```json
{
  "success": false,
  "message": "Error description"
}
```

## Security

- Passwords are hashed using bcryptjs
- JWT tokens are used for authentication
- Role-based access control (RBAC) is implemented
- Sensitive data is protected with middleware

## Future Enhancements

- File upload for documents
- Email notifications
- Dashboard analytics
- Advanced reporting
- Attendance tracking
- Exam management
- Library management

## Support

For issues or questions, please contact the development team.

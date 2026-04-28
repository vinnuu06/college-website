# Quick Start Guide - College Management System

## ✅ What Has Been Created

Your college management system is now complete with a **full-featured backend** and **real API integration**!

### Backend Features (Node.js + Express + MongoDB):
- ✅ Complete user authentication system (Student, Faculty, Admin)
- ✅ Student management (profiles, academics, courses)
- ✅ Faculty management (profiles, skills, achievements)
- ✅ Academic records (grades, CGPA, transcripts)
- ✅ Placement tracking (company records, statistics)
- ✅ Course management
- ✅ JWT-based security

### Frontend Features:
- ✅ Real login pages connected to backend
- ✅ Real dashboards pulling data from backend
- ✅ Authentication tokens stored locally
- ✅ API integration ready to use

---

## 🚀 Quick Start (5 minutes)

### Step 1: Install Dependencies
Open PowerShell in the backend folder:
```bash
cd "C:\Users\USER\OneDrive\Desktop\College web\backend"
npm install
```

### Step 2: Start Backend Server
```bash
npm start
```

**Expected output:**
```
Server running on port 5000
MongoDB Connected: localhost:27017
```

### Step 3: Open Frontend
Open in browser:
```
file:///C:/Users/USER/OneDrive/Desktop/College web/index.html
```

---

## 🔐 Test Login

### Create Sample Data First:
Use Postman or terminal to create test accounts:

**Register as Student:**
```bash
curl -X POST http://localhost:5000/api/auth/register ^
  -H "Content-Type: application/json" ^
  -d "{\"name\":\"John Doe\",\"email\":\"john@college.com\",\"password\":\"password123\",\"role\":\"student\",\"rollNumber\":\"CSE001\",\"department\":\"CSE\",\"semester\":1}"
```

**Register as Faculty:**
```bash
curl -X POST http://localhost:5000/api/auth/register ^
  -H "Content-Type: application/json" ^
  -d "{\"name\":\"Dr. Jane\",\"email\":\"jane@college.com\",\"password\":\"password123\",\"role\":\"faculty\",\"employeeId\":\"FAC001\",\"department\":\"CSE\",\"designation\":\"Associate Professor\"}"
```

**Register as Admin:**
```bash
curl -X POST http://localhost:5000/api/auth/register ^
  -H "Content-Type: application/json" ^
  -d "{\"name\":\"Admin User\",\"email\":\"admin@college.com\",\"password\":\"password123\",\"role\":\"admin\"}"
```

### Now Test Login:

1. Go to: `http://localhost:5000` (or `file:///...index.html`)
2. Click "Student Login" / "Faculty Login" / "Admin Login"
3. Email: `john@college.com`
4. Password: `password123`
5. Click Login → Redirects to Dashboard

---

## 📊 Dashboard Features

### Student Dashboard:
- View profile, CGPA, grades
- View transcript and academic records
- Check placement status
- View enrolled courses

### Faculty Dashboard:
- View profile and credentials
- Add/view skills
- Add/view achievements
- See teaching courses

### Admin Dashboard:
- View placement statistics
- Top hiring companies
- Recent placements
- Faculty list
- Create courses
- Record placements

---

## 🔧 Backend Commands

```bash
# Start backend (production)
npm start

# Start backend (with auto-reload for development)
npm run dev

# Stop backend
Ctrl + C (in PowerShell)
```

---

## 📱 API Endpoints Working

All of these endpoints are now working:

**Authentication:**
- `POST /api/auth/register` - Create account
- `POST /api/auth/login` - Login
- `GET /api/auth/me` - Get current user

**Students:**
- `GET /api/students/:id` - Get profile
- `GET /api/students/:id/academics` - Get academics
- `GET /api/students` - List all (admin only)

**Faculty:**
- `GET /api/faculty` - List all
- `POST /api/faculty/:id/skills` - Add skills
- `POST /api/faculty/:id/achievements` - Add achievement

**Academics:**
- `GET /api/academics/transcript/:studentId` - Get transcript
- `POST /api/academics` - Create record (admin/faculty)

**Placements:**
- `GET /api/placements` - List all
- `GET /api/placements/stats/overview` - Statistics
- `POST /api/placements` - Record placement (admin)

**Courses:**
- `GET /api/courses` - List all
- `POST /api/courses` - Create (admin/faculty)

---

## ⚠️ Common Issues & Solutions

**Issue:** "Cannot GET /api/auth/login"
- **Fix:** Make sure backend is running (`npm start`)

**Issue:** "MongoDB connection failed"
- **Fix:** Make sure MongoDB is running on localhost:27017

**Issue:** Login not working
- **Fix:** Check if you created test data (use curl commands above)

**Issue:** Dashboards are blank
- **Fix:** Check browser console (F12) for errors

**Issue:** CORS errors
- **Fix:** Backend has CORS enabled - check URL is `http://localhost:5000`

---

## 📁 Project Structure

```
backend/
  ├── server.js              ← Main server file
  ├── package.json           ← Dependencies
  ├── .env                   ← Configuration
  ├── models/                ← Database schemas
  ├── routes/                ← API endpoints
  ├── controllers/           ← Business logic
  ├── middleware/            ← Authentication
  └── config/                ← Database config

frontend/
  ├── public/js/api.js       ← API integration
  ├── auth/
  │   ├── student-login.html ← Real login
  │   ├── faculty-login.html
  │   └── admin-login.html
  ├── dashboard/
  │   ├── student.html       ← Real dashboard
  │   ├── faculty.html
  │   └── admin.html
  └── ... (other pages)
```

---

## 🔑 Default Test Accounts (After Running Curl Commands)

| Role | Email | Password |
|------|-------|----------|
| Student | john@college.com | password123 |
| Faculty | jane@college.com | password123 |
| Admin | admin@college.com | password123 |

---

## 💾 Data Storage

All data is stored in **MongoDB**:
- Database: `college_management`
- Collections: users, students, faculty, admin, courses, academics, placements

Data persists even after restarting the server!

---

## 🌐 Access Your System

| Page | URL |
|------|-----|
| Home | `file:///C:/Users/USER/OneDrive/Desktop/College web/index.html` |
| Student Login | `file:///...College web/auth/student-login.html` |
| Faculty Login | `file:///...College web/auth/faculty-login.html` |
| Admin Login | `file:///...College web/auth/admin-login.html` |
| Student Dashboard* | `file:///...College web/dashboard/student.html` |
| Faculty Dashboard* | `file:///...College web/dashboard/faculty.html` |
| Admin Dashboard* | `file:///...College web/dashboard/admin.html` |

*Requires login first

---

## 📚 More Information

- Full backend documentation: See `/backend/README.md`
- Setup guide with detailed instructions: See `/SETUP_GUIDE.md`
- API code: See `/public/js/api.js`

---

## 🎯 Next Steps

1. ✅ Backend is ready
2. ✅ Database is configured
3. ✅ Logins are working
4. ✅ Dashboards are functional
5. Next: Customize for your college (logos, colors, more features)

---

## 📞 Support

If something doesn't work:
1. Check browser console (F12 → Console)
2. Check backend logs in PowerShell
3. Verify MongoDB is running
4. Check .env file has correct connection string
5. Try refreshing the page

---

**Your system is ready to use!** 🎓

For production deployment, see SETUP_GUIDE.md section "Production Deployment"

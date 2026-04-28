# College Management System - Complete Setup Guide

## Project Structure

```
College web/
├── backend/                 # Node.js Express Backend
│   ├── config/
│   │   └── database.js      # MongoDB connection
│   ├── controllers/         # Business logic
│   ├── middleware/          # Authentication
│   ├── models/              # Database schemas
│   ├── routes/              # API endpoints
│   ├── .env                 # Environment variables
│   ├── .gitignore
│   ├── package.json
│   ├── server.js            # Main server file
│   └── README.md            # Backend documentation
│
├── frontend/                # HTML/CSS/JS Frontend
│   ├── public/
│   │   ├── css/
│   │   │   └── theme.css
│   │   └── js/
│   │       ├── api.js       # Backend API integration
│   │       ├── main.js
│   │       └── three-bg.js
│   ├── auth/
│   │   ├── admin-login.html
│   │   ├── faculty-login.html
│   │   └── student-login.html
│   ├── dashboard/
│   │   ├── admin.html
│   │   ├── faculty.html
│   │   └── student.html
│   ├── index.html
│   ├── about.html
│   ├── courses.html
│   └── ... (other pages)
```

## Installation Steps

### Step 1: Install Node.js and MongoDB

**Node.js:**
- Download from https://nodejs.org/ (LTS version recommended)
- Install and verify: `node --version` and `npm --version`

**MongoDB:**
- **Option A: Local MongoDB**
  - Download from https://www.mongodb.com/try/download/community
  - Install and start MongoDB service
  
- **Option B: MongoDB Atlas (Cloud)**
  - Go to https://www.mongodb.com/cloud/atlas
  - Create free account
  - Create a cluster and get connection string

### Step 2: Setup Backend

1. Open PowerShell/Command Prompt
2. Navigate to backend folder:
   ```bash
   cd "C:\Users\USER\OneDrive\Desktop\College web\backend"
   ```

3. Install dependencies:
   ```bash
   npm install
   ```

4. Configure `.env` file:
   - If using **Local MongoDB**:
     ```
     PORT=5000
     MONGODB_URI=mongodb://localhost:27017/college_management
     JWT_SECRET=your_jwt_secret_key_change_this_in_production
     JWT_EXPIRE=7d
     NODE_ENV=development
     ```
   
   - If using **MongoDB Atlas**:
     ```
     PORT=5000
     MONGODB_URI=mongodb+srv://username:password@cluster-name.mongodb.net/college_management?retryWrites=true&w=majority
     JWT_SECRET=your_jwt_secret_key_change_this_in_production
     JWT_EXPIRE=7d
     NODE_ENV=development
     ```

### Step 3: Start Backend Server

Run in PowerShell from the backend folder:

```bash
npm start
```

or for development with auto-reload:

```bash
npm run dev
```

You should see: `Server running on port 5000`

### Step 4: Setup Frontend

The frontend is already configured to connect to your backend. Make sure your HTML files include the API module:

```html
<script src="/public/js/api.js"></script>
```

### Step 5: Open Frontend

1. Open your web browser
2. Navigate to: `file:///C:/Users/USER/OneDrive/Desktop/College web/index.html`

Or use VS Code's Live Server extension (recommended)

## API Testing

### Test Login Endpoints

**Student Login:**
```bash
curl -X POST http://localhost:5000/api/auth/login \
  -H "Content-Type: application/json" \
  -d '{"email":"student@email.com","password":"password123"}'
```

**Faculty Login:**
```bash
curl -X POST http://localhost:5000/api/auth/login \
  -H "Content-Type: application/json" \
  -d '{"email":"faculty@email.com","password":"password123"}'
```

**Admin Login:**
```bash
curl -X POST http://localhost:5000/api/auth/login \
  -H "Content-Type: application/json" \
  -d '{"email":"admin@email.com","password":"password123"}'
```

### Create Sample Data

#### Register a Student:
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

#### Register Faculty:
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

## Using Postman for API Testing

1. Download Postman: https://www.postman.com/downloads/
2. Create a new request
3. Set method to POST
4. URL: `http://localhost:5000/api/auth/login`
5. Headers: Add `Content-Type: application/json`
6. Body (raw JSON):
   ```json
   {
     "email": "student@college.com",
     "password": "password123"
   }
   ```
7. Click Send

## Frontend Integration Examples

### In HTML File:

```html
<!DOCTYPE html>
<html>
<head>
    <script src="/public/js/api.js"></script>
</head>
<body>
    <button onclick="testLogin()">Test Login</button>
    
    <script>
        async function testLogin() {
            try {
                const result = await API.auth.login('student@college.com', 'password123');
                console.log('Login successful:', result);
                console.log('Token:', localStorage.getItem('token'));
                console.log('User:', API.auth.getUser());
            } catch (error) {
                console.error('Login failed:', error);
            }
        }
    </script>
</body>
</html>
```

### Check if User is Logged In:

```javascript
const user = getUser();
if (user) {
    console.log('Logged in as:', user.name);
} else {
    console.log('Not logged in');
    window.location.href = '/auth/student-login.html';
}
```

### Get Student Profile:

```javascript
const userId = getUser().id;
const profile = await API.student.getProfile(userId);
console.log(profile);
```

### Get Placement Statistics:

```javascript
const stats = await API.placement.getStats();
console.log('Placement Rate:', stats.stats.placementRate);
console.log('Average Salary:', stats.stats.avgSalary);
console.log('Top Companies:', stats.stats.topCompanies);
```

## Common Issues and Solutions

### Issue: "Cannot GET /api/auth/login"
- **Solution**: Make sure backend server is running (`npm start`)

### Issue: "MongoDB connection failed"
- **Solution**: 
  - Check MongoDB is running
  - Verify MongoDB connection string in `.env`
  - For MongoDB Atlas, check IP whitelist settings

### Issue: "CORS error" or "No 'Access-Control-Allow-Origin' header"
- **Solution**: Backend has CORS enabled, but make sure you're accessing from correct domain

### Issue: "Token invalid" or "Unauthorized"
- **Solution**: Token might be expired. Login again to get new token.

### Issue: Frontend not connecting to backend
- **Solution**: 
  - Backend must be running on `http://localhost:5000`
  - Check browser console for errors
  - Verify `api.js` is included in HTML

## Security Recommendations

1. **Change JWT Secret**: In `.env`, change `JWT_SECRET` to a strong random string
   ```
   JWT_SECRET=your_super_secret_key_123_change_this
   ```

2. **Environment Variables**: Never commit `.env` to git

3. **Password Hashing**: Passwords are automatically hashed using bcryptjs

4. **HTTPS**: In production, use HTTPS instead of HTTP

5. **Database**: Keep MongoDB credentials secure

## Production Deployment

### Before Going Live:

1. Set `NODE_ENV=production` in `.env`
2. Use strong `JWT_SECRET`
3. Use MongoDB Atlas or managed MongoDB service
4. Enable HTTPS
5. Set up proper error logging
6. Configure firewall rules

### Deploy Backend:

Options:
- **Heroku**: Free tier available
- **Railway**: Modern alternative to Heroku
- **AWS**: More control and features
- **DigitalOcean**: Good balance of price and features

## Database Backups

Regular backups are important:

```bash
# Export all data
mongodump --uri="mongodb://localhost:27017/college_management"

# Import data
mongorestore --uri="mongodb://localhost:27017/college_management" dump/college_management
```

## Additional Resources

- **Express.js**: https://expressjs.com/
- **MongoDB**: https://docs.mongodb.com/
- **JWT**: https://jwt.io/
- **bcryptjs**: https://github.com/dcodeIO/bcrypt.js

## Support

If you encounter issues:

1. Check browser console (F12 → Console tab)
2. Check backend logs in terminal
3. Verify all connection strings
4. Make sure MongoDB is running
5. Check that ports are not blocked

## Next Steps

1. Follow installation steps above
2. Start the backend server
3. Test with sample data
4. Integrate with your frontend pages
5. Customize as needed for your college

---

**Good luck with your project!** 🎓

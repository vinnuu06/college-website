// Load dotenv first, before any other modules
require('dotenv').config({ path: __dirname + '/.env' });

const express = require('express');
const cors = require('cors');
const mongoose = require('mongoose');
const { requestLogger, securityHeaders, rateLimit, responseTime } = require('./middleware/security');

const app = express();

/* ================================
   DATABASE CONNECTION
================================ */

// DEBUG: Print environment variables
console.log('========== DEBUG INFO ==========');
console.log('NODE_ENV:', process.env.NODE_ENV);
console.log('PORT:', process.env.PORT);
console.log('MONGODB_URI:', process.env.MONGODB_URI);
console.log('================================\n');

// Check if MONGODB_URI is defined
if (!process.env.MONGODB_URI) {
    console.error('❌ MONGODB_URI is not defined in environment variables');
    console.error('Please ensure your .env file contains MONGODB_URI');
    process.exit(1);
}

mongoose.connect(process.env.MONGODB_URI, {
    useNewUrlParser: true,
    useUnifiedTopology: true,
})
.then((conn) => {
    console.log('✅ MongoDB Connected Successfully');
    console.log(`   Host: ${conn.connection.host}`);
    console.log(`   Database: ${conn.connection.name}`);
    
    // Start server only after successful database connection
    startServer();
})
.catch((err) => {
    // Log detailed MongoDB error information
    console.error('❌ MongoDB Connection Failed:');
    console.error(`   Error Name: ${err.name}`);
    console.error(`   Error Message: ${err.message}`);
    
    if (err.message.includes('bad auth')) {
        console.error('   Possible causes:');
        console.error('     - Invalid username or password');
        console.error('     - Password contains special characters that need URL encoding');
        console.error('     - IP address not whitelisted in MongoDB Atlas');
        console.error('     - Database name in connection string is incorrect (should be "college_management")');
    }
    
    if (err.message.includes('ENOTFOUND')) {
        console.error('   Possible causes:');
        console.error('     - Invalid MongoDB Atlas hostname');
        console.error('     - DNS resolution issue');
        console.error('     - Check if MONGODB_URI in .env has the correct cluster hostname');
    }
    
    if (err.code) {
        console.error(`   Error Code: ${err.code}`);
    }
    
    process.exit(1); // Stop server if DB fails
});

/* ================================
   START SERVER FUNCTION
   Called only after successful database connection
================================ */

const startServer = () => {
    /* ================================
       MIDDLEWARE
    ================================ */

    // Security
    app.use(securityHeaders);
    app.use(responseTime);
    app.use(requestLogger);

    // CORS — allow all origins for development
    app.use(cors({
        origin: '*',
        methods: ['GET', 'POST', 'PUT', 'DELETE', 'PATCH'],
        allowedHeaders: ['Content-Type', 'Authorization']
    }));

    // Body parsing
    app.use(express.json({ limit: '10mb' }));
    app.use(express.urlencoded({ extended: true, limit: '10mb' }));

    // Serve Static Files
    const path = require('path');
    app.use('/uploads', express.static(path.join(__dirname, 'uploads')));

    // Rate limiting for auth routes - TEMPORARILY DISABLED FOR DEBUGGING
    // app.use('/api/auth', rateLimit(15 * 60 * 1000, 30));
    app.use('/api/contact', rateLimit(15 * 60 * 1000, 10));

    /* ================================
       ROUTES
    ================================ */

    // Core routes
    app.use('/api/auth', require('./routes/authRoutes'));
    app.use('/api/students', require('./routes/studentRoutes'));
    app.use('/api/faculty', require('./routes/facultyRoutes'));
    app.use('/api/academics', require('./routes/academicRoutes'));
    app.use('/api/placements', require('./routes/placementRoutes'));
    app.use('/api/courses', require('./routes/courseRoutes'));
    app.use('/api/admissions', require('./routes/admissionRoutes'));

    // New routes
    app.use('/api/dashboard', require('./routes/dashboardRoutes'));
    app.use('/api/notifications', require('./routes/notificationRoutes'));
    app.use('/api/events', require('./routes/eventRoutes'));
    app.use('/api/contact', require('./routes/contactRoutes'));
    app.use('/api/upload', require('./routes/uploadRoutes'));
    app.use('/api/attendance', require('./routes/attendanceRoutes'));
    app.use('/api/search', require('./routes/searchRoutes'));
    app.use('/api/exams', require('./routes/examRoutes'));
    app.use('/api/payment', require('./routes/paymentRoutes'));
    app.use('/api/library', require('./routes/libraryRoutes'));

    /* ================================
       HEALTH CHECK
    ================================ */

    app.get('/api/health', (req, res) => {
        res.status(200).json({
            success: true,
            message: 'Bellari Business College API is running',
            version: '2.0.0',
            timestamp: new Date().toISOString(),
            uptime: process.uptime(),
            endpoints: {
                auth: '/api/auth',
                students: '/api/students',
                faculty: '/api/faculty',
                academics: '/api/academics',
                placements: '/api/placements',
                courses: '/api/courses',
                admissions: '/api/admissions',
                dashboard: '/api/dashboard',
                notifications: '/api/notifications',
                events: '/api/events',
                contact: '/api/contact',
                upload: '/api/upload',
                attendance: '/api/attendance',
                search: '/api/search',
                exams: '/api/exams',
                payment: '/api/payment',
                library: '/api/library'
            }
        });
    });

    /* ================================
       404 HANDLER
    ================================ */

    app.use((req, res) => {
        res.status(404).json({
            success: false,
            message: `Route not found: ${req.method} ${req.originalUrl}`
        });
    });

    /* ================================
       GLOBAL ERROR HANDLER
    ================================ */

    app.use((err, req, res, next) => {
        console.error('🔥 Error:', err.stack);

        // Mongoose validation error
        if (err.name === 'ValidationError') {
            const messages = Object.values(err.errors).map(val => val.message);
            return res.status(400).json({
                success: false,
                message: 'Validation Error',
                errors: messages
            });
        }

        // Mongoose duplicate key error
        if (err.code === 11000) {
            const field = Object.keys(err.keyValue)[0];
            return res.status(400).json({
                success: false,
                message: `Duplicate value for field: ${field}`
            });
        }

        // JWT error
        if (err.name === 'JsonWebTokenError') {
            return res.status(401).json({
                success: false,
                message: 'Invalid token'
            });
        }

        // JWT expired
        if (err.name === 'TokenExpiredError') {
            return res.status(401).json({
                success: false,
                message: 'Token expired'
            });
        }

        res.status(err.status || 500).json({
            success: false,
            message: err.message || 'Internal Server Error'
        });
    });

    /* ================================
       SERVER START
    ================================ */

    const PORT = process.env.PORT || 5000;
    const server = require('http').createServer(app);
    const io = require('socket.io')(server, {
        cors: {
            origin: "*",
            methods: ["GET", "POST"]
        }
    });

    // Socket.io Connection Logic
    io.on('connection', (socket) => {
        console.log('🔌 New Client Connected:', socket.id);

        // Join a private room for the user
        socket.on('join', (userId) => {
            if (userId) {
                socket.join(userId.toString());
                console.log(`👤 User ${userId} joined their private room`);
            }
        });

        socket.on('disconnect', () => {
            console.log('🔌 Client Disconnected');
        });
    });

    // Make io accessible to routes
    app.set('io', io);

    server.listen(PORT, () => {
        console.log('\n🚀 ========================================');
        console.log(`   Bellari Business College API v2.0`);
        console.log(`   Server running on port ${PORT}`);
        console.log(`   Environment: ${process.env.NODE_ENV}`);
        console.log('   ========================================\n');
        console.log('📡 API Endpoints:');
        console.log(`   Health:        http://localhost:${PORT}/api/health`);
        console.log(`   Auth:          http://localhost:${PORT}/api/auth`);
        console.log(`   Students:      http://localhost:${PORT}/api/students`);
        console.log(`   Faculty:       http://localhost:${PORT}/api/faculty`);
        console.log(`   Courses:       http://localhost:${PORT}/api/courses`);
        console.log(`   Academics:     http://localhost:${PORT}/api/academics`);
        console.log(`   Placements:    http://localhost:${PORT}/api/placements`);
        console.log(`   Admissions:    http://localhost:${PORT}/api/admissions`);
        console.log(`   Dashboard:     http://localhost:${PORT}/api/dashboard`);
        console.log(`   Notifications: http://localhost:${PORT}/api/notifications`);
        console.log(`   Events:        http://localhost:${PORT}/api/events`);
        console.log(`   Contact:       http://localhost:${PORT}/api/contact`);
        console.log('');
    });
};

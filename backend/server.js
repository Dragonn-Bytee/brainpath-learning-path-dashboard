    import express from 'express';
import mongoose from 'mongoose';
import cors from 'cors';
import dotenv from 'dotenv';
import helmet from 'helmet';
import mongoSanitize from 'express-mongo-sanitize';
import rateLimit from 'express-rate-limit';

import coursesRoutes from './routes/courses.js';
import enrollRoutes from './routes/enroll.js';
import progressRoutes from './routes/progress.js';
import dashboardRoutes from './routes/dashboard.js';
import authRoutes from './routes/auth.js';
import profileRoutes from './routes/profile.js';
import authMiddleware from './middleware/auth.js';

import fs from 'fs';
import path from 'path';

dotenv.config();
if (fs.existsSync('.env.local')) {
    try {
        const envConfig = dotenv.parse(fs.readFileSync('.env.local'));
        for (const k in envConfig) {
            process.env[k] = envConfig[k];
        }
    } catch (err) {
        console.warn('Failed to load .env.local:', err.message);
    }
}

const app = express();
const PORT = process.env.PORT || 5000;

// CORS Middleware should be first
app.use(cors({
    origin: [
        process.env.FRONTEND_URL,
        'https://brainpath-learning-path-dashboard.vercel.app', 
        'http://localhost:5173', 
        'http://localhost:3000'
    ].filter(Boolean),
    methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
    allowedHeaders: ['Content-Type', 'Authorization'],
    credentials: true
}));

// Middleware
app.use(express.json({ limit: '5mb' }));

// Security Middlewares
app.use(helmet({
    crossOriginResourcePolicy: false,
})); // Set security HTTP headers and allow cross-origin resources
// app.use(mongoSanitize()); // Prevent NoSQL injection attacks

// Rate Limiting to prevent brute-force attacks
const limiter = rateLimit({
    windowMs: 15 * 60 * 1000, // 15 minutes
    max: 100, // Limit each IP to 100 requests per `window` (here, per 15 minutes)
    message: 'Too many requests from this IP, please try again later.'
});
app.use('/api', limiter);

// Routes
app.use('/api/auth', authRoutes);
app.use('/api/courses', coursesRoutes);
app.use('/api/enroll', authMiddleware, enrollRoutes);
app.use('/api/progress', authMiddleware, progressRoutes);
app.use('/api/dashboard', authMiddleware, dashboardRoutes);
app.use('/api/profile', authMiddleware, profileRoutes);

// Global Error Handler to ensure API always returns JSON instead of HTML
app.use((err, req, res, next) => {
    console.error('Unhandled Error:', err);
    res.status(err.status || 500).json({
        error: 'Internal Server Error',
        message: err.message
    });
});

// Database connection
// Database connection
const mongoURI = process.env.MONGODB_URI;

const startServer = async () => {
    if (!mongoURI) {
        console.error('FATAL ERROR: MONGODB_URI is not defined in the environment variables.');
        process.exit(1);
    }

    try {
        console.log('Connecting to MongoDB...');
        // Disable strictQuery to avoid warnings in Mongoose 7+
        mongoose.set('strictQuery', false); 
        
        await mongoose.connect(mongoURI, {
            serverSelectionTimeoutMS: 5000,
            socketTimeoutMS: 45000,
        });
        
        console.log(`MongoDB connected successfully. State: ${mongoose.connection.readyState}`);
        
        app.listen(PORT, () => {
            console.log(`Server running on port ${PORT}`);
        });
    } catch (err) {
        console.error('MongoDB connection error:', err);
        process.exit(1);
    }
};

startServer();

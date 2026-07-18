import mongoose from 'mongoose';
import dotenv from 'dotenv';

dotenv.config();

const mongoURI = process.env.MONGODB_URI;

console.log('Attempting to connect to MongoDB...');
console.log('URI being used:', mongoURI.replace(/\/\/.*@/, '//<credentials>@')); // Hide credentials for safety

mongoose.connect(mongoURI)
    .then(() => {
        console.log('🎉 MongoDB connected successfully!');
        process.exit(0);
    })
    .catch(err => {
        console.error('❌ MongoDB connection error:', err);
        process.exit(1);
    });

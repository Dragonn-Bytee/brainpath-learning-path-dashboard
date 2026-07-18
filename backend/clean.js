import mongoose from 'mongoose';
import User from './models/User.js';

import dotenv from 'dotenv';
dotenv.config();

const mongoURI = process.env.MONGODB_URI;

mongoose.connect(mongoURI)
    .then(async () => {
        await User.deleteOne({ email: 'kathuriaudit7@gmail.com' });
        console.log('Test user deleted');
        process.exit(0);
    })
    .catch(err => {
        console.error(err);
        process.exit(1);
    });

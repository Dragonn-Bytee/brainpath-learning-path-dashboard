import mongoose from 'mongoose';
import User from './models/User.js';

const mongoURI = "mongodb+srv://kathuriaudit7_db_user:250401%40%40@learningpathdashboard.iscy74m.mongodb.net/learningdash?appName=learningpathdashboard";

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

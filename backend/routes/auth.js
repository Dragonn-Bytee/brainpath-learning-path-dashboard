import express from 'express';
import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';
import mongoose from 'mongoose';
import User from '../models/User.js';

const router = express.Router();

// Register a new user
router.post('/register', async (req, res) => {
    const { name, email, password } = req.body;

    if (!name || !email || !password) {
        return res.status(400).json({ msg: 'Please enter all fields' });
    }

    try {
        console.log(`[Register] Searching user... (Mongoose State: ${mongoose.connection.readyState})`);
        const existingUser = await User.findOne({ email });
        console.log("[Register] User search complete.");
        if (existingUser) {
            return res.status(400).json({ msg: 'User already exists' });
        }

        const newUser = new User({
            name,
            email,
            password
        });

        // password is automatically hashed by the pre-save hook in User model!
        const savedUser = await newUser.save();

        const payload = {
            userId: savedUser._id,
            email: savedUser.email
        };

        const token = jwt.sign(payload, process.env.JWT_SECRET || 'supersecretkey', { expiresIn: '7d' });

        res.status(201).json({
            token,
            user: { _id: savedUser._id, name: savedUser.name, email: savedUser.email }
        });
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
});

// Authenticate user
router.post('/login', async (req, res) => {
    const { email, password } = req.body;

    if (!email || !password) {
        return res.status(400).json({ msg: 'Please enter all fields' });
    }

    try {
        console.log(`[Login] Searching user... (Mongoose State: ${mongoose.connection.readyState})`);
        const user = await User.findOne({ email });
        console.log("[Login] User search complete.");
        if (!user) {
            return res.status(400).json({ msg: 'User does not exist' });
        }

        const isMatch = await bcrypt.compare(password, user.password);
        if (!isMatch) {
            return res.status(400).json({ msg: 'Invalid credentials' });
        }

        const payload = {
            userId: user._id,
            email: user.email
        };

        const token = jwt.sign(payload, process.env.JWT_SECRET || 'supersecretkey', { expiresIn: '7d' });

        res.json({
            token,
            user: { _id: user._id, name: user.name, email: user.email }
        });
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
});

// Google simulated & real auth
router.post('/google', async (req, res) => {
    const { name, email, avatar, googleId, credential } = req.body;

    let userEmail = email;
    let userName = name;
    let userAvatar = avatar;
    let userGoogleId = googleId;

    if (credential) {
        try {
            // Verify the access token using Google's userinfo endpoint
            const response = await fetch('https://www.googleapis.com/oauth2/v3/userinfo', {
                headers: { Authorization: `Bearer ${credential}` }
            });
            
            if (!response.ok) {
                throw new Error('Failed to verify Google token');
            }
            
            const userInfo = await response.json();
            
            if (!userInfo || !userInfo.email) {
                return res.status(400).json({ msg: 'Invalid Google token payload' });
            }
            
            userGoogleId = userInfo.sub;
            userEmail = userInfo.email;
            userName = userInfo.name;
            userAvatar = userInfo.picture;
        } catch (err) {
            console.error('Google token verification failed:', err);
            return res.status(401).json({ msg: 'Google token verification failed' });
        }
    }

    if (!userEmail) {
        return res.status(400).json({ msg: 'Email is required' });
    }

    try {
        let user;
        console.log(`[Google OAuth] Searching user by Google ID... (Mongoose State: ${mongoose.connection.readyState})`);
        if (userGoogleId) {
            user = await User.findOne({ googleId: userGoogleId });
            if (user) console.log("[Google OAuth] User found by Google ID");
        }

        if (!user) {
            // Check if user exists by email
            console.log(`[Google OAuth] Searching user by email...`);
            user = await User.findOne({ email: userEmail });
            if (user) {
                console.log("[Google OAuth] User found by email");
                // Link Google ID if not set
                if (userGoogleId && !user.googleId) {
                    user.googleId = userGoogleId;
                    if (userAvatar && !user.avatar) {
                        user.avatar = userAvatar;
                    }
                    await user.save();
                }
            } else {
                // Create new user
                user = new User({
                    name: userName || 'Google User',
                    email: userEmail,
                    avatar: userAvatar || `https://ui-avatars.com/api/?name=${encodeURIComponent(userName || 'Google User')}&background=random`,
                    password: Math.random().toString(36).slice(-10), // Dummy secure password
                    googleId: userGoogleId
                });
                await user.save();
            }
        }

        const payload = {
            userId: user._id,
            email: user.email
        };

        const token = jwt.sign(payload, process.env.JWT_SECRET || 'supersecretkey', { expiresIn: '7d' });

        res.json({
            token,
            user: { _id: user._id, name: user.name, email: user.email, avatar: user.avatar }
        });
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
});

export default router;

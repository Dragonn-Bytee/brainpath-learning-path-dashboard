import express from 'express';
import User from '../models/User.js';

const router = express.Router();

// GET profile
router.get('/:userId', async (req, res) => {
    try {
        const user = await User.findById(req.params.userId).select('-password');
        if (!user) return res.status(404).json({ msg: 'User not found' });
        res.json(user);
    } catch (err) {
        res.status(500).json({ msg: 'Server error' });
    }
});

// PUT update profile
router.put('/:userId', async (req, res) => {
    try {
        const { name, occupation, avatar } = req.body;
        const updateFields = {};
        if (name !== undefined) updateFields.name = name;
        if (occupation !== undefined) updateFields.occupation = occupation;
        if (avatar !== undefined) updateFields.avatar = avatar;

        const user = await User.findByIdAndUpdate(
            req.params.userId,
            { $set: updateFields },
            { new: true }
        ).select('-password');

        if (!user) return res.status(404).json({ msg: 'User not found' });
        res.json(user);
    } catch (err) {
        console.error('Profile update error:', err);
        res.status(500).json({ msg: 'Server error', error: err.message });
    }
});

export default router;

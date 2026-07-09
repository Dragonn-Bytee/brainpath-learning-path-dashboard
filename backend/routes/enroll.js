import express from 'express';
import User from '../models/User.js';
import Enrollment from '../models/Enrollment.js';

const router = express.Router();

// Enroll user in a course
router.post('/', async (req, res) => {
    const { userId, courseId } = req.body;
    if (!userId || !courseId) return res.status(400).json({ msg: 'userId and courseId are required' });

    try {
        const existingEnrollment = await Enrollment.findOne({ userId, courseId });
        if (existingEnrollment) {
            return res.status(400).json({ msg: 'Already enrolled in this course' });
        }

        const enrollment = new Enrollment({ userId, courseId });
        await enrollment.save();

        await User.findByIdAndUpdate(userId, {
            $addToSet: { enrolledCourses: courseId }
        });

        res.status(201).json({ msg: 'Successfully enrolled', enrollment });
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
});

// GET specific enrollment
router.get('/:userId/:courseId', async (req, res) => {
    const { userId, courseId } = req.params;
    try {
        const enrollment = await Enrollment.findOne({ userId, courseId }).populate('courseId');
        if (!enrollment) {
            return res.status(404).json({ msg: 'Enrollment not found' });
        }

        const tl = (enrollment.courseId.lessons && enrollment.courseId.lessons.length > 0)
            ? enrollment.courseId.lessons.length
            : (enrollment.courseId.totalLessons || 1);

        const actualProgress = Math.round(Math.min((enrollment.completedLessons.length / tl) * 100, 100));

        if (enrollment.progress !== actualProgress) {
            enrollment.progress = actualProgress;
            await enrollment.save();
        }

        res.json(enrollment);
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
});

export default router;

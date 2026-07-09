import express from 'express';
import Enrollment from '../models/Enrollment.js';
import Course from '../models/Course.js';

const router = express.Router();

// Update user progress
router.post('/', async (req, res) => {
    const { userId, courseId, lessonId } = req.body;
    if (!userId || !courseId || !lessonId) {
        return res.status(400).json({ msg: 'userId, courseId, and lessonId are required' });
    }

    try {
        const enrollment = await Enrollment.findOne({ userId, courseId });
        if (!enrollment) return res.status(404).json({ msg: 'Enrollment not found' });

        const course = await Course.findById(courseId);
        if (!course) return res.status(404).json({ msg: 'Course not found' });

        if (!enrollment.completedLessons.includes(lessonId)) {
            enrollment.completedLessons.push(lessonId);

            const tl = (course.lessons && course.lessons.length) ? course.lessons.length : course.totalLessons || 1;
            enrollment.progress = Math.min((enrollment.completedLessons.length / tl) * 100, 100);
            enrollment.lastAccessed = new Date();

            await enrollment.save();
        }

        res.json({ msg: 'Progress updated', progress: enrollment.progress });
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
});

// Submit Quiz Score
router.post('/quiz', async (req, res) => {
    const { userId, courseId, score } = req.body;
    if (!userId || !courseId || score === undefined) {
        return res.status(400).json({ msg: 'userId, courseId, and score are required' });
    }

    try {
        const enrollment = await Enrollment.findOne({ userId, courseId });
        if (!enrollment) return res.status(404).json({ msg: 'Enrollment not found' });

        enrollment.quizAttempts = (enrollment.quizAttempts || 0) + 1;
        enrollment.quizScore = score;
        if (score >= 80) {
            enrollment.quizPassed = true;
            enrollment.progress = 100;
        }

        await enrollment.save();

        res.json({ msg: 'Quiz submitted', quizPassed: enrollment.quizPassed, progress: enrollment.progress });
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
});

export default router;

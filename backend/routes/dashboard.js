import express from 'express';
import Enrollment from '../models/Enrollment.js';

const router = express.Router();

// Get dashboard stats for a user
router.get('/:userId', async (req, res) => {
    try {
        const { userId } = req.params;

        const enrollments = await Enrollment.find({ userId }).populate('courseId');

        const coursesEnrolled = enrollments.length;

        // Sum up quiz attempts from all enrollments
        const quizzesTaken = enrollments.reduce((total, e) => total + (e.quizAttempts || 0), 0);

        const weeklyLearningActivity = [
            { day: 'Mon', hours: 0 },
            { day: 'Tue', hours: 0 },
            { day: 'Wed', hours: 0 },
            { day: 'Thu', hours: 0 },
            { day: 'Fri', hours: 0 },
            { day: 'Sat', hours: 0 },
            { day: 'Sun', hours: 0 },
        ];

        let currentDayIdx = new Date().getDay(); // 0 is Sunday, 1 is Monday
        currentDayIdx = currentDayIdx === 0 ? 6 : currentDayIdx - 1; // 0-6 (Mon-Sun)

        let totalMinutesLearned = 0;
        enrollments.forEach(e => {
            if (e.courseId && e.courseId.lessons) {
                e.completedLessons.forEach(lessonId => {
                    const lesson = e.courseId.lessons.find((l) => l._id.toString() === lessonId.toString());
                    if (lesson && lesson.duration) {
                        totalMinutesLearned += lesson.duration;
                    }
                });
            }
        });

        // Convert to hours, accurately rounded to a readable decimal block
        const totalHoursLearned = parseFloat((totalMinutesLearned / 60).toFixed(1));

        if (totalHoursLearned > 0) {
            weeklyLearningActivity[currentDayIdx].hours = totalHoursLearned;
        }

        const learningStreak = {
            days: [
                { name: 'M', active: false, completed: false },
                { name: 'T', active: false, completed: false },
                { name: 'W', active: false, completed: false },
                { name: 'T', active: false, completed: false },
                { name: 'F', active: false, completed: false },
                { name: 'S', active: false, completed: false },
                { name: 'S', active: false, completed: false },
            ],
            currentStreak: coursesEnrolled > 0 ? 1 : 0
        };

        if (coursesEnrolled > 0) {
            learningStreak.days[currentDayIdx].active = true;
            learningStreak.days[currentDayIdx].completed = true;
        }

        const enrolledCoursesDetails = enrollments.map(e => {
            const tl = (e.courseId.lessons && e.courseId.lessons.length > 0) ? e.courseId.lessons.length : (e.courseId.totalLessons || 1);
            const actualProgress = Math.round(Math.min((e.completedLessons.length / tl) * 100, 100));

            // Auto-heal incorrect progress in DB silently
            if (e.progress !== actualProgress) {
                e.progress = actualProgress;
                e.save().catch(err => console.error("Could not auto-heal progress:", err));
            }

            return {
                id: e.courseId._id,
                title: e.courseId.title,
                progress: actualProgress,
                lastLesson: e.courseId.lessons && e.courseId.lessons.length > 0 ? (e.courseId.lessons[e.completedLessons.length]?.title || e.courseId.lessons[e.courseId.lessons.length - 1].title) : 'Intro',
            };
        });

        let coursesCompleted = 0;
        enrolledCoursesDetails.forEach(e => {
            if (e.progress >= 100) coursesCompleted++;
        });

        res.json({
            coursesEnrolled,
            coursesCompleted,
            quizzesTaken,
            weeklyLearningActivity,
            learningStreak,
            enrolledCourses: enrolledCoursesDetails
        });
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
});

export default router;

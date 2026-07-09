import mongoose from 'mongoose';

const EnrollmentSchema = new mongoose.Schema({
    userId: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
    courseId: { type: mongoose.Schema.Types.ObjectId, ref: 'Course', required: true },
    progress: { type: Number, default: 0 },
    completedLessons: [{ type: mongoose.Schema.Types.ObjectId, ref: 'Lesson' }],
    lastAccessed: { type: Date, default: Date.now },
    quizScore: { type: Number, default: 0 },
    quizPassed: { type: Boolean, default: false },
    quizAttempts: { type: Number, default: 0 }
}, { timestamps: true });

// prevent duplicate enrollments
EnrollmentSchema.index({ userId: 1, courseId: 1 }, { unique: true });

export default mongoose.model('Enrollment', EnrollmentSchema);

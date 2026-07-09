import mongoose from 'mongoose';

const LessonSchema = new mongoose.Schema({
    title: { type: String, required: true },
    duration: { type: Number, required: true }, // in minutes
    videoUrl: String,
    order: Number
});

const CourseSchema = new mongoose.Schema({
    title: { type: String, required: true },
    description: { type: String, required: true },
    category: { type: String },
    instructor: { type: String },
    totalLessons: { type: Number, default: 0 },
    lessons: [LessonSchema],
    difficulty: { type: String, enum: ['Beginner', 'Intermediate', 'Advanced'], default: 'Beginner' },
    thumbnail: { type: String },
    documentation: { type: String, default: '' },
    quiz: [{
        question: { type: String, required: true },
        options: [{ type: String, required: true }],
        correctAnswerIndex: { type: Number, required: true }
    }]
}, { timestamps: true });

export default mongoose.model('Course', CourseSchema);

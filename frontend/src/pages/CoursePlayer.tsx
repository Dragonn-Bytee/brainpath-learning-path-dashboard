import { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { fetchEnrollment, updateProgress, submitQuiz, EnrollmentData, Lesson } from '../services/api';
import { ArrowLeft, PlayCircle, CheckCircle, Clock, BookOpen, FileText, Award } from 'lucide-react';
import Toast from '../components/Toast';
import Quiz from '../components/Quiz';
import { motion } from 'framer-motion';
import './CoursePlayer.css';

export default function CoursePlayer() {
    const { courseId } = useParams<{ courseId: string }>();
    const navigate = useNavigate();

    const [enrollment, setEnrollment] = useState<EnrollmentData | null>(null);
    const [currentLesson, setCurrentLesson] = useState<Lesson | null>(null);
    const [loading, setLoading] = useState(true);
    const [marking, setMarking] = useState(false);
    const [activeTab, setActiveTab] = useState<'lessons' | 'docs'>('lessons');
    const [showQuiz, setShowQuiz] = useState(false);
    const [toast, setToast] = useState<{ show: boolean, message: string, type: 'success' | 'error' } | null>(null);

    useEffect(() => {
        if (!courseId) return;
        fetchEnrollment(courseId)
            .then(data => {
                setEnrollment(data);
                const lessons = data.courseId.lessons || [];

                // Find first incomplete lesson, or just the first lesson
                let nextIncomplete = lessons.find(l => !data.completedLessons.includes(l._id));
                if (!nextIncomplete && lessons.length > 0) {
                    if (data.quizPassed === false && data.completedLessons.length === lessons.length) {
                        setShowQuiz(true);
                        setCurrentLesson(null);
                    } else {
                        nextIncomplete = lessons[lessons.length - 1]; // or the last one if all complete
                        setCurrentLesson(nextIncomplete);
                    }
                } else {
                    setCurrentLesson(nextIncomplete || (lessons[0] || null));
                }
                setLoading(false);
            })
            .catch(err => {
                console.error("Failed to load course", err);
                setLoading(false);
            });
    }, [courseId]);

    if (loading) return <div className="text-center py-12 text-muted">Loading Course Environment...</div>;
    if (!enrollment || !enrollment.courseId) return <div className="text-center py-12 text-muted">Course not found.</div>;

    const course = enrollment.courseId;
    const lessons = course.lessons || [];
    const completedIds = enrollment.completedLessons || [];

    const handleMarkComplete = async () => {
        if (!currentLesson || !courseId) return;
        if (completedIds.includes(currentLesson._id)) return; // already done

        setMarking(true);
        try {
            const res = await updateProgress(courseId, currentLesson._id);

            // Update local state
            const newCompleted = [...completedIds, currentLesson._id];
            setEnrollment({
                ...enrollment,
                completedLessons: newCompleted,
                progress: res.progress
            });

            // Find next lesson to auto-skip
            const currentIndex = lessons.findIndex(l => l._id === currentLesson._id);
            if (currentIndex < lessons.length - 1) {
                setCurrentLesson(lessons[currentIndex + 1]);
            } else {
                setToast({ show: true, message: "All lessons completed! Proceeding to the final quiz.", type: 'success' });
                setShowQuiz(true);
                setCurrentLesson(null);
            }
        } catch (err) {
            setToast({ show: true, message: "Failed to update progress.", type: 'error' });
        } finally {
            setMarking(false);
        }
    };

    const handleQuizComplete = async (score: number) => {
        if (!courseId) return;
        try {
            const res = await submitQuiz(courseId, score);
            setEnrollment(prev => prev ? { ...prev, quizPassed: res.quizPassed, progress: res.progress, quizScore: score } : null);
            if (res.quizPassed) {
                setToast({ show: true, message: 'Congratulations! You passed the course!', type: 'success' });
            } else {
                setToast({ show: true, message: `You scored ${score}%. You need 80% to pass. Try again.`, type: 'error' });
            }
        } catch (err) {
            setToast({ show: true, message: 'Failed to submit quiz', type: 'error' });
        }
    };

    const isCompleted = (lessonId: string) => completedIds.includes(lessonId);

    return (
        <div className="course-player-layout">
            <motion.div 
                className="course-sidebar glass-panel card-base"
                initial={{ opacity: 0, x: -50, rotateY: -10 }}
                animate={{ opacity: 1, x: 0, rotateY: 0 }}
                transition={{ duration: 0.5, type: 'spring' }}
            >
                <button className="back-btn" onClick={() => navigate('/app/my-courses')}>
                    <ArrowLeft size={16} /> Back to Courses
                </button>
                <h2 className="course-sidebar-title">{course.title}</h2>

                <div className="progress-container">
                    <div className="progress-info">
                        <span>Your Progress</span>
                        <span className="text-gradient font-bold">{Math.round(enrollment.progress)}%</span>
                    </div>
                    <div className="progress-bar-bg">
                        <motion.div 
                            className="progress-bar-fill" 
                            initial={{ width: 0 }}
                            animate={{ width: `${enrollment.progress}%` }}
                            transition={{ duration: 1, ease: 'easeOut' }}
                        />
                    </div>
                </div>

                <div className="lessons-list">
                    <h4 className="lessons-heading">Course Lessons ({lessons.length})</h4>
                    {lessons.sort((a, b) => a.order - b.order).map(lesson => {
                        const isActive = currentLesson?._id === lesson._id;
                        const done = isCompleted(lesson._id);
                        return (
                            <motion.div
                                key={lesson._id}
                                className={`lesson-item ${isActive ? 'active' : ''} ${done ? 'completed' : ''}`}
                                onClick={() => setCurrentLesson(lesson)}
                                whileHover={{ x: 5, backgroundColor: 'rgba(255,255,255,0.08)' }}
                            >
                                <div className="lesson-icon">
                                    {done ? <CheckCircle size={16} className="text-success" /> : <PlayCircle size={16} />}
                                </div>
                                <div className="lesson-details">
                                    <p className="lesson-title">{lesson.title}</p>
                                    <p className="lesson-duration"><Clock size={12} /> {lesson.duration}m</p>
                                </div>
                            </motion.div>
                        );
                    })}

                    <motion.div
                        className={`lesson-item ${showQuiz ? 'active' : ''}`}
                        onClick={() => {
                            if (completedIds.length === lessons.length) {
                                setShowQuiz(true);
                                setCurrentLesson(null);
                            } else {
                                setToast({ show: true, message: 'Complete all lessons first to unlock the quiz.', type: 'error' });
                            }
                        }}
                        style={{ marginTop: '0.5rem', opacity: completedIds.length === lessons.length ? 1 : 0.5, borderTop: '1px solid var(--glass-border)', paddingTop: '1rem', borderRadius: 0 }}
                        whileHover={completedIds.length === lessons.length ? { x: 5, backgroundColor: 'rgba(255,255,255,0.08)' } : {}}
                    >
                        <div className="lesson-icon">
                            <Award size={16} className={enrollment.quizPassed ? 'text-success' : ''} />
                        </div>
                        <div className="lesson-details">
                            <p className="lesson-title">Final Course Quiz</p>
                            <p className="lesson-duration">20 Questions</p>
                        </div>
                    </motion.div>
                </div>
            </motion.div>

            <div className="course-main">
                {showQuiz ? (
                    <Quiz
                        questions={course.quiz || []}
                        title={course.title}
                        onComplete={handleQuizComplete}
                        passed={enrollment.quizPassed}
                        previousScore={enrollment.quizScore}
                    />
                ) : currentLesson ? (
                    <>
                        <div className="video-container">
                            {currentLesson.videoUrl ? (
                                <div className="video-player">
                                    <iframe
                                        src={`https://www.youtube.com/embed/${currentLesson.videoUrl.includes('youtu.be/') ? currentLesson.videoUrl.split('youtu.be/')[1]?.split('?')[0] : currentLesson.videoUrl.includes('v=') ? currentLesson.videoUrl.split('v=')[1]?.split('&')[0] : currentLesson.videoUrl}?rel=0&modestbranding=1`}
                                        title={currentLesson.title}
                                        frameBorder="0"
                                        allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                                        allowFullScreen
                                    />
                                </div>
                            ) : (
                                <div className="video-player-placeholder">
                                    <PlayCircle size={64} opacity={0.5} style={{ marginBottom: '1rem' }} />
                                    <p>No video available for this lesson</p>
                                </div>
                            )}
                        </div>

                        <div className="glass-panel card-base" style={{ padding: '2rem' }}>
                            <div className="course-content-tabs">
                                <button
                                    className={`tab-btn ${activeTab === 'lessons' ? 'active' : ''}`}
                                    onClick={() => setActiveTab('lessons')}
                                >
                                    <BookOpen size={16} /> Overview
                                </button>
                                <button
                                    className={`tab-btn ${activeTab === 'docs' ? 'active' : ''}`}
                                    onClick={() => setActiveTab('docs')}
                                >
                                    <FileText size={16} /> Documentation
                                </button>
                            </div>

                            {activeTab === 'lessons' && (
                                <div className="lesson-overview">
                                    <div className="lesson-content-header">
                                        <div>
                                            <h2>{currentLesson.title}</h2>
                                            <p className="text-muted"><Clock size={16} style={{ display: 'inline', marginRight: '6px', verticalAlign: 'text-bottom' }} /> {currentLesson.duration} Minutes</p>
                                        </div>

                                        {!isCompleted(currentLesson._id) ? (
                                            <button
                                                className="primary-solid"
                                                onClick={handleMarkComplete}
                                                disabled={marking}
                                            >
                                                <CheckCircle size={18} /> {marking ? 'Saving...' : 'Mark as Completed'}
                                            </button>
                                        ) : (
                                            <div className="completed-badge">
                                                <CheckCircle size={18} /> Completed
                                            </div>
                                        )}
                                    </div>

                                    <div className="lesson-description">
                                        <h3>About this course</h3>
                                        <p className="text-muted">{course.description}</p>
                                        <div style={{ display: 'flex', gap: '1rem', marginTop: '1.5rem', paddingTop: '1.5rem', borderTop: '1px solid var(--glass-border)', flexWrap: 'wrap' }}>
                                            <div style={{ background: 'rgba(255,255,255,0.03)', padding: '0.75rem 1.25rem', borderRadius: '12px', border: '1px solid var(--glass-border)' }}>
                                                <span style={{ fontSize: '0.75rem', color: 'var(--text-muted)', textTransform: 'uppercase', letterSpacing: '1px', fontWeight: 600 }}>Instructor</span>
                                                <p style={{ fontWeight: 600, marginTop: '2px', color: 'var(--text-main)' }}>{course.instructor || 'Community Expert'}</p>
                                            </div>
                                            {course.difficulty && (
                                                <div style={{ background: 'rgba(255,255,255,0.03)', padding: '0.75rem 1.25rem', borderRadius: '12px', border: '1px solid var(--glass-border)' }}>
                                                    <span style={{ fontSize: '0.75rem', color: 'var(--text-muted)', textTransform: 'uppercase', letterSpacing: '1px', fontWeight: 600 }}>Difficulty</span>
                                                    <p style={{ fontWeight: 600, marginTop: '2px', color: 'var(--text-main)' }}>{course.difficulty}</p>
                                                </div>
                                            )}
                                        </div>
                                    </div>
                                </div>
                            )}

                            {activeTab === 'docs' && (
                                <div className="course-doc-content">
                                    {course.documentation ? (
                                        course.documentation.split('\n').map((line, i) => {
                                            if (line.startsWith('## ')) return <h2 key={i}>{line.replace('## ', '')}</h2>;
                                            if (line.startsWith('### ')) return <h3 key={i}>{line.replace('### ', '')}</h3>;
                                            if (line.startsWith('- ')) return <li key={i}>{line.replace('- ', '')}</li>;
                                            if (line.match(/^\d+\./)) return <li key={i} style={{ listStyleType: 'decimal' }}>{line.replace(/^\d+\.\s*/, '')}</li>;
                                            if (line.trim() === '') return <br key={i} />;
                                            return <p key={i}>{line}</p>;
                                        })
                                    ) : (
                                        <div className="text-center py-12" style={{ padding: '3rem 0', display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
                                            <FileText size={48} style={{ opacity: 0.2, marginBottom: '1rem' }} />
                                            <p>No documentation available for this course yet.</p>
                                        </div>
                                    )}
                                </div>
                            )}
                        </div>
                    </>
                ) : (
                    <div className="glass-panel card-base text-center py-12">Select a lesson to begin.</div>
                )}
            </div>

            {toast?.show && (
                <Toast
                    message={toast.message}
                    type={toast.type}
                    onClose={() => setToast(null)}
                />
            )}
        </div>
    );
}

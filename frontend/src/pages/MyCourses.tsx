import { useState, useEffect } from 'react';
import { fetchMyCourses, EnrolledCourse } from '../services/api';
import { PlayCircle } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';

export default function MyCourses() {
    const [courses, setCourses] = useState<EnrolledCourse[]>([]);
    const [loading, setLoading] = useState(true);
    const navigate = useNavigate();

    useEffect(() => {
        fetchMyCourses().then(data => {
            setCourses(data);
            setLoading(false);
        });
    }, []);

    if (loading) return <div className="text-center py-12 text-muted">Loading your courses...</div>;

    return (
        <div>
            <div className="mb-8" style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
                <div>
                    <h1 className="text-2xl font-bold mb-2" style={{ fontSize: '2rem', fontWeight: 700 }}>My Courses</h1>
                    <p className="text-muted" style={{ color: 'var(--text-muted)' }}>Continue where you left off and track your progress.</p>
                </div>
                <button
                    onClick={() => navigate('/app/explore')}
                    className="pill-btn"
                    style={{ display: 'flex', alignItems: 'center', gap: '8px', padding: '10px 20px', borderRadius: '12px', background: 'var(--color-primary)', color: 'white', fontWeight: 600 }}>
                    Explore More Courses
                </button>
            </div>

            {courses.length === 0 && (
                <div className="glass-panel card-base text-center py-12" style={{ padding: '3rem' }}>
                    <h3 style={{ fontSize: '1.25rem', fontWeight: 600, marginBottom: '0.5rem' }}>No Courses Yet</h3>
                    <p style={{ color: 'var(--text-muted)', marginBottom: '1.5rem' }}>You haven't enrolled in any courses. Explore our catalog to get started!</p>
                </div>
            )}

            <motion.div 
                className="dashboard-grid"
                initial="hidden"
                animate="show"
                variants={{
                    hidden: { opacity: 0 },
                    show: {
                        opacity: 1,
                        transition: { staggerChildren: 0.15 }
                    }
                }}
            >
                {courses.map(course => (
                    <motion.div 
                        key={course.id} 
                        className="col-span-4 glass-panel card-base flex flex-col justify-between" 
                        style={{ display: 'flex', flexDirection: 'column', gap: '1rem', overflow: 'hidden', position: 'relative', transformOrigin: 'center bottom' }}
                        variants={{
                            hidden: { opacity: 0, scale: 0.85, y: 40 },
                            show: { opacity: 1, scale: 1, y: 0, transition: { type: 'spring', damping: 22, stiffness: 120 } }
                        }}
                        whileHover={{ y: -8, scale: 1.03 }}
                        transition={{ type: 'spring', stiffness: 300, damping: 28 }}
                    >
                        <div style={{ position: 'relative', zIndex: 2 }}>
                            <h3 style={{ fontSize: '1.2rem', fontWeight: 600, marginBottom: '0.5rem' }}>{course.title}</h3>
                            <p style={{ color: 'var(--text-muted)', fontSize: '0.875rem' }}>Last Lesson: <strong>{course.lastLesson}</strong></p>
                        </div>

                        <div style={{ marginTop: 'auto', position: 'relative', zIndex: 2 }}>
                            <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '0.5rem', fontSize: '0.85rem', fontWeight: 500 }}>
                                <span>Progress</span>
                                <span className="text-gradient font-bold">{course.progress}%</span>
                            </div>
                            <div style={{ width: '100%', height: '8px', background: 'rgba(0,0,0,0.1)', borderRadius: '10px', overflow: 'hidden', marginBottom: '1.5rem', boxShadow: 'inset 0 1px 3px rgba(0,0,0,0.2)' }}>
                                <motion.div 
                                    initial={{ width: 0 }}
                                    animate={{ width: `${course.progress}%` }}
                                    transition={{ duration: 1.5, ease: "easeOut", delay: 0.3 }}
                                    style={{ height: '100%', background: 'linear-gradient(135deg, var(--color-primary), var(--color-secondary))', borderRadius: '10px' }} 
                                />
                            </div>

                            <button
                                onClick={() => navigate('/app/course/' + course.id)}
                                className="pill-btn primary-solid"
                                style={{ width: '100%', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '8px', padding: '10px', borderRadius: '12px' }}>
                                <PlayCircle size={18} /> Continue Learning
                            </button>
                        </div>
                        {/* 3D background abstract shape */}
                        <div style={{ position: 'absolute', top: '-10%', right: '-10%', width: '120px', height: '120px', background: 'radial-gradient(circle, rgba(139,92,246,0.2) 0%, transparent 70%)', filter: 'blur(10px)', zIndex: 1, pointerEvents: 'none' }} />
                    </motion.div>
                ))}
            </motion.div>
        </div>
    );
}

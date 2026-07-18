import { useState, useEffect } from 'react';
import { fetchMarketplaceCourses, fetchMyCourses, Course, enrollInCourse } from '../services/api';
import { Search, Filter, PlusCircle, CheckCircle, PlayCircle, Sparkles } from 'lucide-react';
import { useSearchParams, useNavigate } from 'react-router-dom';
import Toast from '../components/Toast';
import { motion, Variants } from 'framer-motion';

const containerVariants: Variants = {
    hidden: { opacity: 0 },
    show: {
        opacity: 1,
        transition: { staggerChildren: 0.1, delayChildren: 0.1 }
    }
};

const itemVariants: Variants = {
    hidden: { opacity: 0, y: 30, scale: 0.95 },
    show: { 
        opacity: 1, scale: 1, y: 0, 
        transition: { type: 'spring', damping: 22, stiffness: 120 } 
    }
};

export default function ExploreCourses() {
    const [searchParams] = useSearchParams();
    const navigate = useNavigate();
    const [courses, setCourses] = useState<Course[]>([]);
    const [searchTerm, setSearchTerm] = useState(searchParams.get('search') || '');
    const [category, setCategory] = useState('All');
    const [loading, setLoading] = useState(true);
    const [enrollingMap, setEnrollingMap] = useState<Record<string, boolean>>({});
    const [enrolledIds, setEnrolledIds] = useState<Set<string>>(new Set());
    const [toast, setToast] = useState<{ show: boolean, message: string, type: 'success' | 'error' } | null>(null);

    const categories = ['All', 'AI', 'Machine Learning', 'Web Development', 'Data Science', 'Design', 'Business', 'Cybersecurity', 'Mobile Development', 'Marketing'];

    useEffect(() => {
        Promise.all([
            fetchMarketplaceCourses(),
            fetchMyCourses().catch(() => [])
        ]).then(([marketCourses, myCourses]) => {
            setCourses(marketCourses);
            const ids = new Set(myCourses.map(c => c.id));
            setEnrolledIds(ids);
            setLoading(false);
        });
    }, []);

    const filteredCourses = courses.filter(course => {
        const matchesSearch = course.title.toLowerCase().includes(searchTerm.toLowerCase());
        const matchesCategory = category === 'All' || course.category === category;
        return matchesSearch && matchesCategory;
    });

    const handleEnroll = async (courseId: string) => {
        setEnrollingMap(prev => ({ ...prev, [courseId]: true }));
        try {
            await enrollInCourse(courseId);
            setEnrolledIds(prev => new Set(prev).add(courseId));
            setToast({ show: true, message: 'Successfully enrolled! 🎉', type: 'success' });
        } catch (err) {
            setToast({ show: true, message: 'Failed to enroll. Maybe already enrolled or unavailable.', type: 'error' });
        } finally {
            setEnrollingMap(prev => ({ ...prev, [courseId]: false }));
        }
    };

    return (
        <div>
            <motion.div 
                initial={{ opacity: 0, y: -20 }}
                animate={{ opacity: 1, y: 0 }}
                className="mb-8"
            >
                <h1 style={{ fontSize: '2.5rem', fontWeight: 800, marginBottom: '0.5rem' }} className="text-gradient">Explore Courses</h1>
                <p style={{ color: 'var(--text-muted)', fontSize: '1.1rem', display: 'flex', alignItems: 'center', gap: '8px' }}>
                    <Sparkles size={18} className="text-primary" /> Curated learning paths designed for the future.
                </p>
            </motion.div>

            <motion.div 
                initial={{ opacity: 0, scale: 0.98 }}
                animate={{ opacity: 1, scale: 1 }}
                className="glass-panel" 
                style={{ marginBottom: '3rem', display: 'flex', gap: '1rem', flexWrap: 'wrap', padding: '1.5rem', borderRadius: '24px' }}
            >
                <div className="search-bar" style={{ flex: 1, minWidth: '300px', background: 'rgba(255,255,255,0.05)', border: '1px solid var(--glass-border)' }}>
                    <Search size={18} className="text-muted" />
                    <input
                        type="text"
                        placeholder="Search for courses..."
                        value={searchTerm}
                        onChange={(e) => setSearchTerm(e.target.value)}
                        style={{ color: 'var(--text-main)' }}
                    />
                </div>

                <div style={{ display: 'flex', gap: '0.75rem', alignItems: 'center', flexWrap: 'wrap' }}>
                    <Filter size={18} className="text-muted" style={{ marginRight: '8px' }} />
                    {categories.map(c => (
                        <motion.button
                            key={c}
                            whileHover={{ scale: 1.05 }}
                            whileTap={{ scale: 0.95 }}
                            onClick={() => setCategory(c)}
                            style={{
                                background: category === c ? 'var(--color-primary)' : 'rgba(255,255,255,0.05)',
                                color: category === c ? 'white' : 'var(--text-main)',
                                border: category === c ? 'none' : '1px solid var(--glass-border)',
                                padding: '10px 18px', borderRadius: '14px', fontWeight: 600, fontSize: '0.9rem', cursor: 'pointer', transition: 'background 0.3s'
                            }}
                        >
                            {c}
                        </motion.button>
                    ))}
                </div>
            </motion.div>

            {loading ? (
                <div className="text-center py-12 text-muted animate-pulse">Scanning the marketplace...</div>
            ) : (
                <motion.div 
                    className="dashboard-grid"
                    variants={containerVariants}
                    initial="hidden"
                    animate="show"
                >
                    {filteredCourses.map(course => (
                        <motion.div 
                            variants={itemVariants}
                            key={course.id} 
                            className="col-span-4 glass-panel card-base" 
                            style={{ padding: '0', overflow: 'hidden', display: 'flex', flexDirection: 'column', perspective: '1000px' }}
                            whileHover={{ y: -12, scale: 1.02, rotateX: 2 }}
                            transition={{ type: 'spring', stiffness: 300, damping: 25 }}
                        >
                            <div style={{ position: 'relative', overflow: 'hidden', height: '180px' }}>
                                <motion.img 
                                    whileHover={{ scale: 1.1 }}
                                    src={course.image} alt={course.title} 
                                    style={{ width: '100%', height: '100%', objectFit: 'cover', transition: 'transform 0.6s cubic-bezier(0.22, 1, 0.36, 1)', display: 'block' }} 
                                />
                                <div style={{ position: 'absolute', inset: 0, background: 'linear-gradient(to bottom, transparent, rgba(0,0,0,0.4))' }} />
                            </div>
                            <div style={{ padding: '1.75rem', display: 'flex', flexDirection: 'column', flex: 1 }}>
                                <span style={{ fontSize: '0.75rem', fontWeight: 700, color: 'var(--color-primary)', textTransform: 'uppercase', letterSpacing: '1.5px', marginBottom: '0.75rem' }}>{course.category}</span>
                                <h3 style={{ fontSize: '1.4rem', fontWeight: 800, marginBottom: '0.75rem', lineHeight: 1.3 }}>{course.title}</h3>
                                <p style={{ color: 'var(--text-muted)', fontSize: '0.9rem', marginBottom: '2rem', flex: 1, lineHeight: 1.6 }}>{course.description}</p>
                                
                                {enrolledIds.has(course.id) ? (
                                    <motion.button
                                        whileHover={{ scale: 1.02 }}
                                        whileTap={{ scale: 0.98 }}
                                        onClick={() => navigate('/app/course/' + course.id)}
                                        className="pill-btn primary-solid"
                                        style={{ width: '100%', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '10px', padding: '12px', borderRadius: '16px', background: 'rgba(16, 185, 129, 0.15)', color: 'var(--color-success)', fontWeight: 700, border: '1px solid rgba(16, 185, 129, 0.3)' }}>
                                        <CheckCircle size={18} /> Enrolled · <PlayCircle size={18} /> Continue
                                    </motion.button>
                                ) : (
                                    <motion.button
                                        whileHover={{ scale: 1.02, boxShadow: '0 0 15px var(--color-primary)' }}
                                        whileTap={{ scale: 0.98 }}
                                        onClick={() => handleEnroll(course.id)}
                                        disabled={enrollingMap[course.id]}
                                        className="pill-btn primary-solid"
                                        style={{ width: '100%', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '10px', padding: '12px', borderRadius: '16px', fontWeight: 700, boxShadow: '0 8px 16px -4px rgba(79, 70, 229, 0.4)' }}>
                                        {enrollingMap[course.id] ? 'Enrolling...' : <><PlusCircle size={20} /> Enroll Now</>}
                                    </motion.button>
                                )}
                            </div>
                        </motion.div>
                    ))}
                    {filteredCourses.length === 0 && (
                        <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="col-span-12 text-center py-12 text-muted">
                            No courses found matching your criteria.
                        </motion.div>
                    )}
                </motion.div>
            )}

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

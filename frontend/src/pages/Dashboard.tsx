import { motion, Variants } from 'framer-motion';
import StatCard from '../components/StatCard';
import StreakTracker from '../components/StreakTracker';
import WeeklyChart from '../components/WeeklyChart';
import TimeTracker from '../components/TimeTracker';
import AIAssistant from '../components/AIAssistant';
import { BookOpen, CheckCircle, Award } from 'lucide-react';
import { useDashboardData } from '../hooks/useDashboardData';

const itemVariants: Variants = {
    hidden: { opacity: 0, y: 40, scale: 0.95 },
    show: { 
        opacity: 1, 
        y: 0, 
        scale: 1,
        transition: { type: 'spring', damping: 20, stiffness: 100 }
    }
};

export default function Dashboard() {
    const { stats, activity, rawData, loading } = useDashboardData();

    if (loading || !stats) {
        return (
            <motion.div 
                initial={{ opacity: 0 }} 
                animate={{ opacity: 1 }} 
                className="dashboard-grid"
            >
                <div className="col-span-12 glass-panel card-base text-center py-12">
                    <p className="text-muted text-lg tracking-widest animate-pulse">Loading dashboard environment...</p>
                </div>
            </motion.div>
        );
    }

    return (
        <div className="dashboard-grid">
            {/* Stat Cards Row */}
            <motion.div variants={itemVariants} initial="hidden" animate="show" className="col-span-4" style={{ height: '100%' }}>
                <StatCard
                    title="Courses Enrolled"
                    value={stats.enrolled.toString()}
                    icon={<BookOpen />}
                    colorClass="blue"
                />
            </motion.div>
            <motion.div variants={itemVariants} initial="hidden" animate="show" transition={{ delay: 0.1 }} className="col-span-4" style={{ height: '100%' }}>
                <StatCard
                    title="Courses Completed"
                    value={stats.completed.toString()}
                    icon={<CheckCircle />}
                    colorClass="green"
                />
            </motion.div>
            <motion.div variants={itemVariants} initial="hidden" animate="show" transition={{ delay: 0.2 }} className="col-span-4" style={{ height: '100%' }}>
                <StatCard
                    title="Quizzes Taken"
                    value={stats.quizzes.toString()}
                    icon={<Award />}
                    colorClass="indigo"
                />
            </motion.div>

            {/* Middle Row: Streak & Weekly Chart */}
            <motion.div 
                variants={itemVariants} 
                initial="hidden" 
                animate="show" 
                transition={{ delay: 0.3 }}
                className="col-span-8"
                whileHover={{ y: -6, scale: 1.02 }}
                style={{ transformOrigin: 'center bottom' }}
            >
                <WeeklyChart data={activity} />
            </motion.div>
            <motion.div 
                variants={itemVariants} 
                initial="hidden" 
                animate="show" 
                transition={{ delay: 0.4 }}
                className="col-span-4"
                whileHover={{ y: -6, scale: 1.02 }}
                style={{ transformOrigin: 'center bottom' }}
            >
                <StreakTracker streakData={rawData?.learningStreak} />
            </motion.div>

            {/* Bottom Row: Time Tracker & AI Assistant */}
            <motion.div 
                variants={itemVariants} 
                className="col-span-4"
                viewport={{ once: true, margin: "-50px" }}
                whileInView="show"
                initial="hidden"
            >
                <TimeTracker />
            </motion.div>

            <motion.div 
                variants={itemVariants} 
                className="col-span-8"
                viewport={{ once: true, margin: "-50px" }}
                whileInView="show"
                initial="hidden"
            >
                <AIAssistant />
            </motion.div>
        </div>
    );
}

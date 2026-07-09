import { useState, useEffect } from 'react';
import { fetchDashboardData, DashboardStats, WeeklyActivity } from '../services/api';

export function useDashboardData() {
    const [stats, setStats] = useState<DashboardStats | null>(null);
    const [activity, setActivity] = useState<WeeklyActivity[]>([]);
    const [rawData, setRawData] = useState<any>(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        let mounted = true;
        const loadData = async () => {
            setLoading(true);
            try {
                const data = await fetchDashboardData();
                if (mounted) {
                    setStats({
                        enrolled: data.coursesEnrolled,
                        completed: data.coursesCompleted,
                        quizzes: data.quizzesTaken
                    });
                    setActivity(data.weeklyLearningActivity);
                    setRawData(data);
                }
            } catch (err) {
                console.error("Failed to load dashboard data", err);
            } finally {
                if (mounted) setLoading(false);
            }
        };

        loadData();
        return () => { mounted = false; };
    }, []);

    return { stats, activity, rawData, loading };
}

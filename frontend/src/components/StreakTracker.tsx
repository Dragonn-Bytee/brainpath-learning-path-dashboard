import { Flame } from 'lucide-react';
import './StreakTracker.css';

export default function StreakTracker({ streakData }: { streakData?: any }) {
    const days = streakData?.days || [
        { name: 'M', active: false, completed: false },
        { name: 'T', active: false, completed: false },
        { name: 'W', active: false, completed: false },
        { name: 'T', active: false, completed: false },
        { name: 'F', active: false, completed: false },
        { name: 'S', active: false, completed: false },
        { name: 'S', active: false, completed: false },
    ];

    const currentStreak = streakData?.currentStreak || 0;

    return (
        <div className="glass-panel card-base streak-widget">
            <div className="streak-header">
                <div className="streak-title">
                    <div className="streak-icon-wrapper">
                        <Flame className="streak-icon" size={24} />
                    </div>
                    <div>
                        <h3>{currentStreak}-Day Streak!</h3>
                        <p className="streak-subtitle">Keep going! You're doing great.</p>
                    </div>
                </div>
            </div>

            <div className="streak-days">
                {days.map((day: any, i: number) => (
                    <div key={i} className="streak-day">
                        <div className={`day-circle ${day.active ? 'active' : ''}`} style={!day.completed && day.active ? { background: 'white', border: '2px dashed var(--color-primary)', color: 'var(--color-primary)' } : {}}>
                            {day.completed ? (
                                <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round"><polyline points="20 6 9 17 4 12"></polyline></svg>
                            ) : day.active ? (
                                <span style={{ fontSize: '10px', fontWeight: 'bold' }}>?</span>
                            ) : null}
                        </div>
                        <span className="day-name">{day.name}</span>
                    </div>
                ))}
            </div>
        </div>
    );
}

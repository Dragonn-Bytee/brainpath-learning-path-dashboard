import { Play, Pause, RotateCcw } from 'lucide-react';
import { useState, useEffect } from 'react';
import './TimeTracker.css';

export default function TimeTracker() {
    const [isActive, setIsActive] = useState(false);
    const [seconds, setSeconds] = useState(0); // Start at 0

    useEffect(() => {
        let interval: ReturnType<typeof setInterval>;
        if (isActive) {
            interval = setInterval(() => {
                setSeconds((seconds) => seconds + 1);
            }, 1000);
        }
        return () => clearInterval(interval);
    }, [isActive]);

    const handleReset = () => {
        setIsActive(false);
        setSeconds(0);
    };

    const formatTime = (totalSeconds: number) => {
        const h = Math.floor(totalSeconds / 3600);
        const m = Math.floor((totalSeconds % 3600) / 60);
        const s = totalSeconds % 60;
        return `${h.toString().padStart(2, '0')}:${m.toString().padStart(2, '0')}:${s.toString().padStart(2, '0')}`;
    };

    return (
        <div className="time-tracker-widget card-base">
            <div className="tracker-content">
                <h3>Current Session</h3>
                <div className="time-display">{formatTime(seconds)}</div>
                <p className="tracker-subtitle">Advanced Machine Learning</p>
            </div>

            <div className="tracker-controls">
                <button
                    className={`play-btn ${isActive ? 'active' : ''}`}
                    onClick={() => setIsActive(!isActive)}
                    title={isActive ? "Pause Session" : "Start Session"}
                >
                    {isActive ? <Pause size={32} /> : <Play size={32} className="play-icon" />}
                </button>
                <button
                    className="reset-btn"
                    onClick={handleReset}
                    title="Reset timer"
                >
                    <RotateCcw size={20} />
                </button>
            </div>

            {/* Decorative gradient glowing orb */}
            <div className="glow-orb"></div>
        </div>
    );
}

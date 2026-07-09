import { BarChart, Bar, XAxis, Tooltip, ResponsiveContainer } from 'recharts';
import { WeeklyActivity } from '../services/api';
import './WeeklyChart.css';

interface WeeklyChartProps {
    data: WeeklyActivity[];
}

export default function WeeklyChart({ data }: WeeklyChartProps) {
    const totalTime = data.reduce((acc, curr) => acc + curr.hours, 0).toFixed(1);

    return (
        <div className="glass-panel card-base weekly-chart" style={{ paddingBottom: '1.5rem' }}>
            <div className="chart-header">
                <div>
                    <h3>Learning Activity</h3>
                    <p className="chart-subtitle">Time spent this week</p>
                </div>
                <div className="total-time">
                    <span>Total:</span>
                    <strong>{totalTime}h</strong>
                </div>
            </div>

            <div className="chart-bars" style={{ width: '100%', height: '180px', paddingTop: '0' }}>
                <ResponsiveContainer width="100%" height="100%">
                    <BarChart data={data}>
                        <XAxis dataKey="day" axisLine={false} tickLine={false} tick={{ fill: 'var(--text-muted)', fontSize: 12, fontWeight: 600 }} dy={10} />
                        <Tooltip
                            cursor={{ fill: 'rgba(0,0,0,0.03)' }}
                            contentStyle={{ borderRadius: '12px', border: 'none', background: 'var(--glass-bg)', boxShadow: 'var(--glass-shadow)', backdropFilter: 'blur(10px)' }}
                        />
                        <Bar dataKey="hours" fill="url(#colorUv)" radius={[100, 100, 100, 100]} barSize={32} />
                        <defs>
                            <linearGradient id="colorUv" x1="0" y1="0" x2="0" y2="1">
                                <stop offset="0%" stopColor="var(--color-primary)" stopOpacity={1} />
                                <stop offset="100%" stopColor="var(--color-secondary)" stopOpacity={1} />
                            </linearGradient>
                        </defs>
                    </BarChart>
                </ResponsiveContainer>
            </div>
        </div>
    );
}

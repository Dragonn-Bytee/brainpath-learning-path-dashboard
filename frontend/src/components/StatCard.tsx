import { ReactNode } from 'react';

interface StatCardProps {
    title: string;
    value: string;
    icon: ReactNode;
    colorClass: 'blue' | 'indigo' | 'green';
}

export default function StatCard({ title, value, icon, colorClass }: StatCardProps) {
    return (
        <div className="card-base glass-panel col-span-4 stat-card">
            <div className={`stat-icon ${colorClass}`}>
                {icon}
            </div>
            <div className="stat-info">
                <h3>{value}</h3>
                <p>{title}</p>
            </div>
        </div>
    );
}

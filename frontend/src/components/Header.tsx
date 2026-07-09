import { Search, Bell, MessageSquare, LogOut, User, Settings, Image, Play } from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import { useNavigate } from 'react-router-dom';
import { useState, useEffect, useRef } from 'react';
import { fetchMarketplaceCourses, fetchMyCourses, Course, EnrolledCourse } from '../services/api';
import './Header.css';

export default function Header() {
    const { user, logout } = useAuth();
    const navigate = useNavigate();

    const handleLogout = () => {
        logout();
        navigate('/login');
    };

    const [searchTerm, setSearchTerm] = useState('');
    const [searchResults, setSearchResults] = useState<{ id: string, title: string, type: 'enrolled' | 'explore' }[]>([]);
    const [showResults, setShowResults] = useState(false);
    const searchRef = useRef<HTMLDivElement>(null);

    useEffect(() => {
        const handleClickOutside = (event: MouseEvent) => {
            if (searchRef.current && !searchRef.current.contains(event.target as Node)) {
                setShowResults(false);
            }
        };
        document.addEventListener('mousedown', handleClickOutside);
        return () => document.removeEventListener('mousedown', handleClickOutside);
    }, []);

    useEffect(() => {
        const fetchSearchResults = async () => {
            if (searchTerm.trim().length === 0) {
                setSearchResults([]);
                return;
            }
            try {
                const term = searchTerm.toLowerCase();
                // Fetch both at same time
                const [myCourses, explore] = await Promise.all([
                    fetchMyCourses().catch(() => [] as EnrolledCourse[]),
                    fetchMarketplaceCourses().catch(() => [] as Course[])
                ]);

                const enrolledMatches = myCourses
                    .filter(c => c.title.toLowerCase().includes(term))
                    .map(c => ({ id: c.id, title: c.title, type: 'enrolled' as const }));

                const exploreMatches = explore
                    .filter(c => c.title.toLowerCase().includes(term))
                    // don't duplicate if already enrolled
                    .filter(c => !enrolledMatches.find(em => em.title === c.title))
                    .map(c => ({ id: c.id, title: c.title, type: 'explore' as const }));

                setSearchResults([...enrolledMatches, ...exploreMatches].slice(0, 5)); // show top 5
            } catch (err) {
                console.error(err);
            }
        };

        const timeout = setTimeout(fetchSearchResults, 300);
        return () => clearTimeout(timeout);
    }, [searchTerm]);

    const handleResultClick = (result: { id: string, title: string, type: 'enrolled' | 'explore' }) => {
        setShowResults(false);
        setSearchTerm('');
        if (result.type === 'enrolled') {
            navigate('/app/course/' + result.id);
        } else {
            navigate('/app/explore?search=' + encodeURIComponent(result.title));
        }
    };

    return (
        <header className="top-header">
            <div className="greeting">
                <h1>Welcome back, {user?.name?.split(' ')[0] || 'Learner'}! 👋</h1>
                <p>Ready to continue your learning journey?</p>
            </div>

            <div className="header-actions">
                <div className="search-container" ref={searchRef}>
                    <div className="search-bar">
                        <Search size={18} className="text-muted" />
                        <input
                            type="text"
                            placeholder="Search courses..."
                            value={searchTerm}
                            onChange={(e) => {
                                setSearchTerm(e.target.value);
                                setShowResults(true);
                            }}
                            onFocus={() => setShowResults(true)}
                        />
                    </div>

                    {showResults && searchResults.length > 0 && (
                        <div className="search-results-dropdown">
                            {searchResults.map((result) => (
                                <button
                                    key={result.id + result.type}
                                    className="search-result-item"
                                    onClick={() => handleResultClick(result)}
                                >
                                    <div className="result-icon">
                                        {result.type === 'enrolled' ? <Play size={14} /> : <Search size={14} />}
                                    </div>
                                    <div className="result-info">
                                        <span className="result-title">{result.title}</span>
                                        <span className="result-type">
                                            {result.type === 'enrolled' ? 'In My Courses' : 'In Explore'}
                                        </span>
                                    </div>
                                </button>
                            ))}
                        </div>
                    )}
                </div>

                <button className="icon-btn">
                    <Bell size={20} />
                </button>
                <button className="icon-btn">
                    <MessageSquare size={20} />
                </button>

                <div className="profile-dropdown-container">
                    <button className="profile-btn">
                        <img
                            src={user?.avatar || `https://ui-avatars.com/api/?name=${encodeURIComponent(user?.name || 'User')}&background=8b5cf6&color=fff`}
                            alt="Profile avatar"
                            className="profile-avatar"
                        />
                        <div className="profile-info">
                            <span className="profile-name">{user?.name || 'User'}</span>
                            <span className="profile-role">{user?.occupation || 'Pro Learner'}</span>
                        </div>
                    </button>

                    <div className="profile-dropdown-menu">
                        <div className="dropdown-user-details">
                            <span className="dropdown-user-name">{user?.name || 'User'}</span>
                            <span className="dropdown-user-email">{user?.email || ''}</span>
                        </div>

                        <button className="dropdown-menu-item" onClick={() => navigate('/app/profile')}>
                            <User size={16} /> My Profile
                        </button>
                        <button className="dropdown-menu-item" onClick={() => navigate('/app/profile')}>
                            <Image size={16} /> Change Avatar
                        </button>
                        <button className="dropdown-menu-item" onClick={() => navigate('/app/settings')}>
                            <Settings size={16} /> Account Settings
                        </button>

                        <button onClick={handleLogout} className="dropdown-menu-item logout">
                            <LogOut size={16} /> Sign Out
                        </button>
                    </div>
                </div>
            </div>
        </header>
    );
}

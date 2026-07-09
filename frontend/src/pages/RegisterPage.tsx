import { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { motion } from 'framer-motion';
import { UserPlus, Mail, Lock, User } from 'lucide-react';
import { useGoogleLogin } from '@react-oauth/google';

export default function RegisterPage() {
    const [name, setName] = useState('');
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [confirm, setConfirm] = useState('');
    const [error, setError] = useState('');
    const [loading, setLoading] = useState(false);
    const [showGoogleModal, setShowGoogleModal] = useState(false);

    const { register, googleLogin } = useAuth();
    const navigate = useNavigate();

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setError('');

        if (password !== confirm) {
            return setError('Passwords do not match');
        }

        setLoading(true);
        try {
            await register(name, email, password);
            navigate('/app');
        } catch (err: any) {
            setError(err.message || 'Registration failed');
        } finally {
            setLoading(false);
        }
    };

    const handleGoogleLoginSelect = async (name: string, email: string, avatar: string, googleId: string) => {
        setShowGoogleModal(false);
        setError('');
        setLoading(true);
        try {
            console.log('Simulated Google login:', { name, email, avatar, googleId });
            await googleLogin(name, email, avatar, googleId);
            navigate('/app');
        } catch (err: any) {
            console.error('Simulated Google login error:', err);
            setError(err.message || 'Google Registration failed');
        } finally {
            setLoading(false);
        }
    };

    const handleGoogleLoginSuccess = async (tokenResponse: any) => {
        setError('');
        setLoading(true);
        try {
            // Use the ID token (credential) for secure backend verification
            const credential = tokenResponse.access_token;
            
            // Also fetch user info for display purposes
            const userInfo = await fetch('https://www.googleapis.com/oauth2/v3/userinfo', {
                headers: { Authorization: `Bearer ${credential}` }
            }).then(res => res.json());

            if (userInfo && userInfo.email) {
                // Send the credential (ID token equivalent) to backend for verification
                await googleLogin(userInfo.name, userInfo.email, userInfo.picture, userInfo.sub, credential);
                navigate('/app');
            } else {
                throw new Error('Failed to retrieve user profile from Google');
            }
        } catch (err: any) {
            setError(err.message || 'Google Registration failed');
        } finally {
            setLoading(false);
        }
    };

    const loginWithGoogle = useGoogleLogin({
        onSuccess: handleGoogleLoginSuccess,
        onError: () => setError('Google Sign-in failed. Please allow popups for this site and try again.'),
        flow: 'implicit', // Use implicit flow to get access token
    });

    const googleClientId = import.meta.env.VITE_GOOGLE_CLIENT_ID || 'your_google_client_id_here';
    const isDummyClientId = googleClientId === 'your_google_client_id_here' || !googleClientId;

    return (
        <div style={{ 
            minHeight: '100vh', 
            display: 'flex', 
            alignItems: 'center', 
            justifyContent: 'center', 
            background: '#ffffff',
            position: 'relative',
            overflow: 'hidden'
        }}>
            <motion.div 
                initial={{ opacity: 0, scale: 0.95 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ duration: 0.8, ease: [0.22, 1, 0.36, 1] }}
                style={{ 
                    width: '90%', 
                    maxWidth: '450px', 
                    padding: '3rem',
                    background: '#ffffff',
                    borderRadius: '16px',
                    boxShadow: '0 4px 24px rgba(0, 0, 0, 0.08)',
                    border: '1px solid #e5e7eb'
                }}
            >
                <motion.div 
                    initial={{ scale: 0.8, opacity: 0 }}
                    animate={{ scale: 1, opacity: 1 }}
                    transition={{ delay: 0.2 }}
                    style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '0.75rem', marginBottom: '2rem' }}
                >
                    <img src="/brainpath-logo.png" alt="BrainPath" style={{ width: '40px', height: '40px', objectFit: 'contain' }} />
                    <h2 style={{ fontSize: '1.75rem', fontWeight: 800, letterSpacing: '-0.5px', color: '#000000' }}>BrainPath</h2>
                </motion.div>

                <motion.h3 
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.3 }}
                    style={{ fontSize: '1.25rem', fontWeight: 600, textAlign: 'center', marginBottom: '1.5rem', color: '#000000' }}
                >
                    Create account
                </motion.h3>

                {error && (
                    <motion.div 
                        initial={{ opacity: 0, scale: 0.95 }}
                        animate={{ opacity: 1, scale: 1 }}
                        style={{ background: '#fee2e2', color: '#dc2626', padding: '0.75rem', borderRadius: '8px', fontSize: '0.875rem', marginBottom: '1.5rem', textAlign: 'center', border: '1px solid #fecaca' }}
                    >
                        {error}
                    </motion.div>
                )}

                <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '1.25rem' }}>
                    <motion.div initial={{ opacity: 0, x: -10 }} animate={{ opacity: 1, x: 0 }} transition={{ delay: 0.4 }}>
                        <label style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '0.4rem', fontSize: '0.75rem', fontWeight: 600, color: '#6b7280', textTransform: 'uppercase' }}>
                            <User size={13} /> Full Name
                        </label>
                        <input
                            type="text"
                            required
                            value={name}
                            onChange={(e) => setName(e.target.value)}
                            style={{ 
                                width: '100%', 
                                padding: '0.75rem 1rem', 
                                borderRadius: '8px', 
                                border: '1px solid #d1d5db', 
                                background: '#ffffff', 
                                color: '#000000',
                                outline: 'none',
                                transition: 'all 0.3s',
                                fontSize: '0.95rem'
                            }}
                            className="auth-input"
                            placeholder="John Doe"
                        />
                    </motion.div>

                    <motion.div initial={{ opacity: 0, x: -10 }} animate={{ opacity: 1, x: 0 }} transition={{ delay: 0.5 }}>
                        <label style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '0.4rem', fontSize: '0.75rem', fontWeight: 600, color: '#6b7280', textTransform: 'uppercase' }}>
                            <Mail size={13} /> Email
                        </label>
                        <input
                            type="email"
                            required
                            value={email}
                            onChange={(e) => setEmail(e.target.value)}
                            style={{ 
                                width: '100%', 
                                padding: '0.75rem 1rem', 
                                borderRadius: '8px', 
                                border: '1px solid #d1d5db', 
                                background: '#ffffff', 
                                color: '#000000',
                                outline: 'none',
                                transition: 'all 0.3s',
                                fontSize: '0.95rem'
                            }}
                            className="auth-input"
                            placeholder="you@example.com"
                        />
                    </motion.div>

                    <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem' }}>
                        <motion.div initial={{ opacity: 0, x: -10 }} animate={{ opacity: 1, x: 0 }} transition={{ delay: 0.6 }}>
                            <label style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '0.4rem', fontSize: '0.75rem', fontWeight: 600, color: '#6b7280', textTransform: 'uppercase' }}>
                                <Lock size={13} /> Password
                            </label>
                            <input
                                type="password"
                                required
                                value={password}
                                onChange={(e) => setPassword(e.target.value)}
                                style={{ 
                                    width: '100%', 
                                    padding: '0.75rem 1rem', 
                                    borderRadius: '8px', 
                                    border: '1px solid #d1d5db', 
                                    background: '#ffffff', 
                                    color: '#000000',
                                    outline: 'none',
                                    transition: 'all 0.3s',
                                    fontSize: '0.95rem'
                                }}
                                className="auth-input"
                                placeholder="••••••••"
                            />
                        </motion.div>
                        <motion.div initial={{ opacity: 0, x: -10 }} animate={{ opacity: 1, x: 0 }} transition={{ delay: 0.7 }}>
                            <label style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '0.4rem', fontSize: '0.75rem', fontWeight: 600, color: '#6b7280', textTransform: 'uppercase' }}>
                                <Lock size={13} /> Confirm
                            </label>
                            <input
                                type="password"
                                required
                                value={confirm}
                                onChange={(e) => setConfirm(e.target.value)}
                                style={{ 
                                    width: '100%', 
                                    padding: '0.75rem 1rem', 
                                    borderRadius: '8px', 
                                    border: '1px solid #d1d5db', 
                                    background: '#ffffff', 
                                    color: '#000000',
                                    outline: 'none',
                                    transition: 'all 0.3s',
                                    fontSize: '0.95rem'
                                }}
                                className="auth-input"
                                placeholder="••••••••"
                            />
                        </motion.div>
                    </div>

                    <motion.button 
                        type="submit" 
                        disabled={loading} 
                        whileHover={{ scale: 1.02 }}
                        whileTap={{ scale: 0.98 }}
                        style={{ 
                            width: '100%', 
                            justifyContent: 'center', 
                            padding: '0.85rem', 
                            marginTop: '0.5rem', 
                            gap: '8px',
                            background: '#000000',
                            color: '#ffffff',
                            border: 'none',
                            borderRadius: '8px',
                            fontSize: '1rem',
                            fontWeight: 600,
                            cursor: 'pointer',
                            transition: 'all 0.3s'
                        }}
                    >
                        {loading ? 'Creating account...' : <><UserPlus size={18} /> Create Account</>}
                    </motion.button>
                </form>

                <div style={{ display: 'flex', alignItems: 'center', margin: '1.5rem 0', gap: '1rem' }}>
                    <div style={{ flex: 1, height: '1px', background: '#e5e7eb' }} />
                    <span style={{ fontSize: '0.75rem', color: '#6b7280', fontWeight: 600, textTransform: 'uppercase', letterSpacing: '0.5px' }}>Or</span>
                    <div style={{ flex: 1, height: '1px', background: '#e5e7eb' }} />
                </div>

                <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '0.75rem', width: '100%' }}>
                    <motion.button 
                        type="button" 
                        onClick={() => isDummyClientId ? setShowGoogleModal(true) : loginWithGoogle()}
                        whileHover={{ scale: 1.02, backgroundColor: '#f9fafb' }}
                        whileTap={{ scale: 0.98 }}
                        style={{ 
                            width: '100%', 
                            justifyContent: 'center', 
                            padding: '0.85rem', 
                            gap: '10px',
                            display: 'flex',
                            alignItems: 'center',
                            background: '#ffffff',
                            border: '1px solid #d1d5db',
                            borderRadius: '8px',
                            color: '#000000',
                            fontWeight: 600,
                            fontSize: '0.9rem',
                            cursor: 'pointer',
                            transition: 'all 0.3s'
                        }}
                    >
                        <svg width="18" height="18" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                            <path d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z" fill="#4285F4"/>
                            <path d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" fill="#34A853"/>
                            <path d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.06H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.94l2.85-2.22.81-.63z" fill="#FBBC05"/>
                            <path d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.06l3.66 2.84c.87-2.6 3.3-4.52 6.16-4.52z" fill="#EA4335"/>
                        </svg>
                        Continue with Google
                    </motion.button>
                    {!isDummyClientId && (
                        <button 
                            type="button" 
                            onClick={() => setShowGoogleModal(true)}
                            style={{ 
                                background: 'none', 
                                border: 'none', 
                                color: '#6b7280', 
                                fontSize: '0.8rem', 
                                cursor: 'pointer',
                                textDecoration: 'underline',
                                marginTop: '0.25rem'
                            }}
                        >
                            Dev Mode: Try Simulated Login
                        </button>
                    )}
                </div>

                <p style={{ textAlign: 'center', marginTop: '1.5rem', fontSize: '0.875rem', color: '#6b7280' }}>
                    Already have an account? <Link to="/login" style={{ color: '#000000', fontWeight: 700, textDecoration: 'none', marginLeft: '8px' }}>Log in</Link>
                </p>
            </motion.div>

            {/* Google Account Chooser Modal */}
            {showGoogleModal && (
                <div style={{
                    position: 'fixed',
                    inset: 0,
                    background: 'rgba(0, 0, 0, 0.5)',
                    backdropFilter: 'blur(4px)',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    zIndex: 1000
                }}>
                    <motion.div 
                        initial={{ scale: 0.9, opacity: 0 }}
                        animate={{ scale: 1, opacity: 1 }}
                        style={{
                            width: '90%',
                            maxWidth: '380px',
                            background: '#ffffff',
                            border: '1px solid #e5e7eb',
                            borderRadius: '16px',
                            padding: '2.5rem',
                            boxShadow: '0 20px 40px rgba(0,0,0,0.1)'
                        }}
                    >
                        <div style={{ textAlign: 'center', marginBottom: '2rem' }}>
                            <svg width="24" height="24" viewBox="0 0 24 24" fill="none" style={{ marginBottom: '1rem' }}>
                                <path d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z" fill="#4285F4"/>
                                <path d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" fill="#34A853"/>
                                <path d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.06H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.94l2.85-2.22.81-.63z" fill="#FBBC05"/>
                                <path d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.06l3.66 2.84c.87-2.6 3.3-4.52 6.16-4.52z" fill="#EA4335"/>
                            </svg>
                            <h4 style={{ fontSize: '1.2rem', fontWeight: 700, margin: 0, color: '#000000' }}>Sign in with Google</h4>
                            <p style={{ fontSize: '0.85rem', color: '#6b7280', marginTop: '4px' }}>to continue to BrainPath</p>
                        </div>

                        <div style={{ display: 'flex', flexDirection: 'column', gap: '0.75rem' }}>
                            {[
                                { id: 'google-alex-12345', name: 'Alex Johnson', email: 'alex.johnson@gmail.com', avatar: 'https://ui-avatars.com/api/?name=Alex+Johnson&background=8b5cf6&color=fff' },
                                { id: 'google-udit-67890', name: 'Udit Kumar', email: 'udit.k@gmail.com', avatar: 'https://ui-avatars.com/api/?name=Udit+Kumar&background=06b6d4&color=fff' }
                            ].map((acc, idx) => (
                                <button
                                    key={idx}
                                    type="button"
                                    onClick={() => handleGoogleLoginSelect(acc.name, acc.email, acc.avatar, acc.id)}
                                    style={{
                                        display: 'flex',
                                        alignItems: 'center',
                                        gap: '12px',
                                        width: '100%',
                                        padding: '0.85rem 1rem',
                                        background: '#ffffff',
                                        border: '1px solid #e5e7eb',
                                        borderRadius: '8px',
                                        cursor: 'pointer',
                                        textAlign: 'left',
                                        transition: 'all 0.2s'
                                    }}
                                    className="google-acc-btn"
                                >
                                    <img src={acc.avatar} alt={acc.name} style={{ width: '32px', height: '32px', borderRadius: '50%' }} />
                                    <div style={{ flex: 1 }}>
                                        <div style={{ fontSize: '0.85rem', fontWeight: 600, color: '#000000' }}>{acc.name}</div>
                                        <div style={{ fontSize: '0.75rem', color: '#6b7280' }}>{acc.email}</div>
                                    </div>
                                </button>
                            ))}
                        </div>

                        <button
                            type="button"
                            onClick={() => setShowGoogleModal(false)}
                            style={{
                                width: '100%',
                                marginTop: '1.5rem',
                                padding: '0.75rem',
                                background: 'none',
                                border: 'none',
                                color: '#6b7280',
                                cursor: 'pointer',
                                fontSize: '0.85rem',
                                fontWeight: 600
                            }}
                        >
                            Cancel
                        </button>
                    </motion.div>
                </div>
            )}

            <style>{`
                .auth-input:focus {
                    border-color: #000000 !important;
                    box-shadow: 0 0 0 3px rgba(0, 0, 0, 0.1) !important;
                }
                .google-acc-btn:hover {
                    background: #f9fafb !important;
                    border-color: #d1d5db !important;
                }
            `}</style>
        </div>
    );
}

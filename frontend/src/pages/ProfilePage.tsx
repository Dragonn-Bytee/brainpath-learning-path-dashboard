import { useState, useEffect, useRef } from 'react';
import { useAuth } from '../context/AuthContext';
import { fetchProfile, updateProfile } from '../services/api';
import { Camera, Save, User as UserIcon, Mail, Briefcase, CheckCircle } from 'lucide-react';
import Toast from '../components/Toast';

export default function ProfilePage() {
    const { user, updateUser } = useAuth();
    const [name, setName] = useState(user?.name || '');
    const [occupation, setOccupation] = useState(user?.occupation || '');
    const [email] = useState(user?.email || '');
    const [avatarPreview, setAvatarPreview] = useState(user?.avatar || '');
    const [avatarData, setAvatarData] = useState<string | null>(null);
    const [saving, setSaving] = useState(false);
    const [toast, setToast] = useState<{ show: boolean, message: string, type: 'success' | 'error' } | null>(null);
    const fileRef = useRef<HTMLInputElement>(null);

    useEffect(() => {
        fetchProfile().then(profile => {
            setName(profile.name);
            setOccupation(profile.occupation || '');
            if (profile.avatar) setAvatarPreview(profile.avatar);
        }).catch(() => { });
    }, []);

    const handleAvatarChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files?.[0];
        if (!file) return;
        if (file.size > 2 * 1024 * 1024) {
            setToast({ show: true, message: 'Image must be under 2MB', type: 'error' });
            return;
        }
        const reader = new FileReader();
        reader.onloadend = () => {
            const result = reader.result as string;
            setAvatarPreview(result);
            setAvatarData(result);
        };
        reader.readAsDataURL(file);
    };

    const handleSave = async () => {
        setSaving(true);
        try {
            const payload: { name?: string; occupation?: string; avatar?: string } = { name, occupation };
            if (avatarData) payload.avatar = avatarData;
            const updated = await updateProfile(payload);
            updateUser({ ...user!, ...updated });
            setToast({ show: true, message: 'Profile updated successfully! ✨', type: 'success' });
        } catch (err) {
            setToast({ show: true, message: 'Failed to update profile.', type: 'error' });
        } finally {
            setSaving(false);
        }
    };

    const avatarSrc = avatarPreview || `https://ui-avatars.com/api/?name=${encodeURIComponent(name || 'User')}&background=8b5cf6&color=fff&size=200`;

    return (
        <div style={{ maxWidth: '700px', margin: '0 auto' }}>
            <div style={{ marginBottom: '2rem' }}>
                <h1 style={{ fontSize: '2rem', fontWeight: 700, marginBottom: '0.5rem' }}>My Profile</h1>
                <p style={{ color: 'var(--text-muted)' }}>Manage your personal information and preferences.</p>
            </div>

            <div className="glass-panel card-base" style={{ padding: '2.5rem' }}>
                {/* Avatar Section */}
                <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', marginBottom: '2.5rem' }}>
                    <div style={{ position: 'relative', marginBottom: '1rem' }}>
                        <img
                            src={avatarSrc}
                            alt="Profile"
                            style={{
                                width: '120px', height: '120px', borderRadius: '50%',
                                objectFit: 'cover', border: '4px solid var(--color-primary)',
                                boxShadow: '0 8px 32px rgba(139, 92, 246, 0.25)'
                            }}
                        />
                        <button
                            onClick={() => fileRef.current?.click()}
                            style={{
                                position: 'absolute', bottom: '4px', right: '4px',
                                width: '36px', height: '36px', borderRadius: '50%',
                                background: 'var(--color-primary)', color: 'white',
                                display: 'flex', alignItems: 'center', justifyContent: 'center',
                                border: '3px solid rgba(30, 30, 35, 0.9)', cursor: 'pointer',
                                transition: 'transform 0.2s'
                            }}
                            onMouseEnter={e => (e.currentTarget.style.transform = 'scale(1.1)')}
                            onMouseLeave={e => (e.currentTarget.style.transform = 'scale(1)')}
                        >
                            <Camera size={16} />
                        </button>
                        <input
                            ref={fileRef}
                            type="file"
                            accept="image/*"
                            onChange={handleAvatarChange}
                            style={{ display: 'none' }}
                        />
                    </div>
                    <p style={{ color: 'var(--text-muted)', fontSize: '0.85rem' }}>Click the camera icon to upload a photo (max 2MB)</p>
                </div>

                {/* Form Fields */}
                <div style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>
                    <div>
                        <label style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', marginBottom: '0.5rem', fontSize: '0.875rem', fontWeight: 600, color: 'var(--text-muted)' }}>
                            <UserIcon size={14} /> Full Name
                        </label>
                        <input
                            type="text"
                            value={name}
                            onChange={e => setName(e.target.value)}
                            style={{
                                width: '100%', padding: '0.85rem 1rem', borderRadius: '12px',
                                border: '1px solid var(--glass-border)', background: 'rgba(255,255,255,0.05)',
                                color: 'var(--text-main)', outline: 'none', fontFamily: 'inherit',
                                fontSize: '0.95rem', transition: 'border-color 0.2s'
                            }}
                            placeholder="Your name"
                        />
                    </div>

                    <div>
                        <label style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', marginBottom: '0.5rem', fontSize: '0.875rem', fontWeight: 600, color: 'var(--text-muted)' }}>
                            <Mail size={14} /> Email Address
                        </label>
                        <input
                            type="email"
                            value={email}
                            disabled
                            style={{
                                width: '100%', padding: '0.85rem 1rem', borderRadius: '12px',
                                border: '1px solid var(--glass-border)', background: 'rgba(255,255,255,0.02)',
                                color: 'var(--text-muted)', outline: 'none', fontFamily: 'inherit',
                                fontSize: '0.95rem', cursor: 'not-allowed', opacity: 0.6
                            }}
                        />
                        <p style={{ fontSize: '0.75rem', color: 'var(--text-muted)', marginTop: '0.4rem', opacity: 0.7 }}>Email cannot be changed</p>
                    </div>

                    <div>
                        <label style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', marginBottom: '0.5rem', fontSize: '0.875rem', fontWeight: 600, color: 'var(--text-muted)' }}>
                            <Briefcase size={14} /> Occupation
                        </label>
                        <input
                            type="text"
                            value={occupation}
                            onChange={e => setOccupation(e.target.value)}
                            style={{
                                width: '100%', padding: '0.85rem 1rem', borderRadius: '12px',
                                border: '1px solid var(--glass-border)', background: 'rgba(255,255,255,0.05)',
                                color: 'var(--text-main)', outline: 'none', fontFamily: 'inherit',
                                fontSize: '0.95rem', transition: 'border-color 0.2s'
                            }}
                            placeholder="e.g. Software Developer, Student, Data Scientist..."
                        />
                    </div>
                </div>

                {/* Save Button */}
                <button
                    onClick={handleSave}
                    disabled={saving}
                    style={{
                        marginTop: '2rem', width: '100%', padding: '0.85rem',
                        borderRadius: '12px', background: 'var(--color-primary)',
                        color: 'white', fontWeight: 600, fontSize: '1rem',
                        display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '8px',
                        border: 'none', cursor: saving ? 'wait' : 'pointer',
                        transition: 'all 0.3s', opacity: saving ? 0.7 : 1,
                        boxShadow: '0 4px 15px rgba(139, 92, 246, 0.3)'
                    }}
                    onMouseEnter={e => { if (!saving) e.currentTarget.style.transform = 'translateY(-2px)'; }}
                    onMouseLeave={e => { e.currentTarget.style.transform = 'translateY(0)'; }}
                >
                    {saving ? (
                        <><Save size={18} /> Saving...</>
                    ) : (
                        <><CheckCircle size={18} /> Save Changes</>
                    )}
                </button>
            </div>

            {toast?.show && (
                <Toast message={toast.message} type={toast.type} onClose={() => setToast(null)} />
            )}
        </div>
    );
}

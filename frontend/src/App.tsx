import Sidebar from './components/Sidebar';
import Header from './components/Header';
import { Routes, Route, Navigate } from 'react-router-dom';
import Dashboard from './pages/Dashboard';
import MyCourses from './pages/MyCourses';
import ExploreCourses from './pages/ExploreCourses';
import AIAssistantPage from './pages/AIAssistantPage';
import CoursePlayer from './pages/CoursePlayer';
import ProfilePage from './pages/ProfilePage';
import LoginPage from './pages/LoginPage';
import RegisterPage from './pages/RegisterPage';
import LandingPage from './pages/LandingPage';
import { AuthProvider, useAuth } from './context/AuthContext';
import { motion } from 'framer-motion';
import './App.css';

const DummyPage = ({ title }: { title: string }) => (
  <div className="glass-panel card-base h-full flex items-center justify-center min-h-[400px]" style={{ minHeight: 400, display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', gap: '0.5rem' }}>
    <h2 style={{ fontSize: '1.5rem', fontWeight: 700 }}>{title}</h2>
    <p style={{ color: 'var(--text-muted)' }}>This page is under construction.</p>
  </div>
);

const ProtectedRoute = ({ children }: { children: JSX.Element }) => {
  const { token, loading } = useAuth();
  if (loading) return <div className="app-container" style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', background: 'var(--bg-gradient)' }}>Loading...</div>;
  if (!token) return <Navigate to="/login" replace />;
  return children;
};

const DashboardLayout = () => {
  return (
    <motion.div
      className="app-container"
      initial={{ opacity: 0, scale: 0.97 }}
      animate={{ opacity: 1, scale: 1 }}
      transition={{ duration: 0.5, ease: [0.22, 1, 0.36, 1] }}
    >
      <Sidebar />
      <main className="main-wrapper">
        <Header />
        <div className="main-content">
          <Routes>
            <Route path="/" element={<Dashboard />} />
            <Route path="/notifications" element={<DummyPage title="Notifications" />} />
            <Route path="/my-courses" element={<MyCourses />} />
            <Route path="/explore" element={<ExploreCourses />} />
            <Route path="/course/:courseId" element={<CoursePlayer />} />
            <Route path="/ai-assistant" element={<AIAssistantPage />} />
            <Route path="/profile" element={<ProfilePage />} />
            <Route path="/assignments" element={<DummyPage title="Assignments" />} />
            <Route path="/certificates" element={<DummyPage title="Certificates" />} />
            <Route path="/settings" element={<DummyPage title="Settings" />} />
          </Routes>
        </div>
      </main>
    </motion.div>
  );
};

function App() {
  return (
    <AuthProvider>
      <Routes>
        {/* Public routes */}
        <Route path="/" element={<LandingPage />} />
        <Route path="/login" element={<LoginPage />} />
        <Route path="/register" element={<RegisterPage />} />
        {/* Protected app routes */}
        <Route path="/app/*" element={
          <ProtectedRoute>
            <DashboardLayout />
          </ProtectedRoute>
        } />
        {/* Fallback: redirect old /dashboard etc. to /app */}
        <Route path="*" element={<Navigate to="/app" replace />} />
      </Routes>
    </AuthProvider>
  );
}

export default App;

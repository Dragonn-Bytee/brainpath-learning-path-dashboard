import { NavLink } from 'react-router-dom';
import { motion } from 'framer-motion';
import {
  LayoutDashboard,
  Bell,
  BookOpen,
  Compass,
  Bot,
  CheckSquare,
  Award,
  Settings
} from 'lucide-react';
import ThemeSwitcher from './ThemeSwitcher';

const NavItem = ({ to, icon: Icon, children, end = false, gradient = false }: { to: string, icon: any, children: React.ReactNode, end?: boolean, gradient?: boolean }) => (
  <motion.div
    whileHover={{ x: 6, scale: 1.02 }}
    transition={{ type: 'spring', stiffness: 500, damping: 30 }}
  >
    <NavLink to={to} end={end} className={({ isActive }) => `nav-item ${isActive ? 'active' : ''}`}>
      <Icon size={20} />
      <span className={gradient ? "text-gradient font-semibold" : ""}>{children}</span>
    </NavLink>
  </motion.div>
);

export default function Sidebar() {
  const sectionVariants = {
    hidden: { opacity: 0, x: -20 },
    visible: (i: number) => ({
      opacity: 1,
      x: 0,
      transition: { delay: i * 0.1, duration: 0.5, ease: [0.22, 1, 0.36, 1] as const }
    })
  };

  return (
    <motion.aside 
      initial={{ x: -260 }}
      animate={{ x: 0 }}
      transition={{ duration: 0.8, ease: [0.22, 1, 0.36, 1] }}
      className="sidebar glass-panel"
    >
      <NavLink to="/app" className="logo-section" style={{ textDecoration: 'none', color: 'inherit' }}>
        <motion.div 
          whileHover={{ scale: 1.05 }}
          style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}
        >
          <img src="/brainpath-logo.png" alt="BrainPath" className="logo-img" />
          <div className="logo-text">BrainPath</div>
        </motion.div>
      </NavLink>

      <nav className="nav-links">
        <motion.div custom={1} initial="hidden" animate="visible" variants={sectionVariants}>
          <div className="nav-section-title">Menu</div>
          <NavItem to="/app" icon={LayoutDashboard} end>Dashboard</NavItem>
          <NavItem to="/app/notifications" icon={Bell}>Notifications</NavItem>
        </motion.div>

        <motion.div custom={2} initial="hidden" animate="visible" variants={sectionVariants}>
          <div className="nav-section-title">Learning</div>
          <NavItem to="/app/my-courses" icon={BookOpen}>My Courses</NavItem>
          <NavItem to="/app/explore" icon={Compass}>Explore Courses</NavItem>
          <NavItem to="/app/ai-assistant" icon={Bot} gradient>AI Assistant</NavItem>
          <NavItem to="/app/assignments" icon={CheckSquare}>Assignments</NavItem>
          <NavItem to="/app/certificates" icon={Award}>Certificates</NavItem>
        </motion.div>

        <motion.div 
          custom={3} 
          initial="hidden" 
          animate="visible" 
          variants={sectionVariants}
          style={{ marginTop: 'auto' }}
        >
          <div className="nav-section-title">General</div>
          <NavItem to="/app/settings" icon={Settings}>Settings</NavItem>
        </motion.div>
      </nav>

      {/* Theme switcher at bottom of sidebar */}
      <motion.div 
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 1 }}
        style={{ marginTop: '1.5rem', padding: '0.75rem', borderTop: '1px solid var(--glass-border)', display: 'flex', alignItems: 'center', justifyContent: 'space-between', gap: '0.5rem' }}
      >
        <span style={{ fontSize: '0.75rem', color: 'var(--text-muted)', fontWeight: 600, letterSpacing: '1px', textTransform: 'uppercase' }}>Theme</span>
        <ThemeSwitcher />
      </motion.div>
    </motion.aside>
  );
}

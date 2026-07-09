import { useState, useRef } from 'react';
import { useTheme, THEMES, ThemeId } from '../context/ThemeContext';
import { Palette } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

export default function ThemeSwitcher() {
  const { theme, setTheme } = useTheme();
  const [open, setOpen] = useState(false);
  const btnRef = useRef<HTMLButtonElement>(null);

  return (
    <div style={{ position: 'relative' }}>
      <motion.button
        ref={btnRef}
        onClick={() => setOpen(o => !o)}
        className="icon-btn"
        whileHover={{ scale: 1.1 }}
        whileTap={{ scale: 0.95 }}
        title="Change Theme"
        style={{
          background: `linear-gradient(135deg, var(--color-primary), var(--color-secondary))`,
          border: 'none',
          color: '#fff',
          boxShadow: `0 0 12px color-mix(in srgb, var(--color-primary) 60%, transparent)`,
        }}
      >
        <Palette size={18} />
      </motion.button>

      <AnimatePresence>
        {open && (
          <>
            {/* Backdrop */}
            <div
              style={{ position: 'fixed', inset: 0, zIndex: 99 }}
              onClick={() => setOpen(false)}
            />
            <motion.div
              initial={{ opacity: 0, y: 10, scale: 0.92 }}
              animate={{ opacity: 1, y: 0, scale: 1 }}
              exit={{ opacity: 0, y: 10, scale: 0.92 }}
              transition={{ type: 'spring', stiffness: 340, damping: 26 }}
              style={{
                position: 'absolute',
                bottom: 'calc(100% + 12px)',
                right: 0,
                width: '220px',
                background: 'var(--glass-bg)',
                backdropFilter: 'blur(24px)',
                WebkitBackdropFilter: 'blur(24px)',
                border: '1px solid var(--glass-border)',
                borderRadius: '16px',
                padding: '0.75rem',
                zIndex: 100,
                boxShadow: '0 20px 40px rgba(0,0,0,0.5)',
              }}
            >
              <p style={{ fontSize: '0.7rem', fontWeight: 700, letterSpacing: '2px', textTransform: 'uppercase', color: 'var(--text-muted)', padding: '0.25rem 0.5rem 0.5rem' }}>
                Choose Theme
              </p>
              {THEMES.map(t => {
                const isActive = t.id === theme.id;
                return (
                  <motion.button
                    key={t.id}
                    onClick={() => { setTheme(t.id as ThemeId); setOpen(false); }}
                    whileHover={{ x: 4, backgroundColor: 'rgba(255,255,255,0.06)' }}
                    style={{
                      display: 'flex',
                      alignItems: 'center',
                      gap: '10px',
                      width: '100%',
                      padding: '0.6rem 0.75rem',
                      borderRadius: '10px',
                      background: isActive ? `color-mix(in srgb, ${t.vars['--color-primary']} 15%, transparent)` : 'transparent',
                      border: isActive ? `1px solid color-mix(in srgb, ${t.vars['--color-primary']} 40%, transparent)` : '1px solid transparent',
                      color: 'var(--text-main)',
                      cursor: 'pointer',
                      textAlign: 'left',
                      transition: 'all 0.2s',
                    }}
                  >
                    <span style={{
                      width: '26px',
                      height: '26px',
                      borderRadius: '8px',
                      background: `linear-gradient(135deg, ${t.vars['--color-primary']}, ${t.vars['--color-secondary']})`,
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      fontSize: '14px',
                      flexShrink: 0,
                      boxShadow: `0 4px 10px ${t.vars['--color-primary']}50`,
                    }}>
                      {t.emoji}
                    </span>
                    <div>
                      <div style={{ fontSize: '0.85rem', fontWeight: 600 }}>{t.name}</div>
                      {isActive && <div style={{ fontSize: '0.65rem', color: t.vars['--color-primary'], fontWeight: 600 }}>Active</div>}
                    </div>
                    {isActive && (
                      <div style={{ marginLeft: 'auto', width: '8px', height: '8px', borderRadius: '50%', background: t.vars['--color-primary'], boxShadow: `0 0 6px ${t.vars['--color-primary']}` }} />
                    )}
                  </motion.button>
                );
              })}
            </motion.div>
          </>
        )}
      </AnimatePresence>
    </div>
  );
}

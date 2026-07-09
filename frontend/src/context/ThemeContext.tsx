import { createContext, useContext, useState, useEffect, ReactNode } from 'react';

export type ThemeId = 'nebula' | 'aurora' | 'midnight' | 'crimson' | 'ocean' | 'crystal' | 'cloud';

interface Theme {
  id: ThemeId;
  name: string;
  emoji: string;
  vars: Record<string, string>;
}

export const THEMES: Theme[] = [
  {
    id: 'nebula',
    name: 'Nebula',
    emoji: '🌌',
    vars: {
      '--bg-start': '#0a0a0f',
      '--bg-mid': '#141225',
      '--bg-end': '#0f0d1a',
      '--color-primary': '#8b5cf6',
      '--color-primary-hover': '#7c3aed',
      '--color-secondary': '#06b6d4',
      '--glass-bg': 'rgba(22, 22, 30, 0.4)',
      '--glass-border': 'rgba(255,255,255,0.08)',
      '--blob-color1': 'rgba(139,92,246,0.15)',
      '--blob-color2': 'rgba(6,182,212,0.1)',
      '--grid-color': 'rgba(139,92,246,0.05)',
      '--text-main': '#f1f5f9',
      '--text-muted': '#64748b',
    },
  },
  {
    id: 'aurora',
    name: 'Aurora',
    emoji: '🌿',
    vars: {
      '--bg-start': '#050f0a',
      '--bg-mid': '#0a1f15',
      '--bg-end': '#081510',
      '--color-primary': '#10b981',
      '--color-primary-hover': '#059669',
      '--color-secondary': '#34d399',
      '--glass-bg': 'rgba(10, 31, 21, 0.45)',
      '--glass-border': 'rgba(16,185,129,0.1)',
      '--blob-color1': 'rgba(16,185,129,0.15)',
      '--blob-color2': 'rgba(52,211,153,0.08)',
      '--grid-color': 'rgba(16,185,129,0.05)',
      '--text-main': '#ecfdf5',
      '--text-muted': '#6b7280',
    },
  },
  {
    id: 'midnight',
    name: 'Midnight',
    emoji: '🌙',
    vars: {
      '--bg-start': '#080c14',
      '--bg-mid': '#0d1526',
      '--bg-end': '#090e1c',
      '--color-primary': '#3b82f6',
      '--color-primary-hover': '#2563eb',
      '--color-secondary': '#60a5fa',
      '--glass-bg': 'rgba(13, 21, 38, 0.45)',
      '--glass-border': 'rgba(59,130,246,0.1)',
      '--blob-color1': 'rgba(59,130,246,0.15)',
      '--blob-color2': 'rgba(96,165,250,0.08)',
      '--grid-color': 'rgba(59,130,246,0.05)',
      '--text-main': '#f0f4ff',
      '--text-muted': '#64748b',
    },
  },
  {
    id: 'crimson',
    name: 'Crimson',
    emoji: '🔥',
    vars: {
      '--bg-start': '#110508',
      '--bg-mid': '#220a10',
      '--bg-end': '#180608',
      '--color-primary': '#ef4444',
      '--color-primary-hover': '#dc2626',
      '--color-secondary': '#f97316',
      '--glass-bg': 'rgba(34, 10, 16, 0.45)',
      '--glass-border': 'rgba(239,68,68,0.1)',
      '--blob-color1': 'rgba(239,68,68,0.15)',
      '--blob-color2': 'rgba(249,115,22,0.08)',
      '--grid-color': 'rgba(239,68,68,0.05)',
      '--text-main': '#fff1f2',
      '--text-muted': '#78716c',
    },
  },
  {
    id: 'ocean',
    name: 'Ocean',
    emoji: '🌊',
    vars: {
      '--bg-start': '#020e18',
      '--bg-mid': '#041c2e',
      '--bg-end': '#031422',
      '--color-primary': '#0ea5e9',
      '--color-primary-hover': '#0284c7',
      '--color-secondary': '#38bdf8',
      '--glass-bg': 'rgba(4, 28, 46, 0.45)',
      '--glass-border': 'rgba(14,165,233,0.1)',
      '--blob-color1': 'rgba(14,165,233,0.15)',
      '--blob-color2': 'rgba(56,189,248,0.08)',
      '--grid-color': 'rgba(14,165,233,0.05)',
      '--text-main': '#f0f9ff',
      '--text-muted': '#64748b',
    },
  },
  {
    id: 'crystal',
    name: 'Crystal',
    emoji: '💎',
    vars: {
      '--bg-start': '#f8fafc',
      '--bg-mid': '#f1f5f9',
      '--bg-end': '#e2e8f0',
      '--color-primary': '#6366f1',
      '--color-primary-hover': '#4f46e5',
      '--color-secondary': '#06b6d4',
      '--glass-bg': 'rgba(255, 255, 255, 0.7)',
      '--glass-border': 'rgba(99, 102, 241, 0.15)',
      '--blob-color1': 'rgba(99, 102, 241, 0.12)',
      '--blob-color2': 'rgba(6, 182, 212, 0.08)',
      '--grid-color': 'rgba(99, 102, 241, 0.06)',
      '--text-main': '#1e293b',
      '--text-muted': '#475569',
    },
  },
  {
    id: 'cloud',
    name: 'Cloud',
    emoji: '☁️',
    vars: {
      '--bg-start': '#ffffff',
      '--bg-mid': '#f9fafb',
      '--bg-end': '#f3f4f6',
      '--color-primary': '#2563eb',
      '--color-primary-hover': '#1d4ed8',
      '--color-secondary': '#3b82f6',
      '--glass-bg': 'rgba(255, 255, 255, 0.85)',
      '--glass-border': 'rgba(0, 0, 0, 0.05)',
      '--blob-color1': 'rgba(37, 99, 235, 0.08)',
      '--blob-color2': 'rgba(59, 130, 246, 0.05)',
      '--grid-color': 'rgba(0, 0, 0, 0.02)',
      '--text-main': '#111827',
      '--text-muted': '#6b7280',
    },
  },
];

interface ThemeContextValue {
  theme: Theme;
  setTheme: (id: ThemeId) => void;
}

const ThemeContext = createContext<ThemeContextValue>({
  theme: THEMES[0],
  setTheme: () => {},
});

export function ThemeProvider({ children }: { children: ReactNode }) {
  const [themeId, setThemeId] = useState<ThemeId>(() => {
    return (localStorage.getItem('brainpath-theme') as ThemeId) || 'nebula';
  });

  const theme = THEMES.find(t => t.id === themeId) || THEMES[0];

  useEffect(() => {
    const root = document.documentElement;
    Object.entries(theme.vars).forEach(([key, val]) => {
      root.style.setProperty(key, val);
    });
    // Update bg-gradient using the theme's bg vars
    root.style.setProperty(
      '--bg-gradient',
      `linear-gradient(145deg, var(--bg-start) 0%, var(--bg-mid) 50%, var(--bg-end) 100%)`
    );
    localStorage.setItem('brainpath-theme', themeId);
  }, [themeId, theme]);

  return (
    <ThemeContext.Provider value={{ theme, setTheme: setThemeId }}>
      {children}
    </ThemeContext.Provider>
  );
}

export const useTheme = () => useContext(ThemeContext);

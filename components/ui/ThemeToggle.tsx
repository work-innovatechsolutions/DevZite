'use client';

import { useTheme } from '@/providers/ThemeProvider';
import { useEffect, useState } from 'react';
import { Sun, Moon } from 'lucide-react';
import { useCursorState } from '@/providers/CursorProvider';

export function ThemeToggle({ className = '' }: { className?: string }) {
  const { theme, setTheme } = useTheme();
  const [mounted, setMounted] = useState(false);
  const { setState } = useCursorState();

  useEffect(() => {
    setMounted(true);
  }, []);

  if (!mounted) {
    return (
      <div className={`w-9 h-9 rounded-lg glass flex items-center justify-center opacity-50 ${className}`} />
    );
  }

  const isDark = theme === 'dark';

  return (
    <button
      onClick={() => setTheme(isDark ? 'light' : 'dark')}
      onMouseEnter={() => setState('hover-button')}
      onMouseLeave={() => setState('idle')}
      aria-label={isDark ? 'Switch to light mode' : 'Switch to dark mode'}
      title={isDark ? 'Switch to Light Mode' : 'Switch to Dark Mode'}
      className={`relative w-9 h-9 rounded-lg glass flex items-center justify-center text-[#94A3B8] hover:text-[#3B82F6] transition-colors duration-200 cursor-pointer overflow-hidden ${className}`}
    >
      {isDark ? (
        <Sun size={18} className="text-[#FFBD2E]" />
      ) : (
        <Moon size={18} className="text-[#3B82F6]" />
      )}
    </button>
  );
}

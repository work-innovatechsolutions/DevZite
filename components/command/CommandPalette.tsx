'use client';

import { useEffect, useCallback } from 'react';
import { useRouter } from 'next/navigation';
import { motion, AnimatePresence } from 'framer-motion';
import {
  Home, Briefcase, FlaskConical, FileText, Phone,
  Volume2, VolumeX, Search, ArrowRight,
} from 'lucide-react';
import { useCommandPalette } from '@/providers/CommandPaletteProvider';
import { useSound } from '@/providers/SoundProvider';
import { DURATION, EASE } from '@/lib/motion/tokens';
import type { CommandItem } from '@/types';
import { useState } from 'react';

const STATIC_COMMANDS: CommandItem[] = [
  { id: 'home',     label: 'Go Home',          description: 'Back to homepage',       icon: 'home',     href: '/',         group: 'pages', keywords: ['home', 'main'] },
  { id: 'services', label: 'Services',          description: 'What we build',          icon: 'briefcase',href: '/services', group: 'pages', keywords: ['services', 'work', 'build'] },
  { id: 'projects', label: 'Our Work',          description: 'Portfolio & case studies',icon: 'briefcase',href: '/projects', group: 'pages', keywords: ['projects', 'portfolio', 'work'] },
  { id: 'lab',      label: 'Our Lab',           description: 'Experiments & open source',icon: 'flask', href: '/lab',      group: 'pages', keywords: ['lab', 'experiments'] },
  { id: 'blog',     label: 'Blog',              description: 'Articles & tutorials',   icon: 'file',     href: '/blog',     group: 'pages', keywords: ['blog', 'articles', 'writing'] },
  { id: 'contact',  label: 'Start a Project',   description: 'Get in touch',           icon: 'phone',    href: '/contact',  group: 'pages', keywords: ['contact', 'hire', 'project'] },
  { id: 'about',    label: 'About Us',          description: 'Our story & values',     icon: 'home',     href: '/about',    group: 'pages', keywords: ['about', 'team', 'story'] },
];

const ICON_MAP: Record<string, typeof Home> = {
  home:      Home,
  briefcase: Briefcase,
  flask:     FlaskConical,
  file:      FileText,
  phone:     Phone,
};

function CommandIcon({ name }: { name?: string }) {
  const Icon = name ? (ICON_MAP[name] ?? Search) : Search;
  return <Icon size={16} className="text-[#64748B]" />;
}

export function CommandPalette() {
  const { isOpen, close } = useCommandPalette();
  const { isEnabled: soundOn, toggle: toggleSound } = useSound();
  const router = useRouter();
  const [query, setQuery] = useState('');
  const [selected, setSelected] = useState(0);

  const allCommands: CommandItem[] = [
    ...STATIC_COMMANDS,
    {
      id: 'sound',
      label: soundOn ? 'Disable Ambient Sound' : 'Enable Ambient Sound',
      description: soundOn ? 'Turn off background music' : 'Turn on background ambience',
      icon: soundOn ? 'volume-x' : 'volume',
      group: 'actions',
      action: toggleSound,
    },
  ];

  const filtered = query
    ? allCommands.filter((cmd) =>
        cmd.label.toLowerCase().includes(query.toLowerCase()) ||
        cmd.description?.toLowerCase().includes(query.toLowerCase()) ||
        cmd.keywords?.some((k) => k.includes(query.toLowerCase()))
      )
    : allCommands;

  const execute = useCallback((cmd: CommandItem) => {
    close();
    setQuery('');
    if (cmd.href) router.push(cmd.href);
    if (cmd.action) cmd.action();
  }, [close, router]);

  // Keyboard navigation
  useEffect(() => {
    if (!isOpen) return;
    setSelected(0);

    const handler = (e: KeyboardEvent) => {
      if (e.key === 'Escape') { close(); return; }
      if (e.key === 'ArrowDown') {
        e.preventDefault();
        setSelected((p) => Math.min(p + 1, filtered.length - 1));
      }
      if (e.key === 'ArrowUp') {
        e.preventDefault();
        setSelected((p) => Math.max(p - 1, 0));
      }
      if (e.key === 'Enter') {
        e.preventDefault();
        if (filtered[selected]) execute(filtered[selected]);
      }
    };

    window.addEventListener('keydown', handler);
    return () => window.removeEventListener('keydown', handler);
  }, [isOpen, filtered, selected, execute, close]);

  // Group by category
  const grouped = filtered.reduce<Record<string, CommandItem[]>>((acc, cmd) => {
    (acc[cmd.group] ??= []).push(cmd);
    return acc;
  }, {});

  const GROUP_LABELS: Record<string, string> = {
    pages:    'Pages',
    projects: 'Projects',
    blog:     'Blog',
    services: 'Services',
    actions:  'Actions',
  };

  return (
    <AnimatePresence>
      {isOpen && (
        <>
          {/* Backdrop */}
          <motion.div
            className="fixed inset-0 z-[400] bg-black/60 backdrop-blur-sm"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: DURATION.fast }}
            onClick={close}
          />

          {/* Palette */}
          <motion.div
            className="fixed top-[20vh] left-1/2 z-[401] w-full max-w-lg -translate-x-1/2 rounded-2xl glass-strong overflow-hidden shadow-[0_32px_80px_rgba(0,0,0,0.8)]"
            initial={{ opacity: 0, scale: 0.95, y: -16 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.95, y: -16 }}
            transition={{ duration: DURATION.medium, ease: EASE.premium }}
          >
            {/* Search input */}
            <div className="flex items-center gap-3 px-4 py-4 border-b border-[rgba(255,255,255,0.06)]">
              <Search size={16} className="text-[#64748B] shrink-0" />
              <input
                type="text"
                value={query}
                onChange={(e) => { setQuery(e.target.value); setSelected(0); }}
                placeholder="Search pages, projects, actions..."
                className="flex-1 bg-transparent text-[#F8FAFC] text-sm placeholder-[#475569] outline-none font-body"
                autoFocus
                aria-label="Search command palette"
              />
              {query && (
                <button onClick={() => setQuery('')} className="text-[#475569] hover:text-[#94A3B8] text-xs">
                  ✕
                </button>
              )}
            </div>

            {/* Results */}
            <div className="max-h-80 overflow-y-auto p-2">
              {filtered.length === 0 ? (
                <p className="px-3 py-8 text-center text-sm text-[#475569]">
                  No results for &ldquo;{query}&rdquo;
                </p>
              ) : (
                Object.entries(grouped).map(([group, items]) => (
                  <div key={group} className="mb-2">
                    <p className="px-3 py-1.5 text-[10px] font-semibold uppercase tracking-widest text-[#475569]">
                      {GROUP_LABELS[group] ?? group}
                    </p>
                    {items.map((cmd) => {
                      const globalIdx = filtered.indexOf(cmd);
                      return (
                        <button
                          key={cmd.id}
                          onClick={() => execute(cmd)}
                          onMouseEnter={() => setSelected(globalIdx)}
                          className={`w-full flex items-center gap-3 px-3 py-2.5 rounded-lg text-left transition-colors duration-100 ${
                            globalIdx === selected
                              ? 'bg-[rgba(59,130,246,0.15)] text-[#F8FAFC]'
                              : 'text-[#94A3B8] hover:text-[#F8FAFC]'
                          }`}
                        >
                          <CommandIcon name={cmd.icon} />
                          <div className="flex-1 min-w-0">
                            <span className="text-sm font-medium block truncate">{cmd.label}</span>
                            {cmd.description && (
                              <span className="text-xs text-[#64748B] block truncate">{cmd.description}</span>
                            )}
                          </div>
                          {globalIdx === selected && (
                            <ArrowRight size={14} className="text-[#3B82F6] shrink-0" />
                          )}
                        </button>
                      );
                    })}
                  </div>
                ))
              )}
            </div>

            {/* Footer shortcuts */}
            <div className="border-t border-[rgba(255,255,255,0.06)] px-4 py-2.5 flex items-center gap-4 text-[10px] text-[#475569] font-mono">
              <span><kbd className="px-1 py-0.5 rounded bg-[rgba(255,255,255,0.06)]">↑↓</kbd> navigate</span>
              <span><kbd className="px-1 py-0.5 rounded bg-[rgba(255,255,255,0.06)]">↵</kbd> select</span>
              <span><kbd className="px-1 py-0.5 rounded bg-[rgba(255,255,255,0.06)]">esc</kbd> close</span>
            </div>
          </motion.div>
        </>
      )}
    </AnimatePresence>
  );
}

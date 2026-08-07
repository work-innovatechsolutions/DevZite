'use client';

import Link from 'next/link';
import { usePathname, useRouter } from 'next/navigation';
import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
  LayoutDashboard,
  FolderKanban,
  FolderOpen,
  CreditCard,
  MessageSquare,
  Menu,
  X,
  LogOut,
  Sparkles,
  ArrowLeft
} from 'lucide-react';
import { ThemeToggle } from '@/components/ui/ThemeToggle';
import { useAuth } from '@/providers/AuthProvider';

const CLIENT_NAV = [
  { label: 'Project Overview', href: '/client/dashboard', icon: LayoutDashboard },
  { label: 'Timeline & Sprints', href: '/client/timeline', icon: FolderKanban },
  { label: 'Files & Assets', href: '/client/files', icon: FolderOpen },
  { label: 'Invoices & Billing', href: '/client/invoices', icon: CreditCard },
  { label: 'Realtime Chat', href: '/client/chat', icon: MessageSquare },
];

export default function ClientLayout({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();
  const router = useRouter();
  const { user, loading, logout } = useAuth();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  // Close mobile drawer on route change
  useEffect(() => {
    setMobileMenuOpen(false);
  }, [pathname]);

  const handleLogout = async () => {
    try {
      await logout();
      router.push('/login');
    } catch (e) {
      console.error('Logout error:', e);
    }
  };

  return (
    <div className="min-h-screen bg-[#06070A] text-[#F8FAFC] flex flex-col md:flex-row">
      {/* ── Mobile & Tablet Top Navbar ── */}
      <header className="md:hidden w-full h-16 bg-[#0C0D14] border-b border-[rgba(255,255,255,0.08)] px-4 flex items-center justify-between sticky top-0 z-40">
        <div className="flex items-center gap-3">
          <button
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            className="p-2 rounded-xl text-[#94A3B8] hover:text-[#F8FAFC] hover:bg-[rgba(255,255,255,0.04)] transition-all cursor-pointer"
            aria-label="Toggle menu"
          >
            {mobileMenuOpen ? <X size={20} /> : <Menu size={20} />}
          </button>
          
          <Link href="/" className="flex items-center gap-2">
            <span className="w-2.5 h-2.5 rounded-full bg-[#06B6D4] animate-pulse" />
            <span className="font-display font-black text-xs uppercase tracking-widest text-[#F8FAFC]">
              Client <span className="text-[#06B6D4]">Portal</span>
            </span>
          </Link>
        </div>

        <div className="flex items-center gap-2">
          <ThemeToggle />
          <button
            onClick={handleLogout}
            className="p-2 rounded-xl text-[#EF4444] hover:bg-[#EF4444]/10 transition-all cursor-pointer"
            title="Log Out"
          >
            <LogOut size={16} />
          </button>
        </div>
      </header>

      {/* ── Desktop Sidebar ── */}
      <aside className="w-72 border-r border-[rgba(255,255,255,0.08)] bg-[#0C0D14] p-6 flex flex-col justify-between shrink-0 hidden md:flex min-h-screen">
        <div>
          <div className="flex items-center justify-between mb-8 pb-4 border-b border-[rgba(255,255,255,0.04)]">
            <Link href="/" className="inline-flex items-center gap-2">
              <span className="w-3.5 h-3.5 rounded-full bg-[#06B6D4] shadow-[0_0_12px_rgba(6,182,212,0.4)]" />
              <span className="font-display font-black text-sm tracking-widest uppercase text-[#F8FAFC]">
                CLIENT <span className="text-[#06B6D4]">PORTAL</span>
              </span>
            </Link>
            <ThemeToggle />
          </div>

          <div className="mb-6 px-3 py-2.5 rounded-2xl bg-[rgba(255,255,255,0.02)] border border-[rgba(255,255,255,0.04)] flex items-center gap-2">
            <Sparkles size={14} className="text-[#06B6D4] shrink-0" />
            <span className="text-[10px] font-mono font-bold uppercase tracking-wider text-[#94A3B8] truncate">
              Client: Nexus AI
            </span>
          </div>

          <nav className="space-y-1.5">
            {CLIENT_NAV.map((item) => {
              const Icon = item.icon;
              const isActive = pathname === item.href;
              return (
                <Link
                  key={item.href}
                  href={item.href}
                  className={`flex items-center gap-3 px-4 py-3 rounded-2xl text-xs font-mono font-bold uppercase tracking-wider transition-all ${
                    isActive
                      ? 'bg-[#06B6D4] text-[#06070A] shadow-[0_0_20px_rgba(6,182,212,0.25)]'
                      : 'text-[#94A3B8] hover:text-[#F8FAFC] hover:bg-[rgba(255,255,255,0.04)]'
                  }`}
                >
                  <Icon size={16} className={isActive ? 'text-[#06070A]' : 'text-[#06B6D4]'} />
                  <span>{item.label}</span>
                </Link>
              );
            })}
          </nav>
        </div>

        <div className="pt-4 border-t border-[rgba(255,255,255,0.06)] space-y-3">
          <Link
            href="/"
            className="flex items-center justify-center gap-2 w-full py-2.5 rounded-xl border border-[rgba(255,255,255,0.08)] hover:bg-[rgba(255,255,255,0.02)] text-[10px] font-mono font-bold uppercase tracking-wider text-[#94A3B8] hover:text-[#F8FAFC] transition-all"
          >
            <ArrowLeft size={12} />
            <span>Exit to Site</span>
          </Link>

          <button
            onClick={handleLogout}
            className="flex items-center justify-center gap-2 w-full py-2.5 rounded-xl bg-[#EF4444]/10 hover:bg-[#EF4444] border border-[#EF4444]/20 hover:border-transparent text-[10px] font-mono font-bold uppercase tracking-wider text-[#EF4444] hover:text-white transition-all cursor-pointer"
          >
            <LogOut size={12} />
            <span>Sign Out</span>
          </button>
        </div>
      </aside>

      {/* ── Mobile Animated Navigation Drawer ── */}
      <AnimatePresence>
        {mobileMenuOpen && (
          <>
            {/* Backdrop */}
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setMobileMenuOpen(false)}
              className="fixed inset-0 bg-[#06070A]/85 backdrop-blur-sm z-40 md:hidden"
            />

            {/* Sidebar Panel */}
            <motion.aside
              initial={{ x: '-100%' }}
              animate={{ x: 0 }}
              exit={{ x: '-100%' }}
              transition={{ type: 'spring', damping: 25, stiffness: 200 }}
              className="fixed top-0 bottom-0 left-0 w-80 bg-[#0C0D14] border-r border-[rgba(255,255,255,0.08)] p-6 z-50 md:hidden flex flex-col justify-between"
            >
              <div>
                <div className="flex items-center justify-between mb-8 pb-4 border-b border-[rgba(255,255,255,0.04)]">
                  <Link href="/" className="inline-flex items-center gap-2">
                    <span className="w-3.5 h-3.5 rounded-full bg-[#06B6D4] shadow-[0_0_10px_rgba(6,182,212,0.4)]" />
                    <span className="font-display font-black text-xs uppercase tracking-widest text-[#F8FAFC]">
                      Client <span className="text-[#06B6D4]">Portal</span>
                    </span>
                  </Link>
                  <button
                    onClick={() => setMobileMenuOpen(false)}
                    className="p-2 rounded-xl text-[#94A3B8] hover:text-[#F8FAFC] hover:bg-[rgba(255,255,255,0.04)] transition-all cursor-pointer"
                  >
                    <X size={18} />
                  </button>
                </div>

                <div className="mb-6 px-3 py-2.5 rounded-2xl bg-[rgba(255,255,255,0.02)] border border-[rgba(255,255,255,0.04)] flex items-center gap-2">
                  <Sparkles size={14} className="text-[#06B6D4] shrink-0" />
                  <span className="text-[10px] font-mono font-bold uppercase tracking-wider text-[#94A3B8] truncate">
                    Client: Nexus AI
                  </span>
                </div>

                <nav className="space-y-1.5">
                  {CLIENT_NAV.map((item) => {
                    const Icon = item.icon;
                    const isActive = pathname === item.href;
                    return (
                      <Link
                        key={item.href}
                        href={item.href}
                        className={`flex items-center gap-3 px-4 py-3 rounded-2xl text-xs font-mono font-bold uppercase tracking-wider transition-all ${
                          isActive
                            ? 'bg-[#06B6D4] text-[#06070A]'
                            : 'text-[#94A3B8] hover:text-[#F8FAFC] hover:bg-[rgba(255,255,255,0.04)]'
                        }`}
                      >
                        <Icon size={16} className={isActive ? 'text-[#06070A]' : 'text-[#06B6D4]'} />
                        <span>{item.label}</span>
                      </Link>
                    );
                  })}
                </nav>
              </div>

              <div className="pt-4 border-t border-[rgba(255,255,255,0.06)] space-y-3">
                <Link
                  href="/"
                  className="flex items-center justify-center gap-2 w-full py-2.5 rounded-xl border border-[rgba(255,255,255,0.08)] hover:bg-[rgba(255,255,255,0.02)] text-[10px] font-mono font-bold uppercase tracking-wider text-[#94A3B8] hover:text-[#F8FAFC] transition-all"
                >
                  <ArrowLeft size={12} />
                  <span>Exit to Site</span>
                </Link>

                <button
                  onClick={handleLogout}
                  className="flex items-center justify-center gap-2 w-full py-2.5 rounded-xl bg-[#EF4444]/10 hover:bg-[#EF4444] border border-[#EF4444]/20 hover:border-transparent text-[10px] font-mono font-bold uppercase tracking-wider text-[#EF4444] hover:text-white transition-all cursor-pointer"
                >
                  <LogOut size={12} />
                  <span>Sign Out</span>
                </button>
              </div>
            </motion.aside>
          </>
        )}
      </AnimatePresence>

      {/* ── Main Workspace ── */}
      <main className="flex-1 overflow-y-auto p-4 sm:p-8 md:p-10">
        {children}
      </main>
    </div>
  );
}

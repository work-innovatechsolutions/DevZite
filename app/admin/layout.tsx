'use client';

import Link from 'next/link';
import Image from 'next/image';
import { useRouter, usePathname } from 'next/navigation';
import { useEffect, useState } from 'react';
import {
  LayoutDashboard,
  FolderKanban,
  FileCode2,
  Mail,
  Users,
  BarChart3,
  Settings,
  LogOut,
  UserCheck,
  Sparkles,
  ArrowUpRight,
  DollarSign,
  ShieldAlert
} from 'lucide-react';
import { ThemeToggle } from '@/components/ui/ThemeToggle';
import { useAuth } from '@/providers/AuthProvider';

const ADMIN_NAV = [
  { label: 'Dashboard',   href: '/admin/dashboard', icon: LayoutDashboard },
  { label: 'Projects',    href: '/admin/projects',  icon: FolderKanban },
  { label: 'Pricing CMS', href: '/admin/pricing',   icon: DollarSign },
  { label: 'Blog & MDX',  href: '/admin/blogs',     icon: FileCode2 },
  { label: 'Leads & CRM', href: '/admin/leads',     icon: Mail },
  { label: 'Clients',     href: '/admin/clients',   icon: Users },
  { label: 'Managers',    href: '/admin/managers',  icon: UserCheck },
  { label: 'Analytics',   href: '/admin/analytics', icon: BarChart3 },
  { label: 'Settings',    href: '/admin/settings',  icon: Settings },
];

export default function AdminLayout({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();
  const router = useRouter();
  const { user, loading, logout } = useAuth();
  const [sessionAuth, setSessionAuth] = useState<boolean | null>(null);

  useEffect(() => {
    async function checkAdminAuth() {
      const isAuthStored = typeof window !== 'undefined' && sessionStorage.getItem('devzite_admin_auth') === 'true';

      if (!loading) {
        if (user && user.email) {
          try {
            const res = await fetch('/api/auth/verify-admin', {
              method: 'POST',
              headers: { 'Content-Type': 'application/json' },
              body: JSON.stringify({ email: user.email }),
            });
            const data = await res.json();
            if (!data.authorized) {
              sessionStorage.removeItem('devzite_admin_auth');
              setSessionAuth(false);
              router.replace('/login?error=unauthorized');
              return;
            }
          } catch (e) {
            console.warn('Admin verify check warning:', e);
          }
        }

        if (!user && !isAuthStored) {
          setSessionAuth(false);
          router.replace(`/login?redirect=${encodeURIComponent(pathname)}`);
        } else {
          setSessionAuth(true);
        }
      }
    }
    checkAdminAuth();
  }, [user, loading, router, pathname]);

  if (loading || sessionAuth === null) {
    return (
      <div className="min-h-screen bg-[#06070A] flex items-center justify-center text-[#F8FAFC] font-mono">
        <div className="flex flex-col items-center gap-4 p-8 rounded-3xl glass border border-[rgba(255,255,255,0.08)] shadow-2xl">
          <div className="w-10 h-10 border-2 border-[#3B82F6] border-t-transparent rounded-full animate-spin" />
          <span className="text-xs text-[#94A3B8] uppercase tracking-widest">
            Verifying Admin Auth Session...
          </span>
        </div>
      </div>
    );
  }

  if (!user && !sessionAuth) {
    return (
      <div className="min-h-screen bg-[#06070A] flex items-center justify-center text-[#F8FAFC] font-mono">
        <div className="flex flex-col items-center gap-4 p-8 rounded-3xl glass border border-[rgba(239,68,68,0.2)] shadow-2xl text-center max-w-md">
          <ShieldAlert size={36} className="text-[#EF4444]" />
          <h3 className="text-lg font-bold text-[#F8FAFC]">Admin Authentication Required</h3>
          <p className="text-xs text-[#94A3B8] leading-relaxed">
            Unauthenticated visitors cannot access the Devzite Admin Suite. Redirecting to login...
          </p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#F8FAFC] dark:bg-[#06070A] text-[#0F172A] dark:text-[#F8FAFC] flex font-body">
      {/* ── Desktop Sidebar ── */}
      <aside className="w-64 border-r border-[rgba(15,23,42,0.08)] dark:border-[rgba(255,255,255,0.08)] bg-white dark:bg-[#0C0D14] p-6 flex flex-col justify-between shrink-0 hidden md:flex shadow-sm">
        <div>
          {/* Logo Header */}
          <div className="flex items-center justify-between mb-8 pb-6 border-b border-[rgba(15,23,42,0.08)] dark:border-[rgba(255,255,255,0.08)]">
            <Link href="/" className="inline-flex items-center gap-2 group">
              <div className="relative w-32 h-8">
                <Image
                  src="/devzitelogo.svg"
                  alt="Devzite"
                  fill
                  sizes="128px"
                  className="object-contain object-left logo-svg"
                  priority
                />
              </div>
            </Link>
            <div className="px-2 py-0.5 rounded text-[10px] font-mono font-bold uppercase bg-[#3B82F6] text-white">
              ADMIN
            </div>
          </div>

          {/* Navigation Items */}
          <nav className="space-y-1">
            {ADMIN_NAV.map((item) => {
              const IconComp = item.icon;
              const isActive = pathname === item.href || pathname.startsWith(`${item.href}/`);
              return (
                <Link
                  key={item.href}
                  href={item.href}
                  className={`flex items-center gap-3 px-3.5 py-2.5 rounded-xl text-xs font-mono font-medium transition-all ${
                    isActive
                      ? 'bg-[#3B82F6] text-white font-bold shadow-[0_0_16px_rgba(59,130,246,0.3)]'
                      : 'text-[#475569] dark:text-[#94A3B8] hover:text-[#0F172A] dark:hover:text-[#F8FAFC] hover:bg-[rgba(15,23,42,0.04)] dark:hover:bg-[rgba(255,255,255,0.04)]'
                  }`}
                >
                  <IconComp size={16} />
                  <span>{item.label}</span>
                </Link>
              );
            })}
          </nav>
        </div>

        {/* Footer Actions */}
        <div className="pt-6 border-t border-[rgba(15,23,42,0.08)] dark:border-[rgba(255,255,255,0.08)] space-y-3">
          <div className="flex items-center justify-between text-xs font-mono text-[#64748B]">
            <span className="flex items-center gap-1.5 text-xs text-[#10B981]">
              <span className="w-2 h-2 rounded-full bg-[#10B981] animate-pulse" />
              v3.0 Production
            </span>
            <ThemeToggle />
          </div>

          <button
            onClick={async () => {
              if (typeof window !== 'undefined') {
                sessionStorage.removeItem('devzite_admin_auth');
              }
              try {
                await logout();
              } catch (e) {}
              window.location.href = '/login';
            }}
            className="flex items-center justify-between w-full px-3 py-2 rounded-xl text-xs font-mono text-[#EF4444] hover:bg-[rgba(239,68,68,0.1)] transition-colors border border-[rgba(239,68,68,0.2)] font-semibold cursor-pointer mb-2"
          >
            <span className="flex items-center gap-2">
              <LogOut size={14} />
              Sign Out (Firebase)
            </span>
          </button>

          <Link
            href="/"
            className="flex items-center justify-between w-full px-3 py-2 rounded-xl text-xs font-mono text-[#475569] dark:text-[#94A3B8] hover:text-[#3B82F6] transition-colors border border-[rgba(15,23,42,0.08)] dark:border-[rgba(255,255,255,0.08)]"
          >
            <span className="flex items-center gap-2">
              <ArrowUpRight size={14} />
              Exit to Live Site
            </span>
          </Link>
        </div>
      </aside>

      {/* ── Main Content Area ── */}
      <div className="flex-1 overflow-y-auto p-6 sm:p-10 bg-[#F8FAFC] dark:bg-[#06070A]">
        {children}
      </div>
    </div>
  );
}

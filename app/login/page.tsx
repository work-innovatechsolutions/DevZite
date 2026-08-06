'use client';

import { useState } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { useRouter } from 'next/navigation';
import { motion, AnimatePresence } from 'framer-motion';
import { Mail, Lock, Eye, EyeOff, ArrowRight, ShieldCheck, Sparkles, ArrowLeft, AlertCircle } from 'lucide-react';
import { ThemeToggle } from '@/components/ui/ThemeToggle';
import { CountUp } from '@/components/motion';
import { useAuth } from '@/providers/AuthProvider';

export default function LoginPage() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [role, setRole] = useState<'client' | 'admin'>('client');
  const [loading, setLoading] = useState(false);
  const [errorMsg, setErrorMsg] = useState('');
  const [unauthorizedEmail, setUnauthorizedEmail] = useState('');

  const router = useRouter();
  const { signInWithEmail, signInWithGoogle, logout } = useAuth();

  const handleBootstrapAdmin = async (targetEmail: string) => {
    if (!targetEmail) return;
    setLoading(true);
    try {
      const res = await fetch('/api/auth/bootstrap-admin', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email: targetEmail, name: targetEmail.split('@')[0] }),
      });
      const data = await res.json();
      if (data.success) {
        sessionStorage.setItem('devzite_admin_auth', 'true');
        setUnauthorizedEmail('');
        setErrorMsg('');
        router.push('/admin/dashboard');
      } else {
        setErrorMsg(data.error || 'Failed to authorize admin account.');
      }
    } catch {
      setErrorMsg('Error authorizing admin account.');
    } finally {
      setLoading(false);
    }
  };

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!email || !password) {
      setErrorMsg('Please enter both your email address and password.');
      return;
    }

    setLoading(true);
    setErrorMsg('');

    try {
      if (role === 'admin') {
        // Verify if email is in the Authorized Admin Roster
        const verifyRes = await fetch('/api/auth/verify-admin', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ email }),
        });
        const verifyData = await verifyRes.json();

        if (!verifyData.authorized) {
          setErrorMsg(verifyData.error || `Access Denied: Account (${email}) is not an authorized Admin.`);
          setUnauthorizedEmail(email);
          setLoading(false);
          return;
        }
      }

      // Perform Firebase Auth Sign-In
      await signInWithEmail(email, password);

      if (role === 'admin') {
        sessionStorage.setItem('devzite_admin_auth', 'true');
        router.push('/admin/dashboard');
      } else {
        router.push('/client/dashboard');
      }
    } catch (err: any) {
      console.warn('Firebase Auth email sign-in error:', err);
      let friendly = 'Authentication failed. Please check your credentials and try again.';
      if (err.code === 'auth/invalid-credential' || err.code === 'auth/wrong-password' || err.code === 'auth/user-not-found') {
        friendly = 'Invalid email or password. Please verify your credentials.';
      } else if (err.code === 'auth/invalid-email') {
        friendly = 'Invalid email address format.';
      } else if (err.code === 'auth/too-many-requests') {
        friendly = 'Access temporarily blocked due to many failed attempts. Try again later.';
      } else if (err.message) {
        friendly = err.message;
      }
      setErrorMsg(friendly);
    } finally {
      setLoading(false);
    }
  };

  const handleGoogleLogin = async () => {
    setLoading(true);
    setErrorMsg('');
    try {
      const userCred = await signInWithGoogle();
      const signedInUser = userCred?.user;
      const userEmail = signedInUser?.email || '';

      if (role === 'admin') {
        // Check if signed-in Google account is in the Authorized Admin Roster
        const verifyRes = await fetch('/api/auth/verify-admin', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ email: userEmail }),
        });
        const verifyData = await verifyRes.json();

        if (!verifyData.authorized) {
          setErrorMsg(verifyData.error || `Access Denied: Google Account (${userEmail}) is not an authorized Admin.`);
          setUnauthorizedEmail(userEmail);
          await logout();
          sessionStorage.removeItem('devzite_admin_auth');
          setLoading(false);
          return;
        }

        sessionStorage.setItem('devzite_admin_auth', 'true');
        router.push('/admin/dashboard');
      } else {
        router.push('/client/dashboard');
      }
    } catch (err: any) {
      console.warn('Firebase Auth Google popup notice:', err);
      if (err.code !== 'auth/popup-closed-by-user') {
        setErrorMsg('Google sign in failed. Please try again.');
      }
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-[#F8FAFC] dark:bg-[#06070A] text-[#0F172A] dark:text-[#F8FAFC] relative overflow-hidden font-body selection:bg-[#3B82F6]/20">
      {/* ── Background Aesthetics: Gradient Mesh, Aurora & Grid ── */}
      <div className="fixed inset-0 pointer-events-none z-0 overflow-hidden">
        {/* Subtle Grid */}
        <div className="absolute inset-0 bg-[linear-gradient(to_right,#0f172a08_1px,transparent_1px),linear-gradient(to_bottom,#0f172a08_1px,transparent_1px)] dark:bg-[linear-gradient(to_right,#ffffff05_1px,transparent_1px),linear-gradient(to_bottom,#ffffff05_1px,transparent_1px)] bg-[size:4rem_4rem] [mask-image:radial-gradient(ellipse_60%_50%_at_50%_0%,#000_70%,transparent_100%)]" />

        {/* Ambient Glowing Orbs with GPU Hardware Acceleration */}
        <div className="absolute -top-40 -left-40 w-[500px] h-[500px] bg-gradient-to-br from-[#3B82F6]/15 via-[#7C3AED]/10 to-transparent rounded-full blur-[50px] transform-gpu will-change-transform" />
        <div className="absolute top-1/2 -right-40 w-[450px] h-[450px] bg-gradient-to-br from-[#06B6D4]/15 via-[#3B82F6]/10 to-transparent rounded-full blur-[50px] transform-gpu will-change-transform" />
      </div>

      {/* ── Top Floating Navigation Bar ── */}
      <header className="fixed top-6 inset-x-0 z-40 px-4 sm:px-8 max-w-7xl mx-auto">
        <div className="glass-nav rounded-full px-6 py-3 border border-[rgba(15,23,42,0.08)] dark:border-[rgba(255,255,255,0.08)] flex items-center justify-between shadow-lg backdrop-blur-2xl bg-white/70 dark:bg-[#0C0D14]/75">
          <Link href="/" className="flex items-center gap-3 group">
            <div className="relative w-32 h-8">
              <Image
                src="/devzitelogo.svg"
                alt="DevZite"
                fill
                sizes="128px"
                className="object-contain object-left logo-svg group-hover:scale-105 transition-transform"
                priority
              />
            </div>
          </Link>

          <div className="flex items-center gap-4">
            <Link
              href="/"
              className="text-xs font-mono font-semibold text-[#475569] dark:text-[#94A3B8] hover:text-[#3B82F6] transition-colors flex items-center gap-1.5 hidden sm:flex"
            >
              <ArrowLeft size={14} />
              Return to Site
            </Link>
            <ThemeToggle />
          </div>
        </div>
      </header>

      {/* ── Main Split-Screen Container ── */}
      <main className="relative z-10 min-h-screen flex items-center justify-center pt-28 pb-16 px-4 sm:px-8">
        <div className="container-site max-w-7xl w-full grid grid-cols-1 lg:grid-cols-12 gap-12 lg:gap-16 items-center">

          {/* ── LEFT COLUMN (40%): Visual Storytelling & Branding ── */}
          <motion.div
            initial={{ opacity: 0, x: -30 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.8, ease: [0.16, 1, 0.3, 1] }}
            className="lg:col-span-5 space-y-8 text-left"
          >
            {/* Tag */}
            <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-[rgba(59,130,246,0.08)] dark:bg-[rgba(59,130,246,0.12)] border border-[rgba(59,130,246,0.2)]">
              <Sparkles size={14} className="text-[#3B82F6]" />
              <span className="text-xs font-mono text-[#3B82F6] tracking-wide font-bold uppercase">
                / 01 — Studio Portal
              </span>
            </div>

            {/* Headlines */}
            <div>
              <h1 className="text-4xl sm:text-5xl lg:text-6xl font-display font-black tracking-tight leading-[1.08] text-[#0F172A] dark:text-[#F8FAFC]">
                Building Ideas.{' '}
                <span className="text-transparent bg-clip-text bg-gradient-to-r from-[#3B82F6] via-[#8B5CF6] to-[#06B6D4] block mt-1">
                  Crafting Digital Excellence.
                </span>
              </h1>
              <p className="mt-5 text-base sm:text-lg text-[#334155] dark:text-[#94A3B8] leading-relaxed font-body font-medium max-w-lg">
                We design world-class digital products, scalable SaaS platforms, AI solutions and premium websites.
              </p>
            </div>

            {/* Animated Statistics Grid */}
            <div className="grid grid-cols-3 gap-4 pt-4 border-t border-[rgba(15,23,42,0.08)] dark:border-[rgba(255,255,255,0.08)]">
              <div>
                <div className="text-2xl sm:text-3xl font-display font-black text-[#0F172A] dark:text-[#F8FAFC] tracking-tight">
                  <CountUp end={150} suffix="+" duration={2.0} />
                </div>
                <div className="text-[11px] font-mono text-[#64748B] uppercase tracking-wider font-bold mt-1">
                  Projects
                </div>
              </div>
              <div>
                <div className="text-2xl sm:text-3xl font-display font-black text-[#3B82F6] tracking-tight">
                  <CountUp end={98} suffix="%" duration={2.0} />
                </div>
                <div className="text-[11px] font-mono text-[#64748B] uppercase tracking-wider font-bold mt-1">
                  Satisfaction
                </div>
              </div>
              <div>
                <div className="text-2xl sm:text-3xl font-display font-black text-[#06B6D4] tracking-tight">
                  24/7
                </div>
                <div className="text-[11px] font-mono text-[#64748B] uppercase tracking-wider font-bold mt-1">
                  Support
                </div>
              </div>
            </div>

            {/* Trust Banner */}
            <div className="flex items-center gap-3 p-4 rounded-2xl bg-white/60 dark:bg-[rgba(255,255,255,0.03)] border border-[rgba(15,23,42,0.06)] dark:border-[rgba(255,255,255,0.06)] max-w-md">
              <ShieldCheck size={20} className="text-[#10B981] shrink-0" />
              <p className="text-xs text-[#475569] dark:text-[#CBD5E1] font-mono font-medium">
                Protected by end-to-end OAuth & enterprise grade TLS 1.3 encryption.
              </p>
            </div>
          </motion.div>

          {/* ── RIGHT COLUMN (60%): Floating Glassmorphism Authentication Card ── */}
          <motion.div
            initial={{ opacity: 0, y: 30, scale: 0.98 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            transition={{ duration: 0.8, delay: 0.2, ease: [0.16, 1, 0.3, 1] }}
            className="lg:col-span-7 flex justify-center"
          >
            <div
              className="w-full max-w-xl rounded-[32px] backdrop-blur-[24px] bg-white/80 dark:bg-[#0C0D14]/80 border border-[rgba(15,23,42,0.12)] dark:border-[rgba(255,255,255,0.12)] shadow-[0_40px_120px_rgba(15,23,42,0.12)] hover:shadow-[0_50px_140px_rgba(59,130,246,0.18)] transition-all duration-500 p-8 sm:p-12 relative overflow-hidden"
            >
              {/* Card Header */}
              <div className="text-center mb-8">
                <h2 className="text-3xl sm:text-4xl font-display font-black text-[#0F172A] dark:text-[#F8FAFC] tracking-tight">
                  Welcome to <span className="text-[#3B82F6]">DevZite</span>
                </h2>
                <p className="text-xs sm:text-sm font-mono text-[#64748B] mt-2 font-medium">
                  Enter your credentials to access your workspace portal.
                </p>
              </div>

              {/* ── Linear-Style Pill Tab Switcher ── */}
              <div className="relative flex p-1.5 rounded-2xl bg-[rgba(15,23,42,0.04)] dark:bg-[rgba(255,255,255,0.04)] border border-[rgba(15,23,42,0.06)] dark:border-[rgba(255,255,255,0.06)] mb-8">
                <button
                  type="button"
                  onClick={() => setRole('client')}
                  className={`relative flex-1 py-3 text-xs font-mono font-bold transition-colors z-10 ${role === 'client' ? 'text-white' : 'text-[#64748B] hover:text-[#0F172A] dark:hover:text-[#F8FAFC]'
                    }`}
                >
                  {role === 'client' && (
                    <motion.div
                      layoutId="activeRoleTab"
                      className="absolute inset-0 bg-[#3B82F6] rounded-xl shadow-md -z-10"
                      transition={{ type: 'spring', stiffness: 350, damping: 30 }}
                    />
                  )}
                  Client Portal
                </button>
                <button
                  type="button"
                  onClick={() => setRole('admin')}
                  className={`relative flex-1 py-3 text-xs font-mono font-bold transition-colors z-10 ${role === 'admin' ? 'text-white' : 'text-[#64748B] hover:text-[#0F172A] dark:hover:text-[#F8FAFC]'
                    }`}
                >
                  {role === 'admin' && (
                    <motion.div
                      layoutId="activeRoleTab"
                      className="absolute inset-0 bg-gradient-to-r from-[#3B82F6] to-[#7C3AED] rounded-xl shadow-md -z-10"
                      transition={{ type: 'spring', stiffness: 350, damping: 30 }}
                    />
                  )}
                  Admin CMS
                </button>
              </div>

              {/* ── Error Banner ── */}
              {errorMsg && (
                <div className="p-4 rounded-2xl bg-[#EF4444]/10 border border-[#EF4444]/30 text-[#EF4444] text-xs font-mono font-medium flex flex-col gap-2.5 mb-6 shadow-lg">
                  <div className="flex items-start gap-2.5">
                    <AlertCircle size={18} className="shrink-0 mt-0.5 text-[#EF4444]" />
                    <span className="leading-relaxed">{errorMsg}</span>
                  </div>

                  {unauthorizedEmail && (
                    <button
                      type="button"
                      onClick={() => handleBootstrapAdmin(unauthorizedEmail)}
                      className="w-full py-2.5 px-3 rounded-xl bg-[#3B82F6] hover:bg-[#2563EB] text-white font-mono font-bold text-xs uppercase tracking-wider transition-all shadow-md mt-1 cursor-pointer"
                    >
                      Authorize ({unauthorizedEmail}) as First Super Admin
                    </button>
                  )}
                </div>
              )}

              {/* ── OAuth Google Login Button ── */}
              <button
                type="button"
                onClick={handleGoogleLogin}
                className="w-full py-3.5 px-4 rounded-2xl border border-[rgba(15,23,42,0.12)] dark:border-[rgba(255,255,255,0.12)] bg-white/90 dark:bg-[rgba(255,255,255,0.04)] hover:bg-white dark:hover:bg-[rgba(255,255,255,0.08)] text-[#0F172A] dark:text-[#F8FAFC] text-xs font-mono font-bold flex items-center justify-center gap-3 transition-all duration-300 shadow-sm mb-6 group"
              >
                <svg className="w-4 h-4 group-hover:scale-110 transition-transform" viewBox="0 0 24 24">
                  <path fill="#4285F4" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z" />
                  <path fill="#34A853" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" />
                  <path fill="#FBBC05" d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.06H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.94l2.85-2.22.81-.63z" />
                  <path fill="#EA4335" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.06l3.66 2.84c.87-2.6 3.3-4.52 6.16-4.52z" />
                </svg>
                <span>Continue with Google</span>
              </button>

              {/* Divider */}
              <div className="relative flex items-center justify-center mb-6">
                <div className="border-t border-[rgba(15,23,42,0.08)] dark:border-[rgba(255,255,255,0.08)] w-full" />
                <span className="bg-white dark:bg-[#0C0D14] px-4 text-[11px] font-mono text-[#64748B] uppercase tracking-wider font-semibold shrink-0">
                  Or email authentication
                </span>
              </div>

              {/* ── Form Inputs ── */}
              <form onSubmit={handleLogin} className="space-y-5">
                {/* Email Input */}
                <div>
                  <label className="text-xs font-mono text-[#475569] dark:text-[#94A3B8] block mb-2 font-bold">
                    Email Address
                  </label>
                  <div className="relative flex items-center">
                    <Mail size={18} className="absolute left-4 text-[#64748B]" />
                    <input
                      type="email"
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                      placeholder="souvik@devzite.com"
                      required
                      className="w-full pl-11 pr-4 py-3.5 rounded-2xl bg-[rgba(15,23,42,0.03)] dark:bg-[rgba(255,255,255,0.04)] border border-[rgba(15,23,42,0.12)] dark:border-[rgba(255,255,255,0.12)] text-[#0F172A] dark:text-[#F8FAFC] placeholder-[#94A3B8] text-sm font-body outline-none focus:ring-2 focus:ring-[#3B82F6]/50 focus:border-[#3B82F6] transition-all"
                    />
                  </div>
                </div>

                {/* Password Input */}
                <div>
                  <div className="flex justify-between items-center mb-2">
                    <label className="text-xs font-mono text-[#475569] dark:text-[#94A3B8] font-bold">
                      Password
                    </label>
                    <Link href="/forgot-password" className="text-xs font-mono text-[#3B82F6] hover:underline font-bold">
                      Forgot?
                    </Link>
                  </div>
                  <div className="relative flex items-center">
                    <Lock size={18} className="absolute left-4 text-[#64748B]" />
                    <input
                      type={showPassword ? 'text' : 'password'}
                      value={password}
                      onChange={(e) => setPassword(e.target.value)}
                      placeholder="••••••••••••"
                      required
                      className="w-full pl-11 pr-12 py-3.5 rounded-2xl bg-[rgba(15,23,42,0.03)] dark:bg-[rgba(255,255,255,0.04)] border border-[rgba(15,23,42,0.12)] dark:border-[rgba(255,255,255,0.12)] text-[#0F172A] dark:text-[#F8FAFC] placeholder-[#94A3B8] text-sm font-body outline-none focus:ring-2 focus:ring-[#3B82F6]/50 focus:border-[#3B82F6] transition-all"
                    />
                    <button
                      type="button"
                      onClick={() => setShowPassword(!showPassword)}
                      className="absolute right-4 text-[#64748B] hover:text-[#3B82F6] transition-colors"
                    >
                      {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
                    </button>
                  </div>
                </div>

                {/* Submit Button */}
                <button
                  type="submit"
                  disabled={loading}
                  className="w-full py-4 rounded-2xl bg-gradient-to-r from-[#3B82F6] via-[#6366F1] to-[#7C3AED] text-white text-sm font-display font-bold flex items-center justify-center gap-2 shadow-[0_0_30px_rgba(59,130,246,0.35)] hover:shadow-[0_0_40px_rgba(124,58,237,0.5)] hover:-translate-y-0.5 transition-all duration-300 group cursor-pointer"
                >
                  {loading ? (
                    <span className="flex items-center gap-2">
                      <span className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                      Authenticating...
                    </span>
                  ) : (
                    <>
                      <span>Access {role === 'admin' ? 'Admin CMS' : 'Client Workspace'}</span>
                      <ArrowRight size={18} className="group-hover:translate-x-1 transition-transform" />
                    </>
                  )}
                </button>
              </form>

              {/* Sign Up Footer */}
              <div className="mt-8 text-center text-xs font-mono text-[#64748B]">
                Don't have a DevZite account?{' '}
                <Link href="/register" className="text-[#3B82F6] font-bold hover:underline">
                  Request Access
                </Link>
              </div>
            </div>
          </motion.div>

        </div>
      </main>
    </div>
  );
}

'use client';

import { useState } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { useRouter } from 'next/navigation';
import { Navbar } from '@/components/layout/Navbar';
import { Footer } from '@/components/layout/Footer';
import { BlurReveal } from '@/components/motion';

export default function LoginPage() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [role, setRole] = useState<'admin' | 'client'>('client');
  const router = useRouter();

  const handleLogin = (e: React.FormEvent) => {
    e.preventDefault();
    if (role === 'admin') {
      router.push('/admin/dashboard');
    } else {
      router.push('/client/dashboard');
    }
  };

  return (
    <>
      <Navbar />

      <main className="pt-32 pb-24 relative min-h-screen flex items-center justify-center">
        <div className="container-site max-w-md">
          <BlurReveal>
            <div className="rounded-3xl glass p-8 sm:p-10 border border-[rgba(255,255,255,0.08)] shadow-2xl">
              {/* Header */}
              <div className="text-center mb-8">
                <div className="relative w-12 h-12 mx-auto mb-4">
                  <Image src="/logo.png" alt="Innovatech" fill sizes="48px" className="object-contain" />
                </div>
                <h1 className="font-display font-bold text-2xl text-[#F8FAFC]">
                  Welcome Back
                </h1>
                <p className="text-xs font-mono text-[#64748B] mt-1">
                  Access your Admin CMS or Client Workspace
                </p>
              </div>

              {/* Role Toggle */}
              <div className="flex p-1 rounded-xl glass border border-[rgba(255,255,255,0.08)] mb-6">
                <button
                  type="button"
                  onClick={() => setRole('client')}
                  className={`flex-1 py-2 rounded-lg text-xs font-mono transition-colors ${
                    role === 'client' ? 'bg-[#3B82F6] text-white font-bold' : 'text-[#94A3B8]'
                  }`}
                >
                  Client Portal
                </button>
                <button
                  type="button"
                  onClick={() => setRole('admin')}
                  className={`flex-1 py-2 rounded-lg text-xs font-mono transition-colors ${
                    role === 'admin' ? 'bg-[#3B82F6] text-white font-bold' : 'text-[#94A3B8]'
                  }`}
                >
                  Admin CMS
                </button>
              </div>

              {/* Login Form */}
              <form onSubmit={handleLogin} className="space-y-5">
                <div>
                  <label className="text-xs font-mono text-[#94A3B8] block mb-2">Email Address</label>
                  <input
                    type="email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    placeholder="user@innovatech.com"
                    required
                    className="w-full px-4 py-3 rounded-xl glass text-sm text-[#F8FAFC] placeholder-[#475569] outline-none focus:border-[#3B82F6]"
                  />
                </div>

                <div>
                  <div className="flex justify-between items-center mb-2">
                    <label className="text-xs font-mono text-[#94A3B8]">Password</label>
                    <Link href="/forgot-password" className="text-[11px] font-mono text-[#3B82F6] hover:underline">
                      Forgot?
                    </Link>
                  </div>
                  <input
                    type="password"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    placeholder="••••••••••••"
                    required
                    className="w-full px-4 py-3 rounded-xl glass text-sm text-[#F8FAFC] placeholder-[#475569] outline-none focus:border-[#3B82F6]"
                  />
                </div>

                <button
                  type="submit"
                  className="w-full py-3.5 rounded-xl bg-[#3B82F6] hover:bg-[#2563EB] text-white font-semibold text-sm transition-all shadow-xl"
                >
                  Sign In to Workspace →
                </button>
              </form>

              {/* OAuth buttons */}
              <div className="mt-6 pt-6 border-t border-[rgba(255,255,255,0.06)] space-y-3">
                <button
                  onClick={() => router.push(role === 'admin' ? '/admin/dashboard' : '/client/dashboard')}
                  className="w-full py-2.5 rounded-xl glass border border-[rgba(255,255,255,0.08)] text-xs font-mono text-[#94A3B8] hover:text-[#F8FAFC] flex items-center justify-center gap-2"
                >
                  <span>🌐</span> Continue with Google OAuth
                </button>
              </div>

              <p className="text-center text-xs text-[#64748B] mt-6">
                Don&apos;t have an account?{' '}
                <Link href="/register" className="text-[#3B82F6] hover:underline font-mono">
                  Register Account
                </Link>
              </p>
            </div>
          </BlurReveal>
        </div>
      </main>

      <Footer />
    </>
  );
}

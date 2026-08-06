'use client';

import { useState } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { Navbar } from '@/components/layout/Navbar';
import { Footer } from '@/components/layout/Footer';
import { BlurReveal } from '@/components/motion';

export default function ForgotPasswordPage() {
  const [email, setEmail] = useState('');
  const [sent, setSent] = useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setSent(true);
  };

  return (
    <>
      <Navbar />

      <main className="pt-32 pb-24 relative min-h-screen flex items-center justify-center">
        <div className="container-site max-w-md">
          <BlurReveal>
            <div className="rounded-3xl glass p-8 sm:p-10 border border-[rgba(255,255,255,0.08)] shadow-2xl">
              <div className="text-center mb-8">
                <div className="relative w-12 h-12 mx-auto mb-4">
                  <Image src="/logo.png" alt="DevZite" fill sizes="48px" className="object-contain" />
                </div>
                <h1 className="font-display font-bold text-2xl text-[#F8FAFC]">
                  Reset Password
                </h1>
                <p className="text-xs font-mono text-[#64748B] mt-1">
                  We&apos;ll send a password recovery link to your email
                </p>
              </div>

              {sent ? (
                <div className="text-center py-6">
                  <span className="text-4xl mb-3 block">✉️</span>
                  <p className="text-sm font-semibold text-[#F8FAFC] mb-2">Check Your Inbox</p>
                  <p className="text-xs text-[#94A3B8] mb-6">
                    A password reset link has been sent to <strong className="text-[#3B82F6]">{email}</strong>.
                  </p>
                  <Link href="/login" className="text-xs font-mono text-[#3B82F6] hover:underline">
                    Back to Sign In
                  </Link>
                </div>
              ) : (
                <form onSubmit={handleSubmit} className="space-y-4">
                  <div>
                    <label className="text-xs font-mono text-[#94A3B8] block mb-1.5">Email Address</label>
                    <input
                      type="email"
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                      placeholder="user@devzite.com"
                      required
                      className="w-full px-4 py-3 rounded-xl glass text-sm text-[#F8FAFC] placeholder-[#475569] outline-none focus:border-[#3B82F6]"
                    />
                  </div>

                  <button
                    type="submit"
                    className="w-full py-3.5 rounded-xl bg-[#3B82F6] hover:bg-[#2563EB] text-white font-semibold text-sm transition-all shadow-xl"
                  >
                    Send Recovery Email →
                  </button>

                  <div className="text-center pt-2">
                    <Link href="/login" className="text-xs font-mono text-[#94A3B8] hover:text-[#F8FAFC]">
                      ← Back to Sign In
                    </Link>
                  </div>
                </form>
              )}
            </div>
          </BlurReveal>
        </div>
      </main>

      <Footer />
    </>
  );
}

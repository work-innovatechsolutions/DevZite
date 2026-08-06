'use client';

import { useState } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { useRouter } from 'next/navigation';
import { Navbar } from '@/components/layout/Navbar';
import { Footer } from '@/components/layout/Footer';
import { BlurReveal } from '@/components/motion';

export default function RegisterPage() {
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const router = useRouter();

  const handleRegister = (e: React.FormEvent) => {
    e.preventDefault();
    router.push('/client/dashboard');
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
                  <Image src="/logo.png" alt="Innovatech" fill sizes="48px" className="object-contain" />
                </div>
                <h1 className="font-display font-bold text-2xl text-[#F8FAFC]">
                  Create Account
                </h1>
                <p className="text-xs font-mono text-[#64748B] mt-1">
                  Access your client workspace and project deliverables
                </p>
              </div>

              <form onSubmit={handleRegister} className="space-y-4">
                <div>
                  <label className="text-xs font-mono text-[#94A3B8] block mb-1.5">Full Name</label>
                  <input
                    type="text"
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    placeholder="Jane Doe"
                    required
                    className="w-full px-4 py-3 rounded-xl glass text-sm text-[#F8FAFC] placeholder-[#475569] outline-none focus:border-[#3B82F6]"
                  />
                </div>

                <div>
                  <label className="text-xs font-mono text-[#94A3B8] block mb-1.5">Email Address</label>
                  <input
                    type="email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    placeholder="jane@company.com"
                    required
                    className="w-full px-4 py-3 rounded-xl glass text-sm text-[#F8FAFC] placeholder-[#475569] outline-none focus:border-[#3B82F6]"
                  />
                </div>

                <div>
                  <label className="text-xs font-mono text-[#94A3B8] block mb-1.5">Password</label>
                  <input
                    type="password"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    placeholder="Minimum 8 characters"
                    required
                    className="w-full px-4 py-3 rounded-xl glass text-sm text-[#F8FAFC] placeholder-[#475569] outline-none focus:border-[#3B82F6]"
                  />
                </div>

                <button
                  type="submit"
                  className="w-full py-3.5 rounded-xl bg-[#3B82F6] hover:bg-[#2563EB] text-white font-semibold text-sm transition-all shadow-xl mt-2"
                >
                  Create Client Account →
                </button>
              </form>

              <p className="text-center text-xs text-[#64748B] mt-6">
                Already registered?{' '}
                <Link href="/login" className="text-[#3B82F6] hover:underline font-mono">
                  Sign In
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

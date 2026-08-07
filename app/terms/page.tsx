'use client';

import Link from 'next/link';
import { Navbar } from '@/components/layout/Navbar';
import { Footer } from '@/components/layout/Footer';
import { BlurReveal } from '@/components/motion';
import { FileCheck, Shield, Scale, HelpCircle, ArrowLeft } from 'lucide-react';

export default function TermsPage() {
  return (
    <>
      <Navbar />

      <main className="pt-32 pb-24 relative min-h-screen bg-[#F8FAFC] dark:bg-[#06070A] text-[#0F172A] dark:text-[#F8FAFC]">
        <div className="w-full max-w-5xl mx-auto px-4 sm:px-8">
          {/* Header */}
          <div className="mb-12">
            <Link
              href="/"
              className="text-xs font-mono font-semibold text-[#3B82F6] hover:underline inline-flex items-center gap-1.5 mb-6"
            >
              <ArrowLeft size={14} />
              Return Home
            </Link>

            <BlurReveal>
              <span className="text-xs font-mono text-[#3B82F6] uppercase tracking-widest font-semibold block mb-2">
                / Legal Terms
              </span>
            </BlurReveal>

            <BlurReveal delay={0.15}>
              <h1 className="text-4xl sm:text-5xl font-display font-black tracking-tight text-[#0F172A] dark:text-[#F8FAFC] mb-4">
                Terms of Service
              </h1>
            </BlurReveal>

            <BlurReveal delay={0.3}>
              <p className="text-sm font-mono text-[#64748B]">
                Last updated: August 7, 2026 • Devzite Studio Operating Agreement
              </p>
            </BlurReveal>
          </div>

          {/* Content Card */}
          <div className="glass-card rounded-3xl p-8 sm:p-12 border border-[rgba(15,23,42,0.08)] dark:border-[rgba(255,255,255,0.08)] bg-white dark:bg-[#0C0D14] shadow-xl space-y-10 font-body text-sm text-[#334155] dark:text-[#CBD5E1] leading-relaxed">
            
            <section className="space-y-4">
              <div className="flex items-center gap-3 text-[#0F172A] dark:text-[#F8FAFC]">
                <FileCheck size={22} className="text-[#3B82F6]" />
                <h2 className="text-xl font-display font-bold">1. Service Scope & Agreements</h2>
              </div>
              <p>
                Devzite Studio provides software engineering, web application development, mobile application design, and technical consulting. All bespoke builds are executed according to signed Statement of Work (SOW) documents and milestone schedules.
              </p>
            </section>

            <section className="space-y-4 pt-6 border-t border-[rgba(15,23,42,0.08)] dark:border-[rgba(255,255,255,0.08)]">
              <div className="flex items-center gap-3 text-[#0F172A] dark:text-[#F8FAFC]">
                <Shield size={22} className="text-[#3B82F6]" />
                <h2 className="text-xl font-display font-bold">2. Intellectual Property Rights</h2>
              </div>
              <p>
                Upon completion of milestone payments, clients receive full ownership of custom application source code, visual assets, and intellectual property developed specifically for their project scope.
              </p>
            </section>

            <section className="space-y-4 pt-6 border-t border-[rgba(15,23,42,0.08)] dark:border-[rgba(255,255,255,0.08)]">
              <div className="flex items-center gap-3 text-[#0F172A] dark:text-[#F8FAFC]">
                <Scale size={22} className="text-[#3B82F6]" />
                <h2 className="text-xl font-display font-bold">3. Warranty & Maintenance</h2>
              </div>
              <p>
                Standard engineering packages include a 30-to-90 day post-launch warranty covering bug fixes and technical support. Extended SLA retainers are governed by dedicated maintenance agreements.
              </p>
            </section>

            <section className="space-y-4 pt-6 border-t border-[rgba(15,23,42,0.08)] dark:border-[rgba(255,255,255,0.08)]">
              <div className="flex items-center gap-3 text-[#0F172A] dark:text-[#F8FAFC]">
                <HelpCircle size={22} className="text-[#3B82F6]" />
                <h2 className="text-xl font-display font-bold">4. Legal Inquiries</h2>
              </div>
              <p>
                If you have questions regarding our Terms of Service or service contracts, please contact our legal team at <span className="font-mono text-[#3B82F6] font-semibold">legal@devzite.com</span>.
              </p>
            </section>

          </div>
        </div>
      </main>

      <Footer />
    </>
  );
}

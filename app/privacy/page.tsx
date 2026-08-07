'use client';

import Link from 'next/link';
import { Navbar } from '@/components/layout/Navbar';
import { Footer } from '@/components/layout/Footer';
import { BlurReveal } from '@/components/motion';
import { ShieldCheck, Lock, Eye, FileText, ArrowLeft } from 'lucide-react';

export default function PrivacyPage() {
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
                / Legal & Compliance
              </span>
            </BlurReveal>

            <BlurReveal delay={0.15}>
              <h1 className="text-4xl sm:text-5xl font-display font-black tracking-tight text-[#0F172A] dark:text-[#F8FAFC] mb-4">
                Privacy Policy
              </h1>
            </BlurReveal>

            <BlurReveal delay={0.3}>
              <p className="text-sm font-mono text-[#64748B]">
                Last updated: August 7, 2026 • Effective Version 3.0
              </p>
            </BlurReveal>
          </div>

          {/* Content Card */}
          <div className="glass-card rounded-3xl p-8 sm:p-12 border border-[rgba(15,23,42,0.08)] dark:border-[rgba(255,255,255,0.08)] bg-white dark:bg-[#0C0D14] shadow-xl space-y-10 font-body text-sm text-[#334155] dark:text-[#CBD5E1] leading-relaxed">
            
            <section className="space-y-4">
              <div className="flex items-center gap-3 text-[#0F172A] dark:text-[#F8FAFC]">
                <ShieldCheck size={22} className="text-[#3B82F6]" />
                <h2 className="text-xl font-display font-bold">1. Information We Collect</h2>
              </div>
              <p>
                At Devzite Studio, we respect your privacy and are committed to protecting your personal data. We collect information you provide directly to us when filling out our contact forms, requesting project proposals, or authenticating through our Google OAuth portal.
              </p>
              <ul className="list-disc pl-6 space-y-2 text-[#475569] dark:text-[#94A3B8]">
                <li>Contact Information: Full Name, Email Address, Company Name, and Phone Number.</li>
                <li>Project Specifications: Scope details, budget estimates, and technical requirements.</li>
                <li>Authentication Data: Firebase OAuth identifiers and token data for workspace management.</li>
              </ul>
            </section>

            <section className="space-y-4 pt-6 border-t border-[rgba(15,23,42,0.08)] dark:border-[rgba(255,255,255,0.08)]">
              <div className="flex items-center gap-3 text-[#0F172A] dark:text-[#F8FAFC]">
                <Lock size={22} className="text-[#3B82F6]" />
                <h2 className="text-xl font-display font-bold">2. How We Use Your Data</h2>
              </div>
              <p>
                We process your data strictly to deliver enterprise web applications, schedule technical consultation calls, manage client portals, and communicate status updates regarding your active software builds.
              </p>
            </section>

            <section className="space-y-4 pt-6 border-t border-[rgba(15,23,42,0.08)] dark:border-[rgba(255,255,255,0.08)]">
              <div className="flex items-center gap-3 text-[#0F172A] dark:text-[#F8FAFC]">
                <Eye size={22} className="text-[#3B82F6]" />
                <h2 className="text-xl font-display font-bold">3. Data Security & Storage</h2>
              </div>
              <p>
                All data in transit is encrypted using enterprise-grade TLS 1.3 encryption. Database storage is maintained on Firebase Google Cloud Platform with end-to-end security policies. We never sell, rent, or trade your personal data to third parties.
              </p>
            </section>

            <section className="space-y-4 pt-6 border-t border-[rgba(15,23,42,0.08)] dark:border-[rgba(255,255,255,0.08)]">
              <div className="flex items-center gap-3 text-[#0F172A] dark:text-[#F8FAFC]">
                <FileText size={22} className="text-[#3B82F6]" />
                <h2 className="text-xl font-display font-bold">4. Your Rights & Inquiries</h2>
              </div>
              <p>
                You have the right to request access, modification, or complete deletion of your data from our servers at any time. For privacy inquiries or data requests, please contact our privacy lead at <span className="font-mono text-[#3B82F6] font-semibold">privacy@devzite.com</span>.
              </p>
            </section>

          </div>
        </div>
      </main>

      <Footer />
    </>
  );
}

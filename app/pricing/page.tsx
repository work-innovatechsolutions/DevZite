'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { Navbar } from '@/components/layout/Navbar';
import { Footer } from '@/components/layout/Footer';
import { BlurReveal, WordReveal } from '@/components/motion';
import { Check, Sparkles, ArrowRight, Zap } from 'lucide-react';
import { db } from '@/lib/firebase/client';
import { collection, onSnapshot } from 'firebase/firestore';

interface PricingPlan {
  id: string;
  name: string;
  badge: string;
  price: string;
  billing: string;
  description: string;
  isPopular: boolean;
  features: string[];
}

const DEFAULT_PLANS: PricingPlan[] = [
  {
    id: 'starter',
    name: 'Starter',
    badge: 'Essential Build',
    price: '$2,499',
    billing: 'per project',
    description: 'Perfect for startups needing a high-performance, conversion-focused digital presence.',
    isPopular: false,
    features: [
      'Next.js 15 Web Application',
      'Tailwind CSS v4 Responsive Design',
      '99+ Lighthouse Performance Score',
      'SEO & Meta Tags Optimization',
      'Firebase Infrastructure Setup',
      '1 Month Technical Warranty & Support',
    ],
  },
  {
    id: 'pro',
    name: 'Pro Studio',
    badge: 'Most Popular',
    price: '$5,999',
    billing: 'per project',
    description: 'Complete full-stack web and mobile application suite for scaling tech brands.',
    isPopular: true,
    features: [
      'Full-Stack Web + Native Mobile App',
      'Custom UI/UX & Motion Design System',
      '60fps GSAP & Framer Motion Animations',
      'Firebase Admin CMS & Auth Control',
      'Real-time WebSocket & API Architecture',
      '3 Months Priority Support & Maintenance',
    ],
  },
  {
    id: 'premium',
    name: 'Premium',
    badge: 'Custom Architecture',
    price: '$12,999',
    billing: 'per project',
    description: 'Dedicated studio engineering, custom 3D web experiences, and SLA guarantees.',
    isPopular: false,
    features: [
      'Dedicated Studio Engineering Squad',
      'Generative AI & LLM Workflow Integration',
      'Custom 3D / R3F WebGL Visualizations',
      'Enterprise Security & Compliance Audit',
      '99.99% Uptime SLA Guarantee',
      '24/7 Dedicated Retainer Support',
    ],
  },
  {
    id: 'custom',
    name: 'Custom',
    badge: 'Bespoke Build',
    price: 'Custom Quote',
    billing: 'flexible scope',
    description: 'Tailored enterprise retainer, dedicated squad, or complex multi-system platform build.',
    isPopular: false,
    features: [
      'Dedicated Full-Time Engineering Squad',
      'Bespoke System Architecture & Codebase',
      'Dedicated Executive Account Manager',
      'Direct Private Slack / Discord Channel',
      'Priority Emergency Hotfixes & Maintenance',
      'Flexible Billing & Custom Retainer Terms',
    ],
  },
];

export default function PricingPage() {
  const [plans, setPlans] = useState<PricingPlan[]>(DEFAULT_PLANS);

  useEffect(() => {
    async function loadPricing() {
      try {
        const res = await fetch('/api/pricing');
        const data = await res.json();
        if (data.success && Array.isArray(data.data) && data.data.length > 0) {
          const ORDER = ['starter', 'pro', 'premium', 'custom'];
          const sorted = data.data.sort((a: any, b: any) => {
            const idxA = ORDER.indexOf(a.id);
            const idxB = ORDER.indexOf(b.id);
            return (idxA === -1 ? 99 : idxA) - (idxB === -1 ? 99 : idxB);
          });
          setPlans(sorted);
        }
      } catch (err) {
        console.warn('Pricing fetch active:', err);
      }
    }

    loadPricing();

    // Real-time sync with Firestore client SDK when authorized
    if (db) {
      try {
        const unsub = onSnapshot(
          collection(db, 'pricing'),
          (snapshot) => {
            if (!snapshot.empty) {
              const ORDER = ['starter', 'pro', 'premium', 'custom'];
              const firestorePlans = snapshot.docs.map((doc) => ({
                id: doc.id,
                ...doc.data(),
              })) as PricingPlan[];

              const sorted = firestorePlans.sort((a: any, b: any) => {
                const idxA = ORDER.indexOf(a.id);
                const idxB = ORDER.indexOf(b.id);
                return (idxA === -1 ? 99 : idxA) - (idxB === -1 ? 99 : idxB);
              });
              setPlans(sorted);
            }
          },
          (err) => {
            // Silently swallow client Firestore permission errors since /api/pricing already populates data via Server Admin SDK
          }
        );
        return () => unsub();
      } catch (e) {
        // Ignored
      }
    }
  }, []);

  return (
    <>
      <Navbar />

      <main className="pt-32 pb-24 relative min-h-screen bg-[#F8FAFC] dark:bg-[#06070A]">
        <div className="w-full max-w-[105rem] mx-auto px-4 sm:px-8 lg:px-12">
          {/* Header */}
          <div className="max-w-3xl mb-16 text-center mx-auto">
            <BlurReveal>
              <span className="text-xs font-mono text-[#3B82F6] uppercase tracking-widest font-semibold block mb-2">
                / 03 — Pricing & Engagement Models
              </span>
            </BlurReveal>

            <BlurReveal delay={0.15}>
              <h1 className="text-3xl sm:text-5xl lg:text-6xl font-display font-black tracking-tight text-[#0F172A] dark:text-[#F8FAFC] mb-4 leading-tight">
                Transparent pricing for{' '}
                <span className="text-[#3B82F6] inline-block">high-impact software.</span>
              </h1>
            </BlurReveal>

            <BlurReveal delay={0.3}>
              <p className="text-lg sm:text-xl text-[#334155] dark:text-[#CBD5E1] leading-relaxed font-body font-medium">
                Choose the engineering tier that matches your product scope. Controlled live from the Devzite Studio Admin Panel.
              </p>
            </BlurReveal>
          </div>

          {/* Pricing Grid (Expanded 4 Columns) */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 lg:gap-8 items-stretch mb-20 w-full">
            {plans.map((p, index) => (
              <BlurReveal key={p.id} delay={0.15 + index * 0.1}>
                <div
                  className={`rounded-3xl glass-card p-6 sm:p-8 border flex flex-col justify-between relative overflow-hidden transition-all duration-300 h-full bg-white dark:bg-[#0C0D14] ${
                    p.isPopular
                      ? 'border-[#3B82F6] shadow-[0_20px_50px_rgba(59,130,246,0.18)] ring-2 ring-[#3B82F6]/30'
                      : 'border-[rgba(15,23,42,0.08)] dark:border-[rgba(255,255,255,0.08)] hover:border-[rgba(59,130,246,0.35)] shadow-xl'
                  }`}
                >
                  {p.isPopular && (
                    <div className="absolute top-4 right-4 px-3 py-1 rounded-full text-xs font-mono font-bold bg-[#3B82F6] text-white flex items-center gap-1.5 shadow-md">
                      <Sparkles size={12} />
                      <span>{p.badge || 'Most Popular'}</span>
                    </div>
                  )}

                  <div>
                    <span className="text-xs font-mono text-[#3B82F6] uppercase tracking-wider font-bold block mb-2">
                      {p.badge || p.name}
                    </span>

                    <h2 className="font-display font-bold text-2xl sm:text-3xl text-[#0F172A] dark:text-[#F8FAFC] mb-3">
                      {p.name}
                    </h2>

                    <div className="flex flex-wrap items-baseline gap-1.5 my-4">
                      <span className="text-3xl sm:text-4xl font-display font-black text-[#0F172A] dark:text-[#F8FAFC] tracking-tight">
                        {p.price}
                      </span>
                      <span className="text-xs font-mono text-[#64748B] font-semibold">/ {p.billing}</span>
                    </div>

                    <p className="text-sm text-[#475569] dark:text-[#94A3B8] leading-relaxed mb-8 font-body font-medium">
                      {p.description}
                    </p>

                    <div className="space-y-3 pt-6 border-t border-[rgba(15,23,42,0.08)] dark:border-[rgba(255,255,255,0.08)] mb-8">
                      <span className="text-xs font-mono text-[#64748B] uppercase tracking-wider font-bold block mb-4">
                        What's Included:
                      </span>
                      {p.features?.map((f, i) => (
                        <div key={i} className="flex items-start gap-3 text-sm text-[#334155] dark:text-[#CBD5E1] font-body font-medium">
                          <div className="w-4 h-4 rounded-full bg-[rgba(59,130,246,0.1)] border border-[rgba(59,130,246,0.25)] flex items-center justify-center shrink-0 mt-0.5 text-[#3B82F6]">
                            <Check size={10} />
                          </div>
                          <span>{f}</span>
                        </div>
                      ))}
                    </div>
                  </div>

                  <div className="pt-6 border-t border-[rgba(15,23,42,0.08)] dark:border-[rgba(255,255,255,0.08)]">
                    <Link
                      href={`/contact?plan=${encodeURIComponent(p.name)}`}
                      className={`w-full py-4 rounded-2xl font-display text-xs font-bold uppercase tracking-wider flex items-center justify-center gap-2 transition-all shadow-md group ${
                        p.isPopular
                          ? 'bg-[#3B82F6] hover:bg-[#2563EB] text-white shadow-[0_0_20px_rgba(59,130,246,0.3)]'
                          : 'bg-[rgba(15,23,42,0.04)] dark:bg-[rgba(255,255,255,0.04)] hover:bg-[#3B82F6] hover:text-white text-[#0F172A] dark:text-[#F8FAFC] border border-[rgba(15,23,42,0.08)] dark:border-[rgba(255,255,255,0.08)]'
                      }`}
                    >
                      <span>Start {p.name} Project</span>
                      <ArrowRight size={16} className="group-hover:translate-x-1 transition-transform" />
                    </Link>
                  </div>
                </div>
              </BlurReveal>
            ))}
          </div>

          {/* Guarantee Banner */}
          <BlurReveal delay={0.5}>
            <div className="max-w-4xl mx-auto rounded-3xl glass-card p-8 border border-[rgba(15,23,42,0.08)] dark:border-[rgba(255,255,255,0.08)] text-center bg-white dark:bg-[#0C0D14]">
              <Zap size={28} className="text-[#3B82F6] mx-auto mb-3" />
              <h3 className="font-display font-bold text-xl text-[#0F172A] dark:text-[#F8FAFC] mb-2">
                Need a Custom Retainer or Enterprise SLA?
              </h3>
              <p className="text-sm text-[#475569] dark:text-[#94A3B8] max-w-xl mx-auto mb-6 font-body font-medium">
                We structure custom monthly retainers, dedicated engineering squads, and 24/7 SLA contracts tailored to enterprise requirements.
              </p>
              <Link href="/contact?plan=Custom" className="btn-primary text-xs px-6 py-3">
                Talk to Engineering Lead
              </Link>
            </div>
          </BlurReveal>
        </div>
      </main>

      <Footer />
    </>
  );
}

'use client';

import { useState, useEffect, Suspense } from 'react';
import { useSearchParams } from 'next/navigation';
import { Navbar } from '@/components/layout/Navbar';
import { Footer } from '@/components/layout/Footer';
import { BlurReveal } from '@/components/motion';
import { Mail, MapPin, Clock, Send, CheckCircle2, ShieldCheck, MessageSquare, Phone } from 'lucide-react';

const SERVICES_OPTIONS = [
  'Custom Web Engineering (Next.js 15)',
  'Full-Stack SaaS Web App',
  'Native Android / iOS Mobile App',
  'AI Video & Generative Media',
];

interface PricingTier {
  id: string;
  name: string;
  price: string;
  badge?: string;
  billing?: string;
}

function ContactFormContent() {
  const searchParams = useSearchParams();
  const planParam = searchParams.get('plan');

  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [phone, setPhone] = useState('');
  const [company, setCompany] = useState('');
  const [service, setService] = useState(SERVICES_OPTIONS[0]);
  const [budget, setBudget] = useState('');
  const [message, setMessage] = useState('');

  const [pricingPlans, setPricingPlans] = useState<PricingTier[]>([]);
  const [loading, setLoading] = useState(false);
  const [submitted, setSubmitted] = useState(false);

  // Fetch live pricing cards from API to populate budget options
  useEffect(() => {
    async function fetchPricing() {
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
          setPricingPlans(sorted);

          // Default budget selection to the first pricing tier if not selected
          const defaultPrice = `${sorted[0].name} (${sorted[0].price})`;
          setBudget((prev) => prev || defaultPrice);

          // If plan query parameter exists (e.g. ?plan=pro), select that plan's price
          if (planParam) {
            const matchedPlan = sorted.find(
              (p: PricingTier) =>
                p.id.toLowerCase() === planParam.toLowerCase() ||
                p.name.toLowerCase().includes(planParam.toLowerCase())
            );
            if (matchedPlan) {
              setBudget(`${matchedPlan.name} (${matchedPlan.price})`);
            }
          }
        }
      } catch (err) {
        console.warn('Failed to load pricing cards for budget options:', err);
      }
    }
    fetchPricing();
  }, [planParam]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!name || !email) return;

    setLoading(true);
    const newLead = {
      id: `lead-${Date.now()}`,
      name,
      email,
      phone: phone || 'Not specified',
      company: company || 'Not specified',
      service,
      budget: budget || 'Not selected',
      message: message || 'Inquiry sent via /contact page form.',
      status: 'New Inquiry',
      createdAt: new Date().toISOString(),
    };

    try {
      await fetch('/api/leads', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(newLead),
      });

      setSubmitted(true);
      setName('');
      setEmail('');
      setPhone('');
      setCompany('');
      setMessage('');
    } catch (err) {
      console.error('Error submitting lead:', err);
      setSubmitted(true);
    } finally {
      setLoading(false);
    }
  };

  return (
    <>
      <Navbar />

      <main className="pt-32 pb-24 relative min-h-screen bg-[#F8FAFC] dark:bg-[#06070A]">
        <div className="container-site">
          {/* Page Header */}
          <div className="max-w-3xl mb-16">
            <BlurReveal>
              <span className="text-xs font-mono text-[#3B82F6] uppercase tracking-widest font-semibold block mb-2">
                / 04 — Start a Project & Inquiries
              </span>
            </BlurReveal>

            <BlurReveal delay={0.15}>
              <h1 className="text-3xl sm:text-5xl lg:text-6xl font-display font-black tracking-tight text-[#0F172A] dark:text-[#F8FAFC] mb-4 leading-tight">
                Let's build something{' '}
                <span className="text-[#3B82F6] inline-block">extraordinary together.</span>
              </h1>
            </BlurReveal>

            <BlurReveal delay={0.3}>
              <p className="text-lg sm:text-xl text-[#334155] dark:text-[#CBD5E1] leading-relaxed font-body font-medium">
                Have a new digital product idea, SaaS platform, or mobile app requirement? Send us a message and our lead engineering team will respond within 2 hours.
              </p>
            </BlurReveal>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-start">
            {/* ── Left Column: Contact Form (7 Cols) ── */}
            <BlurReveal delay={0.35} className="lg:col-span-7">
              <div className="rounded-3xl glass-card p-8 sm:p-10 border border-[rgba(15,23,42,0.08)] dark:border-[rgba(255,255,255,0.08)] bg-white dark:bg-[#0C0D14] shadow-2xl relative overflow-hidden">
                {submitted ? (
                  <div className="text-center py-12 space-y-4">
                    <div className="w-16 h-16 rounded-full bg-[rgba(16,185,129,0.1)] border border-[rgba(16,185,129,0.25)] flex items-center justify-center text-[#10B981] mx-auto mb-4">
                      <CheckCircle2 size={32} />
                    </div>
                    <h3 className="text-2xl font-display font-bold text-[#0F172A] dark:text-[#F8FAFC]">
                      Inquiry Received!
                    </h3>
                    <p className="text-sm text-[#475569] dark:text-[#94A3B8] max-w-md mx-auto font-body font-medium">
                      Thank you for reaching out to DevZite Studio. Your project inquiry has been routed to our lead engineering team. We'll be in touch shortly!
                    </p>
                    <button
                      onClick={() => setSubmitted(false)}
                      className="btn-primary text-xs px-6 py-3 mt-4 cursor-pointer"
                    >
                      Send Another Message
                    </button>
                  </div>
                ) : (
                  <form onSubmit={handleSubmit} className="space-y-6">
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                      <div>
                        <label className="block text-xs font-mono font-bold text-[#475569] dark:text-[#94A3B8] uppercase tracking-wider mb-2">
                          Your Full Name *
                        </label>
                        <input
                          type="text"
                          required
                          placeholder="Sarah Jenkins"
                          value={name}
                          onChange={(e) => setName(e.target.value)}
                          className="w-full px-4 py-3.5 rounded-2xl bg-[rgba(15,23,42,0.03)] dark:bg-[rgba(255,255,255,0.04)] border border-[rgba(15,23,42,0.08)] dark:border-[rgba(255,255,255,0.08)] text-[#0F172A] dark:text-[#F8FAFC] placeholder-[#94A3B8] text-sm outline-none focus:ring-2 focus:ring-[#3B82F6]/50 focus:border-[#3B82F6] font-body"
                        />
                      </div>

                      <div>
                        <label className="block text-xs font-mono font-bold text-[#475569] dark:text-[#94A3B8] uppercase tracking-wider mb-2">
                          Email Address *
                        </label>
                        <input
                          type="email"
                          required
                          placeholder="sarah@company.com"
                          value={email}
                          onChange={(e) => setEmail(e.target.value)}
                          className="w-full px-4 py-3.5 rounded-2xl bg-[rgba(15,23,42,0.03)] dark:bg-[rgba(255,255,255,0.04)] border border-[rgba(15,23,42,0.08)] dark:border-[rgba(255,255,255,0.08)] text-[#0F172A] dark:text-[#F8FAFC] placeholder-[#94A3B8] text-sm outline-none focus:ring-2 focus:ring-[#3B82F6]/50 focus:border-[#3B82F6] font-body"
                        />
                      </div>
                    </div>

                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                      <div>
                        <label className="block text-xs font-mono font-bold text-[#475569] dark:text-[#94A3B8] uppercase tracking-wider mb-2">
                          Company or Studio Name
                        </label>
                        <input
                          type="text"
                          placeholder="e.g. Apex Innovations Co."
                          value={company}
                          onChange={(e) => setCompany(e.target.value)}
                          className="w-full px-4 py-3.5 rounded-2xl bg-[rgba(15,23,42,0.03)] dark:bg-[rgba(255,255,255,0.04)] border border-[rgba(15,23,42,0.08)] dark:border-[rgba(255,255,255,0.08)] text-[#0F172A] dark:text-[#F8FAFC] placeholder-[#94A3B8] text-sm outline-none focus:ring-2 focus:ring-[#3B82F6]/50 focus:border-[#3B82F6] font-body"
                        />
                      </div>

                      <div>
                        <label className="block text-xs font-mono font-bold text-[#475569] dark:text-[#94A3B8] uppercase tracking-wider mb-2">
                          WhatsApp / Phone Number
                        </label>
                        <input
                          type="tel"
                          placeholder="+1 (555) 000-0000"
                          value={phone}
                          onChange={(e) => setPhone(e.target.value)}
                          className="w-full px-4 py-3.5 rounded-2xl bg-[rgba(15,23,42,0.03)] dark:bg-[rgba(255,255,255,0.04)] border border-[rgba(15,23,42,0.08)] dark:border-[rgba(255,255,255,0.08)] text-[#0F172A] dark:text-[#F8FAFC] placeholder-[#94A3B8] text-sm outline-none focus:ring-2 focus:ring-[#3B82F6]/50 focus:border-[#3B82F6] font-body"
                        />
                      </div>
                    </div>

                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                      <div>
                        <label className="block text-xs font-mono font-bold text-[#475569] dark:text-[#94A3B8] uppercase tracking-wider mb-2">
                          Service Domain
                        </label>
                        <select
                          value={service}
                          onChange={(e) => setService(e.target.value)}
                          className="w-full px-4 py-3.5 rounded-2xl bg-[rgba(15,23,42,0.03)] dark:bg-[rgba(255,255,255,0.04)] border border-[rgba(15,23,42,0.08)] dark:border-[rgba(255,255,255,0.08)] text-[#0F172A] dark:text-[#F8FAFC] text-sm outline-none focus:ring-2 focus:ring-[#3B82F6]/50 focus:border-[#3B82F6] font-body cursor-pointer"
                        >
                          {SERVICES_OPTIONS.map((opt) => (
                            <option key={opt} value={opt} className="bg-white dark:bg-[#0C0D14] text-[#0F172A] dark:text-[#F8FAFC]">
                              {opt}
                            </option>
                          ))}
                        </select>
                      </div>

                      <div>
                        <label className="block text-xs font-mono font-bold text-[#475569] dark:text-[#94A3B8] uppercase tracking-wider mb-2">
                          Estimated Budget (From Pricing Cards)
                        </label>
                        <select
                          value={budget}
                          onChange={(e) => setBudget(e.target.value)}
                          className="w-full px-4 py-3.5 rounded-2xl bg-[rgba(15,23,42,0.03)] dark:bg-[rgba(255,255,255,0.04)] border border-[rgba(15,23,42,0.08)] dark:border-[rgba(255,255,255,0.08)] text-[#0F172A] dark:text-[#F8FAFC] text-sm outline-none focus:ring-2 focus:ring-[#3B82F6]/50 focus:border-[#3B82F6] font-body cursor-pointer"
                        >
                          {pricingPlans.length > 0 ? (
                            pricingPlans.map((plan) => {
                              const val = `${plan.name} (${plan.price})`;
                              return (
                                <option key={plan.id} value={val} className="bg-white dark:bg-[#0C0D14] text-[#0F172A] dark:text-[#F8FAFC]">
                                  {plan.name} — {plan.price} {plan.billing ? `(${plan.billing})` : ''}
                                </option>
                              );
                            })
                          ) : (
                            <>
                              <option value="Starter ($2,500)" className="bg-white dark:bg-[#0C0D14] text-[#0F172A] dark:text-[#F8FAFC]">Starter — $2,500 (per project)</option>
                              <option value="Pro Studio ($5,999)" className="bg-white dark:bg-[#0C0D14] text-[#0F172A] dark:text-[#F8FAFC]">Pro Studio — $5,999 (per project)</option>
                              <option value="Premium ($12,999)" className="bg-white dark:bg-[#0C0D14] text-[#0F172A] dark:text-[#F8FAFC]">Premium — $12,999 (per project)</option>
                              <option value="Custom (Custom Quote)" className="bg-white dark:bg-[#0C0D14] text-[#0F172A] dark:text-[#F8FAFC]">Custom — Custom Quote (flexible scope)</option>
                            </>
                          )}
                        </select>
                      </div>
                    </div>

                    <div>
                      <label className="block text-xs font-mono font-bold text-[#475569] dark:text-[#94A3B8] uppercase tracking-wider mb-2">
                        Project Overview & Goals
                      </label>
                      <textarea
                        rows={4}
                        placeholder="Tell us about your timeline, core features, and target outcomes..."
                        value={message}
                        onChange={(e) => setMessage(e.target.value)}
                        className="w-full px-4 py-3.5 rounded-2xl bg-[rgba(15,23,42,0.03)] dark:bg-[rgba(255,255,255,0.04)] border border-[rgba(15,23,42,0.08)] dark:border-[rgba(255,255,255,0.08)] text-[#0F172A] dark:text-[#F8FAFC] placeholder-[#94A3B8] text-sm outline-none focus:ring-2 focus:ring-[#3B82F6]/50 focus:border-[#3B82F6] font-body"
                      />
                    </div>

                    <button
                      type="submit"
                      disabled={loading}
                      className="btn-primary w-full py-4 text-sm font-bold shadow-[0_0_25px_rgba(59,130,246,0.3)] cursor-pointer"
                    >
                      {loading ? (
                        <span>Submitting Inquiry...</span>
                      ) : (
                        <span className="flex items-center justify-center gap-2">
                          <span>Submit Project Inquiry</span>
                          <Send size={16} />
                        </span>
                      )}
                    </button>
                  </form>
                )}
              </div>
            </BlurReveal>

            {/* ── Right Column: Studio Contact Specs (5 Cols) ── */}
            <BlurReveal delay={0.45} className="lg:col-span-5 space-y-6">
              {/* Studio Card */}
              <div className="rounded-3xl glass-card p-8 border border-[rgba(15,23,42,0.08)] dark:border-[rgba(255,255,255,0.08)] bg-white dark:bg-[#0C0D14] space-y-6">
                <div className="flex items-center gap-3 pb-4 border-b border-[rgba(15,23,42,0.08)] dark:border-[rgba(255,255,255,0.08)]">
                  <div className="p-3 rounded-2xl bg-[rgba(59,130,246,0.1)] text-[#3B82F6]">
                    <MessageSquare size={24} />
                  </div>
                  <div>
                    <h4 className="font-display font-bold text-lg text-[#0F172A] dark:text-[#F8FAFC]">
                      Direct Studio Desk
                    </h4>
                    <span className="text-xs font-mono text-[#10B981] font-semibold flex items-center gap-1.5 mt-0.5">
                      <span className="w-2 h-2 rounded-full bg-[#10B981] animate-pulse" />
                      Engineering Team Online
                    </span>
                  </div>
                </div>

                <div className="space-y-4 text-xs font-mono text-[#475569] dark:text-[#94A3B8]">
                  <div className="flex items-start gap-3">
                    <Mail size={16} className="text-[#3B82F6] shrink-0 mt-0.5" />
                    <div>
                      <span className="block font-bold text-[#0F172A] dark:text-[#F8FAFC] mb-0.5">Official Studio Inbox</span>
                      <a href="mailto:hello@devzite.com" className="font-bold text-[#0F172A] dark:text-[#F8FAFC] hover:text-[#3B82F6] transition-colors">
                        hello@devzite.com
                      </a>
                    </div>
                  </div>

                  <div className="flex items-start gap-3">
                    <Clock size={16} className="text-[#3B82F6] shrink-0 mt-0.5" />
                    <div>
                      <span className="block font-bold text-[#0F172A] dark:text-[#F8FAFC] mb-0.5">Guaranteed SLA Response</span>
                      <span>Within 2 hours (24/7 Global Support)</span>
                    </div>
                  </div>

                  <div className="flex items-start gap-3">
                    <MapPin size={16} className="text-[#3B82F6] shrink-0 mt-0.5" />
                    <div>
                      <span className="block font-bold text-[#0F172A] dark:text-[#F8FAFC] mb-0.5">Studio Headquarters</span>
                      <span>Silicon Valley, CA · Remote Global Ops</span>
                    </div>
                  </div>
                </div>
              </div>

              {/* Warranty Card */}
              <div className="rounded-3xl glass-card p-6 border border-[rgba(59,130,246,0.2)] bg-[rgba(59,130,246,0.03)] flex items-start gap-4">
                <ShieldCheck size={28} className="text-[#3B82F6] shrink-0 mt-1" />
                <div>
                  <h5 className="font-display font-bold text-sm text-[#0F172A] dark:text-[#F8FAFC] mb-1">
                    NDA & Code Guarantee
                  </h5>
                  <p className="text-xs text-[#475569] dark:text-[#94A3B8] font-body leading-relaxed">
                    All project briefs are strictly protected under mutual NDA. You retain 100% IP ownership of all source code, assets, and deployment infrastructure.
                  </p>
                </div>
              </div>
            </BlurReveal>
          </div>
        </div>
      </main>

      <Footer />
    </>
  );
}

export default function ContactPage() {
  return (
    <Suspense fallback={<div className="min-h-screen bg-[#06070A]" />}>
      <ContactFormContent />
    </Suspense>
  );
}

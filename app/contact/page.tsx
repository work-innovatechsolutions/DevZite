'use client';

import { useState, useEffect, Suspense } from 'react';
import { useSearchParams } from 'next/navigation';
import { Navbar } from '@/components/layout/Navbar';
import { Footer } from '@/components/layout/Footer';
import { BlurReveal, WordReveal } from '@/components/motion';
import { Mail, MapPin, Clock, Send, CheckCircle2, ShieldCheck, MessageSquare, Phone } from 'lucide-react';

const SERVICES_OPTIONS = [
  'Starter Plan ($2,499)',
  'Pro Studio Plan ($5,999)',
  'Premium Architecture ($12,999)',
  'Custom Enterprise Retainer',
  'Custom Web Engineering (Next.js 15)',
  'Full-Stack SaaS Web App',
  'Native Android / iOS Mobile App',
  'AI Video & Generative Media',
];

const BUDGET_OPTIONS = [
  '$2,499 - $5,000',
  '$5,000 - $15,000',
  '$15,000 - $30,000',
  '$30,000 - $60,000',
  '$60,000+',
];

function ContactFormContent() {
  const searchParams = useSearchParams();
  const planParam = searchParams.get('plan');

  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [phone, setPhone] = useState('');
  const [company, setCompany] = useState('');
  const [service, setService] = useState(SERVICES_OPTIONS[0]);
  const [budget, setBudget] = useState(BUDGET_OPTIONS[1]);
  const [message, setMessage] = useState('');

  const [loading, setLoading] = useState(false);
  const [submitted, setSubmitted] = useState(false);

  useEffect(() => {
    if (planParam) {
      const matched = SERVICES_OPTIONS.find((s) => s.toLowerCase().includes(planParam.toLowerCase()));
      if (matched) {
        setService(matched);
      } else {
        setService(`${planParam} Plan Request`);
      }
    }
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
      budget,
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
                      className="btn-primary text-xs px-6 py-3 mt-4"
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
                          className="w-full px-4 py-3.5 rounded-2xl bg-[rgba(15,23,42,0.03)] dark:bg-[rgba(255,255,255,0.04)] border border-[rgba(15,23,42,0.08)] dark:border-[rgba(255,255,255,0.08)] text-[#0F172A] dark:text-[#F8FAFC] text-sm outline-none focus:ring-2 focus:ring-[#3B82F6]/50 focus:border-[#3B82F6] font-body"
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
                          Estimated Budget
                        </label>
                        <select
                          value={budget}
                          onChange={(e) => setBudget(e.target.value)}
                          className="w-full px-4 py-3.5 rounded-2xl bg-[rgba(15,23,42,0.03)] dark:bg-[rgba(255,255,255,0.04)] border border-[rgba(15,23,42,0.08)] dark:border-[rgba(255,255,255,0.08)] text-[#0F172A] dark:text-[#F8FAFC] text-sm outline-none focus:ring-2 focus:ring-[#3B82F6]/50 focus:border-[#3B82F6] font-body"
                        >
                          {BUDGET_OPTIONS.map((opt) => (
                            <option key={opt} value={opt} className="bg-white dark:bg-[#0C0D14] text-[#0F172A] dark:text-[#F8FAFC]">
                              {opt}
                            </option>
                          ))}
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
                      className="w-full py-4 rounded-2xl bg-[#3B82F6] hover:bg-[#2563EB] text-white text-xs font-mono font-bold uppercase tracking-wider flex items-center justify-center gap-2 shadow-[0_0_25px_rgba(59,130,246,0.3)] transition-all cursor-pointer"
                    >
                      {loading ? (
                        <span>Transmitting Inquiry...</span>
                      ) : (
                        <>
                          <Send size={16} />
                          <span>Submit Project Request</span>
                        </>
                      )}
                    </button>
                  </form>
                )}
              </div>
            </BlurReveal>

            {/* ── Right Column: Studio Info & Channels (5 Cols) ── */}
            <BlurReveal delay={0.45} className="lg:col-span-5 space-y-6">
              <div className="rounded-3xl glass-card p-8 border border-[rgba(15,23,42,0.08)] dark:border-[rgba(255,255,255,0.08)] bg-white dark:bg-[#0C0D14] shadow-xl">
                <h3 className="font-display font-bold text-xl text-[#0F172A] dark:text-[#F8FAFC] mb-6 flex items-center gap-2">
                  <MessageSquare size={20} className="text-[#3B82F6]" />
                  <span>Direct Communication</span>
                </h3>

                <div className="space-y-6 font-body text-sm">
                  <div className="flex items-start gap-4">
                    <div className="w-10 h-10 rounded-xl bg-[rgba(59,130,246,0.1)] border border-[rgba(59,130,246,0.2)] flex items-center justify-center text-[#3B82F6] shrink-0">
                      <Mail size={18} />
                    </div>
                    <div>
                      <span className="text-xs font-mono text-[#64748B] block mb-0.5">Email Inquiry</span>
                      <a href="mailto:hello@devzite.com" className="font-bold text-[#0F172A] dark:text-[#F8FAFC] hover:text-[#3B82F6] transition-colors">
                        hello@devzite.com
                      </a>
                    </div>
                  </div>

                  <div className="flex items-start gap-4">
                    <div className="w-10 h-10 rounded-xl bg-[rgba(37,211,102,0.1)] border border-[rgba(37,211,102,0.25)] flex items-center justify-center text-[#25D366] shrink-0">
                      <Phone size={18} />
                    </div>
                    <div>
                      <span className="text-xs font-mono text-[#64748B] block mb-0.5">WhatsApp Instant Chat</span>
                      <a href="https://wa.me/15550000000" target="_blank" rel="noopener noreferrer" className="font-bold text-[#0F172A] dark:text-[#F8FAFC] hover:text-[#25D366] transition-colors">
                        Chat on WhatsApp →
                      </a>
                    </div>
                  </div>

                  <div className="flex items-start gap-4">
                    <div className="w-10 h-10 rounded-xl bg-[rgba(139,92,246,0.1)] border border-[rgba(139,92,246,0.2)] flex items-center justify-center text-[#8B5CF6] shrink-0">
                      <Clock size={18} />
                    </div>
                    <div>
                      <span className="text-xs font-mono text-[#64748B] block mb-0.5">Response Guarantee</span>
                      <span className="font-bold text-[#0F172A] dark:text-[#F8FAFC]">
                        Under 2 Hours (Mon — Fri)
                      </span>
                    </div>
                  </div>

                  <div className="flex items-start gap-4">
                    <div className="w-10 h-10 rounded-xl bg-[rgba(6,182,212,0.1)] border border-[rgba(6,182,212,0.2)] flex items-center justify-center text-[#06B6D4] shrink-0">
                      <MapPin size={18} />
                    </div>
                    <div>
                      <span className="text-xs font-mono text-[#64748B] block mb-0.5">Studio Headquarters</span>
                      <span className="font-bold text-[#0F172A] dark:text-[#F8FAFC]">
                        San Francisco, CA & Global Remote
                      </span>
                    </div>
                  </div>
                </div>
              </div>

              {/* Security Card */}
              <div className="rounded-3xl glass-card p-6 border border-[rgba(15,23,42,0.08)] dark:border-[rgba(255,255,255,0.08)] bg-white dark:bg-[#0C0D14] flex items-center gap-3">
                <ShieldCheck size={24} className="text-[#10B981] shrink-0" />
                <p className="text-xs text-[#475569] dark:text-[#94A3B8] font-mono font-medium leading-relaxed">
                  NDAs signed prior to deep dive calls. All project specifications strictly confidential.
                </p>
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
    <Suspense fallback={null}>
      <ContactFormContent />
    </Suspense>
  );
}

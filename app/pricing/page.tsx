'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import confetti from 'canvas-confetti';
import { Navbar } from '@/components/layout/Navbar';
import { Footer } from '@/components/layout/Footer';
import { BlurReveal } from '@/components/motion';
import { Check, Sparkles, ArrowRight, Zap, Tag, CheckCircle2, AlertCircle, X, Star } from 'lucide-react';
import NumberFlow from '@number-flow/react';
import { db } from '@/lib/firebase/client';
import { collection, onSnapshot, doc } from 'firebase/firestore';

interface PricingPlan {
  id: string;
  name: string;
  badge: string;
  currency?: 'USD' | 'INR';
  price: string;
  billing: string;
  description: string;
  isPopular: boolean;
  features: string[];
}

interface Coupon {
  code: string;
  discountPercent: number;
  description: string;
  active: boolean;
}

interface CurrencySetting {
  currency: 'USD' | 'INR';
  symbol: '$' | '₹';
  rate: number;
}

export default function PricingPage() {
  const [plans, setPlans] = useState<PricingPlan[]>([]);
  const [coupons, setCoupons] = useState<Coupon[]>([]);

  // Live Currency state
  const [currencySetting, setCurrencySetting] = useState<CurrencySetting>({
    currency: 'USD',
    symbol: '$',
    rate: 1,
  });

  // Coupon redemption state
  const [couponInput, setCouponInput] = useState('');
  const [appliedCoupon, setAppliedCoupon] = useState<Coupon | null>(null);
  const [couponError, setCouponError] = useState<string | null>(null);
  const [couponSuccessMsg, setCouponSuccessMsg] = useState<string | null>(null);

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

    async function loadCoupons() {
      try {
        const res = await fetch('/api/coupons');
        const data = await res.json();
        if (data.success && Array.isArray(data.data)) {
          setCoupons(data.data);
        }
      } catch (err) {
        console.warn('Coupons fetch active:', err);
      }
    }

    async function loadCurrency() {
      try {
        const res = await fetch('/api/currency');
        const data = await res.json();
        if (data.success && data.data) {
          setCurrencySetting({
            currency: data.data.currency || 'USD',
            symbol: data.data.symbol || '$',
            rate: data.data.rate || 1,
          });
        }
      } catch (err) {
        console.warn('Currency fetch active:', err);
      }
    }

    loadPricing();
    loadCoupons();
    loadCurrency();

    if (db) {
      try {
        const unsubPricing = onSnapshot(
          collection(db, 'pricing'),
          (snapshot) => {
            if (!snapshot.empty) {
              const ORDER = ['starter', 'pro', 'premium', 'custom'];
              const firestorePlans = snapshot.docs.map((d) => ({
                id: d.id,
                ...d.data(),
              })) as PricingPlan[];

              const sorted = firestorePlans.sort((a: any, b: any) => {
                const idxA = ORDER.indexOf(a.id);
                const idxB = ORDER.indexOf(b.id);
                return (idxA === -1 ? 99 : idxA) - (idxB === -1 ? 99 : idxB);
              });
              setPlans(sorted);
            }
          },
          () => {}
        );

        const unsubCurrency = onSnapshot(
          doc(db, 'settings', 'currency'),
          (snapshot) => {
            if (snapshot.exists()) {
              const data = snapshot.data();
              setCurrencySetting({
                currency: data.currency || 'USD',
                symbol: data.symbol || '$',
                rate: data.rate || 1,
              });
            }
          },
          () => {}
        );

        return () => {
          unsubPricing();
          unsubCurrency();
        };
      } catch (e) {
        // Ignored
      }
    }
  }, []);

  const triggerConfetti = () => {
    try {
      confetti({
        particleCount: 80,
        spread: 70,
        origin: { y: 0.6, x: 0.2 },
        colors: ['#3B82F6', '#10B981', '#F59E0B', '#EC4899', '#8B5CF6'],
      });
      confetti({
        particleCount: 80,
        spread: 70,
        origin: { y: 0.6, x: 0.8 },
        colors: ['#3B82F6', '#10B981', '#F59E0B', '#EC4899', '#8B5CF6'],
      });
    } catch (e) {
      console.warn('Confetti trigger notice:', e);
    }
  };

  const handleApplyCoupon = (e: React.FormEvent) => {
    e.preventDefault();
    setCouponError(null);
    setCouponSuccessMsg(null);

    if (!couponInput.trim()) return;

    const cleanInput = couponInput.trim().toUpperCase();
    const matched = coupons.find((c) => c.code.toUpperCase() === cleanInput && c.active);

    if (matched) {
      setAppliedCoupon(matched);
      setCouponSuccessMsg(`🎉 Coupon "${matched.code}" applied! You get ${matched.discountPercent}% OFF.`);
      triggerConfetti();
    } else {
      setAppliedCoupon(null);
      setCouponError(`Invalid or expired promo code "${cleanInput}".`);
    }
  };

  const getNumericPrice = (rawPrice: string) => {
    const match = rawPrice.match(/[\d,]+/);
    if (!match) return null;
    const num = parseInt(match[0].replace(/,/g, ''), 10);
    return isNaN(num) ? null : num;
  };

  const formatPriceDisplay = (basePrice: number) => {
    const rate = currencySetting.rate || 1;
    const converted = Math.round(basePrice * rate);
    const sym = currencySetting.symbol || '$';
    return `${sym}${converted.toLocaleString()}`;
  };

  return (
    <>
      <Navbar />

      <main className="pt-32 pb-24 relative min-h-screen bg-[#F8FAFC] dark:bg-[#06070A]">
        <div className="w-full max-w-[105rem] mx-auto px-4 sm:px-8 lg:px-12">
          {/* Header */}
          <div className="max-w-3xl mb-12 text-center mx-auto">
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
              <p className="text-lg sm:text-xl text-[#334155] dark:text-[#CBD5E1] leading-relaxed font-body font-medium mb-8">
                Choose the engineering tier that matches your product scope. Displayed in{' '}
                <strong className="text-[#3B82F6] font-bold">{currencySetting.currency} ({currencySetting.symbol})</strong>.
              </p>
            </BlurReveal>

            {/* Promo Coupon Redemption Bar */}
            <BlurReveal delay={0.35}>
              <div className="max-w-md mx-auto p-4 rounded-2xl glass-card border border-[rgba(15,23,42,0.08)] dark:border-[rgba(255,255,255,0.08)] bg-white dark:bg-[#0C0D14] shadow-lg">
                <form onSubmit={handleApplyCoupon} className="flex gap-2">
                  <div className="relative flex-1">
                    <Tag size={16} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-[#10B981]" />
                    <input
                      type="text"
                      placeholder="Have a promo code? (e.g. DEVZITE20)"
                      value={couponInput}
                      onChange={(e) => setCouponInput(e.target.value.toUpperCase())}
                      className="w-full pl-10 pr-9 py-2.5 rounded-xl bg-[rgba(15,23,42,0.04)] dark:bg-[rgba(255,255,255,0.04)] border border-[rgba(15,23,42,0.08)] dark:border-[rgba(255,255,255,0.08)] text-xs font-mono font-bold uppercase text-[#0F172A] dark:text-[#F8FAFC] outline-none focus:border-[#10B981]"
                    />
                    {couponInput && (
                      <button
                        type="button"
                        onClick={() => {
                          setCouponInput('');
                          setAppliedCoupon(null);
                          setCouponError(null);
                          setCouponSuccessMsg(null);
                        }}
                        className="absolute right-3 top-1/2 -translate-y-1/2 text-[#64748B] hover:text-[#EF4444] p-1 cursor-pointer transition-colors"
                        title="Clear promo code"
                      >
                        <X size={14} />
                      </button>
                    )}
                  </div>
                  <button
                    type="submit"
                    className="px-4 py-2.5 rounded-xl bg-[#10B981] hover:bg-[#059669] text-white text-xs font-mono font-bold uppercase tracking-wider transition-all shadow-md cursor-pointer shrink-0 flex items-center gap-1.5"
                  >
                    <span>Apply Code</span>
                  </button>
                </form>

                {couponSuccessMsg && (
                  <div className="mt-3 flex items-center justify-between gap-2 px-3 py-2 rounded-xl bg-[#10B981]/10 border border-[#10B981]/20 text-xs font-mono font-bold text-[#10B981]">
                    <div className="flex items-center gap-1.5">
                      <CheckCircle2 size={14} className="shrink-0" />
                      <span>{couponSuccessMsg}</span>
                    </div>
                    <button
                      type="button"
                      onClick={() => {
                        setAppliedCoupon(null);
                        setCouponInput('');
                        setCouponSuccessMsg(null);
                      }}
                      className="p-1 rounded-lg hover:bg-[#10B981]/20 transition-colors text-[#10B981] cursor-pointer shrink-0"
                      title="Remove Coupon"
                    >
                      <X size={14} />
                    </button>
                  </div>
                )}

                {couponError && (
                  <div className="mt-3 flex items-center justify-center gap-1.5 text-xs font-mono font-bold text-[#EF4444]">
                    <AlertCircle size={14} />
                    <span>{couponError}</span>
                  </div>
                )}
              </div>
            </BlurReveal>
          </div>

          {/* Pricing Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 lg:gap-8 items-stretch mb-20 w-full">
            {plans.map((p, index) => {
              const numericVal = getNumericPrice(p.price);
              const activeCurrency = currencySetting.currency;

              // Determine whether this specific tier was stored in INR or USD
              const isTierExplicitINR = p.currency === 'INR' || p.price.includes('₹');
              const isTierExplicitUSD = p.currency === 'USD' || p.price.includes('$');
              // If the plan has no explicit currency marker, a large number (> 2000) is treated as INR
              const isPlanINR = isTierExplicitINR || (!isTierExplicitUSD && numericVal !== null && numericVal > 2000);

              // IMPORTANT: Always use the fixed exchange rate for math.
              // currencySetting.rate is the "multiplier" (86 for INR, 1 for USD) — NOT the exchange rate when USD is active.
              // We use a constant INR_PER_USD so division/multiplication always works correctly.
              const INR_PER_USD = currencySetting.rate && currencySetting.rate > 1 ? currencySetting.rate : 86;

              let baseConvertedVal: number | null = null;
              if (numericVal !== null) {
                if (activeCurrency === 'INR') {
                  // Display in INR: if plan was stored as USD, multiply by exchange rate
                  baseConvertedVal = isPlanINR ? numericVal : Math.round(numericVal * INR_PER_USD);
                } else {
                  // Display in USD: if plan was stored as INR, divide by exchange rate
                  baseConvertedVal = isPlanINR ? Math.round(numericVal / INR_PER_USD) : numericVal;
                }
              }

              const hasDiscount = appliedCoupon && baseConvertedVal !== null;
              const finalConvertedVal = hasDiscount
                ? Math.round(baseConvertedVal! * (1 - appliedCoupon.discountPercent / 100))
                : baseConvertedVal;

              const symbolDisplay = activeCurrency === 'INR' ? '₹' : '$';
              const originalPriceDisplay = baseConvertedVal !== null ? `${symbolDisplay}${baseConvertedVal.toLocaleString()}` : p.price;

              return (
                <BlurReveal key={p.id} delay={0.15 + index * 0.1}>
                  <div
                    className={`rounded-3xl glass-card p-6 sm:p-8 border flex flex-col justify-between relative overflow-hidden transition-all duration-300 h-full bg-white dark:bg-[#0C0D14] ${
                      p.isPopular
                        ? 'border-[#3B82F6] shadow-[0_20px_50px_rgba(59,130,246,0.18)] ring-2 ring-[#3B82F6]/30'
                        : 'border-[rgba(15,23,42,0.08)] dark:border-[rgba(255,255,255,0.08)] hover:border-[rgba(59,130,246,0.35)] shadow-xl'
                    }`}
                  >
                    {p.isPopular && (
                      <div className="absolute top-0 right-0 flex items-center rounded-bl-xl bg-[#3B82F6] px-3 py-1 text-xs font-mono font-bold text-white shadow-md">
                        <Star className="h-3.5 w-3.5 fill-current text-white mr-1" />
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

                      {/* NumberFlow Price Block with Dynamic Currency Formatting */}
                      <div className="min-h-[72px] flex flex-col justify-end my-4">
                        <div className="flex flex-wrap items-baseline gap-2">
                          {finalConvertedVal !== null ? (
                            <div className="flex flex-col">
                              {hasDiscount ? (
                                <span className="text-xs font-mono text-[#EF4444] line-through font-bold h-4">
                                  {originalPriceDisplay}
                                </span>
                              ) : (
                                <span className="text-xs font-mono opacity-0 h-4 font-bold select-none">
                                  placeholder
                                </span>
                              )}

                              <div className="flex items-baseline gap-1.5">
                                <span className={`text-3xl sm:text-4xl font-display font-black tracking-tight ${hasDiscount ? 'text-[#10B981]' : 'text-[#0F172A] dark:text-[#F8FAFC]'}`}>
                                  <NumberFlow
                                    value={finalConvertedVal}
                                    format={{
                                      style: 'currency',
                                      currency: activeCurrency,
                                      currencyDisplay: 'narrowSymbol',
                                      minimumFractionDigits: 0,
                                      maximumFractionDigits: 0,
                                    }}
                                    transformTiming={{
                                      duration: 600,
                                      easing: 'ease-out',
                                    }}
                                    willChange
                                    className="font-variant-numeric: tabular-nums"
                                  />
                                </span>

                                {hasDiscount && (
                                  <span className="text-xs font-mono text-[#10B981] font-bold">
                                    ({appliedCoupon.discountPercent}% OFF)
                                  </span>
                                )}
                              </div>
                            </div>
                          ) : (
                            <div className="flex flex-col">
                              <span className="text-xs font-mono opacity-0 h-4 font-bold select-none">
                                placeholder
                              </span>
                              <span className="text-3xl sm:text-4xl font-display font-black text-[#0F172A] dark:text-[#F8FAFC] tracking-tight">
                                {p.price}
                              </span>
                            </div>
                          )}
                          <span className="text-xs font-mono text-[#64748B] font-semibold">/ {p.billing}</span>
                        </div>
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
                        href={`/contact?plan=${encodeURIComponent(p.name)}${appliedCoupon ? `&coupon=${encodeURIComponent(appliedCoupon.code)}` : ''}`}
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
              );
            })}
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

'use client';

import { useState, useEffect } from 'react';
import { DollarSign, Plus, Check, Edit2, Trash2, Sparkles, X, Tag, Percent } from 'lucide-react';

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

interface Coupon {
  code: string;
  discountPercent: number;
  description: string;
  active: boolean;
}

export default function AdminPricingPage() {
  const [plans, setPlans] = useState<PricingPlan[]>([]);
  const [coupons, setCoupons] = useState<Coupon[]>([]);

  // Modals state
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingPlan, setEditingPlan] = useState<PricingPlan | null>(null);
  const [isCouponModalOpen, setIsCouponModalOpen] = useState(false);
  const [loading, setLoading] = useState(false);
  const [couponLoading, setCouponLoading] = useState(false);

  // Pricing Plan Form State
  const [name, setName] = useState('');
  const [badge, setBadge] = useState('Essential Build');
  const [price, setPrice] = useState('$3,500');
  const [billing, setBilling] = useState('per project');
  const [description, setDescription] = useState('');
  const [isPopular, setIsPopular] = useState(false);
  const [featuresText, setFeaturesText] = useState('');

  // Coupon Form State
  const [code, setCode] = useState('');
  const [discountPercent, setDiscountPercent] = useState(20);
  const [couponDesc, setCouponDesc] = useState('');
  const [couponActive, setCouponActive] = useState(true);

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
          setPlans(sorted);
        }
      } catch (err) {
        console.warn('Pricing API fallback active:', err);
      }
    }

    async function fetchCoupons() {
      try {
        const res = await fetch('/api/coupons');
        const data = await res.json();
        if (data.success && Array.isArray(data.data)) {
          setCoupons(data.data);
        }
      } catch (err) {
        console.warn('Coupons API notice:', err);
      }
    }

    fetchPricing();
    fetchCoupons();
  }, []);

  const handleOpenCreateModal = (planToEdit?: PricingPlan) => {
    if (planToEdit) {
      setEditingPlan(planToEdit);
      setName(planToEdit.name);
      setBadge(planToEdit.badge);
      setPrice(planToEdit.price);
      setBilling(planToEdit.billing);
      setDescription(planToEdit.description);
      setIsPopular(planToEdit.isPopular);
      setFeaturesText(planToEdit.features?.join('\n') || '');
    } else {
      setEditingPlan(null);
      setName('');
      setBadge('Essential Build');
      setPrice('$3,500');
      setBilling('per project');
      setDescription('Custom digital product engineering package.');
      setIsPopular(false);
      setFeaturesText('Next.js 15 Web Application\nTailwind Styling\nFirebase Setup\n1 Month Support');
    }
    setIsModalOpen(true);
  };

  const handleSavePlan = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!name || !price) return;

    setLoading(true);
    const planId = editingPlan ? editingPlan.id : name.toLowerCase().replace(/[^a-z0-9]+/g, '-');
    const updatedPlan: PricingPlan = {
      id: planId,
      name,
      badge,
      price,
      billing,
      description,
      isPopular,
      features: featuresText.split('\n').map((f) => f.trim()).filter(Boolean),
    };

    try {
      await fetch('/api/pricing', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(updatedPlan),
      });

      setPlans((prev) => {
        const exists = prev.some((p) => p.id === planId);
        if (exists) {
          return prev.map((p) => (p.id === planId ? updatedPlan : p));
        }
        return [...prev, updatedPlan];
      });

      setIsModalOpen(false);
    } catch (err) {
      console.error('Error saving pricing plan:', err);
    } finally {
      setLoading(false);
    }
  };

  const handleDeletePlan = async (id: string) => {
    if (!confirm('Are you sure you want to delete this pricing plan?')) return;
    try {
      await fetch(`/api/pricing?id=${encodeURIComponent(id)}`, { method: 'DELETE' });
      setPlans((prev) => prev.filter((p) => p.id !== id));
    } catch (err) {
      console.error('Error deleting pricing plan:', err);
      setPlans((prev) => prev.filter((p) => p.id !== id));
    }
  };

  // Coupon Handlers
  const handleOpenCouponModal = () => {
    setCode('');
    setDiscountPercent(20);
    setCouponDesc('');
    setCouponActive(true);
    setIsCouponModalOpen(true);
  };

  const handleSaveCoupon = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!code) return;

    setCouponLoading(true);
    const cleanCode = code.trim().toUpperCase().replace(/[^A-Z0-9_-]/g, '');
    const newCoupon: Coupon = {
      code: cleanCode,
      discountPercent: Number(discountPercent) || 10,
      description: couponDesc || `${discountPercent}% promotional discount`,
      active: couponActive,
    };

    try {
      await fetch('/api/coupons', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(newCoupon),
      });

      setCoupons((prev) => {
        const exists = prev.some((c) => c.code === cleanCode);
        if (exists) {
          return prev.map((c) => (c.code === cleanCode ? newCoupon : c));
        }
        return [newCoupon, ...prev];
      });

      setIsCouponModalOpen(false);
    } catch (err) {
      console.error('Error saving coupon:', err);
    } finally {
      setCouponLoading(false);
    }
  };

  const handleDeleteCoupon = async (couponCode: string) => {
    if (!confirm(`Are you sure you want to delete coupon "${couponCode}"?`)) return;
    try {
      await fetch(`/api/coupons?code=${encodeURIComponent(couponCode)}`, { method: 'DELETE' });
      setCoupons((prev) => prev.filter((c) => c.code !== couponCode));
    } catch (err) {
      console.error('Error deleting coupon:', err);
      setCoupons((prev) => prev.filter((c) => c.code !== couponCode));
    }
  };

  return (
    <div className="space-y-10">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-6 border-b border-[rgba(15,23,42,0.08)] dark:border-[rgba(255,255,255,0.08)]">
        <div>
          <div className="flex items-center gap-2 text-xs font-mono text-[#3B82F6] font-semibold mb-1">
            <DollarSign size={16} />
            <span>DEVZITE / PRICING & COUPONS CMS</span>
          </div>
          <h1 className="text-3xl font-display font-black text-[#0F172A] dark:text-[#F8FAFC]">
            Pricing Plans & Promo Coupons
          </h1>
          <p className="text-sm font-body text-[#475569] dark:text-[#94A3B8] mt-1">
            Manage public pricing tier cards (Starter, Pro, Enterprise) and active promotional discount coupons.
          </p>
        </div>

        <div className="flex items-center gap-3">
          <button
            onClick={handleOpenCouponModal}
            className="inline-flex items-center gap-2 px-4 py-2.5 rounded-full bg-[#10B981]/10 text-[#10B981] hover:bg-[#10B981] hover:text-white border border-[#10B981]/30 font-mono text-xs font-bold uppercase tracking-wider transition-all cursor-pointer shadow-sm"
          >
            <Tag size={14} />
            <span>Add Promo Coupon</span>
          </button>

          <button
            onClick={() => handleOpenCreateModal()}
            className="btn-primary text-xs px-5 py-3 shadow-[0_0_20px_rgba(59,130,246,0.25)]"
          >
            <Plus size={16} />
            Create Pricing Tier
          </button>
        </div>
      </div>

      {/* ── Active Promotional Coupons Section ── */}
      <div className="glass-card rounded-3xl p-6 sm:p-8 border border-[rgba(15,23,42,0.08)] dark:border-[rgba(255,255,255,0.08)] bg-white dark:bg-[#0C0D14]">
        <div className="flex items-center justify-between mb-6 pb-4 border-b border-[rgba(15,23,42,0.08)] dark:border-[rgba(255,255,255,0.08)]">
          <div className="flex items-center gap-2">
            <Tag size={20} className="text-[#10B981]" />
            <h2 className="font-display font-bold text-xl text-[#0F172A] dark:text-[#F8FAFC]">
              Active Discount Coupons ({coupons.length})
            </h2>
          </div>
          <span className="text-xs font-mono text-[#64748B]">Live Firestore Promo Engine</span>
        </div>

        {coupons.length === 0 ? (
          <div className="text-center py-8 text-xs font-mono text-[#64748B]">
            No active promotional coupons found. Click "Add Promo Coupon" to create one.
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
            {coupons.map((c) => (
              <div
                key={c.code}
                className="p-4 rounded-2xl bg-[rgba(15,23,42,0.02)] dark:bg-[rgba(255,255,255,0.03)] border border-[rgba(15,23,42,0.08)] dark:border-[rgba(255,255,255,0.08)] flex items-center justify-between"
              >
                <div>
                  <div className="flex items-center gap-2 mb-1">
                    <span className="px-2.5 py-0.5 rounded-lg bg-[#10B981]/15 text-[#10B981] font-mono font-bold text-xs uppercase tracking-wider border border-[#10B981]/30">
                      {c.code}
                    </span>
                    <span className="text-xs font-mono font-bold text-[#3B82F6]">
                      {c.discountPercent}% OFF
                    </span>
                  </div>
                  <p className="text-xs text-[#64748B] dark:text-[#94A3B8] font-body line-clamp-1">
                    {c.description}
                  </p>
                </div>

                <button
                  onClick={() => handleDeleteCoupon(c.code)}
                  className="p-2 rounded-xl text-[#EF4444] hover:bg-[#EF4444]/10 transition-all cursor-pointer shrink-0 ml-2"
                  title="Delete Coupon"
                >
                  <Trash2 size={16} />
                </button>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* ── Pricing Grid Section ── */}
      <div>
        <h2 className="font-display font-bold text-xl text-[#0F172A] dark:text-[#F8FAFC] mb-6">
          Pricing Tiers ({plans.length})
        </h2>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {plans.map((p) => (
            <div
              key={p.id}
              className={`glass-card rounded-3xl p-6 sm:p-8 border flex flex-col justify-between relative overflow-hidden transition-all bg-white dark:bg-[#0C0D14] ${
                p.isPopular
                  ? 'border-[#3B82F6] shadow-[0_0_30px_rgba(59,130,246,0.15)] ring-2 ring-[#3B82F6]/30'
                  : 'border-[rgba(15,23,42,0.08)] dark:border-[rgba(255,255,255,0.08)]'
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

                <h3 className="font-display font-bold text-2xl text-[#0F172A] dark:text-[#F8FAFC] mb-3">
                  {p.name}
                </h3>

                <div className="flex items-baseline gap-1.5 my-4">
                  <span className="text-3xl font-display font-black text-[#0F172A] dark:text-[#F8FAFC]">
                    {p.price}
                  </span>
                  <span className="text-xs font-mono text-[#64748B] font-semibold">/ {p.billing}</span>
                </div>

                <p className="text-xs text-[#475569] dark:text-[#94A3B8] leading-relaxed mb-6 font-body font-medium">
                  {p.description}
                </p>

                <div className="space-y-2.5 pt-4 border-t border-[rgba(15,23,42,0.08)] dark:border-[rgba(255,255,255,0.08)] mb-6">
                  {p.features?.map((f, i) => (
                    <div key={i} className="flex items-start gap-2.5 text-xs text-[#334155] dark:text-[#CBD5E1] font-body font-medium">
                      <Check size={14} className="text-[#3B82F6] shrink-0 mt-0.5" />
                      <span>{f}</span>
                    </div>
                  ))}
                </div>
              </div>

              <div className="pt-4 border-t border-[rgba(15,23,42,0.08)] dark:border-[rgba(255,255,255,0.08)] flex items-center justify-end gap-2">
                <button
                  onClick={() => handleOpenCreateModal(p)}
                  className="p-2 rounded-xl text-[#3B82F6] hover:bg-[#3B82F6]/10 transition-colors cursor-pointer"
                  title="Edit Plan"
                >
                  <Edit2 size={16} />
                </button>
                <button
                  onClick={() => handleDeletePlan(p.id)}
                  className="p-2 rounded-xl text-[#EF4444] hover:bg-[rgba(239,68,68,0.1)] transition-colors cursor-pointer"
                  title="Delete Plan"
                >
                  <Trash2 size={16} />
                </button>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* ── Pricing Tier Modal ── */}
      {isModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-md overflow-hidden">
          <div
            data-lenis-prevent="true"
            className="glass-card rounded-2xl p-6 sm:p-8 max-w-xl w-full border border-[rgba(15,23,42,0.15)] dark:border-[rgba(255,255,255,0.15)] bg-white dark:bg-[#0C0D14] shadow-2xl overflow-y-auto max-h-[85vh] custom-scrollbar"
          >
            <div className="flex items-center justify-between mb-6 pb-4 border-b border-[rgba(15,23,42,0.08)] dark:border-[rgba(255,255,255,0.08)]">
              <h3 className="font-display font-bold text-xl text-[#0F172A] dark:text-[#F8FAFC]">
                {editingPlan ? 'Edit Pricing Tier' : 'Create New Pricing Tier'}
              </h3>
              <button onClick={() => setIsModalOpen(false)} className="p-1.5 rounded-lg text-[#64748B] hover:text-[#0F172A] dark:hover:text-[#F8FAFC] cursor-pointer">
                <X size={20} />
              </button>
            </div>

            <form onSubmit={handleSavePlan} className="space-y-4 text-xs font-mono">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-[#475569] dark:text-[#94A3B8] mb-1 font-bold">Plan Name</label>
                  <input
                    type="text"
                    required
                    placeholder="e.g. Pro Studio"
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    className="w-full px-4 py-2.5 rounded-xl bg-[rgba(15,23,42,0.03)] dark:bg-[rgba(255,255,255,0.04)] border border-[rgba(15,23,42,0.08)] dark:border-[rgba(255,255,255,0.08)] text-[#0F172A] dark:text-[#F8FAFC] outline-none focus:border-[#3B82F6]"
                  />
                </div>

                <div>
                  <label className="block text-[#475569] dark:text-[#94A3B8] mb-1 font-bold">Badge Text</label>
                  <input
                    type="text"
                    placeholder="e.g. Most Popular"
                    value={badge}
                    onChange={(e) => setBadge(e.target.value)}
                    className="w-full px-4 py-2.5 rounded-xl bg-[rgba(15,23,42,0.03)] dark:bg-[rgba(255,255,255,0.04)] border border-[rgba(15,23,42,0.08)] dark:border-[rgba(255,255,255,0.08)] text-[#0F172A] dark:text-[#F8FAFC] outline-none focus:border-[#3B82F6]"
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-[#475569] dark:text-[#94A3B8] mb-1 font-bold">Price Amount</label>
                  <input
                    type="text"
                    required
                    placeholder="e.g. $5,999 or Custom Quote"
                    value={price}
                    onChange={(e) => setPrice(e.target.value)}
                    className="w-full px-4 py-2.5 rounded-xl bg-[rgba(15,23,42,0.03)] dark:bg-[rgba(255,255,255,0.04)] border border-[rgba(15,23,42,0.08)] dark:border-[rgba(255,255,255,0.08)] text-[#0F172A] dark:text-[#F8FAFC] outline-none focus:border-[#3B82F6]"
                  />
                </div>

                <div>
                  <label className="block text-[#475569] dark:text-[#94A3B8] mb-1 font-bold">Billing Scope</label>
                  <input
                    type="text"
                    placeholder="e.g. per project or monthly"
                    value={billing}
                    onChange={(e) => setBilling(e.target.value)}
                    className="w-full px-4 py-2.5 rounded-xl bg-[rgba(15,23,42,0.03)] dark:bg-[rgba(255,255,255,0.04)] border border-[rgba(15,23,42,0.08)] dark:border-[rgba(255,255,255,0.08)] text-[#0F172A] dark:text-[#F8FAFC] outline-none focus:border-[#3B82F6]"
                  />
                </div>
              </div>

              <div>
                <label className="block text-[#475569] dark:text-[#94A3B8] mb-1 font-bold">Plan Description</label>
                <textarea
                  rows={2}
                  required
                  placeholder="Describe the plan target audience..."
                  value={description}
                  onChange={(e) => setDescription(e.target.value)}
                  className="w-full px-4 py-2.5 rounded-xl bg-[rgba(15,23,42,0.03)] dark:bg-[rgba(255,255,255,0.04)] border border-[rgba(15,23,42,0.08)] dark:border-[rgba(255,255,255,0.08)] text-[#0F172A] dark:text-[#F8FAFC] outline-none focus:border-[#3B82F6] font-body text-xs"
                />
              </div>

              <div>
                <label className="block text-[#475569] dark:text-[#94A3B8] mb-1 font-bold">Features Included (one per line)</label>
                <textarea
                  rows={4}
                  placeholder="Next.js 15 Web App&#10;Tailwind Styling&#10;3 Months Support"
                  value={featuresText}
                  onChange={(e) => setFeaturesText(e.target.value)}
                  className="w-full px-4 py-2.5 rounded-xl bg-[rgba(15,23,42,0.03)] dark:bg-[rgba(255,255,255,0.04)] border border-[rgba(15,23,42,0.08)] dark:border-[rgba(255,255,255,0.08)] text-[#0F172A] dark:text-[#F8FAFC] outline-none focus:border-[#3B82F6] font-body text-xs"
                />
              </div>

              <div className="flex items-center gap-2 pt-2">
                <input
                  type="checkbox"
                  id="popular"
                  checked={isPopular}
                  onChange={(e) => setIsPopular(e.target.checked)}
                  className="w-4 h-4 rounded text-[#3B82F6] focus:ring-[#3B82F6] cursor-pointer"
                />
                <label htmlFor="popular" className="text-xs text-[#0F172A] dark:text-[#F8FAFC] font-bold cursor-pointer">
                  Highlight as "Most Popular" Card
                </label>
              </div>

              <div className="pt-4 flex items-center gap-3 border-t border-[rgba(15,23,42,0.08)] dark:border-[rgba(255,255,255,0.08)]">
                <button
                  type="button"
                  onClick={() => setIsModalOpen(false)}
                  className="w-1/2 py-3 rounded-xl border border-[rgba(15,23,42,0.08)] dark:border-[rgba(255,255,255,0.08)] text-[#475569] dark:text-[#94A3B8] font-bold hover:bg-[rgba(15,23,42,0.04)] cursor-pointer"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={loading}
                  className="w-1/2 py-3 rounded-xl bg-[#3B82F6] hover:bg-[#2563EB] text-white font-bold transition-colors shadow-md cursor-pointer"
                >
                  {loading ? 'Saving...' : 'Save Plan'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* ── Add Coupon Modal ── */}
      {isCouponModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-md overflow-hidden">
          <div
            data-lenis-prevent="true"
            className="glass-card rounded-2xl p-6 sm:p-8 max-w-md w-full border border-[rgba(15,23,42,0.15)] dark:border-[rgba(255,255,255,0.15)] bg-white dark:bg-[#0C0D14] shadow-2xl overflow-y-auto max-h-[85vh]"
          >
            <div className="flex items-center justify-between mb-6 pb-4 border-b border-[rgba(15,23,42,0.08)] dark:border-[rgba(255,255,255,0.08)]">
              <div className="flex items-center gap-2">
                <Tag size={18} className="text-[#10B981]" />
                <h3 className="font-display font-bold text-xl text-[#0F172A] dark:text-[#F8FAFC]">
                  Add Promo Coupon
                </h3>
              </div>
              <button onClick={() => setIsCouponModalOpen(false)} className="p-1.5 rounded-lg text-[#64748B] hover:text-[#0F172A] dark:hover:text-[#F8FAFC] cursor-pointer">
                <X size={20} />
              </button>
            </div>

            <form onSubmit={handleSaveCoupon} className="space-y-4 text-xs font-mono">
              <div>
                <label className="block text-[#475569] dark:text-[#94A3B8] mb-1 font-bold">Coupon Code (Uppercase)</label>
                <input
                  type="text"
                  required
                  placeholder="e.g. DEVZITE20"
                  value={code}
                  onChange={(e) => setCode(e.target.value.toUpperCase())}
                  className="w-full px-4 py-2.5 rounded-xl bg-[rgba(15,23,42,0.03)] dark:bg-[rgba(255,255,255,0.04)] border border-[rgba(15,23,42,0.08)] dark:border-[rgba(255,255,255,0.08)] text-[#0F172A] dark:text-[#F8FAFC] outline-none focus:border-[#10B981] uppercase font-bold"
                />
              </div>

              <div>
                <label className="block text-[#475569] dark:text-[#94A3B8] mb-1 font-bold">Discount Percentage (%)</label>
                <input
                  type="number"
                  required
                  min={1}
                  max={99}
                  placeholder="e.g. 20"
                  value={discountPercent}
                  onChange={(e) => setDiscountPercent(Number(e.target.value))}
                  className="w-full px-4 py-2.5 rounded-xl bg-[rgba(15,23,42,0.03)] dark:bg-[rgba(255,255,255,0.04)] border border-[rgba(15,23,42,0.08)] dark:border-[rgba(255,255,255,0.08)] text-[#0F172A] dark:text-[#F8FAFC] outline-none focus:border-[#10B981] font-bold"
                />
              </div>

              <div>
                <label className="block text-[#475569] dark:text-[#94A3B8] mb-1 font-bold">Description / Offer Note</label>
                <input
                  type="text"
                  placeholder="e.g. 20% off on all engineering retainer builds"
                  value={couponDesc}
                  onChange={(e) => setCouponDesc(e.target.value)}
                  className="w-full px-4 py-2.5 rounded-xl bg-[rgba(15,23,42,0.03)] dark:bg-[rgba(255,255,255,0.04)] border border-[rgba(15,23,42,0.08)] dark:border-[rgba(255,255,255,0.08)] text-[#0F172A] dark:text-[#F8FAFC] outline-none focus:border-[#10B981]"
                />
              </div>

              <div className="pt-4 flex items-center gap-3 border-t border-[rgba(15,23,42,0.08)] dark:border-[rgba(255,255,255,0.08)]">
                <button
                  type="button"
                  onClick={() => setIsCouponModalOpen(false)}
                  className="w-1/2 py-3 rounded-xl border border-[rgba(15,23,42,0.08)] dark:border-[rgba(255,255,255,0.08)] text-[#475569] dark:text-[#94A3B8] font-bold hover:bg-[rgba(15,23,42,0.04)] cursor-pointer"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={couponLoading}
                  className="w-1/2 py-3 rounded-xl bg-[#10B981] hover:bg-[#059669] text-white font-bold transition-colors shadow-md cursor-pointer"
                >
                  {couponLoading ? 'Saving...' : 'Save Coupon'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}

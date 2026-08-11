'use client';

import { useState } from 'react';
import {
  CreditCard,
  CheckCircle2,
  Clock,
  Download,
  DollarSign,
  ArrowUpRight,
  ShieldCheck,
  FileText,
  X,
  Lock,
  Check
} from 'lucide-react';
import { BlurReveal } from '@/components/motion';

interface Invoice {
  id: string;
  description: string;
  issueDate: string;
  dueDate: string;
  amount: number;
  status: 'Paid' | 'Due' | 'Pending';
}

const INVOICES_DATA: Invoice[] = [
  { id: 'INV-2026-001', description: 'Initial Contract Deposit (30%) & Architecture Blueprint', issueDate: 'Jul 01, 2026', dueDate: 'Jul 05, 2026', amount: 10500, status: 'Paid' },
  { id: 'INV-2026-002', description: 'Sprint 2 Milestone: Design System & GSAP Tokens', issueDate: 'Jul 15, 2026', dueDate: 'Jul 20, 2026', amount: 10500, status: 'Paid' },
  { id: 'INV-2026-003', description: 'Sprint 3 Milestone: Realtime Database & Ingestion APIs', issueDate: 'Aug 01, 2026', dueDate: 'Aug 05, 2026', amount: 7000, status: 'Paid' },
  { id: 'INV-2026-004', description: 'Sprint 4 & Final Acceptance Milestone (70% Completion)', issueDate: 'Aug 10, 2026', dueDate: 'Aug 18, 2026', amount: 7000, status: 'Due' },
];

export default function ClientInvoicesPage() {
  const [invoices, setInvoices] = useState<Invoice[]>(INVOICES_DATA);
  const [selectedInvoice, setSelectedInvoice] = useState<Invoice | null>(null);
  const [payingInvoice, setPayingInvoice] = useState<Invoice | null>(null);
  const [paySuccess, setPaySuccess] = useState(false);
  const [isProcessing, setIsProcessing] = useState(false);

  const totalContract = 35000;
  const totalPaid = invoices.filter((i) => i.status === 'Paid').reduce((acc, i) => acc + i.amount, 0);
  const totalRemaining = totalContract - totalPaid;

  const handlePayNow = (inv: Invoice) => {
    setPayingInvoice(inv);
    setPaySuccess(false);
  };

  const executePayment = () => {
    if (!payingInvoice) return;
    setIsProcessing(true);
    setTimeout(() => {
      setIsProcessing(false);
      setPaySuccess(true);
      setInvoices((prev) =>
        prev.map((item) => (item.id === payingInvoice.id ? { ...item, status: 'Paid' } : item))
      );
      setTimeout(() => {
        setPayingInvoice(null);
        setPaySuccess(false);
      }, 2000);
    }, 1200);
  };

  return (
    <div className="space-y-8">
      {/* Page Header */}
      <BlurReveal>
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div>
            <div className="flex items-center gap-2 text-xs font-mono text-[#06B6D4] font-bold uppercase tracking-wider mb-1">
              <CreditCard size={16} />
              <span>DevZite Billing & Accounting</span>
            </div>
            <h1 className="text-3xl font-display font-black text-[#F8FAFC]">
              Invoices & Project Billing
            </h1>
            <p className="text-sm font-body text-[#94A3B8] mt-1">
              Review milestone payment schedules, download PDF tax receipts, and pay active invoices securely.
            </p>
          </div>

          <div className="flex items-center gap-3">
            <span className="px-4 py-2 rounded-full text-xs font-mono font-bold bg-[rgba(16,185,129,0.15)] text-[#10B981] border border-[rgba(16,185,129,0.3)] flex items-center gap-1.5">
              <ShieldCheck size={14} />
              Stripe 256-Bit Encrypted Payments
            </span>
          </div>
        </div>
      </BlurReveal>

      {/* Financial Summary Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-6">
        <BlurReveal delay={0.1}>
          <div className="rounded-3xl glass p-6 border border-[rgba(255,255,255,0.08)] bg-[#0C0D14] space-y-1">
            <span className="text-xs font-mono text-[#64748B] uppercase tracking-wider block font-bold">Total Contract Value</span>
            <div className="text-3xl font-display font-black text-[#F8FAFC]">${totalContract.toLocaleString()}</div>
            <p className="text-xs font-mono text-[#94A3B8]">Fixed-Scope Engagement</p>
          </div>
        </BlurReveal>

        <BlurReveal delay={0.15}>
          <div className="rounded-3xl glass p-6 border border-[rgba(255,255,255,0.08)] bg-[#0C0D14] space-y-1">
            <span className="text-xs font-mono text-[#64748B] uppercase tracking-wider block font-bold">Amount Paid to Date</span>
            <div className="text-3xl font-display font-black text-[#10B981]">${totalPaid.toLocaleString()}</div>
            <p className="text-xs font-mono text-[#10B981]">3 of 4 Milestones Settled</p>
          </div>
        </BlurReveal>

        <BlurReveal delay={0.2}>
          <div className="rounded-3xl glass p-6 border border-[rgba(255,255,255,0.08)] bg-[#0C0D14] space-y-1">
            <span className="text-xs font-mono text-[#64748B] uppercase tracking-wider block font-bold">Remaining Balance</span>
            <div className="text-3xl font-display font-black text-[#06B6D4]">${totalRemaining.toLocaleString()}</div>
            <p className="text-xs font-mono text-[#06B6D4]">Next Due: Aug 18, 2026</p>
          </div>
        </BlurReveal>
      </div>

      {/* Invoice Table */}
      <BlurReveal delay={0.25}>
        <div className="rounded-3xl glass p-6 sm:p-8 border border-[rgba(255,255,255,0.08)] bg-[#0C0D14] space-y-6">
          <div className="flex items-center justify-between pb-4 border-b border-[rgba(255,255,255,0.06)]">
            <h3 className="font-display font-bold text-lg text-[#F8FAFC]">
              Milestone Payment Schedule & Invoices
            </h3>
            <span className="text-xs font-mono text-[#94A3B8]">USD ($) Currency</span>
          </div>

          <div className="overflow-x-auto">
            <table className="w-full text-left font-mono text-xs text-[#94A3B8]">
              <thead>
                <tr className="border-b border-[rgba(255,255,255,0.06)] text-[#64748B] uppercase tracking-wider">
                  <th className="pb-4 font-bold">Invoice ID</th>
                  <th className="pb-4 font-bold">Milestone Scope</th>
                  <th className="pb-4 font-bold">Issue Date</th>
                  <th className="pb-4 font-bold">Due Date</th>
                  <th className="pb-4 font-bold">Amount</th>
                  <th className="pb-4 font-bold">Status</th>
                  <th className="pb-4 text-right font-bold">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-[rgba(255,255,255,0.04)]">
                {invoices.map((inv) => (
                  <tr key={inv.id} className="hover:bg-[rgba(255,255,255,0.02)] transition-colors">
                    <td className="py-4 font-bold text-[#06B6D4]">{inv.id}</td>
                    <td className="py-4 font-body text-sm font-medium text-[#F8FAFC] max-w-xs pr-4">
                      {inv.description}
                    </td>
                    <td className="py-4">{inv.issueDate}</td>
                    <td className="py-4">{inv.dueDate}</td>
                    <td className="py-4 font-bold text-[#F8FAFC]">${inv.amount.toLocaleString()}</td>
                    <td className="py-4">
                      {inv.status === 'Paid' ? (
                        <span className="px-3 py-1 rounded-full text-[10px] font-bold uppercase bg-[rgba(16,185,129,0.15)] text-[#10B981] border border-[rgba(16,185,129,0.3)]">
                          ● Paid
                        </span>
                      ) : (
                        <span className="px-3 py-1 rounded-full text-[10px] font-bold uppercase bg-[rgba(6,182,212,0.15)] text-[#06B6D4] border border-[rgba(6,182,212,0.3)]">
                          ● Due Now
                        </span>
                      )}
                    </td>
                    <td className="py-4 text-right">
                      <div className="flex items-center justify-end gap-2">
                        {inv.status === 'Due' && (
                          <button
                            onClick={() => handlePayNow(inv)}
                            className="px-3 py-1.5 rounded-xl bg-[#06B6D4] hover:bg-[#0891B2] text-[#06070A] font-bold text-xs transition-all cursor-pointer shadow-md"
                          >
                            Pay Now
                          </button>
                        )}
                        <button
                          onClick={() => alert(`Downloading official PDF for ${inv.id}`)}
                          className="p-2 rounded-xl glass hover:bg-[rgba(255,255,255,0.06)] text-[#94A3B8] hover:text-[#F8FAFC] transition-colors cursor-pointer"
                          title="Download Invoice PDF"
                        >
                          <Download size={14} />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </BlurReveal>

      {/* Payment Drawer Modal Simulation */}
      {payingInvoice && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/70 backdrop-blur-md">
          <div className="glass-card rounded-3xl p-8 max-w-md w-full border border-[rgba(6,182,212,0.3)] bg-[#0C0D14] shadow-2xl space-y-6">
            <div className="flex items-center justify-between pb-4 border-b border-[rgba(255,255,255,0.06)]">
              <div className="flex items-center gap-2">
                <Lock size={16} className="text-[#06B6D4]" />
                <h3 className="font-display font-bold text-lg text-[#F8FAFC]">
                  Secure Checkout
                </h3>
              </div>
              <button
                onClick={() => setPayingInvoice(null)}
                className="p-1 rounded-lg text-[#94A3B8] hover:text-[#F8FAFC] cursor-pointer"
              >
                <X size={18} />
              </button>
            </div>

            {paySuccess ? (
              <div className="text-center py-6 space-y-3">
                <div className="w-16 h-16 rounded-full bg-[rgba(16,185,129,0.15)] border border-[rgba(16,185,129,0.3)] text-[#10B981] flex items-center justify-center mx-auto">
                  <Check size={32} />
                </div>
                <h4 className="text-xl font-display font-bold text-[#F8FAFC]">Payment Confirmed!</h4>
                <p className="text-xs font-mono text-[#94A3B8]">
                  Invoice {payingInvoice.id} (${payingInvoice.amount.toLocaleString()}) has been successfully processed. Receipt emailed to sarah@nexus.ai.
                </p>
              </div>
            ) : (
              <div className="space-y-4">
                <div className="p-4 rounded-2xl glass bg-[rgba(255,255,255,0.02)] space-y-1">
                  <span className="text-[11px] font-mono text-[#94A3B8] block">{payingInvoice.id}</span>
                  <h4 className="font-display font-bold text-sm text-[#F8FAFC]">{payingInvoice.description}</h4>
                  <div className="text-xl font-display font-black text-[#06B6D4] pt-2">
                    ${payingInvoice.amount.toLocaleString()} USD
                  </div>
                </div>

                <div className="space-y-3 font-mono text-xs">
                  <div>
                    <label className="block text-[#94A3B8] mb-1 font-bold">Cardholder Name</label>
                    <input
                      type="text"
                      readOnly
                      value="Sarah Jenkins (Nexus AI)"
                      className="w-full px-3 py-2 rounded-xl bg-[rgba(255,255,255,0.04)] border border-[rgba(255,255,255,0.08)] text-[#F8FAFC] outline-none"
                    />
                  </div>

                  <div>
                    <label className="block text-[#94A3B8] mb-1 font-bold">Credit Card Number</label>
                    <input
                      type="text"
                      readOnly
                      value="•••• •••• •••• 4242"
                      className="w-full px-3 py-2 rounded-xl bg-[rgba(255,255,255,0.04)] border border-[rgba(255,255,255,0.08)] text-[#F8FAFC] outline-none"
                    />
                  </div>
                </div>

                <button
                  onClick={executePayment}
                  disabled={isProcessing}
                  className="w-full py-3.5 rounded-2xl bg-[#06B6D4] hover:bg-[#0891B2] text-[#06070A] font-mono text-xs font-bold uppercase tracking-wider transition-all shadow-lg active:scale-95 cursor-pointer mt-4"
                >
                  {isProcessing ? 'Processing 256-Bit Charge...' : `Authorize $${payingInvoice.amount.toLocaleString()} Payment`}
                </button>
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  );
}

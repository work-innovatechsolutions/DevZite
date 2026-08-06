'use client';

import { Users, Building2, ShieldCheck, Mail, Phone, ArrowUpRight } from 'lucide-react';

const CLIENTS = [
  {
    name: 'Apex Design Co',
    contact: 'Sarah Jenkins',
    email: 'sarah@apexdesign.com',
    plan: 'Enterprise Web Engineering',
    status: 'Active Retainer',
    monthly: '$8,500/mo',
  },
  {
    name: 'Vance Cloud Systems',
    contact: 'Marcus Vance',
    email: 'marcus@vancecloud.io',
    plan: 'SaaS Platform Architecture',
    status: 'Active Retainer',
    monthly: '$12,000/mo',
  },
  {
    name: 'NovaTech Labs',
    contact: 'Elena Rostova',
    email: 'elena@novatech.app',
    plan: 'Android Mobile Suite',
    status: 'Project Phase',
    monthly: '$25,000 fixed',
  },
];

export default function AdminClientsPage() {
  return (
    <div>
      {/* Page Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-8">
        <div>
          <div className="flex items-center gap-2 text-xs font-mono text-[#3B82F6] font-semibold mb-1">
            <Users size={16} />
            <span>DEVZITE / CLIENT ACCOUNTS</span>
          </div>
          <h1 className="text-3xl font-display font-black text-[#0F172A] dark:text-[#F8FAFC]">
            Active Client Accounts
          </h1>
          <p className="text-sm font-body text-[#475569] dark:text-[#94A3B8] mt-1">
            Monitor client accounts, retainer subscriptions, and direct communication channels.
          </p>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {CLIENTS.map((c) => (
          <div
            key={c.name}
            className="glass-card rounded-2xl p-6 border border-[rgba(15,23,42,0.08)] dark:border-[rgba(255,255,255,0.08)] flex flex-col justify-between"
          >
            <div>
              <div className="flex items-center justify-between mb-4">
                <div className="w-10 h-10 rounded-xl bg-[rgba(59,130,246,0.1)] border border-[rgba(59,130,246,0.2)] flex items-center justify-center text-[#3B82F6]">
                  <Building2 size={20} />
                </div>
                <span className="px-2.5 py-1 rounded-full text-[10px] font-mono font-bold uppercase bg-[rgba(16,185,129,0.15)] text-[#10B981]">
                  {c.status}
                </span>
              </div>

              <h3 className="font-display font-bold text-xl text-[#0F172A] dark:text-[#F8FAFC] mb-1">
                {c.name}
              </h3>
              <p className="text-xs font-mono text-[#3B82F6] mb-4 font-semibold">{c.contact}</p>

              <div className="space-y-2 text-xs font-mono text-[#475569] dark:text-[#94A3B8] mb-6">
                <div className="flex items-center gap-2">
                  <Mail size={14} className="text-[#64748B]" />
                  <span>{c.email}</span>
                </div>
                <div className="flex items-center gap-2">
                  <ShieldCheck size={14} className="text-[#10B981]" />
                  <span>{c.plan}</span>
                </div>
              </div>
            </div>

            <div className="pt-4 border-t border-[rgba(15,23,42,0.08)] dark:border-[rgba(255,255,255,0.08)] flex items-center justify-between font-mono text-xs">
              <span className="text-[#64748B]">Retainer:</span>
              <span className="font-bold text-[#0F172A] dark:text-[#F8FAFC]">{c.monthly}</span>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

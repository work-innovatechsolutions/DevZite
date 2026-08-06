'use client';

import { useState } from 'react';
import { Mail, CheckCircle2, Clock, Filter, ArrowUpRight, Search } from 'lucide-react';

const INQUIRIES = [
  {
    id: 'lead-101',
    name: 'Sarah Jenkins',
    email: 'sarah@apexdesign.com',
    company: 'Apex Design Co',
    service: 'Custom Web Engineering',
    budget: '$15,000 - $30,000',
    date: 'Today, 10:42 AM',
    status: 'New Inquiry',
    message: 'We are looking to rebuild our flagship enterprise marketing platform using Next.js 15 and Tailwind CSS with custom animations.',
  },
  {
    id: 'lead-102',
    name: 'Marcus Vance',
    email: 'marcus@vancecloud.io',
    company: 'Vance Cloud Systems',
    service: 'Full-Stack Web App',
    budget: '$30,000 - $60,000',
    date: 'Yesterday, 4:15 PM',
    status: 'In Review',
    message: 'Need a high-performance React 19 analytics dashboard with real-time WebSocket telemetry and serverless API backend.',
  },
  {
    id: 'lead-103',
    name: 'Elena Rostova',
    email: 'elena@novatech.app',
    company: 'NovaTech Labs',
    service: 'Native Android App',
    budget: '$50,000+',
    date: 'Aug 4, 2026',
    status: 'Proposal Sent',
    message: 'Seeking native Jetpack Compose mobile app architecture for our crypto trading client suite.',
  },
];

export default function AdminLeadsPage() {
  const [selectedLead, setSelectedLead] = useState(INQUIRIES[0]);

  return (
    <div>
      {/* Page Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-8">
        <div>
          <div className="flex items-center gap-2 text-xs font-mono text-[#3B82F6] font-semibold mb-1">
            <Mail size={16} />
            <span>DEVZITE / LEADS & CRM</span>
          </div>
          <h1 className="text-3xl font-display font-black text-[#0F172A] dark:text-[#F8FAFC]">
            Inbound Project Inquiries
          </h1>
          <p className="text-sm font-body text-[#475569] dark:text-[#94A3B8] mt-1">
            Review incoming project proposals, budget parameters, and client contact details.
          </p>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
        {/* Leads List */}
        <div className="lg:col-span-5 space-y-4">
          {INQUIRIES.map((lead) => (
            <div
              key={lead.id}
              onClick={() => setSelectedLead(lead)}
              className={`glass-card rounded-2xl p-5 cursor-pointer border transition-all ${
                selectedLead.id === lead.id
                  ? 'border-[#3B82F6] bg-[rgba(59,130,246,0.06)]'
                  : 'border-[rgba(15,23,42,0.08)] dark:border-[rgba(255,255,255,0.08)]'
              }`}
            >
              <div className="flex items-center justify-between mb-2">
                <span className="font-display font-bold text-[#0F172A] dark:text-[#F8FAFC] text-base">
                  {lead.name}
                </span>
                <span className="px-2 py-0.5 rounded text-[10px] font-mono font-bold uppercase bg-[rgba(59,130,246,0.12)] text-[#3B82F6]">
                  {lead.status}
                </span>
              </div>
              <p className="text-xs font-mono text-[#3B82F6] mb-1 font-semibold">{lead.company}</p>
              <p className="text-xs text-[#475569] dark:text-[#94A3B8] line-clamp-2 font-body mb-3">
                {lead.message}
              </p>
              <div className="flex items-center justify-between text-[11px] font-mono text-[#64748B]">
                <span>{lead.service}</span>
                <span>{lead.date}</span>
              </div>
            </div>
          ))}
        </div>

        {/* Selected Lead Details Drawer */}
        <div className="lg:col-span-7">
          {selectedLead && (
            <div className="glass-card rounded-2xl p-8 border border-[rgba(15,23,42,0.08)] dark:border-[rgba(255,255,255,0.08)]">
              <div className="flex items-center justify-between pb-6 border-b border-[rgba(15,23,42,0.08)] dark:border-[rgba(255,255,255,0.08)] mb-6">
                <div>
                  <h2 className="font-display font-bold text-2xl text-[#0F172A] dark:text-[#F8FAFC]">
                    {selectedLead.name}
                  </h2>
                  <p className="text-xs font-mono text-[#3B82F6] mt-0.5">{selectedLead.email}</p>
                </div>

                <a
                  href={`mailto:${selectedLead.email}`}
                  className="btn-primary text-xs px-5 py-2.5"
                >
                  Reply via Email
                  <ArrowUpRight size={14} />
                </a>
              </div>

              <div className="grid grid-cols-2 gap-4 mb-6 font-mono text-xs">
                <div className="p-4 rounded-xl bg-[rgba(15,23,42,0.03)] dark:bg-[rgba(255,255,255,0.04)] border border-[rgba(15,23,42,0.06)] dark:border-[rgba(255,255,255,0.06)]">
                  <span className="text-[#64748B] block mb-1">Target Service</span>
                  <span className="font-bold text-[#0F172A] dark:text-[#F8FAFC]">{selectedLead.service}</span>
                </div>
                <div className="p-4 rounded-xl bg-[rgba(15,23,42,0.03)] dark:bg-[rgba(255,255,255,0.04)] border border-[rgba(15,23,42,0.06)] dark:border-[rgba(255,255,255,0.06)]">
                  <span className="text-[#64748B] block mb-1">Estimated Budget</span>
                  <span className="font-bold text-[#10B981]">{selectedLead.budget}</span>
                </div>
              </div>

              <div>
                <h4 className="text-xs font-mono uppercase tracking-wider text-[#64748B] mb-2 font-bold">
                  Project Description
                </h4>
                <div className="p-5 rounded-xl bg-[rgba(15,23,42,0.03)] dark:bg-[rgba(255,255,255,0.04)] border border-[rgba(15,23,42,0.06)] dark:border-[rgba(255,255,255,0.06)] text-sm leading-relaxed text-[#334155] dark:text-[#CBD5E1]">
                  {selectedLead.message}
                </div>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

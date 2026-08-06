'use client';

import { BarChart3, Zap, ShieldCheck, Cpu, ArrowUpRight, Activity } from 'lucide-react';

const METRICS = [
  { label: 'Global Edge Requests', value: '1.42M', change: '+18% this month' },
  { label: 'Avg Edge Latency', value: '38ms', change: 'Optimal (< 50ms target)' },
  { label: 'Cache Hit Ratio', value: '99.4%', change: 'Edge CDN Active' },
  { label: 'Server Uptime', value: '99.99%', change: 'Zero Downtime' },
];

export default function AdminAnalyticsPage() {
  return (
    <div>
      {/* Page Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-8">
        <div>
          <div className="flex items-center gap-2 text-xs font-mono text-[#3B82F6] font-semibold mb-1">
            <BarChart3 size={16} />
            <span>DEVZITE / ANALYTICS & TELEMETRY</span>
          </div>
          <h1 className="text-3xl font-display font-black text-[#0F172A] dark:text-[#F8FAFC]">
            Live Studio Telemetry
          </h1>
          <p className="text-sm font-body text-[#475569] dark:text-[#94A3B8] mt-1">
            Real-time server performance metrics, core web vitals, and edge network health.
          </p>
        </div>
      </div>

      {/* Metrics Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-4 gap-5 mb-8">
        {METRICS.map((m) => (
          <div key={m.label} className="glass-card rounded-2xl p-6 border border-[rgba(15,23,42,0.08)] dark:border-[rgba(255,255,255,0.08)]">
            <span className="text-[11px] font-mono text-[#64748B] block uppercase tracking-wider mb-1 font-bold">
              {m.label}
            </span>
            <div className="text-3xl font-display font-black text-[#0F172A] dark:text-[#F8FAFC] mb-1">
              {m.value}
            </div>
            <span className="text-xs font-mono text-[#10B981] font-semibold">
              {m.change}
            </span>
          </div>
        ))}
      </div>

      {/* Live Server Health Card */}
      <div className="glass-card rounded-2xl p-8 border border-[rgba(15,23,42,0.08)] dark:border-[rgba(255,255,255,0.08)]">
        <div className="flex items-center justify-between pb-6 border-b border-[rgba(15,23,42,0.08)] dark:border-[rgba(255,255,255,0.08)] mb-6">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-[rgba(16,185,129,0.1)] border border-[rgba(16,185,129,0.2)] flex items-center justify-center text-[#10B981]">
              <Activity size={20} />
            </div>
            <div>
              <h3 className="font-display font-bold text-xl text-[#0F172A] dark:text-[#F8FAFC]">
                Edge Region Health Status
              </h3>
              <p className="text-xs font-mono text-[#64748B]">All 240+ global CDN nodes operational</p>
            </div>
          </div>
          <span className="flex items-center gap-1.5 text-xs font-mono font-bold text-[#10B981] bg-[rgba(16,185,129,0.15)] px-3 py-1.5 rounded-full">
            <span className="w-2 h-2 rounded-full bg-[#10B981] animate-pulse" />
            100% HEALTHY
          </span>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 text-xs font-mono">
          <div className="p-4 rounded-xl bg-[rgba(15,23,42,0.03)] dark:bg-[rgba(255,255,255,0.04)] border border-[rgba(15,23,42,0.06)] dark:border-[rgba(255,255,255,0.06)]">
            <span className="text-[#64748B] block mb-1">North America CDN</span>
            <span className="font-bold text-[#10B981]">24ms avg latency</span>
          </div>
          <div className="p-4 rounded-xl bg-[rgba(15,23,42,0.03)] dark:bg-[rgba(255,255,255,0.04)] border border-[rgba(15,23,42,0.06)] dark:border-[rgba(255,255,255,0.06)]">
            <span className="text-[#64748B] block mb-1">Europe CDN</span>
            <span className="font-bold text-[#10B981]">31ms avg latency</span>
          </div>
          <div className="p-4 rounded-xl bg-[rgba(15,23,42,0.03)] dark:bg-[rgba(255,255,255,0.04)] border border-[rgba(15,23,42,0.06)] dark:border-[rgba(255,255,255,0.06)]">
            <span className="text-[#64748B] block mb-1">Asia Pacific CDN</span>
            <span className="font-bold text-[#10B981]">45ms avg latency</span>
          </div>
        </div>
      </div>
    </div>
  );
}

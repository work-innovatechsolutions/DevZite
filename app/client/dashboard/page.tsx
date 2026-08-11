'use client';

import { useState } from 'react';
import { useAuth } from '@/providers/AuthProvider';
import Link from 'next/link';
import {
  LayoutDashboard,
  Clock,
  CheckCircle2,
  AlertCircle,
  FileText,
  Download,
  MessageSquare,
  ArrowRight,
  Sparkles,
  TrendingUp,
  ShieldCheck,
  Code2,
  Calendar,
  DollarSign,
  UserCheck
} from 'lucide-react';
import { BlurReveal } from '@/components/motion';

const SPRINT_MILESTONES = [
  { id: 1, title: 'Architecture & System Design', status: 'Completed', date: 'Jul 10, 2026', percent: 100 },
  { id: 2, title: 'Core UI/UX & Glassmorphism Tokens', status: 'Completed', date: 'Jul 22, 2026', percent: 100 },
  { id: 3, title: 'Firebase Admin & Realtime Ingestion', status: 'Completed', date: 'Aug 02, 2026', percent: 100 },
  { id: 4, title: 'QA Testing & Edge Performance Optimization', status: 'In Progress', date: 'Aug 14, 2026', percent: 85 },
  { id: 5, title: 'Production Staging & Client Sign-off', status: 'Upcoming', date: 'Aug 18, 2026', percent: 0 },
  { id: 6, title: 'DNS Cutover & Global CDN Launch', status: 'Upcoming', date: 'Aug 22, 2026', percent: 0 },
];

const RECENT_FILES = [
  { id: 'f1', name: 'Nexus_Architecture_Specification_v2.4.pdf', size: '4.2 MB', category: 'Specification', date: 'Aug 09, 2026' },
  { id: 'f2', name: 'Lighthouse_Audit_Performance_Report.pdf', size: '1.8 MB', category: 'Audit', date: 'Aug 07, 2026' },
  { id: 'f3', name: 'Design_System_Tokens_Export.json', size: '420 KB', category: 'Design System', date: 'Aug 04, 2026' },
  { id: 'f4', name: 'Staging_API_Postman_Collection.json', size: '890 KB', category: 'API Docs', date: 'Aug 01, 2026' },
];

export default function ClientDashboardPage() {
  const { user } = useAuth();
  const firstName = user?.displayName?.split(' ')[0] || user?.email?.split('@')[0] || 'there';
  const [downloadingId, setDownloadingId] = useState<string | null>(null);

  const handleDownload = (id: string, name: string) => {
    setDownloadingId(id);
    setTimeout(() => {
      setDownloadingId(null);
      alert(`Downloaded ${name} successfully.`);
    }, 800);
  };

  return (
    <div className="space-y-8">
      {/* Welcome & Project Overview Header */}
      <BlurReveal>
        <div className="rounded-3xl glass p-8 sm:p-10 border border-[rgba(6,182,212,0.2)] bg-gradient-to-r from-[rgba(6,182,212,0.1)] via-[rgba(59,130,246,0.05)] to-transparent relative overflow-hidden shadow-2xl">
          <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-6 relative z-10">
            <div>
              <div className="flex items-center gap-2 text-xs font-mono text-[#06B6D4] font-bold uppercase tracking-wider mb-2">
                <Sparkles size={14} />
                <span>Active Engagement: Project Nexus AI Studio</span>
              </div>
              <h1 className="text-3xl sm:text-4xl font-display font-black text-[#F8FAFC]">
                Welcome back, {firstName}
              </h1>
              <p className="text-sm font-body text-[#94A3B8] mt-1 max-w-xl">
                Sprint 4 of 6 in active execution. System QA verification & Lighthouse 99+ edge optimizations are under final engineering review.
              </p>
            </div>

            <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-3">
              <span className="px-4 py-2 rounded-full text-xs font-mono font-bold bg-[rgba(39,201,63,0.15)] text-[#27C93F] border border-[rgba(39,201,63,0.3)] flex items-center justify-center gap-2 shadow-sm">
                <span className="w-2 h-2 rounded-full bg-[#27C93F] animate-pulse" />
                Target Launch: Aug 22, 2026
              </span>
              <Link
                href="/client/chat"
                className="btn-primary text-xs px-5 py-2.5 flex items-center justify-center gap-2 shadow-[0_0_20px_rgba(6,182,212,0.3)]"
              >
                <MessageSquare size={14} />
                <span>Message Engineering</span>
              </Link>
            </div>
          </div>
        </div>
      </BlurReveal>

      {/* KPI Cards Grid (4 Cards) */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
        <BlurReveal delay={0.1}>
          <div className="rounded-2xl glass p-6 border border-[rgba(255,255,255,0.08)] bg-[#0C0D14] hover:border-[rgba(6,182,212,0.3)] transition-all">
            <div className="flex items-center justify-between text-[#94A3B8] mb-3">
              <span className="text-xs font-mono font-bold uppercase tracking-wider">Overall Progress</span>
              <TrendingUp size={18} className="text-[#06B6D4]" />
            </div>
            <div className="text-3xl font-display font-black text-[#F8FAFC] mb-2">78%</div>
            <div className="w-full h-2 bg-[rgba(255,255,255,0.1)] rounded-full overflow-hidden mb-2">
              <div className="h-full bg-gradient-to-r from-[#3B82F6] to-[#06B6D4] w-[78%] rounded-full" />
            </div>
            <span className="text-[11px] font-mono text-[#27C93F]">↑ 12% ahead of schedule</span>
          </div>
        </BlurReveal>

        <BlurReveal delay={0.15}>
          <div className="rounded-2xl glass p-6 border border-[rgba(255,255,255,0.08)] bg-[#0C0D14] hover:border-[rgba(6,182,212,0.3)] transition-all">
            <div className="flex items-center justify-between text-[#94A3B8] mb-3">
              <span className="text-xs font-mono font-bold uppercase tracking-wider">Active Sprint</span>
              <Calendar size={18} className="text-[#3B82F6]" />
            </div>
            <div className="text-xl font-display font-bold text-[#F8FAFC] mb-1">Sprint 4 of 6</div>
            <p className="text-xs text-[#94A3B8] font-body line-clamp-1 mb-2">QA & Edge Optimization</p>
            <span className="text-[11px] font-mono text-[#06B6D4]">Due in 3 Days (Aug 14)</span>
          </div>
        </BlurReveal>

        <BlurReveal delay={0.2}>
          <div className="rounded-2xl glass p-6 border border-[rgba(255,255,255,0.08)] bg-[#0C0D14] hover:border-[rgba(6,182,212,0.3)] transition-all">
            <div className="flex items-center justify-between text-[#94A3B8] mb-3">
              <span className="text-xs font-mono font-bold uppercase tracking-wider">Contract Investment</span>
              <DollarSign size={18} className="text-[#10B981]" />
            </div>
            <div className="text-3xl font-display font-black text-[#F8FAFC] mb-1">$35,000</div>
            <div className="flex items-center justify-between text-[11px] font-mono text-[#94A3B8] mt-2">
              <span>Paid: $25,000</span>
              <span className="text-[#10B981] font-bold">Paid to Date</span>
            </div>
          </div>
        </BlurReveal>

        <BlurReveal delay={0.25}>
          <div className="rounded-2xl glass p-6 border border-[rgba(255,255,255,0.08)] bg-[#0C0D14] hover:border-[rgba(6,182,212,0.3)] transition-all">
            <div className="flex items-center justify-between text-[#94A3B8] mb-3">
              <span className="text-xs font-mono font-bold uppercase tracking-wider">Assigned Tech Lead</span>
              <UserCheck size={18} className="text-[#8B5CF6]" />
            </div>
            <div className="flex items-center gap-3">
              <div className="w-9 h-9 rounded-xl bg-[rgba(139,92,246,0.15)] border border-[rgba(139,92,246,0.3)] text-[#8B5CF6] flex items-center justify-center font-bold text-sm">
                AW
              </div>
              <div>
                <span className="text-sm font-display font-bold text-[#F8FAFC] block">Alexander Wright</span>
                <span className="text-[11px] font-mono text-[#94A3B8]">Lead Web Architect</span>
              </div>
            </div>
          </div>
        </BlurReveal>
      </div>

      {/* Main 2-Column Section */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
        {/* Left Column: Sprint Milestones Roadmap (7 Cols) */}
        <BlurReveal delay={0.3} className="lg:col-span-7">
          <div className="rounded-3xl glass p-6 sm:p-8 border border-[rgba(255,255,255,0.08)] bg-[#0C0D14] space-y-6">
            <div className="flex items-center justify-between pb-4 border-b border-[rgba(255,255,255,0.06)]">
              <div>
                <h3 className="font-display font-bold text-lg text-[#F8FAFC]">
                  Project Roadmap & Sprint Execution
                </h3>
                <p className="text-xs font-body text-[#94A3B8]">
                  Track real-time engineering milestones and completion status.
                </p>
              </div>
              <Link
                href="/client/timeline"
                className="text-xs font-mono font-bold text-[#06B6D4] hover:underline flex items-center gap-1"
              >
                View Full Timeline
                <ArrowRight size={12} />
              </Link>
            </div>

            <div className="space-y-4">
              {SPRINT_MILESTONES.map((item) => (
                <div
                  key={item.id}
                  className="p-4 rounded-2xl glass border border-[rgba(255,255,255,0.04)] bg-[rgba(255,255,255,0.015)] hover:border-[rgba(6,182,212,0.2)] transition-all flex flex-col sm:flex-row sm:items-center justify-between gap-3"
                >
                  <div className="space-y-1">
                    <div className="flex items-center gap-2">
                      <span className="text-xs font-mono font-bold text-[#64748B]">
                        Sprint 0{item.id}
                      </span>
                      <span className="text-sm font-display font-bold text-[#F8FAFC]">
                        {item.title}
                      </span>
                    </div>
                    <span className="text-[11px] font-mono text-[#94A3B8] block">Target: {item.date}</span>
                  </div>

                  <div className="flex items-center gap-3">
                    {item.status === 'Completed' && (
                      <span className="px-3 py-1 rounded-full text-[10px] font-mono font-bold bg-[rgba(39,201,63,0.15)] text-[#27C93F] border border-[rgba(39,201,63,0.3)] flex items-center gap-1">
                        <CheckCircle2 size={12} />
                        Completed
                      </span>
                    )}

                    {item.status === 'In Progress' && (
                      <span className="px-3 py-1 rounded-full text-[10px] font-mono font-bold bg-[rgba(6,182,212,0.15)] text-[#06B6D4] border border-[rgba(6,182,212,0.3)] flex items-center gap-1">
                        <Clock size={12} />
                        In Progress ({item.percent}%)
                      </span>
                    )}

                    {item.status === 'Upcoming' && (
                      <span className="px-3 py-1 rounded-full text-[10px] font-mono font-bold bg-[rgba(255,255,255,0.05)] text-[#94A3B8] border border-[rgba(255,255,255,0.1)]">
                        Upcoming
                      </span>
                    )}
                  </div>
                </div>
              ))}
            </div>
          </div>
        </BlurReveal>

        {/* Right Column: Files & Realtime Chat Preview (5 Cols) */}
        <div className="lg:col-span-5 space-y-8">
          {/* Deliverables & Files Card */}
          <BlurReveal delay={0.35}>
            <div className="rounded-3xl glass p-6 sm:p-8 border border-[rgba(255,255,255,0.08)] bg-[#0C0D14] space-y-6">
              <div className="flex items-center justify-between pb-4 border-b border-[rgba(255,255,255,0.06)]">
                <div>
                  <h3 className="font-display font-bold text-lg text-[#F8FAFC]">
                    Recent Deliverables & Assets
                  </h3>
                  <p className="text-xs font-body text-[#94A3B8]">
                    Approved specifications, token exports, and Postman specs.
                  </p>
                </div>
                <Link
                  href="/client/files"
                  className="text-xs font-mono font-bold text-[#06B6D4] hover:underline flex items-center gap-1"
                >
                  All Files
                  <ArrowRight size={12} />
                </Link>
              </div>

              <div className="space-y-3 font-mono text-xs">
                {RECENT_FILES.map((file) => (
                  <div
                    key={file.id}
                    className="p-3.5 rounded-2xl glass border border-[rgba(255,255,255,0.04)] bg-[rgba(255,255,255,0.02)] flex items-center justify-between gap-3 hover:border-[rgba(6,182,212,0.2)] transition-all"
                  >
                    <div className="flex items-center gap-3 overflow-hidden">
                      <FileText size={18} className="text-[#06B6D4] shrink-0" />
                      <div className="truncate">
                        <span className="font-bold text-[#F8FAFC] truncate block text-xs">
                          {file.name}
                        </span>
                        <span className="text-[10px] text-[#64748B]">{file.size} · {file.date}</span>
                      </div>
                    </div>

                    <button
                      onClick={() => handleDownload(file.id, file.name)}
                      disabled={downloadingId === file.id}
                      className="p-2 rounded-xl bg-[rgba(6,182,212,0.1)] hover:bg-[#06B6D4] text-[#06B6D4] hover:text-[#06070A] transition-all cursor-pointer shrink-0"
                      title="Download Asset"
                    >
                      <Download size={14} />
                    </button>
                  </div>
                ))}
              </div>
            </div>
          </BlurReveal>

          {/* Direct Messaging Quick Card */}
          <BlurReveal delay={0.4}>
            <div className="rounded-3xl glass p-6 sm:p-8 border border-[rgba(6,182,212,0.3)] bg-gradient-to-br from-[rgba(6,182,212,0.08)] to-transparent relative overflow-hidden space-y-4">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-2xl bg-[#06B6D4] text-[#06070A] flex items-center justify-center font-bold">
                  <MessageSquare size={20} />
                </div>
                <div>
                  <h4 className="font-display font-bold text-base text-[#F8FAFC]">
                    Realtime Lead Engineer Chat
                  </h4>
                  <p className="text-xs font-mono text-[#06B6D4]">
                    Alexander Wright (Online)
                  </p>
                </div>
              </div>

              <p className="text-xs text-[#CBD5E1] font-body leading-relaxed">
                &quot;We have completed the WebSocket telemetry pipeline and finalized the 60fps canvas performance benchmarks. Ready for tomorrow&apos;s demo call!&quot;
              </p>

              <Link
                href="/client/chat"
                className="w-full py-3 rounded-2xl bg-[#06B6D4] hover:bg-[#0891B2] text-[#06070A] font-mono text-xs font-bold uppercase tracking-wider flex items-center justify-center gap-2 transition-all shadow-lg active:scale-95"
              >
                <span>Open Dedicated Chat Room</span>
                <ArrowRight size={14} />
              </Link>
            </div>
          </BlurReveal>
        </div>
      </div>
    </div>
  );
}

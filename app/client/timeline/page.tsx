'use client';

import { useState } from 'react';
import {
  FolderKanban,
  CheckCircle2,
  Clock,
  Calendar,
  User,
  Filter,
  ArrowRight,
  Sparkles,
  ChevronRight,
  FileCheck2
} from 'lucide-react';
import { BlurReveal } from '@/components/motion';

interface SprintTask {
  id: string;
  title: string;
  category: string;
  status: 'Completed' | 'In Progress' | 'Backlog';
  assignee: string;
  estHours: string;
}

interface SprintPhase {
  sprintNumber: number;
  name: string;
  dateRange: string;
  status: 'Completed' | 'In Progress' | 'Upcoming';
  completionPercent: number;
  tasks: SprintTask[];
}

const SPRINTS_DATA: SprintPhase[] = [
  {
    sprintNumber: 1,
    name: 'Discovery & Architecture Blueprinting',
    dateRange: 'Jul 01 – Jul 10, 2026',
    status: 'Completed',
    completionPercent: 100,
    tasks: [
      { id: 'T-101', title: 'System Architecture Specification & Entity Diagrams', category: 'Backend', status: 'Completed', assignee: 'Alex Wright', estHours: '16h' },
      { id: 'T-102', title: 'Database Schema Modeling & Security Contract Verification', category: 'Database', status: 'Completed', assignee: 'Devin Zhao', estHours: '12h' },
      { id: 'T-103', title: 'Technology Stack Selection & Repository Scaffolding', category: 'DevOps', status: 'Completed', assignee: 'Alex Wright', estHours: '8h' },
    ],
  },
  {
    sprintNumber: 2,
    name: 'Design System & Micro-Animation System',
    dateRange: 'Jul 11 – Jul 22, 2026',
    status: 'Completed',
    completionPercent: 100,
    tasks: [
      { id: 'T-201', title: 'Aura Dev Glassmorphic CSS System & Color Palette', category: 'Frontend', status: 'Completed', assignee: 'Sophia Lin', estHours: '20h' },
      { id: 'T-202', title: 'GSAP Ticker & Lenis Smooth Scroll Synchronizer', category: 'Animation', status: 'Completed', assignee: 'Alex Wright', estHours: '18h' },
      { id: 'T-203', title: 'Framer Motion Spring Tokens & Cursor Follower', category: 'Frontend', status: 'Completed', assignee: 'Sophia Lin', estHours: '14h' },
    ],
  },
  {
    sprintNumber: 3,
    name: 'Realtime Data Ingestion & API Integration',
    dateRange: 'Jul 23 – Aug 02, 2026',
    status: 'Completed',
    completionPercent: 100,
    tasks: [
      { id: 'T-301', title: 'Firebase Firestore Admin & Client SDK Wireframes', category: 'Backend', status: 'Completed', assignee: 'Devin Zhao', estHours: '24h' },
      { id: 'T-302', title: 'Dynamic API Gateway & Currency Conversion Endpoints', category: 'API', status: 'Completed', assignee: 'Alex Wright', estHours: '16h' },
      { id: 'T-303', title: 'Lead Management & Automated Contact Form Routing', category: 'Backend', status: 'Completed', assignee: 'Devin Zhao', estHours: '12h' },
    ],
  },
  {
    sprintNumber: 4,
    name: 'QA Testing & Edge Performance Tuning',
    dateRange: 'Aug 03 – Aug 14, 2026',
    status: 'In Progress',
    completionPercent: 85,
    tasks: [
      { id: 'T-401', title: 'Lighthouse 99+ Performance & Zero CLS Audit', category: 'Performance', status: 'Completed', assignee: 'Alex Wright', estHours: '16h' },
      { id: 'T-402', title: 'Cross-Browser Canvas & WebGL Compatibility Suite', category: 'QA', status: 'In Progress', assignee: 'Sophia Lin', estHours: '14h' },
      { id: 'T-403', title: 'Edge Image Optimization & Font Preloading Pipeline', category: 'DevOps', status: 'In Progress', assignee: 'Devin Zhao', estHours: '10h' },
      { id: 'T-404', title: 'Mobile Touch Controls & Responsive Breakpoints', category: 'Frontend', status: 'Backlog', assignee: 'Sophia Lin', estHours: '8h' },
    ],
  },
  {
    sprintNumber: 5,
    name: 'Production Staging & Client Sign-off',
    dateRange: 'Aug 15 – Aug 18, 2026',
    status: 'Upcoming',
    completionPercent: 0,
    tasks: [
      { id: 'T-501', title: 'Client Acceptance Review & Staging Deployment', category: 'Staging', status: 'Backlog', assignee: 'Alex Wright', estHours: '12h' },
      { id: 'T-502', title: 'Security Vulnerability Scan & Penetration Testing', category: 'Security', status: 'Backlog', assignee: 'Devin Zhao', estHours: '16h' },
    ],
  },
  {
    sprintNumber: 6,
    name: 'DNS Cutover & Global CDN Production Launch',
    dateRange: 'Aug 19 – Aug 22, 2026',
    status: 'Upcoming',
    completionPercent: 0,
    tasks: [
      { id: 'T-601', title: 'Domain DNS Migration & SSL Certificate Provisioning', category: 'DevOps', status: 'Backlog', assignee: 'Alex Wright', estHours: '8h' },
      { id: 'T-602', title: 'Final Handover Documentation & Source Code Transfer', category: 'Handover', status: 'Backlog', assignee: 'Alex Wright', estHours: '10h' },
    ],
  },
];

export default function ClientTimelinePage() {
  const [filterStatus, setFilterStatus] = useState<string>('All');
  const [expandedSprint, setExpandedSprint] = useState<number | null>(4);

  const toggleSprint = (sprintNum: number) => {
    setExpandedSprint(expandedSprint === sprintNum ? null : sprintNum);
  };

  return (
    <div className="space-y-8">
      {/* Page Header */}
      <BlurReveal>
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div>
            <div className="flex items-center gap-2 text-xs font-mono text-[#06B6D4] font-bold uppercase tracking-wider mb-1">
              <FolderKanban size={16} />
              <span>DevZite Sprint Architecture</span>
            </div>
            <h1 className="text-3xl font-display font-black text-[#F8FAFC]">
              Timeline & Sprint Roadmap
            </h1>
            <p className="text-sm font-body text-[#94A3B8] mt-1">
              Granular breakdown of engineering sprints, task statuses, and target delivery dates.
            </p>
          </div>

          <div className="flex items-center gap-3">
            <span className="px-3 py-1.5 rounded-full text-xs font-mono font-bold bg-[rgba(6,182,212,0.1)] text-[#06B6D4] border border-[rgba(6,182,212,0.25)]">
              6 Total Sprints · 4 Active
            </span>
          </div>
        </div>
      </BlurReveal>

      {/* Sprint Progress Summary */}
      <BlurReveal delay={0.15}>
        <div className="rounded-3xl glass p-8 border border-[rgba(255,255,255,0.08)] bg-[#0C0D14] grid grid-cols-1 sm:grid-cols-3 gap-6">
          <div className="space-y-1">
            <span className="text-xs font-mono text-[#64748B] block uppercase tracking-wider">Completed Sprints</span>
            <div className="text-3xl font-display font-black text-[#27C93F]">3 / 6</div>
            <p className="text-xs font-body text-[#94A3B8]">Architecture, Design System & Database APIs delivered</p>
          </div>

          <div className="space-y-1">
            <span className="text-xs font-mono text-[#64748B] block uppercase tracking-wider">Current Sprint 4 Status</span>
            <div className="text-3xl font-display font-black text-[#06B6D4]">85%</div>
            <p className="text-xs font-body text-[#94A3B8]">QA & Edge performance testing in progress</p>
          </div>

          <div className="space-y-1">
            <span className="text-xs font-mono text-[#64748B] block uppercase tracking-wider">Est. Production Cutover</span>
            <div className="text-3xl font-display font-black text-[#F8FAFC]">Aug 22</div>
            <p className="text-xs font-body text-[#27C93F] font-mono">On Schedule · 0 Delay</p>
          </div>
        </div>
      </BlurReveal>

      {/* Filter Tabs */}
      <BlurReveal delay={0.2}>
        <div className="flex items-center gap-2">
          <Filter size={14} className="text-[#64748B]" />
          <span className="text-xs font-mono text-[#64748B] uppercase tracking-wider mr-2 font-bold">
            Filter Tasks:
          </span>
          {['All', 'Completed', 'In Progress', 'Backlog'].map((st) => (
            <button
              key={st}
              onClick={() => setFilterStatus(st)}
              className={`px-3 py-1.5 rounded-full text-xs font-mono font-bold transition-all cursor-pointer ${
                filterStatus === st
                  ? 'bg-[#06B6D4] text-[#06070A] shadow-[0_0_15px_rgba(6,182,212,0.3)]'
                  : 'glass text-[#94A3B8] hover:text-[#F8FAFC]'
              }`}
            >
              {st}
            </button>
          ))}
        </div>
      </BlurReveal>

      {/* Accordion List of Sprints */}
      <div className="space-y-4">
        {SPRINTS_DATA.map((sprint) => {
          const isExpanded = expandedSprint === sprint.sprintNumber;
          const filteredTasks = sprint.tasks.filter((t) =>
            filterStatus === 'All' ? true : t.status === filterStatus
          );

          return (
            <BlurReveal key={sprint.sprintNumber} delay={0.05 * sprint.sprintNumber}>
              <div className="rounded-3xl glass border border-[rgba(255,255,255,0.08)] bg-[#0C0D14] overflow-hidden">
                {/* Sprint Header Bar */}
                <button
                  onClick={() => toggleSprint(sprint.sprintNumber)}
                  className="w-full p-6 text-left flex flex-col sm:flex-row sm:items-center justify-between gap-4 hover:bg-[rgba(255,255,255,0.02)] transition-colors cursor-pointer"
                >
                  <div className="flex items-center gap-4">
                    <span className="w-10 h-10 rounded-2xl glass border border-[rgba(6,182,212,0.2)] bg-[rgba(6,182,212,0.08)] flex items-center justify-center font-mono font-bold text-sm text-[#06B6D4] shrink-0">
                      0{sprint.sprintNumber}
                    </span>
                    <div>
                      <div className="flex items-center gap-3 flex-wrap">
                        <h3 className="font-display font-bold text-base sm:text-lg text-[#F8FAFC]">
                          {sprint.name}
                        </h3>
                        <span className="text-xs font-mono text-[#64748B]">{sprint.dateRange}</span>
                      </div>
                      <span className="text-xs font-mono text-[#94A3B8] mt-0.5 block">
                        {sprint.tasks.length} Sub-tasks · {sprint.completionPercent}% Completed
                      </span>
                    </div>
                  </div>

                  <div className="flex items-center gap-4 shrink-0">
                    {sprint.status === 'Completed' && (
                      <span className="px-3 py-1 rounded-full text-xs font-mono font-bold bg-[rgba(39,201,63,0.15)] text-[#27C93F] border border-[rgba(39,201,63,0.3)]">
                        ● Completed
                      </span>
                    )}

                    {sprint.status === 'In Progress' && (
                      <span className="px-3 py-1 rounded-full text-xs font-mono font-bold bg-[rgba(6,182,212,0.15)] text-[#06B6D4] border border-[rgba(6,182,212,0.3)]">
                        ● In Progress
                      </span>
                    )}

                    {sprint.status === 'Upcoming' && (
                      <span className="px-3 py-1 rounded-full text-xs font-mono text-[#94A3B8] bg-[rgba(255,255,255,0.04)]">
                        Upcoming
                      </span>
                    )}

                    <ChevronRight
                      size={18}
                      className={`text-[#94A3B8] transition-transform ${isExpanded ? 'rotate-90' : ''}`}
                    />
                  </div>
                </button>

                {/* Expanded Tasks List */}
                {isExpanded && (
                  <div className="px-6 pb-6 pt-2 border-t border-[rgba(255,255,255,0.04)] space-y-3">
                    {filteredTasks.length > 0 ? (
                      filteredTasks.map((task) => (
                        <div
                          key={task.id}
                          className="p-4 rounded-2xl glass border border-[rgba(255,255,255,0.04)] bg-[rgba(255,255,255,0.015)] flex flex-col sm:flex-row sm:items-center justify-between gap-3 font-mono text-xs"
                        >
                          <div className="flex items-center gap-3">
                            <span className="text-[#06B6D4] font-bold shrink-0">{task.id}</span>
                            <span className="text-[#F8FAFC] font-body text-sm font-medium">
                              {task.title}
                            </span>
                            <span className="px-2 py-0.5 rounded text-[10px] bg-[rgba(255,255,255,0.04)] text-[#94A3B8]">
                              {task.category}
                            </span>
                          </div>

                          <div className="flex items-center gap-4 shrink-0">
                            <span className="text-[#64748B] text-[11px] flex items-center gap-1">
                              <User size={12} />
                              {task.assignee}
                            </span>

                            <span className="text-[#64748B] text-[11px]">{task.estHours}</span>

                            <span
                              className={`px-2.5 py-0.5 rounded-full text-[10px] font-bold uppercase ${
                                task.status === 'Completed'
                                  ? 'bg-[rgba(39,201,63,0.15)] text-[#27C93F]'
                                  : task.status === 'In Progress'
                                  ? 'bg-[rgba(6,182,212,0.15)] text-[#06B6D4]'
                                  : 'bg-[rgba(255,255,255,0.05)] text-[#94A3B8]'
                              }`}
                            >
                              {task.status}
                            </span>
                          </div>
                        </div>
                      ))
                    ) : (
                      <p className="text-xs font-mono text-[#64748B] py-4 text-center">
                        No tasks matching status filter &quot;{filterStatus}&quot; in this sprint.
                      </p>
                    )}
                  </div>
                )}
              </div>
            </BlurReveal>
          );
        })}
      </div>
    </div>
  );
}

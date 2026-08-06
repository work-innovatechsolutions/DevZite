'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { FolderKanban, Mail, FileCode2, TrendingUp } from 'lucide-react';

export default function AdminDashboardPage() {
  const [stats, setStats] = useState({
    inquiries: '28',
    activeProjects: '6',
    publishedBlogs: '14',
    traffic: '45.2K',
  });

  const [recentLeads, setRecentLeads] = useState<any[]>([
    { name: 'Sarah Jenkins', service: 'Website Design', budget: '$10k - $25k', date: 'Today, 10:42 AM', status: 'New' },
    { name: 'David Miller', service: 'SaaS Platform', budget: '$25k - $50k', date: 'Yesterday', status: 'Replied' },
    { name: 'Elena Rostova', service: 'Android App', budget: '$50k+', date: 'Aug 4, 2026', status: 'Closed' },
  ]);

  useEffect(() => {
    async function loadLiveData() {
      try {
        const [leadsRes, projectsRes, blogsRes] = await Promise.all([
          fetch('/api/leads').then((r) => r.json()).catch(() => null),
          fetch('/api/projects').then((r) => r.json()).catch(() => null),
          fetch('/api/blogs').then((r) => r.json()).catch(() => null),
        ]);

        const leads = leadsRes?.success && Array.isArray(leadsRes.data) ? leadsRes.data : null;
        const projects = projectsRes?.success && Array.isArray(projectsRes.data) ? projectsRes.data : null;
        const blogs = blogsRes?.success && Array.isArray(blogsRes.data) ? blogsRes.data : null;

        if (leads && leads.length > 0) {
          setRecentLeads(leads);
        }

        setStats((prev) => ({
          ...prev,
          inquiries: leads ? String(leads.length) : prev.inquiries,
          activeProjects: projects ? String(projects.length) : prev.activeProjects,
          publishedBlogs: blogs ? String(blogs.length) : prev.publishedBlogs,
        }));
      } catch (err) {
        console.warn('Dashboard data fetch active via server endpoints:', err);
      }
    }
    loadLiveData();
  }, []);

  return (
    <div>
      <div className="flex items-center justify-between mb-8">
        <div>
          <h1 className="text-3xl font-display font-black text-[#0F172A] dark:text-[#F8FAFC]">
            Admin CMS Overview
          </h1>
          <p className="text-xs font-mono text-[#475569] dark:text-[#64748B] mt-1">
            Manage projects, blog posts, client leads, and site config.
          </p>
        </div>

        <Link
          href="/admin/projects"
          className="px-4 py-2.5 rounded-xl bg-[#3B82F6] hover:bg-[#2563EB] text-white text-xs font-mono font-semibold transition-colors shadow-sm"
        >
          + Add New Project
        </Link>
      </div>

      {/* KPI Stats Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-4 gap-4 mb-8">
        {[
          { label: 'Total Inquiries', value: stats.inquiries, change: '+12% this week', icon: Mail },
          { label: 'Active Projects', value: stats.activeProjects, change: '2 in QA phase', icon: FolderKanban },
          { label: 'Published Blogs', value: stats.publishedBlogs, change: '1 draft pending', icon: FileCode2 },
          { label: 'Monthly Traffic', value: stats.traffic, change: '+24% vs last month', icon: TrendingUp },
        ].map((stat) => (
          <div key={stat.label} className="rounded-2xl glass-card p-5 border border-[rgba(15,23,42,0.08)] dark:border-[rgba(255,255,255,0.08)]">
            <span className="text-[11px] font-mono text-[#475569] dark:text-[#64748B] block uppercase tracking-wider mb-1 font-bold">
              {stat.label}
            </span>
            <div className="text-3xl font-display font-black text-[#0F172A] dark:text-[#F8FAFC] mb-1">
              {stat.value}
            </div>
            <span className="text-[10px] font-mono text-[#3B82F6] font-semibold">
              {stat.change}
            </span>
          </div>
        ))}
      </div>

      {/* Recent Leads Table */}
      <div className="rounded-2xl glass-card p-6 border border-[rgba(15,23,42,0.08)] dark:border-[rgba(255,255,255,0.08)] mb-8">
        <h2 className="font-display font-bold text-base text-[#0F172A] dark:text-[#F8FAFC] mb-4">
          Recent Project Inquiries
        </h2>
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs font-mono text-[#334155] dark:text-[#94A3B8]">
            <thead>
              <tr className="border-b border-[rgba(15,23,42,0.08)] dark:border-[rgba(255,255,255,0.06)] text-[#64748B]">
                <th className="pb-3 font-bold uppercase tracking-wider">Client</th>
                <th className="pb-3 font-bold uppercase tracking-wider">Service</th>
                <th className="pb-3 font-bold uppercase tracking-wider">Budget</th>
                <th className="pb-3 font-bold uppercase tracking-wider">Date</th>
                <th className="pb-3 font-bold uppercase tracking-wider">Status</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-[rgba(15,23,42,0.06)] dark:divide-[rgba(255,255,255,0.04)]">
              {recentLeads.map((row, i) => (
                <tr key={i} className="hover:bg-[rgba(15,23,42,0.02)] dark:hover:bg-[rgba(255,255,255,0.02)]">
                  <td className="py-3 font-bold text-[#0F172A] dark:text-[#F8FAFC]">{row.name}</td>
                  <td className="py-3">{row.service}</td>
                  <td className="py-3 text-[#3B82F6] font-bold">{row.budget}</td>
                  <td className="py-3">{row.date || 'Today'}</td>
                  <td className="py-3">
                    <span className="px-2 py-0.5 rounded text-[10px] font-bold uppercase bg-[rgba(59,130,246,0.15)] text-[#3B82F6]">
                      {row.status || 'New'}
                    </span>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}

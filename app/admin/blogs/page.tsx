'use client';

import { FileCode2, Plus, Edit2, Eye, Trash2, CheckCircle2 } from 'lucide-react';

const BLOG_POSTS = [
  {
    slug: 'nextjs-15-performance-guide',
    title: 'Architecting 99+ Lighthouse Scores in Next.js 15',
    category: 'Engineering',
    date: 'Aug 5, 2026',
    status: 'Published',
    views: '4,280',
  },
  {
    slug: 'native-android-jetpack-compose',
    title: 'Clean Architecture Patterns for Jetpack Compose',
    category: 'Mobile Dev',
    date: 'Jul 28, 2026',
    status: 'Published',
    views: '2,910',
  },
  {
    slug: 'ai-generative-video-pipelines',
    title: 'Automating 4K Brand Reels with Generative AI Pipelines',
    category: 'Visual Media',
    date: 'Jul 14, 2026',
    status: 'Draft',
    views: '—',
  },
];

export default function AdminBlogsPage() {
  return (
    <div>
      {/* Page Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-8">
        <div>
          <div className="flex items-center gap-2 text-xs font-mono text-[#3B82F6] font-semibold mb-1">
            <FileCode2 size={16} />
            <span>DEVZITE / BLOG & MDX</span>
          </div>
          <h1 className="text-3xl font-display font-black text-[#0F172A] dark:text-[#F8FAFC]">
            MDX Content Manager
          </h1>
          <p className="text-sm font-body text-[#475569] dark:text-[#94A3B8] mt-1">
            Create, edit, and publish technical insights and engineering publications.
          </p>
        </div>

        <button className="btn-primary text-xs px-5 py-3 shadow-[0_0_20px_rgba(59,130,246,0.25)]">
          <Plus size={16} />
          Create New MDX Article
        </button>
      </div>

      {/* Blog Table */}
      <div className="glass-card rounded-2xl p-6 border border-[rgba(15,23,42,0.08)] dark:border-[rgba(255,255,255,0.08)]">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs font-mono text-[#475569] dark:text-[#94A3B8]">
            <thead>
              <tr className="border-b border-[rgba(15,23,42,0.08)] dark:border-[rgba(255,255,255,0.08)] text-[#64748B]">
                <th className="pb-4 font-bold uppercase tracking-wider">Article Title</th>
                <th className="pb-4 font-bold uppercase tracking-wider">Category</th>
                <th className="pb-4 font-bold uppercase tracking-wider">Published Date</th>
                <th className="pb-4 font-bold uppercase tracking-wider">Total Views</th>
                <th className="pb-4 font-bold uppercase tracking-wider">Status</th>
                <th className="pb-4 text-right font-bold uppercase tracking-wider">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-[rgba(15,23,42,0.06)] dark:divide-[rgba(255,255,255,0.04)]">
              {BLOG_POSTS.map((post) => (
                <tr key={post.slug} className="hover:bg-[rgba(15,23,42,0.02)] dark:hover:bg-[rgba(255,255,255,0.02)]">
                  <td className="py-4 font-display font-bold text-base text-[#0F172A] dark:text-[#F8FAFC]">
                    {post.title}
                  </td>
                  <td className="py-4">
                    <span className="px-2.5 py-1 rounded-full text-[11px] bg-[rgba(59,130,246,0.1)] text-[#3B82F6] font-semibold">
                      {post.category}
                    </span>
                  </td>
                  <td className="py-4">{post.date}</td>
                  <td className="py-4 font-bold text-[#0F172A] dark:text-[#F8FAFC]">{post.views}</td>
                  <td className="py-4">
                    <span className={`px-2 py-0.5 rounded text-[10px] font-bold uppercase ${
                      post.status === 'Published'
                        ? 'bg-[rgba(16,185,129,0.15)] text-[#10B981]'
                        : 'bg-[rgba(245,158,11,0.15)] text-[#F59E0B]'
                    }`}>
                      {post.status}
                    </span>
                  </td>
                  <td className="py-4 text-right">
                    <div className="flex items-center justify-end gap-2">
                      <button className="p-2 rounded-lg hover:bg-[rgba(59,130,246,0.1)] text-[#3B82F6] transition-colors">
                        <Edit2 size={16} />
                      </button>
                      <button className="p-2 rounded-lg hover:bg-[rgba(239,68,68,0.1)] text-[#EF4444] transition-colors">
                        <Trash2 size={16} />
                      </button>
                    </div>
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

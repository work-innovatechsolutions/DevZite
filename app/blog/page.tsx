'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { Navbar } from '@/components/layout/Navbar';
import { Footer } from '@/components/layout/Footer';
import { BlurReveal, TextReveal } from '@/components/motion';

interface BlogPost {
  slug: string;
  title: string;
  excerpt: string;
  category: string;
  author?: string;
  readTime?: string;
  date?: string;
  publishedAt?: string;
  icon?: string;
  status?: string;
}

const DEFAULT_BLOGS: BlogPost[] = [
  {
    slug: 'nextjs-15-performance-guide',
    title: 'Architecting 99+ Lighthouse Scores in Next.js 15',
    excerpt: 'Detailed engineering guide on zero-CLS layouts, passive scroll event optimization, and Turbopack bundler tuning.',
    category: 'Engineering',
    readTime: '6 min read',
    date: 'Aug 5, 2026',
    icon: '⚡',
    status: 'Published',
  },
  {
    slug: 'native-android-jetpack-compose',
    title: 'Clean Architecture Patterns for Jetpack Compose',
    excerpt: 'Structuring enterprise Android applications with unidirectional data flow and modular ViewModel architecture.',
    category: 'Mobile Dev',
    readTime: '8 min read',
    date: 'Jul 28, 2026',
    icon: '🔒',
    status: 'Published',
  },
];

export default function BlogIndexPage() {
  const [blogs, setBlogs] = useState<BlogPost[]>(DEFAULT_BLOGS);

  useEffect(() => {
    async function loadBlogs() {
      try {
        const res = await fetch('/api/blogs');
        const data = await res.json();
        if (data.success && Array.isArray(data.data) && data.data.length > 0) {
          const publishedOnly = data.data.filter((b: any) => b.status !== 'Draft');
          if (publishedOnly.length > 0) {
            setBlogs(publishedOnly);
          }
        }
      } catch (err) {
        console.warn('Blogs load notice:', err);
      }
    }
    loadBlogs();
  }, []);

  return (
    <>
      <Navbar />

      <main className="pt-32 pb-24 relative min-h-screen">
        <div className="container-site">
          {/* Header */}
          <div className="max-w-3xl mb-16">
            <BlurReveal>
              <span className="text-xs font-mono text-[#3B82F6] uppercase tracking-widest font-semibold block mb-2">
                / 05 — Journal & Insights
              </span>
            </BlurReveal>

            <BlurReveal delay={0.15}>
              <h1 className="text-3xl sm:text-5xl lg:text-6xl font-display font-black tracking-tight text-[#0F172A] dark:text-[#F8FAFC] mb-4 leading-tight">
                Deep dives into software{' '}
                <span className="text-[#3B82F6] inline-block">craftsmanship.</span>
              </h1>
            </BlurReveal>

            <BlurReveal delay={0.3}>
              <p className="text-lg sm:text-xl text-[#334155] dark:text-[#CBD5E1] leading-relaxed font-body font-medium">
                Technical articles, architecture breakdowns, AI experiments, and design system governance from the team at DevZite.
              </p>
            </BlurReveal>
          </div>

          {/* Posts Grid */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {blogs.map((post, index) => (
              <BlurReveal key={post.slug} delay={0.2 + index * 0.1}>
                <Link
                  href={`/blog/${post.slug}`}
                  className="group flex flex-col justify-between h-full rounded-3xl glass p-8 border border-[rgba(255,255,255,0.08)] hover:border-[rgba(59,130,246,0.3)] transition-all duration-300 shadow-2xl relative overflow-hidden"
                >
                  <div>
                    <div className="flex items-center justify-between mb-6">
                      <span className="text-3xl p-3 rounded-2xl glass border border-[rgba(255,255,255,0.06)]">
                        {post.icon || '⚡'}
                      </span>
                      <span className="text-[11px] font-mono text-[#06B6D4] px-2.5 py-1 rounded-full glass">
                        {post.category}
                      </span>
                    </div>

                    <h2 className="font-display font-bold text-xl text-[#F8FAFC] mb-3 group-hover:text-[#60A5FA] transition-colors leading-tight">
                      {post.title}
                    </h2>

                    <p className="text-sm text-[#94A3B8] leading-relaxed mb-6">
                      {post.excerpt}
                    </p>
                  </div>

                  <div className="pt-4 border-t border-[rgba(255,255,255,0.06)] flex items-center justify-between text-xs font-mono text-[#64748B]">
                    <span>{post.author || 'Devzite Team'}</span>
                    <span>{post.date || 'Aug 2026'}</span>
                  </div>
                </Link>
              </BlurReveal>
            ))}
          </div>
        </div>
      </main>

      <Footer />
    </>
  );
}

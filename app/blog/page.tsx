'use client';

import { useState, useEffect, useMemo } from 'react';
import Link from 'next/link';
import { Navbar } from '@/components/layout/Navbar';
import { Footer } from '@/components/layout/Footer';
import { BlurReveal } from '@/components/motion';
import { Search, Sparkles, Clock, Eye, ThumbsUp, ArrowRight, Tag, Bookmark, CheckCircle2 } from 'lucide-react';
import { COMPREHENSIVE_BLOGS, BlogPost } from '@/lib/data/blogs';

const CATEGORIES = [
  'All',
  'Engineering',
  'Mobile Dev',
  'Backend',
  'AI Pipeline',
  'Design Systems',
  'SaaS Growth',
];

export default function BlogIndexPage() {
  const [blogs, setBlogs] = useState<BlogPost[]>(COMPREHENSIVE_BLOGS);
  const [selectedCategory, setSelectedCategory] = useState('All');
  const [searchQuery, setSearchQuery] = useState('');
  const [newsletterEmail, setNewsletterEmail] = useState('');
  const [newsletterSubscribed, setNewsletterSubscribed] = useState(false);

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

  const filteredBlogs = useMemo(() => {
    return blogs.filter((post) => {
      const matchesCategory =
        selectedCategory === 'All' ||
        post.category.toLowerCase() === selectedCategory.toLowerCase();

      const query = searchQuery.toLowerCase().trim();
      const matchesQuery =
        !query ||
        post.title.toLowerCase().includes(query) ||
        post.excerpt.toLowerCase().includes(query) ||
        post.category.toLowerCase().includes(query) ||
        (post.tags && post.tags.some((t) => t.toLowerCase().includes(query)));

      return matchesCategory && matchesQuery;
    });
  }, [blogs, selectedCategory, searchQuery]);

  const featuredPost = useMemo(() => {
    return blogs.find((b) => b.featured) || blogs[0];
  }, [blogs]);

  const handleSubscribe = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newsletterEmail) return;
    setNewsletterSubscribed(true);
    setNewsletterEmail('');
  };

  return (
    <>
      <Navbar />

      <main className="pt-32 pb-24 relative min-h-screen bg-[#F8FAFC] dark:bg-[#06070A]">
        {/* Top ambient glow */}
        <div
          className="absolute top-0 left-1/2 -translate-x-1/2 w-full max-w-7xl h-96 pointer-events-none opacity-40 dark:opacity-20"
          style={{ background: 'radial-gradient(ellipse at 50% 0%, rgba(59,130,246,0.25) 0%, transparent 70%)' }}
        />

        <div className="container-site relative z-10">
          {/* Header */}
          <div className="max-w-4xl mb-16 text-center mx-auto">
            <BlurReveal>
              <span className="text-xs font-mono text-[#3B82F6] uppercase tracking-widest font-semibold block mb-3">
                / 05 — Journal & Software Craftsmanship
              </span>
            </BlurReveal>

            <BlurReveal delay={0.15}>
              <h1 className="text-4xl sm:text-6xl font-display font-black tracking-tight text-[#0F172A] dark:text-[#F8FAFC] mb-5 leading-tight">
                Architectural insights from the{' '}
                <span className="gradient-text-animated inline-block">engineering frontier.</span>
              </h1>
            </BlurReveal>

            <BlurReveal delay={0.3}>
              <p className="text-lg sm:text-xl text-[#334155] dark:text-[#CBD5E1] leading-relaxed font-body font-medium max-w-2xl mx-auto">
                Deep dives into Next.js 15 performance, native Jetpack Compose patterns, AI video engines, and cloud security architecture.
              </p>
            </BlurReveal>

            {/* Search Bar */}
            <BlurReveal delay={0.4} className="mt-8 max-w-xl mx-auto">
              <div className="relative flex items-center">
                <Search size={18} className="absolute left-4 text-[#94A3B8]" />
                <input
                  type="text"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  placeholder="Search articles by title, topic, or tech tag (e.g. Next.js 15, Compose, AI)..."
                  className="w-full pl-11 pr-4 py-3.5 rounded-2xl bg-white dark:bg-[rgba(255,255,255,0.04)] border border-[rgba(15,23,42,0.1)] dark:border-[rgba(255,255,255,0.08)] text-[#0F172A] dark:text-[#F8FAFC] placeholder-[#94A3B8] text-sm outline-none focus:ring-2 focus:ring-[#3B82F6]/50 transition-all shadow-lg font-body"
                />
                {searchQuery && (
                  <button
                    onClick={() => setSearchQuery('')}
                    className="absolute right-4 text-xs font-mono text-[#94A3B8] hover:text-[#0F172A] dark:hover:text-[#F8FAFC]"
                  >
                    CLEAR
                  </button>
                )}
              </div>
            </BlurReveal>
          </div>

          {/* Category Filter Pills */}
          <BlurReveal delay={0.45} className="mb-12">
            <div className="flex items-center justify-center flex-wrap gap-2.5">
              {CATEGORIES.map((cat) => {
                const isActive = selectedCategory.toLowerCase() === cat.toLowerCase();
                return (
                  <button
                    key={cat}
                    onClick={() => setSelectedCategory(cat)}
                    className={`px-4 py-2 rounded-full text-xs font-mono font-bold transition-all duration-200 cursor-pointer ${
                      isActive
                        ? 'bg-[#3B82F6] text-white shadow-[0_0_20px_rgba(59,130,246,0.4)] scale-105'
                        : 'bg-white dark:bg-[rgba(255,255,255,0.035)] text-[#475569] dark:text-[#94A3B8] hover:text-[#0F172A] dark:hover:text-[#F8FAFC] border border-[rgba(15,23,42,0.08)] dark:border-[rgba(255,255,255,0.08)]'
                    }`}
                  >
                    {cat}
                  </button>
                );
              })}
            </div>
          </BlurReveal>

          {/* Featured Post Spotlight Card (Shows when 'All' category and no search query) */}
          {selectedCategory === 'All' && !searchQuery && featuredPost && (
            <BlurReveal delay={0.5} className="mb-16">
              <Link
                href={`/blog/${featuredPost.slug}`}
                className="group grid grid-cols-1 lg:grid-cols-12 gap-8 rounded-3xl glass-card p-8 sm:p-12 border border-[rgba(15,23,42,0.1)] dark:border-[rgba(255,255,255,0.08)] bg-white dark:bg-[#0C0D14] shadow-2xl relative overflow-hidden items-center"
              >
                <div className="lg:col-span-8 space-y-4">
                  <div className="flex items-center gap-3">
                    <span className="text-xs font-mono font-bold uppercase tracking-wider px-3 py-1 rounded-full bg-[rgba(59,130,246,0.1)] text-[#3B82F6] border border-[rgba(59,130,246,0.2)] flex items-center gap-1.5">
                      <Sparkles size={12} />
                      Featured Publication
                    </span>
                    <span className="text-xs font-mono text-[#06B6D4] px-3 py-1 rounded-full bg-[rgba(6,182,212,0.1)] border border-[rgba(6,182,212,0.2)]">
                      {featuredPost.category}
                    </span>
                  </div>

                  <h2 className="text-2xl sm:text-4xl font-display font-black text-[#0F172A] dark:text-[#F8FAFC] group-hover:text-[#3B82F6] transition-colors leading-tight">
                    {featuredPost.title}
                  </h2>

                  <p className="text-base text-[#334155] dark:text-[#CBD5E1] leading-relaxed font-body font-medium max-w-2xl">
                    {featuredPost.excerpt}
                  </p>

                  <div className="flex items-center gap-4 flex-wrap pt-2">
                    {featuredPost.tags?.map((t) => (
                      <span key={t} className="text-xs font-mono text-[#64748B] dark:text-[#94A3B8] flex items-center gap-1">
                        <Tag size={12} className="text-[#3B82F6]" />
                        {t}
                      </span>
                    ))}
                  </div>

                  <div className="pt-6 border-t border-[rgba(15,23,42,0.06)] dark:border-[rgba(255,255,255,0.06)] flex items-center justify-between text-xs font-mono text-[#64748B]">
                    <div className="flex items-center gap-2">
                      <span className="w-7 h-7 rounded-full bg-[rgba(59,130,246,0.15)] text-[#3B82F6] flex items-center justify-center font-bold">
                        {featuredPost.authorAvatar || '⚡'}
                      </span>
                      <span className="font-bold text-[#0F172A] dark:text-[#F8FAFC]">{featuredPost.author}</span>
                    </div>

                    <div className="flex items-center gap-4">
                      <span className="flex items-center gap-1">
                        <Clock size={14} />
                        {featuredPost.readTime}
                      </span>
                      <span className="flex items-center gap-1">
                        <Eye size={14} />
                        {featuredPost.views} views
                      </span>
                    </div>
                  </div>
                </div>

                <div className="lg:col-span-4 flex flex-col items-center justify-center p-8 rounded-2xl glass border border-[rgba(15,23,42,0.06)] dark:border-[rgba(255,255,255,0.06)] bg-[rgba(59,130,246,0.03)] text-center group-hover:border-[rgba(59,130,246,0.3)] transition-all">
                  <div className="text-6xl mb-4 transform group-hover:scale-110 transition-transform">
                    {featuredPost.icon || '⚡'}
                  </div>
                  <span className="text-xs font-mono font-bold text-[#3B82F6] flex items-center gap-1 uppercase tracking-wider">
                    Read Full Blueprint
                    <ArrowRight size={14} />
                  </span>
                </div>
              </Link>
            </BlurReveal>
          )}

          {/* Posts Grid */}
          {filteredBlogs.length > 0 ? (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
              {filteredBlogs.map((post, index) => (
                <BlurReveal key={post.slug} delay={0.1 * (index % 6)}>
                  <Link
                    href={`/blog/${post.slug}`}
                    className="group flex flex-col justify-between h-full rounded-3xl glass-card p-8 border border-[rgba(15,23,42,0.08)] dark:border-[rgba(255,255,255,0.08)] bg-white dark:bg-[#0C0D14] hover:border-[rgba(59,130,246,0.35)] transition-all duration-300 shadow-xl relative overflow-hidden"
                  >
                    <div>
                      <div className="flex items-center justify-between mb-6">
                        <span className="text-3xl p-3.5 rounded-2xl glass border border-[rgba(15,23,42,0.06)] dark:border-[rgba(255,255,255,0.06)] bg-[rgba(59,130,246,0.04)]">
                          {post.icon || '⚡'}
                        </span>
                        <span className="text-[11px] font-mono font-bold text-[#06B6D4] px-3 py-1 rounded-full glass border border-[rgba(6,182,212,0.2)]">
                          {post.category}
                        </span>
                      </div>

                      <h2 className="font-display font-bold text-xl text-[#0F172A] dark:text-[#F8FAFC] mb-3 group-hover:text-[#3B82F6] transition-colors leading-tight">
                        {post.title}
                      </h2>

                      <p className="text-sm text-[#475569] dark:text-[#94A3B8] leading-relaxed mb-6 font-body font-medium line-clamp-3">
                        {post.excerpt}
                      </p>

                      <div className="flex items-center gap-2 flex-wrap mb-6">
                        {post.tags?.slice(0, 3).map((t) => (
                          <span key={t} className="text-[11px] font-mono text-[#64748B] dark:text-[#94A3B8] bg-[rgba(15,23,42,0.03)] dark:bg-[rgba(255,255,255,0.04)] px-2.5 py-1 rounded-md">
                            #{t}
                          </span>
                        ))}
                      </div>
                    </div>

                    <div className="pt-4 border-t border-[rgba(15,23,42,0.06)] dark:border-[rgba(255,255,255,0.06)] flex items-center justify-between text-xs font-mono text-[#64748B] dark:text-[#94A3B8]">
                      <span>{post.author || 'Devzite Team'}</span>
                      <div className="flex items-center gap-3">
                        <span className="flex items-center gap-1">
                          <Clock size={12} />
                          {post.readTime || '5 min'}
                        </span>
                        {post.views && (
                          <span className="flex items-center gap-1">
                            <Eye size={12} />
                            {post.views}
                          </span>
                        )}
                      </div>
                    </div>
                  </Link>
                </BlurReveal>
              ))}
            </div>
          ) : (
            <BlurReveal className="text-center py-20">
              <div className="w-16 h-16 rounded-full glass flex items-center justify-center text-3xl mx-auto mb-4">
                🔍
              </div>
              <h3 className="text-xl font-display font-bold text-[#0F172A] dark:text-[#F8FAFC] mb-2">
                No matching articles found
              </h3>
              <p className="text-sm text-[#64748B] dark:text-[#94A3B8] max-w-md mx-auto mb-6">
                Try searching for a different keyword or select another category filter.
              </p>
              <button
                onClick={() => {
                  setSelectedCategory('All');
                  setSearchQuery('');
                }}
                className="btn-primary text-xs px-6 py-3 cursor-pointer"
              >
                Reset Search Filters
              </button>
            </BlurReveal>
          )}

          {/* Newsletter Box */}
          <BlurReveal delay={0.6} className="mt-20">
            <div className="rounded-3xl glass p-8 sm:p-12 border border-[rgba(59,130,246,0.2)] bg-gradient-to-br from-[#3B82F6]/10 to-[#8B5CF6]/10 shadow-2xl relative overflow-hidden flex flex-col lg:flex-row items-center justify-between gap-8">
              <div className="max-w-xl">
                <span className="text-xs font-mono text-[#3B82F6] font-bold uppercase tracking-wider block mb-2">
                  DevZite Engineering Digest
                </span>
                <h3 className="text-2xl sm:text-3xl font-display font-black text-[#0F172A] dark:text-[#F8FAFC] mb-2">
                  Stay updated on software architecture & AI workflows.
                </h3>
                <p className="text-sm text-[#334155] dark:text-[#CBD5E1] font-body font-medium">
                  We send one high-signal technical article every fortnight. No spam, zero fluff.
                </p>
              </div>

              <div className="w-full max-w-md">
                {newsletterSubscribed ? (
                  <div className="flex items-center gap-3 p-4 rounded-2xl glass bg-[rgba(16,185,129,0.1)] border border-[rgba(16,185,129,0.25)] text-[#10B981]">
                    <CheckCircle2 size={24} />
                    <div>
                      <h4 className="text-sm font-bold font-display">Subscribed Successfully!</h4>
                      <p className="text-xs font-body">Thank you for joining the DevZite Engineering Digest.</p>
                    </div>
                  </div>
                ) : (
                  <form onSubmit={handleSubscribe} className="flex gap-2">
                    <input
                      type="email"
                      required
                      value={newsletterEmail}
                      onChange={(e) => setNewsletterEmail(e.target.value)}
                      placeholder="you@company.com"
                      className="flex-1 px-4 py-3.5 rounded-2xl bg-white dark:bg-[rgba(255,255,255,0.06)] border border-[rgba(15,23,42,0.1)] dark:border-[rgba(255,255,255,0.08)] text-sm text-[#0F172A] dark:text-[#F8FAFC] placeholder-[#94A3B8] outline-none focus:ring-2 focus:ring-[#3B82F6]"
                    />
                    <button
                      type="submit"
                      className="px-6 py-3.5 rounded-2xl bg-[#3B82F6] hover:bg-[#2563EB] text-white text-xs font-mono font-bold uppercase tracking-wider shrink-0 transition-all shadow-lg active:scale-95 cursor-pointer"
                    >
                      Subscribe
                    </button>
                  </form>
                )}
              </div>
            </div>
          </BlurReveal>
        </div>
      </main>

      <Footer />
    </>
  );
}

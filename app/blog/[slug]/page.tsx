'use client';

import { useState, useEffect, use } from 'react';
import Link from 'next/link';
import { notFound } from 'next/navigation';
import { Navbar } from '@/components/layout/Navbar';
import { Footer } from '@/components/layout/Footer';
import { BlurReveal } from '@/components/motion';
import { COMPREHENSIVE_BLOGS, BlogPost, BlogSection } from '@/lib/data/blogs';
import {
  ArrowLeft,
  Clock,
  Eye,
  ThumbsUp,
  Share2,
  Copy,
  Check,
  Tag,
  BookOpen,
  Sparkles,
  MessageSquare,
  CheckCircle2,
  AlertCircle,
  HelpCircle,
} from 'lucide-react';

export default function BlogPostPage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = use(params);

  const [post, setPost] = useState<BlogPost | null>(null);
  const [loading, setLoading] = useState(true);
  const [likesCount, setLikesCount] = useState(0);
  const [hasLiked, setHasLiked] = useState(false);
  const [copiedCodeIdx, setCopiedCodeIdx] = useState<number | null>(null);
  const [copiedLink, setCopiedLink] = useState(false);
  const [relatedPosts, setRelatedPosts] = useState<BlogPost[]>([]);

  useEffect(() => {
    async function fetchPostData() {
      setLoading(true);
      try {
        const res = await fetch(`/api/blogs?slug=${encodeURIComponent(slug)}`);
        const data = await res.json();
        if (data.success && data.data) {
          setPost(data.data);
          setLikesCount(data.data.likes || 120);
        } else {
          // Local fallback matching
          const localPost = COMPREHENSIVE_BLOGS.find((b) => b.slug === slug);
          if (localPost) {
            setPost(localPost);
            setLikesCount(localPost.likes || 120);
          }
        }
      } catch (err) {
        console.warn('Blog fetch warning, using local registry:', err);
        const localPost = COMPREHENSIVE_BLOGS.find((b) => b.slug === slug);
        if (localPost) {
          setPost(localPost);
          setLikesCount(localPost.likes || 120);
        }
      } finally {
        setLoading(false);
      }
    }

    fetchPostData();
  }, [slug]);

  useEffect(() => {
    if (post) {
      const remaining = COMPREHENSIVE_BLOGS.filter((b) => b.slug !== post.slug);
      setRelatedPosts(remaining.slice(0, 2));
    }
  }, [post]);

  if (loading) {
    return (
      <>
        <Navbar />
        <main className="pt-32 pb-24 min-h-screen flex items-center justify-center bg-[#F8FAFC] dark:bg-[#06070A]">
          <div className="text-center space-y-4">
            <div className="w-12 h-12 rounded-full border-2 border-[#3B82F6] border-t-transparent animate-spin mx-auto" />
            <p className="text-sm font-mono text-[#94A3B8]">Loading publication...</p>
          </div>
        </main>
        <Footer />
      </>
    );
  }

  if (!post) {
    return (
      <>
        <Navbar />
        <main className="pt-32 pb-24 min-h-screen flex flex-col items-center justify-center text-center bg-[#F8FAFC] dark:bg-[#06070A] px-6">
          <div className="text-5xl mb-4">🔍</div>
          <h1 className="text-3xl font-display font-black text-[#0F172A] dark:text-[#F8FAFC] mb-2">
            Article Not Found
          </h1>
          <p className="text-sm font-body text-[#64748B] dark:text-[#94A3B8] max-w-md mb-6">
            The blog publication you are trying to read may have been archived or moved.
          </p>
          <Link href="/blog" className="btn-primary text-xs px-6 py-3">
            ← Return to Journal
          </Link>
        </main>
        <Footer />
      </>
    );
  }

  const handleLike = () => {
    if (hasLiked) return;
    setLikesCount((prev) => prev + 1);
    setHasLiked(true);
  };

  const copyCodeToClipboard = (code: string, idx: number) => {
    navigator.clipboard.writeText(code);
    setCopiedCodeIdx(idx);
    setTimeout(() => setCopiedCodeIdx(null), 2000);
  };

  const copyArticleLink = () => {
    if (typeof window !== 'undefined') {
      navigator.clipboard.writeText(window.location.href);
      setCopiedLink(true);
      setTimeout(() => setCopiedLink(false), 2500);
    }
  };

  return (
    <>
      <Navbar />

      <main className="pt-32 pb-24 relative min-h-screen bg-[#F8FAFC] dark:bg-[#06070A]">
        {/* Top glow */}
        <div
          className="absolute top-0 left-1/2 -translate-x-1/2 w-full max-w-6xl h-96 pointer-events-none opacity-30 dark:opacity-15"
          style={{ background: 'radial-gradient(ellipse at 50% 0%, rgba(139,92,246,0.3) 0%, transparent 70%)' }}
        />

        <div className="container-site relative z-10">
          {/* Back button */}
          <BlurReveal className="mb-8">
            <Link
              href="/blog"
              className="inline-flex items-center gap-2 text-xs font-mono font-bold text-[#64748B] dark:text-[#94A3B8] hover:text-[#3B82F6] dark:hover:text-[#3B82F6] transition-colors"
            >
              <ArrowLeft size={14} />
              <span>Back to Journal</span>
            </Link>
          </BlurReveal>

          <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-start">
            {/* Main Article Content (8 Cols) */}
            <article className="lg:col-span-8">
              {/* Header Info */}
              <BlurReveal>
                <div className="flex items-center gap-3 mb-4 flex-wrap">
                  <span className="text-xs font-mono font-bold px-3 py-1 rounded-full bg-[rgba(6,182,212,0.1)] text-[#06B6D4] border border-[rgba(6,182,212,0.2)]">
                    {post.category}
                  </span>
                  <span className="text-xs font-mono text-[#64748B] dark:text-[#94A3B8]">{post.date}</span>
                  <span className="text-xs font-mono text-[#64748B] dark:text-[#94A3B8]">·</span>
                  <span className="text-xs font-mono text-[#64748B] dark:text-[#94A3B8] flex items-center gap-1">
                    <Clock size={12} />
                    {post.readTime}
                  </span>
                </div>
              </BlurReveal>

              <BlurReveal delay={0.15}>
                <h1 className="text-3xl sm:text-5xl font-display font-black text-[#0F172A] dark:text-[#F8FAFC] mb-6 leading-tight tracking-tight">
                  {post.title}
                </h1>
              </BlurReveal>

              <BlurReveal delay={0.25}>
                <p className="text-lg text-[#334155] dark:text-[#CBD5E1] font-body font-medium leading-relaxed mb-8">
                  {post.excerpt}
                </p>
              </BlurReveal>

              {/* Author & Actions Row */}
              <BlurReveal delay={0.3} className="mb-12 pb-8 border-b border-[rgba(15,23,42,0.08)] dark:border-[rgba(255,255,255,0.08)]">
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 rounded-2xl glass border border-[rgba(59,130,246,0.2)] bg-[rgba(59,130,246,0.08)] flex items-center justify-center text-xl shrink-0">
                      {post.authorAvatar || '⚡'}
                    </div>
                    <div>
                      <h4 className="text-sm font-display font-bold text-[#0F172A] dark:text-[#F8FAFC]">
                        {post.author}
                      </h4>
                      <p className="text-xs font-mono text-[#64748B] dark:text-[#94A3B8]">
                        {post.authorRole || 'Devzite Engineering'}
                      </p>
                    </div>
                  </div>

                  <div className="flex items-center gap-3">
                    <button
                      onClick={handleLike}
                      className={`px-4 py-2 rounded-full text-xs font-mono font-bold flex items-center gap-2 border transition-all cursor-pointer ${
                        hasLiked
                          ? 'bg-[rgba(16,185,129,0.15)] text-[#10B981] border-[rgba(16,185,129,0.3)]'
                          : 'glass text-[#475569] dark:text-[#94A3B8] hover:text-[#0F172A] dark:hover:text-[#F8FAFC]'
                      }`}
                    >
                      <ThumbsUp size={14} className={hasLiked ? 'fill-[#10B981]' : ''} />
                      <span>{likesCount} Likes</span>
                    </button>

                    <button
                      onClick={copyArticleLink}
                      className="px-4 py-2 rounded-full glass text-xs font-mono font-bold text-[#475569] dark:text-[#94A3B8] hover:text-[#0F172A] dark:hover:text-[#F8FAFC] flex items-center gap-2 transition-all cursor-pointer"
                    >
                      {copiedLink ? <Check size={14} className="text-[#10B981]" /> : <Share2 size={14} />}
                      <span>{copiedLink ? 'Link Copied!' : 'Share'}</span>
                    </button>
                  </div>
                </div>
              </BlurReveal>

              {/* Dynamic Article Sections */}
              <div className="space-y-12 mb-16">
                {post.sections && post.sections.length > 0 ? (
                  post.sections.map((section, idx) => (
                    <div key={idx} id={`section-${idx}`}>
                      <BlurReveal delay={0.1 * idx}>
                        <div className="space-y-4">
                        <h2 className="text-2xl font-display font-bold text-[#0F172A] dark:text-[#F8FAFC] tracking-tight">
                          {section.heading}
                        </h2>

                        <p className="text-base text-[#334155] dark:text-[#CBD5E1] font-body font-normal leading-relaxed">
                          {section.body}
                        </p>

                        {/* Callout box if present */}
                        {section.callout && (
                          <div className="p-4 sm:p-5 rounded-2xl bg-[rgba(59,130,246,0.06)] dark:bg-[rgba(59,130,246,0.08)] border-l-4 border-[#3B82F6] flex items-start gap-3 my-4">
                            <Sparkles size={18} className="text-[#3B82F6] shrink-0 mt-0.5" />
                            <p className="text-sm text-[#0F172A] dark:text-[#E2E8F0] font-body font-medium leading-relaxed">
                              {section.callout.text}
                            </p>
                          </div>
                        )}

                        {/* List items if present */}
                        {section.listItems && (
                          <ul className="space-y-2 my-4 pl-2">
                            {section.listItems.map((item, itemIdx) => (
                              <li key={itemIdx} className="flex items-start gap-3 text-sm text-[#334155] dark:text-[#CBD5E1] font-body">
                                <span className="w-1.5 h-1.5 rounded-full bg-[#3B82F6] mt-2 shrink-0" />
                                <span>{item}</span>
                              </li>
                            ))}
                          </ul>
                        )}

                        {/* Code Block if present */}
                        {section.code && (
                          <div className="relative group rounded-2xl glass border border-[rgba(15,23,42,0.1)] dark:border-[rgba(255,255,255,0.08)] bg-[#0C0D14] overflow-hidden my-6">
                            <div className="flex items-center justify-between px-4 py-2.5 bg-[rgba(255,255,255,0.03)] border-b border-[rgba(255,255,255,0.06)] text-xs font-mono text-[#94A3B8]">
                              <span>{section.codeLanguage || 'code'}</span>
                              <button
                                onClick={() => copyCodeToClipboard(section.code!, idx)}
                                className="flex items-center gap-1.5 text-xs text-[#3B82F6] hover:text-[#60A5FA] cursor-pointer transition-colors"
                              >
                                {copiedCodeIdx === idx ? (
                                  <>
                                    <Check size={14} className="text-[#10B981]" />
                                    <span className="text-[#10B981]">Copied</span>
                                  </>
                                ) : (
                                  <>
                                    <Copy size={14} />
                                    <span>Copy Snippet</span>
                                  </>
                                )}
                              </button>
                            </div>

                            <pre className="p-4 sm:p-6 font-mono text-xs sm:text-sm text-[#60A5FA] overflow-x-auto leading-relaxed">
                              <code>{section.code}</code>
                            </pre>
                          </div>
                        )}
                      </div>
                    </BlurReveal>
                  </div>
                  ))
                ) : (
                  <BlurReveal>
                    <p className="text-base text-[#334155] dark:text-[#CBD5E1] leading-relaxed">
                      Detailed article body is being synchronized from the DevZite editorial repository.
                    </p>
                  </BlurReveal>
                )}
              </div>

              {/* Tags Row */}
              {post.tags && post.tags.length > 0 && (
                <BlurReveal delay={0.4} className="mb-12 pt-6 border-t border-[rgba(15,23,42,0.06)] dark:border-[rgba(255,255,255,0.06)] flex items-center gap-2 flex-wrap">
                  <span className="text-xs font-mono font-bold text-[#64748B] uppercase tracking-wider mr-2">
                    Topics:
                  </span>
                  {post.tags.map((t) => (
                    <span
                      key={t}
                      className="text-xs font-mono px-3 py-1 rounded-full bg-[rgba(15,23,42,0.04)] dark:bg-[rgba(255,255,255,0.04)] border border-[rgba(15,23,42,0.08)] dark:border-[rgba(255,255,255,0.08)] text-[#0F172A] dark:text-[#F8FAFC]"
                    >
                      #{t}
                    </span>
                  ))}
                </BlurReveal>
              )}

              {/* Call to Action Banner */}
              <BlurReveal delay={0.5} className="mb-16">
                <div className="rounded-3xl glass p-8 border border-[rgba(59,130,246,0.3)] bg-gradient-to-r from-[#3B82F6]/10 via-[#8B5CF6]/10 to-transparent flex flex-col sm:flex-row items-center justify-between gap-6">
                  <div>
                    <h3 className="text-xl font-display font-bold text-[#0F172A] dark:text-[#F8FAFC] mb-1">
                      Have a complex web architecture requirement?
                    </h3>
                    <p className="text-xs text-[#475569] dark:text-[#94A3B8] font-body font-medium">
                      Our lead engineering team can help audit, optimize, or build your custom platform.
                    </p>
                  </div>
                  <Link href="/contact" className="btn-primary text-xs px-6 py-3.5 shrink-0">
                    Book Engineering Call →
                  </Link>
                </div>
              </BlurReveal>
            </article>

            {/* Sidebar Sticky Panel (4 Cols) */}
            <aside className="lg:col-span-4 sticky top-32 space-y-8">
              {/* Table of Contents Box */}
              {post.sections && post.sections.length > 0 && (
                <BlurReveal delay={0.3} className="rounded-3xl glass p-6 border border-[rgba(15,23,42,0.08)] dark:border-[rgba(255,255,255,0.08)] bg-white dark:bg-[#0C0D14]">
                  <div className="flex items-center gap-2 text-xs font-mono font-bold text-[#3B82F6] uppercase tracking-wider mb-4 pb-3 border-b border-[rgba(15,23,42,0.06)] dark:border-[rgba(255,255,255,0.06)]">
                    <BookOpen size={14} />
                    <span>Table of Contents</span>
                  </div>

                  <ul className="space-y-3 text-xs font-body">
                    {post.sections.map((sec, idx) => (
                      <li key={idx}>
                        <a
                          href={`#section-${idx}`}
                          className="text-[#475569] dark:text-[#94A3B8] hover:text-[#3B82F6] dark:hover:text-[#3B82F6] transition-colors line-clamp-1 block font-medium"
                        >
                          {sec.heading}
                        </a>
                      </li>
                    ))}
                  </ul>
                </BlurReveal>
              )}

              {/* Related Posts */}
              {relatedPosts.length > 0 && (
                <BlurReveal delay={0.4} className="rounded-3xl glass p-6 border border-[rgba(15,23,42,0.08)] dark:border-[rgba(255,255,255,0.08)] bg-white dark:bg-[#0C0D14]">
                  <h4 className="text-xs font-mono font-bold text-[#3B82F6] uppercase tracking-wider mb-4 pb-3 border-b border-[rgba(15,23,42,0.06)] dark:border-[rgba(255,255,255,0.06)]">
                    Recommended Reads
                  </h4>

                  <div className="space-y-4">
                    {relatedPosts.map((rel) => (
                      <Link
                        key={rel.slug}
                        href={`/blog/${rel.slug}`}
                        className="group block space-y-1.5 p-3 rounded-2xl hover:bg-[rgba(59,130,246,0.05)] transition-colors"
                      >
                        <span className="text-[10px] font-mono text-[#06B6D4] font-bold">
                          {rel.category}
                        </span>
                        <h5 className="text-xs font-display font-bold text-[#0F172A] dark:text-[#F8FAFC] group-hover:text-[#3B82F6] transition-colors line-clamp-2">
                          {rel.title}
                        </h5>
                      </Link>
                    ))}
                  </div>
                </BlurReveal>
              )}
            </aside>
          </div>
        </div>
      </main>

      <Footer />
    </>
  );
}

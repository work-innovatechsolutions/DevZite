import Link from 'next/link';
import { Navbar } from '@/components/layout/Navbar';
import { Footer } from '@/components/layout/Footer';
import { BlurReveal, TextReveal } from '@/components/motion';

const BLOG_POSTS = [
  {
    slug: 'nextjs-15-gsap-lenis-performance',
    title: 'Architecting Awwwards-Level Performance in Next.js 15',
    excerpt: 'How we achieve 95+ Lighthouse scores while combining GSAP ScrollTrigger, Lenis smooth scrolling, and React Three Fiber 3D scenes.',
    category: 'Engineering',
    readTime: '6 min read',
    date: 'Aug 4, 2026',
    author: 'DevZite Engineering Team',
    icon: '⚡',
  },
  {
    slug: 'firebase-firestore-security-rules-guide',
    title: 'Mastering Firestore Security Rules for Production SaaS',
    excerpt: 'A comprehensive guide to role-based access control, schema validation, multi-tenant client isolation, and audit logging in Firebase.',
    category: 'Backend',
    readTime: '8 min read',
    date: 'Jul 28, 2026',
    author: 'Security Lead',
    icon: '🔒',
  },
  {
    slug: 'ai-video-storytelling-workflow',
    title: 'Building Automated AI Video Pipelines for Brand Launches',
    excerpt: 'Exploring our 7-step automated workflow combining script synthesis, voice models, storyboard generation, and 4K rendering engines.',
    category: 'AI Pipeline',
    readTime: '5 min read',
    date: 'Jul 15, 2026',
    author: 'AI Creative Director',
    icon: '🎬',
  },
];

export default function BlogIndexPage() {
  return (
    <>
      <Navbar />

      <main className="pt-32 pb-24 relative min-h-screen">
        <div className="container-site">
          {/* Header */}
          <div className="max-w-3xl mb-16">
            <BlurReveal>
              <span className="text-xs font-mono text-[#3B82F6] uppercase tracking-widest">
                / Engineering Journal & Insights
              </span>
            </BlurReveal>

            <TextReveal
              text="Deep dives into software craftsmanship."
              className="text-display-lg font-display font-black text-[#F8FAFC] mt-4 mb-6"
              delay={0.2}
            />

            <BlurReveal delay={0.35}>
              <p className="text-lg text-[#94A3B8] leading-relaxed">
                Technical articles, architecture breakdowns, AI experiments, and design system governance from the team at DevZite.
              </p>
            </BlurReveal>
          </div>

          {/* Posts Grid */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {BLOG_POSTS.map((post, index) => (
              <BlurReveal key={post.slug} delay={0.2 + index * 0.1}>
                <Link
                  href={`/blog/${post.slug}`}
                  className="group flex flex-col justify-between h-full rounded-3xl glass p-8 border border-[rgba(255,255,255,0.08)] hover:border-[rgba(59,130,246,0.3)] transition-all duration-300 shadow-2xl relative overflow-hidden"
                >
                  <div>
                    <div className="flex items-center justify-between mb-6">
                      <span className="text-3xl p-3 rounded-2xl glass border border-[rgba(255,255,255,0.06)]">
                        {post.icon}
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
                    <span>{post.readTime}</span>
                    <span>{post.date}</span>
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

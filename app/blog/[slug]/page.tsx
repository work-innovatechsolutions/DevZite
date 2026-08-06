import { notFound } from 'next/navigation';
import Link from 'next/link';
import { Navbar } from '@/components/layout/Navbar';
import { Footer } from '@/components/layout/Footer';
import { BlurReveal, TextReveal } from '@/components/motion';

const POST_CONTENTS: Record<string, {
  title: string;
  category: string;
  date: string;
  readTime: string;
  author: string;
  sections: { heading: string; body: string; code?: string }[];
}> = {
  'nextjs-15-gsap-lenis-performance': {
    title: 'Architecting Awwwards-Level Performance in Next.js 15',
    category: 'Engineering',
    date: 'Aug 4, 2026',
    readTime: '6 min read',
    author: 'Innovatech Engineering Lead',
    sections: [
      {
        heading: '1. The Tension Between Motion & Latency',
        body: 'Heavy WebGL canvases and intricate scroll-driven animations frequently destroy Lighthouse metrics. The key is strict code splitting, dynamic imports for 3D bundles, and coupling Lenis RAF directly to GSAP ticker.',
      },
      {
        heading: '2. Synchronizing GSAP Ticker with Lenis Smooth Scroll',
        body: 'Instead of running two separate RAF loops, drive Lenis scrolling via GSAP ticker loop. This guarantees 0 frame desynchronization during pin and scrub triggers.',
        code: `// Synchronize Lenis with GSAP Ticker
lenis.on('scroll', ScrollTrigger.update);
gsap.ticker.add((time) => {
  lenis.raf(time * 1000);
});
gsap.ticker.lagSmoothing(0);`,
      },
      {
        heading: '3. Responsive GPU Asset Budgeting',
        body: 'Always wrap 3D canvases in dynamic imports with ssr: false, and gate canvas mounts behind Intersection Observer or responsive media query checks for low-end mobile devices.',
      },
    ],
  },
  'firebase-firestore-security-rules-guide': {
    title: 'Mastering Firestore Security Rules for Production SaaS',
    category: 'Backend',
    date: 'Jul 28, 2026',
    readTime: '8 min read',
    author: 'Security Architecture Lead',
    sections: [
      {
        heading: '1. Multi-Tenant Client Workspace Isolation',
        body: 'Enforce strict UID and role verification across every Firestore collection to prevent cross-tenant data leakage.',
        code: `rules_version = '2';
service cloud.firestore {
  match /databases/{database}/documents {
    function isAdmin() {
      return request.auth != null && request.auth.token.role == 'admin';
    }
    match /clients/{clientId} {
      allow read, write: if isAdmin() || request.auth.uid == clientId;
    }
  }
}`,
      },
      {
        heading: '2. Zod Schema Mirroring in Security Rules',
        body: 'Validate incoming payload fields (data type, string length limits, allowed values) inside rules to prevent corrupted document injections.',
      },
    ],
  },
  'ai-video-storytelling-workflow': {
    title: 'Building Automated AI Video Pipelines for Brand Launches',
    category: 'AI Pipeline',
    date: 'Jul 15, 2026',
    readTime: '5 min read',
    author: 'AI Creative Director',
    sections: [
      {
        heading: '1. Prompt-to-Storyboard Orchestration',
        body: 'Converting high-level product briefs into granular 8-frame storyboard prompts with consistent character seeds and lighting schemas.',
      },
      {
        heading: '2. 4K Render Assembly',
        body: 'Stitching generated video clips with synthesized voice tracks, ambient soundscapes, and color grading for sub-48-hour delivery.',
      },
    ],
  },
};

export default async function BlogPostPage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  const post = POST_CONTENTS[slug];

  if (!post) {
    notFound();
  }

  return (
    <>
      <Navbar />

      <main className="pt-32 pb-24 relative min-h-screen">
        <div className="container-site max-w-3xl">
          {/* Article Header */}
          <BlurReveal>
            <div className="flex items-center gap-3 mb-4 text-xs font-mono">
              <span className="px-3 py-1 rounded-full glass text-[#06B6D4]">
                {post.category}
              </span>
              <span className="text-[#64748B]">{post.date}</span>
              <span className="text-[#64748B]">·</span>
              <span className="text-[#64748B]">{post.readTime}</span>
            </div>
          </BlurReveal>

          <TextReveal
            text={post.title}
            className="text-display-md font-display font-black text-[#F8FAFC] mb-6"
            delay={0.2}
          />

          <BlurReveal delay={0.35}>
            <p className="text-xs font-mono text-[#3B82F6] mb-12 border-b border-[rgba(255,255,255,0.06)] pb-6">
              Written by {post.author}
            </p>
          </BlurReveal>

          {/* Article Sections */}
          <div className="space-y-12 mb-16">
            {post.sections.map((section, idx) => (
              <BlurReveal key={idx} delay={0.2 + idx * 0.1}>
                <div>
                  <h2 className="text-xl font-display font-bold text-[#F8FAFC] mb-4">
                    {section.heading}
                  </h2>
                  <p className="text-sm text-[#94A3B8] leading-relaxed mb-4">
                    {section.body}
                  </p>
                  {section.code && (
                    <pre className="p-4 rounded-xl glass border border-[rgba(255,255,255,0.08)] font-mono text-xs text-[#60A5FA] overflow-x-auto my-4 bg-[#0C0D14]">
                      <code>{section.code}</code>
                    </pre>
                  )}
                </div>
              </BlurReveal>
            ))}
          </div>

          <div className="pt-8 border-t border-[rgba(255,255,255,0.06)] flex justify-between items-center text-xs font-mono">
            <Link href="/blog" className="text-[#94A3B8] hover:text-[#F8FAFC]">
              ← Back to Journal
            </Link>
            <Link href="/contact" className="text-[#3B82F6] font-bold">
              Discuss This Topic With Us →
            </Link>
          </div>
        </div>
      </main>

      <Footer />
    </>
  );
}

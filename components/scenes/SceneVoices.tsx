'use client';

import { BlurReveal, WordReveal } from '@/components/motion';

const TESTIMONIALS_ROW1 = [
  {
    author: 'Alexander Wright',
    role: 'CTO, Nexus AI',
    quote: 'The performance optimization and GSAP animations Innovatech built brought our series-A platform to life.',
    rating: 5,
    avatar: 'AW',
    accentColor: '#3B82F6',
  },
  {
    author: 'Elena Rostova',
    role: 'Head of Product, Aura Health',
    quote: 'Our mobile user retention jumped 38% after releasing the new Android app built by Innovatech.',
    rating: 5,
    avatar: 'ER',
    accentColor: '#06B6D4',
  },
  {
    author: 'Marcus Vance',
    role: 'Founder, Lumina Systems',
    quote: 'They built our client dashboard in record time. The code quality and Firebase security rules were pristine.',
    rating: 5,
    avatar: 'MV',
    accentColor: '#8B5CF6',
  },
  {
    author: 'Sarah Chen',
    role: 'VP Marketing, Apex Media',
    quote: 'The AI video pipeline they set up saved us over $45k in production costs during our Q3 campaign.',
    rating: 5,
    avatar: 'SC',
    accentColor: '#F59E0B',
  },
];

const TESTIMONIALS_ROW2 = [
  {
    author: 'David Miller',
    role: 'Managing Director, Orbit Digital',
    quote: "Innovatech doesn't act like a vendor. They operate like a core technical co-founder team.",
    rating: 5,
    avatar: 'DM',
    accentColor: '#10B981',
  },
  {
    author: 'Sophia Martinez',
    role: 'Design Director, Velox',
    quote: 'Every interaction and hover state feels custom-crafted. Our Awwwards nomination was thanks to them.',
    rating: 5,
    avatar: 'SM',
    accentColor: '#EC4899',
  },
  {
    author: 'Rahul Sharma',
    role: 'Co-founder, Arogyam Tech',
    quote: 'Fast delivery, clean TypeScript codebase, and unbelievable attention to detail. 10/10.',
    rating: 5,
    avatar: 'RS',
    accentColor: '#6366F1',
  },
  {
    author: 'Priya Nair',
    role: 'CEO, Flourish Health',
    quote: 'Our Lighthouse score went from 62 to 98 after Innovatech overhauled our Next.js architecture.',
    rating: 5,
    avatar: 'PN',
    accentColor: '#A855F7',
  },
];

interface TestimonialItem {
  author: string;
  role: string;
  quote: string;
  rating: number;
  avatar: string;
  accentColor: string;
}

function TestimonialCard({ item, rotate }: { item: TestimonialItem; rotate?: boolean }) {
  return (
    <div
      className={`w-[330px] sm:w-[400px] shrink-0 glass-shimmer rounded-2xl p-6 border border-[rgba(255,255,255,0.08)] hover:border-[rgba(59,130,246,0.25)] transition-all duration-400 cursor-default ${
        rotate ? 'rotate-[0.5deg] hover:rotate-0' : '-rotate-[0.5deg] hover:rotate-0'
      }`}
      style={{ transition: 'transform 0.4s cubic-bezier(0.16,1,0.3,1), border-color 0.3s ease' }}
    >
      {/* Author row */}
      <div className="flex items-center justify-between mb-5">
        <div className="flex items-center gap-3">
          {/* Avatar initials with accent ring */}
          <div
            className="w-10 h-10 rounded-full flex items-center justify-center text-sm font-display font-bold shrink-0"
            style={{
              background: `${item.accentColor}18`,
              border: `1.5px solid ${item.accentColor}40`,
              color: item.accentColor,
            }}
          >
            {item.avatar}
          </div>
          <div>
            <h4 className="font-display font-bold text-sm text-[#F8FAFC] leading-tight">{item.author}</h4>
            <p className="text-[11px] text-[#64748B] font-mono leading-tight">{item.role}</p>
          </div>
        </div>

        {/* Star rating */}
        <div className="flex gap-0.5">
          {Array.from({ length: item.rating }).map((_, i) => (
            <span key={i} className="text-[#FFBD2E] text-xs">★</span>
          ))}
        </div>
      </div>

      {/* Quote */}
      <p className="text-sm text-[#94A3B8] italic font-serif leading-relaxed">
        &ldquo;{item.quote}&rdquo;
      </p>

      {/* Verified tag */}
      <div className="mt-4 flex items-center gap-1.5">
        <div
          className="w-1.5 h-1.5 rounded-full"
          style={{ background: item.accentColor }}
        />
        <span className="text-[10px] font-mono uppercase tracking-widest" style={{ color: item.accentColor }}>
          Verified Client
        </span>
      </div>
    </div>
  );
}

export function SceneVoices() {
  return (
    <section
      id="scene-voices"
      data-scene="voices"
      className="section-padding relative overflow-hidden"
      aria-label="Client testimonials"
    >
      {/* Fade edges for infinite scroll illusion */}
      <div className="absolute inset-y-0 left-0 w-24 z-10 pointer-events-none"
        style={{ background: 'linear-gradient(to right, #06070A, transparent)' }} />
      <div className="absolute inset-y-0 right-0 w-24 z-10 pointer-events-none"
        style={{ background: 'linear-gradient(to left, #06070A, transparent)' }} />

      {/* Header */}
      <div className="container-site mb-16 text-center relative z-0">
        <BlurReveal>
          <span className="text-xs font-mono text-[#8B5CF6] uppercase tracking-widest">
            / 07 — Client Voices
          </span>
        </BlurReveal>
        <h2 className="text-display-md font-display font-black text-[#F8FAFC] mt-4">
          <WordReveal text="Trusted by leaders" delay={0.15} stagger={0.05} className="block" />
          <WordReveal text="who demand excellence." delay={0.32} stagger={0.05} className="block gradient-text-violet" wordClassName="gradient-text-violet" />
        </h2>
      </div>

      {/* Marquee Row 1 — left to right */}
      <div className="w-full overflow-hidden mb-5">
        <div className="marquee-track marquee-track--play flex gap-5">
          {[...TESTIMONIALS_ROW1, ...TESTIMONIALS_ROW1, ...TESTIMONIALS_ROW1].map((item, idx) => (
            <TestimonialCard key={idx} item={item} rotate={idx % 2 === 0} />
          ))}
        </div>
      </div>

      {/* Marquee Row 2 — right to left */}
      <div className="w-full overflow-hidden">
        <div className="marquee-track marquee-track--reverse flex gap-5">
          {[...TESTIMONIALS_ROW2, ...TESTIMONIALS_ROW2, ...TESTIMONIALS_ROW2].map((item, idx) => (
            <TestimonialCard key={idx} item={item} rotate={idx % 2 !== 0} />
          ))}
        </div>
      </div>

      {/* Bottom trust signals */}
      <div className="container-site mt-14 text-center">
        <BlurReveal delay={0.3}>
          <div className="inline-flex items-center gap-8 glass rounded-2xl px-8 py-4">
            {[
              { value: '47+', label: 'Projects Delivered' },
              { value: '98%', label: 'Client Retention' },
              { value: '4.9★', label: 'Avg. Rating' },
            ].map(({ value, label }) => (
              <div key={label} className="text-center">
                <div className="text-xl font-display font-black gradient-text">{value}</div>
                <div className="text-[10px] font-mono text-[#64748B] uppercase tracking-widest mt-0.5">{label}</div>
              </div>
            ))}
          </div>
        </BlurReveal>
      </div>
    </section>
  );
}

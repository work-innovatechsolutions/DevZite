'use client';

import { BlurReveal, TextReveal } from '@/components/motion';

const TESTIMONIALS_ROW1 = [
  {
    author: 'Alexander Wright',
    role: 'CTO, Nexus AI',
    quote: 'The performance optimization and GSAP animations Innovatech built brought our series-A platform to life.',
    rating: 5,
    avatar: '👨‍💻',
  },
  {
    author: 'Elena Rostova',
    role: 'Head of Product, Aura Health',
    quote: 'Our mobile user retention jumped 38% after releasing the new Android app built by Innovatech.',
    rating: 5,
    avatar: '👩‍💼',
  },
  {
    author: 'Marcus Vance',
    role: 'Founder, Lumina Systems',
    quote: 'They built our client dashboard in record time. The code quality and Firebase security rules were pristine.',
    rating: 5,
    avatar: '👨‍💼',
  },
  {
    author: 'Sarah Chen',
    role: 'VP Marketing, Apex Media',
    quote: 'The AI video pipeline they set up saved us over $45k in production costs during our Q3 campaign.',
    rating: 5,
    avatar: '👩‍🔬',
  },
];

const TESTIMONIALS_ROW2 = [
  {
    author: 'David Miller',
    role: 'Managing Director, Orbit Digital',
    quote: 'Innovatech doesn’t act like a vendor. They operate like a core technical co-founder team.',
    rating: 5,
    avatar: '👨‍🚀',
  },
  {
    author: 'Sophia Martinez',
    role: 'Design Director, Velox',
    quote: 'Every interaction and hover state feels custom-crafted. Our Awwwards nomination was thanks to them.',
    rating: 5,
    avatar: '👩‍🎨',
  },
  {
    author: 'Rahul Sharma',
    role: 'Co-founder, Arogyam Tech',
    quote: 'Fast delivery, clean TypeScript codebase, and unbelievable attention to detail. 10/10.',
    rating: 5,
    avatar: '👨‍💻',
  },
];

function TestimonialCard({ item, rotate }: { item: typeof TESTIMONIALS_ROW1[0]; rotate?: boolean }) {
  return (
    <div
      className={`w-[320px] sm:w-[380px] shrink-0 glass rounded-2xl p-6 border border-[rgba(255,255,255,0.08)] hover:border-[rgba(59,130,246,0.3)] transition-all duration-300 ${
        rotate ? 'rotate-1 hover:rotate-0' : '-rotate-1 hover:rotate-0'
      }`}
    >
      <div className="flex items-center justify-between mb-4">
        <div className="flex items-center gap-3">
          <span className="text-2xl p-2 rounded-full bg-[rgba(255,255,255,0.04)]">
            {item.avatar}
          </span>
          <div>
            <h4 className="font-display font-bold text-sm text-[#F8FAFC]">
              {item.author}
            </h4>
            <p className="text-xs text-[#64748B] font-mono">{item.role}</p>
          </div>
        </div>
        <div className="flex text-[#FFBD2E] text-xs">
          {Array.from({ length: item.rating }).map((_, i) => (
            <span key={i}>★</span>
          ))}
        </div>
      </div>
      <p className="text-xs sm:text-sm text-[#94A3B8] italic font-serif leading-relaxed">
        &ldquo;{item.quote}&rdquo;
      </p>
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
      <div className="container-site mb-12 text-center">
        <BlurReveal>
          <span className="text-xs font-mono text-[#8B5CF6] uppercase tracking-widest">
            / 06 — Client Voices
          </span>
        </BlurReveal>

        <TextReveal
          text="Trusted by leaders who demand excellence."
          className="text-display-md font-display font-black text-[#F8FAFC] mt-3"
          delay={0.2}
        />
      </div>

      {/* Infinite Marquee Row 1 */}
      <div className="w-full overflow-hidden mb-6 flex">
        <div className="marquee-track marquee-track--play flex gap-6">
          {[...TESTIMONIALS_ROW1, ...TESTIMONIALS_ROW1, ...TESTIMONIALS_ROW1].map((item, idx) => (
            <TestimonialCard key={idx} item={item} rotate={idx % 2 === 0} />
          ))}
        </div>
      </div>

      {/* Infinite Marquee Row 2 (Reverse) */}
      <div className="w-full overflow-hidden flex">
        <div className="marquee-track marquee-track--reverse flex gap-6">
          {[...TESTIMONIALS_ROW2, ...TESTIMONIALS_ROW2, ...TESTIMONIALS_ROW2].map((item, idx) => (
            <TestimonialCard key={idx} item={item} rotate={idx % 2 !== 0} />
          ))}
        </div>
      </div>
    </section>
  );
}

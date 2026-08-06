'use client';

import { useState } from 'react';
import Link from 'next/link';
import { BlurReveal, WordReveal } from '@/components/motion';
import { useCursorState } from '@/providers/CursorProvider';

const GALLERY_ITEMS = [
  { id: '1', title: 'Nexus AI Studio', category: 'website', tag: 'Web App', image: '🤖', color: 'from-[#3B82F6] to-[#06B6D4]', slug: 'nexus-ai-studio' },
  { id: '2', title: 'Aura Fitness Mobile', category: 'mobile', tag: 'Android', image: '📱', color: 'from-[#8B5CF6] to-[#3B82F6]', slug: 'aura-fitness' },
  { id: '3', title: 'Lumina Cloud Edge', category: 'website', tag: 'Cloud Portal', image: '☁️', color: 'from-[#06B6D4] to-[#8B5CF6]', slug: 'lumina-cloud' },
  { id: '4', title: 'Synthetix Brand Film', category: 'video', tag: 'AI Video', image: '🎬', color: 'from-[#3B82F6] to-[#8B5CF6]', slug: 'synthetix-film' },
  { id: '5', title: 'Vortex Identity System', category: 'branding', tag: 'Brand OS', image: '🎨', color: 'from-[#8B5CF6] to-[#06B6D4]', slug: 'vortex-identity' },
  { id: '6', title: 'Pulse Health Platform', category: 'mobile', tag: 'Android App', image: '❤️', color: 'from-[#06B6D4] to-[#3B82F6]', slug: 'pulse-health' },
];

const CATEGORIES = [
  { id: 'all', label: 'All Projects' },
  { id: 'website', label: 'Websites & Apps' },
  { id: 'mobile', label: 'Mobile Apps' },
  { id: 'video', label: 'AI Video' },
  { id: 'branding', label: 'Branding' },
];

export function SceneGallery() {
  const [activeTab, setActiveTab] = useState('all');
  const { setState, setLabel } = useCursorState();

  const filtered = activeTab === 'all'
    ? GALLERY_ITEMS
    : GALLERY_ITEMS.filter((item) => item.category === activeTab);

  return (
    <section
      id="scene-gallery"
      data-scene="gallery"
      className="section-padding relative"
      aria-label="Portfolio gallery"
    >
      <div className="container-site">
        <div className="flex flex-col md:flex-row md:items-end justify-between mb-12">
          <div>
            <BlurReveal>
              <span className="text-xs font-mono text-[#06B6D4] uppercase tracking-widest">
                / 07 — Portfolio Gallery
              </span>
            </BlurReveal>

            <h2 className="text-display-md font-display font-black text-[#F8FAFC] mt-4">
              <WordReveal text="Explore our recent" delay={0.15} stagger={0.05} className="block" />
              <WordReveal text="digital creations." delay={0.3} stagger={0.05} className="block gradient-text" wordClassName="gradient-text" />
            </h2>

          </div>

          {/* Filter Tabs */}
          <BlurReveal delay={0.3}>
            <div className="flex flex-wrap gap-2 mt-6 md:mt-0 p-1.5 rounded-full glass border border-[rgba(255,255,255,0.08)]">
              {CATEGORIES.map((tab) => (
                <button
                  key={tab.id}
                  onClick={() => setActiveTab(tab.id)}
                  className={`px-4 py-2 rounded-full text-xs font-mono transition-all duration-200 ${
                    activeTab === tab.id
                      ? 'bg-[#3B82F6] text-white shadow-lg'
                      : 'text-[#94A3B8] hover:text-[#F8FAFC]'
                  }`}
                >
                  {tab.label}
                </button>
              ))}
            </div>
          </BlurReveal>
        </div>

        {/* Gallery Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filtered.map((item, index) => (
            <BlurReveal key={item.id} delay={0.1 + index * 0.06}>
              <Link
                href={`/projects/${item.slug}`}
                onMouseEnter={() => {
                  setState('hover-image');
                  setLabel('VIEW');
                }}
                onMouseLeave={() => {
                  setState('idle');
                  setLabel('');
                }}
                className="group block rounded-2xl glass overflow-hidden border border-[rgba(255,255,255,0.08)] hover:border-[rgba(59,130,246,0.3)] transition-all duration-300 relative shadow-xl"
              >
                {/* Visual Canvas Box */}
                <div className={`aspect-[4/3] bg-gradient-to-br ${item.color} opacity-20 group-hover:opacity-30 transition-opacity duration-500 flex items-center justify-center relative`}>
                  <span className="text-6xl group-hover:scale-110 transition-transform duration-300">
                    {item.image}
                  </span>
                </div>

                {/* Info Bar */}
                <div className="p-6">
                  <span className="text-[10px] font-mono text-[#3B82F6] uppercase tracking-wider block mb-1">
                    {item.tag}
                  </span>
                  <h3 className="font-display font-bold text-lg text-[#F8FAFC] group-hover:text-[#60A5FA] transition-colors flex items-center justify-between">
                    {item.title}
                    <span className="text-sm text-[#3B82F6] group-hover:translate-x-1 transition-transform">→</span>
                  </h3>
                </div>
              </Link>
            </BlurReveal>
          ))}
        </div>
      </div>
    </section>
  );
}

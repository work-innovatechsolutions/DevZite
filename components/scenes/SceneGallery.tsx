'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { BlurReveal, WordReveal } from '@/components/motion';
import { useCursorState } from '@/providers/CursorProvider';
import { ArrowUpRight, Layers } from 'lucide-react';

interface ProjectItem {
  slug: string;
  name: string;
  category: string;
  summary?: string;
  description?: string;
  image?: string;
  techStack?: string[];
}

const DEFAULT_ITEMS: ProjectItem[] = [
  {
    slug: 'abjee-travel',
    name: 'ABjee Travel',
    category: 'Next.js 15 Web App',
    summary: 'Explore tourist places, connect with fellow travellers, read trip stories, and make travel itineraries.',
    image: 'https://images.unsplash.com/photo-1488646953014-85cb44e25828?w=800&auto=format&fit=crop&q=80',
    techStack: ['Next.js 15', 'Tailwind', 'TypeScript'],
  },
  {
    slug: 'aura-studio-platform',
    name: 'Aura Studio Platform',
    category: 'Next.js 15 Platform',
    summary: 'Living web operating system built with modular component architecture, 60fps animations, and edge delivery.',
    image: 'https://images.unsplash.com/photo-1551288049-bebda4e38f71?w=800&auto=format&fit=crop&q=80',
    techStack: ['Next.js 15', 'Tailwind', 'GSAP'],
  },
  {
    slug: 'cyberpulse-saas-dashboard',
    name: 'CyberPulse SaaS Dashboard',
    category: 'Full-Stack Web App',
    summary: 'Enterprise real-time analytics portal with WebSocket telemetry and serverless API backend.',
    image: 'https://images.unsplash.com/photo-1460925895917-afdab827c52f?w=800&auto=format&fit=crop&q=80',
    techStack: ['React 19', 'TypeScript', 'Serverless'],
  },
  {
    slug: 'omnitrade-mobile-app',
    name: 'OmniTrade Mobile Software',
    category: 'Native Android App',
    summary: 'Native Android trading suite with low-latency order execution and biometric authentication.',
    image: 'https://images.unsplash.com/photo-1526374965328-7f61d4dc18c5?w=800&auto=format&fit=crop&q=80',
    techStack: ['Kotlin', 'Jetpack Compose', 'Clean Arch'],
  },
];

const CATEGORIES = [
  { id: 'all', label: 'All Projects' },
  { id: 'web', label: 'Websites & Apps' },
  { id: 'mobile', label: 'Mobile Apps' },
];

export function SceneGallery() {
  const [items, setItems] = useState<ProjectItem[]>(DEFAULT_ITEMS);
  const [activeTab, setActiveTab] = useState('all');
  const { setState, setLabel } = useCursorState();

  useEffect(() => {
    async function loadProjects() {
      try {
        const res = await fetch('/api/projects');
        const data = await res.json();
        if (data.success && Array.isArray(data.data) && data.data.length > 0) {
          setItems(data.data);
        }
      } catch (err) {
        console.warn('Projects fallback active:', err);
      }
    }
    loadProjects();
  }, []);

  const filtered = activeTab === 'all'
    ? items
    : items.filter((item) => {
        if (activeTab === 'web') return item.category?.toLowerCase().includes('web') || item.category?.toLowerCase().includes('next');
        if (activeTab === 'mobile') return item.category?.toLowerCase().includes('mobile') || item.category?.toLowerCase().includes('android');
        return true;
      });

  return (
    <section
      id="scene-gallery"
      data-scene="gallery"
      className="section-padding relative bg-[#F8FAFC] dark:bg-[#06070A]"
      aria-label="Portfolio gallery"
    >
      <div className="container-site">
        <div className="flex flex-col md:flex-row md:items-end justify-between mb-12">
          <div>
            <BlurReveal>
              <span className="text-xs font-mono text-[#3B82F6] uppercase tracking-widest font-semibold block mb-1">
                / 07 — Portfolio Gallery
              </span>
            </BlurReveal>

            <h2 className="text-3xl sm:text-5xl font-display font-black text-[#0F172A] dark:text-[#F8FAFC] mt-2">
              <WordReveal text="Explore our recent" delay={0.15} stagger={0.05} className="block" />
              <WordReveal text="digital creations." delay={0.3} stagger={0.05} className="block text-[#3B82F6]" wordClassName="text-[#3B82F6]" />
            </h2>
          </div>

          {/* Filter Tabs */}
          <BlurReveal delay={0.3}>
            <div className="flex flex-wrap gap-2 mt-6 md:mt-0 p-1.5 rounded-full glass-nav border border-[rgba(15,23,42,0.08)] dark:border-[rgba(255,255,255,0.08)]">
              {CATEGORIES.map((tab) => (
                <button
                  key={tab.id}
                  onClick={() => setActiveTab(tab.id)}
                  className={`px-4 py-2 rounded-full text-xs font-mono font-bold transition-all duration-200 ${
                    activeTab === tab.id
                      ? 'bg-[#3B82F6] text-white shadow-lg'
                      : 'text-[#475569] dark:text-[#94A3B8] hover:text-[#0F172A] dark:hover:text-[#F8FAFC]'
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
            <BlurReveal key={item.slug || index} delay={0.1 + index * 0.06}>
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
                className="group block rounded-3xl glass-card overflow-hidden border border-[rgba(15,23,42,0.08)] dark:border-[rgba(255,255,255,0.08)] hover:border-[rgba(59,130,246,0.35)] transition-all duration-300 relative shadow-xl bg-white dark:bg-[#0C0D14] h-full flex flex-col justify-between"
              >
                {/* Visual Canvas Box */}
                <div className="relative aspect-video w-full rounded-2xl overflow-hidden mb-4 border-b border-[rgba(15,23,42,0.08)] dark:border-[rgba(255,255,255,0.08)] bg-[#0C0D14]">
                  {item.image ? (
                    <Image
                      src={item.image}
                      alt={item.name}
                      fill
                      unoptimized={item.image.startsWith('data:')}
                      sizes="(max-width: 768px) 100vw, 33vw"
                      className="object-cover group-hover:scale-105 transition-transform duration-500"
                    />
                  ) : (
                    <div className="w-full h-full flex items-center justify-center text-[#64748B] text-xs font-mono">
                      <Layers size={24} className="mr-2 text-[#3B82F6]" />
                      Studio Case
                    </div>
                  )}
                  <span className="absolute top-3 left-3 px-3 py-1 rounded-full text-[10px] font-mono font-bold uppercase bg-[#0C0D14]/80 text-[#3B82F6] backdrop-blur-md border border-[rgba(255,255,255,0.1)]">
                    {item.category}
                  </span>
                </div>

                {/* Info Bar */}
                <div className="p-6 pt-2 flex-1 flex flex-col justify-between">
                  <div>
                    <h3 className="font-display font-bold text-xl text-[#0F172A] dark:text-[#F8FAFC] group-hover:text-[#3B82F6] transition-colors mb-2">
                      {item.name}
                    </h3>
                    <p className="text-xs text-[#475569] dark:text-[#94A3B8] leading-relaxed mb-4 line-clamp-2 font-body font-medium">
                      {item.summary || item.description || 'High-performance digital engineering product.'}
                    </p>
                  </div>

                  <div className="flex items-center justify-between text-xs font-mono font-bold text-[#3B82F6] pt-4 border-t border-[rgba(15,23,42,0.08)] dark:border-[rgba(255,255,255,0.08)]">
                    <span>Explore Case Study</span>
                    <ArrowUpRight size={16} className="group-hover:translate-x-0.5 group-hover:-translate-y-0.5 transition-transform" />
                  </div>
                </div>
              </Link>
            </BlurReveal>
          ))}
        </div>
      </div>
    </section>
  );
}

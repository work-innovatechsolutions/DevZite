import type { MetadataRoute } from 'next';
import { SERVICE_SLUGS } from '@/lib/data/services';
import { ALL_PROJECT_SLUGS } from '@/lib/data/projects';
import { COMPREHENSIVE_BLOGS } from '@/lib/data/blogs';

export default function sitemap(): MetadataRoute.Sitemap {
  const rawUrl = process.env.NEXT_PUBLIC_SITE_URL || 'https://devzite.com';
  const baseUrl = (!rawUrl.includes('vercel.app') ? rawUrl : 'https://devzite.com').replace(/\/+$/, '');
  const now = new Date();

  // ── 1. Core Public Static Pages ───────────────────────────────────────────
  const staticRoutes: MetadataRoute.Sitemap = [
    {
      url: `${baseUrl}`,
      lastModified: now,
      changeFrequency: 'daily',
      priority: 1.0,
    },
    {
      url: `${baseUrl}/services`,
      lastModified: now,
      changeFrequency: 'weekly',
      priority: 0.9,
    },
    {
      url: `${baseUrl}/projects`,
      lastModified: now,
      changeFrequency: 'weekly',
      priority: 0.9,
    },
    {
      url: `${baseUrl}/pricing`,
      lastModified: now,
      changeFrequency: 'weekly',
      priority: 0.8,
    },
    {
      url: `${baseUrl}/blog`,
      lastModified: now,
      changeFrequency: 'daily',
      priority: 0.8,
    },
    {
      url: `${baseUrl}/about`,
      lastModified: now,
      changeFrequency: 'monthly',
      priority: 0.7,
    },
    {
      url: `${baseUrl}/contact`,
      lastModified: now,
      changeFrequency: 'monthly',
      priority: 0.7,
    },
    {
      url: `${baseUrl}/lab`,
      lastModified: now,
      changeFrequency: 'monthly',
      priority: 0.6,
    },
    {
      url: `${baseUrl}/privacy`,
      lastModified: now,
      changeFrequency: 'yearly',
      priority: 0.3,
    },
    {
      url: `${baseUrl}/terms`,
      lastModified: now,
      changeFrequency: 'yearly',
      priority: 0.3,
    },
  ];

  // ── 2. Dynamic Service Pages (/services/[slug]) ───────────────────────────
  const serviceRoutes: MetadataRoute.Sitemap = SERVICE_SLUGS.map((slug) => ({
    url: `${baseUrl}/services/${slug}`,
    lastModified: now,
    changeFrequency: 'weekly',
    priority: 0.85,
  }));

  // ── 3. Dynamic Case Study / Project Pages (/projects/[slug]) ───────────────
  // Excluded per user request: nexus-ai-studio, aura-fitness, lumina-cloud, cyberpulse-saas-dashboard
  const EXCLUDED_PROJECT_SLUGS = new Set([
    'nexus-ai-studio',
    'aura-fitness',
    'lumina-cloud',
    'cyberpulse-saas-dashboard',
  ]);

  const projectRoutes: MetadataRoute.Sitemap = ALL_PROJECT_SLUGS
    .filter((slug) => !EXCLUDED_PROJECT_SLUGS.has(slug))
    .map((slug) => ({
      url: `${baseUrl}/projects/${slug}`,
      lastModified: now,
      changeFrequency: 'weekly',
      priority: 0.75,
    }));

  // ── 4. Dynamic Blog Post Pages (/blog/[slug]) ─────────────────────────────
  const blogRoutes: MetadataRoute.Sitemap = COMPREHENSIVE_BLOGS
    .filter((post) => post.status === 'Published')
    .map((post) => ({
      url: `${baseUrl}/blog/${post.slug}`,
      lastModified: post.publishedAt ? new Date(post.publishedAt) : now,
      changeFrequency: 'monthly',
      priority: 0.7,
    }));

  return [
    ...staticRoutes,
    ...serviceRoutes,
    ...projectRoutes,
    ...blogRoutes,
  ];
}

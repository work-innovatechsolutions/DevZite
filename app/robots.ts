import type { MetadataRoute } from 'next';

export default function robots(): MetadataRoute.Robots {
  const rawUrl = process.env.NEXT_PUBLIC_SITE_URL || 'https://devzite.com';
  const baseUrl = (!rawUrl.includes('vercel.app') ? rawUrl : 'https://devzite.com').replace(/\/+$/, '');

  return {
    rules: [
      {
        userAgent: '*',
        allow: '/',
        disallow: [
          '/admin/',
          '/api/',
          '/login/',
          '/register/',
          '/forgot-password/',
          '/client/',
        ],
      },
    ],
    sitemap: `${baseUrl}/sitemap.xml`,
  };
}

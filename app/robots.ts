import type { MetadataRoute } from 'next';

export default function robots(): MetadataRoute.Robots {
  const baseUrl = (process.env.NEXT_PUBLIC_SITE_URL || 'https://devzite.com').replace(/\/+$/, '');

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

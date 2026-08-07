import type { NextConfig } from 'next';

const nextConfig: NextConfig = {
  // ─── Image Optimization ─────────────────────────────────────────────────
  images: {
    formats: ['image/avif', 'image/webp'],
    remotePatterns: [
      { protocol: 'https', hostname: 'images.unsplash.com', pathname: '**' },
      { protocol: 'https', hostname: 'firebasestorage.googleapis.com', pathname: '**' },
      { protocol: 'https', hostname: 'lh3.googleusercontent.com', pathname: '**' },
      { protocol: 'https', hostname: 'avatars.githubusercontent.com', pathname: '**' },
      { protocol: 'https', hostname: '**', pathname: '**' },
    ],
    deviceSizes: [640, 750, 828, 1080, 1200, 1920, 2048],
    imageSizes: [16, 32, 48, 64, 96, 128, 256, 384],
    minimumCacheTTL: 604800, // 7 days
  },

  // ─── Security Headers ───────────────────────────────────────────────────
  async headers() {
    return [
      {
        source: '/(.*)',
        headers: [
          { key: 'X-Frame-Options', value: 'DENY' },
          { key: 'X-Content-Type-Options', value: 'nosniff' },
          { key: 'Referrer-Policy', value: 'strict-origin-when-cross-origin' },
          { key: 'Permissions-Policy', value: 'camera=(), microphone=(), geolocation=()' },
        ],
      },
      {
        // Cache static assets aggressively
        source: '/static/(.*)',
        headers: [
          { key: 'Cache-Control', value: 'public, max-age=31536000, immutable' },
        ],
      },
    ];
  },

  // ─── TypeScript ────────────────────────────────────────────────────────
  typescript: {
    ignoreBuildErrors: false,
  },

  // ─── Experimental Features ──────────────────────────────────────────────
  experimental: {
    // Optimize package imports for smaller bundles
    optimizePackageImports: [
      'lucide-react',
      'framer-motion',
      '@radix-ui/react-dialog',
      '@radix-ui/react-dropdown-menu',
      'gsap',
    ],
  },

  // ─── Webpack / Transpile ────────────────────────────────────────────────
  transpilePackages: ['three'],
  serverExternalPackages: ['firebase-admin', 'jose', 'jwks-rsa'],

  // ─── Output ─────────────────────────────────────────────────────────────
  poweredByHeader: false,
};

export default nextConfig;

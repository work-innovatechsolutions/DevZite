import type { Metadata, Viewport } from 'next';
import { Inter, Plus_Jakarta_Sans, JetBrains_Mono } from 'next/font/google';
import { Providers } from '@/providers';
import { AIAssistant } from '@/components/ai-assistant/AIAssistant';
import { PremiumCursor } from '@/components/cursor/PremiumCursor';
import '@/app/globals.css';

// ─── Fonts ───────────────────────────────────────────────────────────────────
const plusJakarta = Plus_Jakarta_Sans({
  subsets: ['latin'],
  variable: '--font-plus-jakarta',
  display: 'swap',
  weight: ['400', '500', '600', '700', '800'],
});

const inter = Inter({
  subsets: ['latin'],
  variable: '--font-inter',
  display: 'swap',
  weight: ['400', '500', '600', '700'],
});

const jetbrainsMono = JetBrains_Mono({
  subsets: ['latin'],
  variable: '--font-jetbrains-mono',
  display: 'swap',
  weight: ['400', '500'],
});

// ─── Metadata ────────────────────────────────────────────────────────────────
export const metadata: Metadata = {
  metadataBase: new URL('https://devzite.com'),
  title: {
    default: 'Devzite — Digital Experiences That People Remember',
    template: '%s | Devzite',
  },
  description:
    'We build websites, web apps, Android applications, AI videos, and content platforms that move people. Technically flawless, visually memorable, built to last.',
  keywords: [
    'digital agency',
    'web development',
    'app development',
    'AI videos',
    'Next.js',
    'React',
    'Android',
    'Devzite',
  ],
  authors: [{ name: 'Devzite' }],
  creator: 'Devzite',
  openGraph: {
    type: 'website',
    locale: 'en_US',
    url: 'https://devzite.com',
    siteName: 'Devzite',
    title: 'Devzite — Digital Experiences That People Remember',
    description:
      'We build digital experiences that move people — technically flawless, visually memorable, and built to last.',
    images: [
      {
        url: '/api/og?title=Digital+Experiences+That+People+Remember',
        width: 1200,
        height: 630,
        alt: 'Devzite',
      },
    ],
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Devzite',
    description: 'Digital experiences that people remember.',
    images: ['/api/og?title=Digital+Experiences+That+People+Remember'],
  },
  robots: {
    index: true,
    follow: true,
    googleBot: { index: true, follow: true },
  },
  icons: {
    icon: [
      { url: '/favicon.ico', type: 'image/x-icon' },
    ],
    shortcut: '/favicon.ico',
    apple: '/favicon.ico',
  },
  manifest: '/manifest.json',
};

export const viewport: Viewport = {
  themeColor: '#06070A',
  width: 'device-width',
  initialScale: 1,
  maximumScale: 5,
};

// ─── Layout ──────────────────────────────────────────────────────────────────
export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html
      lang="en"
      className={`${plusJakarta.variable} ${inter.variable} ${jetbrainsMono.variable}`}
      suppressHydrationWarning
    >
      <body className="bg-[#F8FAFC] dark:bg-[#06070A] text-[#0F172A] dark:text-[#F8FAFC] antialiased overflow-x-hidden">
        {/* Skip to content for accessibility */}
        <a href="#main-content" className="skip-to-content">
          Skip to content
        </a>

        {/* Noise grain texture overlay */}
        <div className="noise-overlay" aria-hidden="true" />

        {/* Aurora background — 4 animated orbs */}
        <div className="aurora-bg" aria-hidden="true">
          <div className="aurora-blob aurora-blob-1" />
          <div className="aurora-blob aurora-blob-2" />
          <div className="aurora-blob aurora-blob-3" />
          <div className="aurora-blob aurora-blob-4" />
        </div>


        <Providers>
          <PremiumCursor />
          <main id="main-content">
            {children}
          </main>
          <AIAssistant />
        </Providers>
      </body>
    </html>
  );
}

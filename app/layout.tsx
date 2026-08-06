import type { Metadata, Viewport } from 'next';
import { Inter, Outfit, JetBrains_Mono } from 'next/font/google';
import { Providers } from '@/providers';
import { AIAssistant } from '@/components/ai-assistant/AIAssistant';
import '@/app/globals.css';

// ─── Fonts ───────────────────────────────────────────────────────────────────
const outfit = Outfit({
  subsets: ['latin'],
  variable: '--font-outfit',
  display: 'swap',
  weight: ['400', '500', '600', '700', '800', '900'],
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
  metadataBase: new URL('https://innovatechsolutions.com'),
  title: {
    default: 'Innovatech Solutions — Digital Experiences That People Remember',
    template: '%s | Innovatech Solutions',
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
    'Innovatech Solutions',
  ],
  authors: [{ name: 'Innovatech Solutions' }],
  creator: 'Innovatech Solutions',
  openGraph: {
    type: 'website',
    locale: 'en_US',
    url: 'https://innovatechsolutions.com',
    siteName: 'Innovatech Solutions',
    title: 'Innovatech Solutions — Digital Experiences That People Remember',
    description:
      'We build digital experiences that move people — technically flawless, visually memorable, and built to last.',
    images: [
      {
        url: '/api/og?title=Digital+Experiences+That+People+Remember',
        width: 1200,
        height: 630,
        alt: 'Innovatech Solutions',
      },
    ],
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Innovatech Solutions',
    description: 'Digital experiences that people remember.',
    images: ['/api/og?title=Digital+Experiences+That+People+Remember'],
  },
  robots: {
    index: true,
    follow: true,
    googleBot: { index: true, follow: true },
  },
  icons: {
    icon: '/favicon.ico',
    apple: '/apple-touch-icon.png',
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
      className={`${outfit.variable} ${inter.variable} ${jetbrainsMono.variable}`}
      suppressHydrationWarning
    >
      <body className="bg-[#06070A] text-[#F8FAFC] antialiased overflow-x-hidden">
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
          <main id="main-content">
            {children}
          </main>
          <AIAssistant />
        </Providers>
      </body>
    </html>
  );
}

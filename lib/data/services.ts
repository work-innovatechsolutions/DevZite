export interface ServiceDetail {
  title: string;
  tagline: string;
  problem: string;
  approach: string;
  icon: string;
  process: { step: string; title: string; desc: string }[];
  features: string[];
  techStack: string[];
}

export const SERVICE_DETAILS: Record<string, ServiceDetail> = {
  website: {
    title: 'Website Design & Development',
    tagline: 'Awwwards-Nominated Digital Experiences',
    problem: 'Generic websites suffer from slow load times, outdated templates, high bounce rates, and zero emotional resonance with high-value clients.',
    approach: 'We craft bespoke web platforms utilizing Next.js 15, GSAP ScrollTrigger, Lenis smooth scrolling, and selective R3F 3D visuals. Guaranteed 95+ Lighthouse performance.',
    icon: '🌐',
    process: [
      { step: '01', title: 'UX Architecture', desc: 'Sitemap structuring, user journey mapping, and conversion funnel optimization.' },
      { step: '02', title: 'Motion Design', desc: 'Defining motion tokens, liquid transitions, and micro-interactions.' },
      { step: '03', title: 'Frontend Build', desc: 'Next.js 15 App Router code with modular React components and Tailwind styling.' },
      { step: '04', title: 'Optimization', desc: 'Asset compression, edge caching setup, SEO schema generation, and Lighthouse audit.' },
    ],
    features: ['Custom Motion Design System', 'Selective 3D WebGL / R3F', 'Lenis Smooth Scrolling', 'Lighthouse 95+ Score', 'SEO & OpenGraph Tags'],
    techStack: ['Next.js 15', 'TypeScript', 'Tailwind CSS', 'GSAP', 'React Three Fiber'],
  },
  'web-apps': {
    title: 'Web & SaaS Platform Development',
    tagline: 'High-Scale Cloud Web Applications',
    problem: 'SaaS platforms often fail due to brittle state management, slow database queries, poor security rules, and uninspiring dashboards.',
    approach: 'We engineer full-stack web applications backed by Firebase Firestore, Cloud Functions, role-based Auth, and real-time state listeners.',
    icon: '⚙️',
    process: [
      { step: '01', title: 'Schema Design', desc: 'Structuring relational/NoSQL collections, index strategies, and security rules.' },
      { step: '02', title: 'API & Auth', desc: 'Implementing Firebase Auth (Google/GitHub/Email) and secure Cloud Functions.' },
      { step: '03', title: 'Dashboard UI', desc: 'Building responsive SaaS workspace interfaces with real-time listeners.' },
      { step: '04', title: 'Security Audit', desc: 'Penetration testing security rules, Zod schema validation, and error bounds.' },
    ],
    features: ['Firebase Serverless Backend', 'Role-Based Auth (Admin/Client)', 'Realtime Firestore Listeners', 'Zod Schema Validation', 'Cloud Functions Integration'],
    techStack: ['React 19', 'TypeScript', 'Firebase Auth', 'Firestore', 'Tailwind'],
  },
  'android-apps': {
    title: 'Android Mobile Application Dev',
    tagline: 'Native Android UX & Architecture',
    problem: 'Cross-platform mobile frameworks frequently produce bloated binaries, lagged scroll performance, and broken native device integration.',
    approach: 'We build native Android applications focusing on 60fps UI animations, offline data caching, background push notifications, and biometric security.',
    icon: '📱',
    process: [
      { step: '01', title: 'App Architecture', desc: 'Clean Architecture with MVVM, reactive state streams, and offline store.' },
      { step: '02', title: 'Native UI Design', desc: 'Custom component design with smooth gesture controls and micro-animations.' },
      { step: '03', title: 'Backend Sync', desc: 'Firebase Realtime database sync, push notifications, and cloud messaging.' },
      { step: '04', title: 'Play Store Launch', desc: 'App bundle optimization, store listing assets, and release pipeline setup.' },
    ],
    features: ['Native Android Performance', 'Offline First Architecture', 'Cloud Messaging Notifications', 'Biometric Auth Integration', '60fps UI Animations'],
    techStack: ['Android Native', 'Kotlin', 'Firebase Messaging', 'Jetpack Compose'],
  },
  'ai-videos': {
    title: 'AI Video Storytelling Pipeline',
    tagline: 'Automated 7-Step Content Creation',
    problem: 'High-end commercial video production requires massive budgets, film crews, and months of editing timelines.',
    approach: 'We orchestrate automated AI workflows that convert brand prompts into cinematic storyboards, voiceovers, video clips, and 4K final renders.',
    icon: '🎬',
    process: [
      { step: '01', title: 'Script Gen', desc: 'Prompt engineering for compelling narrative arcs and product messaging.' },
      { step: '02', title: 'Voice Synth', desc: 'Ultra-realistic AI voiceover generation in multiple languages and tones.' },
      { step: '03', title: 'Storyboard AI', desc: 'Generating key visual frames with consistent style and lighting.' },
      { step: '04', title: 'Final Render', desc: 'Stitching, audio mixing, color grading, and 4K export.' },
    ],
    features: ['7-Step Automated Workflow', 'Multilingual AI Voiceovers', '4K Cinematic Output', 'Sub-48-Hour Turnaround', 'Custom Storyboard Generation'],
    techStack: ['Script AI', 'Voice Synth', 'Storyboard AI', 'Render Engine'],
  },
  blogs: {
    title: 'MDX Content Engines & SEO',
    tagline: 'Knowledge Bases & Content Platforms',
    problem: 'Traditional CMS blogs are slow, lack interactive code blocks, suffer from poor SEO structures, and offer weak reading experiences.',
    approach: 'We build MDX-driven content platforms equipped with table of contents, syntax highlighting, reading progress meters, search, and resource downloads.',
    icon: '✍️',
    process: [
      { step: '01', title: 'MDX Pipeline', desc: 'Configuring frontmatter schema, custom components, and static rendering.' },
      { step: '02', title: 'SEO Architecture', desc: 'Generating structured JSON-LD schemas, sitemaps, and dynamic OpenGraph cards.' },
      { step: '03', title: 'Reading UX', desc: 'Adding progress meters, Shiki code highlighting, and instant text search.' },
      { step: '04', title: 'Analytics', desc: 'Tracking scroll depth, time on page, and CTA conversion funnel performance.' },
    ],
    features: ['MDX Content Pipeline', 'Shiki Syntax Highlighting', 'Dynamic OpenGraph Images', 'Automated Sitemap Generation', 'Reading Progress & TOC'],
    techStack: ['Next.js 15', 'MDX', 'Shiki Syntax', 'Fuse.js', 'Tailwind Typography'],
  },
};

export const SERVICE_SLUGS = Object.keys(SERVICE_DETAILS);

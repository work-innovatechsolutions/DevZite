export interface CaseStudy {
  title: string;
  category: string;
  client: string;
  summary: string;
  gradient: string;
  metrics: { label: string; value: number; suffix: string }[];
  goals: string[];
  challenge: string;
  solution: string;
  architecture: string[];
  lighthouse: { performance: number; accessibility: number; bestPractices: number; seo: number };
  tech: string[];
  review: { author: string; role: string; quote: string };
}

export interface ProjectCard {
  slug: string;
  title: string;
  category: string;
  description: string;
  metrics: string;
  tech: string[];
  image: string;
  url?: string;
}

export const CASE_STUDIES: Record<string, CaseStudy> = {
  'nexus-ai-studio': {
    title: 'Nexus AI Studio Platform',
    category: 'Web Application & AI Workflow',
    client: 'Nexus AI Inc.',
    summary: 'An enterprise generative AI workbench enabling real-time video generation pipelines, prompt engineering, and team collaboration.',
    gradient: 'from-[#3B82F6] to-[#06B6D4]',
    metrics: [
      { label: 'Conversion Boost', value: 140, suffix: '%' },
      { label: 'Lighthouse Performance', value: 99, suffix: '/100' },
      { label: 'Active Users', value: 50, suffix: 'K+' },
    ],
    goals: [
      'Eliminate 3.5s initial load latency on complex WebGL canvas pages.',
      'Construct a real-time multiplayer prompt editor for distributed creative teams.',
      'Integrate Firebase Auth, Firestore security rules, and cloud function rendering.',
    ],
    challenge: 'Generative AI workflows require streaming heavy payloads while keeping UI responsiveness at 60fps. Legacy tools suffered from state re-render bottlenecks.',
    solution: 'We engineered a modular Next.js 15 App Router architecture with strict server component boundaries, Web Workers for payload parsing, and GSAP animation tokens.',
    architecture: [
      'Frontend: Next.js 15 (App Router), TypeScript, Tailwind CSS 4, GSAP',
      '3D Layer: React Three Fiber, Drei, WebGL shaders',
      'Backend: Firebase Serverless (Firestore, Auth, Cloud Storage, Functions)',
      'Edge CDN: Vercel Global Edge Network',
    ],
    lighthouse: { performance: 99, accessibility: 100, bestPractices: 98, seo: 100 },
    tech: ['Next.js 15', 'TypeScript', 'Tailwind CSS', 'Firebase', 'GSAP', 'R3F'],
    review: {
      author: 'Alexander Wright',
      role: 'CTO, Nexus AI',
      quote: 'DevZite delivered a product that looks like Apple designed it and loads like Google built it.',
    },
  },
  'aura-fitness': {
    title: 'Aura Fitness & Wellness Mobile Platform',
    category: 'Native Mobile & SaaS App',
    client: 'Aura Health Ltd.',
    summary: 'A full-stack Android & Web application providing real-time biometric tracking, video workout classes, and AI coach scheduling.',
    gradient: 'from-[#8B5CF6] to-[#3B82F6]',
    metrics: [
      { label: 'App Store Rating', value: 5, suffix: '★' },
      { label: 'Monthly Active Users', value: 120, suffix: 'K' },
      { label: 'API Response Time', value: 42, suffix: 'ms' },
    ],
    goals: [
      'Build offline-first synchronization for workout logs in low-connectivity areas.',
      'Achieve 60fps scrolling performance across low-end Android devices.',
      'Deploy real-time push notification reminders based on biometric triggers.',
    ],
    challenge: 'Biometric stream processing caused memory leaks on older devices, leading to app crashes during long workout sessions.',
    solution: 'We rebuilt the mobile architecture with Kotlin Clean Architecture, Room database offline caching, and reactive Kotlin Flow streams.',
    architecture: [
      'Android Native: Kotlin, Jetpack Compose, Coroutines, Flow',
      'Web Dashboard: React 19, TypeScript, Tailwind CSS',
      'Backend: Firebase Realtime Database, Cloud Messaging, Storage',
    ],
    lighthouse: { performance: 96, accessibility: 98, bestPractices: 95, seo: 98 },
    tech: ['Android Native', 'Kotlin', 'React 19', 'Firebase', 'Tailwind'],
    review: {
      author: 'Elena Rostova',
      role: 'Head of Product, Aura Health',
      quote: 'Our mobile user retention jumped 38% after releasing the new Android app built by DevZite.',
    },
  },
  'lumina-cloud': {
    title: 'Lumina Cloud Infrastructure Dashboard',
    category: 'Cloud Infrastructure & 3D Visualization',
    client: 'Lumina Systems',
    summary: 'High-performance cloud management portal with real-time telemetry charts, dynamic server provisioning, and automated audits.',
    gradient: 'from-[#06B6D4] to-[#8B5CF6]',
    metrics: [
      { label: 'Deployment Speed', value: 3, suffix: 'x Faster' },
      { label: 'Uptime SLA', value: 100, suffix: '%' },
      { label: 'Cloud Cost Reduction', value: 35, suffix: '%' },
    ],
    goals: [
      'Visualize 10,000+ active cloud nodes in a interactive 3D WebGL topology map.',
      'Implement role-based access for multi-tenant enterprise organizations.',
      'Provide instant audit log export with cryptographic verification.',
    ],
    challenge: 'Rendering 10k nodes simultaneously crushed browser framerates from 60fps down to single digits.',
    solution: 'We implemented GPU instanced mesh rendering in R3F, allowing 10,000 nodes to render in a single draw call with 60fps fluidity.',
    architecture: [
      'Visualization: React Three Fiber, Three.js instanced rendering',
      'Web App: Next.js 15, TypeScript, Tailwind CSS',
      'Security: Firebase Auth with custom claims & audit logging',
    ],
    lighthouse: { performance: 98, accessibility: 96, bestPractices: 98, seo: 96 },
    tech: ['Next.js 15', 'Three.js / R3F', 'TypeScript', 'Firebase Auth'],
    review: {
      author: 'Marcus Vance',
      role: 'Founder, Lumina Systems',
      quote: 'The custom 3D telemetry visualizations set our product apart in pitch meetings. Worth every penny.',
    },
  },
};

export const DEFAULT_PROJECTS: ProjectCard[] = [
  {
    slug: 'abjee-travel',
    title: 'ABjee Travel',
    category: 'Next.js 15 Web App',
    description: 'Explore tourist places, connect with fellow travellers, read trip stories, and make travel itineraries.',
    metrics: 'Lighthouse: 99/100 · Live Production',
    tech: ['Next.js 15', 'Tailwind', 'TypeScript'],
    image: 'https://images.unsplash.com/photo-1488646953014-85cb44e25828?w=800&auto=format&fit=crop&q=80',
  },
  {
    slug: 'aura-studio-platform',
    title: 'Aura Studio Platform',
    category: 'Next.js 15 Platform',
    description: 'Living web operating system built with modular component architecture, 60fps animations, and edge delivery.',
    metrics: 'Lighthouse: 99/100 · Live Production',
    tech: ['Next.js 15', 'Tailwind', 'GSAP', 'Lenis'],
    image: 'https://images.unsplash.com/photo-1551288049-bebda4e38f71?w=800&auto=format&fit=crop&q=80',
    url: 'https://devzite.com',
  },
  {
    slug: 'cyberpulse-saas-dashboard',
    title: 'CyberPulse SaaS Dashboard',
    category: 'Full-Stack Web App',
    description: 'Enterprise real-time analytics portal with WebSocket telemetry and serverless API backend.',
    metrics: 'Lighthouse: 98/100 · Active QA',
    tech: ['React 19', 'TypeScript', 'Serverless'],
    image: 'https://images.unsplash.com/photo-1460925895917-afdab827c52f?w=800&auto=format&fit=crop&q=80',
  },
  {
    slug: 'omnitrade-mobile-app',
    title: 'OmniTrade Mobile Software',
    category: 'Native Android App',
    description: 'Native Android trading suite with low-latency order execution and biometric authentication.',
    metrics: 'Lighthouse: 97/100 · In Development',
    tech: ['Kotlin', 'Jetpack Compose', 'Clean Arch'],
    image: 'https://images.unsplash.com/photo-1526374965328-7f61d4dc18c5?w=800&auto=format&fit=crop&q=80',
  },
];

export const ALL_PROJECT_SLUGS = Array.from(
  new Set([...Object.keys(CASE_STUDIES), ...DEFAULT_PROJECTS.map((p) => p.slug)])
);

import { adminDb } from './admin';

export const INITIAL_PROJECTS = [
  {
    slug: 'abjee-travel',
    name: 'ABjee Travel',
    category: 'Next.js 15 Web App',
    status: 'Live Production',
    lighthouseScore: 99,
    techStack: ['Next.js 15', 'Tailwind', 'TypeScript'],
    summary: 'Explore tourist places, connect with fellow travellers, read trip stories, and make travel itineraries.',
    url: 'https://devzite.com',
    image: 'https://images.unsplash.com/photo-1488646953014-85cb44e25828?w=800&auto=format&fit=crop&q=80',
    createdAt: new Date().toISOString(),
  },
  {
    slug: 'aura-studio-platform',
    name: 'Aura Studio Platform',
    category: 'Next.js 15 Platform',
    status: 'Live Production',
    lighthouseScore: 99,
    techStack: ['Next.js 15', 'Tailwind', 'GSAP', 'Lenis'],
    summary: 'Living web operating system built with modular component architecture, 60fps animations, and edge delivery.',
    url: 'https://devzite.com',
    image: 'https://images.unsplash.com/photo-1551288049-bebda4e38f71?w=800&auto=format&fit=crop&q=80',
    createdAt: new Date().toISOString(),
  },
  {
    slug: 'cyberpulse-saas-dashboard',
    name: 'CyberPulse SaaS Dashboard',
    category: 'Full-Stack Web App',
    status: 'Active QA',
    lighthouseScore: 98,
    techStack: ['React 19', 'TypeScript', 'Serverless'],
    summary: 'Enterprise real-time analytics portal with WebSocket telemetry and serverless API backend.',
    url: 'https://cyberpulse.io',
    image: 'https://images.unsplash.com/photo-1460925895917-afdab827c52f?w=800&auto=format&fit=crop&q=80',
    createdAt: new Date().toISOString(),
  },
  {
    slug: 'omnitrade-mobile-app',
    name: 'OmniTrade Mobile Software',
    category: 'Native Android App',
    status: 'In Development',
    lighthouseScore: 97,
    techStack: ['Kotlin', 'Jetpack Compose', 'Clean Arch'],
    summary: 'Native Android trading suite with low-latency order execution and biometric authentication.',
    url: 'https://omnitrade.app',
    image: 'https://images.unsplash.com/photo-1526374965328-7f61d4dc18c5?w=800&auto=format&fit=crop&q=80',
    createdAt: new Date().toISOString(),
  },
];

export const INITIAL_PRICING = [
  {
    id: 'starter',
    name: 'Starter',
    badge: 'Essential Build',
    price: '$2,499',
    billing: 'per project',
    description: 'Perfect for startups needing a high-performance, conversion-focused digital presence.',
    isPopular: false,
    features: [
      'Next.js 15 Web Application',
      'Tailwind CSS v4 Responsive Design',
      '99+ Lighthouse Performance Score',
      'SEO & Meta Tags Optimization',
      'Firebase Infrastructure Setup',
      '1 Month Technical Warranty & Support',
    ],
  },
  {
    id: 'pro',
    name: 'Pro Studio',
    badge: 'Most Popular',
    price: '$5,999',
    billing: 'per project',
    description: 'Complete full-stack web and mobile application suite for scaling tech brands.',
    isPopular: true,
    features: [
      'Full-Stack Web + Native Mobile App',
      'Custom UI/UX & Motion Design System',
      '60fps GSAP & Framer Motion Animations',
      'Firebase Admin CMS & Auth Control',
      'Real-time WebSocket & API Architecture',
      '3 Months Priority Support & Maintenance',
    ],
  },
  {
    id: 'premium',
    name: 'Premium',
    badge: 'Custom Architecture',
    price: '$12,999',
    billing: 'per project',
    description: 'Dedicated studio engineering, custom 3D web experiences, and SLA guarantees.',
    isPopular: false,
    features: [
      'Dedicated Studio Engineering Squad',
      'Generative AI & LLM Workflow Integration',
      'Custom 3D / R3F WebGL Visualizations',
      'Enterprise Security & Compliance Audit',
      '99.99% Uptime SLA Guarantee',
      '24/7 Dedicated Retainer Support',
    ],
  },
  {
    id: 'custom',
    name: 'Custom',
    badge: 'Bespoke Build',
    price: 'Custom Quote',
    billing: 'flexible scope',
    description: 'Tailored enterprise retainer, dedicated squad, or complex multi-system platform build.',
    isPopular: false,
    features: [
      'Dedicated Full-Time Engineering Squad',
      'Bespoke System Architecture & Codebase',
      'Dedicated Executive Account Manager',
      'Direct Private Slack / Discord Channel',
      'Priority Emergency Hotfixes & Maintenance',
      'Flexible Billing & Custom Retainer Terms',
    ],
  },
];

export const INITIAL_LEADS = [
  {
    id: 'lead-1',
    name: 'Sarah Jenkins',
    email: 'sarah@apexdesign.com',
    company: 'Apex Design Co',
    service: 'Custom Web Engineering',
    budget: '$15,000 - $30,000',
    message: 'We are looking to rebuild our flagship enterprise marketing platform using Next.js 15 and Tailwind CSS.',
    status: 'New Inquiry',
    createdAt: new Date().toISOString(),
  },
  {
    id: 'lead-2',
    name: 'Marcus Vance',
    email: 'marcus@vancecloud.io',
    company: 'Vance Cloud Systems',
    service: 'Full-Stack Web App',
    budget: '$30,000 - $60,000',
    message: 'Need a high-performance React 19 analytics dashboard with real-time WebSocket telemetry.',
    status: 'In Review',
    createdAt: new Date().toISOString(),
  },
];

export const INITIAL_BLOGS = [
  {
    slug: 'nextjs-15-performance-guide',
    title: 'Architecting 99+ Lighthouse Scores in Next.js 15',
    category: 'Engineering',
    author: 'Devzite Technical Team',
    status: 'Published',
    views: 4280,
    excerpt: 'Detailed engineering guide on zero-CLS layouts, passive scroll event optimization, and Turbopack bundler tuning.',
    publishedAt: new Date().toISOString(),
  },
  {
    slug: 'native-android-jetpack-compose',
    title: 'Clean Architecture Patterns for Jetpack Compose',
    category: 'Mobile Dev',
    author: 'Devzite Mobile Lead',
    status: 'Published',
    views: 2910,
    excerpt: 'Structuring enterprise Android applications with unidirectional data flow and modular ViewModel architecture.',
    publishedAt: new Date().toISOString(),
  },
];

export const INITIAL_MANAGERS = [
  {
    id: 'mgr-admin-1',
    name: 'Souvik (Admin)',
    email: 'souvikgon377@gmail.com',
    role: 'Admin',
    status: 'Active (Firebase Auth)',
    lastActive: 'Just Now',
    avatar: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=150&auto=format&fit=crop&q=80',
  },
  {
    id: 'mgr-2',
    name: 'Alex Rivera',
    email: 'alex@devzite.com',
    role: 'Lead Architect',
    status: 'Active (Firebase Auth)',
    lastActive: '2 hours ago',
    avatar: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=150&auto=format&fit=crop&q=80',
  },
  {
    id: 'mgr-3',
    name: 'Elena Vance',
    email: 'elena@devzite.com',
    role: 'Client Operations',
    status: 'Active (Firebase Auth)',
    lastActive: 'Yesterday',
    avatar: 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=150&auto=format&fit=crop&q=80',
  },
];

export async function seedFirestoreCollections() {
  const batch = adminDb.batch();

  // 1. Projects Collection
  for (const project of INITIAL_PROJECTS) {
    const ref = adminDb.collection('projects').doc(project.slug);
    batch.set(ref, project, { merge: true });
  }

  // 2. Pricing Collection
  for (const plan of INITIAL_PRICING) {
    const ref = adminDb.collection('pricing').doc(plan.id);
    batch.set(ref, plan, { merge: true });
  }

  // 3. Leads Collection
  for (const lead of INITIAL_LEADS) {
    const ref = adminDb.collection('leads').doc(lead.id);
    batch.set(ref, lead, { merge: true });
  }

  // 4. Blogs Collection
  for (const blog of INITIAL_BLOGS) {
    const ref = adminDb.collection('blogs').doc(blog.slug);
    batch.set(ref, blog, { merge: true });
  }

  // 5. Admin Managers Collection
  for (const mgr of INITIAL_MANAGERS) {
    const ref = adminDb.collection('admin_managers').doc(mgr.id);
    batch.set(ref, mgr, { merge: true });
  }

  // 6. System Config Collection
  const configRef = adminDb.collection('system').doc('config');
  batch.set(
    configRef,
    {
      aiAssistantEnabled: true,
      customCursorEnabled: true,
      version: '3.0.0',
      lastUpdated: new Date().toISOString(),
    },
    { merge: true }
  );

  await batch.commit();
  return { success: true, message: 'Firestore collections initialized successfully!' };
}

export interface BlogSection {
  heading: string;
  body: string;
  code?: string;
  codeLanguage?: string;
  callout?: {
    type: 'note' | 'tip' | 'warning';
    text: string;
  };
  listItems?: string[];
}

export interface BlogPost {
  slug: string;
  title: string;
  excerpt: string;
  category: string;
  author: string;
  authorRole?: string;
  authorAvatar?: string;
  readTime: string;
  date: string;
  publishedAt: string;
  icon: string;
  status: 'Published' | 'Draft';
  views: number;
  likes?: number;
  tags: string[];
  featured?: boolean;
  sections: BlogSection[];
}

export const COMPREHENSIVE_BLOGS: BlogPost[] = [
  {
    slug: 'nextjs-15-performance-guide',
    title: 'Architecting 99+ Lighthouse Scores in Next.js 15',
    excerpt: 'Detailed engineering guide on zero-CLS layouts, passive scroll event optimization, Turbopack bundler tuning, and GSAP ticker sync.',
    category: 'Engineering',
    author: 'DevZite Technical Team',
    authorRole: 'Principal Web Architect',
    authorAvatar: '⚡',
    readTime: '6 min read',
    date: 'Aug 8, 2026',
    publishedAt: '2026-08-08T10:00:00.000Z',
    icon: '⚡',
    status: 'Published',
    views: 4280,
    likes: 194,
    tags: ['Next.js 15', 'Turbopack', 'Performance', 'GSAP', 'Lighthouse'],
    featured: true,
    sections: [
      {
        heading: '1. The Tension Between Motion & Latency',
        body: 'Heavy WebGL canvases, smooth-scrolling engines, and intricate scroll-driven animations frequently destroy Lighthouse performance metrics. In modern web engineering, achieving a 99+ Performance score requires strict code splitting, dynamic imports for 3D bundles, and coupling RAF loops directly to the GSAP ticker.',
        callout: {
          type: 'tip',
          text: 'Always set ssr: false on heavy motion components and delay canvas initialization until the container passes into the viewport threshold.',
        },
      },
      {
        heading: '2. Synchronizing GSAP Ticker with Lenis Smooth Scroll',
        body: 'Instead of running two separate RequestAnimationFrame (RAF) loops, drive the Lenis smooth-scrolling instance via the GSAP ticker loop. This guarantees zero frame desynchronization during pin and scrub triggers while eliminating layout thrashing.',
        codeLanguage: 'typescript',
        code: `import gsap from 'gsap';
import Lenis from 'lenis';

export function initSmoothScroll() {
  const lenis = new Lenis({ duration: 1.2, easing: (t) => Math.min(1, 1.001 - Math.pow(2, -10 * t)) });
  
  // Connect Lenis scroll update to GSAP ScrollTrigger
  lenis.on('scroll', ScrollTrigger.update);
  
  // Single ticker loop drive
  gsap.ticker.add((time: number) => {
    lenis.raf(time * 1000);
  });
  
  gsap.ticker.lagSmoothing(0);
  return lenis;
}`,
      },
      {
        heading: '3. Zero Cumulative Layout Shift (CLS) Strategies',
        body: 'Eliminate font swapping shifts by preloading display fonts with font-display: swap and explicitly allocating static intrinsic dimensions for media cards before lazy assets resolve.',
        listItems: [
          'Pre-reserve exact flex/grid layout aspect ratios using CSS aspect-ratio properties.',
          'Inject dynamic inline SVGs for glowing micro-accents rather than loading external raster textures.',
          'Enforce hardware acceleration with translateZ(0) on animated glassmorphic cards.',
        ],
      },
    ],
  },
  {
    slug: 'native-android-jetpack-compose',
    title: 'Clean Architecture Patterns for Jetpack Compose',
    excerpt: 'Structuring enterprise Android applications with unidirectional data flow, Kotlin Coroutines, and modular ViewModel architecture.',
    category: 'Mobile Dev',
    author: 'DevZite Mobile Lead',
    authorRole: 'Android Systems Lead',
    authorAvatar: '📱',
    readTime: '8 min read',
    date: 'Aug 2, 2026',
    publishedAt: '2026-08-02T14:30:00.000Z',
    icon: '📱',
    status: 'Published',
    views: 2910,
    likes: 142,
    tags: ['Android', 'Jetpack Compose', 'Kotlin', 'Clean Architecture'],
    featured: false,
    sections: [
      {
        heading: '1. Unidirectional Data Flow (UDF) Foundations',
        body: 'In Jetpack Compose UI architecture, state flows downwards from the ViewModel to composables via StateFlow, while events flow upwards from user actions to ViewModel handlers. This enforces predictable rendering cycles and isolated testing contracts.',
        codeLanguage: 'kotlin',
        code: `data class DashboardUiState(
    val isLoading: Boolean = false,
    val metrics: List<AnalyticsMetric> = emptyList(),
    val errorMessage: String? = null
)

class DashboardViewModel @Inject constructor(
    private val getMetricsUseCase: GetMetricsUseCase
) : ViewModel() {
    private val _uiState = MutableStateFlow(DashboardUiState(isLoading = true))
    val uiState: StateFlow<DashboardUiState> = _uiState.asStateFlow()
}`,
      },
      {
        heading: '2. Recomposition Optimization & Stability',
        body: 'Mark immutable data models with @Immutable or @Stable annotations to prevent unneeded composable recompositions when parent state trees undergo updates.',
      },
    ],
  },
  {
    slug: 'firebase-firestore-security-rules-guide',
    title: 'Mastering Firestore Security Rules for Production SaaS',
    excerpt: 'Enforcing multi-tenant isolation, role-based access control (RBAC), and schema validation in Firebase Admin and Client SDKs.',
    category: 'Backend',
    author: 'Security Architecture Lead',
    authorRole: 'Cloud Security Engineer',
    authorAvatar: '🔒',
    readTime: '7 min read',
    date: 'Jul 28, 2026',
    publishedAt: '2026-07-28T09:15:00.000Z',
    icon: '🔒',
    status: 'Published',
    views: 3840,
    likes: 210,
    tags: ['Firebase', 'Security', 'Firestore', 'SaaS', 'Backend'],
    featured: false,
    sections: [
      {
        heading: '1. Multi-Tenant Client Workspace Isolation',
        body: 'Enforce strict UID and role verification across every Firestore collection to prevent cross-tenant data leakage in SaaS platforms.',
        codeLanguage: 'javascript',
        code: `rules_version = '2';
service cloud.firestore {
  match /databases/{database}/documents {
    function isAuthenticated() {
      return request.auth != null;
    }
    function isAdmin() {
      return isAuthenticated() && request.auth.token.role == 'admin';
    }
    match /leads/{leadId} {
      allow read, write: if isAdmin();
    }
    match /clients/{clientId} {
      allow read, write: if isAuthenticated() && (request.auth.uid == clientId || isAdmin());
    }
  }
}`,
      },
      {
        heading: '2. Server-Side Lead Ingestion & Auditing',
        body: 'Always perform lead creation and admin document state mutations using server-side Firebase Admin SDK routes, isolating client keys from public execution scope.',
      },
    ],
  },
  {
    slug: 'ai-video-storytelling-workflow',
    title: 'Building Automated AI Video Pipelines for Brand Launches',
    excerpt: 'Converting raw product briefs into 4K cinematic commercials through 7 automated AI generation, scripting, and audio synthesis steps.',
    category: 'AI Pipeline',
    author: 'AI Creative Director',
    authorRole: 'Generative Media Architect',
    authorAvatar: '🎥',
    readTime: '5 min read',
    date: 'Jul 19, 2026',
    publishedAt: '2026-07-19T16:00:00.000Z',
    icon: '🎥',
    status: 'Published',
    views: 5120,
    likes: 315,
    tags: ['AI Pipeline', 'Generative Video', 'Prompt Engineering', 'Automation'],
    featured: false,
    sections: [
      {
        heading: '1. Prompt-to-Storyboard Orchestration',
        body: 'Converting high-level product briefs into granular 8-frame storyboard prompts with consistent character seeds and lighting schemas across diffusion models.',
      },
      {
        heading: '2. 4K Render Assembly & Audio Alignment',
        body: 'Stitching generated video clips with synthesized neural voice tracks, ambient soundscapes, and automated color grading for sub-48-hour broadcast delivery.',
        codeLanguage: 'python',
        code: `def assemble_ai_video(script_tokens, audio_track_url):
    storyboard_frames = generate_keyframes(script_tokens, seed=4289)
    interpolated_clips = apply_motion_diffusion(storyboard_frames, fps=60)
    final_render = merge_audio_stems(interpolated_clips, audio_track_url)
    return export_4k_h265(final_render)`,
      },
    ],
  },
  {
    slug: 'gsap-framer-motion-design-system',
    title: 'Building Scalable Micro-Animations with GSAP & Framer Motion',
    excerpt: 'Combining Framer Motion declarative UI states with GSAP ScrollTrigger timeline power for high-conversion agency websites.',
    category: 'Design Systems',
    author: 'DevZite UI Specialist',
    authorRole: 'Design Engineer',
    authorAvatar: '✨',
    readTime: '6 min read',
    date: 'Jul 12, 2026',
    publishedAt: '2026-07-12T11:45:00.000Z',
    icon: '✨',
    status: 'Published',
    views: 3190,
    likes: 188,
    tags: ['Framer Motion', 'GSAP', 'CSS Animation', 'UI/UX'],
    featured: false,
    sections: [
      {
        heading: '1. Declarative vs Imperative Motion Roles',
        body: 'Use Framer Motion for component-level UI interactions (hover effects, modal overlays, layout transitions) and GSAP for complex scroll-driven timeline orchestrations.',
      },
    ],
  },
  {
    slug: 'saas-seo-growth-mdx-architecture',
    title: 'Monopolizing Organic Search Traffic with Dynamic MDX',
    excerpt: 'How custom Next.js 15 metadata generation, structured JSON-LD schemas, and dynamic MDX publishing drive zero-CAC customer acquisition.',
    category: 'SaaS Growth',
    author: 'DevZite Growth Team',
    authorRole: 'SEO Systems Strategist',
    authorAvatar: '📈',
    readTime: '9 min read',
    date: 'Jul 5, 2026',
    publishedAt: '2026-07-05T08:20:00.000Z',
    icon: '📈',
    status: 'Published',
    views: 4760,
    likes: 279,
    tags: ['SEO', 'Next.js 15', 'MDX', 'SaaS', 'Marketing'],
    featured: false,
    sections: [
      {
        heading: '1. Automated JSON-LD Schema Generation',
        body: 'Embedding Google-compliant TechArticle and BreadcrumbList structured data schemas into every MDX publication automatically at render time.',
      },
    ],
  },
];

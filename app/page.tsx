import dynamic from 'next/dynamic';
import { Navbar } from '@/components/layout/Navbar';
import { SceneArrival } from '@/components/scenes/SceneArrival';
import { ScrollProgress } from '@/components/ui/ScrollProgress';
import { BackgroundSystem } from '@/components/transitions/BackgroundSystem';

// ── Dynamically split below-the-fold sections (SSR enabled for SEO & 0 CLS) ──
const SceneIdentity = dynamic(() => import('@/components/scenes/SceneIdentity').then((m) => m.SceneIdentity));
const SceneProblems = dynamic(() => import('@/components/scenes/SceneProblems').then((m) => m.SceneProblems));
const BentoGrid1 = dynamic(() => import('@/components/mvpblocks/bento-grid-1'));
const SceneProcess = dynamic(() => import('@/components/scenes/SceneProcess').then((m) => m.SceneProcess));
const SceneProof = dynamic(() => import('@/components/scenes/SceneProof').then((m) => m.SceneProof));
const SceneNumbers = dynamic(() => import('@/components/scenes/SceneNumbers').then((m) => m.SceneNumbers));
const SceneAIWorkflow = dynamic(() => import('@/components/scenes/SceneAIWorkflow').then((m) => m.SceneAIWorkflow));
const SceneStatistics = dynamic(() => import('@/components/scenes/SceneStatistics').then((m) => m.SceneStatistics));
const SceneVoices = dynamic(() => import('@/components/scenes/SceneVoices').then((m) => m.SceneVoices));
const SceneGallery = dynamic(() => import('@/components/scenes/SceneGallery').then((m) => m.SceneGallery));
const SceneInvitation = dynamic(() => import('@/components/scenes/SceneInvitation').then((m) => m.SceneInvitation));
const Footer = dynamic(() => import('@/components/layout/Footer').then((m) => m.Footer));

// ── Modal UI (Lazy-loaded client only) ──
const CommandPalette = dynamic(() => import('@/components/command/CommandPalette').then((m) => m.CommandPalette));

export default function HomePage() {
  return (
    <>
      {/* ── Global UI Infrastructure ── */}
      <ScrollProgress />
      <CommandPalette />
      <BackgroundSystem />
      <Navbar />

      {/* ── Narrative Homepage ── */}
      {/* Above-the-fold critical hero: statically loaded for optimal FCP / LCP */}
      <SceneArrival />

      {/* Below-the-fold cinematic scenes: code-split to eliminate unused JS */}
      <SceneIdentity />
      <SceneProblems />
      <BentoGrid1 />
      <SceneProcess />
      <SceneProof />
      <SceneNumbers />
      <SceneAIWorkflow />
      <SceneStatistics />
      <SceneVoices />
      <SceneGallery />
      <SceneInvitation />

      {/* ── Footer ── */}
      <Footer />
    </>
  );
}


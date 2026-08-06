import { Navbar } from '@/components/layout/Navbar';
import { Footer } from '@/components/layout/Footer';
import { PageLoader } from '@/components/loader/PageLoader';
import { PremiumCursor } from '@/components/cursor/PremiumCursor';
import { CommandPalette } from '@/components/command/CommandPalette';
import { BackgroundSystem } from '@/components/transitions/BackgroundSystem';
import { ScrollProgress } from '@/components/ui/ScrollProgress';

// Narrative Scenes
import { SceneArrival } from '@/components/scenes/SceneArrival';
import { SceneIdentity } from '@/components/scenes/SceneIdentity';
import { SceneProblems } from '@/components/scenes/SceneProblems';
import { SceneProcess } from '@/components/scenes/SceneProcess';
import { SceneProof } from '@/components/scenes/SceneProof';
import { SceneNumbers } from '@/components/scenes/SceneNumbers';
import { SceneAIWorkflow } from '@/components/scenes/SceneAIWorkflow';
import { SceneStatistics } from '@/components/scenes/SceneStatistics';
import { SceneVoices } from '@/components/scenes/SceneVoices';
import { SceneGallery } from '@/components/scenes/SceneGallery';
import { SceneInvitation } from '@/components/scenes/SceneInvitation';

import BentoGrid1 from '@/components/mvpblocks/bento-grid-1';

export default function HomePage() {
  return (
    <>
      {/* ── Global UI Infrastructure ── */}
      <ScrollProgress />
      <PageLoader />
      <CommandPalette />
      <BackgroundSystem />
      <Navbar />

      {/* ── Narrative Homepage (11 cinematic scenes) ── */}
      <SceneArrival />
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

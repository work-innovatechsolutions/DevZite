import { Navbar } from '@/components/layout/Navbar';
import { Footer } from '@/components/layout/Footer';
import { PageLoader } from '@/components/loader/PageLoader';
import { PremiumCursor } from '@/components/cursor/PremiumCursor';
import { CommandPalette } from '@/components/command/CommandPalette';
import { BackgroundSystem } from '@/components/transitions/BackgroundSystem';

// All 9 Narrative Scenes
import { SceneArrival } from '@/components/scenes/SceneArrival';
import { SceneIdentity } from '@/components/scenes/SceneIdentity';
import { SceneProblems } from '@/components/scenes/SceneProblems';
import { SceneProcess } from '@/components/scenes/SceneProcess';
import { SceneProof } from '@/components/scenes/SceneProof';
import { SceneNumbers } from '@/components/scenes/SceneNumbers';
import { SceneVoices } from '@/components/scenes/SceneVoices';
import { SceneGallery } from '@/components/scenes/SceneGallery';
import { SceneInvitation } from '@/components/scenes/SceneInvitation';

export default function HomePage() {
  return (
    <>
      {/* Infrastructure & Global UI */}
      <PageLoader />
      <PremiumCursor />
      <CommandPalette />
      <BackgroundSystem />
      <Navbar />

      {/* 9 Narrative Scenes */}
      <SceneArrival />
      <SceneIdentity />
      <SceneProblems />
      <SceneProcess />
      <SceneProof />
      <SceneNumbers />
      <SceneVoices />
      <SceneGallery />
      <SceneInvitation />

      {/* Global Footer */}
      <Footer />
    </>
  );
}

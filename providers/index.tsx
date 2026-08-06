'use client';

import { useEffect } from 'react';
import { registerGSAPPlugins } from '@/lib/gsap/plugins';
import { LenisProvider } from '@/lib/lenis/provider';
import { ThemeProvider } from './ThemeProvider';
import { CursorProvider } from './CursorProvider';
import { SceneProvider } from './SceneProvider';
import { SoundProvider } from './SoundProvider';
import { CommandPaletteProvider } from './CommandPaletteProvider';

import { AuthProvider } from './AuthProvider';

function GSAPSetup({ children }: { children: React.ReactNode }) {
  useEffect(() => {
    registerGSAPPlugins();
  }, []);
  return <>{children}</>;
}

interface ProvidersProps {
  children: React.ReactNode;
}

/**
 * Root provider composition.
 * Order matters — outer providers are available to inner ones.
 */
export function Providers({ children }: ProvidersProps) {
  return (
    <GSAPSetup>
      <AuthProvider>
        <ThemeProvider>
          <SoundProvider>
            <SceneProvider>
              <CursorProvider>
                <CommandPaletteProvider>
                  <LenisProvider>
                    {children}
                  </LenisProvider>
                </CommandPaletteProvider>
              </CursorProvider>
            </SceneProvider>
          </SoundProvider>
        </ThemeProvider>
      </AuthProvider>
    </GSAPSetup>
  );
}

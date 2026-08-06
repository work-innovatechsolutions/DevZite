'use client';

import { useEffect, useState } from 'react';
import { toast } from 'sonner';

const KONAMI_CODE = [
  'ArrowUp',
  'ArrowUp',
  'ArrowDown',
  'ArrowDown',
  'ArrowLeft',
  'ArrowRight',
  'ArrowLeft',
  'ArrowRight',
  'b',
  'a',
];

export function useEasterEggs() {
  const [keySequence, setKeySequence] = useState<string[]>([]);
  const [devMode, setDevMode] = useState(false);

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      setKeySequence((prev) => {
        const updated = [...prev, e.key].slice(-KONAMI_CODE.length);
        if (updated.join('') === KONAMI_CODE.join('')) {
          setDevMode(true);
          toast.success('🎮 Konami Code Unlocked: Secret Developer Mode Enabled!', {
            description: 'Aura Dev Motion Tokens: Fast(0.2s) · Medium(0.4s) · Premium(0.8s) · Cinematic(1.2s)',
            duration: 5000,
          });
        }
        return updated;
      });
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, []);

  return { devMode };
}

'use client';

import { createContext, useContext, useEffect, useState } from 'react';
import Lenis from 'lenis';

interface LenisContextValue {
  lenis: Lenis | null;
}

const LenisContext = createContext<LenisContextValue>({ lenis: null });

export function useLenis() {
  return useContext(LenisContext).lenis;
}

interface LenisProviderProps {
  children: React.ReactNode;
}

export function LenisProvider({ children }: LenisProviderProps) {
  const [lenis, setLenis] = useState<Lenis | null>(null);

  useEffect(() => {
    // On touch/mobile devices, skip Lenis entirely.
    // Native momentum scroll is always smoother than a JS-driven re-implementation
    // and Lenis' touchMultiplier intercepts native touch events which causes jitter.
    const isTouch = window.matchMedia('(hover: none) and (pointer: coarse)').matches;
    if (isTouch) return;

    const instance = new Lenis({
      lerp: 0.1,
      orientation: 'vertical',
      gestureOrientation: 'vertical',
      smoothWheel: true,
      wheelMultiplier: 1.0,
      // touchMultiplier intentionally omitted — not needed since we skip on touch
      infinite: false,
    });

    setLenis(instance);

    // High performance RAF loop — drives Lenis on desktop only
    let reqId: number;
    function raf(time: number) {
      instance.raf(time);
      reqId = requestAnimationFrame(raf);
    }
    reqId = requestAnimationFrame(raf);

    return () => {
      cancelAnimationFrame(reqId);
      instance.destroy();
      setLenis(null);
    };
  }, []);

  return (
    <LenisContext.Provider value={{ lenis }}>
      {children}
    </LenisContext.Provider>
  );
}

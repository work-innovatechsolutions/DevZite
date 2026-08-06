'use client';

import { useEffect, useRef, useState } from 'react';
import { isTouchDevice } from '@/lib/utils';

interface MousePosition {
  x: number;
  y: number;
  /** Normalized -1 to 1 relative to viewport center */
  nx: number;
  ny: number;
}

/**
 * Tracks mouse position globally.
 * Returns { x, y } in pixels and { nx, ny } normalized to [-1, 1].
 * Returns null on touch devices.
 */
export function useMousePosition(): MousePosition | null {
  const [pos, setPos] = useState<MousePosition | null>(null);
  const isTouch = useRef(false);

  useEffect(() => {
    isTouch.current = isTouchDevice();
    if (isTouch.current) return;

    const handler = (e: MouseEvent) => {
      setPos({
        x: e.clientX,
        y: e.clientY,
        nx: (e.clientX / window.innerWidth)  * 2 - 1,
        ny: (e.clientY / window.innerHeight) * 2 - 1,
      });
    };

    window.addEventListener('mousemove', handler, { passive: true });
    return () => window.removeEventListener('mousemove', handler);
  }, []);

  return pos;
}

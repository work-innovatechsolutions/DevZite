'use client';

import { useEffect, useRef } from 'react';
import createGlobe from 'cobe';

export default function CobeGlobe() {
  const canvasRef = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    let phi = 0;
    if (!canvasRef.current) return;

    const globe = createGlobe(canvasRef.current, {
      devicePixelRatio: 2,
      width: 600 * 2,
      height: 600 * 2,
      phi: 0,
      theta: 0.3,
      dark: 1,
      diffuse: 1.2,
      mapSamples: 16000,
      mapBrightness: 6,
      baseColor: [0.03, 0.04, 0.07],
      markerColor: [0.23, 0.51, 0.96],
      glowColor: [0.02, 0.35, 0.8],
      markers: [
        { location: [37.7749, -122.4194], size: 0.08 }, // SF
        { location: [40.7128, -74.006], size: 0.08 },   // NY
        { location: [51.5074, -0.1278], size: 0.08 },   // London
        { location: [28.6139, 77.209], size: 0.1 },     // Delhi / India HQ
        { location: [1.3521, 103.8198], size: 0.08 },   // Singapore
        { location: [35.6762, 139.6503], size: 0.08 },  // Tokyo
      ],
      onRender: (state: Record<string, any>) => {
        state.phi = phi;
        phi += 0.006;
      },
    } as any);

    return () => {
      globe.destroy();
    };
  }, []);

  return (
    <div className="relative w-full aspect-square max-w-[320px] mx-auto flex items-center justify-center overflow-hidden pointer-events-none">
      <canvas
        ref={canvasRef}
        className="w-full h-full object-contain"
        style={{ width: 320, height: 320, maxWidth: '100%', maxHeight: '100%' }}
      />
    </div>
  );
}

'use client';

import { useEffect, useRef, useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { DURATION, EASE } from '@/lib/motion/tokens';
import Image from 'next/image';

const SKIP_KEY = 'its_visited';

export function PageLoader() {
  const [phase, setPhase] = useState<
    'loading' | 'dissolve' | 'curtain' | 'done'
  >('loading');
  const [progress, setProgress] = useState(0);
  const [shouldShow, setShouldShow] = useState(true);
  const svgRef = useRef<SVGSVGElement>(null);

  useEffect(() => {
    // Skip full loader on repeat visits — show brief fade only
    const visited = localStorage.getItem(SKIP_KEY);
    if (visited) {
      // Quick fade out
      setTimeout(() => setShouldShow(false), 600);
      return;
    }

    // Simulate loading progress
    let current = 0;
    const interval = setInterval(() => {
      current += Math.random() * 18 + 4;
      if (current >= 100) {
        current = 100;
        clearInterval(interval);
        setProgress(100);

        // Phase 2: dissolve
        setTimeout(() => setPhase('dissolve'), 200);
        // Phase 3: curtain split
        setTimeout(() => setPhase('curtain'), 700);
        // Phase 4: done
        setTimeout(() => {
          setPhase('done');
          setShouldShow(false);
          localStorage.setItem(SKIP_KEY, '1');
        }, 1400);
      } else {
        setProgress(Math.floor(current));
      }
    }, 60);

    return () => clearInterval(interval);
  }, []);

  if (!shouldShow) return null;

  return (
    <AnimatePresence>
      <div className="fixed inset-0 z-[600] overflow-hidden pointer-events-none">
        {/* Left curtain panel */}
        <motion.div
          className="absolute inset-y-0 left-0 w-1/2 bg-[#06070A]"
          animate={phase === 'curtain' ? { x: '-100%' } : { x: 0 }}
          transition={{ duration: DURATION.cinematic, ease: EASE.luxury }}
        />
        {/* Right curtain panel */}
        <motion.div
          className="absolute inset-y-0 right-0 w-1/2 bg-[#06070A]"
          animate={phase === 'curtain' ? { x: '100%' } : { x: 0 }}
          transition={{ duration: DURATION.cinematic, ease: EASE.luxury }}
        />

        {/* Loader content (hides during curtain split) */}
        <AnimatePresence>
          {phase !== 'curtain' && phase !== 'done' && (
            <motion.div
              className="absolute inset-0 flex flex-col items-center justify-center bg-[#06070A]"
              exit={{ opacity: 0, scale: 0.95 }}
              transition={{ duration: DURATION.fast, ease: EASE.accelerate }}
            >
              {/* Logo */}
              <motion.div
                className="relative w-24 h-24 mb-8"
                initial={{ opacity: 0, scale: 0.8 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ duration: DURATION.slow, ease: EASE.decelerate }}
              >
                <Image
                  src="/logo.png"
                  alt="Innovatech Solutions"
                  fill
                  sizes="96px"
                  className="object-contain"
                  priority
                />
              </motion.div>

              {/* SVG Circuit Lines */}
              <motion.div
                className="absolute inset-0 pointer-events-none"
                initial={{ opacity: 0 }}
                animate={{ opacity: phase === 'dissolve' ? 0 : 1 }}
                transition={{ duration: DURATION.fast }}
              >
                <svg
                  ref={svgRef}
                  className="w-full h-full"
                  viewBox="0 0 800 600"
                  preserveAspectRatio="xMidYMid meet"
                  aria-hidden="true"
                >
                  {/* Circuit lines emanating from center */}
                  {[
                    'M400,300 L600,300 L650,250',
                    'M400,300 L200,300 L150,250',
                    'M400,300 L400,150 L450,100',
                    'M400,300 L400,450 L350,500',
                    'M400,300 L550,180 L580,140',
                    'M400,300 L250,180 L220,140',
                    'M400,300 L550,420 L600,460',
                    'M400,300 L250,420 L200,460',
                  ].map((d, i) => (
                    <motion.path
                      key={i}
                      d={d}
                      stroke="rgba(59,130,246,0.5)"
                      strokeWidth="1"
                      fill="none"
                      strokeDasharray="1000"
                      strokeDashoffset="1000"
                      strokeLinecap="round"
                      animate={{ strokeDashoffset: 0 }}
                      transition={{
                        duration: 0.6,
                        delay: 0.4 + i * 0.06,
                        ease: EASE.premium,
                      }}
                    />
                  ))}
                  {/* Circuit node dots */}
                  {[
                    [650, 250], [150, 250], [450, 100], [350, 500],
                    [580, 140], [220, 140], [600, 460], [200, 460],
                  ].map(([cx, cy], i) => (
                    <motion.circle
                      key={i}
                      cx={cx}
                      cy={cy}
                      r="3"
                      fill="rgba(59,130,246,0.8)"
                      initial={{ scale: 0, opacity: 0 }}
                      animate={{ scale: 1, opacity: 1 }}
                      transition={{ delay: 0.9 + i * 0.04, duration: DURATION.fast }}
                    />
                  ))}
                </svg>
              </motion.div>

              {/* Progress Counter */}
              <motion.div
                className="mt-8 text-center"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: 0.3, duration: DURATION.medium }}
              >
                <motion.span
                  className="text-5xl font-display font-bold tabular-nums gradient-text"
                  key={progress}
                >
                  {progress}
                </motion.span>
                <span className="text-2xl font-display font-bold gradient-text">%</span>

                <p className="mt-3 text-sm text-[#64748B] font-body tracking-widest uppercase">
                  Loading experience
                </p>
              </motion.div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </AnimatePresence>
  );
}

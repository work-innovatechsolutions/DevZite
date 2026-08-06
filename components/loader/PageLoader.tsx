'use client';

import { useEffect, useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';

export function PageLoader() {
  const [shouldShow, setShouldShow] = useState(true);

  useEffect(() => {
    // Smooth 250ms initial GPU fade overlay — zero main-thread thrashes
    const timer = setTimeout(() => {
      setShouldShow(false);
    }, 250);

    return () => clearTimeout(timer);
  }, []);

  if (!shouldShow) return null;

  return (
    <AnimatePresence>
      <motion.div
        initial={{ opacity: 1 }}
        animate={{ opacity: 0 }}
        transition={{ duration: 0.25, ease: 'easeOut' }}
        className="fixed inset-0 z-[600] bg-[#F8FAFC] dark:bg-[#06070A] pointer-events-none transform-gpu"
      />
    </AnimatePresence>
  );
}

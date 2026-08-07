'use client';

import { useEffect, useState, useRef } from 'react';

interface AnimatedNumberProps {
  value: string;
  className?: string;
}

export function AnimatedPriceNumber({ value, className = '' }: AnimatedNumberProps) {
  const match = value.match(/^([^\d]*)([\d,]+)(.*)$/);

  if (!match) {
    return <span className={className}>{value}</span>;
  }

  const prefix = match[1]; // e.g. "$"
  const numberStr = match[2]; // e.g. "5,999" or "4,799"
  const suffix = match[3]; // e.g. ""
  const targetNum = parseInt(numberStr.replace(/,/g, ''), 10);

  const [currentNum, setCurrentNum] = useState(targetNum);
  const currentNumRef = useRef(targetNum);

  useEffect(() => {
    let startTimestamp: number | null = null;
    const startNum = currentNumRef.current;
    const duration = 1000; // 1s smooth slot roll
    let animationFrameId: number;

    const step = (timestamp: number) => {
      if (!startTimestamp) startTimestamp = timestamp;
      const progress = Math.min((timestamp - startTimestamp) / duration, 1);
      // Custom easeOutExpo curve for dramatic counter rolling
      const easeProgress = progress === 1 ? 1 : 1 - Math.pow(2, -10 * progress);
      const val = Math.round(startNum + (targetNum - startNum) * easeProgress);

      setCurrentNum(val);
      currentNumRef.current = val;

      if (progress < 1) {
        animationFrameId = window.requestAnimationFrame(step);
      }
    };

    animationFrameId = window.requestAnimationFrame(step);

    return () => {
      if (animationFrameId) window.cancelAnimationFrame(animationFrameId);
    };
  }, [targetNum]);

  return (
    <span className={className}>
      {prefix}
      {currentNum.toLocaleString()}
      {suffix}
    </span>
  );
}

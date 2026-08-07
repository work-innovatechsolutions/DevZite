'use client';

import { useEffect, useState } from 'react';

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

  useEffect(() => {
    let startTimestamp: number | null = null;
    const startNum = currentNum;
    const duration = 800; // ms transition

    const step = (timestamp: number) => {
      if (!startTimestamp) startTimestamp = timestamp;
      const progress = Math.min((timestamp - startTimestamp) / duration, 1);
      // Ease out cubic
      const easeProgress = 1 - Math.pow(1 - progress, 3);
      const val = Math.round(startNum + (targetNum - startNum) * easeProgress);
      setCurrentNum(val);

      if (progress < 1) {
        window.requestAnimationFrame(step);
      }
    };

    window.requestAnimationFrame(step);
  }, [targetNum]);

  return (
    <span className={className}>
      {prefix}
      {currentNum.toLocaleString()}
      {suffix}
    </span>
  );
}

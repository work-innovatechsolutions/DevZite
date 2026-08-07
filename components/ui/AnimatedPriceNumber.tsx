'use client';

import { useEffect, useState, useRef } from 'react';

interface AnimatedNumberProps {
  value: string; // e.g. "$5,399"
  startValue?: string; // e.g. "$5,999" (original price when transitioning)
  className?: string;
}

export function AnimatedPriceNumber({ value, startValue, className = '' }: AnimatedNumberProps) {
  // Extract number from value string e.g. "$5,399" -> 5399
  const match = value.match(/^([^\d]*)([\d,]+)(.*)$/);

  if (!match) {
    return <span className={className}>{value}</span>;
  }

  const prefix = match[1]; // e.g. "$"
  const numberStr = match[2]; // e.g. "5399"
  const suffix = match[3]; // e.g. ""
  const targetNum = parseInt(numberStr.replace(/,/g, ''), 10);

  // Initial starting point: if startValue provided (e.g. $5,999), use that as the origin
  let initialFromNum = targetNum;
  if (startValue) {
    const startMatch = startValue.match(/^([^\d]*)([\d,]+)(.*)$/);
    if (startMatch) {
      initialFromNum = parseInt(startMatch[2].replace(/,/g, ''), 10);
    }
  }

  const [currentNum, setCurrentNum] = useState(initialFromNum);
  const prevTargetRef = useRef(targetNum);

  useEffect(() => {
    // Determine the animation starting value
    const fromNum = prevTargetRef.current !== targetNum ? prevTargetRef.current : initialFromNum;
    prevTargetRef.current = targetNum;

    if (fromNum === targetNum) {
      setCurrentNum(targetNum);
      return;
    }

    let startTimestamp: number | null = null;
    const duration = 1200; // 1.2s smooth counter roll
    let animationFrameId: number;

    const step = (timestamp: number) => {
      if (!startTimestamp) startTimestamp = timestamp;
      const progress = Math.min((timestamp - startTimestamp) / duration, 1);
      // Smooth easeOutExpo curve
      const easeProgress = progress === 1 ? 1 : 1 - Math.pow(2, -10 * progress);
      const val = Math.round(fromNum + (targetNum - fromNum) * easeProgress);

      setCurrentNum(val);

      if (progress < 1) {
        animationFrameId = window.requestAnimationFrame(step);
      }
    };

    animationFrameId = window.requestAnimationFrame(step);

    return () => {
      if (animationFrameId) window.cancelAnimationFrame(animationFrameId);
    };
  }, [targetNum, initialFromNum]);

  return (
    <span className={className}>
      {prefix}
      {currentNum.toLocaleString()}
      {suffix}
    </span>
  );
}

'use client';

import { useEffect } from 'react';
import { useScene } from '@/providers/SceneProvider';
import type { SceneId } from '@/types';

const SCENE_ATMOSPHERES: Record<SceneId, { bg: string; glow: string; grain: number }> = {
  arrival:    { bg: '#06070A', glow: 'rgba(59, 130, 246, 0.15)',  grain: 0.04 },
  identity:   { bg: '#080A14', glow: 'rgba(139, 92, 246, 0.15)', grain: 0.05 },
  problems:   { bg: '#06080F', glow: 'rgba(6, 182, 212, 0.15)',   grain: 0.04 },
  process:    { bg: '#070810', glow: 'rgba(59, 130, 246, 0.18)',  grain: 0.04 },
  proof:      { bg: '#050505', glow: 'rgba(255, 255, 255, 0.08)', grain: 0.03 },
  numbers:    { bg: '#060A10', glow: 'rgba(6, 182, 212, 0.20)',   grain: 0.04 },
  voices:     { bg: '#080810', glow: 'rgba(139, 92, 246, 0.12)', grain: 0.04 },
  gallery:    { bg: '#07080E', glow: 'rgba(59, 130, 246, 0.12)',  grain: 0.04 },
  invitation: { bg: '#090810', glow: 'rgba(139, 92, 246, 0.18)', grain: 0.04 },
};

export function BackgroundSystem() {
  const { activeScene } = useScene();

  useEffect(() => {
    const config = SCENE_ATMOSPHERES[activeScene] || SCENE_ATMOSPHERES.arrival;
    const root = document.documentElement;

    root.style.setProperty('--scene-bg', config.bg);
    root.style.setProperty('--scene-glow-color', config.glow);
    root.style.setProperty('--scene-grain-opacity', String(config.grain));
  }, [activeScene]);

  return null;
}

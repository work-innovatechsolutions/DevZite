'use client';

import { useEffect } from 'react';
import { gsap } from 'gsap';
import { CustomEase } from 'gsap/CustomEase';

/**
 * Register GSAP plugins once on the client.
 * Import this module from your root providers.
 */
let registered = false;

export function registerGSAPPlugins() {
  if (registered || typeof window === 'undefined') return;
  gsap.registerPlugin(CustomEase);

  // Register custom premium easings
  CustomEase.create('premium',   '0.16, 1, 0.3, 1');
  CustomEase.create('luxury',    '0.76, 0, 0.24, 1');
  CustomEase.create('cinematic', '0.4, 0, 0.2, 1');

  registered = true;
}

/** Hook to use inside components — registers plugins on mount */
export function useGSAPSetup() {
  useEffect(() => {
    registerGSAPPlugins();
  }, []);
}

export { gsap };

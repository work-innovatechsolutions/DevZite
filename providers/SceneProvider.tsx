'use client';

import {
  createContext,
  useContext,
  useState,
  useCallback,
  type ReactNode,
} from 'react';
import type { SceneId } from '@/types';

interface SceneContextValue {
  activeScene: SceneId;
  setActiveScene: (scene: SceneId) => void;
}

const SceneContext = createContext<SceneContextValue>({
  activeScene: 'arrival',
  setActiveScene: () => {},
});

export function useScene() {
  return useContext(SceneContext);
}

export function SceneProvider({ children }: { children: ReactNode }) {
  const [activeScene, setActiveSceneRaw] = useState<SceneId>('arrival');

  const setActiveScene = useCallback((scene: SceneId) => {
    setActiveSceneRaw(scene);
  }, []);

  return (
    <SceneContext.Provider value={{ activeScene, setActiveScene }}>
      {children}
    </SceneContext.Provider>
  );
}

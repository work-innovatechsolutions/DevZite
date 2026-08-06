'use client';

import {
  createContext,
  useContext,
  useState,
  useCallback,
  useRef,
  type ReactNode,
} from 'react';

interface SoundContextValue {
  isEnabled: boolean;
  toggle: () => void;
  volume: number;
  setVolume: (v: number) => void;
}

const SoundContext = createContext<SoundContextValue>({
  isEnabled: false,
  toggle: () => {},
  volume: 0.3,
  setVolume: () => {},
});

export function useSound() {
  return useContext(SoundContext);
}

const STORAGE_KEY = 'its_ambient_sound';

export function SoundProvider({ children }: { children: ReactNode }) {
  const [isEnabled, setIsEnabled] = useState(false); // Off by default
  const [volume, setVolume] = useState(0.3);
  const audioRef = useRef<HTMLAudioElement | null>(null);

  const toggle = useCallback(() => {
    setIsEnabled((prev) => {
      const next = !prev;

      if (next) {
        // Lazily create audio element
        if (!audioRef.current && typeof window !== 'undefined') {
          const audio = new Audio('/sounds/ambient.mp3');
          audio.loop = true;
          audio.volume = volume;
          audioRef.current = audio;
        }
        audioRef.current?.play().catch(() => {
          // Autoplay policy — silently fail
        });
      } else {
        audioRef.current?.pause();
      }

      // Persist preference
      if (typeof localStorage !== 'undefined') {
        localStorage.setItem(STORAGE_KEY, String(next));
      }

      return next;
    });
  }, [volume]);

  const handleSetVolume = useCallback((v: number) => {
    setVolume(v);
    if (audioRef.current) {
      audioRef.current.volume = v;
    }
  }, []);

  return (
    <SoundContext.Provider
      value={{ isEnabled, toggle, volume, setVolume: handleSetVolume }}
    >
      {children}
    </SoundContext.Provider>
  );
}

'use client';

import {
  createContext,
  useContext,
  useState,
  useCallback,
  type ReactNode,
} from 'react';
import type { CursorState } from '@/types';

interface CursorContextValue {
  state: CursorState;
  setState: (state: CursorState) => void;
  label: string;
  setLabel: (label: string) => void;
}

const CursorContext = createContext<CursorContextValue>({
  state: 'idle',
  setState: () => {},
  label: '',
  setLabel: () => {},
});

export function useCursorState() {
  return useContext(CursorContext);
}

export function CursorProvider({ children }: { children: ReactNode }) {
  const [state, setStateRaw] = useState<CursorState>('idle');
  const [label, setLabel] = useState('');

  const setState = useCallback((newState: CursorState) => {
    setStateRaw(newState);
  }, []);

  return (
    <CursorContext.Provider value={{ state, setState, label, setLabel }}>
      {children}
    </CursorContext.Provider>
  );
}

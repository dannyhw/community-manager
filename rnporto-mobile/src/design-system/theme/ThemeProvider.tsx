import React, { createContext, useContext, useMemo, useState, ReactNode } from 'react';
import { useColorScheme } from 'react-native';

import { Direction, Mode, Theme, resolveTheme } from './tokens';

type ThemeContextValue = {
  theme: Theme;
  mode: Mode;
  direction: Direction;
  accent: string;
  setMode: (m: Mode) => void;
  setDirection: (d: Direction) => void;
  setAccent: (hex: string) => void;
  motifOn: boolean;
  setMotifOn: (v: boolean) => void;
};

const ThemeContext = createContext<ThemeContextValue | null>(null);

export function ThemeProvider({
  children,
  initialMode,
  initialDirection = 'atomico',
  initialAccent = '#2B6CA8',
}: {
  children: ReactNode;
  initialMode?: Mode;
  initialDirection?: Direction;
  initialAccent?: string;
}) {
  const system = useColorScheme();
  const [mode, setMode] = useState<Mode>(initialMode ?? (system === 'dark' ? 'dark' : 'light'));
  const [direction, setDirection] = useState<Direction>(initialDirection);
  const [accent, setAccent] = useState<string>(initialAccent);
  const [motifOn, setMotifOn] = useState(true);

  const value = useMemo<ThemeContextValue>(
    () => ({
      theme: resolveTheme(direction, mode, accent),
      mode,
      direction,
      accent,
      setMode,
      setDirection,
      setAccent,
      motifOn,
      setMotifOn,
    }),
    [mode, direction, accent, motifOn]
  );

  return <ThemeContext.Provider value={value}>{children}</ThemeContext.Provider>;
}

export function useTheme(): Theme {
  const ctx = useContext(ThemeContext);
  if (!ctx) throw new Error('useTheme must be used within ThemeProvider');
  return ctx.theme;
}

export function useThemeControls() {
  const ctx = useContext(ThemeContext);
  if (!ctx) throw new Error('useThemeControls must be used within ThemeProvider');
  return ctx;
}

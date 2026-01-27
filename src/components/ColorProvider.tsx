'use client';

import { useEffect, useState, createContext, useContext, ReactNode } from 'react';

interface ColorSettings {
  brandRed: string;
  brandRedLight: string;
  brandRedDark: string;
  brandViolet: string;
  brandVioletLight: string;
  brandVioletDark: string;
  brandVioletBg: string;
}

const DEFAULT_COLORS: ColorSettings = {
  brandRed: '#f02822',
  brandRedLight: '#ff4d47',
  brandRedDark: '#c41e1a',
  brandViolet: '#844cfc',
  brandVioletLight: '#dbcbff',
  brandVioletDark: '#6a3acc',
  brandVioletBg: '#0a0a0f',
};

const CSS_VAR_MAP: Record<keyof ColorSettings, string> = {
  brandRed: '--brand-red',
  brandRedLight: '--brand-red-light',
  brandRedDark: '--brand-red-dark',
  brandViolet: '--brand-violet',
  brandVioletLight: '--brand-violet-light',
  brandVioletDark: '--brand-violet-dark',
  brandVioletBg: '--brand-violet-bg',
};

const ColorContext = createContext<ColorSettings>(DEFAULT_COLORS);

export function useColors() {
  return useContext(ColorContext);
}

export function ColorProvider({ children }: { children: ReactNode }) {
  const [colors, setColors] = useState<ColorSettings>(DEFAULT_COLORS);
  const [loaded, setLoaded] = useState(false);

  useEffect(() => {
    fetch('/api/settings')
      .then(res => res.json())
      .then(data => {
        const newColors = { ...DEFAULT_COLORS };
        (Object.keys(DEFAULT_COLORS) as Array<keyof ColorSettings>).forEach(key => {
          if (data[key]) {
            newColors[key] = data[key];
          }
        });
        setColors(newColors);

        // Apply to CSS variables
        Object.entries(newColors).forEach(([key, value]) => {
          const cssVar = CSS_VAR_MAP[key as keyof ColorSettings];
          if (cssVar) {
            document.documentElement.style.setProperty(cssVar, value);
          }
        });
        setLoaded(true);
      })
      .catch(() => setLoaded(true));
  }, []);

  return (
    <ColorContext.Provider value={colors}>
      {children}
    </ColorContext.Provider>
  );
}

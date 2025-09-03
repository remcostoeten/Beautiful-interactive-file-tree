import { useTheme } from 'next-themes';
import { useEffect, useState } from 'react';

import { 
  getStoredTheme, 
  resolveShikiTheme, 
  setStoredTheme 
} from '@/lib/shiki-themes';

type TUseShikiThemeProps = {
  initialTheme?: string;
  defaultDark?: string;
  defaultLight?: string;
}

export function useShikiTheme({
  initialTheme,
  defaultDark,
  defaultLight
}: TUseShikiThemeProps = {}) {
  const { resolvedTheme } = useTheme();
  const [selectedTheme, setSelectedTheme] = useState<string>(() => {
    return initialTheme || getStoredTheme() || 'auto';
  });

  // Resolved theme for Shiki
  const resolvedShikiTheme = resolveShikiTheme(
    selectedTheme === 'auto' ? undefined : selectedTheme,
    resolvedTheme as 'light' | 'dark' | undefined,
    defaultLight,
    defaultDark
  );

  function updateTheme(theme: string) {
    setSelectedTheme(theme);
    setStoredTheme(theme);
  }

  // Sync with stored theme on mount
  useEffect(() => {
    const stored = getStoredTheme();
    if (stored && stored !== selectedTheme) {
      setSelectedTheme(stored);
    }
  }, [selectedTheme]);

  return {
    selectedTheme,
    resolvedShikiTheme,
    updateTheme,
    isAutoMode: selectedTheme === 'auto'
  };
}

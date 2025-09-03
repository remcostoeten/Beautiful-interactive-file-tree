type TShikiTheme = {
  name: string;
  value: string;
  shikiName: string;
  type: 'light' | 'dark';
  description?: string;
}

export const AVAILABLE_THEMES: TShikiTheme[] = [
  // Light themes
  {
    name: 'GitHub Light',
    value: 'github-light',
    shikiName: 'github-light',
    type: 'light',
    description: 'Clean GitHub-style light theme'
  },
  {
    name: 'Light Plus',
    value: 'light-plus',
    shikiName: 'light-plus',
    type: 'light',
    description: 'VS Code light theme'
  },
  {
    name: 'Atom One Light',
    value: 'atom-one-light',
    shikiName: 'one-light',
    type: 'light',
    description: 'Atom editor one light theme'
  },
  {
    name: 'Solarized Light',
    value: 'solarized-light',
    shikiName: 'solarized-light',
    type: 'light',
    description: 'Popular solarized light theme'
  },
  
  // Dark themes
  {
    name: 'GitHub Dark',
    value: 'github-dark',
    shikiName: 'github-dark',
    type: 'dark',
    description: 'GitHub dark theme'
  },
  {
    name: 'Atom One Dark',
    value: 'atom-one-dark',
    shikiName: 'one-dark-pro',
    type: 'dark',
    description: 'Popular Atom one dark theme'
  },
  {
    name: 'VS Code Dark',
    value: 'dark-plus',
    shikiName: 'dark-plus',
    type: 'dark',
    description: 'VS Code default dark theme'
  },
  {
    name: 'Dracula',
    value: 'dracula',
    shikiName: 'dracula',
    type: 'dark',
    description: 'Dracula theme with purple accents'
  },
  {
    name: 'Nord',
    value: 'nord',
    shikiName: 'nord',
    type: 'dark',
    description: 'Arctic nord-themed colors'
  },
  {
    name: 'Tokyo Night',
    value: 'tokyo-night',
    shikiName: 'tokyo-night',
    type: 'dark',
    description: 'Tokyo night theme'
  },
  {
    name: 'Monokai',
    value: 'monokai',
    shikiName: 'monokai',
    type: 'dark',
    description: 'Classic Monokai theme'
  },
  {
    name: 'Solarized Dark',
    value: 'solarized-dark',
    shikiName: 'solarized-dark',
    type: 'dark',
    description: 'Solarized dark variant'
  }
];

export function getThemeByValue(value: string): TShikiTheme | undefined {
  return AVAILABLE_THEMES.find(theme => theme.value === value);
}

export function getThemesByType(type: 'light' | 'dark'): TShikiTheme[] {
  return AVAILABLE_THEMES.filter(theme => theme.type === type);
}

export function getDefaultTheme(type: 'light' | 'dark'): TShikiTheme {
  if (type === 'light') {
    return AVAILABLE_THEMES.find(t => t.value === 'github-light') || AVAILABLE_THEMES[0];
  }
  return AVAILABLE_THEMES.find(t => t.value === 'github-dark') || AVAILABLE_THEMES[4];
}

export function resolveShikiTheme(
  requestedTheme: string | undefined,
  systemTheme: 'light' | 'dark' | undefined,
  defaultLight?: string,
  defaultDark?: string
): string {
  // If a specific theme is requested, use it
  if (requestedTheme) {
    const theme = getThemeByValue(requestedTheme);
    return theme?.shikiName || requestedTheme;
  }

  // Fall back to system theme with defaults
  if (systemTheme === 'dark') {
    const darkTheme = getThemeByValue(defaultDark || 'github-dark');
    return darkTheme?.shikiName || 'github-dark';
  } else {
    const lightTheme = getThemeByValue(defaultLight || 'github-light');
    return lightTheme?.shikiName || 'github-light';
  }
}

// Get all unique Shiki theme names for the highlighter
export function getAllShikiThemeNames(): string[] {
  return Array.from(new Set(AVAILABLE_THEMES.map(theme => theme.shikiName)));
}

// Storage key for theme persistence
export const THEME_STORAGE_KEY = 'file-viewer-shiki-theme';

export function getStoredTheme(): string | null {
  if (typeof window === 'undefined') return null;
  return localStorage.getItem(THEME_STORAGE_KEY);
}

export function setStoredTheme(theme: string): void {
  if (typeof window === 'undefined') return;
  localStorage.setItem(THEME_STORAGE_KEY, theme);
}

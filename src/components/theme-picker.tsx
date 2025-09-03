import { ChevronDown, Monitor, Moon, Palette, Sun } from "lucide-react";
import { useTheme } from "next-themes";
import { useEffect, useState } from "react";

import { Button } from "@/components/ui/button";
import {
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectLabel,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { 
  AVAILABLE_THEMES, 
  getStoredTheme, 
  getThemesByType, 
  setStoredTheme,
  type TShikiTheme
} from "@/lib/shiki-themes";

type TProps = {
  selectedTheme?: string;
  onThemeChange: (theme: string) => void;
  className?: string;
  showSystemThemeToggle?: boolean;
}

export function ThemePicker({ 
  selectedTheme, 
  onThemeChange, 
  className,
  showSystemThemeToggle = false 
}: TProps) {
  const { resolvedTheme, setTheme } = useTheme();
  const [currentShikiTheme, setCurrentShikiTheme] = useState<string>(
    selectedTheme || getStoredTheme() || 'auto'
  );

  const lightThemes = getThemesByType('light');
  const darkThemes = getThemesByType('dark');

  useEffect(() => {
    const stored = getStoredTheme();
    if (stored && stored !== currentShikiTheme) {
      setCurrentShikiTheme(stored);
    }
  }, [currentShikiTheme]);

  function handleThemeChange(value: string) {
    setCurrentShikiTheme(value);
    setStoredTheme(value);
    onThemeChange(value);
  }

  function getThemeIcon(themeType?: 'light' | 'dark') {
    switch (themeType || resolvedTheme) {
      case 'light':
        return <Sun className="h-4 w-4" />;
      case 'dark':
        return <Moon className="h-4 w-4" />;
      default:
        return <Monitor className="h-4 w-4" />;
    }
  }

  function renderThemeOption(theme: TShikiTheme) {
    return (
      <SelectItem key={theme.value} value={theme.value}>
        <div className="flex items-center gap-2">
          {getThemeIcon(theme.type)}
          <div>
            <div className="font-medium">{theme.name}</div>
            {theme.description && (
              <div className="text-xs text-muted-foreground">{theme.description}</div>
            )}
          </div>
        </div>
      </SelectItem>
    );
  }

  return (
    <div className={className}>
      <div className="flex items-center gap-2">
        {showSystemThemeToggle && (
          <div className="flex items-center border rounded-lg">
            <Button
              variant={resolvedTheme === 'light' ? 'default' : 'ghost'}
              size="sm"
              onClick={() => setTheme('light')}
              className="rounded-r-none border-r"
              title="Light mode"
            >
              <Sun className="h-4 w-4" />
            </Button>
            <Button
              variant={resolvedTheme === 'system' ? 'default' : 'ghost'}
              size="sm"
              onClick={() => setTheme('system')}
              className="rounded-none border-r"
              title="System theme"
            >
              <Monitor className="h-4 w-4" />
            </Button>
            <Button
              variant={resolvedTheme === 'dark' ? 'default' : 'ghost'}
              size="sm"
              onClick={() => setTheme('dark')}
              className="rounded-l-none"
              title="Dark mode"
            >
              <Moon className="h-4 w-4" />
            </Button>
          </div>
        )}

        <Select value={currentShikiTheme} onValueChange={handleThemeChange}>
          <SelectTrigger className="w-[280px]">
            <div className="flex items-center gap-2">
              <Palette className="h-4 w-4" />
              <SelectValue placeholder="Choose code theme..." />
            </div>
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="auto">
              <div className="flex items-center gap-2">
                <Monitor className="h-4 w-4" />
                <div>
                  <div className="font-medium">Auto (Follow system)</div>
                  <div className="text-xs text-muted-foreground">
                    Use system theme preference
                  </div>
                </div>
              </div>
            </SelectItem>
            
            <SelectGroup>
              <SelectLabel>Light Themes</SelectLabel>
              {lightThemes.map(renderThemeOption)}
            </SelectGroup>
            
            <SelectGroup>
              <SelectLabel>Dark Themes</SelectLabel>
              {darkThemes.map(renderThemeOption)}
            </SelectGroup>
          </SelectContent>
        </Select>
      </div>
    </div>
  );
}

export function CompactThemePicker({ 
  selectedTheme, 
  onThemeChange, 
  className 
}: Omit<TProps, 'showSystemThemeToggle'>) {
  const [currentShikiTheme, setCurrentShikiTheme] = useState<string>(
    selectedTheme || getStoredTheme() || 'auto'
  );

  function handleThemeChange(value: string) {
    setCurrentShikiTheme(value);
    setStoredTheme(value);
    onThemeChange(value);
  }

  const currentTheme = AVAILABLE_THEMES.find(t => t.value === currentShikiTheme);

  return (
    <Select value={currentShikiTheme} onValueChange={handleThemeChange}>
      <SelectTrigger className={`w-[200px] ${className || ''}`}>
        <div className="flex items-center gap-2">
          <Palette className="h-3 w-3" />
          <SelectValue>
            {currentTheme?.name || (currentShikiTheme === 'auto' ? 'Auto' : 'Theme')}
          </SelectValue>
        </div>
      </SelectTrigger>
      <SelectContent>
        <SelectItem value="auto">
          <div className="flex items-center gap-2">
            <Monitor className="h-3 w-3" />
            Auto
          </div>
        </SelectItem>
        
        <SelectGroup>
          <SelectLabel>Light</SelectLabel>
          {getThemesByType('light').map(theme => (
            <SelectItem key={theme.value} value={theme.value}>
              <div className="flex items-center gap-2">
                <Sun className="h-3 w-3" />
                {theme.name}
              </div>
            </SelectItem>
          ))}
        </SelectGroup>
        
        <SelectGroup>
          <SelectLabel>Dark</SelectLabel>
          {getThemesByType('dark').map(theme => (
            <SelectItem key={theme.value} value={theme.value}>
              <div className="flex items-center gap-2">
                <Moon className="h-3 w-3" />
                {theme.name}
              </div>
            </SelectItem>
          ))}
        </SelectGroup>
      </SelectContent>
    </Select>
  );
}

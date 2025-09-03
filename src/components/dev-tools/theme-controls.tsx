'use client'

import * as RadioGroup from '@radix-ui/react-radio-group'
import * as Select from '@radix-ui/react-select'
import { Check, ChevronDown, Moon, Sun, Monitor } from 'lucide-react'
import { cn } from '@/lib/utils'
import type { CodeViewerDevProps } from '@/hooks/use-code-viewer-dev-tool'

type ThemeControlsProps = {
  props: CodeViewerDevProps
  availableThemes: string[]
  updateProp: <K extends keyof CodeViewerDevProps>(key: K, value: CodeViewerDevProps[K]) => void
}

export function ThemeControls({ props, availableThemes, updateProp }: ThemeControlsProps) {
  return (
    <div className="space-y-6">
      <div>
        <h4 className="text-sm font-medium mb-3">Theme Mode</h4>
        <RadioGroup.Root
          value={props.theme || "dark"}
          onValueChange={(value) => updateProp('theme', value as "dark" | "light")}
        >
          <div className="space-y-2">
            <div className="flex items-center space-x-2">
              <RadioGroup.Item
                value="dark"
                id="theme-dark"
                className="w-4 h-4 rounded-full border-2 border-primary focus:outline-none focus:ring-2 focus:ring-primary focus:ring-offset-2"
              >
                <RadioGroup.Indicator className="flex items-center justify-center w-full h-full relative after:content-[''] after:w-2 after:h-2 after:rounded-full after:bg-primary" />
              </RadioGroup.Item>
              <label htmlFor="theme-dark" className="flex items-center gap-2 text-sm cursor-pointer">
                <Moon className="w-4 h-4" />
                Dark
              </label>
            </div>
            
            <div className="flex items-center space-x-2">
              <RadioGroup.Item
                value="light"
                id="theme-light"
                className="w-4 h-4 rounded-full border-2 border-primary focus:outline-none focus:ring-2 focus:ring-primary focus:ring-offset-2"
              >
                <RadioGroup.Indicator className="flex items-center justify-center w-full h-full relative after:content-[''] after:w-2 after:h-2 after:rounded-full after:bg-primary" />
              </RadioGroup.Item>
              <label htmlFor="theme-light" className="flex items-center gap-2 text-sm cursor-pointer">
                <Sun className="w-4 h-4" />
                Light
              </label>
            </div>
          </div>
        </RadioGroup.Root>
      </div>

      <div>
        <label className="text-sm font-medium mb-2 block">Dark Theme</label>
        <Select.Root
          value={props.defaultDarkTheme}
          onValueChange={(value) => updateProp('defaultDarkTheme', value)}
        >
          <Select.Trigger className="flex items-center justify-between w-full px-3 py-2 text-sm bg-background border border-input rounded-md focus:outline-none focus:ring-2 focus:ring-primary focus:ring-offset-2">
            <Select.Value placeholder="Select dark theme" />
            <Select.Icon>
              <ChevronDown className="w-4 h-4" />
            </Select.Icon>
          </Select.Trigger>
          
          <Select.Portal>
            <Select.Content className="bg-popover border border-border rounded-md shadow-md overflow-hidden z-50">
              <Select.Viewport className="p-1">
                {availableThemes
                  .filter(theme => theme.includes('dark') || theme.includes('dracula') || theme.includes('monokai') || theme.includes('one-dark') || theme.includes('nord'))
                  .map((theme) => (
                    <Select.Item
                      key={theme}
                      value={theme}
                      className={cn(
                        "relative flex items-center px-2 py-1.5 text-sm rounded cursor-pointer outline-none",
                        "hover:bg-accent hover:text-accent-foreground",
                        "focus:bg-accent focus:text-accent-foreground",
                        "data-[state=checked]:bg-primary data-[state=checked]:text-primary-foreground"
                      )}
                    >
                      <Select.ItemText>{theme}</Select.ItemText>
                      <Select.ItemIndicator className="absolute right-2">
                        <Check className="w-4 h-4" />
                      </Select.ItemIndicator>
                    </Select.Item>
                  ))}
              </Select.Viewport>
            </Select.Content>
          </Select.Portal>
        </Select.Root>
      </div>

      <div>
        <label className="text-sm font-medium mb-2 block">Light Theme</label>
        <Select.Root
          value={props.defaultLightTheme}
          onValueChange={(value) => updateProp('defaultLightTheme', value)}
        >
          <Select.Trigger className="flex items-center justify-between w-full px-3 py-2 text-sm bg-background border border-input rounded-md focus:outline-none focus:ring-2 focus:ring-primary focus:ring-offset-2">
            <Select.Value placeholder="Select light theme" />
            <Select.Icon>
              <ChevronDown className="w-4 h-4" />
            </Select.Icon>
          </Select.Trigger>
          
          <Select.Portal>
            <Select.Content className="bg-popover border border-border rounded-md shadow-md overflow-hidden z-50">
              <Select.Viewport className="p-1">
                {availableThemes
                  .filter(theme => theme.includes('light') || theme.includes('solarized') || theme.includes('material-theme-lighter') || (!theme.includes('dark') && !theme.includes('dracula') && !theme.includes('monokai') && !theme.includes('one-dark') && !theme.includes('nord')))
                  .map((theme) => (
                    <Select.Item
                      key={theme}
                      value={theme}
                      className={cn(
                        "relative flex items-center px-2 py-1.5 text-sm rounded cursor-pointer outline-none",
                        "hover:bg-accent hover:text-accent-foreground",
                        "focus:bg-accent focus:text-accent-foreground",
                        "data-[state=checked]:bg-primary data-[state=checked]:text-primary-foreground"
                      )}
                    >
                      <Select.ItemText>{theme}</Select.ItemText>
                      <Select.ItemIndicator className="absolute right-2">
                        <Check className="w-4 h-4" />
                      </Select.ItemIndicator>
                    </Select.Item>
                  ))}
              </Select.Viewport>
            </Select.Content>
          </Select.Portal>
        </Select.Root>
      </div>

      <div className="pt-2 border-t">
        <div className="text-xs text-muted-foreground">
          <p className="mb-1">Current selection:</p>
          <div className="bg-muted p-2 rounded text-xs font-mono">
            theme: "{props.theme}"<br />
            defaultDarkTheme: "{props.defaultDarkTheme}"<br />
            defaultLightTheme: "{props.defaultLightTheme}"
          </div>
        </div>
      </div>
    </div>
  )
}

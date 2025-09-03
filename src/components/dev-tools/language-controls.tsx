'use client'

import * as Select from '@radix-ui/react-select'
import * as Switch from '@radix-ui/react-switch'
import { Check, ChevronDown, Code2, Hash } from 'lucide-react'
import { cn } from '@/lib/utils'
import type { CodeViewerDevProps } from '@/hooks/use-code-viewer-dev-tool'

type LanguageControlsProps = {
  props: CodeViewerDevProps
  availableLanguages: string[]
  updateProp: <K extends keyof CodeViewerDevProps>(key: K, value: CodeViewerDevProps[K]) => void
}

export function LanguageControls({ props, availableLanguages, updateProp }: LanguageControlsProps) {
  return (
    <div className="space-y-6">
      <div>
        <label className="text-sm font-medium mb-2 block">Programming Language</label>
        <Select.Root
          value={props.lang}
          onValueChange={(value) => updateProp('lang', value)}
        >
          <Select.Trigger className="flex items-center justify-between w-full px-3 py-2 text-sm bg-background border border-input rounded-md focus:outline-none focus:ring-2 focus:ring-primary focus:ring-offset-2">
            <div className="flex items-center gap-2">
              <Code2 className="w-4 h-4" />
              <Select.Value placeholder="Select language" />
            </div>
            <Select.Icon>
              <ChevronDown className="w-4 h-4" />
            </Select.Icon>
          </Select.Trigger>
          
          <Select.Portal>
            <Select.Content className="bg-popover border border-border rounded-md shadow-md overflow-hidden z-50 max-h-60">
              <Select.Viewport className="p-1">
                {availableLanguages.map((lang) => (
                  <Select.Item
                    key={lang}
                    value={lang}
                    className={cn(
                      "relative flex items-center px-2 py-1.5 text-sm rounded cursor-pointer outline-none",
                      "hover:bg-accent hover:text-accent-foreground",
                      "focus:bg-accent focus:text-accent-foreground",
                      "data-[state=checked]:bg-primary data-[state=checked]:text-primary-foreground"
                    )}
                  >
                    <Select.ItemText>{lang}</Select.ItemText>
                    <Select.ItemIndicator className="absolute right-2">
                      <Check className="w-4 h-4" />
                    </Select.ItemIndicator>
                  </Select.Item>
                ))}
              </Select.Viewport>
            </Select.Content>
          </Select.Portal>
        </Select.Root>
        <p className="text-xs text-muted-foreground mt-1">
          This affects syntax highlighting and file extension
        </p>
      </div>

      <div>
        <div className="flex items-center justify-between">
          <div className="space-y-0.5">
            <label htmlFor="show-line-numbers" className="text-sm font-medium flex items-center gap-2">
              <Hash className="w-4 h-4" />
              Show Line Numbers
            </label>
            <p className="text-xs text-muted-foreground">
              Display line numbers in the code viewer
            </p>
          </div>
          <Switch.Root
            id="show-line-numbers"
            checked={props.showLineNumbers}
            onCheckedChange={(checked) => updateProp('showLineNumbers', checked)}
            className="w-11 h-6 bg-muted rounded-full relative focus:outline-none focus:ring-2 focus:ring-primary focus:ring-offset-2 data-[state=checked]:bg-primary"
          >
            <Switch.Thumb className="block w-5 h-5 bg-background rounded-full transition-transform duration-100 translate-x-0.5 data-[state=checked]:translate-x-[22px]" />
          </Switch.Root>
        </div>
      </div>

      <div className="pt-2 border-t">
        <div className="text-xs text-muted-foreground">
          <p className="mb-1">Current selection:</p>
          <div className="bg-muted p-2 rounded text-xs font-mono">
            lang: "{props.lang}"<br />
            showLineNumbers: {props.showLineNumbers ? 'true' : 'false'}
          </div>
        </div>
      </div>

      {/* Language-specific tips */}
      {props.lang && (
        <div className="p-3 bg-blue-50 dark:bg-blue-950/30 rounded-md border border-blue-200 dark:border-blue-800">
          <h5 className="text-sm font-medium text-blue-900 dark:text-blue-100 mb-1">
            Language Tips: {props.lang.toUpperCase()}
          </h5>
          <div className="text-xs text-blue-800 dark:text-blue-200">
            {getLanguageTip(props.lang)}
          </div>
        </div>
      )}
    </div>
  )
}

function getLanguageTip(lang: string): string {
  const tips: Record<string, string> = {
    tsx: "TypeScript JSX - Great for React components with type safety",
    typescript: "TypeScript - Adds static typing to JavaScript",
    javascript: "JavaScript - The language of the web",
    jsx: "JSX - JavaScript XML for React components",
    json: "JSON - Lightweight data interchange format",
    css: "CSS - Styling language for web pages",
    scss: "SCSS - Sass CSS preprocessor with advanced features",
    html: "HTML - Markup language for web content",
    markdown: "Markdown - Lightweight markup for documentation",
    python: "Python - Versatile programming language",
    rust: "Rust - Systems programming language focused on safety",
    go: "Go - Fast, compiled language from Google",
    java: "Java - Object-oriented programming language",
    php: "PHP - Server-side scripting language",
    sql: "SQL - Database query language",
    yaml: "YAML - Human-readable data serialization",
    xml: "XML - Extensible markup language"
  }
  
  return tips[lang] || "A programming language for code highlighting"
}

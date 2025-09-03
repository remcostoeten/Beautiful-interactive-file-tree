'use client'

import { Package, Tag, Type, MousePointer } from 'lucide-react'
import * as Switch from '@radix-ui/react-switch'
import type { CodeViewerDevProps } from '@/hooks/use-code-viewer-dev-tool'

type ComponentMetaControlsProps = {
  props: CodeViewerDevProps
  updateProp: <K extends keyof CodeViewerDevProps>(key: K, value: CodeViewerDevProps[K]) => void
}

export function ComponentMetaControls({ props, updateProp }: ComponentMetaControlsProps) {
  return (
    <div className="space-y-6">
      <div>
        <label htmlFor="component-name" className="text-sm font-medium mb-2 block flex items-center gap-2">
          <Package className="w-4 h-4" />
          Component Name
        </label>
        <input
          id="component-name"
          type="text"
          value={props.componentName}
          onChange={(e) => updateProp('componentName', e.target.value)}
          className="w-full px-3 py-2 text-sm bg-background border border-input rounded-md focus:outline-none focus:ring-2 focus:ring-primary focus:ring-offset-2"
          placeholder="Enter component name..."
        />
        <p className="text-xs text-muted-foreground mt-1">
          Displayed in the file tree header
        </p>
      </div>

      <div>
        <label htmlFor="component-version" className="text-sm font-medium mb-2 block flex items-center gap-2">
          <Tag className="w-4 h-4" />
          Version
        </label>
        <input
          id="component-version"
          type="text"
          value={props.componentVersion}
          onChange={(e) => updateProp('componentVersion', e.target.value)}
          className="w-full px-3 py-2 text-sm bg-background border border-input rounded-md focus:outline-none focus:ring-2 focus:ring-primary focus:ring-offset-2"
          placeholder="e.g., 1.0.0"
          pattern="^\d+\.\d+\.\d+$"
        />
        <p className="text-xs text-muted-foreground mt-1">
          Semantic version (e.g., 1.0.0)
        </p>
      </div>

      <div>
        <label htmlFor="custom-class" className="text-sm font-medium mb-2 block flex items-center gap-2">
          <Type className="w-4 h-4" />
          Custom CSS Classes
        </label>
        <input
          id="custom-class"
          type="text"
          value={props.className || ''}
          onChange={(e) => updateProp('className', e.target.value)}
          className="w-full px-3 py-2 text-sm bg-background border border-input rounded-md focus:outline-none focus:ring-2 focus:ring-primary focus:ring-offset-2"
          placeholder="Additional CSS classes..."
        />
        <p className="text-xs text-muted-foreground mt-1">
          Additional Tailwind classes for styling
        </p>
      </div>

      <div>
        <div className="flex items-center justify-between">
          <div className="space-y-0.5">
            <label htmlFor="enable-hover-highlight" className="text-sm font-medium flex items-center gap-2">
              <MousePointer className="w-4 h-4" />
              Enable Hover Highlight
            </label>
            <p className="text-xs text-muted-foreground">
              Show background color on hover for file & folder rows
            </p>
          </div>
          <Switch.Root
            id="enable-hover-highlight"
            checked={props.enableHoverHighlight ?? true}
            onCheckedChange={(checked) => updateProp('enableHoverHighlight', checked)}
            className="w-11 h-6 bg-muted rounded-full relative focus:outline-none focus:ring-2 focus:ring-primary focus:ring-offset-2 data-[state=checked]:bg-primary"
          >
            <Switch.Thumb className="block w-5 h-5 bg-background rounded-full transition-transform duration-100 translate-x-0.5 data-[state=checked]:translate-x-[22px]" />
          </Switch.Root>
        </div>
      </div>

      <div className="pt-2 border-t">
        <div className="text-xs text-muted-foreground">
          <p className="mb-1">Current values:</p>
          <div className="bg-muted p-2 rounded text-xs font-mono">
            name: "{props.componentName}"<br />
            version: "{props.componentVersion}"<br />
            className: "{props.className || '(none)'}"<br />
            enableHoverHighlight: {props.enableHoverHighlight ? 'true' : 'false'}
          </div>
        </div>
      </div>
    </div>
  )
}

'use client'

import { useState } from 'react'
import * as Dialog from '@radix-ui/react-dialog'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import { ScrollArea } from '@/components/ui/scroll-area'
import { 
  Settings, 
  X, 
  Download, 
  Upload, 
  RotateCcw,
  Monitor,
  Sun,
  Moon,
  Code,
  Palette,
  FileText,
  Zap
} from 'lucide-react'
import { cn } from '@/lib/utils'
import { useCodeViewerDevTool, type CodeViewerDevProps } from '@/hooks/use-code-viewer-dev-tool'
import { ThemeControls } from './theme-controls'
import { LanguageControls } from './language-controls'
import { ComponentMetaControls } from './component-meta-controls'
import { CodeEditor } from './code-editor'
import { PresetManager } from './preset-manager'
import { ImportExportControls } from './import-export-controls'
import CodeViewer from '@/components/file-viewer'

type TabId = 'theme' | 'language' | 'meta' | 'code' | 'presets'

const tabs = [
  { id: 'theme' as TabId, label: 'Theme', icon: Palette },
  { id: 'language' as TabId, label: 'Language', icon: Code },
  { id: 'meta' as TabId, label: 'Meta', icon: FileText },
  { id: 'code' as TabId, label: 'Code', icon: FileText },
  { id: 'presets' as TabId, label: 'Presets', icon: Zap }
]

export function CodeViewerDevPanel() {
  const devTool = useCodeViewerDevTool()
  const [activeTab, setActiveTab] = useState<TabId>('theme')

  // Don't render in production
  if (!devTool.isDevMode) {
    return null
  }

  return (
    <>
      {/* Floating toggle button */}
      <div className="fixed bottom-4 right-4 z-50">
        <Button
          onClick={devTool.toggle}
          size="sm"
          className="shadow-lg hover:shadow-xl transition-shadow"
          title="Open Dev Tools (Ctrl+Shift+P)"
        >
          <Settings className="w-4 h-4" />
        </Button>
      </div>

      {/* Dev panel modal */}
      <Dialog.Root open={devTool.isOpen} onOpenChange={(open) => open ? devTool.open() : devTool.close()}>
        <Dialog.Portal>
          <Dialog.Overlay className="fixed inset-0 bg-black/50 z-50" />
          <Dialog.Content className="fixed top-0 right-0 h-full w-full max-w-6xl bg-background border-l shadow-lg z-50 flex flex-col">
            
            {/* Header */}
            <div className="flex items-center justify-between p-4 border-b">
              <div className="flex items-center gap-2">
                <Settings className="w-5 h-5" />
                <h2 className="text-lg font-semibold">CodeViewer Dev Tools</h2>
                <Badge variant="secondary" className="text-xs">
                  Development Only
                </Badge>
              </div>
              
              <div className="flex items-center gap-2">
                <Button
                  variant="ghost" 
                  size="sm"
                  onClick={devTool.exportConfig}
                  title="Export Config (Ctrl+E)"
                >
                  <Download className="w-4 h-4" />
                </Button>
                
                <Button
                  variant="ghost"
                  size="sm" 
                  onClick={devTool.reset}
                  title="Reset to Defaults"
                >
                  <RotateCcw className="w-4 h-4" />
                </Button>
                
                <Dialog.Close asChild>
                  <Button variant="ghost" size="sm" title="Close (Esc)">
                    <X className="w-4 h-4" />
                  </Button>
                </Dialog.Close>
              </div>
            </div>

            <div className="flex flex-1 min-h-0">
              {/* Left sidebar - Controls */}
              <div className="w-80 border-r flex flex-col">
                {/* Tabs */}
                <div className="flex border-b">
                  {tabs.map((tab) => {
                    const Icon = tab.icon
                    return (
                      <button
                        key={tab.id}
                        onClick={() => setActiveTab(tab.id)}
                        className={cn(
                          "flex-1 flex items-center justify-center gap-2 py-3 px-2 text-sm font-medium border-r last:border-r-0 transition-colors",
                          activeTab === tab.id
                            ? "bg-primary text-primary-foreground"
                            : "hover:bg-muted"
                        )}
                      >
                        <Icon className="w-4 h-4" />
                        <span className="hidden sm:inline">{tab.label}</span>
                      </button>
                    )
                  })}
                </div>

                {/* Tab content */}
                <ScrollArea className="flex-1 p-4">
                  {activeTab === 'theme' && (
                    <ThemeControls 
                      props={devTool.props}
                      availableThemes={devTool.availableThemes}
                      updateProp={devTool.updateProp}
                    />
                  )}
                  
                  {activeTab === 'language' && (
                    <LanguageControls
                      props={devTool.props}
                      availableLanguages={devTool.availableLanguages}
                      updateProp={devTool.updateProp}
                    />
                  )}
                  
                  {activeTab === 'meta' && (
                    <ComponentMetaControls
                      props={devTool.props}
                      updateProp={devTool.updateProp}
                    />
                  )}
                  
                  {activeTab === 'code' && (
                    <CodeEditor
                      code={devTool.props.sampleCode}
                      language={devTool.props.lang || 'tsx'}
                      onChange={(code) => devTool.updateProp('sampleCode', code)}
                    />
                  )}
                  
                  {activeTab === 'presets' && (
                    <div className="space-y-4">
                      <PresetManager
                        presets={devTool.presets}
                        onLoadPreset={devTool.loadPreset}
                        onSavePreset={devTool.savePreset}
                        onDeletePreset={devTool.deletePreset}
                      />
                      
                      <ImportExportControls
                        onExport={devTool.exportConfig}
                        onImport={devTool.importConfig}
                      />
                    </div>
                  )}
                </ScrollArea>
              </div>

              {/* Right panel - Live preview */}
              <div className="flex-1 flex flex-col">
                <div className="p-3 border-b">
                  <div className="flex items-center gap-2">
                    <Monitor className="w-4 h-4" />
                    <h3 className="font-medium">Live Preview</h3>
                    <Badge variant="outline" className="text-xs">
                      {devTool.props.theme} • {devTool.props.lang}
                    </Badge>
                  </div>
                </div>
                
                <ScrollArea className="flex-1 p-4">
                  <div className="max-w-full">
                    <CodeViewer
                      component={devTool.componentData}
                      theme={devTool.props.theme}
                      defaultDarkTheme={devTool.props.defaultDarkTheme}
                      defaultLightTheme={devTool.props.defaultLightTheme}
                      lang={devTool.props.lang}
                      showLineNumbers={devTool.props.showLineNumbers}
                      className={devTool.props.className}
                    />
                  </div>
                </ScrollArea>
              </div>
            </div>
            
            {/* Footer */}
            <div className="p-3 border-t bg-muted/30 text-xs text-muted-foreground">
              <div className="flex items-center justify-between">
                <div>
                  Shortcuts: <kbd className="px-1 py-0.5 bg-muted rounded">Ctrl+Shift+P</kbd> Toggle • <kbd className="px-1 py-0.5 bg-muted rounded">Ctrl+E</kbd> Export • <kbd className="px-1 py-0.5 bg-muted rounded">Esc</kbd> Close
                </div>
                <div>
                  Dev Tools v1.0.0
                </div>
              </div>
            </div>
            
          </Dialog.Content>
        </Dialog.Portal>
      </Dialog.Root>
    </>
  )
}

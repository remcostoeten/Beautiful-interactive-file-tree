'use client'

import { useState } from 'react'
import { Code, Copy, Check, FileText } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { ScrollArea } from '@/components/ui/scroll-area'
import { toast } from 'sonner'

type TProps = {
  code: string
  completeExample: string
  title?: string
  language?: string
}

export function GeneratedCodeView({ 
  code, 
  completeExample, 
  title = 'Generated JSX',
  language = 'tsx'
}: TProps) {
  const [copiedSimple, setCopiedSimple] = useState(false)
  const [copiedComplete, setCopiedComplete] = useState(false)
  const [viewMode, setViewMode] = useState<'simple' | 'complete'>('simple')

  async function copyToClipboard(text: string, type: 'simple' | 'complete') {
    try {
      await navigator.clipboard.writeText(text)
      
      if (type === 'simple') {
        setCopiedSimple(true)
        setTimeout(() => setCopiedSimple(false), 2000)
      } else {
        setCopiedComplete(true)
        setTimeout(() => setCopiedComplete(false), 2000)
      }
      
      toast.success(`${type === 'simple' ? 'JSX' : 'Complete example'} copied to clipboard!`)
    } catch {
      // Fallback for older browsers
      const textarea = document.createElement('textarea')
      textarea.value = text
      document.body.appendChild(textarea)
      textarea.select()
      document.execCommand('copy')
      document.body.removeChild(textarea)
      
      toast.success('Code copied to clipboard!')
    }
  }

  const currentCode = viewMode === 'simple' ? code : completeExample
  const currentCopied = viewMode === 'simple' ? copiedSimple : copiedComplete

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2">
          <Code className="w-4 h-4" />
          <h4 className="text-sm font-medium">{title}</h4>
          <Badge variant="secondary" className="text-xs">
            Live Preview
          </Badge>
        </div>
        
        <div className="flex items-center gap-2">
          <div className="flex rounded-md border">
            <Button
              variant={viewMode === 'simple' ? 'default' : 'ghost'}
              size="sm"
              onClick={() => setViewMode('simple')}
              className="text-xs px-3 py-1 h-auto border-r rounded-r-none"
            >
              <Code className="w-3 h-3 mr-1" />
              JSX Only
            </Button>
            <Button
              variant={viewMode === 'complete' ? 'default' : 'ghost'}
              size="sm"
              onClick={() => setViewMode('complete')}
              className="text-xs px-3 py-1 h-auto rounded-l-none"
            >
              <FileText className="w-3 h-3 mr-1" />
              Complete
            </Button>
          </div>
          
          <Button
            variant="outline"
            size="sm"
            onClick={() => copyToClipboard(currentCode, viewMode)}
            className="text-xs"
            disabled={currentCopied}
          >
            {currentCopied ? (
              <>
                <Check className="w-3 h-3 mr-1 text-green-500" />
                Copied!
              </>
            ) : (
              <>
                <Copy className="w-3 h-3 mr-1" />
                Copy
              </>
            )}
          </Button>
        </div>
      </div>
      
      <div className="relative border rounded-md overflow-hidden">
        <ScrollArea className="h-80">
          <pre className="p-4 text-sm font-mono bg-muted/30 overflow-x-auto">
            <code className={`language-${language}`}>
              {currentCode}
            </code>
          </pre>
        </ScrollArea>
        
        <div className="absolute top-2 right-2 flex gap-2">
          <Badge variant="outline" className="text-xs bg-background/80 backdrop-blur-sm">
            {language.toUpperCase()}
          </Badge>
          {viewMode === 'complete' && (
            <Badge variant="outline" className="text-xs bg-background/80 backdrop-blur-sm">
              Full Example
            </Badge>
          )}
        </div>
      </div>
      
      <div className="text-xs text-muted-foreground space-y-1">
        <p>
          <strong>{viewMode === 'simple' ? 'JSX Only:' : 'Complete Example:'}</strong>{' '}
          {viewMode === 'simple' 
            ? 'Shows just the component with current props. Perfect for copying into your existing code.'
            : 'Shows a complete working example with imports and component setup. Ready to use as-is.'
          }
        </p>
        <p className="opacity-75">
          Code updates automatically when you change props in the editor.
        </p>
      </div>
    </div>
  )
}

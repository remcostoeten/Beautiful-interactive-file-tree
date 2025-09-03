'use client'

import { useState } from 'react'
import { Button } from '@/components/ui/button'
import { Download, Upload, Check, X, AlertCircle } from 'lucide-react'

type ImportExportControlsProps = {
  onExport: () => void
  onImport: (config: string) => boolean
}

export function ImportExportControls({ onExport, onImport }: ImportExportControlsProps) {
  const [showImportInput, setShowImportInput] = useState(false)
  const [importValue, setImportValue] = useState('')
  const [importStatus, setImportStatus] = useState<'idle' | 'success' | 'error'>('idle')
  const [exportStatus, setExportStatus] = useState<'idle' | 'success'>('idle')

  function handleExport() {
    onExport()
    setExportStatus('success')
    setTimeout(() => setExportStatus('idle'), 2000)
  }

  function handleImport() {
    try {
      const success = onImport(importValue)
      if (success) {
        setImportStatus('success')
        setImportValue('')
        setShowImportInput(false)
        setTimeout(() => setImportStatus('idle'), 2000)
      } else {
        setImportStatus('error')
        setTimeout(() => setImportStatus('idle'), 3000)
      }
    } catch {
      setImportStatus('error')
      setTimeout(() => setImportStatus('idle'), 3000)
    }
  }

  function cancelImport() {
    setShowImportInput(false)
    setImportValue('')
    setImportStatus('idle')
  }

  return (
    <div className="space-y-4">
      <h4 className="text-sm font-medium">Import / Export</h4>
      
      {/* Export */}
      <div className="space-y-2">
        <Button
          variant="outline"
          size="sm"
          onClick={handleExport}
          className="w-full"
          disabled={exportStatus === 'success'}
        >
          {exportStatus === 'success' ? (
            <>
              <Check className="w-4 h-4 mr-2 text-green-600" />
              Copied to Clipboard!
            </>
          ) : (
            <>
              <Download className="w-4 h-4 mr-2" />
              Export Configuration
            </>
          )}
        </Button>
        <p className="text-xs text-muted-foreground">
          Copies current settings and presets to clipboard as JSON
        </p>
      </div>

      {/* Import */}
      <div className="space-y-2">
        {!showImportInput ? (
          <Button
            variant="outline"
            size="sm"
            onClick={() => setShowImportInput(true)}
            className="w-full"
          >
            <Upload className="w-4 h-4 mr-2" />
            Import Configuration
          </Button>
        ) : (
          <div className="space-y-2">
            <textarea
              value={importValue}
              onChange={(e) => setImportValue(e.target.value)}
              placeholder="Paste your configuration JSON here..."
              className="w-full h-24 p-2 text-xs bg-background border border-input rounded-md focus:outline-none focus:ring-2 focus:ring-primary focus:ring-offset-2 resize-none font-mono"
            />
            
            <div className="flex gap-2">
              <Button
                variant="default"
                size="sm"
                onClick={handleImport}
                disabled={!importValue.trim()}
                className="flex-1"
              >
                {importStatus === 'success' ? (
                  <>
                    <Check className="w-4 h-4 mr-1 text-green-600" />
                    Imported!
                  </>
                ) : importStatus === 'error' ? (
                  <>
                    <AlertCircle className="w-4 h-4 mr-1 text-red-600" />
                    Invalid JSON
                  </>
                ) : (
                  'Import'
                )}
              </Button>
              
              <Button
                variant="ghost"
                size="sm"
                onClick={cancelImport}
                className="px-2"
              >
                <X className="w-4 h-4" />
              </Button>
            </div>
          </div>
        )}
        
        <p className="text-xs text-muted-foreground">
          Import previously exported configuration to restore settings
        </p>
      </div>

      {/* Status messages */}
      {importStatus === 'success' && (
        <div className="p-2 bg-green-50 dark:bg-green-950/30 border border-green-200 dark:border-green-800 rounded text-xs text-green-800 dark:text-green-200">
          Configuration imported successfully!
        </div>
      )}
      
      {importStatus === 'error' && (
        <div className="p-2 bg-red-50 dark:bg-red-950/30 border border-red-200 dark:border-red-800 rounded text-xs text-red-800 dark:text-red-200">
          Invalid configuration format. Please check your JSON and try again.
        </div>
      )}
    </div>
  )
}

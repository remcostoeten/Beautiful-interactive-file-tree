'use client'

import { useState } from 'react'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { Bookmark, Plus, Trash2, Play } from 'lucide-react'

type PresetManagerProps = {
  presets: string[]
  onLoadPreset: (name: string) => void
  onSavePreset: (name: string) => void
  onDeletePreset: (name: string) => void
}

export function PresetManager({ 
  presets, 
  onLoadPreset, 
  onSavePreset, 
  onDeletePreset 
}: PresetManagerProps) {
  const [newPresetName, setNewPresetName] = useState('')
  const [showSaveInput, setShowSaveInput] = useState(false)

  function handleSavePreset() {
    if (newPresetName.trim()) {
      onSavePreset(newPresetName.trim())
      setNewPresetName('')
      setShowSaveInput(false)
    }
  }

  function handleDeletePreset(name: string) {
    if (name === 'default') return // Protect default preset
    if (confirm(`Delete preset "${name}"?`)) {
      onDeletePreset(name)
    }
  }

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <h4 className="text-sm font-medium flex items-center gap-2">
          <Bookmark className="w-4 h-4" />
          Presets
        </h4>
        <Button
          variant="outline"
          size="sm"
          onClick={() => setShowSaveInput(!showSaveInput)}
          className="text-xs"
        >
          <Plus className="w-3 h-3 mr-1" />
          Save Current
        </Button>
      </div>

      {showSaveInput && (
        <div className="flex gap-2">
          <input
            type="text"
            value={newPresetName}
            onChange={(e) => setNewPresetName(e.target.value)}
            placeholder="Preset name..."
            className="flex-1 px-2 py-1 text-xs bg-background border border-input rounded focus:outline-none focus:ring-1 focus:ring-primary"
            onKeyDown={(e) => {
              if (e.key === 'Enter') handleSavePreset()
              if (e.key === 'Escape') {
                setShowSaveInput(false)
                setNewPresetName('')
              }
            }}
            autoFocus
          />
          <Button
            variant="default"
            size="sm"
            onClick={handleSavePreset}
            disabled={!newPresetName.trim()}
            className="text-xs px-2 py-1 h-auto"
          >
            Save
          </Button>
        </div>
      )}

      <div className="space-y-2">
        {presets.length === 0 ? (
          <p className="text-xs text-muted-foreground text-center py-4">
            No presets available
          </p>
        ) : (
          presets.map((presetName) => (
            <div
              key={presetName}
              className="flex items-center gap-2 p-2 border rounded hover:bg-muted/50 transition-colors"
            >
              <div className="flex-1 min-w-0">
                <div className="flex items-center gap-2">
                  <span className="text-sm font-medium truncate">
                    {presetName}
                  </span>
                  {presetName === 'default' && (
                    <Badge variant="secondary" className="text-xs">
                      Default
                    </Badge>
                  )}
                </div>
              </div>
              
              <div className="flex gap-1">
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={() => onLoadPreset(presetName)}
                  className="h-6 w-6 p-0"
                  title="Load preset"
                >
                  <Play className="w-3 h-3" />
                </Button>
                
                {presetName !== 'default' && (
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={() => handleDeletePreset(presetName)}
                    className="h-6 w-6 p-0 text-destructive hover:text-destructive"
                    title="Delete preset"
                  >
                    <Trash2 className="w-3 h-3" />
                  </Button>
                )}
              </div>
            </div>
          ))
        )}
      </div>

      <div className="text-xs text-muted-foreground">
        <p>Presets save all current settings including theme, language, and code content.</p>
      </div>
    </div>
  )
}

'use client'

import { useCallback, useEffect, useState, useMemo } from 'react'
import { generateCodeViewerJSX, generateCompleteExample } from '@/lib/generate-code'

export type CodeViewerDevProps = {
  // Theme props
  theme?: "dark" | "light"
  defaultDarkTheme?: string
  defaultLightTheme?: string
  
  // Language & display
  lang?: string
  showLineNumbers?: boolean
  
  // Component meta
  componentName: string
  componentVersion: string
  
  // Tree UI
  enableHoverHighlight?: boolean
  
  // Content
  sampleCode: string
  
  // Advanced options
  className?: string
}

const DEFAULT_PROPS: CodeViewerDevProps = {
  theme: "dark",
  defaultDarkTheme: "one-dark-pro",
  defaultLightTheme: "github-light",
  lang: "tsx",
  showLineNumbers: true,
  componentName: "file-viewer",
  componentVersion: "1.0.0",
  enableHoverHighlight: true,
  sampleCode: `<CodeViewer
  component={componentData}
  theme="dark"
  defaultDarkTheme="one-dark-pro"
  defaultLightTheme="github-light"
  lang="tsx"
  showLineNumbers={true}
  className="max-w-4xl"
/>`,
  className: ""
}

const AVAILABLE_THEMES = [
  "github-dark",
  "github-light",
  "one-dark-pro", 
  "material-theme-darker",
  "material-theme-lighter",
  "nord",
  "dracula",
  "monokai",
  "solarized-dark",
  "solarized-light",
  "vs-dark",
  "vs-light"
]

const AVAILABLE_LANGUAGES = [
  "tsx",
  "typescript", 
  "javascript",
  "jsx",
  "json",
  "css",
  "scss",
  "html",
  "markdown",
  "python",
  "rust",
  "go",
  "java",
  "php",
  "sql",
  "yaml",
  "xml"
]

type DevToolState = {
  isOpen: boolean
  props: CodeViewerDevProps
  presets: Record<string, CodeViewerDevProps>
}

const STORAGE_KEY = 'code-viewer-dev-tool'

function loadFromStorage(): Partial<DevToolState> {
  if (typeof window === 'undefined') return {}
  
  try {
    const stored = localStorage.getItem(STORAGE_KEY)
    return stored ? JSON.parse(stored) : {}
  } catch {
    return {}
  }
}

function saveToStorage(state: Partial<DevToolState>) {
  if (typeof window === 'undefined') return
  
  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(state))
  } catch {
    // Silent fail
  }
}

export function useCodeViewerDevTool() {
  const [state, setState] = useState<DevToolState>(() => {
    const stored = loadFromStorage()
    return {
      isOpen: false,
      props: { ...DEFAULT_PROPS, ...stored.props },
      presets: {
        default: DEFAULT_PROPS,
        'dark-typescript': {
          ...DEFAULT_PROPS,
          theme: 'dark',
          defaultDarkTheme: 'one-dark-pro',
          lang: 'typescript',
          sampleCode: `interface User {
  id: string
  name: string
  email: string
  createdAt: Date
}

class UserService {
  private users: User[] = []
  
  async createUser(userData: Omit<User, 'id' | 'createdAt'>): Promise<User> {
    const user: User = {
      id: crypto.randomUUID(),
      createdAt: new Date(),
      ...userData
    }
    
    this.users.push(user)
    return user
  }
  
  findUserById(id: string): User | undefined {
    return this.users.find(user => user.id === id)
  }
}`
        },
        'light-json': {
          ...DEFAULT_PROPS,
          theme: 'light',
          defaultLightTheme: 'github-light',
          lang: 'json',
          sampleCode: `{
  "name": "beautiful-file-tree-v2",
  "version": "1.0.0",
  "description": "A beautiful file viewer component",
  "scripts": {
    "dev": "next dev",
    "build": "next build",
    "start": "next start"
  },
  "dependencies": {
    "react": "^19.0.0",
    "next": "^15.0.0",
    "tailwindcss": "^3.0.0"
  },
  "author": "Remco Stoeten",
  "license": "MIT"
}`
        },
        ...stored.presets
      }
    }
  })

  // Save to localStorage whenever state changes
  useEffect(() => {
    saveToStorage({ props: state.props, presets: state.presets })
  }, [state.props, state.presets])

  // Keyboard shortcuts
  useEffect(() => {
    function handleKeydown(e: KeyboardEvent) {
      // Ctrl+Shift+P to toggle dev tool
      if (e.ctrlKey && e.shiftKey && e.code === 'KeyP') {
        e.preventDefault()
        toggle()
      }
      
      // Ctrl+E to export (when dev tool is open)
      if (state.isOpen && e.ctrlKey && e.code === 'KeyE') {
        e.preventDefault()
        exportConfig()
      }
      
      // Escape to close
      if (state.isOpen && e.code === 'Escape') {
        e.preventDefault()
        close()
      }
    }

    window.addEventListener('keydown', handleKeydown)
    return () => window.removeEventListener('keydown', handleKeydown)
  }, [state.isOpen])

  const updateProp = useCallback(<K extends keyof CodeViewerDevProps>(
    key: K, 
    value: CodeViewerDevProps[K]
  ) => {
    setState(prev => ({
      ...prev,
      props: { ...prev.props, [key]: value }
    }))
  }, [])

  const updateProps = useCallback((newProps: Partial<CodeViewerDevProps>) => {
    setState(prev => ({
      ...prev,
      props: { ...prev.props, ...newProps }
    }))
  }, [])

  const reset = useCallback(() => {
    setState(prev => ({
      ...prev,
      props: { ...DEFAULT_PROPS }
    }))
  }, [])

  const loadPreset = useCallback((presetName: string) => {
    const preset = state.presets[presetName]
    if (preset) {
      setState(prev => ({
        ...prev,
        props: { ...preset }
      }))
    }
  }, [state.presets])

  const savePreset = useCallback((name: string, props?: CodeViewerDevProps) => {
    setState(prev => ({
      ...prev,
      presets: {
        ...prev.presets,
        [name]: props || prev.props
      }
    }))
  }, [])

  const deletePreset = useCallback((name: string) => {
    setState(prev => ({
      ...prev,
      presets: Object.fromEntries(
        Object.entries(prev.presets).filter(([key]) => key !== name)
      )
    }))
  }, [])

  const exportConfig = useCallback(() => {
    const config = {
      props: state.props,
      presets: state.presets,
      timestamp: new Date().toISOString()
    }
    
    const jsonString = JSON.stringify(config, null, 2)
    
    if (navigator.clipboard) {
      navigator.clipboard.writeText(jsonString)
    } else {
      // Fallback for older browsers
      const textarea = document.createElement('textarea')
      textarea.value = jsonString
      document.body.appendChild(textarea)
      textarea.select()
      document.execCommand('copy')
      document.body.removeChild(textarea)
    }
  }, [state.props, state.presets])

  const importConfig = useCallback((configJson: string) => {
    try {
      const config = JSON.parse(configJson)
      
      if (config.props) {
        setState(prev => ({
          ...prev,
          props: { ...DEFAULT_PROPS, ...config.props }
        }))
      }
      
      if (config.presets) {
        setState(prev => ({
          ...prev,
          presets: { ...prev.presets, ...config.presets }
        }))
      }
      
      return true
    } catch {
      return false
    }
  }, [])

  const open = useCallback(() => {
    setState(prev => ({ ...prev, isOpen: true }))
  }, [])

  const close = useCallback(() => {
    setState(prev => ({ ...prev, isOpen: false }))
  }, [])

  const toggle = useCallback(() => {
    setState(prev => ({ ...prev, isOpen: !prev.isOpen }))
  }, [])

  // Generate component data for CodeViewer
  const componentData = {
    name: state.props.componentName,
    version: state.props.componentVersion,
    showIndentLines: true,
    enableHoverHighlight: state.props.enableHoverHighlight,
    files: [
      {
        path: `src/example.${state.props.lang === 'tsx' ? 'tsx' : state.props.lang === 'typescript' ? 'ts' : state.props.lang === 'javascript' ? 'js' : state.props.lang}`,
        content: state.props.sampleCode
      }
    ]
  }

  // Generate live code - memoized for performance
  const generatedCode = useMemo(() => {
    return generateCodeViewerJSX(state.props, { format: 'pretty' })
  }, [state.props])

  const generatedCompleteExample = useMemo(() => {
    return generateCompleteExample(state.props, { format: 'pretty' })
  }, [state.props])

  return {
    // State
    isOpen: state.isOpen,
    props: state.props,
    presets: Object.keys(state.presets),
    componentData,
    
    // Generated code
    generatedCode,
    generatedCompleteExample,
    
    // Available options
    availableThemes: AVAILABLE_THEMES,
    availableLanguages: AVAILABLE_LANGUAGES,
    
    // Actions
    updateProp,
    updateProps,
    reset,
    loadPreset,
    savePreset,
    deletePreset,
    exportConfig,
    importConfig,
    open,
    close,
    toggle,
    
    // Only show in development
    isDevMode: process.env.NODE_ENV === 'development'
  }
}

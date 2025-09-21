'use client'

import { Eye } from 'lucide-react'
import { ThemeProvider } from 'next-themes'
import { Toaster } from 'sonner'

import CodeViewer from '@/components/file-viewer'
import { CodeViewerDevPanel } from '@/components/dev-tools/code-viewer-dev-panel'
import { data } from '@/data'

function App() {
  return (
    <ThemeProvider
      attribute='class'
      defaultTheme='system'
      enableSystem
      disableTransitionOnChange
    >
      <div className='min-h-screen bg-background text-foreground font-inter'>
        <div className='max-w-[880px] mx-auto p-6'>
          <div className='mb-8'>
            <h1 className='text-2xl font-semibold mb-3 text-foreground'>
              Beautiful File Tree v2
            </h1>
            <p className='text-md mb-4 text-muted-foreground max-w-2xl text-pretty leading-relaxed'>
              Created by <span className='font-medium text-foreground'>Remco Stoeten</span>
            </p>
            <p className='text-sm text-muted-foreground max-w-2xl text-pretty leading-relaxed'>
              A powerful file viewer component featuring multi-language syntax highlighting with Shiki, 
              collapsible tree navigation with expand/collapse animations, live markdown preview with 
              syntax-highlighted code blocks, resizable snap-to-close panels with localStorage persistence, 
              one-click copy functionality with toast notifications, theme-aware rendering, 
              and view transitions for smooth file switching. Built with React, TypeScript, and modern web APIs.
            </p>
            <div className='flex items-center gap-2 mt-3 text-xs text-muted-foreground'>
              <Eye className='h-3 w-3' />
              <span>Tip: Click the eye icon on .md files to toggle markdown preview</span>
            </div>
          </div>

          <div className='max-w-7xl mx-auto'>
            <CodeViewer 
              theme="dark"
              component={data}
              className="max-h-[600px]"
            />
          </div>
        </div>
      </div>
      
      {/* Dev Tools - Only shows in development */}
      <CodeViewerDevPanel />
      
      <Toaster />
    </ThemeProvider>
  )
}

export default App

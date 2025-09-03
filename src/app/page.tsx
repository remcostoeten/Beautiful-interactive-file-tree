'use client'

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
        <div className='container mx-auto p-6'>
          <p className='text-md mb-8 text-muted-foreground max-w-2xl text-pretty leading-relaxed'>
            A beautiful file viewer component with syntax
            highlighting, tree navigation, and copy
            functionality. Built with React, TypeScript, and
            Shiki.
          </p>

          <div className='max-w-7xl mx-auto'>
            <CodeViewer 
              theme="dark"
              component={data}
              enableThemePicker={true}
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

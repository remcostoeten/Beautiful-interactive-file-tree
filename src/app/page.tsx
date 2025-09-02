'use client'

import { ThemeProvider } from 'next-themes'
import { Toaster } from 'sonner'

import ComponentFileViewer from '@/components/file-viewer'
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
            <ComponentFileViewer component={data} />
          </div>
        </div>
      </div>
      <Toaster />
    </ThemeProvider>
  )
}

export default App

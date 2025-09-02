'use client'

import { Analytics } from '@vercel/analytics/react'
import { SpeedInsights } from '@vercel/speed-insights/next'
import { ThemeProvider } from 'next-themes'

type TProps = {
    children: React.ReactNode
}

export function Providers({ children }: TProps) {
    return (
        <ThemeProvider
            attribute='class'
            defaultTheme='system'
            enableSystem
            disableTransitionOnChange
        >
            {children}
            <Analytics />
            <SpeedInsights />
        </ThemeProvider>
    )
}

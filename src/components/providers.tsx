'use client'

import { Analytics } from '@vercel/analytics/react'
import { SpeedInsights } from '@vercel/speed-insights/next'

type TProps = {
    children: React.ReactNode
}

export function Providers({ children }: TProps) {
    return (
        <>
            {children}
            <Analytics />
            <SpeedInsights />
        </>
    )
}

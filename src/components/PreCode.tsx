'use client'

import { useEffect, useState } from 'react'

type PreCodeProps = {
	children: React.ReactNode
}

export default function PreCode({ children }: PreCodeProps) {
	const [animationClass, setAnimationClass] = useState('')

	useEffect(() => {
		const speed = Math.random() < 0.5 ? 'slow' : 'fast'
		const width = Math.random() < 0.5 ? 'wide' : 'narrow'
		setAnimationClass(`animate-swirl-${speed} animate-swirl-${width}`)
	}, [])

	return (
		<code
			className={`text-sm rounded-lg p-1 bg-black/95 inline-block border border-white/20 font-mono shadow-md shadow-zinc-900/30 drop-shadow-md drop-shadow-zinc-900/50 bg-gradient-to-r from-transparent via-zinc-900/50 to-transparent animate-swirl-left-to-right ${animationClass}`}
		>
			{children}
		</code>
	)
}

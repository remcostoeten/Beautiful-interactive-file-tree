'use client'

import { cn } from '@/lib/utils'
import { Expand, Minimize2 } from 'lucide-react'
import { useState } from 'react'

type IDEContainerProps = {
	children: React.ReactNode
	className?: string
}

export default function IDEContainer({
	children,
	className
}: IDEContainerProps) {
	const [isExpanded, setIsExpanded] = useState(false)

	return (
		<div
			className={cn(
				'relative transition-all duration-300',
				isExpanded
					? 'w-screen ml-[calc(-50vw+50%)] mr-[calc(-50vw+50%)]'
					: 'w-full',
				className
			)}
		>
			<button
				onClick={() => setIsExpanded(!isExpanded)}
				className="absolute top-2 right-2 z-10 p-1.5 rounded-md bg-black/50 text-zinc-400 hover:text-white transition-colors border border-white/10"
			>
				{isExpanded ? (
					<Minimize2 className="w-4 h-4" />
				) : (
					<Expand className="w-4 h-4" />
				)}
			</button>
			{children}
		</div>
	)
}

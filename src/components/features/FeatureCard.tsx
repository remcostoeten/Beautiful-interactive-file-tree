'use client'

import { ArrowRight } from 'lucide-react'
import { useRef, useState } from 'react'
import { Card } from '../../../@/components/ui/card'

type FeatureCardProps = {
	feature: {
		icon: React.ReactNode
		title: string
		description: string
	}
	index: number
}

export default function FeatureCard({ feature, index }: FeatureCardProps) {
	const [mousePosition, setMousePosition] = useState({ x: 0, y: 0 })
	const cardRef = useRef<HTMLDivElement>(null)

	const handleMouseMove = (e: React.MouseEvent<HTMLDivElement>) => {
		if (cardRef.current) {
			const rect = cardRef.current.getBoundingClientRect()
			setMousePosition({
				x: e.clientX - rect.left,
				y: e.clientY - rect.top
			})
		}
	}

	return (
		<Card
			ref={cardRef}
			onMouseMove={handleMouseMove}
			className="stagger-scale relative group rounded-lg border border-white/10 bg-black/20 p-6 hover:bg-white/5 transition-colors overflow-hidden"
		>
			<div className="relative z-10">
				<div className="flex items-center gap-3 mb-3">
					<div className="p-2 rounded-lg bg-violet-500/10 text-violet-400">
						{feature.icon}
					</div>
					<h3 className="text-lg font-semibold text-white">
						{feature.title}
					</h3>
				</div>
				<p className="text-sm text-zinc-400">{feature.description}</p>
				<div className="mt-4 flex items-center text-sm text-violet-400 font-medium">
					Learn more
					<ArrowRight className="w-4 h-4 ml-1 transition-transform group-hover:translate-x-1" />
				</div>
			</div>
			<div
				className="absolute inset-0 z-0 opacity-0 group-hover:opacity-100 transition-opacity duration-300"
				style={{
					background: `radial-gradient(circle at ${mousePosition.x}px ${mousePosition.y}px, rgba(124, 58, 237, 0.2) 0%, transparent 70%)`
				}}
			/>
		</Card>
	)
}

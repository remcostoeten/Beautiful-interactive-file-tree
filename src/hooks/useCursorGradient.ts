'use client'

import { useEffect, useState } from 'react'

export default function useCursorGradient() {
	const [position, setPosition] = useState({ x: 0, y: 0 })
	const [opacity, setOpacity] = useState(0)

	useEffect(() => {
		const handleMouseMove = (e: MouseEvent) => {
			setPosition({ x: e.clientX, y: e.clientY })
			setOpacity(1)
		}

		const handleMouseLeave = () => {
			setOpacity(0)
		}

		window.addEventListener('mousemove', handleMouseMove)
		window.addEventListener('mouseleave', handleMouseLeave)

		return () => {
			window.removeEventListener('mousemove', handleMouseMove)
			window.removeEventListener('mouseleave', handleMouseLeave)
		}
	}, [])

	return { position, opacity }
}

'use client'

import { useCallback, useEffect, useRef } from 'react'

export function useDebouncedCallback<T extends (...args: any[]) => any>(
	callback: T,
	delay: number
): T {
	const timeoutRef = useRef<NodeJS.Timeout | null>(null)
	const callbackRef = useRef(callback)

	// Update callback ref when callback changes
	useEffect(() => {
		callbackRef.current = callback
	}, [callback])

	return useCallback(
		((...args) => {
			if (timeoutRef.current) {
				clearTimeout(timeoutRef.current)
			}

			timeoutRef.current = setTimeout(() => {
				callbackRef.current(...args)
			}, delay)
		}) as T,
		[delay]
	)
}

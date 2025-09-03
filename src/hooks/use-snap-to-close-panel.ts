import { useCallback, useEffect, useRef, useState } from 'react'

type TPanelState = {
    size: number
    isCollapsed: boolean
    isAnimating: boolean
}

type TUseSnapToClosePanel = {
    storageKey: string
    defaultSize: number
    minSize?: number
    snapThreshold?: number
    animationDuration?: number
}

type TReturnType = {
    panelState: TPanelState
    handleResize: (sizes: number[]) => void
    toggleCollapse: () => void
    expand: () => void
    collapse: () => void
}

export function useSnapToClosePanel({
    storageKey,
    defaultSize,
    minSize = 100,
    snapThreshold = 120,
    animationDuration = 300
}: TUseSnapToClosePanel): TReturnType {
    const [panelState, setPanelState] = useState<TPanelState>({
        size: defaultSize,
        isCollapsed: false,
        isAnimating: false
    })
    
    const [isInitialized, setIsInitialized] = useState(false)
    const animationTimeoutRef = useRef<NodeJS.Timeout>(null)
    const lastValidSizeRef = useRef(defaultSize)

    useEffect(() => {
        try {
            const stored = localStorage.getItem(storageKey)
            if (stored) {
                const parsedState = JSON.parse(stored) as Partial<TPanelState>
                if (
                    typeof parsedState.size === 'number' &&
                    typeof parsedState.isCollapsed === 'boolean' &&
                    parsedState.size >= 0 &&
                    parsedState.size <= 100
                ) {
                    setPanelState(prev => ({
                        ...prev,
                        size: parsedState.size!,
                        isCollapsed: parsedState.isCollapsed!
                    }))
                    if (!parsedState.isCollapsed && parsedState.size >= minSize) {
                        lastValidSizeRef.current = parsedState.size
                    }
                }
            }
        } catch (error) {
            console.warn('Failed to load panel state from localStorage:', error)
        }
        setIsInitialized(true)
    }, [storageKey, minSize])

    const saveState = useCallback((state: TPanelState) => {
        try {
            localStorage.setItem(storageKey, JSON.stringify({
                size: state.size,
                isCollapsed: state.isCollapsed
            }))
        } catch (error) {
            console.warn('Failed to save panel state to localStorage:', error)
        }
    }, [storageKey])

    const handleResize = useCallback((panelSizes: number[]) => {
        if (panelSizes.length === 0 || panelState.isAnimating) return

        const newSize = panelSizes[0]
        
        // Clear any existing timeout
        if (animationTimeoutRef.current) {
            clearTimeout(animationTimeoutRef.current)
        }

        // If size is below snap threshold, trigger collapse animation
        if (newSize <= snapThreshold && !panelState.isCollapsed) {
            setPanelState(prev => {
                const newState = {
                    ...prev,
                    size: 0,
                    isCollapsed: true,
                    isAnimating: true
                }
                saveState(newState)
                return newState
            })

            // End animation after duration
            animationTimeoutRef.current = setTimeout(() => {
                setPanelState(prev => ({ ...prev, isAnimating: false }))
            }, animationDuration)
        }
        // If expanding from collapsed state
        else if (newSize > snapThreshold && panelState.isCollapsed) {
            const targetSize = Math.max(lastValidSizeRef.current, minSize)
            
            setPanelState(prev => {
                const newState = {
                    ...prev,
                    size: targetSize,
                    isCollapsed: false,
                    isAnimating: true
                }
                saveState(newState)
                return newState
            })

            // End animation after duration
            animationTimeoutRef.current = setTimeout(() => {
                setPanelState(prev => ({ ...prev, isAnimating: false }))
            }, animationDuration)
        }
        // Normal resize within valid range
        else if (!panelState.isCollapsed && newSize >= minSize) {
            lastValidSizeRef.current = newSize
            setPanelState(prev => {
                const newState = { ...prev, size: newSize }
                saveState(newState)
                return newState
            })
        }
    }, [panelState.isCollapsed, panelState.isAnimating, snapThreshold, minSize, animationDuration, saveState])

    const toggleCollapse = useCallback(() => {
        if (panelState.isAnimating) return

        if (panelState.isCollapsed) {
            const targetSize = Math.max(lastValidSizeRef.current, minSize)
            setPanelState(prev => {
                const newState = {
                    ...prev,
                    size: targetSize,
                    isCollapsed: false,
                    isAnimating: true
                }
                saveState(newState)
                return newState
            })
        } else {
            lastValidSizeRef.current = panelState.size
            setPanelState(prev => {
                const newState = {
                    ...prev,
                    size: 0,
                    isCollapsed: true,
                    isAnimating: true
                }
                saveState(newState)
                return newState
            })
        }

        // End animation after duration
        if (animationTimeoutRef.current) {
            clearTimeout(animationTimeoutRef.current)
        }
        animationTimeoutRef.current = setTimeout(() => {
            setPanelState(prev => ({ ...prev, isAnimating: false }))
        }, animationDuration)
    }, [panelState.isCollapsed, panelState.isAnimating, panelState.size, minSize, animationDuration, saveState])

    const expand = useCallback(() => {
        if (!panelState.isCollapsed || panelState.isAnimating) return
        toggleCollapse()
    }, [panelState.isCollapsed, panelState.isAnimating, toggleCollapse])

    const collapse = useCallback(() => {
        if (panelState.isCollapsed || panelState.isAnimating) return
        toggleCollapse()
    }, [panelState.isCollapsed, panelState.isAnimating, toggleCollapse])

    // Cleanup timeout on unmount
    useEffect(() => {
        return () => {
            if (animationTimeoutRef.current) {
                clearTimeout(animationTimeoutRef.current)
            }
        }
    }, [])

    return {
        panelState: isInitialized ? panelState : { 
            size: defaultSize, 
            isCollapsed: false, 
            isAnimating: false 
        },
        handleResize,
        toggleCollapse,
        expand,
        collapse
    }
}

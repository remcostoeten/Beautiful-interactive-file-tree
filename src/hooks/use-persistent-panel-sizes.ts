import { useCallback, useEffect, useState } from 'react'

type TPanelSizes = {
    leftPanel: number
    rightPanel: number
}

type TUsePersistentPanelSizes = {
    storageKey: string
    defaultSizes: TPanelSizes
}

type TReturnType = {
    sizes: TPanelSizes
    setSizes: (sizes: TPanelSizes) => void
    handleResize: (sizes: number[]) => void
}

export function usePersistentPanelSizes({
    storageKey,
    defaultSizes
}: TUsePersistentPanelSizes): TReturnType {
    const [sizes, setSizesState] = useState<TPanelSizes>(defaultSizes)
    const [isInitialized, setIsInitialized] = useState(false)

    // Load sizes from storage synchronously on mount
    useEffect(() => {
        try {
            const stored = localStorage.getItem(storageKey)
            if (stored) {
                const parsedSizes = JSON.parse(stored) as TPanelSizes
                // Validate the stored sizes
                if (
                    typeof parsedSizes.leftPanel === 'number' &&
                    typeof parsedSizes.rightPanel === 'number' &&
                    parsedSizes.leftPanel > 0 &&
                    parsedSizes.rightPanel > 0 &&
                    parsedSizes.leftPanel + parsedSizes.rightPanel <= 100
                ) {
                    setSizesState(parsedSizes)
                }
            }
        } catch (error) {
            console.warn('Failed to load panel sizes from localStorage:', error)
        }
        setIsInitialized(true)
    }, [storageKey])

    const setSizes = useCallback(
        (newSizes: TPanelSizes) => {
            setSizesState(newSizes)
            try {
                localStorage.setItem(storageKey, JSON.stringify(newSizes))
            } catch (error) {
                console.warn(
                    'Failed to save panel sizes to localStorage:',
                    error
                )
            }
        },
        [storageKey]
    )

    // Throttled resize handler to prevent excessive storage writes
    const handleResize = useCallback(
        (panelSizes: number[]) => {
            if (panelSizes.length >= 2) {
                const newSizes: TPanelSizes = {
                    leftPanel: panelSizes[0],
                    rightPanel: panelSizes[1]
                }
                setSizes(newSizes)
            }
        },
        [setSizes]
    )

    return {
        sizes: isInitialized ? sizes : defaultSizes,
        setSizes,
        handleResize
    }
}

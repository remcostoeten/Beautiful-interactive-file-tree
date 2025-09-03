"use client"

import * as React from "react"
import { GripVerticalIcon, ChevronLeft, ChevronRight } from "lucide-react"
import * as ResizablePrimitive from "react-resizable-panels"

import { cn } from "@/lib/utils"
import { useSnapToClosePanel } from "@/hooks/use-snap-to-close-panel"

type TSnapToCloseResizablePanelGroupProps = React.ComponentProps<typeof ResizablePrimitive.PanelGroup> & {
  onPanelResize?: (sizes: number[]) => void
  maxSize?: number
}

function SnapToCloseResizablePanelGroup({
  className,
  onPanelResize,
  maxSize,
  ...props
}: TSnapToCloseResizablePanelGroupProps) {
  return (
    <ResizablePrimitive.PanelGroup
      data-slot="snap-resizable-panel-group"
      className={cn(
        "flex h-full w-full data-[panel-group-direction=vertical]:flex-col",
        className
      )}
      onLayout={onPanelResize}
      {...props}
    />
  )
}

type TSnapToCloseResizablePanelProps = React.ComponentProps<typeof ResizablePrimitive.Panel> & {
  storageKey?: string
  enableSnapToClose?: boolean
  minSizePixels?: number
  maxSizePixels?: number
  snapThreshold?: number
  animationDuration?: number
  isCollapsible?: boolean
  maxSize?: number // Maximum size as percentage
}

function SnapToCloseResizablePanel({
  className,
  storageKey,
  enableSnapToClose = true,
  minSizePixels = 35,
  maxSizePixels = 35,
  snapThreshold = 35,
  animationDuration = 300,
  isCollapsible = false,
  maxSize,
  children,
  ...props
}: TSnapToCloseResizablePanelProps) {
  const snapToCloseHook = useSnapToClosePanel({
    storageKey: storageKey || 'default-panel',
    defaultSize: props.defaultSize || 25,
    minSize: minSizePixels,
    snapThreshold: snapThreshold,
    animationDuration
  })

  // Determine if we should use the hook based on props
  const shouldUseSnapToClose = enableSnapToClose && storageKey

  // CSS custom properties for smooth animations
  const panelStyle = React.useMemo(() => {
    if (!snapToCloseHook) return undefined

    const { panelState } = snapToCloseHook

    return {
      '--panel-animation-duration': `${animationDuration}ms`,
      '--panel-animation-timing': 'cubic-bezier(0.4, 0, 0.2, 1)',
      transition: panelState.isAnimating
        ? 'width var(--panel-animation-duration) var(--panel-animation-timing), opacity var(--panel-animation-duration) var(--panel-animation-timing)'
        : undefined,
      opacity: panelState.isCollapsed ? 0 : 1,
      overflow: panelState.isAnimating ? 'hidden' : undefined
    } as React.CSSProperties
  }, [snapToCloseHook, animationDuration])

  // Handle collapsible panel content
  const panelContent = React.useMemo(() => {
    if (!snapToCloseHook) return children

    const { panelState } = snapToCloseHook

    if (panelState.isCollapsed) {
      return (
        <div className="h-full w-full flex items-center justify-center opacity-0">
          <div className="text-xs text-muted-foreground">Panel collapsed</div>
        </div>
      )
    }

    return children
  }, [snapToCloseHook, children])

  return (
    <ResizablePrimitive.Panel
      data-slot="snap-resizable-panel"
      className={cn(
        "relative",
        snapToCloseHook?.panelState.isCollapsed && "!flex-shrink-0",
        className
      )}
      style={panelStyle}
      maxSize={maxSize} // Apply maxSize constraint
      {...props}
    >
      {panelContent}
    </ResizablePrimitive.Panel>
  )
}

type TSnapToCloseResizableHandleProps = React.ComponentProps<typeof ResizablePrimitive.PanelResizeHandle> & {
  withHandle?: boolean
  snapToCloseHook?: ReturnType<typeof useSnapToClosePanel>
  showToggleButton?: boolean
}

function SnapToCloseResizableHandle({
  withHandle,
  snapToCloseHook,
  showToggleButton = false,
  className,
  ...props
}: TSnapToCloseResizableHandleProps) {
  const handleDoubleClick = React.useCallback(() => {
    if (snapToCloseHook && showToggleButton) {
      snapToCloseHook.toggleCollapse()
    }
  }, [snapToCloseHook, showToggleButton])

  return (
    <ResizablePrimitive.PanelResizeHandle
      data-slot="snap-resizable-handle"
      className={cn(
        "bg-border focus-visible:ring-ring relative flex w-px items-center justify-center after:absolute after:inset-y-0 after:left-1/2 after:w-1 after:-translate-x-1/2 focus-visible:ring-1 focus-visible:ring-offset-1 focus-visible:outline-hidden data-[panel-group-direction=vertical]:h-px data-[panel-group-direction=vertical]:w-full data-[panel-group-direction=vertical]:after:left-0 data-[panel-group-direction=vertical]:after:h-1 data-[panel-group-direction=vertical]:after:w-full data-[panel-group-direction=vertical]:after:translate-x-0 data-[panel-group-direction=vertical]:after:-translate-y-1/2 [&[data-panel-group-direction=vertical]>div]:rotate-90",
        showToggleButton && "hover:bg-accent cursor-pointer",
        className
      )}
      onDoubleClick={handleDoubleClick}
      {...props}
    >
      <div className="flex items-center justify-center gap-1">
        {withHandle && (
          <div className="bg-border z-10 flex h-4 w-3 items-center justify-center rounded-xs border">
            <GripVerticalIcon className="size-2.5" />
          </div>
        )}
        {showToggleButton && snapToCloseHook && (
          <div
            className="bg-muted hover:bg-accent z-10 flex h-6 w-6 items-center justify-center rounded-xs border opacity-0 hover:opacity-100 transition-opacity"
            onClick={(e) => {
              e.preventDefault()
              e.stopPropagation()
              snapToCloseHook.toggleCollapse()
            }}
          >
            {snapToCloseHook.panelState.isCollapsed ? (
              <ChevronRight className="size-3" />
            ) : (
              <ChevronLeft className="size-3" />
            )}
          </div>
        )}
      </div>
    </ResizablePrimitive.PanelResizeHandle>
  )
}

export {
  SnapToCloseResizablePanelGroup,
  SnapToCloseResizablePanel,
  SnapToCloseResizableHandle,
  useSnapToClosePanel
}

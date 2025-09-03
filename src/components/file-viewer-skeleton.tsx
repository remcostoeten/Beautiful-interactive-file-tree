import {
  ResizableHandle,
  ResizablePanel,
  ResizablePanelGroup,
} from "@/components/ui/resizable";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Skeleton } from "@/components/ui/skeleton";
import { cn } from "@/lib/utils";

type TProps = {
  className?: string;
};

export function FileViewerSkeleton({ className }: TProps) {
  return (
    <div className="skeleton-container font-inter">
      <ResizablePanelGroup
        direction="horizontal"
        className={cn("min-h-[600px] rounded-lg border overflow-hidden", className)}
      >
        {/* Left Panel - File Tree Skeleton */}
        <ResizablePanel defaultSize={25} minSize={20} maxSize={40}>
          <div className="w-full h-full border-r">
            {/* File Tree Header */}
            <div className="p-3 border-b flex items-center gap-2 text-left file-header">
              <Skeleton className="h-4 w-4 rounded-sm" />
              <Skeleton className="h-4 w-32" />
            </div>

          {/* File Tree Content */}
          <ScrollArea className="h-96 lg:h-[calc(100vh-300px)]">
            <div className="p-2">
              <div className="flex flex-col gap-1">
                {/* Root level folder */}
                <div className="flex w-full items-center gap-2 rounded-md px-2 py-1.5 text-sm tree-item">
                  <Skeleton className="h-4 w-4 rounded-sm" />
                  <Skeleton className="h-4 w-20" />
                </div>

                {/* Indented items */}
                <div className="ml-5 flex flex-col gap-1">
                  <div className="flex w-full items-center gap-2 rounded-md px-2 py-1.5 text-sm tree-item">
                    <Skeleton className="h-4 w-4 rounded-sm" />
                    <Skeleton className="h-4 w-24" />
                  </div>
                  <div className="flex w-full items-center gap-2 rounded-md px-2 py-1.5 text-sm tree-item">
                    <Skeleton className="h-4 w-4 rounded-sm" />
                    <Skeleton className="h-4 w-16" />
                  </div>
                  <div className="flex w-full items-center gap-2 rounded-md px-2 py-1.5 text-sm tree-item">
                    <Skeleton className="h-4 w-4 rounded-sm" />
                    <Skeleton className="h-4 w-28" />
                  </div>
                </div>

                {/* Another folder */}
                <div className="flex w-full items-center gap-2 rounded-md px-2 py-1.5 text-sm tree-item">
                  <Skeleton className="h-4 w-4 rounded-sm" />
                  <Skeleton className="h-4 w-18" />
                </div>

                {/* More nested items */}
                <div className="ml-5 flex flex-col gap-1">
                  <div className="flex w-full items-center gap-2 rounded-md px-2 py-1.5 text-sm tree-item">
                    <Skeleton className="h-4 w-4 rounded-sm" />
                    <Skeleton className="h-4 w-20" />
                  </div>
                  <div className="flex w-full items-center gap-2 rounded-md px-2 py-1.5 text-sm tree-item">
                    <Skeleton className="h-4 w-4 rounded-sm" />
                    <Skeleton className="h-4 w-14" />
                  </div>
                </div>

                {/* Additional items */}
                <div className="flex w-full items-center gap-2 rounded-md px-2 py-1.5 text-sm tree-item">
                  <Skeleton className="h-4 w-4 rounded-sm" />
                  <Skeleton className="h-4 w-22" />
                </div>
              </div>
            </div>
          </ScrollArea>
        </div>
      </ResizablePanel>

      <ResizableHandle withHandle />

      {/* Right Panel - Code Viewer Skeleton */}
      <ResizablePanel defaultSize={75} minSize={40}>
        <div className="h-full flex flex-col">
          {/* File Header */}
          <div className="flex items-center justify-between px-3 py-1.5 border-b text-left file-header">
            <div className="flex items-center gap-2 min-w-0">
              <Skeleton className="h-5 w-10 rounded-full" /> {/* Badge */}
              <Skeleton className="h-4 w-48" /> {/* File path */}
            </div>
            <div className="flex gap-1">
              <Skeleton className="h-8 w-8 rounded-md" /> {/* Copy button */}
              <Skeleton className="h-8 w-8 rounded-md" /> {/* External link */}
            </div>
          </div>

          {/* Code Content */}
          <div className="flex-1 overflow-hidden min-h-0">
            <ScrollArea className="w-full h-[calc(100vh-20rem)]">
              <div className="shiki-viewer min-h-[400px] border border-border rounded-lg overflow-hidden">
                <div className="p-4 space-y-4">
                  {/* Code lines simulation */}
                  {Array.from({ length: 20 }, (_, i) => (
                    <div key={i} className="flex items-center gap-4">
                      {/* Line number */}
                      <Skeleton variant="code" className="w-6 flex-shrink-0 opacity-60" />
                      {/* Code content with varying widths */}
                      <Skeleton 
                        variant="code"
                        className={cn(
                          i % 5 === 0 ? "w-3/4" : 
                          i % 4 === 0 ? "w-1/2" : 
                          i % 3 === 0 ? "w-5/6" : "w-2/3"
                        )} 
                      />
                    </div>
                  ))}
                  
                  {/* Empty lines */}
                  <div className="flex items-center gap-4">
                    <Skeleton variant="code" className="w-6 flex-shrink-0 opacity-60" />
                    <div className="skeleton-code-line"></div>
                  </div>
                  
                  {/* More code lines */}
                  {Array.from({ length: 15 }, (_, i) => (
                    <div key={`second-${i}`} className="flex items-center gap-4">
                      <Skeleton variant="code" className="w-6 flex-shrink-0 opacity-60" />
                      <Skeleton 
                        variant="code"
                        className={cn(
                          i % 6 === 0 ? "w-1/3" :
                          i % 4 === 0 ? "w-4/5" :
                          i % 2 === 0 ? "w-1/2" : "w-3/5"
                        )} 
                      />
                    </div>
                  ))}
                </div>
              </div>
            </ScrollArea>
          </div>
        </div>
      </ResizablePanel>
      </ResizablePanelGroup>
    </div>
  );
}

export function FileViewerSkeletonCompact({ className }: TProps) {
  return (
    <div className={cn("min-h-[600px] rounded-lg border overflow-hidden bg-background", className)}>
      <div className="flex items-center justify-center h-full">
        <div className="flex flex-col items-center gap-4 p-8">
          <div className="flex gap-2">
            <Skeleton className="h-12 w-12 rounded-lg" />
            <div className="flex flex-col gap-2">
              <Skeleton className="h-4 w-32" />
              <Skeleton className="h-3 w-24" />
            </div>
          </div>
          <div className="w-full max-w-md space-y-2">
            <Skeleton className="h-3 w-full" />
            <Skeleton className="h-3 w-4/5" />
            <Skeleton className="h-3 w-3/5" />
          </div>
        </div>
      </div>
    </div>
  );
}

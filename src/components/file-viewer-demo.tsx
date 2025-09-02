import { useEffect, useState } from "react";

import ComponentFileViewer from "@/components/file-viewer";
import { FileViewerSkeleton, FileViewerSkeletonCompact } from "@/components/file-viewer-skeleton";
import { Button } from "@/components/ui/button";
import { data } from "@/data";
import { cn } from "@/lib/utils";

type TProps = {
  className?: string;
};

export function FileViewerDemo({ className }: TProps) {
  const [isLoading, setIsLoading] = useState(false);
  const [loadingType, setLoadingType] = useState<"full" | "compact">("full");

  function simulateLoad() {
    setIsLoading(true);
    // Simulate network delay
    setTimeout(() => {
      setIsLoading(false);
    }, 2000);
  }

  function toggleSkeletonType() {
    setLoadingType(prev => prev === "full" ? "compact" : "full");
  }

  return (
    <div className={cn("font-inter", className)}>
      <div className="flex items-center gap-4 mb-6">
        <Button onClick={simulateLoad} disabled={isLoading}>
          {isLoading ? "Loading..." : "Simulate Loading"}
        </Button>
        <Button variant="outline" onClick={toggleSkeletonType}>
          Toggle Skeleton: {loadingType}
        </Button>
      </div>
      
      {isLoading ? (
        loadingType === "full" ? (
          <FileViewerSkeleton />
        ) : (
          <FileViewerSkeletonCompact />
        )
      ) : (
        <ComponentFileViewer component={data} />
      )}
    </div>
  );
}

export function FileViewerWithSuspense({ className }: TProps) {
  const [component, setComponent] = useState<typeof data | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    // Simulate fetching component data
    function loadComponent() {
      setIsLoading(true);
      setTimeout(() => {
        setComponent(data);
        setIsLoading(false);
      }, 1500);
    }

    loadComponent();
  }, []);

  if (isLoading) {
    return <FileViewerSkeleton className={className} />;
  }

  if (!component) {
    return (
      <div className="min-h-[600px] rounded-lg border overflow-hidden bg-card flex items-center justify-center">
        <p className="text-muted-foreground">Failed to load component</p>
      </div>
    );
  }

  return <ComponentFileViewer component={component} className={className} />;
}

export function FileViewerOptimistic({ className }: TProps) {
  const [isRefreshing, setIsRefreshing] = useState(false);
  
  function handleRefresh() {
    setIsRefreshing(true);
    // Simulate optimistic update - skeleton shows briefly
    setTimeout(() => {
      setIsRefreshing(false);
    }, 800);
  }

  return (
    <div className={className}>
      <div className="flex items-center justify-between mb-4">
        <h3 className="text-lg font-semibold">Component Files</h3>
        <Button variant="outline" size="sm" onClick={handleRefresh} disabled={isRefreshing}>
          {isRefreshing ? "Refreshing..." : "Refresh"}
        </Button>
      </div>
      
      {isRefreshing ? (
        <FileViewerSkeleton />
      ) : (
        <ComponentFileViewer component={data} />
      )}
    </div>
  );
}

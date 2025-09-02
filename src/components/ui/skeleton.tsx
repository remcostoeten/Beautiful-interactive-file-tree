import { cn } from "@/lib/utils";

type TProps = {
  width?: string;
  height?: string;
  rounded?: string;
  className?: string;
  variant?: "default" | "code" | "tree-item" | "file-header";
};

export function Skeleton({ 
  width, 
  height, 
  rounded = "rounded-md", 
  className,
  variant = "default" 
}: TProps) {
  return (
    <div
      className={cn(
        "skeleton",
        variant === "code" && "skeleton-code-line",
        variant === "tree-item" && "skeleton-tree-item",
        variant === "file-header" && "skeleton-file-header",
        width && `w-${width}`,
        height && `h-${height}`,
        rounded,
        className
      )}
      aria-hidden="true"
      role="presentation"
    />
  );
}

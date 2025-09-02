# FileViewerSkeleton

A 1:1 aesthetic skeleton loading state for the ComponentFileViewer that prevents layout shift and provides smooth loading transitions.

## Components

### `FileViewerSkeleton`
The main skeleton component that perfectly matches the ComponentFileViewer layout:
- Resizable panels with identical proportions
- File tree skeleton with proper indentation
- Code viewer skeleton with monospace line simulation
- All dimensions match exactly to prevent CLS (Cumulative Layout Shift)

### `FileViewerSkeletonCompact`
A simplified centered skeleton for scenarios where a full layout replica isn't needed.

### `Skeleton`
The base skeleton utility with variants:
- `default`: Standard skeleton block
- `code`: Monospace height matching code lines
- `tree-item`: Fixed height matching tree items
- `file-header`: Fixed height matching file headers

## Usage

### Basic Loading State
```tsx
import { FileViewerSkeleton } from "@/components/file-viewer-skeleton";
import ComponentFileViewer from "@/components/file-viewer";

function MyComponent({ isLoading, data }) {
  if (isLoading) {
    return <FileViewerSkeleton />;
  }
  
  return <ComponentFileViewer component={data} />;
}
```

### With React Suspense
```tsx
import { Suspense } from "react";
import { FileViewerSkeleton } from "@/components/file-viewer-skeleton";

function App() {
  return (
    <Suspense fallback={<FileViewerSkeleton />}>
      <LazyFileViewer />
    </Suspense>
  );
}
```

### Optimistic Updates
```tsx
function OptimisticFileViewer({ data, isRefreshing }) {
  return (
    <>
      {isRefreshing && <FileViewerSkeleton />}
      {!isRefreshing && <ComponentFileViewer component={data} />}
    </>
  );
}
```

## Features

- **Zero Layout Shift**: Exact dimensions match the real component
- **Smooth Animations**: Custom pulse animation using CSS variables
- **Theme Aware**: Uses existing design system colors
- **Performance Optimized**: CSS containment prevents reflows
- **Responsive**: Matches all breakpoints of the real component
- **Accessible**: Proper ARIA labels and semantic markup

## CSS Classes

The skeleton system uses these CSS classes defined in `globals.css`:

- `.skeleton`: Base skeleton styles with animation
- `.skeleton-container`: Layout containment wrapper  
- `.skeleton-code-line`: Monospace line height matching
- `.skeleton-tree-item`: Tree item height consistency
- `.skeleton-file-header`: File header height consistency

## Integration Examples

See `file-viewer-demo.tsx` for complete integration examples:

1. **FileViewerDemo**: Interactive demo with loading simulation
2. **FileViewerWithSuspense**: Automatic loading state management
3. **FileViewerOptimistic**: Fast refresh with skeleton overlay

## Layout Shift Prevention

The skeleton prevents layout shift by:

1. **Identical Container Dimensions**: Same ResizablePanel structure
2. **Fixed Heights**: File headers (41px), tree items (32px), code lines (22px)
3. **CSS Containment**: Layout isolation for performance
4. **Responsive Matching**: All media queries match the real component
5. **Font Metrics**: Monospace font matching for code areas

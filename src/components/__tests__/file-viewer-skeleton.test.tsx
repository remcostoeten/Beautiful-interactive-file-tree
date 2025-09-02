/**
 * @jest-environment jsdom
 */
import { render, screen } from "@testing-library/react";

import { FileViewerSkeleton, FileViewerSkeletonCompact } from "../file-viewer-skeleton";

type TMockResizablePanelGroupProps = {
  children: React.ReactNode;
  className?: string;
};

type TMockResizablePanelProps = {
  children: React.ReactNode;
  [key: string]: unknown;
};

type TMockResizableHandleProps = {
  withHandle?: boolean;
};

type TMockScrollAreaProps = {
  children: React.ReactNode;
  className?: string;
};

// Mock the UI components that might not be available in test environment
jest.mock("@/components/ui/resizable", () => ({
  ResizablePanelGroup: ({ children, className }: TMockResizablePanelGroupProps) => (
    <div className={className} data-testid="resizable-panel-group">
      {children}
    </div>
  ),
  ResizablePanel: ({ children, ...props }: TMockResizablePanelProps) => (
    <div data-testid="resizable-panel" {...props}>
      {children}
    </div>
  ),
  ResizableHandle: ({ withHandle }: TMockResizableHandleProps) => (
    <div data-testid="resizable-handle" data-with-handle={withHandle} />
  ),
}));

jest.mock("@/components/ui/scroll-area", () => ({
  ScrollArea: ({ children, className }: TMockScrollAreaProps) => (
    <div className={className} data-testid="scroll-area">
      {children}
    </div>
  ),
}));

describe("FileViewerSkeleton", () => {
  test("renders main structure with correct layout", () => {
    render(<FileViewerSkeleton />);
    
    // Check for main container
    expect(screen.getByTestId("resizable-panel-group")).toBeInTheDocument();
    
    // Check for both panels
    const panels = screen.getAllByTestId("resizable-panel");
    expect(panels).toHaveLength(2);
    
    // Check for resizable handle
    expect(screen.getByTestId("resizable-handle")).toBeInTheDocument();
    expect(screen.getByTestId("resizable-handle")).toHaveAttribute("data-with-handle", "true");
  });

  test("renders file tree skeleton structure", () => {
    render(<FileViewerSkeleton />);
    
    // Check for scroll areas (should have 2: one in tree, one in code viewer)
    const scrollAreas = screen.getAllByTestId("scroll-area");
    expect(scrollAreas.length).toBeGreaterThanOrEqual(2);
    
    // Check for skeleton elements (should have many)
    const skeletonElements = screen.getAllByRole("presentation");
    expect(skeletonElements.length).toBeGreaterThan(10);
  });

  test("renders with custom className", () => {
    const customClass = "custom-skeleton-class";
    render(<FileViewerSkeleton className={customClass} />);
    
    const container = screen.getByTestId("resizable-panel-group");
    expect(container).toHaveClass(customClass);
  });

  test("has proper ARIA attributes for accessibility", () => {
    render(<FileViewerSkeleton />);
    
    const skeletonElements = screen.getAllByRole("presentation");
    skeletonElements.forEach(element => {
      expect(element).toHaveAttribute("aria-hidden", "true");
    });
  });
});

describe("FileViewerSkeletonCompact", () => {
  test("renders compact layout", () => {
    render(<FileViewerSkeletonCompact />);
    
    // Should not have resizable panels
    expect(screen.queryByTestId("resizable-panel-group")).not.toBeInTheDocument();
    
    // Should have skeleton elements for compact view
    const skeletonElements = screen.getAllByRole("presentation");
    expect(skeletonElements.length).toBeGreaterThan(0);
    expect(skeletonElements.length).toBeLessThan(20); // Less than full skeleton
  });

  test("renders with custom className", () => {
    const { container } = render(<FileViewerSkeletonCompact className="compact-test" />);
    
    expect(container.firstChild).toHaveClass("compact-test");
  });
});

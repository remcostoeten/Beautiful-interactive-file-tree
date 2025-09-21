type TTComponent = {
  name: string;
  version: string;
  showIndentLines: boolean;
  files: Array<{
    path: string;
    content?: string;
  }>;
}

export const data: TTComponent = {
  name: "file-viewer",
  version: "1.0.0",
  showIndentLines: true,
  files: [
    {
      path: "props.md",
      content: `# Props Documentation - Beautiful File Tree v2

A comprehensive guide to all customizable props for maximum modularity and flexibility.

## Table of Contents
- [ComponentFileViewer](#componentfileviewer) - Main file viewer component
- [TComponent](#tcomponent) - Component data structure
- [Tree](#tree) - File tree display component
- [Folder](#folder) - Folder node component 
- [File](#file) - File node component
- [ShikiViewer](#shikiviewer) - Syntax highlighting component
- [FileHeader](#fileheader) - File header with actions
- [SnapToCloseResizablePanel](#snaptocloseresizablepanel) - Collapsible panel
- [SnapToCloseResizableHandle](#snaptocloseresizablehandle) - Panel resize handle
- [useSnapToClosePanel](#usesnaptoclosepanel) - Panel management hook
- [Component Relationships](#component-relationships--extensibility)

---

## ComponentFileViewer

The main component that orchestrates the file tree viewer with resizable panels.

| Prop | Type | Required | Default | Description |
|------|------|----------|---------|-------------|
| component | TComponent | ✓ | — | Component data containing files and metadata |
| className | string | ✗ | undefined | Additional CSS classes for the container |

### Example
\`\`\`tsx
function App() {
  return (
    <ComponentFileViewer
      component={myComponent}
      className="my-custom-styles"
    />
  )
}
\`\`\`

---

## TComponent

The data structure that defines a component with its files and configuration.

| Property | Type | Required | Default | Description |
|----------|------|----------|---------|-------------|
| name | string | ✓ | — | Display name of the component |
| version | string | ✓ | — | Version string shown in header |
| showIndentLines | boolean | ✗ | true | Show indent guide lines in tree |
| files | Array<TFile> | ✓ | — | Array of files to display |

### TFile Structure
| Property | Type | Required | Default | Description |
|----------|------|----------|---------|-------------|
| path | string | ✓ | — | File path (used for tree structure) |
| content | string | ✗ | undefined | File content for syntax highlighting |

### Example
\`\`\`tsx
const component: TComponent = {
  name: "my-component",
  version: "1.0.0", 
  showIndentLines: true,
  files: [
    {
      path: "src/index.tsx",
      content: "export default function Component() { return null }"
    },
    {
      path: "src/types.ts",
      content: "export type TProps = { name: string }"
    }
  ]
}
\`\`\`

---

## Tree

Core tree navigation component that renders the file/folder hierarchy.

| Prop | Type | Required | Default | Description |
|------|------|----------|---------|-------------|
| elements | TProps[] | ✗ | undefined | Tree data structure (auto-generated) |
| initialSelectedId | string | ✗ | undefined | Initially selected file ID |
| initialExpandedItems | string[] | ✗ | undefined | Initially expanded folder IDs |
| children | React.ReactNode | ✓ | — | Tree content (Folder/File components) |
| className | string | ✗ | undefined | Additional CSS classes |
| indicator | boolean | ✗ | true | Show expand/collapse indicators |
| showIndentLines | boolean | ✗ | true | Show vertical indent guide lines |
| openIcon | React.ReactNode | ✗ | <FolderOpenIcon /> | Icon for expanded folders |
| closeIcon | React.ReactNode | ✗ | <FolderIcon /> | Icon for collapsed folders |

### Example
\`\`\`tsx
function CustomTree() {
  return (
    <Tree
      indicator={true}
      showIndentLines={false}
      openIcon={<ChevronDown />}
      closeIcon={<ChevronRight />}
    >
      {treeItems.map(item => (
        <Folder key={item.id} element={item.name} value={item.id}>
          {/* Children */}
        </Folder>
      ))}
    </Tree>
  )
}
\`\`\`

---

## Folder

Represents a folder node in the file tree with expand/collapse functionality.

| Prop | Type | Required | Default | Description |
|------|------|----------|---------|-------------|
| element | string | ✓ | — | Folder display name |
| value | string | ✓ | — | Unique folder identifier |
| children | React.ReactNode | ✓ | — | Nested folder/file components |
| isSelectable | boolean | ✗ | true | Whether folder can be selected |
| isSelect | boolean | ✗ | false | Manual selection override |
| className | string | ✗ | undefined | Additional CSS classes |

### Example
\`\`\`tsx
function MyFolder() {
  return (
    <Folder
      element="components"
      value="src/components"
      isSelectable={false}
    >
      <File value="src/components/Button.tsx">Button.tsx</File>
    </Folder>
  )
}
\`\`\`

---

## File

Represents a file node in the tree that can be selected for viewing.

| Prop | Type | Required | Default | Description |
|------|------|----------|---------|-------------|
| value | string | ✓ | — | Unique file identifier (path) |
| children | React.ReactNode | ✓ | — | File display name |
| isSelectable | boolean | ✗ | true | Whether file can be selected |
| isSelect | boolean | ✗ | false | Manual selection override |
| fileIcon | React.ReactNode | ✗ | <FileIcon /> | Custom file icon |
| className | string | ✗ | undefined | Additional CSS classes |
| onClick | () => void | ✗ | undefined | Custom click handler |

### Example
\`\`\`tsx
function MyFile() {
  return (
    <File
      value="src/index.tsx"
      fileIcon={<TypeScriptIcon />}
      onClick={() => console.log('File selected')}
    >
      index.tsx
    </File>
  )
}
\`\`\`

---

## ShikiViewer

Syntax highlighting component powered by Shiki with theme support.

| Prop | Type | Required | Default | Description |
|------|------|----------|---------|-------------|
| code | string | ✓ | — | Source code to highlight |
| lang | string | ✗ | "tsx" | Language for syntax highlighting |
| showLineNumbers | boolean | ✗ | true | Display line numbers |
| className | string | ✗ | undefined | Additional CSS classes |

### Supported Languages
- tsx, typescript, javascript, jsx
- json, css, scss, html, markdown

### Example
\`\`\`tsx
function CodeBlock() {
  return (
    <ShikiViewer
      code="function hello() { return 'world' }"
      lang="typescript"
      showLineNumbers={false}
      className="rounded-md"
    />
  )
}
\`\`\`

---

## FileHeader

Header component displaying file information with copy functionality.

| Prop | Type | Required | Default | Description |
|------|------|----------|---------|-------------|
| file | { path: string; content?: string } | ✓ | — | File object with path and content |
| onCopy | () => void | ✓ | — | Copy button click handler |
| copied | boolean | ✓ | — | Copy state for button feedback |

### Example
\`\`\`tsx
function MyFileHeader() {
  const [copied, setCopied] = useState(false)
  
  function handleCopy() {
    navigator.clipboard.writeText(file.content || '')
    setCopied(true)
    setTimeout(() => setCopied(false), 2000)
  }
  
  return (
    <FileHeader
      file={{ path: "src/index.tsx", content: "..." }}
      onCopy={handleCopy}
      copied={copied}
    />
  )
}
\`\`\`

---

## SnapToCloseResizablePanel

Enhanced resizable panel with snap-to-close functionality and persistence.

| Prop | Type | Required | Default | Description |
|------|------|----------|---------|-------------|
| storageKey | string | ✗ | undefined | localStorage key for persistence |
| enableSnapToClose | boolean | ✗ | true | Enable snap-to-close behavior |
| minSizePixels | number | ✗ | 35 | Minimum size in pixels |
| snapThreshold | number | ✗ | 35 | Size threshold for snapping closed |
| animationDuration | number | ✗ | 300 | Animation duration in milliseconds |
| isCollapsible | boolean | ✗ | false | Whether panel can be collapsed |
| children | React.ReactNode | ✓ | — | Panel content |
| className | string | ✗ | undefined | Additional CSS classes |

*Also inherits all props from react-resizable-panels Panel component*

### Example
\`\`\`tsx
function MyPanel() {
  return (
    <SnapToCloseResizablePanel
      storageKey="sidebar-panel"
      defaultSize={25}
      minSize={15}
      snapThreshold={18}
      animationDuration={250}
    >
      <div>Panel content</div>
    </SnapToCloseResizablePanel>
  )
}
\`\`\`

---

## SnapToCloseResizableHandle

Resize handle with optional toggle button and snap-to-close integration.

| Prop | Type | Required | Default | Description |
|------|------|----------|---------|-------------|
| withHandle | boolean | ✗ | false | Show grip icon on handle |
| snapToCloseHook | UseSnapToCloseReturn | ✗ | undefined | Hook instance for snap behavior |
| showToggleButton | boolean | ✗ | false | Show collapse/expand button |
| className | string | ✗ | undefined | Additional CSS classes |

*Also inherits all props from react-resizable-panels PanelResizeHandle component*

### Example
\`\`\`tsx
function MyHandle() {
  const snapHook = useSnapToClosePanel({ storageKey: "panel" })
  
  return (
    <SnapToCloseResizableHandle
      withHandle={true}
      snapToCloseHook={snapHook}
      showToggleButton={true}
    />
  )
}
\`\`\`

---

## useSnapToClosePanel

Hook for managing panel state with snap-to-close behavior and persistence.

### Parameters
| Parameter | Type | Required | Default | Description |
|-----------|------|----------|---------|-------------|
| storageKey | string | ✓ | — | Unique key for localStorage |
| defaultSize | number | ✓ | — | Default panel size percentage |
| minSize | number | ✗ | 100 | Minimum size in pixels |
| snapThreshold | number | ✗ | 120 | Threshold for snap behavior |
| animationDuration | number | ✗ | 300 | Animation duration in milliseconds |

### Returns
| Property | Type | Description |
|----------|------|-------------|
| panelState | TPanelState | Current panel state |
| handleResize | (sizes: number[]) => void | Resize event handler |
| toggleCollapse | () => void | Toggle collapsed state |
| expand | () => void | Expand panel |
| collapse | () => void | Collapse panel |

### TPanelState
| Property | Type | Description |
|----------|------|-------------|
| size | number | Current size percentage |
| isCollapsed | boolean | Whether panel is collapsed |
| isAnimating | boolean | Whether currently animating |

### Example
\`\`\`tsx
function useMyPanel() {
  const snapHook = useSnapToClosePanel({
    storageKey: "file-tree-panel",
    defaultSize: 25,
    minSize: 15,
    snapThreshold: 18,
    animationDuration: 300
  })
  
  return {
    ...snapHook,
    isOpen: !snapHook.panelState.isCollapsed
  }
}
\`\`\`

---

## Component Relationships & Extensibility

### Hierarchy
\`\`\`
ComponentFileViewer (main container)
├── SnapToCloseResizablePanelGroup
├── SnapToCloseResizablePanel
│   └── FileTree
│       └── Tree
│           ├── Folder (expandable nodes)
│           │   └── TreeItem (recursive)
│           └── File (selectable leaves)
├── SnapToCloseResizableHandle
└── ResizablePanel
    ├── FileHeader (file info + actions)
    └── ShikiViewer (syntax highlighting)
\`\`\`

### Key Integration Points

**Tree → Folder/File**: Tree provides context via TreeContext, Folder/File consume it for state management.

**FileTree → Tree**: FileTree builds the tree structure from flat file paths and passes it to Tree.

**ComponentFileViewer → ShikiViewer**: Main component passes selected file content to ShikiViewer for rendering.

**SnapToCloseResizablePanel → useSnapToClosePanel**: Panel component uses the hook for state management and persistence.

**FileHeader → Copy functionality**: Integrates with browser clipboard API and toast notifications.

### Customization Strategies

1. **Theme Integration**: All components respect next-themes context for dark/light mode
2. **Icon Replacement**: Most icons are customizable via props (openIcon, closeIcon, fileIcon)
3. **Styling**: All components accept className for Tailwind CSS customization
4. **State Management**: Tree state is controllable via initialSelectedId and initialExpandedItems
5. **Panel Behavior**: Snap-to-close behavior is fully configurable via hook parameters
6. **Content Processing**: File content can be preprocessed before passing to ShikiViewer

### Performance Optimizations

- **Memoization**: FileTree component is memoized to prevent unnecessary re-renders
- **View Transitions**: File selection uses React's view transition API when available
- **Lazy Highlighting**: Shiki highlighting is performed asynchronously with loading states
- **Persistent State**: Panel sizes and collapsed states are persisted to localStorage

### Accessibility Features

- **Keyboard Navigation**: Full keyboard support for tree navigation
- **ARIA Labels**: Proper labeling for screen readers
- **Focus Management**: Focus is managed during expand/collapse operations
- **Color Contrast**: Respects system theme preferences for optimal contrast`
    },
    {
      path: "src/types.ts",
      content: `type TComponent = {
  name: string;
  version: string;
  files: Array<{
    path: string;
    content?: string;
  }>;
}

type TProps = {
  id: string;
  name: string;
  isSelectable?: boolean;
  children?: TProps[];
}

type TCtx = {
  selectedId: string | undefined;
  expandedItems: string[] | undefined;
  handleExpand: (id: string) => void;
  selectItem: (id: string) => void;
  setExpandedItems?: React.Dispatch<React.SetStateAction<string[] | undefined>>;
  indicator: boolean;
  openIcon?: React.ReactNode;
  closeIcon?: React.ReactNode;
  direction: "rtl" | "ltr";
}`
    },
    {
      path: "src/components/file-viewer.tsx",
      content: `import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
  ResizableHandle,
  ResizablePanel,
  ResizablePanelGroup,
} from "@/components/ui/resizable";
import { ScrollArea } from "@/components/ui/scroll-area";
import { cn } from "@/lib/utils";
import * as AccordionPrimitive from "@radix-ui/react-accordion";
import {
  Check,
  Copy,
  ExternalLink,
  FileCode,
  FileIcon,
  FolderIcon,
  FolderOpenIcon,
} from "lucide-react";
import { useTheme } from "next-themes";
import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useState,
} from "react";
import { toast } from "sonner";
import { createHighlighter } from "shiki";

// Main file viewer component with syntax highlighting
export default function ComponentFileViewer({
  component,
}: {
  component: TComponent;
}) {
  const [selectedFile, setSelectedFile] = useState<string | undefined>(
    undefined
  );
  const [copied, setCopied] = useState(false);
  const files = component.files.filter((f) => f.content);

  // Build tree structure from files
  const tree = useMemo(() => {
    const root: Record<string, any> = {};
    for (const file of files) {
      const parts = file.path.split("/");
      let current = root;
      for (let i = 0; i < parts.length; i++) {
        const part = parts[i];
        if (!current[part]) {
          current[part] =
            i === parts.length - 1
              ? { ...file, id: file.path, name: part, isSelectable: true }
              : {
                  id: parts.slice(0, i + 1).join("/"),
                  name: part,
                  children: {},
                  isSelectable: false,
                };
        }
        current = current[part].children || current[part];
      }
    }
    const toArray = (obj: Record<string, any>): TProps[] =>
      Object.values(obj).map((item: any) =>
        item.children ? { ...item, children: toArray(item.children) } : item
      );
    return toArray(root);
  }, [files]);

  return (
    <ResizablePanelGroup
      direction="horizontal"
      className="min-h-[600px] rounded-lg border overflow-hidden"
    >
      <ResizablePanel defaultSize={25} minSize={20} maxSize={40}>
        {/* File tree navigation */}
      </ResizablePanel>
      <ResizableHandle withHandle />
      <ResizablePanel defaultSize={75} minSize={40}>
        {/* Code viewer with syntax highlighting */}
      </ResizablePanel>
    </ResizablePanelGroup>
  );
}`
    },
    {
      path: "src/components/shiki-viewer.tsx",
      content: `import { useTheme } from "next-themes";
import { useEffect, useState } from "react";
import { createHighlighter } from "shiki";
import { cn } from "@/lib/utils";

interface ShikiViewerProps {
  code: string;
  lang?: string;
  showLineNumbers?: boolean;
  className?: string;
}

export function ShikiViewer({
  code,
  lang = "tsx",
  showLineNumbers = true,
  className,
}: ShikiViewerProps) {
  const [html, setHtml] = useState<string>("");
  const [isLoading, setIsLoading] = useState(true);
  const { resolvedTheme } = useTheme();

  useEffect(() => {
    let mounted = true;
    async function highlight() {
      try {
        setIsLoading(true);
        const shikiTheme =
          resolvedTheme === "dark" ? "github-dark" : "github-light";
        const highlighter = await createHighlighter({
          langs: [
            "tsx",
            "typescript",
            "javascript",
            "jsx",
            "json",
            "css",
            "scss",
            "html",
            "markdown",
          ],
          themes: [shikiTheme],
        });
        const highlightedHtml = highlighter.codeToHtml(code, {
          lang: lang === "tsx" ? "typescript" : lang,
          theme: shikiTheme,
        });
        if (mounted) {
          setHtml(highlightedHtml);
          setIsLoading(false);
        }
      } catch (error) {
        if (mounted) {
          setHtml(\`<pre><code>\${code}</code></pre>\`);
          setIsLoading(false);
        }
      }
    }
    highlight();
    return () => {
      mounted = false;
    };
  }, [code, lang, resolvedTheme]);

  return (
    <div className={cn("shiki-viewer", className)}>
      {isLoading ? (
        <div className="flex items-center justify-center p-8">
          <div className="animate-pulse text-muted-foreground">
            Loading code...
          </div>
        </div>
      ) : (
        <div dangerouslySetInnerHTML={{ __html: html }} />
      )}
    </div>
  );
}`
    },
    {
      path: "src/utils.ts",
      content: `import { clsx, type ClassValue } from 'clsx';
import { twMerge } from 'tailwind-merge';

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

// Additional utility functions
export function formatFileSize(bytes: number): string {
  if (bytes === 0) return '0 Bytes';
  const k = 1024;
  const sizes = ['Bytes', 'KB', 'MB', 'GB'];
  const i = Math.floor(Math.log(bytes) / Math.log(k));
  return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i];
}

export function getFileExtension(filename: string): string {
  return filename.slice((filename.lastIndexOf('.') - 1 >>> 0) + 2);
}`
    },
    {
      path: "README.md",
      content: `# Component File Viewer

A React component for viewing and navigating through component files with syntax highlighting.

## Features

- **File Tree Navigation**: Browse through component files with an expandable tree structure
- **Syntax Highlighting**: Powered by Shiki for beautiful code highlighting
- **Copy to Clipboard**: Copy file contents with a single click
- **Resizable Panels**: Adjust the file tree and code viewer sizes
- **Theme Support**: Automatically adapts to light/dark themes
- **Line Numbers**: Optional line numbering for better code readability

## Usage

\`\`\`tsx
import ComponentFileViewer, { TComponent } from "./components/ComponentFileViewer";

const component: TComponent = {
  name: "my-component",
  version: "1.0.0",
  files: [
    {
      path: "src/index.tsx",
      content: "// Your component code here"
    }
  ]
};

function App() {
  return <ComponentFileViewer component={component} />;
}
\`\`\`

## File Structure

The component is organized into several modules:

- types.ts - TypeScript interfaces and types
- components/ShikiViewer.tsx - Code syntax highlighting component
- components/FileHeader.tsx - File header with actions
- components/FileTree.tsx - File tree navigation component
- components/ComponentFileViewer.tsx - Main component
- utils.ts - Utility functions

## Dependencies

- React
- Radix UI (Accordion, Resizable)
- Lucide React (Icons)
- Shiki (Syntax highlighting)
- Next Themes (Theme support)
- Sonner (Toast notifications)

## License

MIT`
    },
    {
      path: "package.json",
      content: `{
  "name": "file-viewer",
  "version": "1.0.0",
  "description": "A React component for viewing and navigating through component files",
  "main": "dist/index.js",
  "types": "dist/index.d.ts",
  "scripts": {
    "build": "tsc",
    "dev": "tsc --watch",
    "test": "jest"
  },
  "dependencies": {
    "@radix-ui/react-accordion": "^1.1.2",
    "lucide-react": "^0.294.0",
    "next-themes": "^0.2.1",
    "react": "^18.2.0",
  "shiki": "^1.1.7",
    "sonner": "^1.2.4",
    "react-resizable-panels": "^2.1.3"
  },
  "devDependencies": {
    "@types/react": "^18.2.45",
    "typescript": "^5.3.3"
  },
  "peerDependencies": {
    "react": ">=18.0.0"
  }
}`
    }
  ]
}

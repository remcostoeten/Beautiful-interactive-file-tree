# Props Documentation - Beautiful File Tree v2

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
| `component` | `TComponent` | ✓ | — | Component data containing files and metadata |
| `className` | `string` | ✗ | `undefined` | Additional CSS classes for the container |

### Example
```tsx
function App() {
  return (
    <ComponentFileViewer
      component={myComponent}
      className="my-custom-styles"
    />
  )
}
```

---

## TComponent

The data structure that defines a component with its files and configuration.

| Property | Type | Required | Default | Description |
|----------|------|----------|---------|-------------|
| `name` | `string` | ✓ | — | Display name of the component |
| `version` | `string` | ✓ | — | Version string shown in header |
| `showIndentLines` | `boolean` | ✗ | `true` | Show indent guide lines in tree |
| `enableHoverHighlight` | `boolean` | ✗ | `true` | Enable subtle background color on hover for file & folder rows |
| `files` | `Array<TFile>` | ✓ | — | Array of files to display |

### TFile Structure
| Property | Type | Required | Default | Description |
|----------|------|----------|---------|-------------|
| `path` | `string` | ✓ | — | File path (used for tree structure) |
| `content` | `string` | ✗ | `undefined` | File content for syntax highlighting |

### Example
```tsx
const component: TComponent = {
  name: "my-component",
  version: "1.0.0", 
  showIndentLines: true,
  enableHoverHighlight: false, // Disable hover highlighting
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
```

---

## Tree

Core tree navigation component that renders the file/folder hierarchy.

| Prop | Type | Required | Default | Description |
|------|------|----------|---------|-------------|
| `elements` | `TProps[]` | ✗ | `undefined` | Tree data structure (auto-generated) |
| `initialSelectedId` | `string` | ✗ | `undefined` | Initially selected file ID |
| `initialExpandedItems` | `string[]` | ✗ | `undefined` | Initially expanded folder IDs |
| `children` | `React.ReactNode` | ✓ | — | Tree content (Folder/File components) |
| `className` | `string` | ✗ | `undefined` | Additional CSS classes |
| `indicator` | `boolean` | ✗ | `true` | Show expand/collapse indicators |
| `showIndentLines` | `boolean` | ✗ | `true` | Show vertical indent guide lines |
| `enableHoverHighlight` | `boolean` | ✗ | `true` | Enable subtle background color on hover for file & folder rows |
| `openIcon` | `React.ReactNode` | ✗ | `<FolderOpenIcon />` | Icon for expanded folders |
| `closeIcon` | `React.ReactNode` | ✗ | `<FolderIcon />` | Icon for collapsed folders |

### Example
```tsx
function CustomTree() {
  return (
    <Tree
      indicator={true}
      showIndentLines={false}
      enableHoverHighlight={true}
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
```

---

## Folder

Represents a folder node in the file tree with expand/collapse functionality.

| Prop | Type | Required | Default | Description |
|------|------|----------|---------|-------------|
| `element` | `string` | ✓ | — | Folder display name |
| `value` | `string` | ✓ | — | Unique folder identifier |
| `children` | `React.ReactNode` | ✓ | — | Nested folder/file components |
| `isSelectable` | `boolean` | ✗ | `true` | Whether folder can be selected |
| `isSelect` | `boolean` | ✗ | `false` | Manual selection override |
| `className` | `string` | ✗ | `undefined` | Additional CSS classes |

### Example
```tsx
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
```

---

## File

Represents a file node in the tree that can be selected for viewing.

| Prop | Type | Required | Default | Description |
|------|------|----------|---------|-------------|
| `value` | `string` | ✓ | — | Unique file identifier (path) |
| `children` | `React.ReactNode` | ✓ | — | File display name |
| `isSelectable` | `boolean` | ✗ | `true` | Whether file can be selected |
| `isSelect` | `boolean` | ✗ | `false` | Manual selection override |
| `fileIcon` | `React.ReactNode` | ✗ | `<FileIcon />` | Custom file icon |
| `className` | `string` | ✗ | `undefined` | Additional CSS classes |
| `onClick` | `() => void` | ✗ | `undefined` | Custom click handler |

### Example
```tsx
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
```

---

## ShikiViewer

Syntax highlighting component powered by Shiki with theme support.

| Prop | Type | Required | Default | Description |
|------|------|----------|---------|-------------|
| `code` | `string` | ✓ | — | Source code to highlight |
| `lang` | `string` | ✗ | `"tsx"` | Language for syntax highlighting |
| `showLineNumbers` | `boolean` | ✗ | `true` | Display line numbers |
| `className` | `string` | ✗ | `undefined` | Additional CSS classes |

### Supported Languages
- `tsx`, `typescript`, `javascript`, `jsx`
- `json`, `css`, `scss`, `html`, `markdown`

### Example
```tsx
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
```

---

## FileHeader

Header component displaying file information with copy functionality.

| Prop | Type | Required | Default | Description |
|------|------|----------|---------|-------------|
| `file` | `{ path: string; content?: string }` | ✓ | — | File object with path and content |
| `onCopy` | `() => void` | ✓ | — | Copy button click handler |
| `copied` | `boolean` | ✓ | — | Copy state for button feedback |

### Example
```tsx
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
```

---

## SnapToCloseResizablePanel

Enhanced resizable panel with snap-to-close functionality and persistence.

| Prop | Type | Required | Default | Description |
|------|------|----------|---------|-------------|
| `storageKey` | `string` | ✗ | `undefined` | localStorage key for persistence |
| `enableSnapToClose` | `boolean` | ✗ | `true` | Enable snap-to-close behavior |
| `minSizePixels` | `number` | ✗ | `35` | Minimum size in pixels |
| `snapThreshold` | `number` | ✗ | `35` | Size threshold for snapping closed |
| `animationDuration` | `number` | ✗ | `300` | Animation duration in milliseconds |
| `isCollapsible` | `boolean` | ✗ | `false` | Whether panel can be collapsed |
| `children` | `React.ReactNode` | ✓ | — | Panel content |
| `className` | `string` | ✗ | `undefined` | Additional CSS classes |

*Also inherits all props from react-resizable-panels Panel component*

### Example
```tsx
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
```

---

## SnapToCloseResizableHandle

Resize handle with optional toggle button and snap-to-close integration.

| Prop | Type | Required | Default | Description |
|------|------|----------|---------|-------------|
| `withHandle` | `boolean` | ✗ | `false` | Show grip icon on handle |
| `snapToCloseHook` | `UseSnapToCloseReturn` | ✗ | `undefined` | Hook instance for snap behavior |
| `showToggleButton` | `boolean` | ✗ | `false` | Show collapse/expand button |
| `className` | `string` | ✗ | `undefined` | Additional CSS classes |

*Also inherits all props from react-resizable-panels PanelResizeHandle component*

### Example
```tsx
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
```

---

## useSnapToClosePanel

Hook for managing panel state with snap-to-close behavior and persistence.

### Parameters
| Parameter | Type | Required | Default | Description |
|-----------|------|----------|---------|-------------|
| `storageKey` | `string` | ✓ | — | Unique key for localStorage |
| `defaultSize` | `number` | ✓ | — | Default panel size percentage |
| `minSize` | `number` | ✗ | `100` | Minimum size in pixels |
| `snapThreshold` | `number` | ✗ | `120` | Threshold for snap behavior |
| `animationDuration` | `number` | ✗ | `300` | Animation duration in milliseconds |

### Returns
| Property | Type | Description |
|----------|------|-------------|
| `panelState` | `TPanelState` | Current panel state |
| `handleResize` | `(sizes: number[]) => void` | Resize event handler |
| `toggleCollapse` | `() => void` | Toggle collapsed state |
| `expand` | `() => void` | Expand panel |
| `collapse` | `() => void` | Collapse panel |

### TPanelState
| Property | Type | Description |
|----------|------|-------------|
| `size` | `number` | Current size percentage |
| `isCollapsed` | `boolean` | Whether panel is collapsed |
| `isAnimating` | `boolean` | Whether currently animating |

### Example
```tsx
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
```

---

## Component Relationships & Extensibility

### Hierarchy
```
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
```

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
7. **Hover Effects**: Hover highlighting can be toggled on/off via enableHoverHighlight prop

### Performance Optimizations

- **Memoization**: FileTree component is memoized to prevent unnecessary re-renders
- **View Transitions**: File selection uses React's view transition API when available
- **Lazy Highlighting**: Shiki highlighting is performed asynchronously with loading states
- **Persistent State**: Panel sizes and collapsed states are persisted to localStorage

### Accessibility Features

- **Keyboard Navigation**: Full keyboard support for tree navigation
- **ARIA Labels**: Proper labeling for screen readers
- **Focus Management**: Focus is managed during expand/collapse operations
- **Color Contrast**: Respects system theme preferences for optimal contrast

import * as AccordionPrimitive from "@radix-ui/react-accordion";
import { Check, Copy, Eye, FileCode, FileIcon, FolderIcon, FolderOpenIcon } from "lucide-react";
import { marked } from "marked";
import { useTheme } from "next-themes";
import React, { createContext, startTransition, useCallback, useContext, useEffect, useMemo, useState } from "react";
import { createHighlighter } from "shiki";
import { toast } from "sonner";

import { getAllShikiThemeNames, resolveShikiTheme } from "@/lib/shiki-themes";
import { useShikiTheme } from "@/hooks/use-shiki-theme";
import { CompactThemePicker } from "@/components/theme-picker";

import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { ResizablePanel } from "@/components/ui/resizable";
import { ScrollArea } from "@/components/ui/scroll-area";
import { SnapToCloseResizablePanel, SnapToCloseResizablePanelGroup, useSnapToClosePanel } from "@/components/ui/snap-to-close-resizable";
import { cn } from "@/lib/utils";

export type TComponent = {
  name: string;
  version: string;
  showIndentLines?: boolean;
  enableHoverHighlight?: boolean;
  files: Array<{
    path: string;
    content?: string;
  }>;
}

type TProps = {
  name: string;
  id: string;
  children?: TProps[];
}

type TCtx = {
  selectedId: string | undefined;
  expandedItems: string[] | undefined;
  handleExpand: (id: string) => void;
  selectItem: (id: string) => void;
  setExpandedItems?: React.Dispatch<React.SetStateAction<string[] | undefined>>;
  // Tree display props
  indicator: boolean;
  showIndentLines: boolean;
  enableHoverHighlight: boolean;
  openIcon?: React.ReactNode;
  closeIcon?: React.ReactNode;
}

const TreeContext = createContext<TCtx | null>(null);

function useTree(): TCtx {
  const context = useContext(TreeContext);
  if (!context) {
    throw new Error("useTree must be used within a TreeProvider");
  }
  return context;
}

function ShikiViewer({
  code,
  lang = "tsx",
  showLineNumbers = true,
  className,
  selectedTheme,
  ...props
}: {
  code: string;
  lang?: string;
  showLineNumbers?: boolean;
  className?: string;
  selectedTheme?: string;
} & React.HTMLAttributes<HTMLDivElement>) {
  const [html, setHtml] = useState<string>("");
  const [isLoading, setIsLoading] = useState(false);
  const { resolvedTheme } = useTheme();

  // Create a content key for caching
  const contentKey = useMemo(() => {
    return `${code.slice(0, 100)}-${lang}-${selectedTheme || 'auto'}-${resolvedTheme}`;
  }, [code, lang, selectedTheme, resolvedTheme]);
  
  const [lastContentKey, setLastContentKey] = useState(contentKey);

  useEffect(() => {
    if (contentKey === lastContentKey && html) {
      return;
    }

    let mounted = true;
    async function highlight() {
      try {
        setIsLoading(true);
        
        // Resolve the actual Shiki theme name
        const actualTheme = resolveShikiTheme(
          selectedTheme === 'auto' ? undefined : selectedTheme,
          resolvedTheme as 'light' | 'dark' | undefined,
          'github-light',
          'github-dark'
        );
        
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
          themes: getAllShikiThemeNames(),
        });
        
        const highlightedHtml = highlighter.codeToHtml(code, {
          lang: lang === "tsx" ? "typescript" : lang,
          theme: actualTheme,
        });
        
        if (mounted) {
          setHtml(highlightedHtml);
          setIsLoading(false);
          setLastContentKey(contentKey);
        }
      } catch {
        if (mounted) {
          setHtml(`<pre><code>${code}</code></pre>`);
          setIsLoading(false);
          setLastContentKey(contentKey);
        }
      }
    }
    
    highlight();
    return () => {
      mounted = false;
    };
  }, [contentKey, lastContentKey, code, lang, selectedTheme, resolvedTheme, html]);

  const addLineNumbers = useCallback((html: string) => {
    if (!showLineNumbers) return html ?? "";
    const lines = code.split("\n");
    const lineNumbers = lines.map((_, i) => `<span>${i + 1}</span>`).join("");
    return html.replace(
      /<pre[^>]*>([\s\S]*)<\/pre>/,
      `<pre class="line-numbers"><span class="line-numbers-rows">${lineNumbers}</span>$1</pre>`
    );
  }, [showLineNumbers, code]);

  const displayHtml = isLoading && html ? html : (!isLoading ? html : "");

  return (
    <>
      <style>{`
        .shiki-viewer { 
          border-radius: 0.5rem; 
          overflow: hidden; 
          border: 1px solid hsl(var(--border));
          background: hsl(var(--background));
        }
        .shiki-viewer pre { 
          margin: 0; 
          padding: 0.8rem; 
          overflow-x: auto; 
          background: transparent !important; 
          font-size: 0.875rem; 
          line-height: 1.5; 
          white-space: pre; 
          text-align: left;
          color: hsl(var(--foreground));
        }
        .shiki-viewer code { 
          background: transparent !important; 
          padding: 0; 
          border-radius: 0; 
          font-family: inherit; 
          font-size: inherit; 
          line-height: inherit; 
          white-space: pre; 
          text-align: left;
          color: inherit;
        }
        .shiki-viewer .line-numbers { 
          display: flex; 
          background: transparent !important; 
        }
        .shiki-viewer .line-numbers pre { 
          background: transparent !important; 
        }
        .shiki-viewer .line-numbers code { 
          background: transparent !important; 
        }
        .shiki-viewer .line-numbers .line-numbers-rows { 
          display: flex; 
          flex-direction: column; 
          padding-right: 0.2rem; 
          margin-right: 0.8rem; 
          border-right: 1px solid hsl(var(--border)); 
          text-align: right; 
          color: hsl(var(--muted-foreground)); 
          font-size: 0.8755rem; 
          user-select: none; 
          background: transparent !important; 
        }
        .shiki-viewer .line-numbers .line-numbers-rows > span { 
          display: block; 
          text-align: left; 
          background: transparent !important; 
        }
      `}</style>
      <div className={cn("shiki-viewer min-h-[400px]", className)} {...props}>
        {isLoading && !html ? (
          <div className="flex items-center justify-center p-8">
            <div className="animate-pulse text-muted-foreground">
              Loading code...
            </div>
          </div>
        ) : displayHtml ? (
          <div
            dangerouslySetInnerHTML={{ __html: addLineNumbers(displayHtml) }}
            className={isLoading ? "opacity-75" : "opacity-100"}
          />
        ) : (
          <div className="flex items-center justify-center p-8">
            <div className="text-muted-foreground">No content to display</div>
          </div>
        )}
      </div>
    </>
  );
}

function FileHeader({
  file,
  onCopy,
  copied,
  showMarkdownPreview,
  onToggleMarkdown,
  enableThemePicker,
  shikiTheme,
}: {
  file: { path: string; content?: string };
  onCopy: () => void;
  copied: boolean;
  showMarkdownPreview?: boolean;
  onToggleMarkdown?: () => void;
  enableThemePicker?: boolean;
  shikiTheme?: { selectedTheme: string; updateTheme: (theme: string) => void };
}
) {
  function getFileType(filePath: string) {
    if (filePath.endsWith(".tsx")) return "TSX";
    if (filePath.endsWith(".ts")) return "TS";
    if (filePath.endsWith(".js")) return "JS";
    if (filePath.endsWith(".jsx")) return "JSX";
    if (filePath.endsWith(".md")) return "MD";
    if (filePath.endsWith(".css")) return "CSS";
    if (filePath.endsWith(".json")) return "JSON";
    return "TXT";
  }

  const isMarkdownFile = file.path.endsWith(".md");

  return (
    <div className="flex items-center justify-between px-3 py-1.5 border-b text-left">
      <div className="flex items-center gap-2 min-w-0">
        <Badge variant="outline" className="text-xs">
          {getFileType(file.path)}
        </Badge>
        <span className="text-xs text-muted-foreground truncate">
          {file.path}
        </span>
      </div>
      <div className="flex items-center gap-2">
        {enableThemePicker && shikiTheme && (
          <CompactThemePicker
            selectedTheme={shikiTheme.selectedTheme}
            onThemeChange={shikiTheme.updateTheme}
            className="text-xs"
          />
        )}
        <div className="flex gap-1">
          {isMarkdownFile && onToggleMarkdown && (
            <Button
              variant="ghost"
              size="sm"
              onClick={onToggleMarkdown}
              className="cursor-pointer h-8 w-8 p-0"
              title={showMarkdownPreview ? "Show raw markdown" : "Preview markdown"}
            >
              <Eye className="h-3 w-3" />
            </Button>
          )}
          <Button
            variant="ghost"
            size="sm"
            onClick={onCopy}
            className="cursor-pointer h-8 w-8 p-0"
            title="Copy file content"
          >
            {copied ? (
              <Check className="h-3 w-3" />
            ) : (
              <Copy className="h-3 w-3" />
            )}
          </Button>
        </div>
      </div>
    </div>
  );
}

function TreeIndicator({
  className,
  ...props
}: React.HTMLAttributes<HTMLDivElement>) {
  const {  showIndentLines } = useTree();

  if (!showIndentLines) return null;

  return (
    <div
      className={cn(
        "absolute left-1.5 h-full w-px rounded-md bg-border py-3 transition-colors",
        className
      )}
      {...props}
    />
  );
}

function Folder({
  element,
  value,
  isSelectable = true,
  isSelect,
  children,
  className,
}: {
  // Folder data
  element: string;
  value: string;
  children: React.ReactNode;
  // Selection state
  isSelectable?: boolean;
  isSelect?: boolean;
  // Display options
  className?: string;
}) {
  const {
    handleExpand,
    expandedItems,
    indicator,
    showIndentLines,
    enableHoverHighlight,
    openIcon,
    closeIcon,
  } = useTree();

  const isExpanded = expandedItems?.includes(value);


  return (
    <AccordionPrimitive.Item
      value={value}
      className="relative h-full overflow-hidden"
    >
      <AccordionPrimitive.Trigger
        className={cn(
          "flex w-full items-center gap-2 rounded-md text-sm px-2 py-1.5 transition-all cursor-pointer text-left",
          isExpanded
            ? "bg-accent/50 text-accent-foreground"
            : enableHoverHighlight ? "ft-hover-bg" : "ft-hover-none",
          isSelect && isSelectable && "bg-muted",
          !isSelectable && "opacity-50 cursor-not-allowed",
          className
        )}
        disabled={!isSelectable}
        onClick={() => handleExpand(value)}
      >
        {isExpanded
          ? openIcon ?? <FolderOpenIcon className="h-4 w-4" />
          : closeIcon ?? <FolderIcon className="h-4 w-4" />}
        <span className="truncate">{element}</span>
      </AccordionPrimitive.Trigger>
      <AccordionPrimitive.Content className="relative h-full overflow-hidden text-sm">
        {indicator && showIndentLines && <TreeIndicator />}
        <AccordionPrimitive.Root
          type="multiple"
          className="ml-5 flex flex-col gap-1 py-1"
          value={expandedItems}
        >
          {children}
        </AccordionPrimitive.Root>
      </AccordionPrimitive.Content>
    </AccordionPrimitive.Item>
  );
}

function File({
  value,
  isSelectable = true,
  isSelect,
  fileIcon,
  children,
  className,
  onClick,
}: {
  // File data
  value: string;
  children: React.ReactNode;
  // Selection state
  isSelectable?: boolean;
  isSelect?: boolean;
  // Display options
  fileIcon?: React.ReactNode;
  className?: string;
  // Event handlers
  onClick?: () => void;
}) {
  const { selectedId, selectItem, enableHoverHighlight } = useTree();
  const isSelected = isSelect ?? selectedId === value;


  return (
    <button
      disabled={!isSelectable}
        className={cn(
          "flex w-full items-center gap-2 rounded-md px-2 py-1.5 text-sm transition-all cursor-pointer text-left",
          isSelected && isSelectable
            ? "bg-primary text-primary-foreground shadow-sm"
            : enableHoverHighlight ? "ft-hover-bg" : "ft-hover-none",
          !isSelectable
            ? "opacity-50 cursor-not-allowed"
            : "",
          className
        )}
      onClick={() => {
        selectItem(value);
        onClick?.();
      }}
    >
      {fileIcon ?? <FileIcon className="h-4 w-4" />}
      <span className="truncate">{children}</span>
    </button>
  );
}

function Tree({
  elements,
  initialSelectedId,
  initialExpandedItems,
  children,
  className,
  // Tree display props
  indicator = true,
  showIndentLines = true,
  enableHoverHighlight = true,
  openIcon,
  closeIcon,
}: {
  elements?: TProps[];
  initialSelectedId?: string;
  initialExpandedItems?: string[];
  children: React.ReactNode;
  className?: string;
  indicator?: boolean;
  showIndentLines?: boolean;
  enableHoverHighlight?: boolean;
  openIcon?: React.ReactNode;
  closeIcon?: React.ReactNode;
}) {
  const [selectedId, setSelectedId] = useState<string | undefined>(
    initialSelectedId
  );
  const [expandedItems, setExpandedItems] = useState<string[] | undefined>(
    initialExpandedItems
  );

  const getAllExpandableItems = useCallback(
    function (elements?: TProps[]): string[] {
      const expandableItems: string[] = [];
      function traverse(items: TProps[]) {
        items.forEach((item) => {
          if (item.children?.length) {
            expandableItems.push(item.id);
            traverse(item.children);
          }
        });
      }
      if (elements) traverse(elements);
      return expandableItems;
    },
    []
  );

  const selectItem = useCallback((id: string) => setSelectedId(id), []);

  const handleExpand = useCallback((id: string) => {
    setExpandedItems((prev) => {
      if (prev?.includes(id)) return prev.filter((item) => item !== id);
      return [...(prev ?? []), id];
    });
  }, []);

  useEffect(() => {
    if (elements) setExpandedItems(getAllExpandableItems(elements));
  }, [elements, getAllExpandableItems]);

  return (
    <TreeContext.Provider
      value={{
        selectedId,
        expandedItems,
        handleExpand,
        selectItem,
        setExpandedItems,
        indicator,
        showIndentLines,
        enableHoverHighlight,
        openIcon,
        closeIcon,
      }}
    >
      <div className={cn("size-full", className)}>
        <div className="relative h-full px-2">
          <AccordionPrimitive.Root
            type="multiple"
            value={expandedItems}
            className="flex flex-col gap-1"
          >
            {children}
          </AccordionPrimitive.Root>
        </div>
      </div>
    </TreeContext.Provider>
  );
}

function TreeItem({
  item,
  selectedFile,
  onFileSelect,
}: {
  // Item data
  item: TProps;
  // Selection state
  selectedFile?: string;
  onFileSelect: (file: string) => void;
}) {
  if (item.children?.length) {
    return (
      <Folder
        key={item.id}
        element={item.name}
        value={item.id}
        className="truncate"
      >
        {item.children.map((child) => (
          <TreeItem
            key={child.id}
            item={child}
            selectedFile={selectedFile}
            onFileSelect={onFileSelect}
          />
        ))}
      </Folder>
    );
  }

  return (
    <File
      key={item.id}
      value={item.id}
      onClick={() => onFileSelect(item.id)}
      isSelectable={true}
      isSelect={selectedFile === item.id}
      className="truncate whitespace-nowrap"
    >
      {item.name}
    </File>
  );
}

function FileTree({
  tree,
  selectedFile,
  onFileSelect,
  component,
}: {
  // Tree data
  tree: TProps[];
  selectedFile?: string;
  onFileSelect: (file: string) => void;
  // Component configuration
  component: TComponent;
}) {
  const allExpandableItems = useMemo(function () {
    const expandableItems: string[] = [];
    function traverse(elements: TProps[]) {
      elements.forEach((element) => {
        if (element.children?.length) {
          expandableItems.push(element.id);
          traverse(element.children);
        }
      });
    }
    traverse(tree);
    return expandableItems;
  }, [tree]);

  return (
    <div className="w-full h-full border-r">
      <div className="p-3 border-b flex items-center gap-2 text-left">
        <FileCode className="h-4 w-4" />
        <span className="text-sm font-medium">{component.name} {component.version}</span>
      </div>
      <ScrollArea className="h-96 lg:h-[calc(100vh-300px)]">
        <div className="p-2">
          <Tree
            elements={tree}
            initialExpandedItems={allExpandableItems}
            initialSelectedId={selectedFile}
            indicator
            showIndentLines={component.showIndentLines ?? true}
            enableHoverHighlight={component.enableHoverHighlight ?? true}
          >
            {tree.map((item) => (
              <TreeItem
                key={item.id}
                item={item}
                selectedFile={selectedFile}
                onFileSelect={onFileSelect}
              />
            ))}
          </Tree>
        </div>
      </ScrollArea>
    </div>
  );
}

export default function CodeViewer({
  component,
  className,
  theme,
  defaultDarkTheme,
  defaultLightTheme,
  lang,
  showLineNumbers,
  shikiProps,
  enableThemePicker = false,
}: {
  component: TComponent;
  className?: string;
  /* The theme for the code block accepts light or dark*/
  theme?: "dark" | "light";
  /* The dark theme fallback */
  defaultDarkTheme?: string;
  /* The light theme fallback */
  defaultLightTheme?: string;
  /* The language for the code block responsible for syntax highlighting and icon placement */
  lang?: string;
  /* Whether to show line numbers */
  showLineNumbers?: boolean;
  /* Enable the theme picker in the file header */
  enableThemePicker?: boolean;
  shikiProps?: {
    /* The theme for the code block accepts light or dark*/
    theme?: "dark" | "light";
    /* The dark theme fallback */
    defaultDarkTheme?: string;
    /* The light theme fallback */
    defaultLightTheme?: string;
    /* The language for the code block responsible for syntax highlighting and icon placement */
    lang?: string;
    /* Whether to show line numbers */
    showLineNumbers?: boolean;
    /* The class name for the code block */
    className?: string;
  } & Omit<React.HTMLAttributes<HTMLDivElement>, 'className'>;
}) {
  const [selectedFile, setSelectedFile] = useState<string | undefined>(
    undefined
  );
  const [copied, setCopied] = useState(false);
  const [showMarkdownPreview, setShowMarkdownPreview] = useState(false);
  const files = component.files.filter((f) => f.content);
  
  // Theme management
  const shikiTheme = useShikiTheme({
    defaultDark: defaultDarkTheme,
    defaultLight: defaultLightTheme
  });
  
  // Snap-to-close functionality for the file tree panel
  const snapToCloseHook = useSnapToClosePanel({
    storageKey: `file-tree-panel-${component.name}`,
    defaultSize: 25,
    minSize: 15, // Minimum percentage before snapping
    snapThreshold: 18, // Snap threshold in percentage
    animationDuration: 300
  });

  // Build tree structure
  const tree = useMemo(function () {
    type TTreeNode = {
      id: string;
      name: string;
      path?: string;
      content?: string;
      children?: Record<string, TTreeNode> | TProps[];
      isSelectable?: boolean;
    };
    
    const root: Record<string, TTreeNode> = {};
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
        if (current[part].children && typeof current[part].children === 'object' && !Array.isArray(current[part].children)) {
          current = current[part].children as Record<string, TTreeNode>;
        } else {
          // For leaf nodes, create a new root context
          current = root;
        }
      }
    }
    
    function toArray(obj: Record<string, TTreeNode>): TProps[] {
      return Object.values(obj).map(function (item: TTreeNode): TProps {
        if (item.children && typeof item.children === 'object' && !Array.isArray(item.children)) {
          return {
            id: item.id,
            name: item.name,
            children: toArray(item.children)
          };
        }
        return {
          id: item.id,
          name: item.name,
          children: undefined
        };
      });
    }
    
    return toArray(root);
  }, [files]);

  const selected = files.find((f) => f.path === selectedFile) || files[0];

  useEffect(() => {
    if (!selectedFile && files.length > 0) {
      setSelectedFile(files[0].path);
    }
  }, [files, selectedFile]);

  function handleCopy() {
    if (selected?.content) {
      navigator.clipboard.writeText(selected.content);
      setCopied(true);
      toast.success("File content copied");
      setTimeout(() => setCopied(false), 2000);
    }
  }

  function handleToggleMarkdown() {
    setShowMarkdownPreview(!showMarkdownPreview);
  }

  const renderedMarkdown = useMemo(() => {
    if (selected?.content && selected.path.endsWith(".md") && showMarkdownPreview) {
      return marked(selected.content);
    }
    return null;
  }, [selected?.content, selected?.path, showMarkdownPreview]);

  // Handle file selection with view transitions
  function handleFileSelect(file: string) {
    if (!document.startViewTransition) {
      setSelectedFile(file);
      return;
    }
    
    startTransition(function performFileSwitch() {
      document.startViewTransition(function updateFileContent() {
        setSelectedFile(file);
      });
    });
  }

  // Memoize the file tree to prevent unnecessary re-renders
  const memoizedFileTree = useMemo(function () {
    return (
      <FileTree
        tree={tree}
        selectedFile={selectedFile}
        onFileSelect={handleFileSelect}
        component={component}
      />
    );
  }, [tree, selectedFile, component]);

  return (
    <SnapToCloseResizablePanelGroup
      direction="horizontal"
        className={cn("min-h-[600px] rounded-lg border overflow-hidden", className)}
        onPanelResize={snapToCloseHook.handleResize}
      >
        <SnapToCloseResizablePanel 
          defaultSize={snapToCloseHook.panelState.size}
          minSize={15} 
          maxSize={30}
          storageKey={`file-tree-panel-${component.name}`}
          enableSnapToClose={true}
          snapThreshold={18}
          animationDuration={300}
          className={cn(
            "snap-to-close-panel transition-all",
            snapToCloseHook.panelState.isAnimating && "snap-to-close-panel--animating",
            snapToCloseHook.panelState.isCollapsed && "snap-to-close-panel--collapsed"
          )}
        >
          <div className={cn(
            "snap-to-close-content transition-all",
            snapToCloseHook.panelState.isCollapsed 
              ? "snap-to-close-content--hidden" 
              : "snap-to-close-content--visible"
          )}>
            {memoizedFileTree}
          </div>
          {/* Snap threshold indicator */}
          <div className={cn(
            "snap-to-close-threshold-indicator",
            snapToCloseHook.panelState.size <= 3 && !snapToCloseHook.panelState.isCollapsed && "snap-to-close-threshold-indicator--active"
          )} />
        </SnapToCloseResizablePanel>
{/*         
        <SnapToCloseResizableHandle 
          withHandle 
          snapToCloseHook={snapToCloseHook}
          showToggleButton={true}
          className="snap-to-close-handle"
        />
         */}
        <ResizablePanel defaultSize={0} minSize={0}>
          {selected && (
            <div className="h-full flex flex-col" key={selected.path}>
              <div 
                style={{ viewTransitionName: "file-header" }}
                className="view-transition-header"
              >
                <FileHeader
                  file={selected}
                  onCopy={handleCopy}
                  copied={copied}
                  showMarkdownPreview={showMarkdownPreview}
                  onToggleMarkdown={handleToggleMarkdown}
                  enableThemePicker={enableThemePicker}
                  shikiTheme={shikiTheme}
                />
              </div>
              <div 
                className="flex-1 overflow-hidden min-h-0"
                style={{ viewTransitionName: "file-content" }}
              >
                <ScrollArea className="w-full h-[calc(100vh-20rem)]">
                  {renderedMarkdown ? (
                    <div 
                      className="prose prose-sm max-w-none p-4 dark:prose-invert"
                      dangerouslySetInnerHTML={{ __html: renderedMarkdown }}
                    />
                  ) : (
                    <ShikiViewer
                      key={selected.path}
                      code={selected.content || ""}
                      lang={lang || shikiProps?.lang || selected.path.split(".").pop() || "txt"}
                      showLineNumbers={showLineNumbers ?? shikiProps?.showLineNumbers}
                      className={cn("min-h-full", shikiProps?.className)}
                      selectedTheme={shikiTheme.selectedTheme}
                    />
                  )}
                </ScrollArea>
              </div>
            </div>
          )}
          {!selected && (
            <div className="h-full flex items-center justify-center text-muted-foreground">
              <div className="text-center">
                <FileCode className="h-12 w-12 mx-auto mb-4 opacity-50" />
                <p>Select a file to view its contents</p>
              </div>
            </div>
          )}
        </ResizablePanel>
      </SnapToCloseResizablePanelGroup>
  );
}

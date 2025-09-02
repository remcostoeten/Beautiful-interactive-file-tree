type TTComponent = {
  name: string;
  version: string;
  props: Array<{
    showIndentLines: boolean;
  }>;
  files: Array<{
    path: string;
    content?: string;
  }>;
}

export const data:  TTComponent = {
    name: "file-viewer",
    version: "1.0.0",
    props: [
      {
        showIndentLines: true,
      },
    ],
    files: [
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
  }`,
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
  }`,
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
  }`,
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
  }`,
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
  
  - \`types.ts\` - TypeScript interfaces and types
  - \`components/ShikiViewer.tsx\` - Code syntax highlighting component
  - \`components/FileHeader.tsx\` - File header with actions
  - \`components/FileTree.tsx\` - File tree navigation component
  - \`components/ComponentFileViewer.tsx\` - Main component
  - \`utils.ts\` - Utility functions
  
  ## Dependencies
  
  - React
  - Radix UI (Accordion, Resizable)
  - Lucide React (Icons)
  - Shiki (Syntax highlighting)
  - Next Themes (Theme support)
  - Sonner (Toast notifications)
  
  ## License
  
  MIT`,
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
  }`,
      },
    ],
  };
  
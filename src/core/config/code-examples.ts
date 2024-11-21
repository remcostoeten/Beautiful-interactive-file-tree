export const USAGE_EXAMPLE = `import { IDE } from '@/components/ide'

// Define your file structure
const projectStructure = {
  name: 'project-root',
  type: 'directory',
  children: [
    {
      name: 'src',
      type: 'directory',
      children: [
        {
          name: 'components',
          type: 'directory',
          children: [
            {
              name: 'Button.tsx',
              type: 'file',
              content: '// Your component code...'
            }
          ]
        }
      ]
    }
  ]
}

// Example usage with all available props
export default function IDEExample() {
  return (
    <IDE
      // Required props
      root={projectStructure}
      onSelect={(path) => console.log('Selected:', path)}
      
      // Optional props with defaults
      theme="dark"                // 'light' | 'dark' | 'system'
      defaultOpen={true}         // Auto-expand folders
      maxFilesOpen={5}          // Maximum number of files open at once
      folderColor="#4B5563"     // Custom folder icon color
      defaultSelectedPath=""    // Path to initially selected file
      colorfulIcons={true}     // Use colorful file icons
      showIndentGuides={true}  // Show vertical indent guides
      customIcons={getFileIcon} // Custom icon function
      
      // Additional settings
      defaultSettings={{
        fontSize: 13,
        theme: 'dark',
        activeTabColor: 'blue',
        showMinimap: true,
        wordWrap: true,
        showLineNumbers: true,
      }}
    />
  )
}`

// You might also want to add a type definition example
export const TYPE_DEFINITION = `type IDEProps = {
  // Required props
  root: FileStructure
  onSelect: (path: string) => void
  
  // Optional props
  theme?: 'light' | 'dark' | 'system'
  defaultOpen?: boolean
  maxFilesOpen?: number
  folderColor?: string
  defaultSelectedPath?: string
  colorfulIcons?: boolean
  showIndentGuides?: boolean
  customIcons?: (fileName: string) => React.ReactNode
  defaultSettings?: {
    fontSize?: number
    theme?: string
    activeTabColor?: string
    showMinimap?: boolean
    wordWrap?: boolean
    showLineNumbers?: boolean
  }
}`

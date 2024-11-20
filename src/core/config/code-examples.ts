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
        },
        {
          name: 'app.tsx',
          type: 'file',
          content: '// Your app code...'
        }
      ]
    },
    {
      name: 'package.json',
      type: 'file',
      content: '{ "name": "my-project" }'
    }
  ]
}

// Use the IDE component
export default function MyApp() {
  return (
    <IDE
      root={projectStructure}
      onSelect={(path) => console.log('Selected:', path)}
      theme="dark"  // or "light"
      defaultExpanded={true}  // optionally auto-expand all folders
      customIcons={getFileIcon}
    />
  )
}`

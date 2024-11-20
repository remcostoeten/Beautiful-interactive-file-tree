export type FileExplorer = {
	name: string
	type: 'file' | 'directory'
	children?: FileExplorer[]
	content?: string
	language?: string
}

export const usageExample: FileExplorer = {
	name: 'Usage Example',
	type: 'directory',
	children: [
		{
			name: 'IDE Component Usage',
			type: 'file',
			content: `import { projectStructure } from '../../core/config/tree-object';
import IDE from './ide';

const App = () => {
  const handleFileSelect = (path: string) => {
    console.log('Selected file:', path);
  };

  return (
    <IDE
      root={projectStructure}
      onSelect={handleFileSelect}
      theme="system" // Theme can be 'light', 'dark', or 'system'
      defaultOpen={true} // Whether directories should be open by default
      maxFilesOpen={3} // Maximum number of files that can be opened
      defaultSelectedPath="/src/components/FileTree.tsx" // Default selected file
    />
  );
};

export default App;`,
			language: 'typescript'
		},
		{
			name: 'API Props',
			type: 'file',
			content: `- root: The root file structure to display in the IDE (required).
- onSelect: Callback function when a file is selected (required).
- theme: The theme for the IDE ('light', 'dark', or 'system'). Default is 'system'.
- defaultOpen: Whether directories should be collapsed by default. Default is false.
- maxFilesOpen: Maximum number of files that can be opened at once. Default is 5.
- defaultSelectedPath: Path of the file or folder to be selected by default.`,
			language: 'plaintext'
		}
	]
}

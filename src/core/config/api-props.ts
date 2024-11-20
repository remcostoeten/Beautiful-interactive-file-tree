export const apiProps = [
	{
		title: 'Core Props',
		description: 'Essential properties for the IDE component',
		props: [
			{
				name: 'root',
				type: 'FileStructure',
				description:
					'The root file structure object that defines your file tree',
				required: true,
				defaultValue: '-',
				version: '1.0.0'
			},
			{
				name: 'theme',
				type: '"dark" | "light"',
				description: 'Controls the color scheme of the IDE',
				defaultValue: '"dark"',
				version: '1.0.0'
			},
			{
				name: 'onSelect',
				type: '(path: string) => void',
				description:
					'Callback function triggered when a file is selected',
				defaultValue: '-',
				version: '1.0.0'
			},
			{
				name: 'defaultExpanded',
				type: 'boolean',
				description: 'Whether to expand all folders by default',
				defaultValue: 'false',
				version: '1.0.0'
			}
		]
	},
	{
		title: 'Styling',
		description: 'Visual customization options',
		props: [
			{
				name: 'className',
				type: 'string',
				description:
					'Additional CSS classes to apply to the root element',
				defaultValue: '""',
				version: '1.0.0'
			},
			{
				name: 'iconSize',
				type: 'number',
				description: 'Size of folder and file icons in pixels',
				defaultValue: '16',
				version: '1.0.0'
			},
			{
				name: 'indentSize',
				type: 'number',
				description: 'Indentation size in pixels for nested items',
				defaultValue: '24',
				version: '1.0.0'
			}
		]
	},
	{
		title: 'Behavior',
		description: 'Interactive behavior configuration',
		props: [
			{
				name: 'enableFileIcons',
				type: 'boolean',
				description: 'Show file type icons next to file names',
				defaultValue: 'true',
				version: '1.0.0',
				beta: true
			},
			{
				name: 'enableFolderIcons',
				type: 'boolean',
				description: 'Show folder icons next to directory names',
				defaultValue: 'true',
				version: '1.0.0'
			},
			{
				name: 'enableSelection',
				type: 'boolean',
				description: 'Allow files to be selected',
				defaultValue: 'true',
				version: '1.0.0'
			},
			{
				name: 'enableCollapse',
				type: 'boolean',
				description: 'Allow folders to be collapsed/expanded',
				defaultValue: 'true',
				version: '1.0.0'
			}
		]
	},
	{
		title: 'Advanced',
		description: 'Advanced configuration options',
		props: [
			{
				name: 'customIcons',
				type: 'Record<string, ReactNode>',
				description: 'Custom icons for specific file extensions',
				defaultValue: '{}',
				version: '1.0.0',
				beta: true
			},
			{
				name: 'fileFilter',
				type: '(file: FileStructure) => boolean',
				description:
					'Function to filter which files should be displayed',
				defaultValue: '-',
				version: '1.0.0',
				beta: true
			},
			{
				name: 'sortFiles',
				type: '(a: FileStructure, b: FileStructure) => number',
				description: 'Custom sorting function for files and folders',
				defaultValue: '-',
				version: '1.0.0',
				beta: true
			}
		]
	}
]

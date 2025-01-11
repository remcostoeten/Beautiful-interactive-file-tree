'use client'

import {
	AnimatePresence,
	motion,
	useMotionValue,
	useSpring
} from 'framer-motion'
import { ChevronRight, File, Folder, GripVertical } from 'lucide-react'
import * as React from 'react'
import { Resizable } from 'react-resizable'
import 'react-resizable/css/styles.css'
import { create } from 'zustand'
import { Card } from '../../../../@/components/ui/card'
import { ScrollArea } from '../../../../@/components/ui/scroll-area'
import type { FileIconConfig } from '../../../core/config/file-icons'
import { useDebouncedCallback } from '../../../hooks/use-debounce'
import { cn } from '../../../lib/utils'
import FileViewer from './file-viewer'
import NoFileSelected from './no-file-selected-state'
import SettingsPanel from './settings'

interface FileExplorer {
	name: string
	type: 'file' | 'directory'
	children?: FileExplorer[]
	content?: string
	language?: string
}

interface IDEProps {
	root: FileExplorer
	onSelect: (path: string) => void
	theme?: 'light' | 'dark' | 'system'
	defaultCollapsed?: boolean
	defaultOpen?: boolean
	maxFilesOpen?: number
	folderColor?: string
	iconColor?: string
	defaultSelectedPath?: string
	colorfulIcons?: boolean
	defaultSettings?: Partial<SettingsState>
	rootName?: string
	showIndentGuides?: boolean
	customIcons?: (fileName: string) => FileIconConfig
}

interface FileStoreState {
	expandedPaths: Set<string>
	selectedPath: string | null
	toggleExpanded: (path: string) => void
	setSelectedPath: (path: string) => void
	openedFiles: string[]
	setOpenedFiles: (files: string[]) => void
}

type SetState = (
	partial:
		| FileStoreState
		| Partial<FileStoreState>
		| ((state: FileStoreState) => FileStoreState | Partial<FileStoreState>),
	replace?: boolean | undefined
) => void

// Add this helper function to get all paths except app folder
const getAllPathsExceptApp = (
	node: FileExplorer,
	currentPath = ''
): string[] => {
	const paths: string[] = []
	const fullPath = `${currentPath}/${node.name}`

	// Don't add app folder path
	if (node.type === 'directory' && node.name !== 'app') {
		paths.push(fullPath)
	}

	if (node.children) {
		node.children.forEach((child) => {
			paths.push(...getAllPathsExceptApp(child, fullPath))
		})
	}

	return paths
}

// Update the useFileStore initialization
const useFileStore = create<FileStoreState>((set: SetState) => ({
	// Initialize with all paths expanded except app folder
	expandedPaths: new Set<string>(['/project-root']), // Start with root expanded
	selectedPath: null,
	toggleExpanded: (path: string) =>
		set((state: FileStoreState) => {
			const newExpanded = new Set(state.expandedPaths)
			if (newExpanded.has(path)) {
				newExpanded.delete(path)
			} else {
				newExpanded.add(path)
			}
			return { expandedPaths: newExpanded }
		}),
	setSelectedPath: (path: string) => set({ selectedPath: path }),
	openedFiles: [],
	setOpenedFiles: (files: string[]) => set({ openedFiles: files })
}))

type FileTreeProps = {
	item: FileExplorer
	path?: string
	depth?: number
	defaultCollapsed: boolean
	handleFileSelect: (path: string) => void
	defaultOpen?: boolean
	maxFilesOpen?: number
	folderColor?: string
	iconColor?: string
	colorfulIcons?: boolean
	rootName?: string
	showIndentGuides?: boolean
}

type BinaryFileTypes =
	| '.ico'
	| '.woff'
	| '.woff2'
	| '.ttf'
	| '.eot'
	| '.png'
	| '.jpg'
	| '.jpeg'
	| '.gif'
	| '.webp'

const isBinaryFile = (fileName: string): boolean => {
	const extension = fileName
		.slice(fileName.lastIndexOf('.'))
		.toLowerCase() as BinaryFileTypes
	const binaryExtensions: BinaryFileTypes[] = [
		'.ico',
		'.woff',
		'.woff2',
		'.ttf',
		'.eot',
		'.png',
		'.jpg',
		'.jpeg',
		'.gif',
		'.webp'
	]
	return binaryExtensions.includes(extension)
}

const FILE_ICON_COLORS = {
	'tsconfig.json': 'text-blue-400',
	'package.json': 'text-red-400',
	'.env': 'text-green-400',
	'.tsx': 'text-blue-400',
	'.ts': 'text-blue-400',
	'.js': 'text-yellow-400',
	'.jsx': 'text-yellow-400',
	'.css': 'text-sky-400',
	'.scss': 'text-pink-400',
	'.md': 'text-white',
	'.json': 'text-yellow-400'
} as const

const FOLDER_COLORS = {
	src: 'text-blue-400',
	components: 'text-purple-400',
	pages: 'text-orange-400',
	styles: 'text-pink-400',
	public: 'text-green-400',
	assets: 'text-yellow-400'
} as const

const FileTree: React.FC<FileTreeProps> = ({
	item,
	path = '',
	depth = 0,
	defaultCollapsed,
	handleFileSelect,
	defaultOpen,
	maxFilesOpen,
	folderColor,
	iconColor,
	colorfulIcons = false,
	rootName = 'project-root',
	showIndentGuides = true
}: FileTreeProps) => {
	const {
		expandedPaths,
		selectedPath,
		toggleExpanded,
		setSelectedPath,
		openedFiles,
		setOpenedFiles
	} = useFileStore()
	const fullPath = `${path}/${item.name}`
	const isExpanded = expandedPaths.has(fullPath)
	const isSelected = selectedPath === fullPath

	const isBinary = item.type === 'file' && isBinaryFile(item.name)

	const handleFileOpen = (filePath: string) => {
		if (!openedFiles.includes(filePath)) {
			if (openedFiles.length >= maxFilesOpen) {
				const fileToClose = openedFiles[0]
				setOpenedFiles(
					openedFiles.filter((file) => file !== fileToClose)
				)
			}
			setOpenedFiles([...openedFiles, filePath])
		}
		setSelectedPath(filePath)
		handleFileSelect(filePath)
	}

	const handleClick = (e: React.MouseEvent) => {
		e.stopPropagation()
		if (item.type === 'directory') {
			toggleExpanded(fullPath)
		} else if (!isBinary) {
			handleFileOpen(fullPath)
		}
	}

	const getFileIconColor = (fileName: string) => {
		if (iconColor) return iconColor
		if (!colorfulIcons) return 'text-zinc-400'
		const extension = Object.keys(FILE_ICON_COLORS).find((ext) =>
			fileName.endsWith(ext)
		)
		return extension ? FILE_ICON_COLORS[extension] : 'text-zinc-400'
	}

	const getFolderColor = (folderName: string) => {
		if (folderColor) return folderColor
		if (!colorfulIcons) return 'text-zinc-400'
		return FOLDER_COLORS[folderName] || 'text-zinc-400'
	}

	return (
		<div className="w-full">
			<motion.div
				className={cn(
					'flex items-center gap-2 py-1.5 px-2 text-sm group relative w-full',
					isSelected ? 'bg-[#1e1e1e] text-zinc-100' : 'text-zinc-400',
					!isBinary && 'cursor-pointer hover:text-zinc-300',
					isBinary && 'cursor-not-allowed opacity-60',
					'transition-all duration-200',
					item.type === 'directory' && 'hover:bg-zinc-800/50'
				)}
				style={{ paddingLeft: `${depth * 12 + 8}px` }}
				onClick={handleClick}
				whileHover={{ x: 4 }}
				transition={{ duration: 0.2 }}
			>
				{showIndentGuides && depth > 0 && (
					<div className="absolute left-0 top-0 bottom-0">
						{[...Array(depth)].map((_, index) => (
							<div
								key={index}
								className="absolute bottom-0 top-0 border-l border-zinc-800"
								style={{
									left: `${(index + 1) * 12}px`
								}}
							/>
						))}
					</div>
				)}
				<div className="flex items-center gap-2 min-w-0">
					{item.type === 'directory' && (
						<motion.div
							initial={false}
							animate={{
								rotate: isExpanded ? 90 : 0
							}}
							transition={{
								duration: 0.2,
								type: 'spring',
								stiffness: 200,
								damping: 15
							}}
							className="w-4 h-4 flex items-center justify-center flex-shrink-0"
						>
							<ChevronRight className="w-4 h-4 text-zinc-400" />
						</motion.div>
					)}

					{(depth > 0 || item.type === 'file') &&
						(item.type === 'directory' ? (
							<motion.div
								initial={false}
								animate={{
									scale: isExpanded ? 1.1 : 1
								}}
								transition={{
									duration: 0.2,
									type: 'spring',
									stiffness: 200,
									damping: 15
								}}
								className="flex-shrink-0"
							>
								<Folder
									className={cn(
										'h-4 w-4 transition-colors duration-200',
										getFolderColor(item.name),
										isExpanded && 'text-violet-400'
									)}
								/>
							</motion.div>
						) : (
							<motion.div
								initial={{ scale: 0.8 }}
								animate={{ scale: 1 }}
								whileHover={{ scale: 1.1 }}
								transition={{ duration: 0.2 }}
								className="flex-shrink-0"
							>
								<File
									className={cn(
										'h-4 w-4',
										isBinary
											? 'text-zinc-600'
											: getFileIconColor(item.name)
									)}
								/>
							</motion.div>
						))}
					<span
						className={cn(
							'truncate text-sm',
							isBinary && 'text-zinc-600',
							depth === 0 && 'font-medium'
						)}
					>
						{depth === 0 ? rootName : item.name}
						{isBinary && (
							<span className="ml-2 text-xs text-zinc-600 italic">
								(Binary file)
							</span>
						)}
					</span>
				</div>
			</motion.div>
			<AnimatePresence initial={false}>
				{isExpanded && item.children && (
					<motion.div
						initial={{ height: 0, opacity: 0, y: -10 }}
						animate={{
							height: 'auto',
							opacity: 1,
							y: 0,
							transition: {
								height: { duration: 0.3 },
								opacity: { duration: 0.2, delay: 0.1 },
								y: { duration: 0.2, delay: 0.1 }
							}
						}}
						exit={{
							height: 0,
							opacity: 0,
							y: -10,
							transition: {
								height: { duration: 0.2 },
								opacity: { duration: 0.1 },
								y: { duration: 0.1 }
							}
						}}
					>
						<div className="space-y-1">
							{item.children.map((child: FileExplorer) => (
								<FileTree
									key={`${fullPath}-${child.name}`}
									item={child}
									path={fullPath}
									depth={depth + 1}
									defaultCollapsed={defaultCollapsed}
									handleFileSelect={handleFileSelect}
									defaultOpen={defaultOpen}
									maxFilesOpen={maxFilesOpen}
									folderColor={folderColor}
									iconColor={iconColor}
									colorfulIcons={colorfulIcons}
									rootName={rootName}
									showIndentGuides={showIndentGuides}
								/>
							))}
						</div>
					</motion.div>
				)}
			</AnimatePresence>
		</div>
	)
}

// Add SettingsState type (can be imported from settings.tsx)
type SettingsState = {
	theme: 'light' | 'dark' | 'system'
	colorfulIcons: boolean
	fontSize: number
	activeTabColor: 'blue' | 'purple' | 'pink' | 'green' | 'orange'
	lineNumbers: boolean
	wordWrap: boolean
	showIndentGuides: boolean
	bgOpacity: number
}

export default function IDE({
	root,
	onSelect,
	theme = 'dark',
	defaultCollapsed = false,
	defaultOpen = true,
	maxFilesOpen = 5,
	folderColor,
	iconColor,
	defaultSelectedPath,
	colorfulIcons = false,
	defaultSettings = {},
	rootName = 'project-root',
	showIndentGuides = true,
	customIcons
}: IDEProps) {
	const [mounted, setMounted] = React.useState(false)
	const [settings, setSettings] = React.useState<SettingsState>(() => ({
		theme: theme,
		colorfulIcons: colorfulIcons,
		fontSize: 13,
		activeTabColor: 'blue',
		lineNumbers: true,
		wordWrap: false,
		showIndentGuides: true,
		bgOpacity: 100,
		...defaultSettings
	}))

	React.useEffect(() => {
		setMounted(true)
	}, [])

	const { selectedPath, openedFiles, setSelectedPath, setOpenedFiles } =
		useFileStore()

	React.useEffect(() => {
		if (defaultSelectedPath) {
			setSelectedPath(defaultSelectedPath)
		}
	}, [defaultSelectedPath, setSelectedPath])

	const handleSettingsChange = (newSettings: {
		theme?: 'light' | 'dark' | 'system'
	}) => {
		if (newSettings.theme) {
			setSettings((prev) => ({ ...prev, theme: newSettings.theme }))
		}
	}

	const handleCloseFile = (path: string) => {
		setOpenedFiles(openedFiles.filter((f) => f !== path))
		if (selectedPath === path) {
			setSelectedPath(openedFiles[openedFiles.length - 2] || null)
		}
	}

	// Function to find file content
	const findFileContent = (
		node: FileExplorer,
		targetPath: string
	): { content?: string; language?: string } | null => {
		const nodePath = `/${node.name}`
		if (nodePath === targetPath)
			return { content: node.content, language: node.language }

		if (node.children) {
			for (const child of node.children) {
				const result = findFileContent(
					child,
					targetPath.replace(nodePath, '')
				)
				if (result) return result
			}
		}
		return null
	}

	// Get content of selected file
	const selectedFile = selectedPath
		? findFileContent(root, selectedPath)
		: null

	const [sidebarWidth, setSidebarWidth] = React.useState(240)
	const [isDragging, setIsDragging] = React.useState(false)
	const [tempWidth, setTempWidth] = React.useState(240)

	// Debounced handler for actual width updates
	const debouncedSetWidth = useDebouncedCallback(
		(width: number) => {
			setSidebarWidth(width)
		},
		50 // 50ms delay
	)

	const handleResize = (
		_: React.SyntheticEvent,
		{ size }: { size: { width: number; height: number } }
	) => {
		setTempWidth(size.width) // Update immediately for visual feedback
		debouncedSetWidth(size.width) // Debounced actual update
	}

	// Add mouse follow gradient effect
	const mouseX = useMotionValue(0)
	const mouseY = useMotionValue(0)

	const springX = useSpring(mouseX, { damping: 30, stiffness: 200 })
	const springY = useSpring(mouseY, { damping: 30, stiffness: 200 })

	const handleMouseMove = (e: React.MouseEvent) => {
		const rect = e.currentTarget.getBoundingClientRect()
		mouseX.set(e.clientX - rect.left)
		mouseY.set(e.clientY - rect.top)
	}

	// Add this effect to initialize expanded paths
	React.useEffect(() => {
		const initialPaths = getAllPathsExceptApp(root)
		useFileStore.setState((state) => ({
			...state,
			expandedPaths: new Set(['/project-root', ...initialPaths])
		}))
	}, [root])

	const [isMounted, setIsMounted] = React.useState(false)

	React.useEffect(() => {
		setIsMounted(true)
	}, [])

	return (
		<Card
			className={cn(
				'w-full relative overflow-hidden backdrop-blur-sm rounded-xl',
				settings.theme === 'dark'
					? 'bg-[#000000] border-[#333333]'
					: 'bg-white border-zinc-200',
				settings.theme === 'dark' ? 'dark' : 'light'
			)}
			style={{
				backgroundColor:
					settings.theme === 'dark'
						? `rgba(0, 0, 0, ${settings.bgOpacity / 100})`
						: `rgba(255, 255, 255, ${settings.bgOpacity / 100})`
			}}
			onMouseMove={handleMouseMove}
		>
			{/* Gradient overlay */}
			<motion.div
				className={cn(
					'absolute inset-0 pointer-events-none opacity-[0.03]',
					settings.theme === 'dark' ? 'bg-blue-500' : 'bg-violet-500'
				)}
				style={
					{
						background:
							settings.theme === 'dark'
								? 'radial-gradient(800px circle at var(--mouse-x) var(--mouse-y), rgba(29, 78, 216, 0.06), transparent 80%)'
								: 'radial-gradient(800px circle at var(--mouse-x) var(--mouse-y), rgba(124, 58, 237, 0.06), transparent 80%)',
						'--mouse-x': springX,
						'--mouse-y': springY,
						zIndex: 0
					} as any
				}
			/>

			{/* Content overlay */}
			<div
				className={cn(
					'absolute inset-0 pointer-events-none',
					settings.theme === 'dark' ? 'bg-black/40' : 'bg-white/40'
				)}
				style={{ zIndex: 1 }}
			/>

			{/* Main content */}
			<div className="flex h-[600px] relative" style={{ zIndex: 2 }}>
				<Resizable
					width={sidebarWidth}
					height={600}
					onResize={handleResize}
					onResizeStart={() => setIsDragging(true)}
					onResizeStop={() => setIsDragging(false)}
					minConstraints={[200, 600]}
					maxConstraints={[400, 600]}
					handle={
						<div className="absolute right-0 top-0 bottom-0 w-[2px] cursor-col-resize group z-50">
							<div className="absolute right-0 top-0 bottom-0 w-[1px] bg-[#333333]/50 group-hover:bg-blue-500/50 transition-colors" />
							<div className="absolute top-1/2 -translate-y-1/2 right-[-4px] opacity-0 group-hover:opacity-100 transition-all duration-200">
								<div className="bg-[#1e1e1e] border border-[#333333] rounded-md p-1 shadow-xl">
									<GripVertical
										size={12}
										className="text-zinc-400 group-hover:text-blue-400 transition-colors"
									/>
								</div>
							</div>
							<div className="absolute inset-0 w-8 -left-3 opacity-0 group-hover:opacity-5 bg-blue-500 transition-opacity duration-200" />
						</div>
					}
					axis="x"
					draggableOpts={{
						enableUserSelectHack: false,
						grid: [1, 1] // Smoother dragging
					}}
				>
					<div
						style={{
							width: isDragging ? tempWidth : sidebarWidth,
							transform: `translateX(0)`,
							willChange: 'transform'
						}}
						className={cn(
							'relative border-r h-full transition-colors duration-200',
							settings.theme === 'dark'
								? 'border-[#333333]/30 bg-[#000000]'
								: 'border-zinc-200/30 bg-white'
						)}
					>
						{mounted && (
							<div className="absolute top-2 right-2 z-10">
								<SettingsPanel
									settings={settings}
									onSettingsChange={(newSettings) =>
										setSettings((prev) => ({
											...prev,
											...newSettings
										}))
									}
								/>
							</div>
						)}
						<ScrollArea className="h-[600px]">
							<div className="p-2 pb-40">
								<div className="space-y-1">
									<FileTree
										key={`file-tree-${root.name}`}
										item={root}
										defaultCollapsed={defaultCollapsed}
										handleFileSelect={onSelect}
										defaultOpen={defaultOpen}
										maxFilesOpen={maxFilesOpen}
										folderColor={folderColor}
										iconColor={iconColor}
										colorfulIcons={settings.colorfulIcons}
										rootName={rootName}
										showIndentGuides={
											settings.showIndentGuides
										}
										depth={0}
									/>
								</div>
							</div>
						</ScrollArea>
						<div className="absolute bottom-0 left-0 right-0 pointer-events-none">
							<div className="h-[1px] w-full bg-[#333333]/20" />
							<div
								className="h-40 bg-gradient-to-t from-black via-black/80 to-transparent"
								style={{
									backdropFilter: 'blur(4px)',
									WebkitMaskImage:
										'linear-gradient(to top, black, transparent)',
									maskImage:
										'linear-gradient(to top, black, transparent)'
								}}
							/>
						</div>
					</div>
				</Resizable>
				<div
					className={cn(
						'flex-1',
						settings.theme === 'dark' ? 'bg-[#000000]' : 'bg-white'
					)}
				>
					{selectedFile?.content ? (
						<FileViewer
							content={selectedFile.content}
							language={selectedFile.language}
							theme={settings.theme}
							openedFiles={openedFiles}
							selectedPath={selectedPath}
							onCloseFile={handleCloseFile}
							onSelectFile={setSelectedPath}
							fontSize={settings.fontSize}
							activeTabColor={settings.activeTabColor}
							lineNumbers={settings.lineNumbers}
							wordWrap={settings.wordWrap}
						/>
					) : (
						<NoFileSelected />
					)}
				</div>
			</div>
		</Card>
	)
}

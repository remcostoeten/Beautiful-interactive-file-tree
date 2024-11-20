'use client'

import { AnimatePresence, motion } from 'framer-motion'
import { X } from 'lucide-react'
import { PrismAsyncLight as SyntaxHighlighter } from 'react-syntax-highlighter'
import { ScrollArea } from '../../../../@/components/ui/scroll-area'
import { cn } from '../../../lib/utils'
import { customTheme } from '../../code-block/custom-theme'
import { customLightTheme } from '../../code-block/light-theme'

type FileViewerProps = {
	content?: string
	language?: string
	theme?: 'light' | 'dark' | 'system'
	openedFiles: string[]
	selectedPath: string | null
	onCloseFile: (path: string) => void
	onSelectFile: (path: string) => void
	fontSize?: number
	activeTabColor?: 'blue' | 'purple' | 'pink' | 'green' | 'orange'
	lineNumbers?: boolean
	wordWrap?: boolean
}

const TAB_COLORS = {
	blue: 'before:bg-blue-400',
	purple: 'before:bg-purple-400',
	pink: 'before:bg-pink-400',
	green: 'before:bg-green-400',
	orange: 'before:bg-orange-400'
} as const

export default function FileViewer({
	content,
	language = 'typescript',
	theme = 'system',
	openedFiles,
	selectedPath,
	onCloseFile,
	onSelectFile,
	fontSize = 13,
	activeTabColor = 'blue',
	lineNumbers = true,
	wordWrap = false
}: FileViewerProps) {
	if (!content) return null

	const getFileName = (path: string) => path.split('/').pop() || path

	return (
		<div className="flex flex-col h-full">
			{/* Header with tabs and window controls */}
			<div
				className={cn(
					'flex items-center justify-between border-b px-4',
					theme === 'dark' ? 'border-[#333333]' : 'border-zinc-200'
				)}
			>
				<div className="flex-1 flex">
					<AnimatePresence initial={false}>
						{openedFiles.map((file) => (
							<motion.button
								key={file}
								initial={{ opacity: 0, x: -8 }}
								animate={{ opacity: 1, x: 0 }}
								exit={{ opacity: 0, x: -8 }}
								transition={{
									duration: 0.2,
									ease: [0.16, 1, 0.3, 1]
								}}
								onClick={() => onSelectFile(file)}
								className={cn(
									'group relative h-9 flex items-center gap-2 px-4 text-sm font-medium transition-colors',
									selectedPath === file
										? `text-zinc-100 before:absolute before:bottom-0 before:left-0 before:h-[2px] before:w-full ${TAB_COLORS[activeTabColor]}`
										: 'text-zinc-400 hover:text-zinc-300'
								)}
							>
								{getFileName(file)}
								<motion.div
									initial={{ opacity: 0, scale: 0.8 }}
									animate={{ opacity: 1, scale: 1 }}
									exit={{ opacity: 0, scale: 0.8 }}
									transition={{ duration: 0.15 }}
								>
									<X
										size={14}
										className="opacity-0 group-hover:opacity-100 hover:text-red-400"
										onClick={(e) => {
											e.stopPropagation()
											onCloseFile(file)
										}}
									/>
								</motion.div>
							</motion.button>
						))}
					</AnimatePresence>
				</div>
				<div className="flex items-center space-x-2">
					<div className="h-3 w-3 rounded-full bg-[#333333]" />
					<div className="h-3 w-3 rounded-full bg-[#333333]" />
					<div className="h-3 w-3 rounded-full bg-[#333333]" />
				</div>
			</div>

			{/* Code viewer without animations */}
			<div className="flex-1 relative">
				<ScrollArea className="h-full">
					<div
						className="relative font-mono pb-40"
						style={{ fontSize: `${fontSize}px` }}
					>
						<SyntaxHighlighter
							language={language}
							style={
								theme === 'dark'
									? customTheme
									: customLightTheme
							}
							showLineNumbers={lineNumbers}
							lineNumberStyle={{
								minWidth: '1.5rem',
								paddingRight: '0.25rem',
								textAlign: 'right',
								color: '#666',
								marginRight: '0.25rem',
								userSelect: 'none'
							}}
							customStyle={{
								margin: 0,
								padding: '1rem 0',
								background: 'transparent',
								fontSize: `${fontSize}px`,
								lineHeight: '1.5',
								width: '100%',
								overflowX: 'auto'
							}}
							codeTagProps={{
								style: {
									fontSize: `${fontSize}px`,
									lineHeight: '1.5',
									fontFamily: 'var(--font-geist-mono)',
									whiteSpace: wordWrap ? 'pre-wrap' : 'pre'
								}
							}}
							wrapLongLines={wordWrap}
						>
							{content}
						</SyntaxHighlighter>
					</div>
				</ScrollArea>
				{/* Add the same fade effect */}
				<div className="absolute bottom-0 left-0 right-0 pointer-events-none">
					<div
						className={cn(
							'h-[1px] w-full',
							theme === 'dark'
								? 'bg-[#333333]/20'
								: 'bg-zinc-200/20'
						)}
					/>
					<div
						className={cn(
							'h-40',
							theme === 'dark'
								? 'bg-gradient-to-t from-black via-black/80 to-transparent'
								: 'bg-gradient-to-t from-white via-white/80 to-transparent'
						)}
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
		</div>
	)
}

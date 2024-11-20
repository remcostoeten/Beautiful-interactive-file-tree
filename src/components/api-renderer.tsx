import { cn } from '../lib/utils'

import * as Tooltip from '@radix-ui/react-tooltip'
import { AnimatePresence, motion } from 'framer-motion'
import { Check, ChevronDown, Copy, ExternalLink, Search } from 'lucide-react'
import { useEffect, useRef, useState } from 'react'
import { Resizable } from 'react-resizable'
import 'react-resizable/css/styles.css'

const THEME_CONFIG = {
	light: {
		background: 'bg-white',
		border: 'border-gray-200',
		text: 'text-gray-900',
		secondaryText: 'text-gray-600',
		hover: 'hover:bg-gray-50',
		divider: 'divide-gray-200',
		input: {
			background: 'bg-white',
			border: 'border-gray-200',
			focus: 'focus:border-blue-500 focus:ring-blue-500/20'
		},
		code: 'text-purple-600',
		badge: {
			default: 'bg-gray-100 text-gray-700 border-gray-200',
			required: 'text-red-600',
			beta: 'bg-blue-50 text-blue-600 border-blue-200',
			deprecated: 'bg-red-50 text-red-600 border-red-200',
			experimental: 'bg-amber-50 text-amber-600 border-amber-200'
		},
		section: {
			header: 'bg-white',
			description: 'text-gray-600'
		},
		table: {
			header: 'bg-gray-50',
			row: 'even:bg-gray-200/50'
		}
	},
	dark: {
		background: 'bg-[#000000]',
		border: 'border-[#333333]',
		text: 'text-zinc-200',
		secondaryText: 'text-zinc-400',
		hover: 'hover:bg-[#1e1e1e]',
		divider: 'divide-[#333333]',
		input: {
			background: 'bg-[#111111]',
			border: 'border-[#333333]',
			focus: 'focus:border-blue-500 focus:ring-blue-500/20'
		},
		code: 'text-blue-400',
		badge: {
			default: 'bg-[#1e1e1e] text-zinc-300 border-[#333333]',
			required: 'text-red-400',
			beta: 'bg-blue-500/10 text-blue-400 border-blue-500/20',
			deprecated: 'bg-red-500/10 text-red-400 border-red-500/20',
			experimental:
				'bg-yellow-500/10 text-yellow-400 border-yellow-500/20'
		},
		section: {
			header: 'bg-[#111111]',
			description: 'text-zinc-400'
		},
		table: {
			header: 'bg-[#111111]',
			row: 'even:bg-[#111111]/50'
		}
	},
	system: {
		background: 'dark:bg-zinc-900/50 bg-gray-50/80',
		border: 'dark:border-zinc-800 border-gray-200',
		text: 'dark:text-zinc-200 text-gray-900',
		secondaryText: 'dark:text-zinc-400 text-gray-600',
		hover: 'dark:hover:bg-zinc-800/50 hover:bg-gray-100/80',
		divider: 'dark:divide-zinc-800 divide-gray-200',
		input: {
			background: 'dark:bg-zinc-900/50 bg-white/80',
			border: 'dark:border-zinc-800 border-gray-200',
			focus: 'focus:border-blue-500 focus:ring-blue-500/20'
		},
		code: 'dark:text-purple-400 text-purple-700',
		badge: {
			default:
				'dark:bg-zinc-800/50 dark:text-zinc-300 dark:border-zinc-700 bg-white/80 text-gray-700 border-gray-200',
			required: 'dark:text-red-400 text-red-600',
			beta: 'dark:bg-blue-500/10 dark:text-blue-400 dark:border-blue-500/20 bg-blue-50/80 text-blue-700 border-blue-200',
			deprecated:
				'dark:bg-red-500/10 dark:text-red-400 dark:border-red-500/20 bg-red-50/80 text-red-700 border-red-200',
			experimental:
				'dark:bg-yellow-500/10 dark:text-yellow-400 dark:border-yellow-500/20 bg-amber-50/80 text-amber-700 border-amber-200'
		},
		section: {
			header: 'dark:bg-zinc-900/70 bg-white/80',
			description: 'dark:text-zinc-400 text-gray-600'
		},
		table: {
			header: 'dark:bg-zinc-900/90 bg-white/90',
			row: 'dark:even:bg-zinc-800/30 even:bg-gray-50/50'
		}
	}
} as const

/**
 * Configuration for different spacing options in the component
 */
const SPACING_CONFIG = {
	section: {
		compact: 'space-y-2',
		normal: 'space-y-6',
		relaxed: 'space-y-8'
	},
	prop: {
		none: 'divide-y-0 [&_td]:py-2',
		tight: 'divide-y [&_td]:py-2',
		normal: 'divide-y [&_td]:py-4',
		relaxed: 'divide-y [&_td]:py-6'
	}
} as const

/**
 * Represents a possible value for a prop with optional description
 */
type PropValue = {
	value: string
	description?: string
}

/**
 * Represents a single property item in the API documentation
 */
type PropItem = {
	/** The name of the property */
	name: string
	/** The type definition of the property */
	type: string
	/** Description of what the property does */
	description: string
	/** Whether the property is required */
	required?: boolean
	/** Default value if not specified */
	defaultValue?: string
	/** External documentation link */
	link?: string
	/** Whether the property is deprecated */
	deprecated?: boolean
	/** Version when the property was introduced */
	since?: string
	/** Example usage of the property */
	example?: string
	/** Whether the property is in beta */
	beta?: boolean
	/** Whether the property is experimental */
	experimental?: boolean
	/** Possible values for enum/union types */
	values?: PropValue[]
	/** Additional notes or warnings */
	notes?: string[]
	/** Code snippets demonstrating usage */
	codeSnippets?: Array<{
		language: string
		code: string
		description?: string
	}>
	/** Related properties */
	relatedProps?: string[]
	/** Version history */
	changelog?: Array<{
		version: string
		changes: string
	}>
}

/**
 * Represents a section of properties in the documentation
 */
type Section = {
	/** Section title */
	title: string
	/** Section description */
	description: string
	/** Properties in this section */
	props: PropItem[]
	/** Whether the section should be expanded by default */
	expandedByDefault?: boolean
	/** Optional icon for the section */
	icon?: React.ReactNode
	/** Whether the section is in beta */
	beta?: boolean
}

/**
 * Props for the PropsTable component
 */
type PropsTableProps = {
	/** Array of sections containing props */
	sections: Section[]
	/** Whether to show the type column */
	showTypeColumn?: boolean
	/** Whether to show the default value column */
	showDefaultColumn?: boolean
	/** Additional className for the container */
	className?: string
	/** Whether to show the search input */
	searchable?: boolean
	/** Whether sections can be collapsed */
	collapsible?: boolean
	/** Whether to show the copy button */
	showCopyButton?: boolean
	/** Whether to show version badges */
	showVersionBadges?: boolean
	/** Whether to show beta badges */
	showBetaBadges?: boolean
	/** Initial theme setting */
	initialTheme?: ThemeOption
	/** Initial section spacing */
	initialSpacing?: SpacingOption
	/** Initial prop spacing */
	initialPropSpacing?: PropSpacingOption
	/** Callback when a prop is clicked */
	onPropClick?: (propName: string) => void
	/** Custom badges configuration */
	customBadges?: Record<
		string,
		{
			text: string
			className: string
		}
	>
}

const SECTION_ANIMATION = {
	initial: { opacity: 0, y: 10 },
	animate: { opacity: 1, y: 0 },
	transition: { duration: 0.2, ease: 'easeOut' }
} as const

type ThemeOption = keyof typeof THEME_CONFIG
type SpacingOption = keyof typeof SPACING_CONFIG.section
type PropSpacingOption = keyof typeof SPACING_CONFIG.prop

type SettingsState = {
	theme: ThemeOption
	spacing: SpacingOption
	propSpacing: PropSpacingOption
}

// Add these animation constants
const POPOVER_ANIMATION = {
	initial: { opacity: 0, scale: 0.95 },
	animate: { opacity: 1, scale: 1 },
	exit: { opacity: 0, scale: 0.95 },
	transition: { duration: 0.2, ease: 'easeOut' }
} as const

const STAGGER_ANIMATION = {
	initial: { opacity: 0, y: 10 },
	animate: { opacity: 1, y: 0 },
	transition: { duration: 0.2, ease: 'easeOut' }
} as const

const STAGGER_CONTAINER = {
	animate: {
		transition: {
			staggerChildren: 0.1
		}
	}
} as const

// Update the COLUMN_WIDTHS constant with more consistent widths
const COLUMN_WIDTHS = {
	prop: 'w-[220px] min-w-[220px] max-w-[220px] truncate',
	type: 'w-[220px] min-w-[220px] max-w-[220px] truncate',
	default: 'w-[160px] min-w-[160px] max-w-[160px] truncate', // Slightly smaller for default values
	description: 'w-full min-w-[220px]', // Same base width as others
	actions: 'w-[40px] min-w-[40px] max-w-[40px]'
} as const

// Note: To implement draggable columns, we would need to:
// 1. Add react-resizable or similar library
// 2. Track column widths in state
// 3. Add resize handlers
// 4. Store preferences in localStorage

// Example implementation structure (to be implemented later):
/*
type ColumnWidth = {
  prop: number;
  type: number;
  default: number;
  description: number;
};

const [columnWidths, setColumnWidths] = useState<ColumnWidth>(() => {
  // Load from localStorage or use defaults
  return {
    prop: 220,
    type: 220,
    default: 160,
    description: 220
  };
});

// Add resize handlers to th elements
<th 
  className={...}
  style={{ width: columnWidths.prop }}
  // Add resize handlers here
>
*/

const DETAILS_ANIMATION = {
	initial: {
		height: 0,
		opacity: 0,
		scale: 0.98,
		transformOrigin: 'top'
	},
	animate: {
		height: 'auto',
		opacity: 1,
		scale: 1,
		transformOrigin: 'top'
	},
	exit: {
		height: 0,
		opacity: 0,
		scale: 0.98,
		transformOrigin: 'top'
	},
	transition: {
		height: {
			duration: 0.25,
			ease: [0.32, 0.72, 0, 1]
		},
		opacity: {
			duration: 0.15,
			ease: 'easeOut'
		},
		scale: {
			duration: 0.15,
			ease: 'easeOut'
		}
	}
} as const

// Add this type near other type definitions
type PillProps = {
	variant?: 'default' | 'info' | 'success' | 'warning' | 'error' | 'beta'
	children: React.ReactNode
	className?: string
}

// Add this component near other component definitions
function Pill({ variant = 'default', children, className }: PillProps) {
	const variants = {
		default: 'bg-[#1e1e1e] text-zinc-300 border-[#333333]',
		info: 'bg-blue-500/10 text-blue-400 border-blue-500/20',
		success: 'bg-green-500/10 text-green-400 border-green-500/20',
		warning: 'bg-yellow-500/10 text-yellow-400 border-yellow-500/20',
		error: 'bg-red-500/10 text-red-400 border-red-500/20',
		beta: 'bg-purple-500/10 text-purple-400 border-purple-500/20'
	}

	return (
		<span
			className={cn(
				'text-xs px-2 py-0.5 rounded-full border shrink-0 whitespace-nowrap',
				variants[variant],
				className
			)}
		>
			{children}
		</span>
	)
}

// Add this component definition before the PropsTable component
type TruncatedTextProps = {
	text: string
	className?: string
}

function TruncatedText({ text, className }: TruncatedTextProps) {
	const [isTruncated, setIsTruncated] = useState(false)
	const [isDragging, setIsDragging] = useState(false)
	const [dragStart, setDragStart] = useState(0)
	const [scrollLeft, setScrollLeft] = useState(0)
	const containerRef = useRef<HTMLDivElement>(null)
	const textRef = useRef<HTMLSpanElement>(null)

	useEffect(() => {
		const element = textRef.current
		if (element) {
			setIsTruncated(element.scrollWidth > element.clientWidth)
		}
	}, [text])

	const handleMouseDown = (e: React.MouseEvent) => {
		setIsDragging(true)
		setDragStart(e.clientX - scrollLeft)
	}

	const handleMouseMove = (e: React.MouseEvent) => {
		if (!isDragging || !containerRef.current || !textRef.current) return

		const x = e.clientX - dragStart
		const maxScroll =
			textRef.current.scrollWidth - containerRef.current.clientWidth
		const newScrollLeft = Math.max(Math.min(0, x), -maxScroll)

		setScrollLeft(newScrollLeft)
	}

	const handleMouseUp = () => {
		setIsDragging(false)
	}

	const handleMouseLeave = () => {
		if (isDragging) {
			setIsDragging(false)
		}
	}

	useEffect(() => {
		setScrollLeft(0)
	}, [text])

	if (!isTruncated) {
		return (
			<span ref={textRef} className={className}>
				{text}
			</span>
		)
	}

	const Content = () => (
		<div
			ref={containerRef}
			className={cn(
				'relative overflow-hidden cursor-grab active:cursor-grabbing',
				isDragging && 'select-none'
			)}
			onMouseDown={handleMouseDown}
			onMouseMove={handleMouseMove}
			onMouseUp={handleMouseUp}
			onMouseLeave={handleMouseLeave}
		>
			<motion.div
				animate={{ x: scrollLeft }}
				transition={{ type: 'spring', bounce: 0 }}
				drag="x"
				dragConstraints={{
					left: containerRef.current
						? -1 *
							((textRef.current?.scrollWidth || 0) -
								(containerRef.current?.clientWidth || 0))
						: 0,
					right: 0
				}}
				dragElastic={0.1}
				dragMomentum={false}
				className="cursor-grab active:cursor-grabbing"
			>
				<span
					ref={textRef}
					className={cn(className, 'whitespace-nowrap inline-block')}
				>
					{text}
				</span>
			</motion.div>
			{isTruncated && (
				<div className="absolute inset-y-0 right-0 w-8 bg-gradient-to-l from-zinc-900 to-transparent pointer-events-none" />
			)}
		</div>
	)

	return (
		<Tooltip.Provider delayDuration={300}>
			<Tooltip.Root>
				<Tooltip.Trigger asChild>
					<div className="w-full">
						<Content />
					</div>
				</Tooltip.Trigger>
				<Tooltip.Portal>
					<Tooltip.Content
						className="z-50 px-3 py-1.5 text-sm bg-zinc-900 text-zinc-200 rounded-lg shadow-xl border border-zinc-800 max-w-xs break-words animate-in fade-in-0 zoom-in-95"
						side="top"
						sideOffset={4}
					>
						{text}
						<Tooltip.Arrow className="fill-zinc-900" />
					</Tooltip.Content>
				</Tooltip.Portal>
			</Tooltip.Root>
		</Tooltip.Provider>
	)
}

// Add this type for column widths
type ColumnWidth = {
	prop: number
	type: number
	default: number
	description: number
	actions: number
}

// Add this helper component for the draggable badges container
function DraggableBadges({
	children,
	className
}: {
	children: React.ReactNode
	className?: string
}) {
	const containerRef = useRef<HTMLDivElement>(null)
	const [isDragging, setIsDragging] = useState(false)
	const [isTruncated, setIsTruncated] = useState(false)
	const dragStartTime = useRef<number>(0)

	// Check if content is truncated
	useEffect(() => {
		const element = containerRef.current
		if (element) {
			setIsTruncated(element.scrollWidth > element.clientWidth)
		}
	}, [children])

	const Content = () => (
		<div
			ref={containerRef}
			className={cn(
				'relative overflow-hidden',
				isDragging && 'select-none',
				className
			)}
			onClick={(e) => {
				// Prevent click propagation if we were dragging
				if (isDragging || Date.now() - dragStartTime.current < 200) {
					e.stopPropagation()
				}
			}}
		>
			<motion.div
				drag={isTruncated ? 'x' : false}
				dragConstraints={containerRef}
				dragElastic={0.1}
				dragMomentum={false}
				onDragStart={() => {
					setIsDragging(true)
					dragStartTime.current = Date.now()
				}}
				onDragEnd={() => {
					setIsDragging(false)
					// Keep dragStartTime for a short while to prevent click
				}}
				className={cn(
					'flex items-center gap-1',
					isTruncated && 'cursor-grab active:cursor-grabbing'
				)}
			>
				{children}
			</motion.div>
			{isTruncated && (
				<div className="absolute inset-y-0 right-0 w-8 bg-gradient-to-l from-zinc-900 to-transparent pointer-events-none" />
			)}
		</div>
	)

	// Show tooltip only if content is truncated
	if (!isTruncated) {
		return <Content />
	}

	return (
		<Tooltip.Provider delayDuration={300}>
			<Tooltip.Root>
				<Tooltip.Trigger asChild>
					<div className="w-full">
						<Content />
					</div>
				</Tooltip.Trigger>
				<Tooltip.Portal>
					<Tooltip.Content
						className="z-50 px-3 py-1.5 text-sm bg-zinc-900 text-zinc-200 rounded-lg shadow-xl border border-zinc-800 max-w-xs break-words animate-in fade-in-0 zoom-in-95"
						side="top"
						sideOffset={4}
					>
						<div className="flex flex-wrap gap-1">{children}</div>
						<Tooltip.Arrow className="fill-zinc-900" />
					</Tooltip.Content>
				</Tooltip.Portal>
			</Tooltip.Root>
		</Tooltip.Provider>
	)
}

// Add this helper function at the top level
const getInitialColumnWidths = (): ColumnWidth => ({
	prop: 220,
	type: 220,
	default: 160,
	description: 300,
	actions: 40
})

export default function PropsTable({
	sections,
	showTypeColumn = true,
	showDefaultColumn = true,
	className,
	searchable = true,
	collapsible = true,
	showVersionBadges = true,
	showBetaBadges = true,
	initialTheme = 'dark',
	initialSpacing = 'normal',
	initialPropSpacing = 'normal',
	onPropClick,
	customBadges
}: PropsTableProps) {
	const [searchQuery, setSearchQuery] = useState('')
	const [copiedProp, setCopiedProp] = useState<string | null>(null)
	const [expandedSections, setExpandedSections] = useState<
		Record<string, boolean>
	>(
		sections.reduce(
			(acc, section) => ({
				...acc,
				[section.title]: section.expandedByDefault ?? true
			}),
			{}
		)
	)

	const currentTheme = THEME_CONFIG[initialTheme]

	// Update the columnWidths state in PropsTable component
	const [columnWidths, setColumnWidths] = useState<ColumnWidth>(
		getInitialColumnWidths()
	)

	// Add this effect to load from localStorage only on client side
	useEffect(() => {
		// Only run on client side
		if (typeof window !== 'undefined') {
			const saved = localStorage.getItem('api-renderer-column-widths')
			if (saved) {
				try {
					const parsed = JSON.parse(saved)
					setColumnWidths(parsed)
				} catch {
					console.error('Failed to parse saved column widths')
				}
			}
		}
	}, []) // Run once on mount

	// Update the save effect to only run on client side
	useEffect(() => {
		if (typeof window !== 'undefined') {
			localStorage.setItem(
				'api-renderer-column-widths',
				JSON.stringify(columnWidths)
			)
		}
	}, [columnWidths])

	// Handle column resize
	const onResize =
		(column: keyof ColumnWidth) =>
		(_e: React.SyntheticEvent, { size }: { size: { width: number } }) => {
			setColumnWidths((prev) => ({
				...prev,
				[column]: Math.max(size.width, 100)
			}))
		}

	// Resizable column header component
	const ResizableHeader = ({
		column,
		children
	}: {
		column: keyof ColumnWidth
		children: React.ReactNode
	}) => (
		<Resizable
			width={columnWidths[column]}
			height={0}
			handle={
				<div
					className="absolute right-0 top-0 h-full w-2 cursor-col-resize group"
					style={{ touchAction: 'none' }}
				>
					<div className="h-full w-1 group-hover:bg-blue-500/50 transition-colors" />
				</div>
			}
			onResize={onResize(column)}
			draggableOpts={{ enableUserSelectHack: false }}
		>
			<th
				className={cn(
					'px-6 py-3 text-left text-xs font-medium uppercase tracking-wider relative',
					currentTheme.secondaryText
				)}
				style={{ width: columnWidths[column] }}
			>
				{children}
			</th>
		</Resizable>
	)

	const filterProps = (props: PropItem[]) => {
		if (!searchQuery) return props
		return props.filter(
			(prop) =>
				prop.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
				prop.description
					.toLowerCase()
					.includes(searchQuery.toLowerCase()) ||
				prop.type.toLowerCase().includes(searchQuery.toLowerCase())
		)
	}

	const handleCopy = (text: string, propName: string) => {
		navigator.clipboard.writeText(text)
		setCopiedProp(propName)
		setTimeout(() => setCopiedProp(null), 2000)
	}

	return (
		<div
			className={cn(
				'w-full rounded-xl backdrop-blur-sm border',
				SPACING_CONFIG.section[initialSpacing],
				currentTheme.background,
				currentTheme.border,
				className
			)}
		>
			<div className="flex items-center justify-between mb-4">
				{searchable && (
					<div className="relative flex-1">
						<Search
							className={cn(
								'absolute left-3 top-1/2 transform -translate-y-1/2',
								currentTheme.secondaryText
							)}
							size={16}
						/>
						<input
							type="text"
							placeholder="Search props..."
							className={cn(
								'w-full pl-10 pr-4 py-3 rounded-lg text-sm transition-colors',
								currentTheme.input.background,
								currentTheme.input.border,
								currentTheme.input.focus,
								currentTheme.text
							)}
							value={searchQuery}
							onChange={(e) => setSearchQuery(e.target.value)}
						/>
					</div>
				)}
			</div>

			{sections.map((section, sectionIndex) => {
				const filteredProps = filterProps(section.props)
				if (filteredProps.length === 0) return null

				return (
					<motion.div
						key={sectionIndex}
						{...SECTION_ANIMATION}
						className={cn(
							'rounded-xl border overflow-hidden',
							currentTheme.border,
							currentTheme.background
						)}
					>
						<div
							className={cn(
								'px-6 py-4 border-b transition-colors',
								currentTheme.border,
								currentTheme.section.header,
								collapsible && 'cursor-pointer',
								collapsible && currentTheme.hover
							)}
							onClick={() =>
								collapsible &&
								setExpandedSections((prev) => ({
									...prev,
									[section.title]: !prev[section.title]
								}))
							}
						>
							<div className="flex items-center justify-between">
								<div>
									<h3
										className={cn(
											'text-lg font-medium',
											currentTheme.text
										)}
									>
										{section.title}
									</h3>
									{section.description && (
										<p
											className={cn(
												'mt-1 text-sm',
												currentTheme.secondaryText
											)}
										>
											{section.description}
										</p>
									)}
								</div>
								{collapsible && (
									<ChevronDown
										className={cn(
											'transform transition-transform duration-300',
											currentTheme.secondaryText,
											expandedSections[section.title]
												? 'rotate-180'
												: ''
										)}
										size={20}
									/>
								)}
							</div>
						</div>

						<AnimatePresence initial={false}>
							{(!collapsible ||
								expandedSections[section.title]) && (
								<motion.div
									key={`${section.title}-content`}
									initial={{ height: 0, opacity: 0 }}
									animate={{
										height: 'auto',
										opacity: 1,
										transition: {
											height: {
												duration: 0.3,
												ease: [0.04, 0.62, 0.23, 0.98]
											},
											opacity: {
												duration: 0.2,
												delay: 0.1
											}
										}
									}}
									exit={{
										height: 0,
										opacity: 0,
										transition: {
											height: {
												duration: 0.3,
												ease: [0.04, 0.62, 0.23, 0.98]
											},
											opacity: { duration: 0.2 }
										}
									}}
									className="overflow-hidden"
								>
									<div className="overflow-x-auto">
										<table className="w-full min-w-full table-fixed">
											<thead>
												<tr
													className={cn(
														'border-b transition-colors',
														currentTheme.border,
														currentTheme.table
															.header
													)}
												>
													<ResizableHeader column="prop">
														Prop
													</ResizableHeader>
													{showTypeColumn && (
														<ResizableHeader column="type">
															Type
														</ResizableHeader>
													)}
													{showDefaultColumn && (
														<ResizableHeader column="default">
															Default
														</ResizableHeader>
													)}
													<ResizableHeader column="description">
														Description
													</ResizableHeader>
													<th
														className={cn(
															'px-6 py-3 text-left text-xs font-medium uppercase tracking-wider',
															currentTheme.secondaryText,
															COLUMN_WIDTHS.actions
														)}
													>
														{/* Empty header for actions column */}
													</th>
												</tr>
											</thead>
											<tbody
												className={cn(
													SPACING_CONFIG.prop[
														initialPropSpacing
													],
													currentTheme.divider
												)}
											>
												{filteredProps.map(
													(prop, propIndex) => (
														<tr
															key={propIndex}
															className={cn(
																'group transition-colors',
																currentTheme.hover,
																currentTheme
																	.table.row,
																prop.deprecated &&
																	'opacity-60'
															)}
															onClick={() =>
																onPropClick?.(
																	prop.name
																)
															}
														>
															<PropTableRow
																prop={prop}
																showTypeColumn={
																	showTypeColumn
																}
																showDefaultColumn={
																	showDefaultColumn
																}
																showVersionBadges={
																	showVersionBadges
																}
																showBetaBadges={
																	showBetaBadges
																}
																copiedProp={
																	copiedProp
																}
																onCopy={
																	handleCopy
																}
																customBadges={
																	customBadges
																}
																theme={
																	initialTheme
																}
																columnWidths={
																	columnWidths
																}
															/>
														</tr>
													)
												)}
											</tbody>
										</table>
									</div>
								</motion.div>
							)}
						</AnimatePresence>
					</motion.div>
				)
			})}
		</div>
	)
}

// Separate component for the table row to keep the code organized
type PropTableRowProps = {
	prop: PropItem
	showTypeColumn: boolean
	showDefaultColumn: boolean
	showVersionBadges: boolean
	showBetaBadges: boolean
	copiedProp: string | null
	onCopy: (text: string, propName: string) => void
	customBadges?: Record<string, { text: string; className: string }>
	theme: ThemeOption
	columnWidths: ColumnWidth
}

function PropTableRow({
	prop,
	showTypeColumn,
	showDefaultColumn,
	showVersionBadges,
	showBetaBadges,
	copiedProp,
	onCopy,
	customBadges,
	theme,
	columnWidths
}: PropTableRowProps) {
	const [showDetails, setShowDetails] = useState(false)
	const currentTheme = THEME_CONFIG[theme]

	return (
		<>
			<td style={{ width: columnWidths.prop }} className="px-6 py-4">
				<div className="flex items-center gap-2 overflow-hidden">
					<TruncatedText
						text={prop.name}
						className={cn(
							'font-mono text-sm truncate shrink-0',
							currentTheme.text
						)}
					/>
					<DraggableBadges>
						{prop.required && (
							<span className="text-xs text-red-400 shrink-0">
								*
							</span>
						)}
						{prop.type === 'function' && (
							<Pill variant="info">Function</Pill>
						)}
						{prop.type.includes('[]') && (
							<Pill variant="info">Array</Pill>
						)}
						{prop.deprecated && (
							<Pill variant="error">Deprecated</Pill>
						)}
						{showVersionBadges && prop.since && (
							<Pill variant="success">v{prop.since}</Pill>
						)}
						{showBetaBadges && prop.beta && (
							<Pill variant="beta">Beta</Pill>
						)}
						{prop.experimental && (
							<Pill variant="warning">Experimental</Pill>
						)}
						{prop.type.includes('Promise') && (
							<Pill variant="info">Async</Pill>
						)}
						{customBadges &&
							Object.entries(customBadges).map(
								([key, badge]) =>
									prop[key as keyof PropItem] && (
										<Pill
											key={key}
											className={badge.className}
										>
											{badge.text}
										</Pill>
									)
							)}
					</DraggableBadges>
				</div>
			</td>
			{showTypeColumn && (
				<td style={{ width: columnWidths.type }} className="px-6 py-4">
					<div className="overflow-hidden">
						<TruncatedText
							text={prop.type}
							className={cn(
								'font-mono text-sm block truncate',
								currentTheme.code
							)}
						/>
					</div>
				</td>
			)}
			{showDefaultColumn && (
				<td
					style={{ width: columnWidths.default }}
					className="px-6 py-4"
				>
					<div className="overflow-hidden">
						<TruncatedText
							text={prop.defaultValue || '-'}
							className={cn(
								'font-mono text-sm block truncate',
								currentTheme.secondaryText
							)}
						/>
					</div>
				</td>
			)}
			<td
				style={{ width: columnWidths.description }}
				className="px-6 py-4"
			>
				<div className="space-y-2">
					<div className="flex items-start gap-2">
						<span
							className={cn(
								'text-sm line-clamp-2',
								currentTheme.secondaryText
							)}
						>
							{prop.description}
						</span>
						{prop.link && (
							<a
								href={prop.link}
								target="_blank"
								rel="noopener noreferrer"
								className="text-blue-400 hover:text-blue-300 transition-colors shrink-0"
							>
								<ExternalLink size={14} />
							</a>
						)}
					</div>

					{/* Expandable details section */}
					{(prop.example ||
						prop.notes?.length ||
						prop.values?.length ||
						prop.changelog?.length) && (
						<button
							onClick={() => setShowDetails(!showDetails)}
							className="text-xs text-blue-400 hover:text-blue-300 transition-colors"
						>
							{showDetails ? 'Hide details' : 'Show details'}
						</button>
					)}

					<AnimatePresence initial={false} mode="sync">
						{showDetails && (
							<motion.div
								{...DETAILS_ANIMATION}
								className="overflow-hidden"
								layout
							>
								<motion.div
									initial={{ opacity: 0 }}
									animate={{ opacity: 1 }}
									exit={{ opacity: 0 }}
									transition={{ duration: 0.2 }}
								>
									<div className="space-y-3 pt-2">
										{prop.example && (
											<div className="text-sm font-mono p-2 rounded bg-zinc-800/50 border border-zinc-700">
												{prop.example}
											</div>
										)}

										{prop.values &&
											prop.values.length > 0 && (
												<div className="space-y-1">
													<h4 className="text-xs font-medium text-zinc-400">
														<Pill variant="default">
															Possible Values
														</Pill>
													</h4>
													<div className="grid grid-cols-2 gap-2">
														{prop.values.map(
															(value, index) => (
																<div
																	key={index}
																	className="text-sm"
																>
																	<code className="text-purple-400">
																		{
																			value.value
																		}
																	</code>
																	{value.description && (
																		<p className="text-zinc-500 text-xs mt-1">
																			{
																				value.description
																			}
																		</p>
																	)}
																</div>
															)
														)}
													</div>
												</div>
											)}

										{prop.notes &&
											prop.notes.length > 0 && (
												<div className="space-y-2">
													{prop.notes.map(
														(note, index) => (
															<div
																key={index}
																className="flex items-start gap-2"
															>
																<Pill
																	variant="warning"
																	className="mt-0.5"
																>
																	Note
																</Pill>
																<span className="text-sm text-zinc-400">
																	{note}
																</span>
															</div>
														)
													)}
												</div>
											)}

										{prop.changelog &&
											prop.changelog.length > 0 && (
												<div className="space-y-1">
													<h4 className="text-xs font-medium text-zinc-400">
														<Pill variant="default">
															Changelog
														</Pill>
													</h4>
													<div className="space-y-2">
														{prop.changelog.map(
															(log, index) => (
																<div
																	key={index}
																	className="text-sm flex items-center gap-2"
																>
																	<Pill variant="info">
																		v
																		{
																			log.version
																		}
																	</Pill>
																	<span className="text-zinc-400">
																		{
																			log.changes
																		}
																	</span>
																</div>
															)
														)}
													</div>
												</div>
											)}
									</div>
								</motion.div>
							</motion.div>
						)}
					</AnimatePresence>
				</div>
			</td>
			<td style={{ width: columnWidths.actions }} className="px-6 py-4">
				<button
					onClick={(e) => {
						e.stopPropagation()
						onCopy(prop.name, prop.name)
					}}
					className="opacity-0 group-hover:opacity-100 transition-opacity"
				>
					{copiedProp === prop.name ? (
						<Check size={14} className="text-green-400" />
					) : (
						<Copy
							size={14}
							className="text-zinc-400 hover:text-zinc-300"
						/>
					)}
				</button>
			</td>
		</>
	)
}

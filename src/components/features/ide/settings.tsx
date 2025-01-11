'use client'

import { Slider } from '@/components/ui/slider'
import * as PopoverPrimitive from '@radix-ui/react-popover'
import * as Tooltip from '@radix-ui/react-tooltip'
import { AnimatePresence, motion, useDragControls } from 'framer-motion'
import { Moon, Palette, Settings, Smartphone, Sun, Type, X } from 'lucide-react'
import * as React from 'react'
import { cn } from '../../../lib/utils'

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

type SettingsPanelProps = {
	settings: SettingsState
	onSettingsChange: (newSettings: Partial<SettingsState>) => void
}

const TAB_COLORS = {
	blue: {
		border: 'border-blue-500/50',
		bg: 'bg-blue-500/10',
		text: 'text-blue-400'
	},
	purple: {
		border: 'border-purple-500/50',
		bg: 'bg-purple-500/10',
		text: 'text-purple-400'
	},
	pink: {
		border: 'border-pink-500/50',
		bg: 'bg-pink-500/10',
		text: 'text-pink-400'
	},
	green: {
		border: 'border-green-500/50',
		bg: 'bg-green-500/10',
		text: 'text-green-400'
	},
	orange: {
		border: 'border-orange-500/50',
		bg: 'bg-orange-500/10',
		text: 'text-orange-400'
	}
} as const

type CustomTooltipProps = {
	content: string
	children: React.ReactNode
}

const CustomTooltip = ({ content, children }: CustomTooltipProps) => {
	return (
		<Tooltip.Provider>
			<Tooltip.Root>
				<Tooltip.Trigger asChild>{children}</Tooltip.Trigger>
				<Tooltip.Portal>
					<Tooltip.Content
						className={cn(
							'bg-gray-800 text-white text-sm rounded-md p-2 shadow-lg',
							'transition-opacity duration-200 ease-in-out',
							"data-state='visible':opacity-100",
							"data-state='hidden':opacity-0"
						)}
						side="top"
						align="center"
						sideOffset={5}
					>
						{content}
						<Tooltip.Arrow className="fill-gray-800" />
					</Tooltip.Content>
				</Tooltip.Portal>
			</Tooltip.Root>
		</Tooltip.Provider>
	)
}

export default function SettingsPanel({
	settings,
	onSettingsChange
}: SettingsPanelProps) {
	const [mounted, setMounted] = React.useState(false)
	const [open, setOpen] = React.useState(false)
	const dragControls = useDragControls()

	React.useEffect(() => {
		setMounted(true)
	}, [])

	// Don't render anything until mounted
	if (!mounted) {
		return null
	}

	const themeOptions = [
		{
			id: 'light-theme',
			value: 'light' as const,
			icon: Sun,
			label: 'Light'
		},
		{ id: 'dark-theme', value: 'dark' as const, icon: Moon, label: 'Dark' },
		{
			id: 'system-theme',
			value: 'system' as const,
			icon: Smartphone,
			label: 'System'
		}
	]

	const fontSizes = [
		{ id: 'font-12', size: 12 },
		{ id: 'font-13', size: 13 },
		{ id: 'font-14', size: 14 },
		{ id: 'font-15', size: 15 },
		{ id: 'font-16', size: 16 }
	]

	return (
		<Tooltip.Provider>
			<PopoverPrimitive.Root open={open} onOpenChange={setOpen}>
				<PopoverPrimitive.Trigger asChild>
					<button
						className="p-2 rounded-full hover:bg-zinc-800/50 transition-colors"
						aria-label="Settings"
					>
						<Settings
							size={16}
							className="text-zinc-400 hover:text-zinc-300"
						/>
					</button>
				</PopoverPrimitive.Trigger>

				<AnimatePresence mode="sync">
					{open && mounted && (
						<PopoverPrimitive.Portal forceMount>
							<PopoverPrimitive.Content
								className="z-50"
								forceMount
							>
								<motion.div
									initial={{ opacity: 0, scale: 0.95 }}
									animate={{ opacity: 1, scale: 1 }}
									exit={{ opacity: 0, scale: 0.95 }}
									transition={{
										duration: 0.2,
										ease: 'easeOut'
									}}
									className="fixed"
								>
									<motion.div
										className="w-80 rounded-lg border border-zinc-800 bg-zinc-900/95 p-4 shadow-xl"
										drag
										dragControls={dragControls}
										dragMomentum={false}
										dragElastic={0}
										onClick={(e) => e.stopPropagation()}
									>
										<div
											className="flex items-center justify-between mb-4 cursor-move"
											onPointerDown={(e) =>
												dragControls.start(e)
											}
										>
											<h3 className="text-sm font-medium text-zinc-200">
												Editor Settings
											</h3>
											<button
												onClick={() => setOpen(false)}
												className="rounded-full p-1 hover:bg-zinc-800/50 transition-colors cursor-pointer"
											>
												<X
													size={14}
													className="text-zinc-400"
												/>
											</button>
										</div>
										<div className="space-y-6 cursor-default">
											{/* Theme Selection */}
											<div className="space-y-2">
												<label className="text-xs font-medium text-zinc-400 flex items-center gap-2">
													<Sun className="w-3 h-3" />{' '}
													Theme
												</label>
												<div className="grid grid-cols-3 gap-2">
													{themeOptions.map(
														({
															id,
															value,
															icon: Icon,
															label
														}) => (
															<button
																key={id}
																onClick={() =>
																	onSettingsChange(
																		{
																			theme: value
																		}
																	)
																}
																className={cn(
																	'flex flex-col items-center gap-1 p-2 rounded-md border transition-all',
																	settings.theme ===
																		value
																		? 'border-blue-500/50 bg-blue-500/10 text-blue-400'
																		: 'border-zinc-800 hover:border-zinc-700 text-zinc-400 hover:text-zinc-300'
																)}
															>
																<Icon
																	size={14}
																/>
																<span className="text-xs">
																	{label}
																</span>
															</button>
														)
													)}
												</div>
											</div>

											{/* Font Size */}
											<div className="space-y-2">
												<label className="text-xs font-medium text-zinc-400 flex items-center gap-2">
													<Type className="w-3 h-3" />{' '}
													Font Size
												</label>
												<div className="grid grid-cols-5 gap-2">
													{fontSizes.map(
														({ id, size }) => (
															<button
																key={id}
																onClick={() =>
																	onSettingsChange(
																		{
																			fontSize:
																				size
																		}
																	)
																}
																className={cn(
																	'p-2 rounded-md border text-xs transition-all',
																	settings.fontSize ===
																		size
																		? 'border-blue-500/50 bg-blue-500/10 text-blue-400'
																		: 'border-zinc-800 hover:border-zinc-700 text-zinc-400 hover:text-zinc-300'
																)}
															>
																{size}px
															</button>
														)
													)}
												</div>
											</div>

											{/* Tab Color */}
											<div className="space-y-2">
												<label className="text-xs font-medium text-zinc-400 flex items-center gap-2">
													<Palette className="w-3 h-3" />{' '}
													Active Tab Color
												</label>
												<div className="grid grid-cols-5 gap-2">
													{Object.entries(
														TAB_COLORS
													).map(
														([color, classes]) => (
															<button
																key={`tab-color-${color}`}
																onClick={() =>
																	onSettingsChange(
																		{
																			activeTabColor:
																				color as keyof typeof TAB_COLORS
																		}
																	)
																}
																className={cn(
																	'p-2 rounded-md border text-xs transition-all capitalize',
																	settings.activeTabColor ===
																		color
																		? [
																				classes.border,
																				classes.bg,
																				classes.text
																			]
																		: 'border-zinc-800 hover:border-zinc-700 text-zinc-400 hover:text-zinc-300'
																)}
															>
																{color}
															</button>
														)
													)}
												</div>
											</div>

											{/* Toggle Options */}
											<div className="space-y-2">
												<label className="text-xs font-medium text-zinc-400">
													Display Options
												</label>
												<div className="space-y-2">
													{[
														{
															id: 'colorful-icons',
															label: 'Colorful Icons',
															value: settings.colorfulIcons,
															onChange: () =>
																onSettingsChange(
																	{
																		colorfulIcons:
																			!settings.colorfulIcons
																	}
																)
														},
														{
															id: 'line-numbers',
															label: 'Show Line Numbers',
															value: settings.lineNumbers,
															onChange: () =>
																onSettingsChange(
																	{
																		lineNumbers:
																			!settings.lineNumbers
																	}
																)
														},
														{
															id: 'word-wrap',
															label: 'Word Wrap',
															value: settings.wordWrap,
															onChange: () =>
																onSettingsChange(
																	{
																		wordWrap:
																			!settings.wordWrap
																	}
																)
														}
													].map(
														({
															id,
															label,
															value,
															onChange
														}) => (
															<button
																key={id}
																onClick={
																	onChange
																}
																className={cn(
																	'w-full flex items-center justify-between p-2 rounded-md border transition-all',
																	value
																		? 'border-blue-500/50 bg-blue-500/10 text-blue-400'
																		: 'border-zinc-800 hover:border-zinc-700 text-zinc-400 hover:text-zinc-300'
																)}
															>
																<span className="text-xs">
																	{label}
																</span>
															</button>
														)
													)}
												</div>
											</div>

											{/* Add opacity slider */}
											<div className="space-y-2 mt-4">
												<label className="text-sm text-zinc-400 flex items-center gap-2">
													<Palette className="w-4 h-4" />
													Background Opacity
												</label>
												<Slider
													value={[settings.bgOpacity]}
													min={0}
													max={100}
													step={1}
													onValueChange={(value) => {
														onSettingsChange({
															bgOpacity: value[0]
														})
													}}
													className="w-full"
												/>
												<span className="text-xs text-zinc-500">
													{settings.bgOpacity}%
												</span>
											</div>
										</div>
									</motion.div>
								</motion.div>
							</PopoverPrimitive.Content>
						</PopoverPrimitive.Portal>
					)}
				</AnimatePresence>
			</PopoverPrimitive.Root>
		</Tooltip.Provider>
	)
}

'use client'

import * as PopoverPrimitive from '@radix-ui/react-popover'
import * as Tooltip from '@radix-ui/react-tooltip'
import { motion, useDragControls } from 'framer-motion'
import { Moon, Palette, Settings, Smartphone, Sun, Type, X } from 'lucide-react'
import { cn } from '../../../lib/utils'

type SettingsState = {
	theme: 'light' | 'dark' | 'system'
	colorfulIcons: boolean
	fontSize: number
	activeTabColor: 'blue' | 'purple' | 'pink' | 'green' | 'orange'
	lineNumbers: boolean
	wordWrap: boolean
}

type SettingsPanelProps = {
	settings: SettingsState
	onSettingsChange: (newSettings: Partial<SettingsState>) => void
}

const TAB_COLORS = {
	blue: 'before:bg-blue-400',
	purple: 'before:bg-purple-400',
	pink: 'before:bg-pink-400',
	green: 'before:bg-green-400',
	orange: 'before:bg-orange-400'
} as const

const CustomTooltip = ({ content, children }) => {
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
	const dragControls = useDragControls()

	const themeOptions = [
		{ value: 'light' as const, icon: Sun, label: 'Light' },
		{ value: 'dark' as const, icon: Moon, label: 'Dark' },
		{ value: 'system' as const, icon: Smartphone, label: 'System' }
	]

	const fontSizes = [12, 13, 14, 15, 16]
	const tabColors = Object.keys(TAB_COLORS) as Array<keyof typeof TAB_COLORS>

	return (
		<PopoverPrimitive.Root>
			<PopoverPrimitive.Trigger asChild>
				<button className="p-2 rounded-full hover:bg-zinc-800/50 transition-colors">
					<Settings
						size={16}
						className="text-zinc-400 hover:text-zinc-300"
					/>
				</button>
			</PopoverPrimitive.Trigger>
			<PopoverPrimitive.Portal>
				<PopoverPrimitive.Content asChild>
					<motion.div
						className="fixed z-50"
						initial={{ opacity: 0, scale: 0.95 }}
						animate={{ opacity: 1, scale: 1 }}
						exit={{ opacity: 0, scale: 0.95 }}
						drag
						dragControls={dragControls}
						dragMomentum={false}
						dragElastic={0}
					>
						<motion.div
							className="w-80 rounded-lg border border-zinc-800 bg-zinc-900/95 p-4 cursor-move"
							onPointerDown={(e) => dragControls.start(e)}
						>
							<div className="flex items-center justify-between mb-4">
								<h3 className="text-sm font-medium text-zinc-200">
									Editor Settings
								</h3>
								<CustomTooltip content="Tip! You can move/drag this panel if it is covering the results of your configuration">
									<button className="rounded-full p-1 hover:bg-zinc-800/50 transition-colors">
										<X
											size={14}
											className="text-zinc-400"
										/>
									</button>
								</CustomTooltip>
							</div>
							<div className="space-y-6">
								{/* Theme Selection */}
								<div className="space-y-2">
									<label className="text-xs font-medium text-zinc-400 flex items-center gap-2">
										<Sun className="w-3 h-3" /> Theme
									</label>
									<div className="grid grid-cols-3 gap-2">
										{themeOptions.map(
											({ value, icon: Icon, label }) => (
												<button
													key={value}
													onClick={() =>
														onSettingsChange({
															theme: value
														})
													}
													className={cn(
														'flex flex-col items-center gap-1 p-2 rounded-md border transition-all',
														settings.theme === value
															? 'border-blue-500/50 bg-blue-500/10 text-blue-400'
															: 'border-zinc-800 hover:border-zinc-700 text-zinc-400 hover:text-zinc-300'
													)}
												>
													<Icon size={14} />
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
										<Type className="w-3 h-3" /> Font Size
									</label>
									<div className="grid grid-cols-5 gap-2">
										{fontSizes.map((size) => (
											<button
												key={size}
												onClick={() =>
													onSettingsChange({
														fontSize: size
													})
												}
												className={cn(
													'p-2 rounded-md border text-xs transition-all',
													settings.fontSize === size
														? 'border-blue-500/50 bg-blue-500/10 text-blue-400'
														: 'border-zinc-800 hover:border-zinc-700 text-zinc-400 hover:text-zinc-300'
												)}
											>
												{size}px
											</button>
										))}
									</div>
								</div>

								{/* Tab Color */}
								<div className="space-y-2">
									<label className="text-xs font-medium text-zinc-400 flex items-center gap-2">
										<Palette className="w-3 h-3" /> Active
										Tab Color
									</label>
									<div className="grid grid-cols-5 gap-2">
										{tabColors.map((color) => (
											<button
												key={color}
												onClick={() =>
													onSettingsChange({
														activeTabColor: color
													})
												}
												className={cn(
													'p-2 rounded-md border text-xs transition-all capitalize',
													settings.activeTabColor ===
														color
														? `border-${color}-500/50 bg-${color}-500/10 text-${color}-400`
														: 'border-zinc-800 hover:border-zinc-700 text-zinc-400 hover:text-zinc-300'
												)}
											>
												{color}
											</button>
										))}
									</div>
								</div>

								{/* Toggle Options */}
								<div className="space-y-2">
									<label className="text-xs font-medium text-zinc-400">
										Display Options
									</label>
									<div className="space-y-2">
										<button
											onClick={() =>
												onSettingsChange({
													colorfulIcons:
														!settings.colorfulIcons
												})
											}
											className={cn(
												'w-full flex items-center justify-between p-2 rounded-md border transition-all',
												settings.colorfulIcons
													? 'border-blue-500/50 bg-blue-500/10 text-blue-400'
													: 'border-zinc-800 hover:border-zinc-700 text-zinc-400 hover:text-zinc-300'
											)}
										>
											<span className="text-xs">
												Colorful Icons
											</span>
										</button>
										<button
											onClick={() =>
												onSettingsChange({
													lineNumbers:
														!settings.lineNumbers
												})
											}
											className={cn(
												'w-full flex items-center justify-between p-2 rounded-md border transition-all',
												settings.lineNumbers
													? 'border-blue-500/50 bg-blue-500/10 text-blue-400'
													: 'border-zinc-800 hover:border-zinc-700 text-zinc-400 hover:text-zinc-300'
											)}
										>
											<span className="text-xs">
												Show Line Numbers
											</span>
										</button>
										<button
											onClick={() =>
												onSettingsChange({
													wordWrap: !settings.wordWrap
												})
											}
											className={cn(
												'w-full flex items-center justify-between p-2 rounded-md border transition-all',
												settings.wordWrap
													? 'border-blue-500/50 bg-blue-500/10 text-blue-400'
													: 'border-zinc-800 hover:border-zinc-700 text-zinc-400 hover:text-zinc-300'
											)}
										>
											<span className="text-xs">
												Word Wrap
											</span>
										</button>
									</div>
								</div>
							</div>
						</motion.div>
					</motion.div>
				</PopoverPrimitive.Content>
			</PopoverPrimitive.Portal>
		</PopoverPrimitive.Root>
	)
}

'use client'

import { Button } from '@/components/ui/button'
import { getFileIcon } from '@/core/config/file-icons'
import { projectStructure } from '@/core/config/tree-object'
import { AnimatePresence, motion } from 'framer-motion'
import { Maximize2, X } from 'lucide-react'
import { useState } from 'react'
import IDE from './features/ide/ide'

export default function ZenIDEModal() {
	const [isZenMode, setIsZenMode] = useState(false)

	const toggleZenMode = () => setIsZenMode(!isZenMode)

	return (
		<>
			<Button
				onClick={toggleZenMode}
				className="fixed bottom-4 right-4 z-50"
			>
				<Maximize2 className="w-4 h-4 mr-2" />
				Zen Mode
			</Button>

			<AnimatePresence>
				{isZenMode && (
					<motion.div
						initial={{ opacity: 0, scale: 0.9 }}
						animate={{ opacity: 1, scale: 1 }}
						exit={{ opacity: 0, scale: 0.9 }}
						className="fixed inset-4 bg-black z-50 flex flex-col rounded-lg border border-white/10"
					>
						<div className="flex justify-between items-center p-4 border-b border-white/10">
							<h2 className="text-xl font-bold text-white">
								Zen Mode
							</h2>
							<Button
								variant="ghost"
								size="icon"
								onClick={toggleZenMode}
							>
								<X className="w-6 h-6" />
							</Button>
						</div>
						<div className="flex-1 overflow-auto">
							<IDE
								root={projectStructure}
								onSelect={(path) =>
									console.log('Selected:', path)
								}
								theme="dark"
								customIcons={getFileIcon}
							/>
						</div>
					</motion.div>
				)}
			</AnimatePresence>
		</>
	)
}

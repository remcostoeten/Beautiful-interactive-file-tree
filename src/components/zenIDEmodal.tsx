'use client'

import { Button } from '@/components/ui/button'
import { getFileIcon } from '@/core/config/file-icons'
import { projectStructure } from '@/core/config/tree-object'
import { AnimatePresence, motion } from 'framer-motion'
import { X } from 'lucide-react'
import IDE from './features/ide/ide'

type ZenIDEModalProps = {
	isOpen: boolean
	onClose: () => void
}

export default function ZenIDEModal({ isOpen, onClose }: ZenIDEModalProps) {
	return (
		<AnimatePresence>
			{isOpen && (
				<motion.div
					initial={{ opacity: 0, scale: 0.9 }}
					animate={{ opacity: 1, scale: 1 }}
					exit={{ opacity: 0, scale: 0.9 }}
					transition={{ duration: 0.2, ease: 'easeOut' }}
					className="fixed inset-4 bg-black z-50 flex flex-col rounded-lg border border-white/10"
				>
					<div className="flex justify-between items-center p-4 border-b border-white/10">
						<h2 className="text-xl font-bold text-white">
							Zen Mode
						</h2>
						<Button
							variant="ghost"
							size="icon"
							onClick={onClose}
						>
							<X className="w-6 h-6" />
						</Button>
					</div>
					<div className="flex-1 overflow-auto">
						<IDE
							root={projectStructure}
							onSelect={(path) => console.log('Selected:', path)}
							theme="dark"
							customIcons={getFileIcon}
							defaultSettings={{
								theme: 'dark',
								colorfulIcons: true,
								bgOpacity: 100
							}}
						/>
					</div>
				</motion.div>
			)}
		</AnimatePresence>
	)
}

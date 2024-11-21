'use client'

import { motion } from 'framer-motion'
import { Code2 } from 'lucide-react'

const NoFileSelected = () => {
	return (
		<motion.div
			className="flex flex-col items-center justify-center h-full text-zinc-500 space-y-4"
			initial={{ opacity: 0, scale: 0.8 }}
			animate={{ opacity: 1, scale: 1 }}
			transition={{ duration: 0.5, ease: 'easeOut' }}
		>
			<motion.div
				className="w-16 h-16 rounded-xl bg-white/10 backdrop-blur-md border border-white/20 flex items-center justify-center"
				initial={{ rotate: 0 }}
				animate={{ rotate: [0, 10, -10, 0] }}
				transition={{
					duration: 1,
					repeat: Infinity,
					repeatType: 'loop'
				}}
			>
				<Code2 size={24} className="text-violet-400" />
			</motion.div>
			<div className="text-center space-y-1">
				<motion.p
					className="text-sm font-medium text-violet-400"
					initial={{ opacity: 0 }}
					animate={{ opacity: 1 }}
					transition={{ delay: 0.5, duration: 0.5 }}
				>
					No file selected
				</motion.p>
				<motion.p
					className="text-xs text-zinc-400"
					initial={{ opacity: 0 }}
					animate={{ opacity: 1 }}
					transition={{ delay: 1, duration: 0.5 }}
				>
					Select a file from the sidebar to view its contents
				</motion.p>
			</div>
		</motion.div>
	)
}

export default NoFileSelected

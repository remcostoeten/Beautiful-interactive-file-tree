import React from 'react'
import { motion } from 'framer-motion'

const TerminalOutput = () => {
	const words = [
		{ text: '$~', className: 'text-zinc-400' },
		{ text: 'python3', className: 'text-emerald-400' },
		{
			text: 'src/scripts/generate-tree-object.py',
			className: 'text-blue-400'
		},
		{ text: 'src/app/', className: 'text-yellow-400' }
	]

	const outputWords = [
		{ text: 'Successfully', className: 'text-green-400' },
		{ text: 'generated', className: 'text-green-400' },
		{ text: 'IDE', className: 'text-green-400' },
		{ text: 'structure', className: 'text-green-400' },
		{ text: 'in', className: 'text-green-400' },
		{ text: 'src/core/config/tree-object.ts', className: 'text-blue-300' }
	]

	const containerVariants = {
		hidden: { opacity: 0 },
		visible: {
			opacity: 1,
			transition: {
				staggerChildren: 0.1
			}
		}
	}

	const wordVariants = {
		hidden: { opacity: 0, y: 20 },
		visible: {
			opacity: 1,
			y: 0,
			transition: {
				type: 'spring',
				damping: 10,
				duration: 0.5,
				ease: 'easeOut'
			}
		}
	}

	return (
		<motion.div
			className="w-full max-w-2xl mx-auto lg:mx-0 mb-6"
			initial="hidden"
			animate="visible"
			variants={containerVariants}
		>
			<code className="text-sm rounded-xl p-4 bg-black/95 inline-block border border-white/20 font-mono shadow-md shadow-zinc-900/30 drop-shadow-md drop-shadow-zinc-900/50 bg-gradient-to-r from-transparent via-zinc-900/50 to-transparent">
				<motion.div
					className="flex flex-wrap gap-x-2"
					variants={containerVariants}
				>
					{words.map((word, index) => (
						<motion.span
							key={index}
							className={word.className}
							variants={wordVariants}
						>
							{word.text}
						</motion.span>
					))}
				</motion.div>
				<motion.div
					className="flex flex-wrap gap-x-2 mt-2"
					variants={containerVariants}
				>
					{outputWords.map((word, index) => (
						<motion.span
							key={index}
							className={word.className}
							variants={wordVariants}
						>
							{word.text}
						</motion.span>
					))}
				</motion.div>
			</code>
		</motion.div>
	)
}

export default TerminalOutput

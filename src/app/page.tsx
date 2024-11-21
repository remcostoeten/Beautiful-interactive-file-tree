'use client'

import ApiDocumentation from '@/components/api-documentation'
import PropsTable from '@/components/api-renderer'
import { CodeBlock } from '@/components/code-block/code-block'
import FeatureCard from '@/components/features/FeatureCard'
import IDE from '@/components/features/ide/ide'
import Logo from '@/components/logo'
import PreCode from '@/components/PreCode'
import TerminalOutput from '@/components/terminal-output'
import { Button } from '@/components/ui/button'
import { apiProps } from '@/core/config/api-props'
import { USAGE_EXAMPLE } from '@/core/config/code-examples'
import { getFileIcon } from '@/core/config/file-icons'
import { projectStructure } from '@/core/config/tree-object'
import useCursorGradient from '@/hooks/useCursorGradient'
import { Tabs, TabsList, TabsTrigger, TabsContent } from '@radix-ui/react-tabs'
import {
	useScroll,
	useTransform,
	useAnimate,
	stagger,
	motion,
	AnimatePresence
} from 'framer-motion'
import {
	Terminal,
	Wand2,
	Code2,
	Link,
	Github,
	Maximize2,
	X,
	Heart
} from 'lucide-react'
import { useState, useRef, useEffect } from 'react'

export default function LandingPage() {
	const [isZenMode, setIsZenMode] = useState(false)
	const containerRef = useRef<HTMLDivElement>(null)

	const { scrollYProgress } = useScroll({
		target: containerRef,
		offset: ['start start', 'end start']
	})

	const opacity = useTransform(scrollYProgress, [0, 0.5], [1, 0])
	const scale = useTransform(scrollYProgress, [0, 0.5], [1, 0.8])

	const { position, opacity: cursorOpacity } = useCursorGradient()

	const [scope, animate] = useAnimate()
	const [isIsolatedView, setIsIsolatedView] = useState(false)

	useEffect(() => {
		animate([
			[
				'.stagger-fade',
				{ opacity: [0, 1], y: [20, 0] },
				{ duration: 0.5, delay: stagger(0.1) }
			],
			[
				'.stagger-scale',
				{ opacity: [0, 1], scale: [0.9, 1] },
				{ duration: 0.5, delay: stagger(0.1) }
			]
		])
	}, [animate])

	const features = [
		{
			icon: <Terminal className="w-5 h-5" />,
			title: 'Framework Agnostic',
			description:
				"This is a lie, but LLM made 95% of this landing page and I'm too lazy to change it."
		},
		{
			icon: <Wand2 className="w-5 h-5" />,
			title: 'Fully Customizable',
			description:
				"Extensive theming support and customization options to match your application's design."
		},
		{
			icon: <Code2 className="w-5 h-5" />,
			title: 'TypeScript Ready',
			description:
				'Built with TypeScript for excellent developer experience and type safety.'
		}
	]

	const toggleZenMode = () => setIsZenMode(!isZenMode)

	return (
		<div
			ref={scope}
			className="min-h-screen bg-black selection:bg-violet-500/20 selection:text-violet-200"
		>
			<div
				className="pointer-events-none fixed inset-0 z-0 transition-opacity duration-300"
				style={{
					background: `radial-gradient(800px at ${position.x}px ${position.y}px, rgba(29, 78, 216, 0.03), transparent 80%)`,
					opacity: cursorOpacity
				}}
			/>

			{/* Gradient Background */}
			<div className="fixed inset-0 z-0 bg-[radial-gradient(circle_at_center,_var(--tw-gradient-stops))] from-violet-500/5 via-fuchsia-500/5 to-black opacity-50" />

			{/* Announcement Banner */}
			<div className="relative bg-gradient-to-r from-violet-500/20 via-fuchsia-500/20 to-violet-500/20 border-b border-white/10">
				<div className="max-w-[1200px] mx-auto px-4 sm:px-6 lg:px-8">
					<div className="py-1 text-center text-xs text-zinc-400">
						<span className="font-medium text-white">
							Beta release!
						</span>{' '}
						— And most likely will never touch this again as it was
						an ADHD-moment! But it's sick tho.
					</div>
				</div>
			</div>

			{/* Header */}
			<header className="sticky top-0 z-50 border-b border-white/10 bg-black/50 backdrop-blur-sm">
				<nav className="max-w-[1200px] mx-auto px-4 sm:px-6 lg:px-8 h-12 flex items-center justify-between">
					<div className="flex items-center gap-8">
						<Logo size="sm" fill="#a1a1aa" />
						<div className="hidden md:flex items-center gap-6">
							<Link
								href="https://github.com"
								className="flex items-center gap-2 text-sm text-zinc-400 hover:text-white transition-colors"
							>
								<Github className="w-5 h-5" />
								<span className="hidden sm:inline">
									View Source
								</span>
							</Link>
						</div>
					</div>
					<Button
						variant="outline"
						size="sm"
						onClick={toggleZenMode}
						className="text-zinc-400 hover:text-white border-zinc-700 hover:border-zinc-600"
					>
						<Maximize2 className="w-4 h-4 mr-2" />
						Zen Mode
					</Button>
				</nav>
			</header>

			{/* Hero Section */}
			<section
				ref={containerRef}
				className="relative pt-12 pb-16 overflow-hidden"
			>
				<motion.div
					style={{ opacity, scale }}
					className="max-w-[1200px] mx-auto px-4 sm:px-6 lg:px-8"
				>
					<div className="flex flex-col lg:flex-row items-center gap-8">
						<div className="flex-1 text-center lg:text-left">
							<motion.h1 className="stagger-fade text-balance text-2xl sm:text-3xl lg:text-4xl font-bold tracking-tight bg-clip-text text-transparent bg-gradient-to-r from-white via-zinc-300 to-zinc-500 mb-6">
								Even your minified code{' '}
								<span className="text-transparent bg-clip-text bg-gradient-to-r from-violet-400 to-fuchsia-500">
									will look aesthetic
								</span>
							</motion.h1>
							<motion.p className="stagger-fade text-pretty max-w-2xl mx-auto lg:mx-0 text-base text-zinc-400 mb-6">
								A powerful <PreCode>React</PreCode> component
								for file structure visualization. Built with{' '}
								<PreCode>TypeScript</PreCode> and{' '}
								<PreCode>Tailwind CSS</PreCode> and{' '}
								<PreCode>Motion</PreCode>. Generates your
								complete tree structures with a simple{' '}
								<PreCode>Python</PreCode> script.
							</motion.p>

							<motion.div className="stagger-fade flex flex-col sm:flex-row items-center justify-center lg:justify-start gap-4">
								<Button
									size="lg"
									variant="outline"
									className="flex items-center gap-2 px-4 py-2 border-white/10"
								>
									View on GitHub
									<Github className="w-4 h-4 ml-2" />
								</Button>
							</motion.div>
						</div>

						<div className="lg:w-[65%]">
							<motion.div
								style={{
									rotateX: useTransform(
										scrollYProgress,
										[0, 0.5],
										[0, -10]
									),
									rotateY: useTransform(
										scrollYProgress,
										[0, 0.5],
										[0, 5]
									),
									perspective: 1000
								}}
								className="stagger-scale rounded-lg  border-white/10 overflow-hidden preserve-3d"
							>
								<motion.div
									style={{
										scale: useTransform(
											scrollYProgress,
											[0, 0.5],
											[1, 0.95]
										),
										opacity: useTransform(
											scrollYProgress,
											[0, 0.5],
											[1, 0.7]
										)
									}}
									className="space-y-4"
								>
									<Tabs
										defaultValue="demo"
										className="w-full"
									>
										<TabsList className="flex h-10 items-center gap-4 bg-zinc-900/50 px-4 border-b border-white/10">
											<TabsTrigger
												value="demo"
												className="relative h-full px-4 text-sm text-zinc-400 transition-colors hover:text-violet-400 data-[state=active]:text-violet-400 before:absolute before:bottom-0 before:left-0 before:right-0 before:h-[2px] before:translate-y-[1px] before:bg-violet-400 before:opacity-0 before:transition-opacity data-[state=active]:before:opacity-100"
											>
												Live Demo
											</TabsTrigger>
											<TabsTrigger
												value="code"
												className="relative h-full px-4 text-sm text-zinc-400 transition-colors hover:text-violet-400 data-[state=active]:text-violet-400 before:absolute before:bottom-0 before:left-0 before:right-0 before:h-[2px] before:translate-y-[1px] before:bg-violet-400 before:opacity-0 before:transition-opacity data-[state=active]:before:opacity-100"
											>
												Usage Example
											</TabsTrigger>
											<div className="ml-auto">
												<Button
													variant="ghost"
													size="sm"
													className="h-7 text-xs text-zinc-400 hover:text-violet-400"
													onClick={() =>
														setIsIsolatedView(true)
													}
												>
													<Code2 className="w-3 h-3 mr-2" />
													Isolated View
												</Button>
											</div>
										</TabsList>
										<TabsContent
											value="demo"
											className="mt-0 border-none outline-none"
										>
											<motion.div
												initial={{ opacity: 0, y: 10 }}
												animate={{ opacity: 1, y: 0 }}
												transition={{
													duration: 0.3,
													ease: 'easeOut'
												}}
												className="relative"
											>
												<motion.div
													animate={{
														y: [-1, 1, -1],
														rotate: [
															-0.2, 0.2, -0.2
														]
													}}
													transition={{
														repeat: Infinity,
														duration: 5,
														ease: 'easeInOut'
													}}
												>
													<IDE
														root={projectStructure}
														onSelect={(path) =>
															console.log(
																'Selected:',
																path
															)
														}
														theme="dark"
														customIcons={
															getFileIcon
														}
													/>
												</motion.div>
											</motion.div>
										</TabsContent>
										<TabsContent
											value="code"
											className="mt-0 border-none outline-none"
										>
											<CodeBlock
												code={USAGE_EXAMPLE}
												language="typescript"
												fileName="Demo.tsx"
												showLineNumbers
												enableLineHighlight
												badges={[
													{
														text: 'TypeScript',
														variant: 'primary'
													},
													{
														text: 'React',
														variant: 'secondary'
													}
												]}
											/>
										</TabsContent>
									</Tabs>
									<TerminalOutput />
								</motion.div>
							</motion.div>
						</div>
					</div>
				</motion.div>
			</section>

			{/* Features Grid */}
			<section className="relative border-t border-white/10 py-24">
				<div className="max-w-[1200px] mx-auto px-4 sm:px-6 lg:px-8">
					<div className="grid grid-cols-1 md:grid-cols-3 gap-8">
						{features.map((feature, index) => (
							<FeatureCard
								key={index}
								feature={feature}
								index={index}
							/>
						))}
					</div>
				</div>
			</section>

			<ApiDocumentation />

			{/* Zen Mode */}
			<AnimatePresence>
				{isZenMode && (
					<motion.div
						initial={{ opacity: 0 }}
						animate={{ opacity: 1 }}
						exit={{ opacity: 0 }}
						className="fixed inset-0 bg-black z-50 flex flex-col"
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
								<span className="sr-only">Close Zen Mode</span>
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

			{/* Footer */}
			<div style={{ width: '90vw', margin: '0 auto', padding: '20px' }}>
				<footer className="relative border-t border-white/10 py-8">
					<div className="max-w-[1200px] mx-auto px-4 sm:px-6 lg:px-8">
						<p className="text-sm text-zinc-400 flex items-center justify-center gap-2">
							Made with{' '}
							<Heart className="w-4 h-4 text-red-500 animate-pulse" />{' '}
							by{' '}
							<a
								href="https://github.com/remcostoeten"
								target="_blank"
								rel="noopener noreferrer"
								className="text-violet-400 hover:text-violet-300 transition-colors underline decoration-dotted"
							>
								Remco Stoeten
							</a>
						</p>
					</div>
				</footer>
			</div>
		</div>
	)
}

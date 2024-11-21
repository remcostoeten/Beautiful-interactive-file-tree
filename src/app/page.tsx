'use client'

import ApiDocumentation from '@/components/api-documentation';
import { CodeBlock } from '@/components/code-block/code-block';
import FeatureCard from '@/components/features/FeatureCard';
import IDE from '@/components/features/ide/ide';
import Logo from '@/components/logo';
import PreCode from '@/components/PreCode';
import TerminalOutput from '@/components/terminal-output';
import { Button } from '@/components/ui/button';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { TYPE_DEFINITION, USAGE_EXAMPLE } from '@/core/config/code-examples';
import { getFileIcon } from '@/core/config/file-icons';
import { projectStructure } from '@/core/config/tree-object';
import useCursorGradient from '@/hooks/useCursorGradient';
import { AnimatePresence, motion, stagger, useAnimate } from 'framer-motion';
import { Code2, Github, Heart, Maximize2, Terminal, Wand2, X } from 'lucide-react';
import { useEffect, useRef, useState } from 'react';

export default function LandingPage() {
    const [isZenMode, setIsZenMode] = useState(false);
    const [activeTab, setActiveTab] = useState('demo');
    const containerRef = useRef<HTMLDivElement>(null);
    const { position, opacity: cursorOpacity } = useCursorGradient();
    const [scope, animate] = useAnimate();

    useEffect(() => {
        animate([
            ['.stagger-fade', { opacity: [0, 1], y: [20, 0] }, { duration: 0.5, delay: stagger(0.1) }],
            ['.stagger-scale', { opacity: [0, 1], scale: [0.9, 1] }, { duration: 0.5, delay: stagger(0.1) }]
        ]);
    }, [animate]);

    return (
        <div ref={scope} className="min-h-screen bg-black selection:bg-violet-500/20 selection:text-violet-200">
            {/* Gradient effects */}
            <div
                className="pointer-events-none fixed inset-0 z-0 transition-opacity duration-300"
                style={{
                    background: `radial-gradient(800px at ${position.x}px ${position.y}px, rgba(29, 78, 216, 0.03), transparent 80%)`,
                    opacity: cursorOpacity
                }}
            />
            <div className="fixed inset-0 z-0 bg-[radial-gradient(circle_at_center,_var(--tw-gradient-stops))] from-violet-500/5 via-fuchsia-500/5 to-black opacity-50" />

            {/* Header */}
            <header className="sticky top-0 z-50 border-b border-white/10 bg-black/50 backdrop-blur-sm">
                <nav className="max-w-screen-2xl mx-auto px-6 h-14 flex items-center justify-between">
                    <Logo size="sm" fill="#a1a1aa" />
                    <div className="flex items-center gap-4">
                        <Button
                            variant="ghost"
                            size="sm"
                            className="text-zinc-400 hover:text-white"
                            asChild
                        >
                            <a href="https://github.com" className="flex items-center gap-2">
                                <Github className="w-5 h-5" />
                                <span className="hidden sm:inline">View Source</span>
                            </a>
                        </Button>
                        <Button
                            variant="outline"
                            size="sm"
                            onClick={() => setIsZenMode(true)}
                            className="text-zinc-400 hover:text-white border-zinc-700"
                        >
                            <Maximize2 className="w-4 h-4 mr-2" />
                            Zen Mode
                        </Button>
                    </div>
                </nav>
            </header>

            {/* Main Content */}
            <main className="max-w-screen-2xl mx-auto px-6 py-8">
                {/* Hero Section */}
                <div className="mb-12">
                    <h1 className="text-3xl md:text-4xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-white via-zinc-300 to-zinc-500 mb-4">
                        Even your minified code will look{' '}
                        <span className="text-transparent bg-clip-text bg-gradient-to-r from-violet-400 to-fuchsia-500">
                            aesthetic
                        </span>
                    </h1>
                    <motion.p className="stagger-fade text-pretty max-w-2xl mx-auto lg:mx-0 text-base text-zinc-400 mb-6">
                        A powerful <PreCode>React</PreCode> component
                        for file structure visualization. Built with{' '}
                        <PreCode>TypeScript</PreCode> and{' '}
                        <PreCode>Tailwind CSS</PreCode> and{' '}
                        <PreCode>Motion</PreCode>. Generates your
                        complete tree structures with a simple{' '}
                        <PreCode>Python</PreCode> script.
                    </motion.p>
                </div>

                <div className="grid grid-cols-1 lg:grid-cols-7 gap-6 mb-12">

                    <div className="lg:col-span-5 space-y-6">

                        <div className="h-1/2 rounded-lg border border-white/10 overflow-hidden bg-black">
                            <Tabs defaultValue="demo" className="w-full relative">
                                <div className="border-b border-white/10 relative z-10">
                                    <TabsList className="h-12 bg-zinc-900/50 relative">
                                        <TabsTrigger
                                            value="demo"
                                            className="data-[state=active]:bg-black data-[state=active]:text-white px-4 relative z-20 pointer-events-auto"
                                        >
                                            Live Demo
                                        </TabsTrigger>
                                        <TabsTrigger
                                            value="code"
                                            className="data-[state=active]:bg-black data-[state=active]:text-white px-4 relative z-20 pointer-events-auto"
                                        >
                                            Usage
                                        </TabsTrigger>
                                    </TabsList>
                                </div>

                                <TabsContent value="demo" className="relative z-0">
                                    <IDE
                                        root={projectStructure}
                                        onSelect={(path) => console.log('Selected:', path)}
                                        theme="dark"
                                        customIcons={getFileIcon}
                                    />
                                </TabsContent>

                                <TabsContent value="code" className="relative z-0">
                                    <div className="p-6 space-y-6">
                                        <CodeBlock
                                            code={USAGE_EXAMPLE}
                                            language="typescript"
                                            fileName="IDEExample.tsx"
                                            showLineNumbers
                                            enableLineHighlight
                                            badges={[
                                                { text: 'TypeScript', variant: 'primary' },
                                                { text: 'React', variant: 'secondary' }
                                            ]}
                                        />
                                        <CodeBlock
                                            code={TYPE_DEFINITION}
                                            language="typescript"
                                            fileName="types.ts"
                                            showLineNumbers
                                            enableLineHighlight
                                            badges={[
                                                { text: 'TypeScript', variant: 'primary' }
                                            ]}
                                        />
                                    </div>
                                </TabsContent>
                            </Tabs>
                        </div>
                        <TerminalOutput />
                    </div>

                    <div className="lg:col-span-2 space-y-6">
                        <div className="space-y-6">
                            <h2 className="text-xl font-semibold text-white mb-4">Features</h2>
                            <div className="space-y-6">
                                <FeatureCard
                                    feature={{
                                        icon: <Terminal className="w-5 h-5" />,
                                        title: "Framework Agnostic",
                                        description: "This is a lie, but LLM made 95% of this landing page and I'm too lazy to change it."
                                    }}
                                    index={0}
                                />
                                <FeatureCard
                                    feature={{
                                        icon: <Wand2 className="w-5 h-5" />,
                                        title: "Fully Customizable",
                                        description: "Extensive theming support and customization options."
                                    }}
                                    index={1}
                                />
                                <FeatureCard
                                    feature={{
                                        icon: <Code2 className="w-5 h-5" />,
                                        title: "TypeScript Ready",
                                        description: "Built with TypeScript for excellent developer experience."
                                    }}
                                    index={2}
                                />
                            </div>
                        </div>
                    </div>
                </div>

                {/* API Documentation */}
                <section className="border-t border-white/10 pt-12">
                    <ApiDocumentation />
                </section>
            </main>

            {/* Zen Mode */}
            <AnimatePresence>
                {isZenMode && (
                    <motion.div
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        exit={{ opacity: 0 }}
                        className="fixed inset-0 bg-black z-50"
                    >
                        <div className="h-screen flex flex-col">
                            <div className="flex justify-between items-center p-4 border-b border-white/10">
                                <h2 className="text-xl font-bold text-white">Zen Mode</h2>
                                <Button variant="ghost" size="icon" onClick={() => setIsZenMode(false)}>
                                    <X className="w-6 h-6" />
                                </Button>
                            </div>
                            <div className="flex-1">
                                <IDE
                                    root={projectStructure}
                                    onSelect={(path) => console.log('Selected:', path)}
                                    theme="dark"
                                    customIcons={getFileIcon}
                                />
                            </div>
                        </div>
                    </motion.div>
                )}
            </AnimatePresence>

            {/* Footer */}
            <footer className="border-t border-white/10 py-6 px-6">
                <div className="max-w-screen-2xl mx-auto">
                    <p className="text-sm text-zinc-400 flex items-center justify-center gap-2">
                        Made with <Heart className="w-4 h-4 text-red-500 animate-pulse" /> by{' '}
                        <a href="https://github.com/remcostoeten" className="text-violet-400 hover:text-violet-300">
                            Remco Stoeten
                        </a>
                    </p>
                </div>
            </footer>
        </div>
    );
}

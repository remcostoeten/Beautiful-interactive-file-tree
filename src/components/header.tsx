'use client'

import Logo from '@/components/logo'
import { Button } from '@/components/ui/button'
import { Github, Maximize2 } from 'lucide-react'

type HeaderProps = {
    onZenMode: () => void
}

export default function Header({ onZenMode }: HeaderProps) {
    return (
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
                        <a
                            href="https://github.com/remcostoeten/ide-component"
                            className="flex items-center gap-2"
                        >
                            <Github className="w-5 h-5" />
                            <span className="hidden sm:inline">
                                View Source
                            </span>
                        </a>
                    </Button>
                    <Button
                        variant="outline"
                        size="sm"
                        onClick={onZenMode}
                        className="text-zinc-400 hover:text-white border-zinc-700"
                    >
                        <Maximize2 className="w-4 h-4 mr-2" />
                        Zen Mode
                    </Button>
                </div>
            </nav>
        </header>
    )
}

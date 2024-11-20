'use client'

import {
	FileIcon,
	FileText,
	FileType,
	FileType2,
	FolderGit2,
	Image,
	LucideIcon,
	Package
} from 'lucide-react'

export type FileIconConfig = {
	icon: LucideIcon
	color?: string
}

// Create a mapping of file extensions to their icons and colors
export const fileIcons: Record<string, FileIconConfig> = {
	// Config files
	'tsconfig.json': { icon: FileType2, color: 'text-blue-400' },
	'package.json': { icon: Package, color: 'text-red-400' },
	'next.config.js': { icon: FileType, color: 'text-white' },
	'.env': { icon: FileText, color: 'text-yellow-400' },

	// Source files
	'.tsx': { icon: FileType2, color: 'text-blue-400' },
	'.ts': { icon: FileType2, color: 'text-blue-400' },
	'.js': { icon: FileType, color: 'text-yellow-400' },
	'.jsx': { icon: FileType, color: 'text-yellow-400' },

	// Styles
	'.css': { icon: FileType, color: 'text-blue-400' },
	'.scss': { icon: FileType, color: 'text-pink-400' },
	'.module.css': { icon: FileType, color: 'text-blue-400' },

	// Assets
	'.svg': { icon: Image, color: 'text-green-400' },
	'.png': { icon: Image, color: 'text-green-400' },
	'.jpg': { icon: Image, color: 'text-green-400' },

	// Documentation
	'.md': { icon: FileText, color: 'text-blue-200' },
	'README.md': { icon: FileText, color: 'text-blue-200' },

	// Git
	'.git': { icon: FolderGit2, color: 'text-orange-400' },

	// Default
	default: { icon: FileIcon, color: 'text-zinc-400' }
}

export function getFileIcon(fileName: string): FileIconConfig {
	// Check for exact file name match
	if (fileName in fileIcons) {
		return fileIcons[fileName]
	}

	// Check for extension match
	const extension = fileName.split('.').pop()
	if (extension && `.${extension}` in fileIcons) {
		return fileIcons[`.${extension}`]
	}

	// Return default icon if no match found
	return fileIcons.default
}

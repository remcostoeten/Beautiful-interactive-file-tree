import { type ClassValue, clsx } from 'clsx'
import { twMerge } from 'tailwind-merge'

export function cn(...inputs: ClassValue[]) {
	return twMerge(clsx(inputs))
}

export const containerClass = 'max-w-[1200px] mx-auto px-4 sm:px-6 lg:px-8'

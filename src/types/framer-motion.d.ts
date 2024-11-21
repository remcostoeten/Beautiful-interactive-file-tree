declare module 'framer-motion' {
	export const motion: any
	export const AnimatePresence: any
	export const animate: any
	export const stagger: any
	export const useAnimation: any
	export const useMotionValue: any
	export const useTransform: any
	export const useSpring: any
	export const useDragControls: any

	export type Transition = {
		duration?: number
		delay?: number
		ease?: string | number[]
		type?: string
		stiffness?: number
		damping?: number
		mass?: number
		velocity?: number
	}

	export type Variants = {
		[key: string]: {
			[key: string]: any
			transition?: Transition
		}
	}
}

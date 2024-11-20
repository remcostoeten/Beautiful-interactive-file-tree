import { Button } from '@/components/ui/button'
import { Dialog, DialogContent } from '@/components/ui/dialog'
import { motion } from 'framer-motion'
import { X } from 'lucide-react'
import IDE from './features/ide/ide'
import Footer from './footer'
import Logo from './logo'

const IsolatedIDEModal = ({
	isOpen,
	onClose,
	projectStructure
}: {
	isOpen: boolean
	onClose: () => void
	projectStructure: any
}) => {
	return (
		<Dialog open={isOpen} onOpenChange={onClose}>
			<DialogContent className="max-w-[95vw] h-[95vh] p-0 bg-black border border-white/10 overflow-hidden">
				<motion.div
					className="relative flex flex-col h-full"
					initial={{ opacity: 0, scale: 0.95 }}
					animate={{ opacity: 1, scale: 1 }}
					exit={{ opacity: 0, scale: 0.95 }}
					transition={{ duration: 0.2 }}
				>
					<div className="absolute top-4 left-4 z-50">
						<Logo size="sm" />
					</div>

					<Button
						variant="ghost"
						size="sm"
						onClick={onClose}
						className="absolute top-4 right-4 z-50 h-8 w-8 p-0 text-zinc-400 hover:text-white hover:bg-white/10"
					>
						<X className="h-4 w-4" />
					</Button>

					<div className="flex-1 min-h-0 p-12">
						<div className="w-full h-full rounded-xl overflow-hidden border border-white/10">
							<IDE
								root={projectStructure}
								onSelect={(path) =>
									console.log('Selected:', path)
								}
								theme="dark"
							/>
						</div>
					</div>

					<Footer />
				</motion.div>
			</DialogContent>
		</Dialog>
	)
}

export default IsolatedIDEModal

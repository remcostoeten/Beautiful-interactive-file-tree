export default function Footer() {
	return (
		<div className="absolute bottom-4 left-0 right-0 z-50">
			<div className="max-w-[90%] mx-auto">
				<a
					href="https://github.com/remcostoeten"
					target="_blank"
					rel="noopener noreferrer"
					className="text-sm text-zinc-500 hover:text-zinc-300 transition-colors flex items-center justify-center gap-1.5"
				>
					Made with
					<span className="inline-block animate-pulse text-red-500">
						❤️
					</span>
					by Remco Stoeten
				</a>
			</div>
		</div>
	)
}

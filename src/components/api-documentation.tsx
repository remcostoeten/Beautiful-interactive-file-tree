import { apiProps } from '@/core/config/api-props'
import { containerClass } from '@/lib/utils'
import PropsTable from './api-renderer'

export default function ApiDocumentation() {
	return (
		<section className="relative border-t border-white/10 bg-black/50 backdrop-blur-sm">
			<div className={`${containerClass} py-24`}>
				<div className="flex flex-col items-center gap-12">
					<h2 className="text-3xl font-bold tracking-tight bg-clip-text text-transparent bg-gradient-to-r from-white via-violet-300 to-purple-500">
						API Documentation
					</h2>
					<PropsTable
						sections={apiProps}
						showTypeColumn={true}
						showDefaultColumn={true}
						searchable={true}
						collapsible={true}
						showVersionBadges={true}
						showBetaBadges={true}
						initialTheme="dark"
						initialSpacing="normal"
						initialPropSpacing="normal"
						className="w-full"
					/>
				</div>
			</div>
		</section>
	)
}

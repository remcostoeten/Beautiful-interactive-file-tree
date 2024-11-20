'use client'

import { projectStructure } from '../../../core/config/tree-object'
import IDE from './ide'

export default function IDEDemo() {
	const handleFileSelect = (path: string) => {
		console.log('Selected file:', path)
	}

	return (
		<div className="h-[500px]">
			<IDE
				root={projectStructure}
				onSelect={handleFileSelect}
				theme="dark"
				defaultOpen={true}
				maxFilesOpen={3}
			/>
		</div>
	)
}

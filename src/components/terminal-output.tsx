import React from 'react'

const TerminalOutput = () => {
	const words = [
		{ text: '$~', className: 'text-zinc-400' },
		{ text: 'python3', className: 'text-emerald-400' },
		{
			text: 'src/scripts/generate-tree-object.py',
			className: 'text-blue-400'
		},
		{ text: 'src/app/', className: 'text-yellow-400' }
	]

	const outputWords = [
		{ text: 'Successfully', className: 'text-green-400' },
		{ text: 'generated', className: 'text-green-400' },
		{ text: 'IDE', className: 'text-green-400' },
		{ text: 'structure', className: 'text-green-400' },
		{ text: 'in', className: 'text-green-400' },
		{ text: 'src/core/config/tree-object.ts', className: 'text-blue-300' }
	]

	return (
		<div className="w-full max-w-2xl mx-auto lg:mx-0 mb-6 animate-fadeIn">
			<code className="text-sm rounded-lg p-4 bg-black/95 inline-block border border-white/20 font-mono shadow-md shadow-zinc-900/30 drop-shadow-md drop-shadow-zinc-900/50 bg-gradient-to-r from-transparent via-zinc-900/50 to-transparent">
				<div className="flex flex-wrap gap-x-2 animate-fadeIn">
					{words.map((word, index) => (
						<span
							key={index}
							className={`${word.className} animate-slideUp`}
							style={{
								animationDelay: `${index * 100}ms`
							}}
						>
							{word.text}
						</span>
					))}
				</div>
				<div className="flex flex-wrap gap-x-2 mt-2">
					{outputWords.map((word, index) => (
						<span
							key={index}
							className={`${word.className} animate-slideUp`}
							style={{
								animationDelay: `${(words.length + index) * 200}ms`
							}}
						>
							{word.text}
						</span>
					))}
				</div>
			</code>
		</div>
	)
}

const style = document.createElement('style')
style.textContent = `
  @keyframes fadeIn {
    from { opacity: 0; }
    to { opacity: 1; }
  }

  @keyframes slideUp {
    from { 
      opacity: 0;
      transform: translateY(20px);
    }
    to { 
      opacity: 1;
      transform: translateY(0);
    }
  }

  .animate-fadeIn {
    animation: fadeIn 0.5s 2s cubic-bezier(0.25, 0.1, 0.25, 1) forwards;
  }

  .animate-slideUp {
    opacity: 0;
    animation: slideUp 0.5s 2s cubic-bezier(0.25, 0.1, 0.25, 1) forwards;
  }
`
document.head.appendChild(style)

export default TerminalOutput

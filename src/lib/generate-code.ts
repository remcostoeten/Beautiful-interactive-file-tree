import type { CodeViewerDevProps } from '@/hooks/use-code-viewer-dev-tool'

type TGenerateCodeOptions = {
  includeDefaults?: boolean
  componentName?: string
  format?: 'pretty' | 'compact'
}

/**
 * Generates JSX code string from CodeViewer props
 * Follows the project rules: named functions only, type prefixes, no default exports
 */
export function generateCodeViewerJSX(
  props: CodeViewerDevProps,
  options: TGenerateCodeOptions = {}
): string {
  const {
    includeDefaults = false,
    componentName = 'CodeViewer',
    format = 'pretty'
  } = options

  // Default values to compare against
  const defaults = {
    theme: 'dark',
    defaultDarkTheme: 'one-dark-pro',
    defaultLightTheme: 'github-light',
    lang: 'tsx',
    showLineNumbers: true,
    className: ''
  }

  const propsToRender: Array<{ key: string; value: string }> = []

  // Always include component data
  propsToRender.push({ key: 'component', value: '{componentData}' })

  // Add props, skipping defaults unless requested
  function addPropIfNeeded(key: keyof CodeViewerDevProps, value: any) {
    if (value === undefined || value === null) return
    
    // Skip defaults unless explicitly requested
    if (!includeDefaults && defaults[key as keyof typeof defaults] === value) return
    
    let formattedValue: string
    
    if (typeof value === 'string') {
      formattedValue = `"${value}"`
    } else if (typeof value === 'boolean') {
      formattedValue = value ? '{true}' : '{false}'
    } else if (typeof value === 'object') {
      formattedValue = `{${JSON.stringify(value, null, 2)}}`
    } else {
      formattedValue = `{${value}}`
    }
    
    propsToRender.push({ key, value: formattedValue })
  }

  // Add all relevant props
  addPropIfNeeded('theme', props.theme)
  addPropIfNeeded('defaultDarkTheme', props.defaultDarkTheme)
  addPropIfNeeded('defaultLightTheme', props.defaultLightTheme)
  addPropIfNeeded('lang', props.lang)
  addPropIfNeeded('showLineNumbers', props.showLineNumbers)
  
  if (props.className && props.className.trim()) {
    addPropIfNeeded('className', props.className)
  }

  // Generate the JSX
  if (format === 'compact') {
    const propString = propsToRender
      .map(({ key, value }) => `${key}=${value}`)
      .join(' ')
    
    return `<${componentName} ${propString} />`
  }

  // Pretty format (multi-line)
  const propLines = propsToRender.map(({ key, value }) => `  ${key}=${value}`)
  
  return `<${componentName}
${propLines.join('\n')}
/>`
}

/**
 * Generates a complete usage example with imports and component setup
 */
export function generateCompleteExample(
  props: CodeViewerDevProps,
  options: TGenerateCodeOptions = {}
): string {
  const jsxCode = generateCodeViewerJSX(props, options)
  
  return `import CodeViewer from '@/components/file-viewer'
import { data } from '@/data'

function MyComponent() {
  const componentData = {
    name: "${props.componentName}",
    version: "${props.componentVersion}",
    showIndentLines: true,
    files: [
      {
        path: "src/example.${props.lang === 'tsx' ? 'tsx' : props.lang}",
        content: \`${props.sampleCode.replace(/`/g, '\\`')}\`
      }
    ]
  }

  return (
    ${jsxCode.split('\n').map(line => `    ${line}`).join('\n')}
  )
}

export default MyComponent`
}

/**
 * Formats code for display with syntax highlighting
 */
export function formatCodeForDisplay(code: string, language = 'tsx'): string {
  // Basic formatting - could be enhanced with prettier if needed
  return code.trim()
}

'use client'

import { useCallback, useState } from 'react'
import { Code2, RotateCcw } from 'lucide-react'
import { Button } from '@/components/ui/button'

type CodeEditorProps = {
  code: string
  language: string
  onChange: (code: string) => void
}

const SAMPLE_CODES: Record<string, string> = {
  tsx: `import React from 'react'
import { Button } from '@/components/ui/button'

export function ExampleComponent() {
  const [count, setCount] = React.useState(0)
  
  return (
    <div className="p-4 space-y-4">
      <h1 className="text-2xl font-bold">Counter Example</h1>
      <p>Current count: {count}</p>
      <Button 
        onClick={() => setCount(count + 1)}
        className="bg-blue-500 hover:bg-blue-600"
      >
        Increment
      </Button>
    </div>
  )
}`,
  typescript: `interface User {
  id: string
  name: string
  email: string
  createdAt: Date
}

class UserService {
  private users: User[] = []
  
  async createUser(userData: Omit<User, 'id' | 'createdAt'>): Promise<User> {
    const user: User = {
      id: crypto.randomUUID(),
      createdAt: new Date(),
      ...userData
    }
    
    this.users.push(user)
    return user
  }
  
  findUserById(id: string): User | undefined {
    return this.users.find(user => user.id === id)
  }
}`,
  javascript: `function createCounter(initialValue = 0) {
  let count = initialValue
  
  return {
    get value() {
      return count
    },
    increment() {
      count++
      return count
    },
    decrement() {
      count--
      return count
    },
    reset() {
      count = initialValue
      return count
    }
  }
}

const counter = createCounter(10)
console.log(counter.value) // 10
console.log(counter.increment()) // 11`,
  json: `{
  "name": "beautiful-file-tree-v2",
  "version": "1.0.0",
  "description": "A beautiful file viewer component",
  "scripts": {
    "dev": "next dev",
    "build": "next build",
    "start": "next start",
    "lint": "next lint"
  },
  "dependencies": {
    "react": "^19.0.0",
    "next": "^15.0.0",
    "tailwindcss": "^3.0.0"
  },
  "author": "Remco Stoeten",
  "license": "MIT"
}`,
  css: `/* Modern CSS Reset */
*,
*::before,
*::after {
  box-sizing: border-box;
  margin: 0;
  padding: 0;
}

/* Component Styles */
.card {
  background: hsl(var(--card));
  border: 1px solid hsl(var(--border));
  border-radius: 0.75rem;
  padding: 1.5rem;
  box-shadow: 0 1px 3px 0 rgb(0 0 0 / 0.1);
  transition: all 0.2s ease-in-out;
}

.card:hover {
  transform: translateY(-2px);
  box-shadow: 0 10px 25px -5px rgb(0 0 0 / 0.1);
}

.card-title {
  font-size: 1.25rem;
  font-weight: 600;
  color: hsl(var(--foreground));
  margin-bottom: 0.5rem;
}`,
  python: `class DataProcessor:
    def __init__(self, data: list):
        self.data = data
        self.processed = False
    
    def filter_data(self, condition):
        """Filter data based on a condition function"""
        self.data = [item for item in self.data if condition(item)]
        return self
    
    def transform(self, transformation):
        """Apply transformation to each item"""
        self.data = [transformation(item) for item in self.data]
        return self
    
    def aggregate(self, operation):
        """Aggregate data using the specified operation"""
        if not self.data:
            return None
        return operation(self.data)

# Example usage
processor = DataProcessor([1, 2, 3, 4, 5, 6, 7, 8, 9, 10])
result = (processor
    .filter_data(lambda x: x % 2 == 0)
    .transform(lambda x: x ** 2)
    .aggregate(sum))
print(result)  # 220`
}

export function CodeEditor({ code, language, onChange }: CodeEditorProps) {
  const [localCode, setLocalCode] = useState(code)
  
  const handleChange = useCallback((value: string) => {
    setLocalCode(value)
    // Debounce the onChange call
    const timeoutId = setTimeout(() => {
      onChange(value)
    }, 500)
    
    return () => clearTimeout(timeoutId)
  }, [onChange])

  const loadSample = useCallback(() => {
    const sample = SAMPLE_CODES[language] || SAMPLE_CODES.tsx
    setLocalCode(sample)
    onChange(sample)
  }, [language, onChange])

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <h4 className="text-sm font-medium flex items-center gap-2">
          <Code2 className="w-4 h-4" />
          Code Editor
        </h4>
        <Button
          variant="outline"
          size="sm"
          onClick={loadSample}
          className="text-xs"
        >
          <RotateCcw className="w-3 h-3 mr-1" />
          Load Sample
        </Button>
      </div>
      
      <div className="relative">
        <textarea
          value={localCode}
          onChange={(e) => handleChange(e.target.value)}
          className="w-full h-96 p-3 text-sm font-mono bg-muted border border-input rounded-md focus:outline-none focus:ring-2 focus:ring-primary focus:ring-offset-2 resize-none"
          placeholder={`Enter your ${language} code here...`}
          spellCheck={false}
        />
        
        <div className="absolute bottom-2 right-2 text-xs text-muted-foreground bg-background/80 backdrop-blur-sm px-2 py-1 rounded">
          {language.toUpperCase()}
        </div>
      </div>
      
      <div className="text-xs text-muted-foreground">
        <p>Changes are automatically saved. Use "Load Sample" to get started with example code.</p>
      </div>
    </div>
  )
}

import { dirname } from 'path'
import { fileURLToPath } from 'url'
import { FlatCompat } from '@eslint/eslintrc'
import tsParser from '@typescript-eslint/parser'
import tsPlugin from '@typescript-eslint/eslint-plugin'
import importPlugin from 'eslint-plugin-import'
import simpleImportSort from 'eslint-plugin-simple-import-sort'
import unusedImports from 'eslint-plugin-unused-imports'

const __filename = fileURLToPath(import.meta.url)
const __dirname = dirname(__filename)

const compat = new FlatCompat({
    baseDirectory: __dirname
})

const eslintConfig = [
    ...compat.extends('next/core-web-vitals', 'next/typescript'),
    {
        files: ['**/*.{js,jsx,ts,tsx}'],
        languageOptions: {
            parser: tsParser,
            parserOptions: {
                ecmaVersion: 'latest',
                sourceType: 'module',
                ecmaFeatures: {
                    jsx: true
                }
            }
        },
        plugins: {
            '@typescript-eslint': tsPlugin,
            import: importPlugin,
            'simple-import-sort': simpleImportSort,
            'unused-imports': unusedImports
        },
        rules: {
            // Prettier will handle formatting, so disable conflicting rules
            semi: 'off',
            quotes: 'off',
            'comma-dangle': 'off',
            indent: 'off',
            
            // Import sorting
            'simple-import-sort/imports': 'error',
            'simple-import-sort/exports': 'error',
            'import/first': 'error',
            'import/newline-after-import': 'error',
            'import/no-duplicates': 'error',
            
            // Unused imports
            'unused-imports/no-unused-imports': 'error',
            'unused-imports/no-unused-vars': [
                'warn',
                {
                    vars: 'all',
                    varsIgnorePattern: '^_',
                    args: 'after-used',
                    argsIgnorePattern: '^_'
                }
            ],
            
            // Function declarations (no arrow functions as constants)
            'prefer-function-declaration-for-components': 'off',
            'func-style': ['error', 'declaration', { allowArrowFunctions: false }],
            
            // TypeScript specific
            '@typescript-eslint/consistent-type-definitions': ['error', 'type'],
            '@typescript-eslint/prefer-function-type': 'error',
            '@typescript-eslint/no-empty-interface': 'error',
            
            // Custom rule for type naming (T prefix)
            '@typescript-eslint/naming-convention': [
                'error',
                {
                    selector: 'typeAlias',
                    format: ['PascalCase'],
                    prefix: ['T']
                },
                {
                    selector: 'interface',
                    format: ['PascalCase'],
                    prefix: ['T']
                }
            ],
            
            // Disable interface in favor of type
            '@typescript-eslint/consistent-type-definitions': ['error', 'type'],
            
            // No classes
            'no-restricted-syntax': [
                'error',
                {
                    selector: 'ClassDeclaration',
                    message: 'Classes are not allowed. Use functions instead.'
                },
                {
                    selector: 'VariableDeclarator[id.name=/^[A-Z]/] > ArrowFunctionExpression',
                    message: 'Arrow function constants are not allowed. Use function declarations instead.'
                }
            ]
        }
    },
    {
        ignores: [
            'node_modules/**',
            '.next/**',
            'out/**',
            'build/**',
            'next-env.d.ts',
            '*.config.js',
            '*.config.mjs',
            'src/**/ui/**',
            'src/hooks/src/components/ui/**'
        ]
    }
]

export default eslintConfig

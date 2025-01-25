import globals from 'globals'
import js from '@eslint/js'
import ts from '@typescript-eslint/eslint-plugin'
import tsParser from '@typescript-eslint/parser'
import { rules as prettierRules } from 'eslint-config-prettier'

/** @type {import('eslint').Linter.Config} */
export default {
    parser: tsParser,
    parserOptions: {
        ecmaVersion: 2020,
        sourceType: 'module',
        project: './tsconfig.json',
    },
    plugins: ['@typescript-eslint', 'import', 'prettier'],
    extends: [
        'eslint:recommended',
        'plugin:@typescript-eslint/recommended',
        'plugin:import/errors',
        'plugin:import/warnings',
        'plugin:import/typescript',
        'plugin:@typescript-eslint/recommended-requiring-type-checking',
        'plugin:prettier/recommended',
    ],
    rules: {
        // Enforce consistent code style
        indent: ['error', 2],
        quotes: ['error', 'single'],
        semi: ['error', 'always'],

        // Best practices
        'no-unused-vars': 'warn',
        'no-console': 'warn',
        'no-debugger': 'error',

        // TypeScript-specific rules
        '@typescript-eslint/explicit-function-return-type': 'warn',
        '@typescript-eslint/no-explicit-any': 'warn',
        '@typescript-eslint/no-unused-vars': 'warn',

        // Import rules
        'import/no-unresolved': 'error',
        'import/named': 'error',
        'import/default': 'error',
        'import/order': [
            'error',
            {
                groups: [
                    'builtin',
                    'external',
                    'internal',
                    'parent',
                    'sibling',
                    'index',
                ],
                'newlines-between': 'always',
            },
        ],

        // Override prettier conflicts
        'prettier/prettier': 'error',
        ...prettierRules,
    },
    env: {
        browser: true,
        node: true,
        es2021: true,
    },
}

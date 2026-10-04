import { defineConfig } from 'vitest/config'
import { fileURLToPath } from 'node:url'

const sourceDirectory = fileURLToPath(new URL('./src', import.meta.url))

export default defineConfig({
    resolve: {
        alias: {
            '@': sourceDirectory,
        },
    },
    test: {
        globals: true,
        environment: 'node',
        include: ['tests/**/*.test.ts', 'src/**/*.test.ts'],
        coverage: {
            provider: 'v8',
            reporter: ['text', 'json', 'html'],
            exclude: ['node_modules/', 'tests/', '**/*.d.ts', '**/index.ts'],
        },
        setupFiles: ['./tests/setup.ts'],
    },
})

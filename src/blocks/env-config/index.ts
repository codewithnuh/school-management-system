import { z } from 'zod'

export class EnvValidationError extends Error {
    readonly issues: readonly z.ZodIssue[]

    constructor(issues: readonly z.ZodIssue[]) {
        const summary = issues
            .map(
                ({ path, message }) =>
                    `  ${path.join('.') || '(root)'}: ${message}`,
            )
            .join('\n')

        super(`Environment configuration is invalid:\n${summary}`)
        this.name = 'EnvValidationError'
        this.issues = issues
        Object.setPrototypeOf(this, new.target.prototype)
        Object.freeze(this)
    }
}

export function parseEnv<S extends z.ZodType<unknown, z.ZodTypeDef, unknown>>(
    schema: S,
    source:
        | NodeJS.ProcessEnv
        | Record<string, string | undefined> = process.env,
): z.output<S> {
    const result = schema.safeParse(source)

    if (!result.success) {
        throw new EnvValidationError(result.error.issues)
    }

    return result.data as z.output<S>
}

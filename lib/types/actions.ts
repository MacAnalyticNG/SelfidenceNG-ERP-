/**
 * Shared action state type used across all server actions.
 * Provides a consistent response format for form submissions.
 */
export type ActionState = {
    success: boolean
    message?: string
    errors?: Record<string, string[]>
}

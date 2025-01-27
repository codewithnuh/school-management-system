export interface ApiResponse<T> {
    success: boolean
    data: T | null
    error: string | null
    message: string | null
    statusCode: number
    timestamp: string
}
export interface PaginatedResponse<T> {
    items: T[]
    total: number
    page: number
    limit: number
    totalPages: number
}

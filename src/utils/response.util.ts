import { ApiResponse, PaginatedResponse } from '@/types/api-response'

export class ResponseUtil {
    static success<T>(
        data: T,
        message: string = 'Operation successful',
        statusCode: number = 200,
    ): ApiResponse<T> {
        return {
            success: true,
            data,
            error: null,
            message,
            statusCode,
            timestamp: new Date().toISOString(),
        }
    }

    static error<T>(
        error: string,
        statusCode: number = 400,
        message: string | null = null,
    ): ApiResponse<T> {
        return {
            success: false,
            data: null,
            error,
            message,
            statusCode,
            timestamp: new Date().toISOString(),
        }
    }
    // Paginated response helper
    static paginated<T>(
        items: T[],
        total: number,
        page: number,
        limit: number,
        message: string = 'Data retrieved successfully',
    ): ApiResponse<PaginatedResponse<T>> {
        return this.success(
            {
                items,
                total,
                page,
                limit,
                totalPages: Math.ceil(total / limit),
            },
            message,
        )
    }
}

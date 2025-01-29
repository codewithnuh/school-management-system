export class ResponseUtil {
    static success(data, message = 'Operation successful', statusCode = 200) {
        return {
            success: true,
            data,
            error: null,
            message,
            statusCode,
            timestamp: new Date().toISOString(),
        };
    }
    static error(error, statusCode = 400, message = null) {
        return {
            success: false,
            data: null,
            error,
            message,
            statusCode,
            timestamp: new Date().toISOString(),
        };
    }
    // Paginated response helper
    static paginated(items, total, page, limit, message = 'Data retrieved successfully') {
        return this.success({
            items,
            total,
            page,
            limit,
            totalPages: Math.ceil(total / limit),
        }, message);
    }
}

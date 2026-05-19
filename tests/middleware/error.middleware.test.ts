import { describe, it, expect, vi, beforeEach } from 'vitest';
import { errorHandler } from '../../src/middleware/error.middleware';
import { AppError } from '../../src/errors';
import { Request, Response, NextFunction } from 'express';

describe('Error Handler Middleware', () => {
  let mockReq: Partial<Request>;
  let mockRes: Partial<Response>;
  let mockNext: NextFunction;

  beforeEach(() => {
    mockReq = {};
    mockRes = {
      status: vi.fn().mockReturnThis(),
      json: vi.fn()
    };
    mockNext = vi.fn();
  });

  it('should handle AppError with proper status code and message', () => {
    const error = new AppError('Test error', 400);
    
    errorHandler(error, mockReq as Request, mockRes as Response, mockNext);
    
    expect(mockRes.status).toHaveBeenCalledWith(400);
    expect(mockRes.json).toHaveBeenCalledWith({
      success: false,
      message: 'Test error'
    });
  });

  it('should handle generic Error with 500 status', () => {
    const error = new Error('Generic error');
    
    errorHandler(error, mockReq as Request, mockRes as Response, mockNext);
    
    expect(mockRes.status).toHaveBeenCalledWith(500);
    expect(mockRes.json).toHaveBeenCalledWith({
      success: false,
      message: 'Internal server error'
    });
  });

  it('should include stack trace in development mode', () => {
    const originalEnv = process.env.NODE_ENV;
    process.env.NODE_ENV = 'development';
    
    const error = new AppError('Test error', 400);
    errorHandler(error, mockReq as Request, mockRes as Response, mockNext);
    
    expect(mockRes.json).toHaveBeenCalledWith(
      expect.objectContaining({
        stack: expect.any(String)
      })
    );
    
    process.env.NODE_ENV = originalEnv;
  });

  it('should not include stack trace in production mode', () => {
    const originalEnv = process.env.NODE_ENV;
    process.env.NODE_ENV = 'production';
    
    const error = new AppError('Test error', 400);
    errorHandler(error, mockReq as Request, mockRes as Response, mockNext);
    
    const response = (mockRes.json as any).mock.calls[0][0];
    expect(response.stack).toBeUndefined();
    
    process.env.NODE_ENV = originalEnv;
  });
});

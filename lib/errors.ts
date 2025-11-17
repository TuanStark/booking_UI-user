/**
 * Custom Error Classes for better error handling
 * Senior-level pattern: Specific error types for different scenarios
 */

export class ServiceError extends Error {
  constructor(
    message: string,
    public code: string,
    public statusCode?: number,
    public details?: any
  ) {
    super(message)
    this.name = this.constructor.name
    Error.captureStackTrace(this, this.constructor)
  }
}

export class NotFoundError extends ServiceError {
  constructor(resource: string, id?: string) {
    super(
      `${resource}${id ? ` with id ${id}` : ''} not found`,
      'NOT_FOUND',
      404
    )
  }
}

export class ValidationError extends ServiceError {
  constructor(message: string, details?: any) {
    super(message, 'VALIDATION_ERROR', 400, details)
  }
}

export class NetworkError extends ServiceError {
  constructor(message: string = 'Network request failed') {
    super(message, 'NETWORK_ERROR', 0)
  }
}

export class ServerError extends ServiceError {
  constructor(message: string = 'Internal server error', statusCode: number = 500) {
    super(message, 'SERVER_ERROR', statusCode)
  }
}


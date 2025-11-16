// API Response Types
export interface ApiResponse<T = any> {
  success: boolean
  data?: T
  message?: string
  error?: string
}

// Backend API Response with nested data structure
export interface BackendApiResponse<T = any> {
  data?: {
    data?: T | T[]
    meta?: {
      total?: number
      pageNumber?: number
      limitNumber?: number
      totalPages?: number
    }
  }
  statusCode?: number
  message?: string
}

export interface LoginResponse {
  user: {
    id: string
    email: string
    name: string
    role: string
  }
  token: string
}

export interface RegisterResponse {
  user: {
    id: string
    email: string
    name: string
    role: string
  }
}

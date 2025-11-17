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
  } | T | T[] // Support both nested and flat structures
  statusCode?: number
  message?: string
}

export interface LoginResponse {
  data: {
    accessToken: string 
    refreshToken: string
  }
  success: boolean
  message: string
}

export interface RegisterResponse {
  user: {
    id: string
    email: string
    name: string
    role: string
  }
}


export interface RoleResponse {
  id: string
  name: string
}
export interface UserResponse {
  id: string
  email: string
  name: string
  role: RoleResponse
}
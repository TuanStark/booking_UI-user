// API Response Types
export interface ApiResponse<T = any> {
  success: boolean
  data?: T
  message?: string
  error?: string
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

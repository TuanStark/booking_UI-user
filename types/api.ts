// pagination
export type PaginationMeta = {
  total: number
  page: number
  limit: number
  totalPages: number
}

export type PaginatedResponse<T> = {
  items: T
  meta: PaginationMeta & {
    hasNextPage: boolean
    hasPrevPage: boolean
  }
}

export interface BackendApiResponse<T = any> {
  data: {
    data: T
    meta: PaginationMeta
  }
  statusCode: number
  message: string
}


// login
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
  phone?: string | null
  address?: string | null
  createdAt?: string | null
  updatedAt?: string | null
}
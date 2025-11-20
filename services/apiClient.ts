/**
 * API Client - HTTP Request Layer
 * 
 * Enterprise patterns used:
 * - Single Responsibility Principle (only handles HTTP)
 * - Error Handling with proper error types
 * - Type Safety
 * - Request/Response Interceptors pattern
 * - Query Parameter Serialization
 * 
 * This is the lowest level - only responsible for making HTTP requests
 * and returning raw responses. No business logic here.
 */

import { NetworkError, ServerError, ValidationError } from '@/lib/errors'

// API Configuration
const API_BASE_URL = process.env.NEXT_PUBLIC_API_BASE_URL || 'http://localhost:4000'

/**
 * Serialize query parameters, handling nested objects (filters)
 */
function serializeQueryParams(params: Record<string, any>): string {
  const searchParams = new URLSearchParams()
  
  Object.entries(params).forEach(([key, value]) => {
    if (value === undefined || value === null) {
      return
    }

    // Handle filters object - serialize each filter key-value pair
    if (key === 'filters' && typeof value === 'object' && !Array.isArray(value)) {
      Object.entries(value).forEach(([filterKey, filterValue]) => {
        searchParams.append(`filters[${filterKey}]`, String(filterValue))
      })
    } else {
      searchParams.append(key, String(value))
    }
  })
  
  return searchParams.toString()
}

/**
 * API Client Class
 * Handles all HTTP communication with the backend API
 */
class ApiClient {
  private baseURL: string

  constructor(baseURL: string) {
    this.baseURL = baseURL
  }

  /**
   * Core request method - handles all HTTP requests
   * 
   * @param endpoint - API endpoint (e.g., '/buildings')
   * @param options - Fetch options (method, headers, body, etc.)
   * @returns Promise<T> - Parsed JSON response
   * @throws {NetworkError} - If network request fails
   * @throws {ServerError} - If server returns error status
   * @throws {ValidationError} - If request is invalid (400)
   */
  private async request<T>(
    endpoint: string,
    options: RequestInit = {}
  ): Promise<T> {
    const url = `${this.baseURL}${endpoint}`
    
    const config: RequestInit = {
      headers: {
        'Content-Type': 'application/json',
        ...options.headers,
      },
      ...options,
    }

    try {
      const response = await fetch(url, config)
      
      // Handle non-OK responses
      if (!response.ok) {
        const errorData = await response.json().catch(() => ({
          message: `HTTP error! status: ${response.status}`,
        }))

        // Map HTTP status codes to appropriate error types
        if (response.status >= 400 && response.status < 500) {
          if (response.status === 404) {
            throw new ValidationError(errorData.message || 'Resource not found')
          }
          throw new ValidationError(errorData.message || `Client error: ${response.status}`)
        }

        if (response.status >= 500) {
          throw new ServerError(
            errorData.message || `Server error: ${response.status}`,
            response.status
          )
        }

        throw new ServerError(errorData.message || `HTTP error: ${response.status}`, response.status)
      }

      return await response.json()
    } catch (error: any) {
      // Re-throw known errors
      if (error instanceof NetworkError || error instanceof ServerError || error instanceof ValidationError) {
        throw error
      }

      // Handle network errors (fetch failures)
      if (error instanceof TypeError && error.message.includes('fetch')) {
        throw new NetworkError('Network request failed. Please check your connection.')
      }

      // Wrap unknown errors
      throw new NetworkError(error.message || 'An unexpected error occurred')
    }
  }

  // ==================== Auth Endpoints ====================

  /**
   * Login user
   */
  async login(credentials: { email: string; password: string }) {
    return this.request('/auth/login', {
      method: 'POST',
      body: JSON.stringify(credentials),
    })
  }

  /**
   * Register new user
   */
  async register(userData: {
    name: string
    email: string
    password: string
    studentId: string
    phone: string
  }) {
    return this.request('/auth/register', {
      method: 'POST',
      body: JSON.stringify(userData),
    })
  }

  /**
   * Get user profile
   */
  async getProfile(token: string) {
    return this.request('/auth/user/profile', {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    })
  }

  // ==================== Buildings Endpoints ====================

  /**
   * Get all buildings with optional filters and pagination
   */
  async getBuildings(params?: {
    page?: number
    limit?: number
    search?: string
    filters?: Record<string, any>
  }) {
    const queryString = params ? serializeQueryParams(params) : ''
    return this.request(`/buildings${queryString ? `?${queryString}` : ''}`)
  }

  /**
   * Get building by ID
   */
  async getBuildingById(id: string) {
    return this.request(`/buildings/${id}`)
  }

  /**
   * Get building detail with rooms
   * Endpoint: GET /building/:buildingId
   */
  async getBuildingDetail(buildingId: string) {
    return this.request(`/building/${buildingId}`)
  }

  /**
   * Get rooms by building ID
   */
  async getRoomsByBuildingId(buildingId: string, params?: {
    page?: number
    limit?: number
    filters?: Record<string, any>
  }) {
    const queryString = params ? serializeQueryParams(params) : ''
    return this.request(`/rooms/building/${buildingId}${queryString ? `?${queryString}` : ''}`)
  }

  // ==================== Rooms Endpoints ====================

  /**
   * Get room by ID
   */
  async getRoomById(id: string) {
    return this.request(`/rooms/${id}`)
  }

  // ==================== Bookings Endpoints ====================

  /**
   * Create a new booking
   */
  async createBooking(
    bookingData: {
      startDate: string
      endDate: string
      typePayment: string
      note?: string
      details: {
        roomId: string
        price: number
        note?: string
        time: number
      }[]
    },
    token: string,
    userId: string,
  ) {
    return this.request('/bookings', {
      method: 'POST',
      headers: {
        Authorization: `Bearer ${token}`,
        'x-user-id': userId,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(bookingData),
    })
  }

  /**
   * Get user's bookings
   */
  async getUserBookings(token: string) {
    return this.request('/bookings/my-bookings', {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    })
  }

  /**
   * Get booking by ID
   */
  async getBookingById(id: string, token: string) {
    return this.request(`/bookings/${id}`, {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    })
  }

  /**
   * Update booking status
   */
  async updateBookingStatus(id: string, status: string, token: string) {
    return this.request(`/bookings/${id}/status`, {
      method: 'PATCH',
      headers: {
        Authorization: `Bearer ${token}`,
      },
      body: JSON.stringify({ status }),
    })
  }

  // ==================== Reviews Endpoints ====================

  /**
   * Create a review
   */
  async createReview(reviewData: {
    roomId: string
    rating: number
    comment: string
  }, token: string) {
    return this.request('/reviews', {
      method: 'POST',
      headers: {
        Authorization: `Bearer ${token}`,
      },
      body: JSON.stringify(reviewData),
    })
  }

  /**
   * Get reviews for a room
   */
  async getRoomReviews(roomId: string) {
    return this.request(`/rooms/${roomId}/reviews`)
  }

  // ==================== Notifications Endpoints ====================

  /**
   * Get user notifications
   */
  async getNotifications(token: string) {
    return this.request('/notifications', {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    })
  }

  /**
   * Mark notification as read
   */
  async markNotificationAsRead(id: string, token: string) {
    return this.request(`/notifications/${id}/read`, {
      method: 'PATCH',
      headers: {
        Authorization: `Bearer ${token}`,
      },
    })
  }

  // ==================== Upload Endpoints ====================

  /**
   * Upload an image
   */
  async uploadImage(file: File, token: string) {
    const formData = new FormData()
    formData.append('image', file)

    return this.request('/upload/image', {
      method: 'POST',
      headers: {
        Authorization: `Bearer ${token}`,
      },
      body: formData,
    })
  }
}

// Create API client instance
export const apiClient = new ApiClient(API_BASE_URL)

// Export individual methods for convenience (optional, for direct usage)
export const {
  login,
  register,
  getProfile,
  getBuildings,
  getBuildingById,
  getBuildingDetail,
  getRoomsByBuildingId,
  getRoomById,
  createBooking,
  getUserBookings,
  getBookingById,
  updateBookingStatus,
  createReview,
  getRoomReviews,
  getNotifications,
  markNotificationAsRead,
  uploadImage,
} = apiClient

export default apiClient

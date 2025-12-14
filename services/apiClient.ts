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
import axiosInstance, { api } from '@/lib/axios'
import { AxiosRequestConfig } from 'axios'

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
 * Uses axios for all HTTP requests
 */
class ApiClient {
  private baseURL: string

  constructor(baseURL: string) {
    this.baseURL = baseURL
  }

  /**
   * Core request method - handles all HTTP requests using axios
   * 
   * @param endpoint - API endpoint (e.g., '/buildings')
   * @param config - Axios request configuration
   * @returns Promise<T> - Parsed JSON response
   * @throws {NetworkError} - If network request fails
   * @throws {ServerError} - If server returns error status
   * @throws {ValidationError} - If request is invalid (400)
   */
  private async request<T>(
    endpoint: string,
    config: AxiosRequestConfig = {}
  ): Promise<T> {
    try {
      const response = await axiosInstance.request<T>({
        url: endpoint,
        ...config,
      })
      return response.data
    } catch (error: any) {
      // Errors are already handled by axios interceptor
      // Re-throw them as-is
      throw error
    }
  }

  // ==================== Auth Endpoints ====================

  /**
   * Login user
   */
  async login(credentials: { email: string; password: string }) {
    return this.request('/auth/login', {
      method: 'POST',
      data: credentials,
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
      data: userData,
    })
  }

  /**
   * Get user profile
   */
  async getProfile(token: string) {
    return this.request('/auth/user/profile', {
      method: 'GET',
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
    return this.request(`/buildings${queryString ? `?${queryString}` : ''}`, {
      method: 'GET',
    })
  }

  /**
   * Get building by ID
   */
  async getBuildingById(id: string) {
    return this.request(`/buildings/${id}`, {
      method: 'GET',
    })
  }

  /**
   * Get building detail with rooms
   * Endpoint: GET /building/:buildingId
   */
  async getBuildingDetail(buildingId: string) {
    return this.request(`/building/${buildingId}`, {
      method: 'GET',
    })
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
    return this.request(`/rooms/building/${buildingId}${queryString ? `?${queryString}` : ''}`, {
      method: 'GET',
    })
  }

  // ==================== Rooms Endpoints ====================

  /**
   * Get room by ID
   */
  async getRoomById(id: string) {
    return this.request(`/rooms/${id}`, {
      method: 'GET',
    })
  }

  // ==================== Bookings Endpoints ====================

  /**
   * Create a new booking
   */
  async createBooking(
    bookingData: {
      startDate: string
      endDate: string
      paymentMethod: string
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
      },
      data: bookingData,
    })
  }

  /**
   * Get user's bookings
   */
  async getUserBookings(token: string) {
    return this.request('/bookings/my-bookings', {
      method: 'GET',
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
      method: 'GET',
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
      data: { status },
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
      data: reviewData,
    })
  }

  /**
   * Get reviews for a room
   */
  async getRoomReviews(roomId: string) {
    return this.request(`/rooms/${roomId}/reviews`, {
      method: 'GET',
    })
  }

  // ==================== Notifications Endpoints ====================

  /**
   * Get user notifications
   */
  async getNotifications(token: string) {
    return this.request('/notifications', {
      method: 'GET',
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
        'Content-Type': 'multipart/form-data',
      },
      data: formData,
    })
  }

  // ==================== Payment Endpoints ====================

  /**
   * Verify VNPay payment callback
   */
  async verifyVNPayPayment(params: Record<string, string>) {
    return this.request('/payments/vnpay/verify', {
      method: 'POST',
      data: params,
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

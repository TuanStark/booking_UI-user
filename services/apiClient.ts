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
   * @throws {EmailNotVerifiedError} When email exists but not verified
   */
  async login(credentials: { email: string; password: string }) {
    return this.request('/auth/login', {
      method: 'POST',
      data: credentials,
    })
  }

  /**
   * Verify email with code from email
   */
  async verifyEmailCode(payload: { codeId: string; id: string }) {
    return this.request('/auth/check-code', {
      method: 'POST',
      data: payload,
    })
  }

  /**
   * Resend verification code to email
   */
  async resendVerificationCode(payload: { id: string; email: string }) {
    return this.request('/auth/resend-code', {
      method: 'POST',
      data: payload,
    })
  }

  /**
   * Register new user (auth-service: name, email, studentId?, phone?, password, confirmPassword)
   */
  async register(userData: {
    name: string
    email: string
    password: string
    confirmPassword: string
    studentId?: string
    phone?: string
  }) {
    return this.request<{ data?: unknown; statusCode?: number; message?: string }>('/auth/register', {
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

  /**
   * Update user profile
   */
  async updateProfile(userId: string, userData: { name?: string; phone?: string; address?: string }, token: string) {
    return this.request(`/auth/user/${userId}`, {
      method: 'PATCH',
      headers: {
        Authorization: `Bearer ${token}`,
      },
      data: userData,
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
        occupancyUnits?: number
        note?: string
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
   * Returns { bookingId: string | null } when the user may review this room (completed stay).
   */
  async getCheckReviewed(roomId: string, token: string) {
    const q = encodeURIComponent(roomId)
    return this.request<{
      bookingId: string | null
      alreadyReviewed?: boolean
    }>(`/bookings/check-reviewed?roomId=${q}`, {
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
   * Đặt phòng theo phòng (user đã đăng nhập) — dùng để hiển thị lịch bận, không hiển thị PII ra UI.
   */
  async getBookingsByRoomId(roomId: string, token: string) {
    return this.request<unknown>(`/bookings/room/${encodeURIComponent(roomId)}`, {
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
    bookingId: string
    roomId?: string
    ratingOverall: number
    ratingClean?: number
    ratingLocation?: number
    ratingPrice?: number
    ratingService?: number
    comment?: string
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
  async getRoomReviews(roomId: string, params?: {
    limit?: number
    cursor?: string
  }) {
    const queryString = params ? serializeQueryParams(params) : ''
    return this.request(`/reviews/room/${roomId}${queryString ? `?${queryString}` : ''}`, {
      method: 'GET',
    })
  }

  /**
   * Danh sách đánh giá công khai (review-service GET /reviews), dùng trang chủ / testimonials.
   */
  async getPublicReviews(params?: { page?: number; limit?: number }) {
    const queryString = serializeQueryParams({
      page: params?.page ?? 1,
      limit: params?.limit ?? 12,
      status: 'VISIBLE',
      sortBy: 'createdAt',
      sortOrder: 'desc',
    })
    return this.request<unknown>(`/reviews?${queryString}`, {
      method: 'GET',
    })
  }

  /** Aggregated rating for a room (review-service). */
  async getRoomRatingStats(roomId: string) {
    return this.request<{
      roomId?: string
      totalReviews?: number
      avgRating?: string | number
    }>(`/rating-stats/${encodeURIComponent(roomId)}`, {
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

  /**
   * Submit public contact form via API gateway -> notification-service
   */
  async submitContactForm(contactData: {
    name: string
    email: string
    phone?: string
    subject: string
    message: string
  }) {
    return this.request('/notifications/contact', {
      method: 'POST',
      data: contactData,
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

// Export wrappers instead of destructuring class methods, so `this` remains bound.
export const login = (...args: Parameters<ApiClient['login']>) =>
  apiClient.login(...args)
export const register = (...args: Parameters<ApiClient['register']>) =>
  apiClient.register(...args)
export const verifyEmailCode = (...args: Parameters<ApiClient['verifyEmailCode']>) =>
  apiClient.verifyEmailCode(...args)
export const resendVerificationCode = (...args: Parameters<ApiClient['resendVerificationCode']>) =>
  apiClient.resendVerificationCode(...args)
export const getProfile = (...args: Parameters<ApiClient['getProfile']>) =>
  apiClient.getProfile(...args)
export const getBuildings = (...args: Parameters<ApiClient['getBuildings']>) =>
  apiClient.getBuildings(...args)
export const getBuildingById = (...args: Parameters<ApiClient['getBuildingById']>) =>
  apiClient.getBuildingById(...args)
export const getBuildingDetail = (...args: Parameters<ApiClient['getBuildingDetail']>) =>
  apiClient.getBuildingDetail(...args)
export const getRoomsByBuildingId = (...args: Parameters<ApiClient['getRoomsByBuildingId']>) =>
  apiClient.getRoomsByBuildingId(...args)
export const getRoomById = (...args: Parameters<ApiClient['getRoomById']>) =>
  apiClient.getRoomById(...args)
export const createBooking = (...args: Parameters<ApiClient['createBooking']>) =>
  apiClient.createBooking(...args)
export const getUserBookings = (...args: Parameters<ApiClient['getUserBookings']>) =>
  apiClient.getUserBookings(...args)
export const getCheckReviewed = (...args: Parameters<ApiClient['getCheckReviewed']>) =>
  apiClient.getCheckReviewed(...args)
export const getBookingById = (...args: Parameters<ApiClient['getBookingById']>) =>
  apiClient.getBookingById(...args)
export const getBookingsByRoomId = (...args: Parameters<ApiClient['getBookingsByRoomId']>) =>
  apiClient.getBookingsByRoomId(...args)
export const updateBookingStatus = (...args: Parameters<ApiClient['updateBookingStatus']>) =>
  apiClient.updateBookingStatus(...args)
export const createReview = (...args: Parameters<ApiClient['createReview']>) =>
  apiClient.createReview(...args)
export const getRoomReviews = (...args: Parameters<ApiClient['getRoomReviews']>) =>
  apiClient.getRoomReviews(...args)
export const getPublicReviews = (...args: Parameters<ApiClient['getPublicReviews']>) =>
  apiClient.getPublicReviews(...args)
export const getRoomRatingStats = (...args: Parameters<ApiClient['getRoomRatingStats']>) =>
  apiClient.getRoomRatingStats(...args)
export const getNotifications = (...args: Parameters<ApiClient['getNotifications']>) =>
  apiClient.getNotifications(...args)
export const markNotificationAsRead = (...args: Parameters<ApiClient['markNotificationAsRead']>) =>
  apiClient.markNotificationAsRead(...args)
export const submitContactForm = (...args: Parameters<ApiClient['submitContactForm']>) =>
  apiClient.submitContactForm(...args)
export const uploadImage = (...args: Parameters<ApiClient['uploadImage']>) =>
  apiClient.uploadImage(...args)
export const updateProfile = (...args: Parameters<ApiClient['updateProfile']>) =>
  apiClient.updateProfile(...args)

export default apiClient

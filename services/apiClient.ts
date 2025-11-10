// API Configuration
const API_BASE_URL = process.env.NEXT_PUBLIC_API_BASE_URL || 'http://localhost:3001'

// API Client
class ApiClient {
  private baseURL: string

  constructor(baseURL: string) {
    this.baseURL = baseURL
  }

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
      
      if (!response.ok) {
        const errorData = await response.json().catch(() => ({}))
        throw new Error(errorData.message || `HTTP error! status: ${response.status}`)
      }

      return await response.json()
    } catch (error) {
      console.error('API request failed:', error)
      throw error
    }
  }

  // Auth endpoints
  async login(credentials: { email: string; password: string }) {
    return this.request('/api/auth/login', {
      method: 'POST',
      body: JSON.stringify(credentials),
    })
  }

  async register(userData: {
    name: string
    email: string
    password: string
    studentId: string
    phone: string
  }) {
    return this.request('/api/auth/register', {
      method: 'POST',
      body: JSON.stringify(userData),
    })
  }

  async getProfile(token: string) {
    return this.request('/api/auth/profile', {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    })
  }

  // Buildings endpoints
  async getBuildings(params?: {
    page?: number
    limit?: number
    search?: string
    filters?: Record<string, any>
  }) {
    const searchParams = new URLSearchParams()
    if (params) {
      Object.entries(params).forEach(([key, value]) => {
        if (value !== undefined && value !== null) {
          searchParams.append(key, String(value))
        }
      })
    }
    
    const queryString = searchParams.toString()
    return this.request(`/buildings${queryString ? `?${queryString}` : ''}`)
  }

  async getBuildingById(id: string) {
    return this.request(`/api/buildings/${id}`)
  }

  async getRoomsByBuildingId(buildingId: string, params?: {
    page?: number
    limit?: number
    filters?: Record<string, any>
  }) {
    const searchParams = new URLSearchParams()
    if (params) {
      Object.entries(params).forEach(([key, value]) => {
        if (value !== undefined && value !== null) {
          searchParams.append(key, String(value))
        }
      })
    }
    
    const queryString = searchParams.toString()
    return this.request(`/api/buildings/${buildingId}/rooms${queryString ? `?${queryString}` : ''}`)
  }

  // Rooms endpoints
  async getRoomById(id: string) {
    return this.request(`/api/rooms/${id}`)
  }

  // Bookings endpoints
  async createBooking(bookingData: {
    roomId: string
    moveInDate: string
    moveOutDate: string
    duration: number
    paymentMethod: string
    specialRequests?: string
    emergencyContact: string
    emergencyPhone: string
  }, token: string) {
    return this.request('/api/bookings', {
      method: 'POST',
      headers: {
        Authorization: `Bearer ${token}`,
      },
      body: JSON.stringify(bookingData),
    })
  }

  async getUserBookings(token: string) {
    return this.request('/api/bookings/my-bookings', {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    })
  }

  async getBookingById(id: string, token: string) {
    return this.request(`/api/bookings/${id}`, {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    })
  }

  async updateBookingStatus(id: string, status: string, token: string) {
    return this.request(`/api/bookings/${id}/status`, {
      method: 'PATCH',
      headers: {
        Authorization: `Bearer ${token}`,
      },
      body: JSON.stringify({ status }),
    })
  }

  // Reviews endpoints
  async createReview(reviewData: {
    roomId: string
    rating: number
    comment: string
  }, token: string) {
    return this.request('/api/reviews', {
      method: 'POST',
      headers: {
        Authorization: `Bearer ${token}`,
      },
      body: JSON.stringify(reviewData),
    })
  }

  async getRoomReviews(roomId: string) {
    return this.request(`/api/rooms/${roomId}/reviews`)
  }

  // Notifications endpoints
  async getNotifications(token: string) {
    return this.request('/api/notifications', {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    })
  }

  async markNotificationAsRead(id: string, token: string) {
    return this.request(`/api/notifications/${id}/read`, {
      method: 'PATCH',
      headers: {
        Authorization: `Bearer ${token}`,
      },
    })
  }

  // Upload endpoints
  async uploadImage(file: File, token: string) {
    const formData = new FormData()
    formData.append('image', file)

    return this.request('/api/upload/image', {
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

// Export individual methods for convenience
export const {
  login,
  register,
  getProfile,
  getBuildings,
  getBuildingById,
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

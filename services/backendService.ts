import { apiClient } from './apiClient'
import { Room } from '@/types'

export class RoomService {
  static async getRoomsByBuildingId(
    buildingId: string,
    params?: {
      page?: number
      limit?: number
      filters?: Record<string, any>
    }
  ): Promise<Room[]> {
    try {
      const response = await apiClient.getRoomsByBuildingId(buildingId, params) as { data?: Room[] }
      return response.data || []
    } catch (error) {
      console.error('Error fetching rooms:', error)
      return []
    }
  }

  static async getRoomById(id: string): Promise<Room | null> {
    try {
      const response = await apiClient.getRoomById(id) as { data?: Room }
      return response.data || null
    } catch (error) {
      console.error('Error fetching room:', error)
      return null
    }
  }

  static async getAvailableRooms(buildingId: string): Promise<Room[]> {
    try {
      const response = await apiClient.getRoomsByBuildingId(buildingId, {
        filters: { available: true }
      }) as { data?: Room[] }
      return response.data || []
    } catch (error) {
      console.error('Error fetching available rooms:', error)
      return []
    }
  }
}

export class BookingService {
  static async createBooking(
    bookingData: {
      roomId: string
      moveInDate: string
      moveOutDate: string
      duration: number
      paymentMethod: string
      specialRequests?: string
      emergencyContact: string
      emergencyPhone: string
    },
    token: string
  ) {
    try {
      const response = await apiClient.createBooking(bookingData, token)
      return response
    } catch (error) {
      console.error('Error creating booking:', error)
      throw error
    }
  }

  static async getUserBookings(token: string) {
    try {
      const response = await apiClient.getUserBookings(token) as { data?: any[] }
      return response.data || []
    } catch (error) {
      console.error('Error fetching user bookings:', error)
      return []
    }
  }

  static async getBookingById(id: string, token: string) {
    try {
      const response = await apiClient.getBookingById(id, token) as { data?: any }
      return response.data || null
    } catch (error) {
      console.error('Error fetching booking:', error)
      return null
    }
  }
}

export class ReviewService {
  static async createReview(
    reviewData: {
      roomId: string
      rating: number
      comment: string
    },
    token: string
  ) {
    try {
      const response = await apiClient.createReview(reviewData, token)
      return response
    } catch (error) {
      console.error('Error creating review:', error)
      throw error
    }
  }

  static async getRoomReviews(roomId: string) {
    try {
      const response = await apiClient.getRoomReviews(roomId) as { data?: any[] }
      return response.data || []
    } catch (error) {
      console.error('Error fetching room reviews:', error)
      return []
    }
  }
}

/**
 * Booking Service - Business Logic Layer
 * 
 * Enterprise patterns used:
 * - Service Layer Pattern
 * - Proper Error Handling
 * - Input Validation
 * - Type Safety
 * - Separation of Concerns
 */

import { apiClient } from './apiClient'
import { BackendApiResponse } from '@/types/api'
import { NotFoundError, ValidationError, NetworkError, ServerError } from '@/lib/errors'

interface CreateBookingData {
  roomId: string
  roomPrice: number
  moveInDate: string
  moveOutDate: string
  duration: number
  paymentMethod: string
  specialRequests?: string
  emergencyContact?: string
  emergencyPhone?: string
}

/**
 * Validate booking data
 */
function validateBookingData(data: CreateBookingData): void {
  if (!data.roomId || typeof data.roomId !== 'string' || data.roomId.trim() === '') {
    throw new ValidationError('Room ID is required')
  }
  if (typeof data.roomPrice !== 'number' || data.roomPrice <= 0) {
    throw new ValidationError('Room price is invalid')
  }
  if (!data.moveInDate) {
    throw new ValidationError('Move-in date is required')
  }
  if (!data.moveOutDate) {
    throw new ValidationError('Move-out date is required')
  }
  if (data.duration < 1) {
    throw new ValidationError('Duration must be at least 1 month')
  }
  if (!data.paymentMethod) {
    throw new ValidationError('Payment method is required')
  }
  // Emergency contact is optional - no validation needed
}

/**
 * Validate token
 */
function validateToken(token: string): void {
  if (!token || typeof token !== 'string' || token.trim() === '') {
    throw new ValidationError('Authentication token is required')
  }
}

/**
 * Handle API errors
 */
function handleApiError(error: any, context: string): never {
  if (error instanceof ValidationError || error instanceof NotFoundError) {
    throw error
  }

  if (error instanceof NetworkError || error.message?.includes('fetch')) {
    throw new NetworkError(`Failed to ${context}: ${error.message}`)
  }

  if (error.statusCode >= 400 && error.statusCode < 500) {
    if (error.statusCode === 404) {
      throw new NotFoundError('Booking', context)
    }
    throw new ValidationError(`Invalid request: ${error.message}`)
  }

  if (error.statusCode >= 500) {
    throw new ServerError(`Server error while ${context}: ${error.message}`, error.statusCode)
  }

  throw new ServerError(`Unexpected error while ${context}: ${error.message}`)
}

export class BookingService {
  /**
   * Create a new booking
   * 
   * @param bookingData - Booking information
   * @param token - Authentication token
   * @returns Promise<any> - Created booking data
   * @throws {ValidationError} - If booking data is invalid
   * @throws {NetworkError} - If network request fails
   * @throws {ServerError} - If server returns an error
   */
  static async createBooking(
    bookingData: CreateBookingData,
    token: string,
    userId: string,
  ) {
    try {
      validateBookingData(bookingData)
      validateToken(token)
      if (!userId) {
        throw new ValidationError('User ID is required')
      }

      const normalizeDate = (value: string) => {
        const date = new Date(value)
        if (Number.isNaN(date.getTime())) {
          throw new ValidationError('Invalid date format')
        }
        return date.toISOString()
      }

      const payload = {
        startDate: normalizeDate(bookingData.moveInDate),
        endDate: normalizeDate(bookingData.moveOutDate),
        typePayment: bookingData.paymentMethod,  // Send as 'VIETQR' or 'VNPAY'
        note: bookingData.specialRequests || undefined,
        details: [
          {
            roomId: bookingData.roomId,
            price: bookingData.roomPrice,
            note: bookingData.specialRequests || undefined,
            time: bookingData.duration,
          },
        ],
      }

      console.log('📤 Sending booking payload:', JSON.stringify(payload, null, 2))

      const response = await apiClient.createBooking(payload, token, userId)
      return response
    } catch (error: any) {
      handleApiError(error, 'creating booking')
    }
  }

  /**
   * Get user's bookings
   * 
   * @param token - Authentication token
   * @returns Promise<any[]> - Array of user bookings
   * @throws {ValidationError} - If token is invalid
   * @throws {NetworkError} - If network request fails
   * @throws {ServerError} - If server returns an error
   */
  static async getUserBookings(token: string): Promise<any[]> {
    try {
      validateToken(token)

      const response = await apiClient.getUserBookings(token) as BackendApiResponse<any>
      const bookingsData = response.data?.data

      return Array.isArray(bookingsData) ? bookingsData : []
    } catch (error: any) {
      handleApiError(error, 'fetching user bookings')
    }
  }

  /**
   * Get booking by ID
   * 
   * @param id - Booking ID
   * @param token - Authentication token
   * @returns Promise<any> - Booking data
   * @throws {ValidationError} - If ID or token is invalid
   * @throws {NotFoundError} - If booking is not found
   * @throws {NetworkError} - If network request fails
   * @throws {ServerError} - If server returns an error
   */
  static async getBookingById(id: string, token: string): Promise<any> {
    try {
      if (!id || typeof id !== 'string' || id.trim() === '') {
        throw new ValidationError('Booking ID is required')
      }
      validateToken(token)

      const response = await apiClient.getBookingById(id, token) as BackendApiResponse<any>
      const bookingData = response.data?.data

      if (!bookingData) {
        throw new NotFoundError('Booking', id)
      }

      return bookingData
    } catch (error: any) {
      handleApiError(error, `fetching booking ${id}`)
    }
  }
}


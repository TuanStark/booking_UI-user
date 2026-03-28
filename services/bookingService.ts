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
import {
  parseApiBookingsToOccupancySlices,
  MAX_USER_BOOKING_OCCUPANCY_UNITS,
  type OccupancySlice,
} from '@/utils/roomOccupancy'
import { BackendApiResponse } from '@/types/api'
import { NotFoundError, ValidationError, NetworkError, ServerError } from '@/lib/errors'

const SUPPORTED_PAYMENT_METHODS = ['VIETQR', 'VNPAY', 'MOMO', 'PAYOS'] as const
type SupportedPaymentMethod = (typeof SUPPORTED_PAYMENT_METHODS)[number]

/** Minimum rental duration in months */
const MIN_RENTAL_MONTHS = 3

interface CreateBookingData {
  roomId: string
  roomPrice?: number
  moveInDate: string
  moveOutDate: string
  duration: number
  paymentMethod: SupportedPaymentMethod
  /** Số chỗ đặt (KTX); mặc định 1 */
  occupancyUnits?: number
  specialRequests?: string
  emergencyContact?: string
  emergencyPhone?: string
}

function normalizePaymentMethod(value: string): SupportedPaymentMethod {
  const normalized = (value ?? '').toUpperCase()
  if (!SUPPORTED_PAYMENT_METHODS.includes(normalized as SupportedPaymentMethod)) {
    throw new ValidationError('Payment method must be either VIETQR, VNPAY, MOMO or PAYOS')
  }
  return normalized as SupportedPaymentMethod
}

/**
 * Validate booking data
 */
function validateBookingData(data: CreateBookingData): void {
  if (!data.roomId || typeof data.roomId !== 'string' || data.roomId.trim() === '') {
    throw new ValidationError('Room ID is required')
  }
  // Note: Backend securely recalculates price via ExternalService room data, 
  // so no strictly validating frontend roomPrice.
  if (!data.moveInDate) {
    throw new ValidationError('Move-in date is required')
  }
  if (!data.moveOutDate) {
    throw new ValidationError('Move-out date is required')
  }
  if (data.duration < MIN_RENTAL_MONTHS) {
    throw new ValidationError(`Thời gian thuê tối thiểu ${MIN_RENTAL_MONTHS} tháng`)
  }
  const ou = Math.floor(Number(data.occupancyUnits ?? 1))
  if (!Number.isFinite(ou) || ou < 1 || ou > MAX_USER_BOOKING_OCCUPANCY_UNITS) {
    throw new ValidationError(
      `Số chỗ đặt phải từ 1 đến ${MAX_USER_BOOKING_OCCUPANCY_UNITS}`,
    )
  }
  normalizePaymentMethod(data.paymentMethod)
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

function extractBookingsArrayFromResponse(response: unknown): unknown[] {
  if (Array.isArray(response)) return response
  if (response && typeof response === 'object') {
    const r = response as Record<string, unknown>
    const d = r.data
    if (Array.isArray(d)) return d
    if (d && typeof d === 'object') {
      const inner = (d as Record<string, unknown>).data
      if (Array.isArray(inner)) return inner
    }
  }
  return []
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

      const paymentMethod = normalizePaymentMethod(bookingData.paymentMethod)

      const payload = {
        startDate: normalizeDate(bookingData.moveInDate),
        endDate: normalizeDate(bookingData.moveOutDate),
        paymentMethod: paymentMethod,
        note: bookingData.specialRequests || undefined,
        details: [
          {
            roomId: bookingData.roomId,
            price: bookingData.roomPrice || 0,
            occupancyUnits: Math.min(
              MAX_USER_BOOKING_OCCUPANCY_UNITS,
              Math.max(1, Math.floor(Number(bookingData.occupancyUnits ?? 1)) || 1),
            ),
            note: bookingData.specialRequests || undefined,
          },
        ],
      }

      const response = await apiClient.createBooking(payload, token, userId)
      return response
    } catch (error: any) {
      handleApiError(error, 'creating booking')
    }
  }

  static async getUserBookings(token: string): Promise<any[]> {
    try {
      validateToken(token)

      const response = await apiClient.getUserBookings(token) as any
      const bookingsData = response.data

      return Array.isArray(bookingsData) ? bookingsData : []
    } catch (error: any) {
      handleApiError(error, 'fetching user bookings')
    }
  }

  /**
   * Khoảng ngày phòng đang bận (không chứa PII) — cho lịch khả dụng trên trang chi tiết phòng.
   */
  static async getRoomOccupancySlices(
    roomId: string,
    token: string,
  ): Promise<OccupancySlice[]> {
    try {
      if (!roomId || typeof roomId !== 'string' || roomId.trim() === '') {
        throw new ValidationError('Room ID is required')
      }
      validateToken(token)
      const raw = await apiClient.getBookingsByRoomId(roomId, token)
      const list = extractBookingsArrayFromResponse(raw)
      return parseApiBookingsToOccupancySlices(list, roomId)
    } catch (error: any) {
      handleApiError(error, 'fetching room occupancy')
    }
  }

  static async getBookingById(id: string, token: string): Promise<any> {
    try {
      if (!id || typeof id !== 'string' || id.trim() === '') {
        throw new ValidationError('Booking ID is required')
      }
      validateToken(token)

      const response = await apiClient.getBookingById(id, token) as any
      const bookingData = response.data

      if (!bookingData) {
        throw new NotFoundError('Booking', id)
      }

      return bookingData
    } catch (error: any) {
      handleApiError(error, `fetching booking ${id}`)
    }
  }
}


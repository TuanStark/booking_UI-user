/**
 * Review Service - Business Logic Layer
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

interface CreateReviewData {
  roomId: string
  rating: number
  comment: string
}

/**
 * Validate review data
 */
function validateReviewData(data: CreateReviewData): void {
  if (!data.roomId || typeof data.roomId !== 'string' || data.roomId.trim() === '') {
    throw new ValidationError('Room ID is required')
  }
  if (data.rating < 1 || data.rating > 5) {
    throw new ValidationError('Rating must be between 1 and 5')
  }
  if (!data.comment || data.comment.trim() === '') {
    throw new ValidationError('Comment is required')
  }
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
      throw new NotFoundError('Review', context)
    }
    throw new ValidationError(`Invalid request: ${error.message}`)
  }

  if (error.statusCode >= 500) {
    throw new ServerError(`Server error while ${context}: ${error.message}`, error.statusCode)
  }

  throw new ServerError(`Unexpected error while ${context}: ${error.message}`)
}

export class ReviewService {
  /**
   * Create a review for a room
   * 
   * @param reviewData - Review information
   * @param token - Authentication token
   * @returns Promise<any> - Created review data
   * @throws {ValidationError} - If review data is invalid
   * @throws {NetworkError} - If network request fails
   * @throws {ServerError} - If server returns an error
   */
  static async createReview(reviewData: CreateReviewData, token: string) {
    try {
      validateReviewData(reviewData)
      validateToken(token)

      const response = await apiClient.createReview(reviewData, token)
      return response
    } catch (error: any) {
      handleApiError(error, 'creating review')
    }
  }

  /**
   * Get reviews for a room
   * 
   * @param roomId - Room ID
   * @returns Promise<any[]> - Array of reviews
   * @throws {ValidationError} - If roomId is invalid
   * @throws {NetworkError} - If network request fails
   * @throws {ServerError} - If server returns an error
   */
  static async getRoomReviews(roomId: string): Promise<any[]> {
    try {
      if (!roomId || typeof roomId !== 'string' || roomId.trim() === '') {
        throw new ValidationError('Room ID is required')
      }

      const response = await apiClient.getRoomReviews(roomId) as BackendApiResponse<any>
      const reviewsData = response.data?.data
      
      return Array.isArray(reviewsData) ? reviewsData : []
    } catch (error: any) {
      handleApiError(error, `fetching reviews for room ${roomId}`)
    }
  }
}


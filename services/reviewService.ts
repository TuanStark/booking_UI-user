import { apiClient } from './apiClient'
import { CreateReviewRequest, PaginatedReviewsResponse } from '@/types/review'
import { NotFoundError, ValidationError, NetworkError, ServerError } from '@/lib/errors'

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
   */
  static async createReview(reviewData: CreateReviewRequest, token: string) {
    try {
      if (!reviewData.bookingId) throw new ValidationError('Booking ID is required')
      if (!reviewData.ratingOverall) throw new ValidationError('Overall rating is required')
      if (!token) throw new ValidationError('Authentication token is required')

      const response = await apiClient.createReview(reviewData, token)
      return response
    } catch (error: any) {
      handleApiError(error, 'creating review')
    }
  }

  /**
   * Get reviews for a room
   */
  /**
   * Get reviews for a room
   */
  static async getRoomReviews(roomId: string, limit = 10, cursor?: string): Promise<PaginatedReviewsResponse> {
    try {
      if (!roomId) throw new ValidationError('Room ID is required')

      // Define response structure that matches Review Service (cursor pagination)
      interface ReviewApiResponse {
        data: PaginatedReviewsResponse
        statusCode: number
        message: string
      }

      const response = await apiClient.getRoomReviews(roomId, { limit, cursor }) as ReviewApiResponse

      // Return the data directly as it matches PaginatedReviewsResponse
      return response.data || { data: [], nextCursor: null, hasMore: false, total: 0 }
    } catch (error: any) {
      handleApiError(error, `fetching reviews for room ${roomId}`)
    }
  }
}


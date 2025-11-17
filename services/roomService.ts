/**
 * Room Service - Business Logic Layer
 * 
 * Enterprise patterns used:
 * - Separation of Concerns (Service Layer Pattern)
 * - Proper Error Handling with Custom Error Types
 * - Input Validation
 * - Type Safety
 * - Mapper Pattern for Data Transformation
 * - Single Responsibility Principle
 * 
 * @example
 * ```typescript
 * // Get all rooms for a building
 * const rooms = await RoomService.getRoomsByBuildingId('building-id')
 * 
 * // Get specific room
 * const room = await RoomService.getRoomById('room-id')
 * 
 * // Get only available rooms
 * const availableRooms = await RoomService.getAvailableRooms('building-id')
 * ```
 */

import { apiClient } from './apiClient'
import { Room } from '@/types'
import { BackendApiResponse } from '@/types/api'
import { NotFoundError, ValidationError, NetworkError, ServerError } from '@/lib/errors'
import { mapApiRoomToRoom, mapApiRoomsToRooms, ApiRoom } from './mappers/roomMapper'

interface GetRoomsParams {
  page?: number
  limit?: number
  filters?: Record<string, any>
}

/**
 * Extract building information from API response
 * Helper function following DRY principle
 */
function extractBuildingInfo(rooms: ApiRoom[]): { name: string; address: string } {
  if (!rooms || rooms.length === 0) {
    return { name: '', address: '' }
  }

  const firstRoom = rooms[0]
  return {
    name: firstRoom?.buildingName || firstRoom?.building?.name || '',
    address: firstRoom?.buildingAddress || firstRoom?.building?.address || '',
  }
}

/**
 * Validate building ID
 */
function validateBuildingId(buildingId: string): void {
  if (!buildingId || typeof buildingId !== 'string' || buildingId.trim() === '') {
    throw new ValidationError('Building ID is required and must be a non-empty string')
  }
}

/**
 * Validate room ID
 */
function validateRoomId(roomId: string): void {
  if (!roomId || typeof roomId !== 'string' || roomId.trim() === '') {
    throw new ValidationError('Room ID is required and must be a non-empty string')
  }
}

/**
 * Handle API errors and convert to appropriate error types
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
      throw new NotFoundError('Room', context)
    }
    throw new ValidationError(`Invalid request: ${error.message}`)
  }

  if (error.statusCode >= 500) {
    throw new ServerError(`Server error while ${context}: ${error.message}`, error.statusCode)
  }

  throw new ServerError(`Unexpected error while ${context}: ${error.message}`)
}

export class RoomService {
  /**
   * Get all rooms for a specific building
   * 
   * @param buildingId - The ID of the building
   * @param params - Optional pagination and filter parameters
   * @returns Promise<Room[]> - Array of rooms
   * @throws {ValidationError} - If buildingId is invalid
   * @throws {NotFoundError} - If building is not found
   * @throws {NetworkError} - If network request fails
   * @throws {ServerError} - If server returns an error
   * 
   * @example
   * ```typescript
   * const rooms = await RoomService.getRoomsByBuildingId('building-123', {
   *   page: 1,
   *   limit: 10,
   *   filters: { status: 'AVAILABLE' }
   * })
   * ```
   */
  static async getRoomsByBuildingId(
    buildingId: string,
    params?: GetRoomsParams
  ): Promise<Room[]> {
    try {
      // Input validation
      validateBuildingId(buildingId)

      // Validate pagination params if provided
      if (params?.page !== undefined && params.page < 1) {
        throw new ValidationError('Page number must be greater than 0')
      }
      if (params?.limit !== undefined && params.limit < 1) {
        throw new ValidationError('Limit must be greater than 0')
      }

      // Call API
      const response = await apiClient.getRoomsByBuildingId(buildingId, params) as BackendApiResponse<ApiRoom>
      
      // Extract and validate response
      const roomsData = response.data?.data
      
      if (!roomsData) {
        // Empty result is valid, return empty array
        return []
      }

      if (!Array.isArray(roomsData)) {
        throw new ServerError('Invalid response format: expected array of rooms')
      }

      // Extract building info for mapping
      const buildingInfo = extractBuildingInfo(roomsData)
      
      // Transform API data to domain models
      return mapApiRoomsToRooms(roomsData, buildingInfo.name, buildingInfo.address)
    } catch (error: any) {
      handleApiError(error, `fetching rooms for building ${buildingId}`)
    }
  }

  /**
   * Get a specific room by ID
   * 
   * @param id - The room ID
   * @returns Promise<Room> - The room object
   * @throws {ValidationError} - If roomId is invalid
   * @throws {NotFoundError} - If room is not found
   * @throws {NetworkError} - If network request fails
   * @throws {ServerError} - If server returns an error
   * 
   * @example
   * ```typescript
   * const room = await RoomService.getRoomById('room-123')
   * ```
   */
  static async getRoomById(id: string): Promise<Room> {
    try {
      // Input validation
      validateRoomId(id)

      // Call API
      const response = await apiClient.getRoomById(id) as BackendApiResponse<ApiRoom>
      
      // Extract and validate response
      const roomData = response.data?.data
      
      if (!roomData) {
        throw new NotFoundError('Room', id)
      }

      // Handle both array and object responses
      const room = Array.isArray(roomData) ? roomData[0] : roomData
      
      if (!room) {
        throw new NotFoundError('Room', id)
      }

      // Extract building info
      const buildingInfo = extractBuildingInfo([room as ApiRoom])
      
      // Transform API data to domain model
      return mapApiRoomToRoom(room as ApiRoom, buildingInfo.name, buildingInfo.address)
    } catch (error: any) {
      handleApiError(error, `fetching room ${id}`)
    }
  }

  /**
   * Get only available rooms for a building
   * 
   * @param buildingId - The ID of the building
   * @returns Promise<Room[]> - Array of available rooms
   * @throws {ValidationError} - If buildingId is invalid
   * @throws {NotFoundError} - If building is not found
   * @throws {NetworkError} - If network request fails
   * @throws {ServerError} - If server returns an error
   * 
   * @example
   * ```typescript
   * const availableRooms = await RoomService.getAvailableRooms('building-123')
   * ```
   */
  static async getAvailableRooms(buildingId: string): Promise<Room[]> {
    try {
      // Input validation
      validateBuildingId(buildingId)

      // Call API with status filter
      const response = await apiClient.getRoomsByBuildingId(buildingId, {
        filters: { status: 'AVAILABLE' }
      }) as BackendApiResponse<ApiRoom>
      
      // Extract and validate response
      const roomsData = response.data?.data
      
      if (!roomsData) {
        return []
      }

      if (!Array.isArray(roomsData)) {
        throw new ServerError('Invalid response format: expected array of rooms')
      }

      // Double-check: filter by status in case API doesn't filter properly
      const availableRooms = roomsData.filter((room: ApiRoom) => room.status === 'AVAILABLE')
      
      // Extract building info
      const buildingInfo = extractBuildingInfo(availableRooms)
      
      // Transform API data to domain models
      return mapApiRoomsToRooms(availableRooms, buildingInfo.name, buildingInfo.address)
    } catch (error: any) {
      handleApiError(error, `fetching available rooms for building ${buildingId}`)
    }
  }
}


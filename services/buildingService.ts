/**
 * Building Service - Business Logic Layer
 * 
 * Enterprise patterns used:
 * - Service Layer Pattern
 * - Separation of Concerns
 * - Proper Error Handling with Custom Error Types
 * - Input Validation
 * - Type Safety
 * - Mapper Pattern for Data Transformation
 * - Single Responsibility Principle
 * 
 * @example
 * ```typescript
 * // Get all buildings
 * const buildings = await BuildingService.getAllBuildings({ page: 1, limit: 10 })
 * 
 * // Get building by ID
 * const building = await BuildingService.getBuildingById('building-id')
 * 
 * // Get featured buildings
 * const featured = await BuildingService.getFeaturedBuildings(4)
 * 
 * // Get building detail with rooms (for SSR)
 * const { building, rooms } = await BuildingService.getBuildingDetailWithRooms('building-id')
 * ```
 */

import { apiClient } from './apiClient'
import { Building, Room } from '@/types'
import { BackendApiResponse } from '@/types/api'
import { NotFoundError, ValidationError, NetworkError, ServerError } from '@/lib/errors'
import { mapApiBuildingToBuilding, mapApiBuildingsToBuildings, ApiBuilding } from './mappers/buildingMapper'
import { RoomService } from './roomService'

interface GetBuildingsParams {
  page?: number
  limit?: number
  search?: string
  filters?: Record<string, any>
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
      throw new NotFoundError('Building', context)
    }
    throw new ValidationError(`Invalid request: ${error.message}`)
  }

  if (error.statusCode >= 500) {
    throw new ServerError(`Server error while ${context}: ${error.message}`, error.statusCode)
  }

  throw new ServerError(`Unexpected error while ${context}: ${error.message}`)
}

export class BuildingService {
  /**
   * Get all buildings with optional pagination and filters
   * 
   * @param params - Optional pagination and filter parameters
   * @returns Promise<Building[]> - Array of buildings
   * @throws {ValidationError} - If params are invalid
   * @throws {NetworkError} - If network request fails
   * @throws {ServerError} - If server returns an error
   * 
   * @example
   * ```typescript
   * const buildings = await BuildingService.getAllBuildings({
   *   page: 1,
   *   limit: 10,
   *   search: 'keyword',
   *   filters: { city: 'HCM' }
   * })
   * ```
   */
  static async getAllBuildings(params?: GetBuildingsParams): Promise<Building[]> {
    try {
      // Validate pagination params if provided
      if (params?.page !== undefined && params.page < 1) {
        throw new ValidationError('Page number must be greater than 0')
      }
      if (params?.limit !== undefined && params.limit < 1) {
        throw new ValidationError('Limit must be greater than 0')
      }

      // Call API
      const response = await apiClient.getBuildings(params) as BackendApiResponse<ApiBuilding>
      
      // Extract and validate response
      const buildingsData = response.data?.data
      
      if (!buildingsData) {
        return []
      }

      if (!Array.isArray(buildingsData)) {
        throw new ServerError('Invalid response format: expected array of buildings')
      }

      // Transform API data to domain models
      return mapApiBuildingsToBuildings(buildingsData)
    } catch (error: any) {
      handleApiError(error, 'fetching buildings')
    }
  }

  /**
   * Get a specific building by ID
   * 
   * @param id - The building ID
   * @returns Promise<Building> - The building object
   * @throws {ValidationError} - If buildingId is invalid
   * @throws {NotFoundError} - If building is not found
   * @throws {NetworkError} - If network request fails
   * @throws {ServerError} - If server returns an error
   * 
   * @example
   * ```typescript
   * const building = await BuildingService.getBuildingById('building-123')
   * ```
   */
  static async getBuildingById(id: string): Promise<Building> {
    try {
      // Input validation
      validateBuildingId(id)

      // Call API
      const response = await apiClient.getBuildingById(id) as BackendApiResponse<ApiBuilding>
      
      // Extract and validate response
      const buildingData = response.data?.data
      
      if (!buildingData) {
        throw new NotFoundError('Building', id)
      }

      // Handle both array and object responses
      const building = Array.isArray(buildingData) ? buildingData[0] : buildingData
      
      if (!building) {
        throw new NotFoundError('Building', id)
      }

      // Transform API data to domain model
      return mapApiBuildingToBuilding(building as ApiBuilding)
    } catch (error: any) {
      handleApiError(error, `fetching building ${id}`)
    }
  }

  /**
   * Get featured buildings (limited results)
   * 
   * @param limit - Maximum number of buildings to return (default: 4)
   * @returns Promise<Building[]> - Array of featured buildings
   * @throws {ValidationError} - If limit is invalid
   * @throws {NetworkError} - If network request fails
   * @throws {ServerError} - If server returns an error
   * 
   * @example
   * ```typescript
   * const featured = await BuildingService.getFeaturedBuildings(6)
   * ```
   */
  static async getFeaturedBuildings(limit: number = 4): Promise<Building[]> {
    try {
      // Validate limit
      if (limit < 1) {
        throw new ValidationError('Limit must be greater than 0')
      }

      // Call API
      const response = await apiClient.getBuildings({ limit }) as BackendApiResponse<ApiBuilding>
      
      // Extract and validate response
      const buildingsData = response.data?.data
      
      if (!buildingsData) {
        return []
      }

      if (!Array.isArray(buildingsData)) {
        throw new ServerError('Invalid response format: expected array of buildings')
      }

      // Transform API data to domain models
      return mapApiBuildingsToBuildings(buildingsData)
    } catch (error: any) {
      handleApiError(error, 'fetching featured buildings')
    }
  }

  /**
   * Get building detail with rooms (for SSR/SEO)
   * 
   * Uses the endpoint: GET /rooms/building/:buildingId
   * Extracts building info from rooms response (each room contains building info)
   * 
   * @param buildingId - The building ID
   * @returns Promise<{ building: Building | null; rooms: Room[] }> - Building and its rooms
   * @throws {ValidationError} - If buildingId is invalid
   * @throws {NotFoundError} - If building is not found
   * @throws {NetworkError} - If network request fails
   * @throws {ServerError} - If server returns an error
   * 
   * @example
   * ```typescript
   * const { building, rooms } = await BuildingService.getBuildingDetailWithRooms('building-id')
   * ```
   */
  static async getBuildingDetailWithRooms(buildingId: string): Promise<{ building: Building | null; rooms: Room[] }> {
    try {
      // Input validation
      validateBuildingId(buildingId)

      // Use RoomService to get rooms (endpoint: GET /rooms/building/:buildingId)
      // This endpoint returns rooms with building info in each room
      const rooms = await RoomService.getRoomsByBuildingId(buildingId)
      
      // If no rooms found, return null
      if (rooms.length === 0) {
        return { building: null, rooms: [] }
      }

      // Extract building info from first room
      // Each room has buildingName and buildingAddress from the API
      const firstRoom = rooms[0]
      
      // Build building object from room data
      const building: Building = {
        id: buildingId,
        name: firstRoom.buildingName || '',
        address: firstRoom.buildingAddress || '',
        imageUrl: '', // Can be enhanced if building images are available in API
        totalRooms: rooms.length,
        availableRooms: rooms.filter(r => r.available).length,
        averagePrice: rooms.length > 0
          ? Math.round(rooms.reduce((sum, r) => sum + r.price, 0) / rooms.length)
          : 0,
        rating: 0, // Can be calculated from room ratings if available
        totalReviews: 0, // Can be calculated from room reviews if available
        description: '', // Can be enhanced if building description is in API response
        amenities: [], // Can be extracted from rooms if needed
        latitude: 0, // Can be enhanced if building location is in API response
        longitude: 0, // Can be enhanced if building location is in API response
      }

      return { building, rooms }
    } catch (error: any) {
      // Handle specific errors
      if (error instanceof NotFoundError) {
        return { building: null, rooms: [] }
      }
      
      handleApiError(error, `fetching building detail with rooms for ${buildingId}`)
    }
  }
}

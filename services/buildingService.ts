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

type BuildingsResponse = BackendApiResponse<ApiBuilding | ApiBuilding[]>

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
function resolveStatusCode(error: any): number | undefined {
  return typeof error?.statusCode === 'number'
    ? error.statusCode
    : error?.response?.status
}

function handleApiError(error: any, context: string): never {
  if (error instanceof ValidationError || error instanceof NotFoundError) {
    throw error
  }

  if (error instanceof NetworkError || error.message?.includes('fetch')) {
    throw new NetworkError(`Failed to ${context}: ${error.message}`)
  }

  const status = resolveStatusCode(error)

  if (status && status >= 400 && status < 500) {
    if (status === 404) {
      throw new NotFoundError('Building', context)
    }
    throw new ValidationError(`Invalid request: ${error.message}`)
  }

  if (status && status >= 500) {
    throw new ServerError(`Server error while ${context}: ${error.message}`, status)
  }

  throw new ServerError(`Unexpected error while ${context}: ${error.message}`)
}

function normalizeBuildingsResponse(response: BuildingsResponse): ApiBuilding[] {
  if (!response?.data) {
    return []
  }

  const payload = response.data

  if (Array.isArray(payload)) {
    return payload as ApiBuilding[]
  }

  if (payload && typeof payload === 'object') {
    const nestedData = (payload as { data?: ApiBuilding | ApiBuilding[] }).data
    if (Array.isArray(nestedData)) {
      return nestedData as ApiBuilding[]
    }
    if (nestedData && !Array.isArray(nestedData)) {
      return [nestedData]
    }

    const maybeBuilding = payload as Partial<ApiBuilding>
    if (typeof maybeBuilding.id === 'string' && typeof maybeBuilding.name === 'string') {
      return [maybeBuilding as ApiBuilding]
    }
  }

  return []
}

function validatePagination(params?: GetBuildingsParams): void {
  if (params?.page !== undefined && params.page < 1) {
    throw new ValidationError('Page number must be greater than 0')
  }
  if (params?.limit !== undefined && params.limit < 1) {
    throw new ValidationError('Limit must be greater than 0')
  }
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
      validatePagination(params)

      const response = await apiClient.getBuildings(params) as BuildingsResponse
      const buildingsData = normalizeBuildingsResponse(response)

      if (!buildingsData.length) {
        return []
      }

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

      const response = await apiClient.getBuildingById(id) as BuildingsResponse
      const [buildingData] = normalizeBuildingsResponse(response)

      if (!buildingData) {
        throw new NotFoundError('Building', id)
      }

      // Transform API data to domain model
      return mapApiBuildingToBuilding(buildingData)
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
      if (limit < 1) {
        throw new ValidationError('Limit must be greater than 0')
      }

      const response = await apiClient.getBuildings({ limit }) as BuildingsResponse
      const buildingsData = normalizeBuildingsResponse(response)

      if (!buildingsData.length) {
        return []
      }

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
      const rooms = await RoomService.getRoomsByBuildingId(buildingId)
      // If no rooms found, return null
      if (rooms.length === 0) {
        return { building: null, rooms: [] }
      }

      // Extract building info from first room
      const firstRoom = rooms[0]
      const buildingData = firstRoom.buildingInfo ?? {
        id: buildingId,
        name: firstRoom.buildingName,
        address: firstRoom.buildingAddress,
      }
      const availableRooms = rooms.filter(r => r.available)
      const averagePrice = rooms.length
        ? Math.round(rooms.reduce((sum, r) => sum + r.price, 0) / rooms.length)
        : 0

      const building: Building = {
        id: buildingData?.id || buildingId,
        name: buildingData?.name || firstRoom.buildingName || '',
        address: buildingData?.address || firstRoom.buildingAddress || '',
        images: buildingData?.images || null,
        totalRooms: typeof buildingData?.roomsCount === 'number' ? buildingData.roomsCount : rooms.length,
        availableRooms: availableRooms.length,
        averagePrice,
        rating: (buildingData as any)?.rating || 0,
        totalReviews: (buildingData as any)?.totalReviews || 0,
        description: buildingData?.description || '',
        amenities: Array.isArray((buildingData as any)?.amenities) ? (buildingData as any).amenities : [],
        latitude: typeof buildingData?.latitude === 'number'
          ? buildingData.latitude
          : Number(buildingData?.latitude ?? 0) || 0,
        longitude: typeof buildingData?.longitude === 'number'
          ? buildingData.longitude
          : Number(buildingData?.longitude ?? buildingData?.longtitude ?? 0) || 0,
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

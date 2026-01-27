import { Building, Room } from '@/types'
import { BackendApiResponse, PaginatedResponse } from '@/types/api'
import { NotFoundError, ValidationError, NetworkError, ServerError } from '@/lib/errors'
import { api } from '@/lib/axios'
import { RoomService } from './roomService'

function validatePaginationParams(params: {
  page?: number
  limit?: number
  sortBy?: string
  sortOrder?: 'asc' | 'desc'
  search?: string
}): void {
  if (params.page !== undefined && (params.page < 1 || !Number.isInteger(params.page))) {
    throw new ValidationError('Page must be a positive integer')
  }

  if (params.limit !== undefined && (params.limit < 1 || params.limit > 100 || !Number.isInteger(params.limit))) {
    throw new ValidationError('Limit must be between 1 and 100')
  }

  if (params.sortOrder && !['asc', 'desc'].includes(params.sortOrder)) {
    throw new ValidationError('Sort order must be either "asc" or "desc"')
  }

  if (params.search && params.search.length > 200) {
    throw new ValidationError('Search query must be less than 200 characters')
  }
}


function handleApiError(error: unknown, context: string): never {
  if (error instanceof ValidationError || error instanceof NotFoundError) {
    throw error
  }

  if (error instanceof NetworkError) {
    throw new NetworkError(`Failed to ${context}: ${error.message}`)
  }

  if (error instanceof ServerError) {
    throw error
  }

  // Handle unknown errors
  const errorMessage = error instanceof Error ? error.message : 'Unknown error occurred'
  throw new ServerError(`Unexpected error while ${context}: ${errorMessage}`)
}



/**
 * BuildingService class for server-side data fetching
 * Used by Next.js Server Components for SSR/SSG
 */

// Single resource response type (no pagination)
interface SingleBuildingResponse {
  data: Building
  statusCode: number
  message: string
}

export class BuildingService {
  /**
   * Get building detail along with its rooms
   * Fetches building info and rooms in parallel for optimal performance
   * 
   * @param buildingId - The ID of the building
   * @returns Promise<{ building: Building | null, rooms: Room[] }>
   */
  static async getBuildingDetailWithRooms(buildingId: string): Promise<{
    building: Building | null
    rooms: Room[]
  }> {
    try {
      // Validate building ID
      if (!buildingId || typeof buildingId !== 'string' || buildingId.trim() === '') {
        return { building: null, rooms: [] }
      }

      // Fetch building detail and rooms in parallel
      const [buildingResponse, rooms] = await Promise.all([
        api.get<SingleBuildingResponse>(`/buildings/${buildingId}`),
        RoomService.getRoomsByBuildingId(buildingId).catch(() => [] as Room[])
      ])

      const building = buildingResponse?.data || null

      if (!building) {
        return { building: null, rooms: [] }
      }

      return { building, rooms }
    } catch (error) {
      console.error(`Error fetching building detail for ${buildingId}:`, error)
      return { building: null, rooms: [] }
    }
  }
}

export async function getAllBuildings({
  page = 1,
  limit = 10,
  sortBy = 'createdAt',
  sortOrder = 'desc',
  search = ''
}: {
  page?: number
  limit?: number
  sortBy?: string
  sortOrder?: 'asc' | 'desc'
  search?: string
} = {}): Promise<PaginatedResponse<Building[]>> {
  try {
    // Validate parameters
    validatePaginationParams({ page, limit, sortBy, sortOrder, search })

    // Build query string
    const queryParams = new URLSearchParams({
      page: String(page),
      limit: String(limit),
      sortBy,
      sortOrder,
    })

    if (search.trim()) {
      queryParams.append('search', search.trim())
    }

    const response = await api.get<BackendApiResponse<Building[]>>(
      `/buildings?${queryParams.toString()}`
    )

    if (!response?.data?.data || !Array.isArray(response.data.data)) {
      throw new ServerError('Invalid response format from server')
    }

    const { data, meta } = response.data

    const normalizedMeta = {
      total: meta?.total ?? 0,
      page: meta?.page ?? page,
      limit: meta?.limit ?? limit,
      totalPages: meta?.totalPages ?? Math.ceil((meta?.total ?? 0) / limit),
    }

    return {
      items: data,
      meta: {
        ...normalizedMeta,
        hasNextPage: normalizedMeta.page < normalizedMeta.totalPages,
        hasPrevPage: normalizedMeta.page > 1,
      },
    }
  } catch (error) {
    return handleApiError(error, 'fetching buildings')
  }
}

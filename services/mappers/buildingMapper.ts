/**
 * Building Mapper - Data Transformation Layer
 * 
 * Enterprise pattern: Mapper Pattern
 * - Separates data transformation logic from business logic
 * - Pure functions, easy to test
 * - Reusable across different contexts
 */

import { Building } from '@/types'

/**
 * API Response type from backend for Building
 * Matches the actual API response structure
 */
export interface ApiBuilding {
  id: string
  name: string
  address: string
  images: string
  city?: string | null
  country?: string | null
  description?: string | null
  longtitude?: number | null
  latitude?: number | null
  imagePublicId?: string
  createdAt?: string
  updatedAt?: string
  roomsCount?: number
}

/**
 * Transform API response to Building domain model
 * 
 * @param apiBuilding - Raw API building data
 * @returns Building - Transformed domain model
 * 
 * @example
 * ```typescript
 * const building = mapApiBuildingToBuilding(apiBuildingData)
 * ```
 */
export function mapApiBuildingToBuilding(apiBuilding: ApiBuilding): Building {
  return {
    id: apiBuilding.id,
    name: apiBuilding.name,
    address: apiBuilding.address,
    images: apiBuilding.images || null,
    totalRooms: apiBuilding.roomsCount || 0,
    availableRooms: apiBuilding.roomsCount || 0, // Default to totalRooms if not available
    averagePrice: 0, // Should be calculated from rooms
    rating: 0, // Should come from reviews/ratings
    totalReviews: 0, // Should come from reviews
    description: apiBuilding.description || '',
    amenities: [], // Default empty array
    latitude: apiBuilding.latitude || 0,
    longitude: apiBuilding.longtitude || 0,
  }
}

/**
 * Transform array of API buildings to Building array
 * 
 * @param apiBuildings - Array of raw API building data
 * @returns Building[] - Array of transformed domain models
 */
export function mapApiBuildingsToBuildings(apiBuildings: ApiBuilding[]): Building[] {
  return apiBuildings.map(mapApiBuildingToBuilding)
}


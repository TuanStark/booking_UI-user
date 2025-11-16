import { apiClient } from './apiClient'
import { Building } from '@/types'
import { BackendApiResponse } from '@/types/api'

// API Response type from backend
interface ApiBuilding {
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

// Transform API response to Building type
function mapApiBuildingToBuilding(apiBuilding: ApiBuilding): Building {
  return {
    id: apiBuilding.id,
    name: apiBuilding.name,
    address: apiBuilding.address,
    imageUrl: apiBuilding.images || '',
    totalRooms: apiBuilding.roomsCount || 0,
    availableRooms: apiBuilding.roomsCount || 0, // Default to totalRooms if not available
    averagePrice: 0, // Default value, should be calculated from rooms
    rating: 0, // Default value, should come from reviews
    totalReviews: 0, // Default value, should come from reviews
    description: apiBuilding.description || '',
    amenities: [], // Default empty array
    latitude: apiBuilding.latitude || 0,
    longitude: apiBuilding.longtitude || 0,
  }
}

export class BuildingService {
  static async getAllBuildings(params?: {
    page?: number
    limit?: number
    search?: string
    filters?: Record<string, any>
  }): Promise<Building[]> {
    try {
      const response = await apiClient.getBuildings(params) as BackendApiResponse<ApiBuilding>
      console.log('response getAllBuildings', response)
      
      // Handle nested data structure: response.data.data
      const buildingsData = response.data?.data
      if (buildingsData && Array.isArray(buildingsData)) {
        return buildingsData.map(mapApiBuildingToBuilding)
      }
      return []
    } catch (error) {
      console.error('Error fetching buildings:', error)
      return []
    }
  }

  static async getBuildingById(id: string): Promise<Building | null> {
    try {
      const response = await apiClient.getBuildingById(id) as BackendApiResponse<ApiBuilding>
      
      // Handle nested data structure: response.data.data (single item)
      const buildingData = response.data?.data
      if (buildingData) {
        // If data is an array, take first item; otherwise it's the object itself
        const building = Array.isArray(buildingData) ? buildingData[0] : buildingData
        return mapApiBuildingToBuilding(building as ApiBuilding)
      }
      return null
    } catch (error) {
      console.error('Error fetching building:', error)
      return null
    }
  }

  static async getFeaturedBuildings(limit: number = 4): Promise<Building[]> {
    try {
      const response = await apiClient.getBuildings({ limit }) as BackendApiResponse<ApiBuilding>
      
      // Handle nested data structure: response.data.data
      const buildingsData = response.data?.data
      if (buildingsData && Array.isArray(buildingsData)) {
        return buildingsData.map(mapApiBuildingToBuilding)
      }
      return []
    } catch (error) {
      console.error('Error fetching featured buildings:', error)
      return []
    }
  }
}


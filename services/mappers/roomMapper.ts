/**
 * Room Mapper - Separation of Concerns
 * Senior pattern: Extract mapping logic to separate file for reusability and testability
 */

import { Room, BuildingReference } from '@/types'

// API Response type from backend for Room (matching Prisma schema)
export interface ApiRoom {
  id: string
  buildingId: string
  name: string
  description?: string | null
  price: number
  capacity: number
  squareMeter: number
  bedCount: number
  bathroomCount: number
  floor: number
  countCapacity: number
  status: 'AVAILABLE' | 'BOOKED' | 'MAINTENANCE' | 'DISABLED'
  createdAt?: string
  updatedAt?: string
  images?: Array<{
    id: string
    roomId: string
    imageUrl: string
    imagePublicId?: string | null
    createdAt?: string
    updatedAt?: string
  }>
  amenities?: Array<{
    id: string
    roomId: string
    name: string
    createdAt?: string
    updatedAt?: string
  }>
  buildingName?: string
  buildingAddress?: string
  building?: {
    id: string
    name: string
    address: string
    images?: string | null
    city?: string | null
    country?: string | null
    description?: string | null
    longitude?: string | null
    longtitude?: string | null
    latitude?: string | null
    imagePublicId?: string | null
    createdAt?: string
    updatedAt?: string
    roomsCount?: number | null
  }
  roomNumber?: string
  type?: string
  size?: string
  beds?: string
  bathrooms?: string
  available?: boolean
  window?: string
  rating?: number
  reviews?: number
  contact?: {
    phone: string
    email: string
    manager: string
  }
  features?: any[]
  rules?: string[]
  nearbyFacilities?: any[]
}

/**
 * Transform API response to Room type
 * Senior pattern: Pure function, easy to test
 */
export function mapApiRoomToRoom(
  apiRoom: ApiRoom,
  buildingName: string = '',
  buildingAddress: string = ''
): Room {
  // Map images from relation
  const images = apiRoom.images
    ? apiRoom.images.map(img => img.imageUrl)
    : []

  // Map amenities from relation
  const amenities = apiRoom.amenities
    ? apiRoom.amenities.map(amenity => amenity.name)
    : []

  // Determine room type based on capacity
  const getRoomType = (capacity: number): 'Phòng đơn' | 'Phòng đôi' | 'Phòng nhóm' => {
    if (capacity === 1) return 'Phòng đơn'
    if (capacity === 2) return 'Phòng đôi'
    return 'Phòng nhóm'
  }

  // Map status to available boolean
  const isAvailable = apiRoom.status === 'AVAILABLE'

  const buildingMetadata: BuildingReference | undefined = apiRoom.building
    ? {
        id: apiRoom.building.id,
        name: apiRoom.building.name,
        address: apiRoom.building.address,
        images: apiRoom.building.images || null,
        description: apiRoom.building.description || null,
        latitude: apiRoom.building.latitude ?? null,
        longitude: apiRoom.building.longitude ?? apiRoom.building.longtitude ?? null,
        longtitude: apiRoom.building.longtitude ?? apiRoom.building.longitude ?? null,
        roomsCount: apiRoom.building.roomsCount ?? null,
      }
    : undefined

  return {
    id: apiRoom.id || '',
    roomNumber: apiRoom.roomNumber || apiRoom.name || '',
    buildingId: apiRoom.buildingId || '',
    buildingName: apiRoom.buildingName || apiRoom.building?.name || buildingName,
    buildingAddress: apiRoom.buildingAddress || apiRoom.building?.address || buildingAddress,
    type: (apiRoom.type as any) || getRoomType(apiRoom.capacity || 1),
    price: apiRoom.price || 0,
    size: apiRoom.size || `${apiRoom.squareMeter || 0}m²`,
    capacity: String(apiRoom.capacity || 1),
    beds: apiRoom.beds || `${apiRoom.bedCount || 1} giường`,
    bathrooms: apiRoom.bathrooms || `${apiRoom.bathroomCount || 1} phòng tắm`,
    available: apiRoom.available !== undefined ? apiRoom.available : isAvailable,
    images,
    description: apiRoom.description || '',
    features: apiRoom.features || [],
    amenities,
    floor: apiRoom.floor || 0,
    window: apiRoom.window || '',
    rating: apiRoom.rating || 0,
    reviews: apiRoom.reviews || 0,
    contact: apiRoom.contact || { phone: '', email: '', manager: '' },
    rules: apiRoom.rules || [],
    nearbyFacilities: apiRoom.nearbyFacilities || [],
    buildingInfo: buildingMetadata,
  }
}

/**
 * Map array of API rooms to Room array
 */
export function mapApiRoomsToRooms(
  apiRooms: ApiRoom[],
  buildingName: string = '',
  buildingAddress: string = ''
): Room[] {
  return apiRooms.map(room => mapApiRoomToRoom(room, buildingName, buildingAddress))
}


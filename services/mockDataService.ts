import { Building, Room, ContactInfo, RoomFeature, NearbyFacility } from '@/types'
import { 
  Bed, 
  Users, 
  Wifi, 
  Car, 
  Utensils, 
  Shield, 
  Clock,
  BookOpen,
  Dumbbell
} from 'lucide-react'

// Mock contact info
const mockContactInfo: ContactInfo = {
  phone: '028 1234 5678',
  email: 'support@dormbooking.com',
  manager: 'Nguyễn Văn A'
}

// Mock room features
const mockRoomFeatures: RoomFeature[] = [
  { name: 'Giường đơn', icon: Bed, available: true },
  { name: 'Bàn học', icon: Users, available: true },
  { name: 'Tủ quần áo', icon: Users, available: true },
  { name: 'WC riêng', icon: Users, available: true },
  { name: 'Máy lạnh', icon: Users, available: true },
  { name: 'WiFi', icon: Wifi, available: true }
]

const mockDoubleRoomFeatures: RoomFeature[] = [
  { name: '2 giường đơn', icon: Bed, available: true },
  { name: '2 bàn học', icon: Users, available: true },
  { name: 'Tủ quần áo', icon: Users, available: true },
  { name: 'WC chung', icon: Users, available: true },
  { name: 'Máy lạnh', icon: Users, available: true },
  { name: 'WiFi', icon: Wifi, available: true }
]

const mockGroupRoomFeatures: RoomFeature[] = [
  { name: '4 giường tầng', icon: Bed, available: true },
  { name: '4 bàn học', icon: Users, available: true },
  { name: 'Tủ quần áo', icon: Users, available: true },
  { name: 'WC chung', icon: Users, available: true },
  { name: 'Máy lạnh', icon: Users, available: true },
  { name: 'WiFi', icon: Wifi, available: true }
]

// Mock nearby facilities
const mockNearbyFacilities: NearbyFacility[] = [
  { name: 'Căng tin', distance: '50m', icon: Utensils },
  { name: 'Thư viện', distance: '100m', icon: BookOpen },
  { name: 'Phòng gym', distance: '150m', icon: Dumbbell },
  { name: 'Bãi đỗ xe', distance: '200m', icon: Car }
]

// Mock buildings data
export const mockBuildings: Building[] = [
  {
    id: '1',
    name: 'Tòa A - Maple Hall',
    address: '123 Đường Đại Học, Quận 1, TP.HCM',
    imageUrl: 'https://images.unsplash.com/photo-1560448204-e02f11c3d0e2?ixlib=rb-4.0.3&auto=format&fit=crop&w=1000&q=80',
    totalRooms: 45,
    availableRooms: 15,
    averagePrice: 1200,
    rating: 4.8,
    totalReviews: 156,
    description: 'Tòa nhà hiện đại với đầy đủ tiện nghi, phù hợp cho sinh viên muốn có không gian sống thoải mái.',
    amenities: ['WiFi', 'Parking', 'Dining', 'Security', 'Laundry'],
    latitude: 10.7769,
    longitude: 106.7009,
    contact: mockContactInfo,
    rules: [
      'Không được hút thuốc trong phòng',
      'Giữ gìn vệ sinh chung',
      'Tôn trọng giờ nghỉ ngơi',
      'Không được tổ chức tiệc tùng'
    ]
  },
  {
    id: '2',
    name: 'Tòa B - Cedar Hall',
    address: '456 Đường Sinh Viên, Quận 3, TP.HCM',
    imageUrl: 'https://images.unsplash.com/photo-1522708323590-d24dbb6b0267?ixlib=rb-4.0.3&auto=format&fit=crop&w=1000&q=80',
    totalRooms: 38,
    availableRooms: 8,
    averagePrice: 950,
    rating: 4.6,
    totalReviews: 89,
    description: 'Ký túc xá với không gian xanh, tạo môi trường học tập và sinh hoạt lý tưởng.',
    amenities: ['WiFi', 'Study Room', 'Gym', 'Parking'],
    latitude: 10.7829,
    longitude: 106.6909,
    contact: mockContactInfo
  },
  {
    id: '3',
    name: 'Tòa C - Oak Residence',
    address: '789 Đường Ký Túc Xá, Quận 5, TP.HCM',
    imageUrl: 'https://images.unsplash.com/photo-1586023492125-27b2c045efd7?ixlib=rb-4.0.3&auto=format&fit=crop&w=1000&q=80',
    totalRooms: 52,
    availableRooms: 12,
    averagePrice: 1350,
    rating: 4.9,
    totalReviews: 203,
    description: 'Ký túc xá cao cấp với tiện nghi sang trọng và dịch vụ chuyên nghiệp.',
    amenities: ['WiFi', 'Dining', 'Laundry', 'Study Room', 'Gym'],
    latitude: 10.7669,
    longitude: 106.7109,
    contact: mockContactInfo
  },
  {
    id: '4',
    name: 'Tòa D - Pine House',
    address: '321 Đường Học Sinh, Quận 7, TP.HCM',
    imageUrl: 'https://images.unsplash.com/photo-1555854877-bab0efccdbef?ixlib=rb-4.0.3&auto=format&fit=crop&w=1000&q=80',
    totalRooms: 28,
    availableRooms: 20,
    averagePrice: 800,
    rating: 4.7,
    totalReviews: 67,
    description: 'Ký túc xá giá cả phải chăng với các tiện nghi cơ bản đầy đủ.',
    amenities: ['WiFi', 'Parking', 'Laundry'],
    latitude: 10.7869,
    longitude: 106.7209,
    contact: mockContactInfo
  },
  {
    id: '5',
    name: 'Tòa E - Elm Building',
    address: '654 Đường Sinh Viên, Quận 10, TP.HCM',
    imageUrl: 'https://images.unsplash.com/photo-1571896349842-33c89424de2d?ixlib=rb-4.0.3&auto=format&fit=crop&w=1000&q=80',
    totalRooms: 35,
    availableRooms: 6,
    averagePrice: 1100,
    rating: 4.5,
    totalReviews: 94,
    description: 'Ký túc xá với thiết kế thân thiện và không gian sinh hoạt chung rộng rãi.',
    amenities: ['WiFi', 'Study Room', 'Gym', 'Parking', 'Dining'],
    latitude: 10.7969,
    longitude: 106.6809,
    contact: mockContactInfo
  },
  {
    id: '6',
    name: 'Tòa F - Willow Hall',
    address: '987 Đường Đại Học, Quận 2, TP.HCM',
    imageUrl: 'https://images.unsplash.com/photo-1502672260266-1c1ef2d93688?ixlib=rb-4.0.3&auto=format&fit=crop&w=1000&q=80',
    totalRooms: 42,
    availableRooms: 4,
    averagePrice: 1400,
    rating: 4.9,
    totalReviews: 178,
    description: 'Ký túc xá mới nhất với công nghệ hiện đại và thiết kế thông minh.',
    amenities: ['WiFi', 'Dining', 'Laundry', 'Study Room', 'Gym', 'Security'],
    latitude: 10.7569,
    longitude: 106.7309,
    contact: mockContactInfo
  }
]

// Mock rooms data
export const mockRooms: Room[] = [
  // Building 1 rooms
  {
    id: '1',
    roomNumber: 'A101',
    buildingId: '1',
    buildingName: 'Tòa A - Maple Hall',
    buildingAddress: '123 Đường Đại Học, Quận 1, TP.HCM',
    type: 'Phòng đơn',
    price: 1200,
    size: '25m²',
    capacity: '1 người',
    beds: '1 giường đơn',
    bathrooms: '1 phòng tắm',
    available: true,
    images: [
      'https://images.unsplash.com/photo-1586023492125-27b2c045efd7?ixlib=rb-4.0.3&auto=format&fit=crop&w=1200&q=80',
      'https://images.unsplash.com/photo-1522708323590-d24dbb6b0267?ixlib=rb-4.0.3&auto=format&fit=crop&w=1200&q=80',
      'https://images.unsplash.com/photo-1555854877-bab0efccdbef?ixlib=rb-4.0.3&auto=format&fit=crop&w=1200&q=80',
      'https://images.unsplash.com/photo-1571896349842-33c89424de2d?ixlib=rb-4.0.3&auto=format&fit=crop&w=1200&q=80'
    ],
    description: 'Phòng đơn rộng rãi với đầy đủ tiện nghi hiện đại. Không gian yên tĩnh, phù hợp cho việc học tập và nghỉ ngơi. Có cửa sổ hướng Nam, ánh sáng tự nhiên tốt.',
    features: mockRoomFeatures,
    amenities: ['WiFi miễn phí', 'Máy lạnh', 'Tủ quần áo', 'Bàn học', 'WC riêng'],
    floor: 1,
    window: 'Hướng Nam',
    rating: 4.8,
    reviews: 12,
    contact: mockContactInfo,
    rules: [
      'Không được hút thuốc trong phòng',
      'Giữ gìn vệ sinh chung',
      'Tôn trọng giờ nghỉ ngơi',
      'Không được tổ chức tiệc tùng',
      'Tắt đèn khi không sử dụng',
      'Báo cáo sự cố kỹ thuật ngay lập tức'
    ],
    nearbyFacilities: mockNearbyFacilities
  },
  {
    id: '2',
    roomNumber: 'A102',
    buildingId: '1',
    buildingName: 'Tòa A - Maple Hall',
    buildingAddress: '123 Đường Đại Học, Quận 1, TP.HCM',
    type: 'Phòng đơn',
    price: 1200,
    size: '25m²',
    capacity: '1 người',
    beds: '1 giường đơn',
    bathrooms: '1 phòng tắm',
    available: true,
    images: [
      'https://images.unsplash.com/photo-1522708323590-d24dbb6b0267?ixlib=rb-4.0.3&auto=format&fit=crop&w=1200&q=80',
      'https://images.unsplash.com/photo-1586023492125-27b2c045efd7?ixlib=rb-4.0.3&auto=format&fit=crop&w=1200&q=80',
      'https://images.unsplash.com/photo-1555854877-bab0efccdbef?ixlib=rb-4.0.3&auto=format&fit=crop&w=1200&q=80',
      'https://images.unsplash.com/photo-1571896349842-33c89424de2d?ixlib=rb-4.0.3&auto=format&fit=crop&w=1200&q=80'
    ],
    description: 'Phòng đơn với thiết kế hiện đại và tiện nghi đầy đủ. Cửa sổ hướng Đông, ánh sáng buổi sáng tốt.',
    features: mockRoomFeatures,
    amenities: ['WiFi miễn phí', 'Máy lạnh', 'Tủ quần áo', 'Bàn học', 'WC riêng'],
    floor: 1,
    window: 'Hướng Đông',
    rating: 4.7,
    reviews: 8,
    contact: mockContactInfo,
    rules: [
      'Không được hút thuốc trong phòng',
      'Giữ gìn vệ sinh chung',
      'Tôn trọng giờ nghỉ ngơi',
      'Không được tổ chức tiệc tùng',
      'Tắt đèn khi không sử dụng',
      'Báo cáo sự cố kỹ thuật ngay lập tức'
    ],
    nearbyFacilities: mockNearbyFacilities
  },
  {
    id: '3',
    roomNumber: 'A201',
    buildingId: '1',
    buildingName: 'Tòa A - Maple Hall',
    buildingAddress: '123 Đường Đại Học, Quận 1, TP.HCM',
    type: 'Phòng đôi',
    price: 800,
    size: '35m²',
    capacity: '2 người',
    beds: '2 giường đơn',
    bathrooms: '1 phòng tắm',
    available: true,
    images: [
      'https://images.unsplash.com/photo-1555854877-bab0efccdbef?ixlib=rb-4.0.3&auto=format&fit=crop&w=1200&q=80',
      'https://images.unsplash.com/photo-1571896349842-33c89424de2d?ixlib=rb-4.0.3&auto=format&fit=crop&w=1200&q=80',
      'https://images.unsplash.com/photo-1502672260266-1c1ef2d93688?ixlib=rb-4.0.3&auto=format&fit=crop&w=1200&q=80',
      'https://images.unsplash.com/photo-1560448204-e02f11c3d0e2?ixlib=rb-4.0.3&auto=format&fit=crop&w=1200&q=80'
    ],
    description: 'Phòng đôi rộng rãi với 2 giường đơn riêng biệt. Phù hợp cho sinh viên muốn có không gian riêng tư.',
    features: mockDoubleRoomFeatures,
    amenities: ['WiFi miễn phí', 'Máy lạnh', 'Tủ quần áo', '2 bàn học', 'WC chung'],
    floor: 2,
    window: 'Hướng Nam',
    rating: 4.6,
    reviews: 15,
    contact: mockContactInfo,
    rules: [
      'Không được hút thuốc trong phòng',
      'Giữ gìn vệ sinh chung',
      'Tôn trọng giờ nghỉ ngơi',
      'Không được tổ chức tiệc tùng',
      'Tắt đèn khi không sử dụng',
      'Báo cáo sự cố kỹ thuật ngay lập tức'
    ],
    nearbyFacilities: mockNearbyFacilities
  },
  {
    id: '4',
    roomNumber: 'A202',
    buildingId: '1',
    buildingName: 'Tòa A - Maple Hall',
    buildingAddress: '123 Đường Đại Học, Quận 1, TP.HCM',
    type: 'Phòng đôi',
    price: 800,
    size: '35m²',
    capacity: '2 người',
    beds: '2 giường đơn',
    bathrooms: '1 phòng tắm',
    available: false,
    images: [
      'https://images.unsplash.com/photo-1571896349842-33c89424de2d?ixlib=rb-4.0.3&auto=format&fit=crop&w=1200&q=80',
      'https://images.unsplash.com/photo-1502672260266-1c1ef2d93688?ixlib=rb-4.0.3&auto=format&fit=crop&w=1200&q=80',
      'https://images.unsplash.com/photo-1560448204-e02f11c3d0e2?ixlib=rb-4.0.3&auto=format&fit=crop&w=1000&q=80',
      'https://images.unsplash.com/photo-1522708323590-d24dbb6b0267?ixlib=rb-4.0.3&auto=format&fit=crop&w=1200&q=80'
    ],
    description: 'Phòng đôi với cửa sổ hướng Tây, ánh sáng buổi chiều tốt.',
    features: mockDoubleRoomFeatures,
    amenities: ['WiFi miễn phí', 'Máy lạnh', 'Tủ quần áo', '2 bàn học', 'WC chung'],
    floor: 2,
    window: 'Hướng Tây',
    rating: 4.5,
    reviews: 10,
    contact: mockContactInfo,
    rules: [
      'Không được hút thuốc trong phòng',
      'Giữ gìn vệ sinh chung',
      'Tôn trọng giờ nghỉ ngơi',
      'Không được tổ chức tiệc tùng',
      'Tắt đèn khi không sử dụng',
      'Báo cáo sự cố kỹ thuật ngay lập tức'
    ],
    nearbyFacilities: mockNearbyFacilities
  },
  {
    id: '5',
    roomNumber: 'A301',
    buildingId: '1',
    buildingName: 'Tòa A - Maple Hall',
    buildingAddress: '123 Đường Đại Học, Quận 1, TP.HCM',
    type: 'Phòng nhóm',
    price: 600,
    size: '45m²',
    capacity: '4 người',
    beds: '4 giường tầng',
    bathrooms: '2 phòng tắm',
    available: true,
    images: [
      'https://images.unsplash.com/photo-1502672260266-1c1ef2d93688?ixlib=rb-4.0.3&auto=format&fit=crop&w=1200&q=80',
      'https://images.unsplash.com/photo-1560448204-e02f11c3d0e2?ixlib=rb-4.0.3&auto=format&fit=crop&w=1000&q=80',
      'https://images.unsplash.com/photo-1522708323590-d24dbb6b0267?ixlib=rb-4.0.3&auto=format&fit=crop&w=1200&q=80',
      'https://images.unsplash.com/photo-1586023492125-27b2c045efd7?ixlib=rb-4.0.3&auto=format&fit=crop&w=1200&q=80'
    ],
    description: 'Phòng nhóm rộng rãi với 4 giường tầng. Phù hợp cho nhóm bạn muốn ở cùng nhau.',
    features: mockGroupRoomFeatures,
    amenities: ['WiFi miễn phí', 'Máy lạnh', 'Tủ quần áo', '4 bàn học', '2 WC chung'],
    floor: 3,
    window: 'Hướng Nam',
    rating: 4.4,
    reviews: 6,
    contact: mockContactInfo,
    rules: [
      'Không được hút thuốc trong phòng',
      'Giữ gìn vệ sinh chung',
      'Tôn trọng giờ nghỉ ngơi',
      'Không được tổ chức tiệc tùng',
      'Tắt đèn khi không sử dụng',
      'Báo cáo sự cố kỹ thuật ngay lập tức'
    ],
    nearbyFacilities: mockNearbyFacilities
  },
  {
    id: '6',
    roomNumber: 'A302',
    buildingId: '1',
    buildingName: 'Tòa A - Maple Hall',
    buildingAddress: '123 Đường Đại Học, Quận 1, TP.HCM',
    type: 'Phòng nhóm',
    price: 600,
    size: '45m²',
    capacity: '4 người',
    beds: '4 giường tầng',
    bathrooms: '2 phòng tắm',
    available: true,
    images: [
      'https://images.unsplash.com/photo-1560448204-e02f11c3d0e2?ixlib=rb-4.0.3&auto=format&fit=crop&w=1000&q=80',
      'https://images.unsplash.com/photo-1502672260266-1c1ef2d93688?ixlib=rb-4.0.3&auto=format&fit=crop&w=1200&q=80',
      'https://images.unsplash.com/photo-1522708323590-d24dbb6b0267?ixlib=rb-4.0.3&auto=format&fit=crop&w=1200&q=80',
      'https://images.unsplash.com/photo-1586023492125-27b2c045efd7?ixlib=rb-4.0.3&auto=format&fit=crop&w=1200&q=80'
    ],
    description: 'Phòng nhóm với cửa sổ hướng Đông, ánh sáng buổi sáng tốt.',
    features: mockGroupRoomFeatures,
    amenities: ['WiFi miễn phí', 'Máy lạnh', 'Tủ quần áo', '4 bàn học', '2 WC chung'],
    floor: 3,
    window: 'Hướng Đông',
    rating: 4.3,
    reviews: 4,
    contact: mockContactInfo,
    rules: [
      'Không được hút thuốc trong phòng',
      'Giữ gìn vệ sinh chung',
      'Tôn trọng giờ nghỉ ngơi',
      'Không được tổ chức tiệc tùng',
      'Tắt đèn khi không sử dụng',
      'Báo cáo sự cố kỹ thuật ngay lập tức'
    ],
    nearbyFacilities: mockNearbyFacilities
  }
]

// Service functions
export class MockDataService {
  // Buildings
  static getAllBuildings(): Building[] {
    return mockBuildings
  }

  static getBuildingById(id: string): Building | undefined {
    return mockBuildings.find(building => building.id === id)
  }

  static searchBuildings(query: string): Building[] {
    const lowercaseQuery = query.toLowerCase()
    return mockBuildings.filter(building =>
      building.name.toLowerCase().includes(lowercaseQuery) ||
      building.address.toLowerCase().includes(lowercaseQuery) ||
      building.description.toLowerCase().includes(lowercaseQuery)
    )
  }

  static filterBuildings(filters: {
    minPrice?: number
    maxPrice?: number
    minRating?: number
    amenities?: string[]
  }): Building[] {
    return mockBuildings.filter(building => {
      if (filters.minPrice && building.averagePrice < filters.minPrice) return false
      if (filters.maxPrice && building.averagePrice > filters.maxPrice) return false
      if (filters.minRating && building.rating < filters.minRating) return false
      if (filters.amenities && filters.amenities.length > 0) {
        const hasAllAmenities = filters.amenities.every(amenity =>
          building.amenities.includes(amenity)
        )
        if (!hasAllAmenities) return false
      }
      return true
    })
  }

  // Rooms
  static getAllRooms(): Room[] {
    return mockRooms
  }

  static getRoomsByBuildingId(buildingId: string): Room[] {
    return mockRooms.filter(room => room.buildingId === buildingId)
  }

  static getRoomById(id: string): Room | undefined {
    return mockRooms.find(room => room.id === id)
  }

  static getAvailableRooms(): Room[] {
    return mockRooms.filter(room => room.available)
  }

  static filterRooms(filters: {
    buildingId?: string
    type?: string
    minPrice?: number
    maxPrice?: number
    available?: boolean
    floor?: number
  }): Room[] {
    return mockRooms.filter(room => {
      if (filters.buildingId && room.buildingId !== filters.buildingId) return false
      if (filters.type && room.type !== filters.type) return false
      if (filters.minPrice && room.price < filters.minPrice) return false
      if (filters.maxPrice && room.price > filters.maxPrice) return false
      if (filters.available !== undefined && room.available !== filters.available) return false
      if (filters.floor && room.floor !== filters.floor) return false
      return true
    })
  }

  // Utility functions
  static getFeaturedBuildings(limit = 4): Building[] {
    return mockBuildings
      .sort((a, b) => b.rating - a.rating)
      .slice(0, limit)
  }

  static getRelatedRooms(roomId: string, limit = 3): Room[] {
    const room = this.getRoomById(roomId)
    if (!room) return []

    return mockRooms
      .filter(r => r.id !== roomId && r.buildingId === room.buildingId)
      .slice(0, limit)
  }

  static getBuildingStats(buildingId: string) {
    const rooms = this.getRoomsByBuildingId(buildingId)
    const availableRooms = rooms.filter(room => room.available)
    const totalRooms = rooms.length
    const averageRating = rooms.length > 0 
      ? rooms.reduce((sum, room) => sum + room.rating, 0) / rooms.length 
      : 0

    return {
      totalRooms,
      availableRooms: availableRooms.length,
      occupiedRooms: totalRooms - availableRooms.length,
      averageRating: Math.round(averageRating * 10) / 10,
      minPrice: Math.min(...rooms.map(room => room.price)),
      maxPrice: Math.max(...rooms.map(room => room.price))
    }
  }
}

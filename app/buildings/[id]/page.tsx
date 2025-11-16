'use client'

import { useState, useEffect, useMemo } from 'react'
import { useParams } from 'next/navigation'
import Link from 'next/link'
import Image from 'next/image'
import { 
  ArrowLeft, 
  Building2, 
  MapPin, 
  Users, 
  DollarSign, 
  Star,
  Wifi,
  Car,
  Utensils,
  Shield,
  Clock,
  Phone,
  Mail,
  Calendar,
  Eye,
  ChevronLeft,
  ChevronRight,
  Heart,
  Share2,
  Bed,
  Grid,
  List
} from 'lucide-react'
import Navbar from '@/components/Navbar'
import Footer from '@/components/Footer'
import RoomCard from '@/components/RoomCard'
import FilterBar from '@/components/FilterBar'
import { LoadingState, EmptyState } from '@/components/ui/UtilityComponents'
import { cn } from '@/lib/utils'
import { BuildingService } from '@/services/buildingService'
import { RoomService } from '@/services/backendService'
import { Building, Room, FilterState, SearchParams } from '@/types'

export default function BuildingDetailPage() {
  const params = useParams()
  const buildingId = params.id as string
  
  const [building, setBuilding] = useState<Building | null>(null)
  const [rooms, setRooms] = useState<Room[]>([])
  const [currentImageIndex, setCurrentImageIndex] = useState(0)
  const [isLoading, setIsLoading] = useState(true)
  const [viewMode, setViewMode] = useState<'grid' | 'list'>('grid')
  const [selectedRoomId, setSelectedRoomId] = useState<string | undefined>()
  
  const [filters, setFilters] = useState<FilterState>({
    building: '',
    gender: '',
    roomType: '',
    priceRange: [0, 2000]
  })

  const [searchParams, setSearchParams] = useState<SearchParams>({
    searchTerm: '',
    sortBy: 'roomNumber',
    filterType: 'all',
    viewMode: 'grid'
  })

  useEffect(() => {
    const fetchBuildingData = async () => {
      try {
        setIsLoading(true)
        const [buildingData, roomsData] = await Promise.all([
          BuildingService.getBuildingById(buildingId),
          RoomService.getRoomsByBuildingId(buildingId)
        ])
        
        if (buildingData) {
          setBuilding(buildingData)
          setRooms(roomsData)
        } else {
          setBuilding(null)
        }
      } catch (error) {
        console.error('Error fetching building data:', error)
        setBuilding(null)
      } finally {
        setIsLoading(false)
      }
    }

    fetchBuildingData()
  }, [buildingId])

  // Filter and search logic
  const filteredRooms = useMemo(() => {
    let filtered = rooms

    // Apply search term
    if (searchParams.searchTerm) {
      const searchLower = searchParams.searchTerm.toLowerCase()
      filtered = filtered.filter(room =>
        room.roomNumber.toLowerCase().includes(searchLower) ||
        room.type.toLowerCase().includes(searchLower) ||
        room.description.toLowerCase().includes(searchLower)
      )
    }

    // Apply filters
    if (filters.roomType) {
      filtered = filtered.filter(room => room.type === filters.roomType)
    }
    if (filters.priceRange[0] > 0 || filters.priceRange[1] < 2000) {
      filtered = filtered.filter(room =>
        room.price >= filters.priceRange[0] && room.price <= filters.priceRange[1]
      )
    }

    // Apply filter type
    if (searchParams.filterType === 'available') {
      filtered = filtered.filter(room => room.available)
    }

    // Apply sorting
    filtered.sort((a, b) => {
      switch (searchParams.sortBy) {
        case 'price':
          return a.price - b.price
        case 'roomNumber':
          return a.roomNumber.localeCompare(b.roomNumber)
        case 'rating':
          return b.rating - a.rating
        case 'floor':
          return a.floor - b.floor
        default:
          return 0
      }
    })

    return filtered
  }, [rooms, filters, searchParams])

  const handleRoomSelect = (roomId: string) => {
    setSelectedRoomId(roomId)
    // Scroll to room card if in grid view
    if (viewMode === 'grid') {
      const element = document.getElementById(`room-${roomId}`)
      if (element) {
        element.scrollIntoView({ behavior: 'smooth', block: 'center' })
      }
    }
  }

  const nextImage = () => {
    if (building && currentImageIndex < 3) { // Giả sử có 4 ảnh
      setCurrentImageIndex(currentImageIndex + 1)
    }
  }

  const prevImage = () => {
    if (currentImageIndex > 0) {
      setCurrentImageIndex(currentImageIndex - 1)
    }
  }

  if (isLoading) {
    return (
      <div className="min-h-screen bg-gray-50 dark:bg-gray-900">
        <Navbar />
        <div className="pt-20">
          <LoadingState message="Đang tải thông tin tòa nhà..." />
        </div>
        <Footer />
      </div>
    )
  }

  if (!building) {
    return (
      <div className="min-h-screen bg-gray-50 dark:bg-gray-900">
        <Navbar />
        <div className="pt-20 flex items-center justify-center min-h-screen">
          <EmptyState
            icon={<Building2 className="h-16 w-16 text-gray-400" />}
            title="Không tìm thấy tòa nhà"
            message="Tòa nhà bạn đang tìm kiếm không tồn tại"
            action={
              <Link href="/buildings" className="btn-primary">
                Quay lại danh sách tòa nhà
              </Link>
            }
          />
        </div>
        <Footer />
      </div>
    )
  }

  // Mock images cho building
  const buildingImages = [
    building.imageUrl,
    'https://images.unsplash.com/photo-1560448204-e02f11c3d0e2?ixlib=rb-4.0.3&auto=format&fit=crop&w=1200&q=80',
    'https://images.unsplash.com/photo-1545324418-cc1a3fa10c00?ixlib=rb-4.0.3&auto=format&fit=crop&w=1200&q=80',
    'https://images.unsplash.com/photo-1570129477492-45c003edd2be?ixlib=rb-4.0.3&auto=format&fit=crop&w=1200&q=80'
  ]

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900">
      <Navbar />
      
      <main className="pt-20">
        {/* Breadcrumb */}
        <div className="bg-white dark:bg-gray-800 shadow-sm">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
            <nav className="flex items-center space-x-2 text-sm">
              <Link href="/buildings" className="text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-300">
                Tòa nhà
              </Link>
              <span className="text-gray-400">/</span>
              <span className="text-gray-900 dark:text-white font-medium">{building.name}</span>
            </nav>
          </div>
        </div>

        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
            {/* Main Content */}
            <div className="lg:col-span-3 space-y-6">
              {/* Compact Building Header */}
              <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-lg overflow-hidden">
                <div className="flex flex-col md:flex-row">
                  {/* Compact Image */}
                  <div className="md:w-1/3">
                    <div className="relative h-48 md:h-32">
                      <Image
                        src={buildingImages[currentImageIndex]}
                        alt={`${building.name} - Ảnh ${currentImageIndex + 1}`}
                        fill
                        className="object-cover"
                        priority
                      />
                      
                      {/* Navigation Arrows */}
                      {buildingImages.length > 1 && (
                        <>
                          <button
                            onClick={prevImage}
                            disabled={currentImageIndex === 0}
                            className="absolute left-2 top-1/2 transform -translate-y-1/2 bg-white/80 dark:bg-gray-800/80 hover:bg-white dark:hover:bg-gray-800 rounded-full p-1 shadow-lg transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed"
                          >
                            <ChevronLeft className="h-4 w-4 text-gray-700 dark:text-gray-300" />
                          </button>
                          <button
                            onClick={nextImage}
                            disabled={currentImageIndex === buildingImages.length - 1}
                            className="absolute right-2 top-1/2 transform -translate-y-1/2 bg-white/80 dark:bg-gray-800/80 hover:bg-white dark:hover:bg-gray-800 rounded-full p-1 shadow-lg transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed"
                          >
                            <ChevronRight className="h-4 w-4 text-gray-700 dark:text-gray-300" />
                          </button>
                        </>
                      )}

                      {/* Image Counter */}
                      <div className="absolute bottom-2 right-2 bg-black/50 text-white px-2 py-1 rounded-full text-xs">
                        {currentImageIndex + 1} / {buildingImages.length}
                      </div>
                    </div>
                  </div>

                  {/* Building Info */}
                  <div className="md:w-2/3 p-6">
                    <div className="flex items-start justify-between mb-4">
                      <div>
                        <h1 className="text-2xl font-bold text-gray-900 dark:text-white mb-2">
                          {building.name}
                        </h1>
                        <div className="flex items-center text-gray-600 dark:text-gray-400 mb-3">
                          <MapPin className="h-4 w-4 mr-2" />
                          <span className="text-sm">{building.address}</span>
                        </div>
                        <div className="flex items-center space-x-4">
                          <div className="flex items-center text-yellow-500">
                            <Star className="h-4 w-4 fill-current mr-1" />
                            <span className="font-semibold text-gray-900 dark:text-white text-sm">
                              {building.rating}
                            </span>
                            <span className="text-gray-600 dark:text-gray-400 ml-1 text-sm">
                              ({building.totalReviews} đánh giá)
                            </span>
                          </div>
                        </div>
                      </div>
                      <Link
                        href="/buildings"
                        className="flex items-center text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:hover:text-white transition-colors duration-200 text-sm"
                      >
                        <ArrowLeft className="h-4 w-4 mr-1" />
                        Quay lại
                      </Link>
                    </div>

                    <p className="text-gray-600 dark:text-gray-400 text-sm leading-relaxed mb-4">
                      {building.description}
                    </p>

                    {/* Compact Stats */}
                    <div className="grid grid-cols-4 gap-3">
                      <div className="text-center">
                        <div className="text-lg font-bold text-blue-600 dark:text-blue-400">
                          {building.totalRooms}
                        </div>
                        <div className="text-xs text-gray-600 dark:text-gray-400">Tổng phòng</div>
                      </div>
                      <div className="text-center">
                        <div className="text-lg font-bold text-green-600 dark:text-green-400">
                          {building.availableRooms}
                        </div>
                        <div className="text-xs text-gray-600 dark:text-gray-400">Còn trống</div>
                      </div>
                      <div className="text-center">
                        <div className="text-lg font-bold text-purple-600 dark:text-purple-400">
                          {building.averagePrice.toLocaleString()}đ
                        </div>
                        <div className="text-xs text-gray-600 dark:text-gray-400">Giá TB</div>
                      </div>
                      <div className="text-center">
                        <div className="text-lg font-bold text-yellow-600 dark:text-yellow-400">
                          {building.rating}
                        </div>
                        <div className="text-xs text-gray-600 dark:text-gray-400">Đánh giá</div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>

              {/* Rooms Section */}
              <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-lg p-6">
                <div className="flex items-center justify-between mb-6">
                  <div>
                    <h2 className="text-3xl font-bold text-gray-900 dark:text-white mb-2">
                      Danh sách phòng
                    </h2>
                    <p className="text-gray-600 dark:text-gray-400">
                      Tìm thấy <span className="font-semibold text-blue-600 dark:text-blue-400">
                        {filteredRooms.length}
                      </span> phòng trong tòa nhà này
                    </p>
                  </div>
                  
                  {/* View Mode Toggle */}
                  <div className="flex items-center space-x-2">
                    <button
                      onClick={() => setViewMode('grid')}
                      className={cn(
                        'flex items-center px-3 py-2 rounded-lg text-sm font-medium transition-colors duration-200',
                        viewMode === 'grid'
                          ? 'bg-blue-500 text-white'
                          : 'bg-gray-100 dark:bg-gray-700 text-gray-700 dark:text-gray-300 hover:bg-gray-200 dark:hover:bg-gray-600'
                      )}
                    >
                      <Grid className="h-4 w-4 mr-2" />
                      Lưới
                    </button>
                    <button
                      onClick={() => setViewMode('list')}
                      className={cn(
                        'flex items-center px-3 py-2 rounded-lg text-sm font-medium transition-colors duration-200',
                        viewMode === 'list'
                          ? 'bg-blue-500 text-white'
                          : 'bg-gray-100 dark:bg-gray-700 text-gray-700 dark:text-gray-300 hover:bg-gray-200 dark:hover:bg-gray-600'
                      )}
                    >
                      <List className="h-4 w-4 mr-2" />
                      Danh sách
                    </button>
                  </div>
                </div>

                {/* Rooms Content */}
                {filteredRooms.length > 0 ? (
                  <div className={cn(
                    viewMode === 'grid' 
                      ? 'grid grid-cols-1 md:grid-cols-2 gap-6' 
                      : 'space-y-4'
                  )}>
                    {filteredRooms.map((room) => (
                      <div key={room.id} id={`room-${room.id}`}>
                        <RoomCard
                          room={room}
                          viewMode={viewMode}
                          onSelect={handleRoomSelect}
                          isSelected={selectedRoomId === room.id}
                        />
                      </div>
                    ))}
                  </div>
                ) : (
                  <EmptyState
                    icon={<Bed className="h-16 w-16 text-gray-400" />}
                    title="Không tìm thấy phòng"
                    message="Thử điều chỉnh bộ lọc để tìm thấy nhiều kết quả hơn"
                  />
                )}
              </div>
            </div>

            {/* Sidebar */}
            <div className="lg:col-span-1">
              <div className="sticky top-24 space-y-4">
                {/* Room Filters */}
                <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-lg p-4">
                  <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-3">
                    Bộ lọc phòng
                  </h3>
                  
                  <FilterBar
                    filters={filters}
                    onFiltersChange={setFilters}
                    searchParams={searchParams}
                    onSearchParamsChange={setSearchParams}
                  />
                </div>

                {/* Quick Actions */}
                <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-lg p-4">
                  <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-3">
                    Thao tác nhanh
                  </h3>
                  
                  <div className="space-y-2">
                    <button className="w-full bg-blue-500 hover:bg-blue-600 text-white py-2 px-4 rounded-lg font-medium transition-colors duration-200 flex items-center justify-center space-x-2">
                      <Phone className="h-4 w-4" />
                      <span>Gọi ngay</span>
                    </button>
                    
                    <button className="w-full border border-gray-300 dark:border-gray-600 text-gray-700 dark:text-gray-300 py-2 px-4 rounded-lg font-medium hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors duration-200 flex items-center justify-center space-x-2">
                      <Calendar className="h-4 w-4" />
                      <span>Đặt lịch tham quan</span>
                    </button>
                  </div>
                </div>

                {/* Building Summary */}
                <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-lg p-4">
                  <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-3">
                    Tóm tắt
                  </h3>
                  
                  <div className="space-y-2">
                    <div className="flex items-center justify-between">
                      <span className="text-sm text-gray-600 dark:text-gray-400">Tổng phòng</span>
                      <span className="font-semibold text-gray-900 dark:text-white">{building.totalRooms}</span>
                    </div>
                    <div className="flex items-center justify-between">
                      <span className="text-sm text-gray-600 dark:text-gray-400">Còn trống</span>
                      <span className="font-semibold text-green-600 dark:text-green-400">{building.availableRooms}</span>
                    </div>
                    <div className="flex items-center justify-between">
                      <span className="text-sm text-gray-600 dark:text-gray-400">Giá TB</span>
                      <span className="font-semibold text-gray-900 dark:text-white">{building.averagePrice.toLocaleString()}đ</span>
                    </div>
                    <div className="flex items-center justify-between">
                      <span className="text-sm text-gray-600 dark:text-gray-400">Đánh giá</span>
                      <span className="font-semibold text-yellow-500">{building.rating} ({building.totalReviews})</span>
                    </div>
                  </div>
                </div>

                {/* Map Placeholder */}
                <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-lg p-6">
                  <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">
                    Vị trí
                  </h3>
                  
                  <div className="h-48 bg-gray-200 dark:bg-gray-700 rounded-lg flex items-center justify-center">
                    <div className="text-center">
                      <MapPin className="h-8 w-8 text-gray-400 mx-auto mb-2" />
                      <p className="text-sm text-gray-600 dark:text-gray-400">Bản đồ sẽ được tích hợp</p>
                    </div>
                  </div>
                  
                  <p className="text-sm text-gray-600 dark:text-gray-400 mt-3">
                    {building.address}
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </main>

      <Footer />
    </div>
  )
}

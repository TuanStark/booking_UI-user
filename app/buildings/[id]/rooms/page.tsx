'use client'

import { useState, useMemo } from 'react'
import { useParams } from 'next/navigation'
import Link from 'next/link'
import { 
  ArrowLeft, 
  Building2, 
  MapPin, 
  Users, 
  DollarSign, 
  Star,
  Grid,
  List
} from 'lucide-react'
import Navbar from '@/components/Navbar'
import Footer from '@/components/Footer'
import FilterBar from '@/components/FilterBar'
import RoomCard from '@/components/RoomCard'
import { LoadingState, EmptyState } from '@/components/ui/UtilityComponents'
import { cn } from '@/lib/utils'
import { MockDataService } from '@/services/mockDataService'
import { Room, FilterState, SearchParams } from '@/types'

export default function BuildingRoomsPage() {
  const params = useParams()
  const buildingId = params.id as string
  
  const [viewMode, setViewMode] = useState<'grid' | 'list'>('grid')
  const [selectedRoomId, setSelectedRoomId] = useState<string | undefined>()
  
  // Get building and rooms data
  const building = MockDataService.getBuildingById(buildingId)
  const rooms = MockDataService.getRoomsByBuildingId(buildingId)

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

        {/* Building Header */}
        <div className="bg-white dark:bg-gray-800 shadow-sm">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
            <div className="flex flex-col lg:flex-row gap-8">
              {/* Building Image */}
              <div className="lg:w-1/3">
                <img
                  src={building.images || '/placeholder-building.jpg'}
                  alt={building.name}
                  className="w-full h-64 lg:h-80 object-cover rounded-2xl shadow-lg"
                />
              </div>

              {/* Building Info */}
              <div className="lg:w-2/3">
                <div className="flex items-start justify-between mb-4">
                  <div>
                    <h1 className="text-3xl font-bold text-gray-900 dark:text-white mb-2">
                      {building.name}
                    </h1>
                    <div className="flex items-center text-gray-600 dark:text-gray-400 mb-4">
                      <MapPin className="h-5 w-5 mr-2" />
                      <span>{building.address}</span>
                    </div>
                  </div>
                  <Link
                    href="/buildings"
                    className="flex items-center text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:hover:text-white transition-colors duration-200"
                  >
                    <ArrowLeft className="h-4 w-4 mr-1" />
                    Quay lại
                  </Link>
                </div>

                <p className="text-gray-600 dark:text-gray-400 mb-6 leading-relaxed">
                  {building.description}
                </p>

                {/* Building Stats */}
                <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-6">
                  <div className="text-center p-4 bg-gray-50 dark:bg-gray-700 rounded-lg">
                    <div className="text-2xl font-bold text-blue-600 dark:text-blue-400">
                      {building.totalRooms}
                    </div>
                    <div className="text-sm text-gray-600 dark:text-gray-400">Tổng phòng</div>
                  </div>
                  <div className="text-center p-4 bg-gray-50 dark:bg-gray-700 rounded-lg">
                    <div className="text-2xl font-bold text-green-600 dark:text-green-400">
                      {building.availableRooms}
                    </div>
                    <div className="text-sm text-gray-600 dark:text-gray-400">Còn trống</div>
                  </div>
                  <div className="text-center p-4 bg-gray-50 dark:bg-gray-700 rounded-lg">
                    <div className="text-2xl font-bold text-purple-600 dark:text-purple-400">
                      {building.averagePrice.toLocaleString()}đ
                    </div>
                    <div className="text-sm text-gray-600 dark:text-gray-400">Giá TB/tháng</div>
                  </div>
                  <div className="text-center p-4 bg-gray-50 dark:bg-gray-700 rounded-lg">
                    <div className="flex items-center justify-center mb-1">
                      <Star className="h-4 w-4 text-yellow-500 fill-current mr-1" />
                      <span className="text-lg font-bold text-gray-900 dark:text-white">
                        {building.rating}
                      </span>
                    </div>
                    <div className="text-sm text-gray-600 dark:text-gray-400">Đánh giá</div>
                  </div>
                </div>

                {/* Amenities */}
                <div>
                  <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-3">
                    Tiện nghi
                  </h3>
                  <div className="flex flex-wrap gap-2">
                    {building.amenities.map((amenity) => (
                      <span
                        key={amenity}
                        className="px-3 py-1 bg-blue-100 dark:bg-blue-900 text-blue-800 dark:text-blue-200 text-sm rounded-full"
                      >
                        {amenity}
                      </span>
                    ))}
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Rooms Section */}
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          <div className="flex flex-col lg:flex-row gap-8">
            {/* Sidebar */}
            <div className="lg:w-80 flex-shrink-0">
              <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-lg p-6 sticky top-24">
                <h2 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">
                  Bộ lọc phòng
                </h2>
                
                <FilterBar
                  filters={filters}
                  onFiltersChange={setFilters}
                  searchParams={searchParams}
                  onSearchParamsChange={setSearchParams}
                />
              </div>
            </div>

            {/* Main Content */}
            <div className="flex-1">
              {/* Results Header */}
              <div className="flex items-center justify-between mb-6">
                <div>
                  <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-2">
                    Danh sách phòng
                  </h2>
                  <p className="text-gray-600 dark:text-gray-400">
                    Tìm thấy <span className="font-semibold text-gray-900 dark:text-white">
                      {filteredRooms.length}
                    </span> phòng
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
                  icon={<Building2 className="h-16 w-16 text-gray-400" />}
                  title="Không tìm thấy phòng"
                  message="Thử điều chỉnh bộ lọc để tìm thấy nhiều kết quả hơn"
                />
              )}
            </div>
          </div>
        </div>
      </main>

      <Footer />
    </div>
  )
}


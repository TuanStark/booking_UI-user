'use client'

import { useState, useMemo } from 'react'
import { Grid, List } from 'lucide-react'
import RoomCard from '@/components/RoomCard'
import FilterBar from '@/components/FilterBar'
import { Room, FilterState, SearchParams } from '@/types'
import { cn } from '@/lib/utils'

interface BuildingRoomsListProps {
  rooms: Room[]
}

export default function BuildingRoomsList({ rooms }: BuildingRoomsListProps) {
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

  return (
    <div className="space-y-6">
      {/* Filters and View Toggle */}
      <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-lg p-6">
        <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4 mb-4">
          <div>
            <h2 className="text-xl font-semibold text-gray-900 dark:text-white mb-1">
              Danh sách phòng
            </h2>
            <p className="text-sm text-gray-600 dark:text-gray-400">
              Tìm thấy {filteredRooms.length} phòng
            </p>
          </div>
          
          {/* View Mode Toggle */}
          <div className="flex items-center space-x-2">
            <button
              onClick={() => setViewMode('grid')}
              className={cn(
                'p-2 rounded-lg transition-colors duration-200',
                viewMode === 'grid'
                  ? 'bg-blue-500 text-white'
                  : 'bg-gray-100 dark:bg-gray-700 text-gray-700 dark:text-gray-300 hover:bg-gray-200 dark:hover:bg-gray-600'
              )}
            >
              <Grid className="h-5 w-5" />
            </button>
            <button
              onClick={() => setViewMode('list')}
              className={cn(
                'p-2 rounded-lg transition-colors duration-200',
                viewMode === 'list'
                  ? 'bg-blue-500 text-white'
                  : 'bg-gray-100 dark:bg-gray-700 text-gray-700 dark:text-gray-300 hover:bg-gray-200 dark:hover:bg-gray-600'
              )}
            >
              <List className="h-5 w-5" />
            </button>
          </div>
        </div>

        <FilterBar
          filters={filters}
          searchParams={searchParams}
          onFiltersChange={setFilters}
          onSearchParamsChange={setSearchParams}
        />
      </div>

      {/* Rooms Grid/List */}
      {filteredRooms.length > 0 ? (
        <div className={cn(
          viewMode === 'grid'
            ? 'grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6'
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
        <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-lg p-12 text-center">
          <p className="text-gray-600 dark:text-gray-400">
            Không tìm thấy phòng nào phù hợp với bộ lọc của bạn
          </p>
        </div>
      )}
    </div>
  )
}


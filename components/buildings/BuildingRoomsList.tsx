'use client'

import { useMemo, useState } from 'react'
import { Grid, List, Search, Filter, RefreshCw } from 'lucide-react'
import RoomCard from '@/components/RoomCard'
import { Room, FilterState, SearchParams } from '@/types'
import { cn } from '@/lib/utils'

interface BuildingRoomsListProps {
  rooms: Room[]
}

const ROOM_TYPES = ['Phòng đơn', 'Phòng đôi', 'Phòng nhóm']
const SORT_OPTIONS = [
  { value: 'roomNumber', label: 'Số phòng' },
  { value: 'price', label: 'Giá' },
  { value: 'rating', label: 'Đánh giá' },
  { value: 'floor', label: 'Tầng' },
]
const PRICE_RANGE: [number, number] = [0, 2000]

const priceFormatter = new Intl.NumberFormat('vi-VN', {
  style: 'currency',
  currency: 'VND',
  maximumFractionDigits: 0,
})

export default function BuildingRoomsList({ rooms }: BuildingRoomsListProps) {
  const [viewMode, setViewMode] = useState<'grid' | 'list'>('grid')
  const [selectedRoomId, setSelectedRoomId] = useState<string | undefined>()

  const [filters, setFilters] = useState<FilterState>({
    building: '',
    gender: '',
    roomType: '',
    priceRange: PRICE_RANGE,
  })

  const [searchParams, setSearchParams] = useState<SearchParams>({
    searchTerm: '',
    sortBy: 'roomNumber',
    filterType: 'all',
    viewMode: 'grid',
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
    if (viewMode === 'grid') {
      const element = document.getElementById(`room-${roomId}`)
      if (element) {
        element.scrollIntoView({ behavior: 'smooth', block: 'center' })
      }
    }
  }

  const handleRoomTypeToggle = (type: string) => {
    setFilters(prev => ({
      ...prev,
      roomType: prev.roomType === type ? '' : type,
    }))
  }

  const handleAvailabilityToggle = () => {
    setSearchParams(prev => ({
      ...prev,
      filterType: prev.filterType === 'available' ? 'all' : 'available',
    }))
  }

  const handlePriceChange = (value: number) => {
    setFilters(prev => ({
      ...prev,
      priceRange: [prev.priceRange[0], value],
    }))
  }

  const handleSortChange = (value: string) => {
    setSearchParams(prev => ({
      ...prev,
      sortBy: value as SearchParams['sortBy'],
    }))
  }

  const formatPriceLabel = (value: number) => {
    return priceFormatter.format(value * 1000)
  }

  const resetFilters = () => {
    setFilters({
      building: '',
      gender: '',
      roomType: '',
      priceRange: PRICE_RANGE,
    })
    setSearchParams({
      searchTerm: '',
      sortBy: 'roomNumber',
      filterType: 'all',
      viewMode: 'grid',
    })
  }

  return (
    <div className="space-y-6">
      <div className="rounded-3xl border border-gray-100 dark:border-gray-800 bg-white dark:bg-gray-900 shadow-lg p-4 sm:p-6 space-y-5">
        <div className="flex flex-col gap-4 lg:flex-row lg:items-center lg:justify-between">
          <div>
            <p className="text-xs uppercase tracking-wide text-blue-500 dark:text-blue-300">
              Bộ lọc thông minh
            </p>
            <h2 className="text-2xl font-semibold text-gray-900 dark:text-white">
              Danh sách phòng
            </h2>
            <p className="text-sm text-gray-500 dark:text-gray-400">
              {filteredRooms.length} / {rooms.length} phòng phù hợp điều kiện
            </p>
          </div>
          <div className="flex flex-wrap items-center gap-2">
            <div className="relative w-full sm:w-64">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-400" />
              <input
                type="text"
                value={searchParams.searchTerm}
                onChange={(e) =>
                  setSearchParams(prev => ({ ...prev, searchTerm: e.target.value }))
                }
                placeholder="Tìm số phòng, mô tả..."
                className="w-full rounded-2xl border border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-800 py-2 pl-9 pr-3 text-sm text-gray-900 dark:text-white placeholder:text-gray-400 focus:border-blue-500 focus:ring-2 focus:ring-blue-200 dark:focus:ring-blue-500/30"
              />
            </div>
            <select
              value={searchParams.sortBy}
              onChange={(e) => handleSortChange(e.target.value)}
              className="rounded-2xl border border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-800 px-3 py-2 text-sm text-gray-900 dark:text-white focus:border-blue-500 focus:ring-2 focus:ring-blue-200 dark:focus:ring-blue-500/30"
            >
              {SORT_OPTIONS.map(option => (
                <option key={option.value} value={option.value}>
                  Sắp xếp: {option.label}
                </option>
              ))}
            </select>
            <div className="flex items-center space-x-2 rounded-2xl border border-gray-200 dark:border-gray-700 p-1">
              <button
                onClick={() => setViewMode('grid')}
                className={cn(
                  'rounded-xl px-3 py-1.5 text-sm font-medium transition-colors',
                  viewMode === 'grid'
                    ? 'bg-blue-600 text-white'
                    : 'text-gray-600 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-800'
                )}
              >
                <Grid className="h-4 w-4" />
              </button>
              <button
                onClick={() => setViewMode('list')}
                className={cn(
                  'rounded-xl px-3 py-1.5 text-sm font-medium transition-colors',
                  viewMode === 'list'
                    ? 'bg-blue-600 text-white'
                    : 'text-gray-600 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-800'
                )}
              >
                <List className="h-4 w-4" />
              </button>
            </div>
          </div>
        </div>

        <div className="flex flex-wrap items-center gap-2">
          {ROOM_TYPES.map(type => {
            const isActive = filters.roomType === type
            return (
              <button
                key={type}
                onClick={() => handleRoomTypeToggle(type)}
                className={cn(
                  'rounded-full px-4 py-1.5 text-sm transition-all',
                  isActive
                    ? 'bg-blue-600 text-white shadow-sm'
                    : 'bg-gray-100 dark:bg-gray-800 text-gray-700 dark:text-gray-300 hover:bg-gray-200 dark:hover:bg-gray-700'
                )}
              >
                {type}
              </button>
            )
          })}
          <button
            onClick={handleAvailabilityToggle}
            className={cn(
              'inline-flex items-center gap-2 rounded-full px-4 py-1.5 text-sm transition-all',
              searchParams.filterType === 'available'
                ? 'bg-emerald-100 text-emerald-700 dark:bg-emerald-500/15 dark:text-emerald-300'
                : 'bg-gray-100 dark:bg-gray-800 text-gray-700 dark:text-gray-300 hover:bg-gray-200 dark:hover:bg-gray-700'
            )}
          >
            <Filter className="h-4 w-4" />
            Chỉ phòng trống
          </button>
          <button
            onClick={resetFilters}
            className="inline-flex items-center gap-2 rounded-full px-4 py-1.5 text-sm text-gray-500 hover:text-gray-800 dark:text-gray-400 dark:hover:text-gray-100"
          >
            <RefreshCw className="h-4 w-4" />
            Đặt lại
          </button>
        </div>

        <div className="flex flex-col gap-2 sm:flex-row sm:items-center sm:justify-between">
          <div className="flex items-center gap-3 text-sm text-gray-600 dark:text-gray-300">
            <span className="font-medium">Giá tối đa:</span>
            <span className="rounded-full bg-gray-100 dark:bg-gray-800 px-3 py-1 text-gray-800 dark:text-gray-100">
              {formatPriceLabel(filters.priceRange[1])}/tháng
            </span>
          </div>
          <input
            type="range"
            min={PRICE_RANGE[0]}
            max={PRICE_RANGE[1]}
            step={50}
            value={filters.priceRange[1]}
            onChange={(e) => handlePriceChange(parseInt(e.target.value, 10))}
            className="w-full accent-blue-600 sm:w-64"
          />
        </div>
      </div>

      {filteredRooms.length > 0 ? (
        <div
          className={cn(
            viewMode === 'grid'
              ? 'grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6'
              : 'space-y-4'
          )}
        >
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
        <div className="rounded-3xl border border-dashed border-gray-300 dark:border-gray-700 bg-gray-50 dark:bg-gray-800/40 p-12 text-center">
          <p className="text-gray-600 dark:text-gray-400">
            Không tìm thấy phòng nào phù hợp với bộ lọc của bạn
          </p>
        </div>
      )}
    </div>
  )
}


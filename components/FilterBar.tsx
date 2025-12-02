'use client'

import { useState } from 'react'
import { cn } from '@/utils/utils'
import { FilterState, SearchParams } from '@/types'

interface FilterBarProps {
  filters: FilterState
  onFiltersChange: (filters: FilterState) => void
  searchParams: SearchParams
  onSearchParamsChange: (params: SearchParams) => void
}

export default function FilterBar({
  filters,
  onFiltersChange,
  searchParams,
  onSearchParamsChange
}: FilterBarProps) {
  const roomTypes = ['Phòng đơn', 'Phòng đôi', 'Phòng nhóm']
  const sortOptions = [
    { value: 'roomNumber', label: 'Số phòng' },
    { value: 'price', label: 'Giá' },
    { value: 'rating', label: 'Đánh giá' },
    { value: 'floor', label: 'Tầng' }
  ]

  const resetFilters = () => {
    onFiltersChange({
      building: '',
      gender: '',
      roomType: '',
      priceRange: [0, 2000]
    })
    onSearchParamsChange({
      searchTerm: '',
      sortBy: 'roomNumber',
      filterType: 'all',
      viewMode: 'grid'
    })
  }

  return (
    <div className="space-y-6">
      {/* Search */}
      <div>
        <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
          Tìm kiếm
        </label>
        <input
          type="text"
          value={searchParams.searchTerm}
          onChange={(e) => onSearchParamsChange({ ...searchParams, searchTerm: e.target.value })}
          placeholder="Số phòng, loại phòng..."
          className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent dark:bg-gray-700 dark:text-white"
        />
      </div>

      {/* Room Type Filter */}
      <div>
        <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
          Loại phòng
        </label>
        <select
          value={filters.roomType}
          onChange={(e) => onFiltersChange({ ...filters, roomType: e.target.value })}
          className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent dark:bg-gray-700 dark:text-white"
        >
          <option value="">Tất cả</option>
          {roomTypes.map((type) => (
            <option key={type} value={type}>{type}</option>
          ))}
        </select>
      </div>

      {/* Price Range */}
      <div>
        <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
          Khoảng giá: {filters.priceRange[0]}đ - {filters.priceRange[1]}đ
        </label>
        <div className="space-y-2">
          <input
            type="range"
            min="0"
            max="2000"
            step="50"
            value={filters.priceRange[1]}
            onChange={(e) => onFiltersChange({
              ...filters,
              priceRange: [filters.priceRange[0], parseInt(e.target.value)]
            })}
            className="w-full"
          />
        </div>
      </div>

      {/* Sort By */}
      <div>
        <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
          Sắp xếp theo
        </label>
        <select
          value={searchParams.sortBy}
          onChange={(e) => onSearchParamsChange({ ...searchParams, sortBy: e.target.value as any })}
          className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent dark:bg-gray-700 dark:text-white"
        >
          {sortOptions.map((option) => (
            <option key={option.value} value={option.value}>{option.label}</option>
          ))}
        </select>
      </div>

      {/* Filter Type */}
      <div>
        <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
          Trạng thái
        </label>
        <select
          value={searchParams.filterType}
          onChange={(e) => onSearchParamsChange({ ...searchParams, filterType: e.target.value as any })}
          className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent dark:bg-gray-700 dark:text-white"
        >
          <option value="all">Tất cả</option>
          <option value="available">Còn trống</option>
        </select>
      </div>

      {/* Reset Filters */}
      <button
        onClick={resetFilters}
        className="w-full px-4 py-2 text-sm font-medium text-gray-700 dark:text-gray-300 bg-gray-100 dark:bg-gray-700 rounded-lg hover:bg-gray-200 dark:hover:bg-gray-600 transition-colors duration-200"
      >
        Đặt lại bộ lọc
      </button>
    </div>
  )
}

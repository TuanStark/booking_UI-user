'use client'

import { useState } from 'react'
import { Search, MapPin, Filter } from 'lucide-react'
import { cn } from '@/lib/utils'

interface SearchBarProps {
  onSearch?: (query: string) => void
  onLocationChange?: (location: string) => void
  className?: string
}

export default function SearchBar({ onSearch, onLocationChange, className }: SearchBarProps) {
  const [searchQuery, setSearchQuery] = useState('')
  const [location, setLocation] = useState('')

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault()
    onSearch?.(searchQuery)
  }

  const handleLocationChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value
    setLocation(value)
    onLocationChange?.(value)
  }

  return (
    <div className={cn('w-full max-w-4xl mx-auto', className)}>
      <form onSubmit={handleSearch} className="space-y-4">
        {/* Main Search Input */}
        <div className="relative">
          <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
            <Search className="h-5 w-5 text-gray-400" />
          </div>
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Tìm kiếm ký túc xá, địa điểm..."
            className="w-full pl-10 pr-4 py-4 border border-gray-300 dark:border-gray-600 rounded-2xl focus:ring-2 focus:ring-blue-500 focus:border-transparent dark:bg-gray-800 dark:text-white text-lg placeholder-gray-500 dark:placeholder-gray-400 transition-all duration-200"
          />
        </div>

        {/* Location and Filters Row */}
        <div className="flex flex-col sm:flex-row gap-4">
          {/* Location Input */}
          <div className="relative flex-1">
            <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
              <MapPin className="h-5 w-5 text-gray-400" />
            </div>
            <input
              type="text"
              value={location}
              onChange={handleLocationChange}
              placeholder="Khu vực, thành phố..."
              className="w-full pl-10 pr-4 py-3 border border-gray-300 dark:border-gray-600 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent dark:bg-gray-800 dark:text-white placeholder-gray-500 dark:placeholder-gray-400 transition-all duration-200"
            />
          </div>

          {/* Filter Button */}
          <button
            type="button"
            className="flex items-center justify-center px-6 py-3 border border-gray-300 dark:border-gray-600 rounded-xl hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors duration-200"
          >
            <Filter className="h-5 w-5 text-gray-600 dark:text-gray-400 mr-2" />
            <span className="text-gray-700 dark:text-gray-300 font-medium">Bộ lọc</span>
          </button>

          {/* Search Button */}
          <button
            type="submit"
            className="bg-gradient-to-r from-blue-500 to-purple-600 text-white px-8 py-3 rounded-xl font-semibold hover:from-blue-600 hover:to-purple-700 transition-all duration-200 shadow-lg hover:shadow-xl"
          >
            Tìm kiếm
          </button>
        </div>

        {/* Quick Filters */}
        <div className="flex flex-wrap gap-2">
          <span className="text-sm text-gray-600 dark:text-gray-400 mr-2">Tìm nhanh:</span>
          {['Phòng đơn', 'Phòng đôi', 'Phòng nhóm', 'Gần trường', 'Giá rẻ'].map((filter) => (
            <button
              key={filter}
              type="button"
              onClick={() => setSearchQuery(filter)}
              className="px-3 py-1 text-sm bg-gray-100 dark:bg-gray-700 text-gray-700 dark:text-gray-300 rounded-full hover:bg-gray-200 dark:hover:bg-gray-600 transition-colors duration-200"
            >
              {filter}
            </button>
          ))}
        </div>
      </form>
    </div>
  )
}

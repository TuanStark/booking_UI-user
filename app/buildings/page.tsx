'use client'

import { useState, useEffect, useMemo } from 'react'
import Link from 'next/link'
import { Map, Grid, Building2, Star, MapPin, DollarSign, Users, Eye } from 'lucide-react'
import Navbar from '@/components/Navbar'
import DormMap from '@/components/DormMap'
import Footer from '@/components/Footer'
import { cn } from '@/lib/utils'
import { BuildingService } from '@/services/buildingService'
import { Building } from '@/types'

export default function BuildingsPage() {
  const [viewMode, setViewMode] = useState<'grid' | 'map'>('grid')
  const [selectedBuildingId, setSelectedBuildingId] = useState<string | undefined>()
  const [buildings, setBuildings] = useState<Building[]>([])
  const [isLoading, setIsLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    const fetchBuildings = async () => {
      try {
        setIsLoading(true)
        const buildingsData = await BuildingService.getAllBuildings()
        setBuildings(buildingsData)
      } catch (error) {
        console.error('Error fetching buildings:', error)
        setError('Không thể tải danh sách tòa nhà')
      } finally {
        setIsLoading(false)
      }
    }

    fetchBuildings()
  }, [])

  const handleBuildingSelect = (buildingId: string) => {
    setSelectedBuildingId(buildingId)
    // Scroll to building card if in grid view
    if (viewMode === 'grid') {
      const element = document.getElementById(`building-${buildingId}`)
      if (element) {
        element.scrollIntoView({ behavior: 'smooth', block: 'center' })
      }
    }
  }

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900">
      <Navbar />
      
      <main className="pt-20">
        {/* Header */}
        <div className="bg-white dark:bg-gray-800 shadow-sm">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
            <div className="flex flex-col md:flex-row md:items-center md:justify-between">
              <div>
                <h1 className="text-3xl font-bold text-gray-900 dark:text-white">
                  Danh sách Tòa nhà
                </h1>
                <p className="mt-2 text-gray-600 dark:text-gray-400">
                  Khám phá các tòa nhà ký túc xá có sẵn
                </p>
              </div>
              
              {/* View Mode Toggle */}
              <div className="mt-4 md:mt-0 flex items-center space-x-2">
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
                  onClick={() => setViewMode('map')}
                  className={cn(
                    'flex items-center px-3 py-2 rounded-lg text-sm font-medium transition-colors duration-200',
                    viewMode === 'map'
                      ? 'bg-blue-500 text-white'
                      : 'bg-gray-100 dark:bg-gray-700 text-gray-700 dark:text-gray-300 hover:bg-gray-200 dark:hover:bg-gray-600'
                  )}
                >
                  <Map className="h-4 w-4 mr-2" />
                  Bản đồ
                </button>
              </div>
            </div>
          </div>
        </div>

        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          {/* Results Header */}
          <div className="flex items-center justify-between mb-6">
            <div>
              <p className="text-gray-600 dark:text-gray-400">
                Tìm thấy <span className="font-semibold text-gray-900 dark:text-white">
                  {buildings.length}
                </span> tòa nhà
              </p>
            </div>
          </div>

          {/* Content */}
          {viewMode === 'grid' ? (
            <div className="space-y-6">
              {buildings.length > 0 ? (
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                  {buildings.map((building) => (
                    <div key={building.id} id={`building-${building.id}`}>
                      <BuildingCard
                        building={building}
                        onSelect={handleBuildingSelect}
                        isSelected={selectedBuildingId === building.id}
                      />
                    </div>
                  ))}
                </div>
              ) : (
                <div className="text-center py-20">
                  <Building2 className="h-16 w-16 text-gray-400 mx-auto mb-4" />
                  <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-2">
                    Không tìm thấy tòa nhà
                  </h3>
                  <p className="text-gray-600 dark:text-gray-400">
                    Vui lòng thử lại sau
                  </p>
                </div>
              )}
            </div>
          ) : (
            <div className="h-96 lg:h-[600px]">
              <DormMap
                dorms={buildings}
                selectedDormId={selectedBuildingId}
                onDormSelect={handleBuildingSelect}
                className="h-full"
              />
            </div>
          )}
        </div>
      </main>

      <Footer />
    </div>
  )
}

// Building Card Component
interface BuildingCardProps {
  building: Building
  onSelect: (buildingId: string) => void
  isSelected: boolean
}

function BuildingCard({ building, onSelect, isSelected }: BuildingCardProps) {
  return (
    <div className={cn(
      'bg-white dark:bg-gray-800 rounded-2xl shadow-lg hover:shadow-xl transition-all duration-300 overflow-hidden group cursor-pointer',
      isSelected && 'ring-2 ring-blue-500 shadow-xl'
    )}>
      {/* Image */}
      <div className="relative h-48 overflow-hidden">
        <img
          src={building.imageUrl}
          alt={building.name}
          className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
        />
        <div className="absolute top-4 right-4">
          <div className="bg-white dark:bg-gray-800 px-2 py-1 rounded-full shadow-md">
            <div className="flex items-center space-x-1">
              <Star className="h-4 w-4 text-yellow-500 fill-current" />
              <span className="text-sm font-semibold text-gray-900 dark:text-white">
                {building.rating}
              </span>
            </div>
          </div>
        </div>
        <div className="absolute bottom-4 left-4">
          <div className="bg-green-500 text-white px-2 py-1 rounded-full text-xs font-medium">
            {building.availableRooms} phòng trống
          </div>
        </div>
      </div>

      {/* Content */}
      <div className="p-6">
        <div className="space-y-3">
          {/* Title and Location */}
          <div>
            <h3 className="text-lg font-semibold text-gray-900 dark:text-white line-clamp-1">
              {building.name}
            </h3>
            <div className="flex items-center text-gray-600 dark:text-gray-400 text-sm mt-1">
              <MapPin className="h-4 w-4 mr-1 flex-shrink-0" />
              <span className="line-clamp-1">{building.address}</span>
            </div>
          </div>

          {/* Description */}
          <p className="text-gray-600 dark:text-gray-400 text-sm line-clamp-2">
            {building.description}
          </p>

          {/* Stats */}
          <div className="flex items-center justify-between text-sm">
            <div className="flex items-center text-green-600 dark:text-green-400">
              <DollarSign className="h-4 w-4 mr-1" />
              <span className="font-semibold">{building.averagePrice.toLocaleString()}đ/tháng</span>
            </div>
            <div className="flex items-center text-blue-600 dark:text-blue-400">
              <Users className="h-4 w-4 mr-1" />
              <span>{building.totalRooms} phòng</span>
            </div>
          </div>

          {/* Amenities */}
          <div className="flex flex-wrap gap-1">
            {building.amenities.slice(0, 3).map((amenity) => (
              <span
                key={amenity}
                className="px-2 py-1 bg-gray-100 dark:bg-gray-700 text-gray-700 dark:text-gray-300 text-xs rounded-full"
              >
                {amenity}
              </span>
            ))}
            {building.amenities.length > 3 && (
              <span className="px-2 py-1 bg-gray-100 dark:bg-gray-700 text-gray-700 dark:text-gray-300 text-xs rounded-full">
                +{building.amenities.length - 3}
              </span>
            )}
          </div>

          {/* Reviews */}
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-1">
              <Star className="h-4 w-4 text-yellow-500 fill-current" />
              <span className="text-sm font-medium text-gray-900 dark:text-white">
                {building.rating}
              </span>
              <span className="text-sm text-gray-600 dark:text-gray-400">
                ({building.totalReviews} đánh giá)
              </span>
            </div>
          </div>
        </div>

        {/* Action Button */}
        <div className="mt-6">
          <Link
            href={`/buildings/${building.id}`}
            className="w-full bg-gradient-to-r from-blue-500 to-purple-600 text-white py-2 px-4 rounded-lg font-medium hover:from-blue-600 hover:to-purple-700 transition-all duration-200 shadow-md hover:shadow-lg flex items-center justify-center space-x-2"
            onClick={(e) => {
              e.stopPropagation()
              onSelect(building.id)
            }}
          >
            <Eye className="h-4 w-4" />
            <span>Xem chi tiết</span>
          </Link>
        </div>
      </div>
    </div>
  )
}

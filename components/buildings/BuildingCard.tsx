'use client'

import Link from 'next/link'
import Image from 'next/image'
import { Star, MapPin, Users, DollarSign, Eye } from 'lucide-react'
import { Building } from '@/types'
import { cn } from '@/lib/utils'

interface BuildingCardProps {
  building: Building
  onSelect?: (buildingId: string) => void
  isSelected?: boolean
}

export default function BuildingCard({ building, onSelect, isSelected }: BuildingCardProps) {
  const handleClick = () => {
    if (onSelect) {
      onSelect(building.id)
    }
  }

  return (
    <div
      className={cn(
        'bg-white dark:bg-gray-800 rounded-2xl shadow-md hover:shadow-xl transition-all duration-300 overflow-hidden group',
        isSelected && 'ring-2 ring-blue-500 shadow-xl',
        onSelect && 'cursor-pointer'
      )}
      onClick={handleClick}
    >
      {/* Image */}
      <div className="relative h-48 overflow-hidden">
        <Image
          src={building.images || '/placeholder-building.jpg'}
          alt={building.name}
          fill
          className="object-cover group-hover:scale-105 transition-transform duration-300"
          sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
        />
        {/* <div className="absolute top-4 right-4">
          <div className="bg-white/90 dark:bg-gray-800/90 backdrop-blur-sm px-2.5 py-1.5 rounded-full shadow-md">
            <div className="flex items-center space-x-1">
              <Star className="h-4 w-4 text-yellow-500 fill-current" />
              <span className="text-sm font-semibold text-gray-900 dark:text-white">
                {building.rating.toFixed(1)}
              </span>
            </div>
          </div>
        </div> */}
        {building.availableRooms > 0 && (
          <div className="absolute bottom-4 left-4">
            <div className="bg-green-500 text-white px-3 py-1.5 rounded-full text-xs font-medium shadow-md">
              {building.availableRooms} phòng trống
            </div>
          </div>
        )}
      </div>

      {/* Content */}
      <div className="p-6">
        <div className="space-y-4">
          {/* Title and Location */}
          <div>
            <h3 className="text-lg font-semibold text-gray-900 dark:text-white line-clamp-1 mb-1.5">
              {building.name}
            </h3>
            <div className="flex items-start text-gray-600 dark:text-gray-400 text-sm">
              <MapPin className="h-4 w-4 mr-1.5 flex-shrink-0 mt-0.5" />
              <span className="line-clamp-2">{building.address}</span>
            </div>
          </div>

          {/* Description */}
          {building.description && (
            <p className="text-gray-600 dark:text-gray-400 text-sm line-clamp-2">
              {building.description}
            </p>
          )}

          {/* Stats */}
          <div className="flex items-center justify-between text-sm pt-2 border-t border-gray-200 dark:border-gray-700">
            <div className="flex items-center text-green-600 dark:text-green-400">
              <DollarSign className="h-4 w-4 mr-1" />
              <span className="font-semibold">{building?.averagePrice?.toLocaleString('vi-VN', { style: 'currency', currency: 'VND' })}/tháng</span>
            </div>
            <div className="flex items-center text-blue-600 dark:text-blue-400">
              <Users className="h-4 w-4 mr-1" />
              <span>{building.totalRooms} phòng</span>
            </div>
          </div>

          {/* Amenities */}
          {building.amenities && building.amenities.length > 0 && (
            <div className="flex flex-wrap gap-1.5">
              {building.amenities.slice(0, 3).map((amenity, index) => (
                <span
                  key={index}
                  className="px-2.5 py-1 bg-gray-100 dark:bg-gray-700 text-gray-700 dark:text-gray-300 text-xs rounded-full"
                >
                  {amenity}
                </span>
              ))}
              {building.amenities.length > 3 && (
                <span className="px-2.5 py-1 bg-gray-100 dark:bg-gray-700 text-gray-700 dark:text-gray-300 text-xs rounded-full">
                  +{building.amenities.length - 3}
                </span>
              )}
            </div>
          )}

          {/* Reviews */}
          {/* {building.totalReviews > 0 && (
            <div className="flex items-center space-x-1 text-sm">
              <Star className="h-4 w-4 text-yellow-500 fill-current" />
              <span className="font-medium text-gray-900 dark:text-white">
                {building.rating?.toFixed(1)}
              </span>
              <span className="text-gray-600 dark:text-gray-400">
                ({building.totalReviews} đánh giá)
              </span>
            </div>
          )} */}
        </div>

        {/* Action Button */}
        <div className="mt-6">
          <Link
            href={`/buildings/${building.id}`}
            className="w-full bg-gradient-to-r from-blue-500 to-purple-600 text-white py-2.5 px-4 rounded-lg font-medium hover:from-blue-600 hover:to-purple-700 transition-all duration-200 shadow-md hover:shadow-lg flex items-center justify-center space-x-2"
            onClick={(e) => {
              e.stopPropagation()
              if (onSelect) {
                onSelect(building.id)
              }
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

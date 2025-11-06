'use client'

import Link from 'next/link'
import Image from 'next/image'
import { Star, MapPin, Users, DollarSign, Eye } from 'lucide-react'
import { Building } from '@/types'

interface BuildingCardProps {
  building: Building
}

export default function BuildingCard({ building }: BuildingCardProps) {
  return (
    <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-lg hover:shadow-xl transition-all duration-300 overflow-hidden group">
      {/* Image */}
      <div className="relative h-48 overflow-hidden">
        <Image
          src={building.imageUrl}
          alt={building.name}
          fill
          className="object-cover group-hover:scale-105 transition-transform duration-300"
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
          >
            <Eye className="h-4 w-4" />
            <span>Xem chi tiết</span>
          </Link>
        </div>
      </div>
    </div>
  )
}

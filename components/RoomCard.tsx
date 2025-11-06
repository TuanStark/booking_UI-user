'use client'

import Link from 'next/link'
import Image from 'next/image'
import { Star, Eye } from 'lucide-react'
import { cn } from '@/lib/utils'
import { Room } from '@/types'

interface RoomCardProps {
  room: Room
  viewMode: 'grid' | 'list'
  onSelect?: (roomId: string) => void
  isSelected?: boolean
}

export default function RoomCard({ room, viewMode, onSelect, isSelected = false }: RoomCardProps) {
  const handleClick = () => {
    if (onSelect) {
      onSelect(room.id)
    }
  }

  if (viewMode === 'list') {
    return (
      <div 
        className={cn(
          'bg-white dark:bg-gray-800 rounded-2xl shadow-lg hover:shadow-xl transition-all duration-300 overflow-hidden group cursor-pointer',
          isSelected && 'ring-2 ring-blue-500 shadow-xl'
        )}
        onClick={handleClick}
      >
        <div className="flex">
          {/* Image */}
          <div className="w-48 h-32 flex-shrink-0">
          <Image
            src={room?.images?.[0] || 'https://images.unsplash.com/photo-1586023492125-27b2c045efd7?ixlib=rb-4.0.3&auto=format&fit=crop&w=400&q=80'}
            alt={room?.roomNumber || 'Room'}
            width={192}
            height={128}
            className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
          />
          </div>

          {/* Content */}
          <div className="flex-1 p-6">
            <div className="flex items-start justify-between mb-4">
              <div>
                <h3 className="text-xl font-semibold text-gray-900 dark:text-white mb-1">
                  Phòng {room?.roomNumber || 'N/A'}
                </h3>
                <p className="text-gray-600 dark:text-gray-400 text-sm">
                  {room?.type || 'N/A'} • {room?.size || 'N/A'} • {room?.capacity || 'N/A'}
                </p>
              </div>
              <div className="text-right">
                <div className="text-2xl font-bold text-green-600 dark:text-green-400">
                  {room?.price?.toLocaleString() || '0'}đ/tháng
                </div>
                <div className="flex items-center text-sm text-gray-600 dark:text-gray-400">
                  <Star className="h-4 w-4 text-yellow-500 fill-current mr-1" />
                  <span>{room?.rating || 0}</span>
                  <span className="ml-2">({room?.reviews || 0} đánh giá)</span>
                </div>
              </div>
            </div>

            <p className="text-gray-600 dark:text-gray-400 text-sm mb-4 line-clamp-2">
              {room?.description || 'Không có mô tả'}
            </p>

            <div className="flex items-center justify-between">
              <div className="flex items-center space-x-4 text-sm text-gray-600 dark:text-gray-400">
                <span>Tầng {room?.floor || 'N/A'}</span>
                <span>{room?.window || 'N/A'}</span>
                <span className={cn(
                  'px-2 py-1 rounded-full text-xs font-medium',
                  room?.available 
                    ? 'bg-green-100 dark:bg-green-900 text-green-800 dark:text-green-200'
                    : 'bg-red-100 dark:bg-red-900 text-red-800 dark:text-red-200'
                )}>
                  {room?.available ? 'Còn trống' : 'Đã thuê'}
                </span>
              </div>
              <Link
                href={`/rooms/${room?.id || '#'}`}
                className="flex items-center px-4 py-2 bg-gradient-to-r from-blue-500 to-purple-600 text-white rounded-lg font-medium hover:from-blue-600 hover:to-purple-700 transition-all duration-200 shadow-md hover:shadow-lg"
                onClick={(e) => e.stopPropagation()}
              >
                <Eye className="h-4 w-4 mr-2" />
                Xem chi tiết
              </Link>
            </div>
          </div>
        </div>
      </div>
    )
  }

  // Grid view
  return (
    <div 
      className={cn(
        'bg-white dark:bg-gray-800 rounded-2xl shadow-lg hover:shadow-xl transition-all duration-300 overflow-hidden group cursor-pointer',
        isSelected && 'ring-2 ring-blue-500 shadow-xl'
      )}
      onClick={handleClick}
    >
      {/* Image */}
      <div className="relative h-48 overflow-hidden">
        <Image
          src={room?.images?.[0] || 'https://images.unsplash.com/photo-1586023492125-27b2c045efd7?ixlib=rb-4.0.3&auto=format&fit=crop&w=400&q=80'}
          alt={room?.roomNumber || 'Room'}
          fill
          className="object-cover group-hover:scale-105 transition-transform duration-300"
        />
        <div className="absolute top-4 right-4">
          <div className={cn(
            'px-2 py-1 rounded-full text-xs font-medium',
            room?.available 
              ? 'bg-green-500 text-white'
              : 'bg-red-500 text-white'
          )}>
            {room?.available ? 'Còn trống' : 'Đã thuê'}
          </div>
        </div>
        <div className="absolute bottom-4 left-4">
          <div className="bg-white dark:bg-gray-800 px-2 py-1 rounded-full shadow-md">
            <div className="flex items-center space-x-1">
              <Star className="h-3 w-3 text-yellow-500 fill-current" />
              <span className="text-xs font-semibold text-gray-900 dark:text-white">
                {room?.rating || 0}
              </span>
            </div>
          </div>
        </div>
      </div>

      {/* Content */}
      <div className="p-6">
        <div className="space-y-3">
          {/* Title and Type */}
          <div>
            <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-1">
              Phòng {room?.roomNumber || 'N/A'}
            </h3>
            <p className="text-gray-600 dark:text-gray-400 text-sm">
              {room?.type || 'N/A'} • {room?.size || 'N/A'} • {room?.capacity || 'N/A'}
            </p>
          </div>

          {/* Description */}
          <p className="text-gray-600 dark:text-gray-400 text-sm line-clamp-2">
            {room?.description || 'Không có mô tả'}
          </p>

          {/* Price and Rating */}
          <div className="flex items-center justify-between">
            <div className="text-xl font-bold text-green-600 dark:text-green-400">
              {room?.price?.toLocaleString() || '0'}đ/tháng
            </div>
            <div className="flex items-center text-sm text-gray-600 dark:text-gray-400">
              <Star className="h-4 w-4 text-yellow-500 fill-current mr-1" />
              <span>{room?.rating || 0}</span>
            </div>
          </div>

          {/* Room Info */}
          <div className="flex items-center justify-between text-sm text-gray-600 dark:text-gray-400">
            <span>Tầng {room?.floor || 'N/A'}</span>
            <span>{room?.window || 'N/A'}</span>
          </div>
        </div>

        {/* Action Button */}
        <div className="mt-6">
          <Link
            href={`/rooms/${room?.id || '#'}`}
            className="w-full bg-gradient-to-r from-blue-500 to-purple-600 text-white py-2 px-4 rounded-lg font-medium hover:from-blue-600 hover:to-purple-700 transition-all duration-200 shadow-md hover:shadow-lg flex items-center justify-center space-x-2"
            onClick={(e) => e.stopPropagation()}
          >
            <Eye className="h-4 w-4" />
            <span>Xem chi tiết</span>
          </Link>
        </div>
      </div>
    </div>
  )
}
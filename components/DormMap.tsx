'use client'

import { useMemo, useState, useEffect } from 'react'
import { GoogleMap, Marker, InfoWindow, useLoadScript } from '@react-google-maps/api'
import { MapPin, DollarSign, Users } from 'lucide-react'
import { cn } from '@/lib/utils'
import { Building } from '@/types'

interface DormMapProps {
  dorms: Building[]
  selectedDormId?: string
  onDormSelect?: (dormId: string) => void
  className?: string
}

// Google Maps API Key - cần được set trong .env.local
const GOOGLE_MAPS_API_KEY = process.env.NEXT_PUBLIC_GOOGLE_MAPS_API_KEY

const mapContainerStyle = {
  width: '100%',
  height: '100%',
}

const defaultCenter = {
  lat: 10.7769, // Ho Chi Minh City coordinates
  lng: 106.7009,
}

const defaultOptions = {
  disableDefaultUI: false,
  zoomControl: true,
  streetViewControl: false,
  mapTypeControl: false,
  fullscreenControl: true,
  styles: [
    {
      featureType: 'poi',
      elementType: 'labels',
      stylers: [{ visibility: 'off' }]
    }
  ]
}

export default function DormMap({ dorms, selectedDormId, onDormSelect, className }: DormMapProps) {
  const [selectedMarker, setSelectedMarker] = useState<string | null>(null)
  const [map, setMap] = useState<google.maps.Map | null>(null)

  const { isLoaded, loadError } = useLoadScript({
    googleMapsApiKey: GOOGLE_MAPS_API_KEY || '',
    libraries: ['places'],
    language: 'vi',
    region: 'VN'
  })

  const markers = useMemo(() => {
    return dorms.map((dorm) => ({
      id: dorm.id,
      position: { lat: dorm.latitude, lng: dorm.longitude },
      dorm,
    }))
  }, [dorms])

  const handleMarkerClick = (dormId: string) => {
    setSelectedMarker(dormId)
    onDormSelect?.(dormId)
  }

  const handleMapClick = () => {
    setSelectedMarker(null)
  }

  // Focus map on selected dorm
  useEffect(() => {
    if (selectedDormId && map) {
      const selectedDorm = dorms.find(dorm => dorm.id === selectedDormId)
      if (selectedDorm) {
        map.panTo({ lat: selectedDorm.latitude, lng: selectedDorm.longitude })
        map.setZoom(16)
      }
    }
  }, [selectedDormId, map, dorms])

  // Check if API key is missing
  if (!GOOGLE_MAPS_API_KEY) {
    return (
      <div className={cn('flex items-center justify-center bg-gray-100 dark:bg-gray-800 rounded-2xl', className)}>
        <div className="text-center p-8">
          <MapPin className="h-12 w-12 text-gray-400 mx-auto mb-4" />
          <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-2">
            Google Maps API Key Required
          </h3>
          <p className="text-gray-600 dark:text-gray-400 mb-4">
            Vui lòng thêm Google Maps API key vào file .env.local
          </p>
          <div className="bg-gray-50 dark:bg-gray-700 rounded-lg p-4 text-left">
            <p className="text-sm text-gray-600 dark:text-gray-400 mb-2">
              Thêm vào file .env.local:
            </p>
            <code className="text-xs text-blue-600 dark:text-blue-400">
              NEXT_PUBLIC_GOOGLE_MAPS_API_KEY=your-api-key-here
            </code>
          </div>
        </div>
      </div>
    )
  }

  if (loadError) {
    return (
      <div className={cn('flex items-center justify-center bg-gray-100 dark:bg-gray-800 rounded-2xl', className)}>
        <div className="text-center p-8">
          <MapPin className="h-12 w-12 text-gray-400 mx-auto mb-4" />
          <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-2">
            Lỗi tải Google Maps
          </h3>
          <p className="text-gray-600 dark:text-gray-400">
            Không thể tải bản đồ. Vui lòng kiểm tra API key và kết nối internet.
          </p>
        </div>
      </div>
    )
  }

  if (!isLoaded) {
    return (
      <div className={cn('flex items-center justify-center bg-gray-100 dark:bg-gray-800 rounded-2xl', className)}>
        <div className="text-center p-8">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600 mx-auto mb-4"></div>
          <p className="text-gray-600 dark:text-gray-400">Đang tải bản đồ...</p>
        </div>
      </div>
    )
  }

  return (
    <div className={cn('relative rounded-2xl overflow-hidden shadow-lg', className)}>
      <GoogleMap
        mapContainerStyle={mapContainerStyle}
        center={defaultCenter}
        zoom={13}
        options={defaultOptions}
        onLoad={setMap}
        onClick={handleMapClick}
      >
        {markers.map((marker) => (
          <Marker
            key={marker.id}
            position={marker.position}
            onClick={() => handleMarkerClick(marker.id)}
            icon={{
              url: `data:image/svg+xml;charset=UTF-8,${encodeURIComponent(`
                <svg width="40" height="40" viewBox="0 0 40 40" fill="none" xmlns="http://www.w3.org/2000/svg">
                  <circle cx="20" cy="20" r="18" fill="${selectedMarker === marker.id ? '#3B82F6' : '#8B5CF6'}" stroke="white" stroke-width="2"/>
                  <path d="M20 8C15.6 8 12 11.6 12 16C12 22 20 32 20 32C20 32 28 22 28 16C28 11.6 24.4 8 20 8Z" fill="white"/>
                  <circle cx="20" cy="16" r="4" fill="${selectedMarker === marker.id ? '#3B82F6' : '#8B5CF6'}"/>
                </svg>
              `)}`,
              scaledSize: new google.maps.Size(40, 40),
              anchor: new google.maps.Point(20, 20),
            }}
          />
        ))}

        {selectedMarker && (
          <InfoWindow
            position={markers.find(m => m.id === selectedMarker)?.position}
            onCloseClick={() => setSelectedMarker(null)}
          >
            <div className="p-4 max-w-xs">
              {(() => {
                const dorm = markers.find(m => m.id === selectedMarker)?.dorm
                if (!dorm) return null
                
                return (
                  <div className="space-y-3">
                    <div>
                      <h3 className="font-semibold text-gray-900 text-sm">{dorm.name}</h3>
                      <p className="text-xs text-gray-600 mt-1">{dorm.address}</p>
                    </div>
                    
                    <div className="flex items-center justify-between text-xs">
                      <div className="flex items-center text-green-600">
                        <DollarSign className="h-3 w-3 mr-1" />
                        <span className="font-medium">${dorm.averagePrice}/tháng</span>
                      </div>
                      <div className="flex items-center text-blue-600">
                        <Users className="h-3 w-3 mr-1" />
                        <span>{dorm.availableRooms} phòng</span>
                      </div>
                    </div>
                    
                    <button
                      onClick={() => onDormSelect?.(dorm.id)}
                      className="w-full bg-blue-500 text-white text-xs py-1 px-2 rounded hover:bg-blue-600 transition-colors duration-200"
                    >
                      Xem chi tiết
                    </button>
                  </div>
                )
              })()}
            </div>
          </InfoWindow>
        )}
      </GoogleMap>

      {/* Map Controls */}
      <div className="absolute top-4 right-4 bg-white dark:bg-gray-800 rounded-lg shadow-lg p-2">
        <div className="text-xs text-gray-600 dark:text-gray-400">
          {dorms.length} ký túc xá
        </div>
      </div>
    </div>
  )
}

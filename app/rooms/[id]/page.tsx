'use client'

import { useState, useEffect } from 'react'
import { useParams } from 'next/navigation'
import Link from 'next/link'
import { useRequireAuth } from '@/hooks/useAuth'
import Image from 'next/image'
import { 
  ArrowLeft, 
  MapPin, 
  Users, 
  Bed, 
  Bath, 
  Square, 
  Wifi, 
  Car, 
  Utensils,
  Shield,
  Clock,
  Star,
  Calendar,
  DollarSign,
  CheckCircle,
  XCircle,
  ChevronLeft,
  ChevronRight,
  Heart,
  Share2,
  Phone,
  MessageCircle
} from 'lucide-react'
import Navbar from '@/components/Navbar'
import Footer from '@/components/Footer'
import BookingModal from '@/components/BookingModal'
import { cn } from '@/lib/utils'
import { MockDataService } from '@/services/mockDataService'
import { Room, BookingFormData } from '@/types'

export default function RoomDetailPage() {
  const params = useParams()
  const roomId = params.id as string
  
  // Require authentication for room booking
  const { isLoading: authLoading, isAuthenticated } = useRequireAuth()
  
  const [room, setRoom] = useState<Room | null>(null)
  const [building, setBuilding] = useState<any>(null)
  const [currentImageIndex, setCurrentImageIndex] = useState(0)
  const [isBookingModalOpen, setIsBookingModalOpen] = useState(false)
  const [isLoading, setIsLoading] = useState(true)

  useEffect(() => {
    const fetchRoomData = async () => {
      try {
        setIsLoading(true)
        const roomData = MockDataService.getRoomById(roomId)
        if (roomData) {
          setRoom(roomData)
          const buildingData = MockDataService.getBuildingById(roomData.buildingId)
          setBuilding(buildingData)
        }
      } catch (error) {
        console.error('Error fetching room data:', error)
      } finally {
        setIsLoading(false)
      }
    }

    fetchRoomData()
  }, [roomId])

  const handleBookingSubmit = (bookingData: BookingFormData) => {
    console.log('Booking submitted:', bookingData)
    // Handle booking submission here
    setIsBookingModalOpen(false)
    // Show success message or redirect
  }

  const nextImage = () => {
    if (room && currentImageIndex < room.images.length - 1) {
      setCurrentImageIndex(currentImageIndex + 1)
    }
  }

  const prevImage = () => {
    if (currentImageIndex > 0) {
      setCurrentImageIndex(currentImageIndex - 1)
    }
  }

  // Show loading while checking authentication
  if (authLoading) {
    return (
      <div className="min-h-screen bg-gray-50 dark:bg-gray-900">
        <Navbar />
        <div className="pt-20 flex items-center justify-center min-h-screen">
          <div className="text-center">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-500 mx-auto mb-4"></div>
            <p className="text-gray-600 dark:text-gray-400">Đang kiểm tra quyền truy cập...</p>
          </div>
        </div>
        <Footer />
      </div>
    )
  }

  // If not authenticated, the hook will redirect to login
  if (!isAuthenticated) {
    return null
  }

  if (!room || !building) {
    return (
      <div className="min-h-screen bg-gray-50 dark:bg-gray-900">
        <Navbar />
        <div className="pt-20 flex items-center justify-center min-h-screen">
          <div className="text-center">
            <Bed className="h-16 w-16 text-gray-400 mx-auto mb-4" />
            <h1 className="text-2xl font-bold text-gray-900 dark:text-white mb-2">
              Không tìm thấy phòng
            </h1>
            <p className="text-gray-600 dark:text-gray-400 mb-6">
              Phòng bạn đang tìm kiếm không tồn tại
            </p>
            <Link href="/buildings" className="btn-primary">
              Quay lại danh sách tòa nhà
            </Link>
          </div>
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
              <Link 
                href={`/buildings/${building.id}/rooms`} 
                className="text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-300"
              >
                {building.name}
              </Link>
              <span className="text-gray-400">/</span>
              <span className="text-gray-900 dark:text-white font-medium">Phòng {room.roomNumber}</span>
            </nav>
          </div>
        </div>

        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            {/* Main Content */}
            <div className="lg:col-span-2 space-y-8">
              {/* Image Gallery */}
              <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-lg overflow-hidden">
                <div className="relative h-96 lg:h-[500px]">
                  <Image
                    src={room.images[currentImageIndex]}
                    alt={`Phòng ${room.roomNumber} - Ảnh ${currentImageIndex + 1}`}
                    fill
                    className="object-cover"
                    priority
                  />
                  
                  {/* Navigation Arrows */}
                  {room.images.length > 1 && (
                    <>
                      <button
                        onClick={prevImage}
                        disabled={currentImageIndex === 0}
                        className="absolute left-4 top-1/2 transform -translate-y-1/2 bg-white/80 dark:bg-gray-800/80 hover:bg-white dark:hover:bg-gray-800 rounded-full p-2 shadow-lg transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed"
                      >
                        <ChevronLeft className="h-6 w-6 text-gray-700 dark:text-gray-300" />
                      </button>
                      <button
                        onClick={nextImage}
                        disabled={currentImageIndex === room.images.length - 1}
                        className="absolute right-4 top-1/2 transform -translate-y-1/2 bg-white/80 dark:bg-gray-800/80 hover:bg-white dark:hover:bg-gray-800 rounded-full p-2 shadow-lg transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed"
                      >
                        <ChevronRight className="h-6 w-6 text-gray-700 dark:text-gray-300" />
                      </button>
                    </>
                  )}

                  {/* Image Counter */}
                  <div className="absolute bottom-4 right-4 bg-black/50 text-white px-3 py-1 rounded-full text-sm">
                    {currentImageIndex + 1} / {room.images.length}
                  </div>

                  {/* Action Buttons */}
                  <div className="absolute top-4 right-4 flex space-x-2">
                    <button className="bg-white/80 dark:bg-gray-800/80 hover:bg-white dark:hover:bg-gray-800 rounded-full p-2 shadow-lg transition-all duration-200">
                      <Heart className="h-5 w-5 text-gray-700 dark:text-gray-300" />
                    </button>
                    <button className="bg-white/80 dark:bg-gray-800/80 hover:bg-white dark:hover:bg-gray-800 rounded-full p-2 shadow-lg transition-all duration-200">
                      <Share2 className="h-5 w-5 text-gray-700 dark:text-gray-300" />
                    </button>
                  </div>
                </div>

                {/* Thumbnail Gallery */}
                {room.images.length > 1 && (
                  <div className="p-4">
                    <div className="flex space-x-2 overflow-x-auto">
                      {room.images.map((image, index) => (
                        <button
                          key={index}
                          onClick={() => setCurrentImageIndex(index)}
                          className={cn(
                            'flex-shrink-0 w-20 h-20 rounded-lg overflow-hidden border-2 transition-all duration-200',
                            currentImageIndex === index
                              ? 'border-blue-500'
                              : 'border-gray-200 dark:border-gray-600 hover:border-gray-300 dark:hover:border-gray-500'
                          )}
                        >
                          <Image
                            src={image}
                            alt={`Thumbnail ${index + 1}`}
                            width={80}
                            height={80}
                            className="w-full h-full object-cover"
                          />
                        </button>
                      ))}
                    </div>
                  </div>
                )}
              </div>

              {/* Room Details */}
              <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-lg p-8">
                <div className="flex items-start justify-between mb-6">
                  <div>
                    <h1 className="text-3xl font-bold text-gray-900 dark:text-white mb-2">
                      Phòng {room.roomNumber}
                    </h1>
                    <div className="flex items-center text-gray-600 dark:text-gray-400 mb-4">
                      <MapPin className="h-5 w-5 mr-2" />
                      <span>{building.name} • {building.address}</span>
                    </div>
                    <div className="flex items-center space-x-4">
                      <div className="flex items-center text-yellow-500">
                        <Star className="h-5 w-5 fill-current mr-1" />
                        <span className="font-semibold text-gray-900 dark:text-white">
                          {room.rating}
                        </span>
                        <span className="text-gray-600 dark:text-gray-400 ml-1">
                          ({room.reviews} đánh giá)
                        </span>
                      </div>
                      <div className={cn(
                        'px-3 py-1 rounded-full text-sm font-medium',
                        room.available 
                          ? 'bg-green-100 dark:bg-green-900 text-green-800 dark:text-green-200'
                          : 'bg-red-100 dark:bg-red-900 text-red-800 dark:text-red-200'
                      )}>
                        {room.available ? 'Còn trống' : 'Đã thuê'}
                      </div>
                    </div>
                  </div>
                </div>

                <div className="prose prose-gray dark:prose-invert max-w-none">
                  <p className="text-lg text-gray-600 dark:text-gray-400 leading-relaxed">
                    {room.description}
                  </p>
                </div>
              </div>

              {/* Room Specifications */}
              <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-lg p-8">
                <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-6">
                  Thông số phòng
                </h2>
                
                <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
                  <div className="text-center">
                    <div className="w-12 h-12 bg-blue-100 dark:bg-blue-900 rounded-xl flex items-center justify-center mx-auto mb-3">
                      <Square className="h-6 w-6 text-blue-600 dark:text-blue-400" />
                    </div>
                    <div className="text-sm text-gray-600 dark:text-gray-400">Diện tích</div>
                    <div className="font-semibold text-gray-900 dark:text-white">{room.size}</div>
                  </div>
                  
                  <div className="text-center">
                    <div className="w-12 h-12 bg-green-100 dark:bg-green-900 rounded-xl flex items-center justify-center mx-auto mb-3">
                      <Users className="h-6 w-6 text-green-600 dark:text-green-400" />
                    </div>
                    <div className="text-sm text-gray-600 dark:text-gray-400">Sức chứa</div>
                    <div className="font-semibold text-gray-900 dark:text-white">{room.capacity} người</div>
                  </div>
                  
                  <div className="text-center">
                    <div className="w-12 h-12 bg-purple-100 dark:bg-purple-900 rounded-xl flex items-center justify-center mx-auto mb-3">
                      <Bed className="h-6 w-6 text-purple-600 dark:text-purple-400" />
                    </div>
                    <div className="text-sm text-gray-600 dark:text-gray-400">Giường</div>
                    <div className="font-semibold text-gray-900 dark:text-white">{room.beds}</div>
                  </div>
                  
                  <div className="text-center">
                    <div className="w-12 h-12 bg-orange-100 dark:bg-orange-900 rounded-xl flex items-center justify-center mx-auto mb-3">
                      <Bath className="h-6 w-6 text-orange-600 dark:text-orange-400" />
                    </div>
                    <div className="text-sm text-gray-600 dark:text-gray-400">Phòng tắm</div>
                    <div className="font-semibold text-gray-900 dark:text-white">{room.bathrooms}</div>
                  </div>
                </div>

                <div className="mt-8 grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div>
                    <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-3">
                      Thông tin bổ sung
                    </h3>
                    <div className="space-y-2">
                      <div className="flex items-center justify-between">
                        <span className="text-gray-600 dark:text-gray-400">Tầng</span>
                        <span className="font-medium text-gray-900 dark:text-white">{room.floor}</span>
                      </div>
                      <div className="flex items-center justify-between">
                        <span className="text-gray-600 dark:text-gray-400">Cửa sổ</span>
                        <span className="font-medium text-gray-900 dark:text-white">{room.window}</span>
                      </div>
                      <div className="flex items-center justify-between">
                        <span className="text-gray-600 dark:text-gray-400">Loại phòng</span>
                        <span className="font-medium text-gray-900 dark:text-white">{room.type}</span>
                      </div>
                    </div>
                  </div>
                  
                  <div>
                    <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-3">
                      Tiện nghi
                    </h3>
                    <div className="grid grid-cols-2 gap-2">
                      {room.amenities.map((amenity, index) => (
                        <div key={index} className="flex items-center space-x-2">
                          <CheckCircle className="h-4 w-4 text-green-500" />
                          <span className="text-sm text-gray-600 dark:text-gray-400">{amenity}</span>
                        </div>
                      ))}
                    </div>
                  </div>
                </div>
              </div>

              {/* Reviews Section */}
              <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-lg p-8">
                <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-6">
                  Đánh giá từ sinh viên
                </h2>
                
                <div className="space-y-6">
                  {room.reviews > 0 ? (
                    // Mock reviews - in real app, fetch from API
                    <>
                      <div className="border-b border-gray-200 dark:border-gray-700 pb-6">
                        <div className="flex items-center space-x-4 mb-3">
                          <div className="w-10 h-10 bg-blue-500 rounded-full flex items-center justify-center text-white font-semibold">
                            A
                          </div>
                          <div>
                            <div className="font-semibold text-gray-900 dark:text-white">Anh Minh</div>
                            <div className="flex items-center space-x-1">
                              <Star className="h-4 w-4 text-yellow-500 fill-current" />
                              <Star className="h-4 w-4 text-yellow-500 fill-current" />
                              <Star className="h-4 w-4 text-yellow-500 fill-current" />
                              <Star className="h-4 w-4 text-yellow-500 fill-current" />
                              <Star className="h-4 w-4 text-yellow-500 fill-current" />
                              <span className="text-sm text-gray-600 dark:text-gray-400 ml-2">2 tuần trước</span>
                            </div>
                          </div>
                        </div>
                        <p className="text-gray-600 dark:text-gray-400">
                          Phòng rất đẹp và sạch sẽ, tiện nghi đầy đủ. Vị trí thuận tiện, gần trường học. 
                          Giá cả hợp lý so với chất lượng. Rất hài lòng!
                        </p>
                      </div>
                      
                      <div className="border-b border-gray-200 dark:border-gray-700 pb-6">
                        <div className="flex items-center space-x-4 mb-3">
                          <div className="w-10 h-10 bg-green-500 rounded-full flex items-center justify-center text-white font-semibold">
                            T
                          </div>
                          <div>
                            <div className="font-semibold text-gray-900 dark:text-white">Thu Hà</div>
                            <div className="flex items-center space-x-1">
                              <Star className="h-4 w-4 text-yellow-500 fill-current" />
                              <Star className="h-4 w-4 text-yellow-500 fill-current" />
                              <Star className="h-4 w-4 text-yellow-500 fill-current" />
                              <Star className="h-4 w-4 text-yellow-500 fill-current" />
                              <Star className="h-4 w-4 text-gray-300" />
                              <span className="text-sm text-gray-600 dark:text-gray-400 ml-2">1 tháng trước</span>
                            </div>
                          </div>
                        </div>
                        <p className="text-gray-600 dark:text-gray-400">
                          Phòng tốt, giá cả phải chăng. Chỉ có một chút ồn vào buổi tối nhưng không ảnh hưởng nhiều.
                        </p>
                      </div>
                    </>
                  ) : (
                    <div className="text-center py-8">
                      <Star className="h-12 w-12 text-gray-400 mx-auto mb-4" />
                      <p className="text-gray-600 dark:text-gray-400">
                        Chưa có đánh giá nào cho phòng này
                      </p>
                    </div>
                  )}
                </div>
              </div>
            </div>

            {/* Sidebar */}
            <div className="lg:col-span-1">
              <div className="sticky top-24 space-y-6">
                {/* Booking Card */}
                <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-lg p-6">
                  <div className="text-center mb-6">
                    <div className="text-3xl font-bold text-green-600 dark:text-green-400 mb-2">
                      {room.price.toLocaleString()}đ/tháng
                    </div>
                    <div className="text-sm text-gray-600 dark:text-gray-400">
                      Giá đã bao gồm điện nước
                    </div>
                  </div>

                  <div className="space-y-4 mb-6">
                    <div className="flex items-center justify-between">
                      <span className="text-gray-600 dark:text-gray-400">Trạng thái</span>
                      <div className={cn(
                        'flex items-center space-x-2',
                        room.available ? 'text-green-600 dark:text-green-400' : 'text-red-600 dark:text-red-400'
                      )}>
                        {room.available ? (
                          <>
                            <CheckCircle className="h-4 w-4" />
                            <span className="font-medium">Còn trống</span>
                          </>
                        ) : (
                          <>
                            <XCircle className="h-4 w-4" />
                            <span className="font-medium">Đã thuê</span>
                          </>
                        )}
                      </div>
                    </div>
                    
                    <div className="flex items-center justify-between">
                      <span className="text-gray-600 dark:text-gray-400">Đánh giá</span>
                      <div className="flex items-center space-x-1">
                        <Star className="h-4 w-4 text-yellow-500 fill-current" />
                        <span className="font-medium text-gray-900 dark:text-white">{room.rating}</span>
                        <span className="text-gray-600 dark:text-gray-400">({room.reviews})</span>
                      </div>
                    </div>
                  </div>

                  {room.available ? (
                    <button
                      onClick={() => setIsBookingModalOpen(true)}
                      className="w-full bg-gradient-to-r from-blue-500 to-purple-600 text-white py-3 px-4 rounded-xl font-semibold hover:from-blue-600 hover:to-purple-700 transition-all duration-200 shadow-lg hover:shadow-xl"
                    >
                      <Calendar className="h-5 w-5 inline mr-2" />
                      Đặt phòng ngay
                    </button>
                  ) : (
                    <div className="text-center py-3 px-4 bg-gray-100 dark:bg-gray-700 rounded-xl text-gray-600 dark:text-gray-400">
                      Phòng đã được thuê
                    </div>
                  )}

                  <div className="mt-4 pt-4 border-t border-gray-200 dark:border-gray-700">
                    <div className="flex space-x-2">
                      <button className="flex-1 flex items-center justify-center space-x-2 py-2 px-3 border border-gray-300 dark:border-gray-600 rounded-lg text-gray-700 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors duration-200">
                        <Phone className="h-4 w-4" />
                        <span className="text-sm">Gọi</span>
                      </button>
                      <button className="flex-1 flex items-center justify-center space-x-2 py-2 px-3 border border-gray-300 dark:border-gray-600 rounded-lg text-gray-700 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors duration-200">
                        <MessageCircle className="h-4 w-4" />
                        <span className="text-sm">Chat</span>
                      </button>
                    </div>
                  </div>
                </div>

                {/* Building Info */}
                <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-lg p-6">
                  <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">
                    Thông tin tòa nhà
                  </h3>
                  
                  <div className="space-y-3">
                    <div className="flex items-center space-x-3">
                      <MapPin className="h-5 w-5 text-gray-400" />
                      <span className="text-sm text-gray-600 dark:text-gray-400">
                        {building.address}
                      </span>
                    </div>
                    
                    <div className="flex items-center space-x-3">
                      <Users className="h-5 w-5 text-gray-400" />
                      <span className="text-sm text-gray-600 dark:text-gray-400">
                        {building.totalRooms} phòng
                      </span>
                    </div>
                    
                    <div className="flex items-center space-x-3">
                      <Star className="h-5 w-5 text-gray-400" />
                      <span className="text-sm text-gray-600 dark:text-gray-400">
                        Đánh giá {building.rating}/5
                      </span>
                    </div>
                  </div>
                  
                  <Link
                    href={`/buildings/${building.id}/rooms`}
                    className="mt-4 w-full bg-gray-100 dark:bg-gray-700 text-gray-900 dark:text-white py-2 px-4 rounded-lg font-medium hover:bg-gray-200 dark:hover:bg-gray-600 transition-colors duration-200 text-center block"
                  >
                    Xem tất cả phòng
                  </Link>
                </div>
              </div>
            </div>
          </div>
        </div>
      </main>

      {/* Booking Modal */}
      <BookingModal
        isOpen={isBookingModalOpen}
        onClose={() => setIsBookingModalOpen(false)}
        onSubmit={handleBookingSubmit}
        room={room}
        building={building}
      />

      <Footer />
    </div>
  )
}

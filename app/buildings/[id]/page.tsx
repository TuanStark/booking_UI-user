// This is a Server Component - no 'use client' directive
import { Metadata } from 'next'
import { notFound } from 'next/navigation'
import Link from 'next/link'
import { 
  ArrowLeft, 
  MapPin, 
  Star,
  Phone,
  Calendar
} from 'lucide-react'
import Navbar from '@/components/Navbar'
import Footer from '@/components/Footer'
import BuildingRoomsList from '@/components/buildings/BuildingRoomsList'
import BuildingImageCarousel from '@/components/buildings/BuildingImageCarousel'
import { BuildingService } from '@/services/buildingService'

interface BuildingDetailPageProps {
  params: Promise<{
    id: string
  }>
}

// Generate metadata for SEO
export async function generateMetadata({ params }: BuildingDetailPageProps): Promise<Metadata> {
  const { id } = await params
  console.log('id', id);
  const { building } = await BuildingService.getBuildingDetailWithRooms(id)
  console.log('building', building);
  if (!building) {
    return {
      title: 'Không tìm thấy tòa nhà',
    }
  }

  return {
    title: `${building.name} - Chi tiết tòa nhà ký túc xá | DormBooking`,
    description: building.description || `Thông tin chi tiết về ${building.name} - ${building.address}. ${building.totalRooms} phòng, ${building.availableRooms} phòng còn trống.`,
    keywords: `ký túc xá, ${building.name}, đặt phòng, sinh viên, ${building.address}`,
    openGraph: {
      title: `${building.name} - DormBooking`,
      description: building.description || `Thông tin chi tiết về ${building.name}`,
      images: [building.imageUrl],
      type: 'website',
    },
  }
}

export default async function BuildingDetailPage({ params }: BuildingDetailPageProps) {
  const { id } = await params
  const { building, rooms } = await BuildingService.getBuildingDetailWithRooms(id)

  if (!building) {
    notFound()
  }

  // Mock images cho building
  const buildingImages = [
    building.imageUrl,
    'https://images.unsplash.com/photo-1560448204-e02f11c3d0e2?ixlib=rb-4.0.3&auto=format&fit=crop&w=1200&q=80',
    'https://images.unsplash.com/photo-1545324418-cc1a3fa10c00?ixlib=rb-4.0.3&auto=format&fit=crop&w=1200&q=80',
    'https://images.unsplash.com/photo-1570129477492-45c003edd2be?ixlib=rb-4.0.3&auto=format&fit=crop&w=1200&q=80'
  ].filter(Boolean)

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
              <span className="text-gray-900 dark:text-white font-medium">{building.name}</span>
            </nav>
          </div>
        </div>

        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
            {/* Main Content */}
            <div className="lg:col-span-3 space-y-6">
              {/* Building Header */}
              <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-lg overflow-hidden">
                <div className="flex flex-col md:flex-row">
                  {/* Image */}
                  <div className="md:w-1/3">
                    <BuildingImageCarousel images={buildingImages} buildingName={building.name} />
                  </div>

                  {/* Building Info */}
                  <div className="md:w-2/3 p-6">
                    <div className="flex items-start justify-between mb-4">
                      <div>
                        <h1 className="text-2xl font-bold text-gray-900 dark:text-white mb-2">
                          {building.name}
                        </h1>
                        <div className="flex items-center text-gray-600 dark:text-gray-400 mb-3">
                          <MapPin className="h-4 w-4 mr-2" />
                          <span className="text-sm">{building.address}</span>
                        </div>
                        <div className="flex items-center space-x-4">
                          <div className="flex items-center text-yellow-500">
                            <Star className="h-4 w-4 fill-current mr-1" />
                            <span className="font-semibold text-gray-900 dark:text-white text-sm">
                              {building.rating}
                            </span>
                            <span className="text-gray-600 dark:text-gray-400 ml-1 text-sm">
                              ({building.totalReviews} đánh giá)
                            </span>
                          </div>
                        </div>
                      </div>
                      <Link
                        href="/buildings"
                        className="flex items-center text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:hover:text-white transition-colors duration-200 text-sm"
                      >
                        <ArrowLeft className="h-4 w-4 mr-1" />
                        Quay lại
                      </Link>
                    </div>

                    <p className="text-gray-600 dark:text-gray-400 text-sm leading-relaxed mb-4">
                      {building.description || 'Không có mô tả'}
                    </p>

                    {/* Stats */}
                    <div className="grid grid-cols-4 gap-3">
                      <div className="text-center">
                        <div className="text-lg font-bold text-blue-600 dark:text-blue-400">
                          {building.totalRooms}
                        </div>
                        <div className="text-xs text-gray-600 dark:text-gray-400">Tổng phòng</div>
                      </div>
                      <div className="text-center">
                        <div className="text-lg font-bold text-green-600 dark:text-green-400">
                          {building.availableRooms}
                        </div>
                        <div className="text-xs text-gray-600 dark:text-gray-400">Còn trống</div>
                      </div>
                      <div className="text-center">
                        <div className="text-lg font-bold text-purple-600 dark:text-purple-400">
                          {building.averagePrice.toLocaleString()}đ
                        </div>
                        <div className="text-xs text-gray-600 dark:text-gray-400">Giá TB</div>
                      </div>
                      <div className="text-center">
                        <div className="text-lg font-bold text-yellow-600 dark:text-yellow-400">
                          {building.rating}
                        </div>
                        <div className="text-xs text-gray-600 dark:text-gray-400">Đánh giá</div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>

              {/* Rooms Section - Client Component */}
              <BuildingRoomsList rooms={rooms} />
            </div>

            {/* Sidebar */}
            <div className="lg:col-span-1">
              <div className="sticky top-24 space-y-4">
                {/* Quick Actions */}
                <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-lg p-4">
                  <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-3">
                    Thao tác nhanh
                  </h3>
                  
                  <div className="space-y-2">
                    <a 
                      href={`tel:${building.contact?.phone || ''}`}
                      className="w-full bg-blue-500 hover:bg-blue-600 text-white py-2 px-4 rounded-lg font-medium transition-colors duration-200 flex items-center justify-center space-x-2"
                    >
                      <Phone className="h-4 w-4" />
                      <span>Gọi ngay</span>
                    </a>
                    
                    <button className="w-full border border-gray-300 dark:border-gray-600 text-gray-700 dark:text-gray-300 py-2 px-4 rounded-lg font-medium hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors duration-200 flex items-center justify-center space-x-2">
                      <Calendar className="h-4 w-4" />
                      <span>Đặt lịch tham quan</span>
                    </button>
                  </div>
                </div>

                {/* Building Summary */}
                <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-lg p-4">
                  <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-3">
                    Tóm tắt
                  </h3>
                  
                  <div className="space-y-2">
                    <div className="flex items-center justify-between">
                      <span className="text-sm text-gray-600 dark:text-gray-400">Tổng phòng</span>
                      <span className="font-semibold text-gray-900 dark:text-white">{building.totalRooms}</span>
                    </div>
                    <div className="flex items-center justify-between">
                      <span className="text-sm text-gray-600 dark:text-gray-400">Còn trống</span>
                      <span className="font-semibold text-green-600 dark:text-green-400">{building.availableRooms}</span>
                    </div>
                    <div className="flex items-center justify-between">
                      <span className="text-sm text-gray-600 dark:text-gray-400">Giá TB</span>
                      <span className="font-semibold text-gray-900 dark:text-white">{building.averagePrice.toLocaleString()}đ</span>
                    </div>
                    <div className="flex items-center justify-between">
                      <span className="text-sm text-gray-600 dark:text-gray-400">Đánh giá</span>
                      <span className="font-semibold text-yellow-500">{building.rating} ({building.totalReviews})</span>
                    </div>
                  </div>
                </div>

                {/* Map Placeholder */}
                <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-lg p-6">
                  <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">
                    Vị trí
                  </h3>
                  
                  <div className="h-48 bg-gray-200 dark:bg-gray-700 rounded-lg flex items-center justify-center">
                    <div className="text-center">
                      <MapPin className="h-8 w-8 text-gray-400 mx-auto mb-2" />
                      <p className="text-sm text-gray-600 dark:text-gray-400">Bản đồ sẽ được tích hợp</p>
                    </div>
                  </div>
                  
                  <p className="text-sm text-gray-600 dark:text-gray-400 mt-3">
                    {building.address}
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </main>

      <Footer />
    </div>
  )
}

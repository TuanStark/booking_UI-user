'use client'

import { useState, useEffect } from 'react'
import Link from 'next/link'
import Navbar from '@/components/Navbar'
import SearchBar from '@/components/SearchBar'
import BuildingCard from '@/components/BuildingCard'
import Footer from '@/components/Footer'
import { Building2, Users, Star, ArrowRight, MapPin, Wifi, Car, Utensils, Shield, Clock } from 'lucide-react'
import { BuildingService } from '@/services/backendService'
import { Building } from '@/types'

export default function Home() {
  const [featuredDorms, setFeaturedDorms] = useState<Building[]>([])
  const [isLoading, setIsLoading] = useState(true)

  useEffect(() => {
    const fetchFeaturedBuildings = async () => {
      try {
        const buildings = await BuildingService.getFeaturedBuildings(4)
        setFeaturedDorms(buildings)
      } catch (error) {
        console.error('Error fetching featured buildings:', error)
        // Fallback to empty array
        setFeaturedDorms([])
      } finally {
        setIsLoading(false)
      }
    }

    fetchFeaturedBuildings()
  }, [])
  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900">
      <Navbar />
      
      {/* Hero Section */}
      <section className="relative bg-gradient-to-br from-blue-600 via-purple-600 to-blue-800 text-white overflow-hidden">
        <div className="absolute inset-0 bg-black/20"></div>
        <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-24 lg:py-32">
          <div className="text-center">
            <h1 className="text-4xl md:text-6xl font-bold mb-6 animate-fade-in">
              Tìm Ký Túc Xá
              <span className="block text-transparent bg-clip-text bg-gradient-to-r from-yellow-400 to-orange-500">
                Hoàn Hảo
              </span>
            </h1>
            <p className="text-xl md:text-2xl mb-8 text-blue-100 max-w-3xl mx-auto animate-slide-up">
              Khám phá hàng ngàn ký túc xá chất lượng cao với giá cả phải chăng, 
              phù hợp cho sinh viên đại học
            </p>
            
            {/* Search Bar */}
            <div className="max-w-4xl mx-auto mb-12">
              <SearchBar />
            </div>

            {/* Stats */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-8 max-w-4xl mx-auto">
              <div className="text-center">
                <div className="text-4xl font-bold text-yellow-400 mb-2">500+</div>
                <div className="text-blue-100">Ký túc xá</div>
              </div>
              <div className="text-center">
                <div className="text-4xl font-bold text-yellow-400 mb-2">10K+</div>
                <div className="text-blue-100">Sinh viên</div>
              </div>
              <div className="text-center">
                <div className="text-4xl font-bold text-yellow-400 mb-2">4.8★</div>
                <div className="text-blue-100">Đánh giá</div>
              </div>
            </div>
          </div>
        </div>
        
        {/* Decorative Elements */}
        <div className="absolute top-20 left-10 w-20 h-20 bg-white/10 rounded-full animate-bounce-gentle"></div>
        <div className="absolute bottom-20 right-10 w-16 h-16 bg-white/10 rounded-full animate-bounce-gentle" style={{animationDelay: '1s'}}></div>
        <div className="absolute top-1/2 left-20 w-12 h-12 bg-white/10 rounded-full animate-bounce-gentle" style={{animationDelay: '2s'}}></div>
      </section>

      {/* Featured Dorms */}
      <section id="featured-dorms" className="py-20 bg-white dark:bg-gray-900">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-3xl md:text-4xl font-bold text-gray-900 dark:text-white mb-4">
              Ký Túc Xá Nổi Bật
            </h2>
            <p className="text-xl text-gray-600 dark:text-gray-400 max-w-2xl mx-auto">
              Khám phá những ký túc xá được đánh giá cao nhất với đầy đủ tiện nghi hiện đại
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8 mb-12">
            {isLoading ? (
              // Loading skeleton
              Array.from({ length: 4 }).map((_, index) => (
                <div key={index} className="bg-white dark:bg-gray-800 rounded-2xl shadow-lg overflow-hidden animate-pulse">
                  <div className="h-48 bg-gray-200 dark:bg-gray-700"></div>
                  <div className="p-6 space-y-3">
                    <div className="h-4 bg-gray-200 dark:bg-gray-700 rounded"></div>
                    <div className="h-3 bg-gray-200 dark:bg-gray-700 rounded w-3/4"></div>
                    <div className="h-3 bg-gray-200 dark:bg-gray-700 rounded w-1/2"></div>
                  </div>
                </div>
              ))
            ) : featuredDorms.length > 0 ? (
              featuredDorms.map((dorm) => (
                <BuildingCard key={dorm.id} building={dorm} />
              ))
            ) : (
              <div className="col-span-full text-center py-12">
                <Building2 className="h-16 w-16 text-gray-400 mx-auto mb-4" />
                <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-2">
                  Không có tòa nhà nào
                </h3>
                <p className="text-gray-600 dark:text-gray-400">
                  Hiện tại chưa có tòa nhà nào được hiển thị
                </p>
              </div>
            )}
          </div>

          <div className="text-center">
            <Link href="/buildings" className="inline-flex items-center px-8 py-4 bg-gradient-to-r from-blue-500 to-purple-600 text-white font-semibold rounded-xl hover:from-blue-600 hover:to-purple-700 transition-all duration-200 shadow-lg hover:shadow-xl">
              Xem tất cả tòa nhà
              <ArrowRight className="ml-2 h-5 w-5" />
            </Link>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className="py-20 bg-gray-50 dark:bg-gray-800">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-3xl md:text-4xl font-bold text-gray-900 dark:text-white mb-4">
              Tại Sao Chọn Chúng Tôi?
            </h2>
            <p className="text-xl text-gray-600 dark:text-gray-400 max-w-2xl mx-auto">
              Chúng tôi cam kết mang đến trải nghiệm đặt phòng tốt nhất cho sinh viên
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <div className="text-center p-8 bg-white dark:bg-gray-900 rounded-2xl shadow-lg hover:shadow-xl transition-all duration-300">
              <div className="w-16 h-16 bg-gradient-to-r from-blue-500 to-purple-600 rounded-2xl flex items-center justify-center mx-auto mb-6">
                <Building2 className="h-8 w-8 text-white" />
              </div>
              <h3 className="text-xl font-semibold text-gray-900 dark:text-white mb-4">
                Ký Túc Xá Chất Lượng
              </h3>
              <p className="text-gray-600 dark:text-gray-400">
                Hàng trăm ký túc xá được kiểm định chất lượng với đầy đủ tiện nghi hiện đại
              </p>
            </div>

            <div className="text-center p-8 bg-white dark:bg-gray-900 rounded-2xl shadow-lg hover:shadow-xl transition-all duration-300">
              <div className="w-16 h-16 bg-gradient-to-r from-green-500 to-blue-600 rounded-2xl flex items-center justify-center mx-auto mb-6">
                <Users className="h-8 w-8 text-white" />
              </div>
              <h3 className="text-xl font-semibold text-gray-900 dark:text-white mb-4">
                Hỗ Trợ 24/7
              </h3>
              <p className="text-gray-600 dark:text-gray-400">
                Đội ngũ hỗ trợ chuyên nghiệp luôn sẵn sàng giúp đỡ bạn mọi lúc, mọi nơi
              </p>
            </div>

            <div className="text-center p-8 bg-white dark:bg-gray-900 rounded-2xl shadow-lg hover:shadow-xl transition-all duration-300">
              <div className="w-16 h-16 bg-gradient-to-r from-yellow-500 to-orange-600 rounded-2xl flex items-center justify-center mx-auto mb-6">
                <Star className="h-8 w-8 text-white" />
              </div>
              <h3 className="text-xl font-semibold text-gray-900 dark:text-white mb-4">
                Đánh Giá Cao
              </h3>
              <p className="text-gray-600 dark:text-gray-400">
                Được đánh giá 4.8/5 sao bởi hàng nghìn sinh viên đã sử dụng dịch vụ
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Amenities Section */}
      <section className="py-20 bg-white dark:bg-gray-900">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-3xl md:text-4xl font-bold text-gray-900 dark:text-white mb-4">
              Tiện Nghi Đầy Đủ
            </h2>
            <p className="text-xl text-gray-600 dark:text-gray-400 max-w-2xl mx-auto">
              Tất cả các ký túc xá đều được trang bị đầy đủ tiện nghi hiện đại
            </p>
          </div>

          <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-6 gap-8">
            {[
              { icon: Wifi, name: 'WiFi Miễn Phí', color: 'from-blue-500 to-blue-600' },
              { icon: Car, name: 'Bãi Đỗ Xe', color: 'from-green-500 to-green-600' },
              { icon: Utensils, name: 'Căng Tin', color: 'from-orange-500 to-orange-600' },
              { icon: Shield, name: 'Bảo Vệ 24/7', color: 'from-red-500 to-red-600' },
              { icon: Clock, name: 'Giờ Giấc Linh Hoạt', color: 'from-purple-500 to-purple-600' },
              { icon: MapPin, name: 'Gần Trường', color: 'from-yellow-500 to-yellow-600' }
            ].map((amenity, index) => (
              <div key={index} className="text-center group">
                <div className={`w-16 h-16 bg-gradient-to-r ${amenity.color} rounded-2xl flex items-center justify-center mx-auto mb-4 group-hover:scale-110 transition-transform duration-300`}>
                  <amenity.icon className="h-8 w-8 text-white" />
                </div>
                <h3 className="text-sm font-semibold text-gray-900 dark:text-white">
                  {amenity.name}
                </h3>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-20 bg-gradient-to-r from-blue-600 to-purple-600 text-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h2 className="text-3xl md:text-4xl font-bold mb-6">
            Sẵn Sàng Tìm Ký Túc Xá?
          </h2>
          <p className="text-xl text-blue-100 mb-8 max-w-2xl mx-auto">
            Bắt đầu hành trình tìm kiếm ký túc xá lý tưởng ngay hôm nay
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Link href="/buildings" className="bg-white text-blue-600 px-8 py-4 rounded-xl font-semibold hover:bg-gray-100 transition-colors duration-200 shadow-lg">
              Khám Phá Ngay
            </Link>
            <Link href="/about" className="border-2 border-white text-white px-8 py-4 rounded-xl font-semibold hover:bg-white hover:text-blue-600 transition-all duration-200">
              Tìm Hiểu Thêm
            </Link>
          </div>
        </div>
      </section>

      <Footer />
    </div>
  )
}

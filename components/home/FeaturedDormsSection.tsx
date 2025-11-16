'use client'

import { useState, useEffect } from 'react'
import Link from 'next/link'
import { Building2, ArrowRight } from 'lucide-react'
import BuildingCard from '@/components/BuildingCard'
import { BuildingService } from '@/services/buildingService'
import { Building } from '@/types'

interface FeaturedDormsSectionProps {
  limit?: number
}

export default function FeaturedDormsSection({ limit = 4 }: FeaturedDormsSectionProps) {
  const [featuredDorms, setFeaturedDorms] = useState<Building[]>([])
  const [isLoading, setIsLoading] = useState(true)

  useEffect(() => {
    const fetchFeaturedBuildings = async () => {
      try {
        const buildings = await BuildingService.getFeaturedBuildings(limit)
        console.log("buildings", buildings)
        setFeaturedDorms(buildings)
      } catch (error) {
        console.error('Error fetching featured buildings:', error)
        setFeaturedDorms([])
      } finally {
        setIsLoading(false)
      }
    }

    fetchFeaturedBuildings()
  }, [limit])

  return (
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
            Array.from({ length: limit }).map((_, index) => (
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
          <Link 
            href="/buildings" 
            className="inline-flex items-center px-8 py-4 bg-gradient-to-r from-blue-500 to-purple-600 text-white font-semibold rounded-xl hover:from-blue-600 hover:to-purple-700 transition-all duration-200 shadow-lg hover:shadow-xl"
          >
            Xem tất cả tòa nhà
            <ArrowRight className="ml-2 h-5 w-5" />
          </Link>
        </div>
      </div>
    </section>
  )
}

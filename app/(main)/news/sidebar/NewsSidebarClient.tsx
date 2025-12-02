// src/app/(main)/news/sidebar/NewsSidebarClient.tsx
'use client'

import Link from 'next/link'
import Image from 'next/image'
import { Search } from 'lucide-react'

import { useState } from 'react'
import { NewsSidebarData } from '@/types/post'
import { formatDate } from '@/utils/utils'

interface Props {
  initialData: NewsSidebarData | null // Cho phép null khi lỗi
}

export default function NewsSidebarClient({ initialData }: Props) {
  const [activeSlug, setActiveSlug] = useState('all')

  // Defensive: nếu data lỗi → fallback an toàn
  const categories = initialData?.categories ?? []
  const recentPosts = initialData?.recentPosts ?? []

  // Tạo active state an toàn
  const categoriesWithActive = categories.map(cat => ({
    ...cat,
    active: cat.slug === activeSlug,
  }))


  // Nếu không có data → hiện thông báo nhẹ nhàng (UX tốt)
  // if (categories.length === 0 && recentPosts.length === 0) {
  //   return (

  //   )
  // }

  return (
    <div className="space-y-8">
      {/* Search */}
      <div className="relative">
        <input
          type="text"
          placeholder="Tìm kiếm..."
          className="w-full pl-10 pr-4 py-3 rounded-xl border border-gray-200 focus:outline-none focus:ring-2 focus:ring-blue-500 transition-all"
        />
        <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-5 w-5 text-gray-400" />
      </div>

      {/* Categories */}
      <div className="bg-white rounded-2xl shadow-sm overflow-hidden border border-gray-100">
        <div className="bg-blue-600 p-4">
          <h3 className="text-white font-bold text-lg">Danh mục bài viết</h3>
        </div>
        <div className="divide-y divide-gray-100">
          {categories ? (
            <div>
              <button
                className={`w-full text-left px-6 py-4 flex items-center justify-between hover:bg-gray-50 transition-colors`}
              >
                <span>Tất cả</span>
              </button>
              {categoriesWithActive.map((category) => (
                <button
                  key={category.slug}
                  onClick={() => setActiveSlug(category.slug)}
                  className={`w-full text-left px-6 py-4 flex items-center justify-between hover:bg-gray-50 transition-colors ${category.active ? 'font-bold text-blue-600 bg-blue-50' : 'text-gray-600'
                    }`}
                >
                  <span>{category.name}</span>
                </button>
              ))}
            </div>
          ) : (<div className="text-center text-gray-500 py-8">
            <p>Không tải được dữ liệu</p>
            <button
              onClick={() => window.location.reload()}
              className="text-blue-600 text-sm underline mt-2"
            >
              Thử lại
            </button>
          </div>)}
        </div>
      </div>

      {/* Recent Posts */}
      <div className="bg-white rounded-2xl shadow-sm overflow-hidden border border-gray-100">
        <div className="bg-blue-600 p-4">
          <h3 className="text-white font-bold text-lg">Bài viết gần đây</h3>
        </div>
        <div className="p-4 space-y-4">
          {recentPosts.length > 0 ? (
            recentPosts.map((post) => (
              <Link key={post.id} href={`/news/${post.slug}`} className="flex space-x-4 group">
                <div className="relative w-20 h-20 flex-shrink-0 rounded-lg overflow-hidden bg-gray-200">
                  <Image
                    src={post.thumbnailUrl}
                    alt={post.title}
                    fill
                    sizes="80px"
                    className="object-cover group-hover:scale-110 transition-transform duration-300"
                  />
                </div>
                <div>
                  <h4 className="font-medium text-gray-900 group-hover:text-blue-600 transition-colors line-clamp-2 text-sm mb-1">
                    {post.title}
                  </h4>
                  <p className="text-xs text-gray-500">{formatDate(post.createdAt)}</p>
                </div>
              </Link>
            ))
          ) : (
            <p className="text-sm text-gray-500 text-center py-4">Chưa có bài viết</p>
          )}
        </div>
      </div>
    </div>
  )
}
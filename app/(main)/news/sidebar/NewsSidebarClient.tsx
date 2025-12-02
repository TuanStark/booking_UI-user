// src/app/(main)/news/sidebar/NewsSidebarClient.tsx
'use client'

import Link from 'next/link'
import Image from 'next/image'
import { Search } from 'lucide-react'
import { useRouter, useSearchParams } from 'next/navigation'
// import { useDebouncedCallback } from 'use-debounce'
import { useEffect, useRef, useState } from 'react'

import { NewsSidebarData } from '@/types/post'
import { debounce, formatDate } from '@/utils/utils'

interface Props {
  initialData: NewsSidebarData | null
}

export default function NewsSidebarClient({ initialData }: Props) {
  const router = useRouter()
  const searchParams = useSearchParams()

  // Đọc từ URL để đồng bộ
  const currentCategory = searchParams.get('category') || 'all'
  const currentSearch = searchParams.get('search') || ''

  // State cho ô input (hiển thị realtime)
  const [searchValue, setSearchValue] = useState(currentSearch)

  const categories = initialData?.categories ?? []
  const recentPosts = initialData?.recentPosts ?? []

  // Debounce search
  const debouncedSearch = useRef(
    debounce((term: string) => {
      const params = new URLSearchParams(searchParams)
      if (term.trim()) {
        params.set('search', term.trim())
      } else {
        params.delete('search')
      }
      params.set('page', '1')
      router.push(`?${params.toString()}`)
    }, 400)
  ).current


  // Click category
  const handleCategoryClick = (slug: string) => {
    const params = new URLSearchParams(searchParams)
    params.delete('search')
    if (slug === 'all') {
      params.delete('category')
    } else {
      params.set('category', slug)
    }
    params.set('page', '1')
    router.push(`?${params.toString()}`)
    // router.refresh()
  }

  // Đồng bộ input khi URL thay đổi (back/forward)
  useEffect(() => {
    setSearchValue(currentSearch)
  }, [currentSearch])

  return (
    <div className="space-y-8">
      {/* SEARCH BOX - NẰM TRONG SIDEBAR */}
      <div className="relative">
        <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400 pointer-events-none" />
        <input
          type="text"
          placeholder="Tìm kiếm bài viết..."
          value={searchValue}
          onChange={(e) => {
            const value = e.target.value
            setSearchValue(value)
            debouncedSearch(value) // ← Dùng debounce tự viết
          }}
          className="w-full pl-11 pr-4 py-3 rounded-xl border border-gray-300 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all text-base"
        />
      </div>

      {/* DANH MỤC */}
      <div className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden">
        <div className="bg-blue-600 p-4">
          <h3 className="text-white font-bold text-lg">Danh mục</h3>
        </div>
        <div className="divide-y divide-gray-100">
          {/* Tất cả */}
          <button
            onClick={() => handleCategoryClick('all')}
            className={`w-full text-left px-6 py-4 flex justify-between items-center transition-all ${currentCategory === 'all'
              ? 'bg-blue-50 text-blue-600 font-bold'
              : 'text-gray-700 hover:bg-gray-50'
              }`}
          >
            Tất cả
          </button>

          {/* Các danh mục */}
          {categories.map((cat) => (
            <button
              key={cat.slug}
              onClick={() => handleCategoryClick(cat.slug)}
              className={`w-full text-left px-6 py-4 flex justify-between items-center transition-all ${currentCategory === cat.slug
                ? 'bg-blue-50 text-blue-600 font-bold'
                : 'text-gray-700 hover:bg-gray-50'
                }`}
            >
              <span>{cat.name}</span>
              {/* <span className="text-sm text-gray-500">({cat.count})</span> */}
            </button>
          ))}
        </div>
      </div>

      {/* BÀI VIẾT GẦN ĐÂY */}
      <div className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden">
        <div className="bg-blue-600 p-4">
          <h3 className="text-white font-bold text-lg">Bài viết gần đây</h3>
        </div>
        <div className="p-4 space-y-4">
          {recentPosts.length > 0 ? (
            recentPosts.map((post) => (
              <Link
                key={post.id}
                href={`/news/${post.slug}`}
                className="flex gap-4 group hover:bg-gray-50 -mx-4 px-4 py-3 rounded-lg transition-all"
              >
                <div className="relative w-20 h-20 shrink-0 rounded-lg overflow-hidden bg-gray-200">
                  <Image
                    src={post.thumbnailUrl || '/placeholder.jpg'}
                    alt={post.title}
                    fill
                    sizes="80px"
                    className="object-cover group-hover:scale-110 transition-transform"
                  />
                </div>
                <div className="flex-1 min-w-0">
                  <h4 className="font-medium text-gray-900 group-hover:text-blue-600 line-clamp-2 text-sm">
                    {post.title}
                  </h4>
                  <time className="text-xs text-gray-500">
                    {formatDate(post.createdAt)}
                  </time>
                </div>
              </Link>
            ))
          ) : (
            <p className="text-center text-gray-500 text-sm py-6">Chưa có bài viết</p>
          )}
        </div>
      </div>
    </div>
  )
}
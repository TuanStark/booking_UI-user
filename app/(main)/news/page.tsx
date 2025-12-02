// src/app/(main)/news/page.tsx
import { Suspense } from 'react'
import NewsSidebar from './sidebar/NewsSidebar'

import NewsGrid from '@/components/news/NewsGrid'
import { getAllPosts } from '@/services/postService'
import NewsSidebarSkeleton from '@/components/news/sidebar/NewsSidebarSkeleton'
import AdvancedPagination from '@/components/AdvancedPagination'


// BẮT BUỘC: Nhận searchParams để dùng ?page=
export default async function NewsPage({
    searchParams,
}: {
    searchParams: { page?: string; category?: string }
}) {
    const currentPage = Number(searchParams.page) || 1
    const categoryId = searchParams.category || ''

    // Fetch dữ liệu chính (có thể filter theo category sau này)
    const { items: posts, meta } = await getAllPosts({
        page: currentPage,
        categoryId,
    })

    return (
        <div className="min-h-screen bg-gray-50 pt-24 pb-20">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                {/* Header */}
                <div className="text-center mb-16">
                    <h1 className="text-4xl md:text-5xl font-bold text-gray-900 mb-4">
                        Tin tức & Bài viết
                    </h1>
                    <p className="text-xl text-gray-600 max-w-2xl mx-auto">
                        Cập nhật những tin tức, sự kiện và câu chuyện mới nhất từ cộng đồng của chúng tôi.
                    </p>
                </div>

                <div className="grid grid-cols-1 lg:grid-cols-4 gap-8">
                    {/* Sidebar - Left on Desktop */}
                    <aside className="lg:col-span-1 order-2 lg:order-1">
                        <Suspense fallback={<NewsSidebarSkeleton />}>
                            <NewsSidebar />
                        </Suspense>
                    </aside>

                    {/* Main Content - Right on Desktop */}
                    <main className="lg:col-span-3 order-1 lg:order-2">
                        {/* Danh sách bài viết */}
                        <NewsGrid posts={posts} />

                        {/* Nếu không có bài */}
                        {posts.length === 0 && (
                            <div className="text-center py-20">
                                <p className="text-xl text-gray-500">Chưa có bài viết nào trong danh mục này.</p>
                            </div>
                        )}

                        {/* Pagination - Chỉ hiện khi có nhiều hơn 1 trang */}
                        {meta.totalPages > 1 && (
                            <div className="flex justify-center">
                                <AdvancedPagination
                                    currentPage={currentPage}
                                    totalPages={meta.totalPages}
                                    showPages={8}
                                />
                            </div>
                        )}
                    </main>
                </div>
            </div>
        </div>
    )
}
// src/app/(main)/news/page.tsx
import { Suspense } from 'react'
import NewsSidebar from './sidebar/NewsSidebar'

import NewsGrid from '@/components/news/NewsGrid'
import { getAllPosts } from '@/services/postService'
import NewsSidebarSkeleton from '@/components/news/sidebar/NewsSidebarSkeleton'
import AdvancedPagination from '@/components/AdvancedPagination'


export const dynamic = 'force-dynamic' // nếu muốn luôn fresh (tùy dự án)
export const revalidate = 600 // cache 10 phút (tùy chọn)

export default async function NewsPage({
    searchParams,
}: {
    searchParams: {
        page?: string
        category?: string
        search?: string
    }
}) {
    // Lấy params từ URL (do sidebar đã thay đổi URL)
    const currentPage = Number(searchParams.page) || 1
    const categorySlug = searchParams.category || ''
    const searchQuery = searchParams.search || ''

    // Gọi service — tự động filter theo category + search
    const { items: posts, meta } = await getAllPosts({
        page: currentPage,
        categorySlug,
        search: searchQuery,
    })

    return (
        <div className="min-h-screen bg-gray-50 pt-24 pb-20">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                {/* Header đẹp */}
                <div className="text-center mb-16">
                    <h1 className="text-4xl md:text-5xl font-bold text-gray-900 mb-4">
                        Tin tức & Bài viết
                    </h1>
                    <p className="text-xl text-gray-600 max-w-3xl mx-auto">
                        Cập nhật những tin tức mới nhất, kiến thức chuyên sâu và câu chuyện từ cộng đồng.
                    </p>
                </div>

                <div className="grid grid-cols-1 lg:grid-cols-4 gap-8">
                    {/* Sidebar – chứa cả search + category */}
                    <aside className="lg:col-span-1 order-2 lg:order-1">
                        <Suspense fallback={<NewsSidebarSkeleton />}>
                            <NewsSidebar />
                        </Suspense>
                    </aside>

                    {/* Nội dung chính */}
                    <main className="lg:col-span-3 order-1 lg:order-2 space-y-12">
                        {/* Danh sách bài viết */}
                        {posts.length > 0 ? (
                            <NewsGrid posts={posts} />
                        ) : (
                            <div className="text-center py-24">
                                <img src="https://res.cloudinary.com/dz6k5kcol/image/upload/v1764690414/google-tim-kiem-bang-hinh-anh-la-gi_uju9qw.jpg"
                                    alt=""
                                    className="mx-auto rounded-xl shadow-sm object-cover" />
                                <p className="text-2xl font-medium text-gray-600 mb-2">
                                    Không tìm thấy bài viết nào
                                </p>
                                <p className="text-gray-500">
                                    {searchQuery
                                        ? `Không có kết quả cho "${searchQuery}"`
                                        : categorySlug
                                            ? 'Danh mục này hiện chưa có bài viết.'
                                            : 'Chưa có bài viết nào được đăng.'}
                                </p>
                            </div>
                        )}

                        {/* Pagination – chỉ hiện khi cần */}
                        {meta.totalPages > 1 && (
                            <div className="flex justify-center">
                                <AdvancedPagination
                                    currentPage={currentPage}
                                    totalPages={meta.totalPages}
                                    showPages={7}
                                />
                            </div>
                        )}
                    </main>
                </div>
            </div>
        </div>
    )
}
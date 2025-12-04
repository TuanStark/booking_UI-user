// src/app/(main)/news/page.tsx
import NewsGrid from '@/components/news/NewsGrid'
import { getAllPosts } from '@/services/postService'
import AdvancedPagination from '@/components/AdvancedPagination'

export const dynamic = 'force-dynamic'
export const revalidate = 600

export default async function NewsPage({
    searchParams,
}: {
    searchParams: {
        page?: string
        category?: string
        search?: string
    }
}) {
    const currentPage = Number(searchParams.page) || 1
    const categorySlug = searchParams.category || ''
    const searchQuery = searchParams.search || ''

    const { items: posts, meta } = await getAllPosts({
        page: currentPage,
        categorySlug,
        search: searchQuery,
    })

    return (
        <>
            {/* Header */}
            <div className="text-center mb-16">
                <h1 className="text-4xl md:text-5xl font-bold text-gray-900 mb-4">
                    Tin tức & Bài viết
                </h1>
                <p className="text-xl text-gray-600 max-w-3xl mx-auto">
                    Cập nhật những tin tức mới nhất, kiến thức chuyên sâu và câu chuyện từ cộng đồng.
                </p>
            </div>

            <div className="space-y-12">
                {posts.length > 0 ? (
                    <NewsGrid posts={posts} />
                ) : (
                    <div className="text-center py-24">
                        <img
                            src="https://res.cloudinary.com/dz6k5kcol/image/upload/v1764690414/google-tim-kiem-bang-hinh-anh-la-gi_uju9qw.jpg"
                            alt=""
                            className="mx-auto rounded-xl shadow-sm object-cover"
                        />
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

                {meta.totalPages > 1 && (
                    <div className="flex justify-center">
                        <AdvancedPagination
                            currentPage={currentPage}
                            totalPages={meta.totalPages}
                            showPages={7}
                        />
                    </div>
                )}
            </div>
        </>
    )
}

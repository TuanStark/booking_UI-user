import { NewsGrid } from '@/components/news'
import NewsSidebar from './sidebar/NewsSidebar'
import { Suspense } from 'react'
import NewsSidebarSkeleton from '@/components/news/sidebar/NewsSidebarSkeleton'

export default function NewsPage() {
    return (
        <div className="min-h-screen bg-gray-50 pt-24 pb-20">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                {/* Header */}
                <div className="text-center mb-16">
                    <h1 className="text-4xl md:text-5xl font-bold text-gray-900 mb-4">
                        Tin tức & Bài viết
                    </h1>
                    <p className="text-xl text-gray-600 max-w-2xl mx-auto">
                        Cập nhật những tin tức, sự kiện và câu chuyện mới nhất từ ​​cộng đồng của chúng tôi.
                    </p>
                </div>

                <div className="grid grid-cols-1 lg:grid-cols-4 gap-8">
                    {/* Sidebar - Left on Desktop */}
                    <div className="lg:col-span-1 order-2 lg:order-1">
                        {/* <NewsSidebar /> */}
                        <Suspense fallback={<NewsSidebarSkeleton />}>
                            <NewsSidebar />
                        </Suspense>
                    </div>

                    {/* Main Content - Right on Desktop */}
                    <div className="lg:col-span-3 order-1 lg:order-2">
                        <NewsGrid />
                    </div>
                </div>
            </div>
        </div>
    )
}

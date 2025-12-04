// src/app/(main)/news/layout.tsx
import { Suspense } from 'react'
import NewsSidebar from './sidebar/NewsSidebar'
import NewsSidebarSkeleton from '@/components/news/sidebar/NewsSidebarSkeleton'

export default function NewsLayout({
    children,
}: {
    children: React.ReactNode
}) {
    return (
        <div className="min-h-screen bg-gray-50 pt-24 pb-20">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                <div className="grid grid-cols-1 lg:grid-cols-4 gap-8">
                    {/* Sidebar – chứa cả search + category */}
                    <aside className="lg:col-span-1 order-2 lg:order-1">
                        <div className="sticky top-24">
                            <Suspense fallback={<NewsSidebarSkeleton />}>
                                <NewsSidebar />
                            </Suspense>
                        </div>
                    </aside>

                    {/* Nội dung chính */}
                    <main className="lg:col-span-3 order-1 lg:order-2">
                        {children}
                    </main>
                </div>
            </div>
        </div>
    )
}

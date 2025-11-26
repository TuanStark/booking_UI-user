'use client'

import Image from 'next/image'
import Link from 'next/link'
import { notFound } from 'next/navigation'
import { ChevronRight, Calendar, User, Tag, ArrowLeft } from 'lucide-react'
import { NewsSidebar } from '@/components/news'
import { NEWS_DATA } from '@/components/news/data'

interface NewsDetailPageProps {
    params: {
        id: string
    }
}

export default function NewsDetailPage({ params }: NewsDetailPageProps) {
    const newsItem = NEWS_DATA.find((item) => item.id === Number(params.id))

    if (!newsItem) {
        notFound()
    }

    return (
        <div className="min-h-screen bg-gray-50 pt-24 pb-20">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                {/* Breadcrumb */}
                <div className="flex items-center space-x-2 text-sm text-gray-500 mb-8">
                    <Link href="/" className="hover:text-blue-600">Home</Link>
                    <ChevronRight className="h-4 w-4" />
                    <Link href="/news" className="hover:text-blue-600">News</Link>
                    <ChevronRight className="h-4 w-4" />
                    <span className="text-gray-900 font-medium truncate max-w-xs">{newsItem.title}</span>
                </div>

                <div className="grid grid-cols-1 lg:grid-cols-4 gap-8">
                    {/* Main Content */}
                    <div className="lg:col-span-3">
                        <article className="bg-white rounded-2xl shadow-sm overflow-hidden border border-gray-100">
                            {/* Featured Image */}
                            <div className="relative h-64 md:h-96 w-full">
                                <Image
                                    src={newsItem.image}
                                    alt={newsItem.title}
                                    fill
                                    className="object-cover"
                                    priority
                                />
                            </div>

                            <div className="p-6 md:p-10">
                                {/* Meta Data */}
                                <div className="flex flex-wrap items-center gap-4 md:gap-6 text-sm text-gray-500 mb-6">
                                    <span className="flex items-center text-blue-600 font-semibold bg-blue-50 px-3 py-1 rounded-full">
                                        <Tag className="h-4 w-4 mr-2" />
                                        {newsItem.category}
                                    </span>
                                    <span className="flex items-center">
                                        <Calendar className="h-4 w-4 mr-2" />
                                        {newsItem.date}
                                    </span>
                                    <span className="flex items-center">
                                        <User className="h-4 w-4 mr-2" />
                                        {newsItem.author}
                                    </span>
                                </div>

                                {/* Title */}
                                <h1 className="text-3xl md:text-4xl font-bold text-gray-900 mb-8 leading-tight">
                                    {newsItem.title}
                                </h1>

                                {/* Content */}
                                <div
                                    className="prose prose-lg max-w-none text-gray-600 prose-headings:text-gray-900 prose-a:text-blue-600 hover:prose-a:text-blue-700"
                                    dangerouslySetInnerHTML={{ __html: newsItem.content }}
                                />

                                {/* Back Link */}
                                <div className="mt-12 pt-8 border-t border-gray-100">
                                    <Link
                                        href="/news"
                                        className="inline-flex items-center text-gray-600 hover:text-blue-600 font-medium transition-colors"
                                    >
                                        <ArrowLeft className="h-4 w-4 mr-2" />
                                        Back to News
                                    </Link>
                                </div>
                            </div>
                        </article>
                    </div>

                    {/* Sidebar */}
                    <div className="lg:col-span-1">
                        <div className="sticky top-24">
                            <NewsSidebar />
                        </div>
                    </div>
                </div>
            </div>
        </div>
    )
}

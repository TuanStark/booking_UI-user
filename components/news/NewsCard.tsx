'use client'

import Link from 'next/link'
import Image from 'next/image'
import { ArrowRight } from 'lucide-react'
import { Post } from '@/types/post'
import { formatDate } from '@/utils/utils'

interface NewsCardProps {
    post: Post
}

export default function NewsCard({ post }: NewsCardProps) {
    const { id, title, summary, createdAt, category, thumbnailUrl } = post
    return (
        <div className="bg-white rounded-2xl shadow-sm hover:shadow-xl transition-all duration-300 overflow-hidden border border-gray-100 group flex flex-col h-full">
            <div className="relative h-64 w-full overflow-hidden">
                <Image
                    src={thumbnailUrl}
                    alt={title}
                    fill
                    className="object-cover group-hover:scale-110 transition-transform duration-500"
                />
                <div className="absolute top-4 left-4">
                    <span className="bg-yellow-400 text-yellow-900 text-xs font-bold px-3 py-1 rounded-full uppercase tracking-wide">
                        {category.name}
                    </span>
                </div>
            </div>

            <div className="p-6 flex flex-col flex-grow">
                <div className="flex items-center justify-between text-sm text-gray-500 mb-4">
                    <span>{formatDate(createdAt)}</span>
                    {/* <span>By {author}</span> */}
                </div>

                <h3 className="text-xl font-bold text-gray-900 mb-3 group-hover:text-blue-600 transition-colors line-clamp-2">
                    {title}
                </h3>

                <p className="text-gray-600 mb-6 line-clamp-3 flex-grow">
                    {summary}
                </p>

                <Link
                    href={`/news/${id}`}
                    className="inline-flex items-center text-blue-600 font-semibold hover:text-blue-700 transition-colors"
                >
                    View Detail
                    <ArrowRight className="ml-2 h-4 w-4 group-hover:translate-x-1 transition-transform" />
                </Link>
            </div>
        </div>
    )
}

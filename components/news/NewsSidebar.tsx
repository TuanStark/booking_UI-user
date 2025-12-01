'use client'

import Link from 'next/link'
import Image from 'next/image'
import { Search } from 'lucide-react'

export default function NewsSidebar() {
    const categories = [
        { name: 'Tất cả', count: 12, active: true },
        { name: 'Activity', count: 5, active: false },
        { name: 'Announcement', count: 3, active: false },
        { name: 'Blogs', count: 4, active: false },
    ]

    const recentPosts = [
        {
            id: 1,
            title: 'What is a playwright? The Powerful Assistant...',
            date: 'November 18, 2025',
            image: 'https://images.unsplash.com/photo-1522071820081-009f0129c71c?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80'
        },
        {
            id: 2,
            title: 'From Tester to Quality Assurance',
            date: 'November 7, 2025',
            image: 'https://images.unsplash.com/photo-1523240795612-9a054b0db644?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80'
        },
        {
            id: 3,
            title: 'The Mindset Shift That Changes Everything',
            date: 'October 25, 2025',
            image: 'https://images.unsplash.com/photo-1517486808906-6ca8b3f04846?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80'
        }
    ]

    return (
        <div className="space-y-8">
            {/* Search */}
            <div className="relative">
                <input
                    type="text"
                    placeholder="Search..."
                    className="w-full pl-10 pr-4 py-3 rounded-xl border border-gray-200 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all"
                />
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-5 w-5 text-gray-400" />
            </div>

            {/* Categories */}
            <div className="bg-white rounded-2xl shadow-sm overflow-hidden border border-gray-100">
                <div className="bg-blue-600 p-4">
                    <h3 className="text-white font-bold text-lg">Danh mục bài viết</h3>
                </div>
                <div className="divide-y divide-gray-100">
                    {categories.map((category) => (
                        <button
                            key={category.name}
                            className={`w-full text-left px-6 py-4 flex items-center justify-between hover:bg-gray-50 transition-colors ${category.active ? 'font-bold text-blue-600 bg-blue-50' : 'text-gray-600'
                                }`}
                        >
                            <span>{category.name}</span>
                        </button>
                    ))}
                </div>
            </div>

            {/* Recent Posts */}
            <div className="bg-white rounded-2xl shadow-sm overflow-hidden border border-gray-100">
                <div className="bg-blue-600 p-4">
                    <h3 className="text-white font-bold text-lg">Bài viết gần đây</h3>
                </div>
                <div className="p-4 space-y-4">
                    {recentPosts.map((post) => (
                        <Link key={post.id} href={`/news/${post.id}`} className="flex space-x-4 group">
                            <div className="relative w-20 h-20 flex-shrink-0 rounded-lg overflow-hidden">
                                <Image
                                    src={post.image}
                                    alt={post.title}
                                    fill
                                    className="object-cover group-hover:scale-110 transition-transform duration-300"
                                />
                            </div>
                            <div>
                                <h4 className="font-medium text-gray-900 group-hover:text-blue-600 transition-colors line-clamp-2 text-sm mb-1">
                                    {post.title}
                                </h4>
                                <p className="text-xs text-gray-500">{post.date}</p>
                            </div>
                        </Link>
                    ))}
                </div>
            </div>
        </div>
    )
}

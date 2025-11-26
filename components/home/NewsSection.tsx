'use client'

import Link from 'next/link'
import Image from 'next/image'
import { ArrowRight } from 'lucide-react'

export default function NewsSection() {
    const news = [
        {
            id: 1,
            title: 'Kinh nghiệm tìm phòng trọ cho tân sinh viên',
            excerpt: 'Những điều cần lưu ý khi tìm phòng trọ lần đầu tiên tại các thành phố lớn...',
            date: '20/11/2024',
            image: 'https://images.unsplash.com/photo-1522202176988-66273c2fd55f?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80',
            category: 'Cẩm nang'
        },
        {
            id: 2,
            title: 'Top 5 ký túc xá hiện đại nhất TP.HCM',
            excerpt: 'Khám phá những ký túc xá có cơ sở vật chất tốt nhất và giá cả hợp lý...',
            date: '18/11/2024',
            image: 'https://images.unsplash.com/photo-1555854877-bab0e564b8d5?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80',
            category: 'Review'
        }
    ]

    return (
        <section className="py-20 bg-gray-50">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                <div className="text-center mb-16">
                    <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">
                        Tin Tức & Sự Kiện
                    </h2>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mb-12">
                    {news.map((item) => (
                        <div key={item.id} className="bg-white rounded-2xl overflow-hidden shadow-sm hover:shadow-xl transition-all duration-300 group">
                            <div className="flex flex-col md:flex-row h-full">
                                <div className="md:w-2/5 relative h-48 md:h-auto overflow-hidden">
                                    <Image
                                        src={item.image}
                                        alt={item.title}
                                        fill
                                        className="object-cover transition-transform duration-500 group-hover:scale-110"
                                    />
                                </div>
                                <div className="md:w-3/5 p-6 flex flex-col justify-between">
                                    <div>
                                        <div className="flex items-center justify-between mb-3">
                                            <span className="text-sm font-semibold text-blue-600 bg-blue-50 px-3 py-1 rounded-full">
                                                {item.category}
                                            </span>
                                            <span className="text-sm text-gray-500">{item.date}</span>
                                        </div>
                                        <h3 className="text-xl font-bold text-gray-900 mb-3 group-hover:text-blue-600 transition-colors">
                                            {item.title}
                                        </h3>
                                        <p className="text-gray-600 line-clamp-2 mb-4">
                                            {item.excerpt}
                                        </p>
                                    </div>
                                    <Link
                                        href={`/news/${item.id}`}
                                        className="inline-flex items-center text-blue-600 font-semibold hover:text-blue-700 transition-colors"
                                    >
                                        Đọc thêm <ArrowRight className="ml-2 w-4 h-4" />
                                    </Link>
                                </div>
                            </div>
                        </div>
                    ))}
                </div>

                <div className="text-center">
                    <Link
                        href="/news"
                        className="inline-block px-8 py-3 bg-white border-2 border-blue-600 text-blue-600 rounded-full font-semibold hover:bg-blue-50 transition-colors"
                    >
                        Xem tất cả tin tức
                    </Link>
                </div>
            </div>
        </section>
    )
}

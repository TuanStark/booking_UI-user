'use client'

import Link from 'next/link'

interface CTASectionProps {
  title?: string
  description?: string
  primaryButtonText?: string
  primaryButtonLink?: string
  secondaryButtonText?: string
  secondaryButtonLink?: string
  gradient?: string
}

export default function CTASection({
  title = 'Sẵn Sàng Tìm Ký Túc Xá?',
  description = 'Bắt đầu hành trình tìm kiếm ký túc xá lý tưởng ngay hôm nay',
  primaryButtonText = 'Khám Phá Ngay',
  primaryButtonLink = '/buildings',
  secondaryButtonText = 'Tìm Hiểu Thêm',
  secondaryButtonLink = '/about',
  gradient = 'from-blue-600 to-purple-600'
}: CTASectionProps) {
  return (
    <section className={`py-20 bg-gradient-to-r ${gradient} text-white`}>
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
        <h2 className="text-3xl md:text-4xl font-bold mb-6">
          {title}
        </h2>
        <p className="text-xl text-blue-100 mb-8 max-w-2xl mx-auto">
          {description}
        </p>
        <div className="flex flex-col sm:flex-row gap-4 justify-center">
          <Link 
            href={primaryButtonLink} 
            className="bg-white text-blue-600 px-8 py-4 rounded-xl font-semibold hover:bg-gray-100 transition-colors duration-200 shadow-lg"
          >
            {primaryButtonText}
          </Link>
          <Link 
            href={secondaryButtonLink} 
            className="border-2 border-white text-white px-8 py-4 rounded-xl font-semibold hover:bg-white hover:text-blue-600 transition-all duration-200"
          >
            {secondaryButtonText}
          </Link>
        </div>
      </div>
    </section>
  )
}

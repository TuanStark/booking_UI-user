'use client'

import { Building2, Users, Star } from 'lucide-react'

interface Feature {
  icon: React.ComponentType<{ className?: string }>
  title: string
  description: string
  gradient: string
}

const features: Feature[] = [
  {
    icon: Building2,
    title: 'Ký Túc Xá Chất Lượng',
    description: 'Hàng trăm ký túc xá được kiểm định chất lượng với đầy đủ tiện nghi hiện đại',
    gradient: 'from-blue-500 to-purple-600'
  },
  {
    icon: Users,
    title: 'Hỗ Trợ 24/7',
    description: 'Đội ngũ hỗ trợ chuyên nghiệp luôn sẵn sàng giúp đỡ bạn mọi lúc, mọi nơi',
    gradient: 'from-green-500 to-blue-600'
  },
  {
    icon: Star,
    title: 'Đánh Giá Cao',
    description: 'Được đánh giá 4.8/5 sao bởi hàng nghìn sinh viên đã sử dụng dịch vụ',
    gradient: 'from-yellow-500 to-orange-600'
  }
]

export default function FeaturesSection() {
  return (
    <section className="py-20 bg-gray-50 dark:bg-gray-800">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-16">
          <h2 className="text-3xl md:text-4xl font-bold text-gray-900 dark:text-white mb-4">
            Tại Sao Chọn Chúng Tôi?
          </h2>
          <p className="text-xl text-gray-600 dark:text-gray-400 max-w-2xl mx-auto">
            Chúng tôi cam kết mang đến trải nghiệm đặt phòng tốt nhất cho sinh viên
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {features.map((feature, index) => {
            const IconComponent = feature.icon
            return (
              <div 
                key={index} 
                className="text-center p-8 bg-white dark:bg-gray-900 rounded-2xl shadow-lg hover:shadow-xl transition-all duration-300"
              >
                <div className={`w-16 h-16 bg-gradient-to-r ${feature.gradient} rounded-2xl flex items-center justify-center mx-auto mb-6`}>
                  <IconComponent className="h-8 w-8 text-white" />
                </div>
                <h3 className="text-xl font-semibold text-gray-900 dark:text-white mb-4">
                  {feature.title}
                </h3>
                <p className="text-gray-600 dark:text-gray-400">
                  {feature.description}
                </p>
              </div>
            )
          })}
        </div>
      </div>
    </section>
  )
}

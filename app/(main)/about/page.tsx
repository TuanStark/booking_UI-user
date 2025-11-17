'use client'

import { Building2, Users, Star, Award, Target, Heart, CheckCircle } from 'lucide-react'

export default function AboutPage() {
  const values = [
    {
      icon: Heart,
      title: 'Cam kết chất lượng',
      description: 'Chúng tôi cam kết mang đến dịch vụ tốt nhất cho sinh viên với tiêu chuẩn chất lượng cao.'
    },
    {
      icon: Target,
      title: 'Mục tiêu rõ ràng',
      description: 'Giúp sinh viên tìm được nơi ở phù hợp với nhu cầu và ngân sách của mình.'
    },
    {
      icon: Award,
      title: 'Uy tín hàng đầu',
      description: 'Được tin tưởng bởi hàng nghìn sinh viên và các tòa nhà ký túc xá trên toàn quốc.'
    }
  ]

  const stats = [
    { number: '500+', label: 'Tòa nhà ký túc xá' },
    { number: '10,000+', label: 'Sinh viên đã sử dụng' },
    { number: '4.8/5', label: 'Đánh giá trung bình' },
    { number: '24/7', label: 'Hỗ trợ khách hàng' }
  ]

  const features = [
    {
      icon: Building2,
      title: 'Nhiều lựa chọn',
      description: 'Hàng trăm tòa nhà ký túc xá với đầy đủ tiện nghi hiện đại'
    },
    {
      icon: Users,
      title: 'Hỗ trợ chuyên nghiệp',
      description: 'Đội ngũ tư vấn nhiệt tình, sẵn sàng hỗ trợ bạn 24/7'
    },
    {
      icon: Star,
      title: 'Đánh giá thực tế',
      description: 'Đánh giá từ sinh viên thực tế đã sử dụng dịch vụ'
    }
  ]

  return (
    <div className="space-y-0">
      <section className="bg-gradient-to-r from-blue-500 to-purple-600 text-white py-20 rounded-3xl">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center">
            <h1 className="text-4xl md:text-5xl font-bold mb-6">
              Về Chúng Tôi
            </h1>
            <p className="text-xl md:text-2xl text-blue-100 max-w-3xl mx-auto">
              Nền tảng đặt phòng ký túc xá hiện đại, giúp sinh viên tìm kiếm và đặt phòng một cách dễ dàng và nhanh chóng
            </p>
          </div>
        </div>
      </section>

      <section className="py-16 bg-white dark:bg-gray-800 rounded-3xl shadow-sm mt-10">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-8">
            {stats.map((stat, index) => (
              <div key={index} className="text-center">
                <div className="text-3xl md:text-4xl font-bold text-blue-600 dark:text-blue-400 mb-2">
                  {stat.number}
                </div>
                <div className="text-gray-600 dark:text-gray-400">
                  {stat.label}
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      <section className="py-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid md:grid-cols-2 gap-12 items-center">
            <div>
              <h2 className="text-3xl md:text-4xl font-bold text-gray-900 dark:text-white mb-6">
                Chúng Tôi Là Ai?
              </h2>
              <div className="space-y-4 text-gray-600 dark:text-gray-400 text-lg">
                <p>
                  DormBooking là nền tảng đặt phòng ký túc xá hàng đầu tại Việt Nam, được thành lập với mục tiêu giúp sinh viên tìm kiếm và đặt phòng ký túc xá một cách dễ dàng, nhanh chóng và tiện lợi.
                </p>
                <p>
                  Với hơn 500 tòa nhà ký túc xá đối tác trên toàn quốc, chúng tôi tự hào mang đến cho sinh viên nhiều lựa chọn phù hợp với mọi nhu cầu và ngân sách.
                </p>
                <p>
                  Đội ngũ của chúng tôi luôn nỗ lực không ngừng để cải thiện dịch vụ, mang đến trải nghiệm tốt nhất cho người dùng.
                </p>
              </div>
            </div>
            <div className="bg-gradient-to-r from-blue-500 to-purple-600 rounded-2xl p-8 text-white">
              <h3 className="text-2xl font-bold mb-6">Sứ Mệnh Của Chúng Tôi</h3>
              <ul className="space-y-4">
                <li className="flex items-start space-x-3">
                  <CheckCircle className="h-6 w-6 flex-shrink-0 mt-1" />
                  <span>Kết nối sinh viên với các tòa nhà ký túc xá chất lượng</span>
                </li>
                <li className="flex items-start space-x-3">
                  <CheckCircle className="h-6 w-6 flex-shrink-0 mt-1" />
                  <span>Mang đến trải nghiệm đặt phòng đơn giản, nhanh chóng</span>
                </li>
                <li className="flex items-start space-x-3">
                  <CheckCircle className="h-6 w-6 flex-shrink-0 mt-1" />
                  <span>Đảm bảo chất lượng và uy tín trong mọi giao dịch</span>
                </li>
                <li className="flex items-start space-x-3">
                  <CheckCircle className="h-6 w-6 flex-shrink-0 mt-1" />
                  <span>Hỗ trợ sinh viên 24/7 với đội ngũ chuyên nghiệp</span>
                </li>
              </ul>
            </div>
          </div>
        </div>
      </section>

      <section className="py-20 bg-white dark:bg-gray-800 rounded-3xl shadow-sm">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-3xl md:text-4xl font-bold text-gray-900 dark:text-white mb-4">
              Giá Trị Cốt Lõi
            </h2>
            <p className="text-xl text-gray-600 dark:text-gray-400 max-w-2xl mx-auto">
              Những giá trị mà chúng tôi luôn hướng tới và cam kết thực hiện
            </p>
          </div>
          <div className="grid md:grid-cols-3 gap-8">
            {values.map((value, index) => {
              const IconComponent = value.icon
              return (
                <div
                  key={index}
                  className="bg-gray-50 dark:bg-gray-900 p-8 rounded-2xl hover:shadow-lg transition-shadow duration-300"
                >
                  <div className="w-16 h-16 bg-gradient-to-r from-blue-500 to-purple-600 rounded-2xl flex items-center justify-center mb-6">
                    <IconComponent className="h-8 w-8 text-white" />
                  </div>
                  <h3 className="text-xl font-semibold text-gray-900 dark:text-white mb-4">
                    {value.title}
                  </h3>
                  <p className="text-gray-600 dark:text-gray-400">
                    {value.description}
                  </p>
                </div>
              )
            })}
          </div>
        </div>
      </section>

      <section className="py-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-3xl md:text-4xl font-bold text-gray-900 dark:text-white mb-4">
              Tại Sao Chọn Chúng Tôi?
            </h2>
            <p className="text-xl text-gray-600 dark:text-gray-400 max-w-2xl mx-auto">
              Những lý do khiến DormBooking trở thành lựa chọn hàng đầu của sinh viên
            </p>
          </div>
          <div className="grid md:grid-cols-3 gap-8">
            {features.map((feature, index) => {
              const IconComponent = feature.icon
              return (
                <div
                  key={index}
                  className="text-center p-8 bg-white dark:bg-gray-800 rounded-2xl shadow-lg hover:shadow-xl transition-all duration-300"
                >
                  <div className="w-16 h-16 bg-gradient-to-r from-blue-500 to-purple-600 rounded-2xl flex items-center justify-center mx-auto mb-6">
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
    </div>
  )
}


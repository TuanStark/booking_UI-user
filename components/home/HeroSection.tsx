'use client'

import SearchBar from '@/components/SearchBar'

interface HeroSectionProps {
  backgroundImage?: string
  overlayOpacity?: string
}

export default function HeroSection({ 
  backgroundImage = "https://images.unsplash.com/photo-1560448204-e02f11c3d0e2?ixlib=rb-4.0.3&auto=format&fit=crop&w=1920&q=80",
  overlayOpacity = "bg-gradient-to-br bg-black/80 via-gray-900/70 to-gray-800/80"
}: HeroSectionProps) {
  const stats = [
    { value: '500+', label: 'Ký túc xá' },
    { value: '10K+', label: 'Sinh viên' },
    { value: '4.8★', label: 'Đánh giá' }
  ]

  return (
    <section 
      className="relative text-white overflow-hidden"
      style={{
        backgroundImage: `url('${backgroundImage}')`,
        backgroundSize: 'cover',
        backgroundPosition: 'center',
        backgroundRepeat: 'no-repeat',
        minHeight: '600px'
      }}
    >
      <div className={`absolute inset-0 ${overlayOpacity}`}></div>
      <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-24 lg:py-32">
        <div className="text-center">
          <h1 className="text-4xl md:text-6xl font-bold mb-6 animate-fade-in">
            Tìm Ký Túc Xá lý tưởng cho bạn
            <span className="block text-transparent bg-clip-text bg-gradient-to-r from-yellow-400 to-orange-500">
              Dễ Dàng
            </span>
          </h1>
          <p className="text-xl md:text-2xl mb-8 text-blue-100 max-w-3xl mx-auto animate-slide-up">
            Khám phá hàng ngàn ký túc xá chất lượng cao với giá cả phải chăng, 
            phù hợp cho sinh viên đại học
          </p>
          
          {/* Search Bar */}
          <div className="max-w-4xl mx-auto mb-12">
            <SearchBar />
          </div>

          {/* Stats */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 max-w-4xl mx-auto">
            {stats.map((stat, index) => (
              <div key={index} className="text-center">
                <div className="text-4xl font-bold text-yellow-400 mb-2">{stat.value}</div>
                <div className="text-blue-100">{stat.label}</div>
              </div>
            ))}
          </div>
        </div>
      </div>
      
      {/* Decorative Elements */}
      <div className="absolute top-20 left-10 w-20 h-20 bg-white/10 rounded-full animate-bounce-gentle"></div>
      <div className="absolute bottom-20 right-10 w-16 h-16 bg-white/10 rounded-full animate-bounce-gentle" style={{animationDelay: '1s'}}></div>
      <div className="absolute top-1/2 left-20 w-12 h-12 bg-white/10 rounded-full animate-bounce-gentle" style={{animationDelay: '2s'}}></div>
    </section>
  )
}

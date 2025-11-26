'use client'

import Link from 'next/link'
import Image from 'next/image'

interface FeaturedDormsSectionProps {
  limit?: number
}

export default function FeaturedDormsSection({ limit = 6 }: FeaturedDormsSectionProps) {
  // Mock data based on the "Case Studies" section in the image
  const dorms = [
    {
      id: 1,
      name: 'KTX Đại học Quốc Gia',
      image: 'https://images.unsplash.com/photo-1555854877-bab0e564b8d5?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80',
      category: 'Ký túc xá hiện đại'
    },
    {
      id: 2,
      name: 'KTX Bách Khoa',
      image: 'https://images.unsplash.com/photo-1595526114035-0d45ed16cfbf?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80',
      category: 'Tiện nghi đầy đủ'
    },
    {
      id: 3,
      name: 'KTX Sư Phạm',
      image: 'https://images.unsplash.com/photo-1522771753037-63338189a236?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80',
      category: 'Không gian xanh'
    },
    {
      id: 4,
      name: 'KTX Ngoại Thương',
      image: 'https://images.unsplash.com/photo-1502672260266-1c1ef2d93688?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80',
      category: 'Vị trí trung tâm'
    },
    {
      id: 5,
      name: 'KTX Kinh Tế',
      image: 'https://images.unsplash.com/photo-1493809842364-78817add7ffb?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80',
      category: 'An ninh 24/7'
    },
    {
      id: 6,
      name: 'KTX Y Dược',
      image: 'https://images.unsplash.com/photo-1505693416388-50398020c170?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80',
      category: 'Yên tĩnh học tập'
    }
  ]

  return (
    <section className="py-20 bg-gray-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-16">
          <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">
            Ký Túc Xá Nổi Bật
          </h2>
          <p className="text-gray-600 max-w-2xl mx-auto">
            Khám phá những ký túc xá được sinh viên yêu thích nhất với đầy đủ tiện nghi và môi trường sống tuyệt vời.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {dorms.slice(0, limit).map((dorm) => (
            <div
              key={dorm.id}
              className="group bg-white rounded-2xl overflow-hidden shadow-sm hover:shadow-xl transition-all duration-300 transform hover:-translate-y-1"
            >
              <div className="relative h-64 overflow-hidden">
                <Image
                  src={dorm.image}
                  alt={dorm.name}
                  fill
                  className="object-cover transition-transform duration-500 group-hover:scale-110"
                />
                <div className="absolute inset-0 bg-black/20 group-hover:bg-black/40 transition-colors duration-300" />
                <div className="absolute bottom-0 left-0 right-0 p-6 text-white transform translate-y-2 group-hover:translate-y-0 transition-transform duration-300">
                  <p className="text-sm font-medium text-blue-200 mb-1">{dorm.category}</p>
                  <h3 className="text-xl font-bold">{dorm.name}</h3>
                </div>
              </div>
            </div>
          ))}
        </div>

        <div className="text-center mt-12">
          <Link
            href="/buildings"
            className="inline-block px-8 py-3 bg-gradient-to-r from-blue-500 to-purple-600 text-white rounded-full font-semibold shadow-lg hover:shadow-xl hover:scale-105 transition-all duration-300"
          >
            Xem tất cả ký túc xá
          </Link>
        </div>
      </div>
    </section>
  )
}

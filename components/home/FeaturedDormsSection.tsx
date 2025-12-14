import Link from 'next/link'
import Image from 'next/image'
import { getAllBuildings } from '@/services/buildingService'

interface FeaturedDormsSectionProps {
  limit?: number
}

export default async function FeaturedDormsSection({ limit = 6 }: FeaturedDormsSectionProps) {
    const currentPage = Number(1) || 1
    const { items: buildings, meta } = await getAllBuildings({
      page: currentPage,
      limit
    })

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
          {buildings.slice(0, limit).map((building) => (
            <Link
              key={building.id}
              href={`/buildings/${building.id}`}
              className="group bg-white rounded-2xl overflow-hidden shadow-sm hover:shadow-xl transition-all duration-300 transform hover:-translate-y-1 block"
            >
              <div className="relative h-64 overflow-hidden">
                <Image
                  src={building.images || '/placeholder-building.jpg'}
                  alt={building.name}
                  fill
                  className="object-cover transition-transform duration-500 group-hover:scale-110"
                  sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
                />
                <div className="absolute inset-0 bg-black/20 group-hover:bg-black/40 transition-colors duration-300" />
                <div className="absolute bottom-0 left-0 right-0 p-6 text-white transform translate-y-2 group-hover:translate-y-0 transition-transform duration-300">
                  {/* <p className="text-sm font-medium text-blue-200 mb-1">{building.category}</p> */}
                  <h3 className="text-xl font-bold">{building.name}</h3>
                </div>
              </div>
            </Link>
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

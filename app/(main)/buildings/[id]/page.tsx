// This is a Server Component - no 'use client' directive
import { Metadata } from 'next'
import { notFound } from 'next/navigation'
import Link from 'next/link'
import { 
  ArrowLeft, 
  MapPin, 
  Star,
  Phone,
  Calendar,
  BedDouble,
  Wifi,
  Layers,
  Users,
  ShieldCheck,
  Building2,
  DollarSign,
  Sparkles
} from 'lucide-react'
import BuildingRoomsList from '@/components/buildings/BuildingRoomsList'
import BuildingImageCarousel from '@/components/buildings/BuildingImageCarousel'
import { BuildingService } from '@/services/buildingService'
import type { Building, Room, ContactInfo } from '@/types'

interface BuildingDetailPageProps {
  params: Promise<{
    id: string
  }>
}

const FALLBACK_IMAGES = [
  'https://images.unsplash.com/photo-1560448204-e02f11c3d0e2?auto=format&fit=crop&w=1200&q=80',
  'https://images.unsplash.com/photo-1545324418-cc1a3fa10c00?auto=format&fit=crop&w=1200&q=80',
  'https://images.unsplash.com/photo-1570129477492-45c003edd2be?auto=format&fit=crop&w=1200&q=80'
]

const currencyFormatter = new Intl.NumberFormat('vi-VN', {
  style: 'currency',
  currency: 'VND',
  maximumFractionDigits: 0
})

const formatCurrency = (value?: number) => {
  if (!value || Number.isNaN(value)) {
    return currencyFormatter.format(0)
  }

  return currencyFormatter.format(value)
}

const deriveRoomStats = (rooms: Room[], fallbackAverage: number) => {
  if (!rooms.length) {
    return {
      minPrice: fallbackAverage,
      maxPrice: fallbackAverage,
      averagePrice: fallbackAverage,
      floors: 0,
      totalCapacity: 0,
      availableCount: 0
    }
  }

  const prices = rooms.map(room => room.price || 0)
  const minPrice = Math.min(...prices)
  const maxPrice = Math.max(...prices)
  const averagePrice = prices.reduce((sum, price) => sum + price, 0) / rooms.length
  const floors = new Set(rooms.map(room => room.floor)).size
  const totalCapacity = rooms.reduce((sum, room) => sum + (parseInt(room.capacity || '0', 10) || 0), 0)
  const availableCount = rooms.filter(room => room.available).length

  return {
    minPrice,
    maxPrice,
    averagePrice,
    floors,
    totalCapacity,
    availableCount
  }
}

const getAmenityHighlights = (rooms: Room[]) => {
  const amenityCounter = new Map<string, number>()

  rooms.forEach(room => {
    room.amenities?.forEach(amenity => {
      if (!amenity) return
      amenityCounter.set(amenity, (amenityCounter.get(amenity) || 0) + 1)
    })
  })

  return Array.from(amenityCounter.entries())
    .sort((a, b) => b[1] - a[1])
    .slice(0, 8)
    .map(([name, count]) => ({ name, count }))
}

const buildImageGallery = (building: Building, rooms: Room[]) => {
  const gallery = new Set<string>()

  if (building.images) {
    gallery.add(building.images)
  }

  rooms.forEach(room => {
    room.images?.forEach(image => {
      if (image) {
        gallery.add(image)
      }
    })
  })

  const galleryArray = Array.from(gallery)

  if (!galleryArray.length) {
    return FALLBACK_IMAGES
  }

  return galleryArray.slice(0, 6)
}

const getPrimaryContact = (building: Building, rooms: Room[]): ContactInfo | null => {
  if (building.contact) {
    return building.contact
  }

  return rooms[0]?.contact || null
}

// Generate metadata for SEO
export async function generateMetadata({ params }: BuildingDetailPageProps): Promise<Metadata> {
  const { id } = await params
  const { building } = await BuildingService.getBuildingDetailWithRooms(id)
  if (!building) {
    return {
      title: 'Không tìm thấy tòa nhà',
    }
  }

  return {
    title: `${building.name} - Chi tiết tòa nhà ký túc xá | DormBooking`,
    description: building.description || `Thông tin chi tiết về ${building.name} - ${building.address}. ${building.totalRooms} phòng, ${building.availableRooms} phòng còn trống.`,
    keywords: `ký túc xá, ${building.name}, đặt phòng, sinh viên, ${building.address}`,
    openGraph: {
      title: `${building.name} - DormBooking`,
      description: building.description || `Thông tin chi tiết về ${building.name}`,
      images: building.images ? [building.images] : [],
      type: 'website',
    },
  }
}

export default async function BuildingDetailPage({ params }: BuildingDetailPageProps) {
  const { id } = await params
  const { building, rooms } = await BuildingService.getBuildingDetailWithRooms(id)
  console.log('building', building);
  console.log('rooms', rooms);
  if (!building) {
    notFound()
  }

  const galleryImages = buildImageGallery(building, rooms)
  const roomStats = deriveRoomStats(rooms, building.averagePrice)
  const amenityHighlights = getAmenityHighlights(rooms)
  const contactInfo = getPrimaryContact(building, rooms)
  const heroBackground = galleryImages[0] || FALLBACK_IMAGES[0]
  const occupancyRate = building.totalRooms
    ? Math.round(((building.totalRooms - building.availableRooms) / building.totalRooms) * 100)
    : 0

  const heroStats = [
    { label: 'Tổng phòng', value: building.totalRooms },
    { label: 'Còn trống', value: building.availableRooms },
    { label: 'Giá trung bình', value: formatCurrency(roomStats.averagePrice) },
    { label: 'Tỷ lệ lấp đầy', value: `${occupancyRate}%`, helper: 'Cập nhật theo thời gian thực' }
  ]

  const insightCards = [
    {
      label: 'Phòng rẻ nhất',
      value: formatCurrency(roomStats.minPrice),
      helper: 'Giá thấp nhất hiện có',
      icon: DollarSign
    },
    {
      label: 'Phòng đắt nhất',
      value: formatCurrency(roomStats.maxPrice),
      helper: 'Gói cao cấp nhất',
      icon: Layers
    },
    {
      label: 'Sức chứa tối đa',
      value: roomStats.totalCapacity ? `${roomStats.totalCapacity}+ người` : `${rooms.length} phòng`,
      helper: 'Tổng sức chứa tất cả phòng',
      icon: Users
    },
    {
      label: 'Số tầng đang khai thác',
      value: roomStats.floors || 1,
      helper: 'Dựa trên dữ liệu phòng',
      icon: Building2
    }
  ]

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900">
      <div className="space-y-16">
        <section className="relative isolate overflow-hidden bg-slate-900 text-white">
          <div
            className="absolute inset-0 opacity-60"
            style={{
              backgroundImage: `url(${heroBackground})`,
              backgroundSize: 'cover',
              backgroundPosition: 'center'
            }}
          />
          <div className="absolute inset-0 bg-slate-900/80 backdrop-blur-sm" />
          <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16 space-y-8">
            <div className="flex items-center justify-between text-sm text-white/80">
              <Link href="/buildings" className="inline-flex items-center gap-2 text-white/80 hover:text-white transition-colors">
                <ArrowLeft className="h-4 w-4" />
                Quay về danh sách
              </Link>
              <div className="inline-flex items-center gap-2">
                <ShieldCheck className="h-4 w-4 text-emerald-400" />
                <span>Vận hành & an ninh 24/7</span>
              </div>
            </div>

            <div className="grid gap-10 lg:grid-cols-5 items-center">
              <div className="lg:col-span-3 space-y-6">
                <div className="flex items-center gap-3 text-sm uppercase tracking-widest text-white/60">
                  <span className="inline-flex items-center gap-2">
                    <MapPin className="h-4 w-4" />
                    Ký túc xá doanh nghiệp
                  </span>
                  <span className="h-1 w-1 rounded-full bg-white/50" />
                  <span>{rooms.length} phòng đang khai thác</span>
                </div>
                <div className="space-y-4">
                  <h1 className="text-3xl lg:text-5xl font-semibold leading-tight">{building.name}</h1>
                  <div className="flex flex-wrap items-center gap-4 text-base text-white/80">
                    <span className="inline-flex items-center gap-2">
                      <MapPin className="h-5 w-5" />
                      {building.address}
                    </span>
                    <span className="inline-flex items-center gap-2">
                      <Star className="h-5 w-5 text-yellow-400" />
                      {building.rating} · {building.totalReviews} đánh giá
                    </span>
                  </div>
                  <p className="text-base text-white/80 leading-relaxed max-w-3xl">
                    {building.description || 'Không có mô tả cho tòa nhà này. Chúng tôi sẽ cập nhật thêm thông tin sớm nhất để bạn có góc nhìn đầy đủ hơn.'}
                  </p>
                </div>

                <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
                  {heroStats.map(stat => (
                    <div
                      key={stat.label}
                      className="rounded-2xl border border-white/10 bg-white/5 p-4 backdrop-blur-md"
                    >
                      <p className="text-xs uppercase tracking-wide text-white/60">{stat.label}</p>
                      <p className="mt-2 text-2xl font-semibold">{stat.value}</p>
                      {stat.helper && (
                        <p className="mt-1 text-xs text-white/60">{stat.helper}</p>
                      )}
                    </div>
                  ))}
                </div>
              </div>

              <div className="lg:col-span-2">
                <div className="rounded-3xl border border-white/10 bg-white/10 p-4 shadow-2xl backdrop-blur">
                  <BuildingImageCarousel images={building.images ? [building.images] : []} buildingName={building.name} />
                </div>
              </div>
            </div>
          </div>
        </section>

        <section className="-mt-16 relative z-10 pb-16">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="grid gap-8 lg:grid-cols-3">
              <div className="lg:col-span-2 space-y-6">
                <div className="rounded-3xl bg-white dark:bg-gray-900 shadow-xl ring-1 ring-gray-100/70 dark:ring-gray-800/70 p-6 sm:p-8">
                  <div className="flex flex-col gap-4">
                    <div>
                      <p className="text-sm uppercase tracking-wide text-blue-500 dark:text-blue-300">Thông tin tổng quan</p>
                      <h2 className="text-2xl font-semibold text-gray-900 dark:text-white mt-2">Tổng quan tòa nhà</h2>
                      <p className="mt-3 text-gray-600 dark:text-gray-300 leading-relaxed">
                        {building.description || 'Tòa nhà hiện chưa có mô tả chi tiết. Tuy nhiên, toàn bộ phòng đều được vận hành theo tiêu chuẩn an toàn, tiện nghi và sẵn sàng bàn giao ngay.'}
                      </p>
                    </div>
                    <div className="grid sm:grid-cols-2 gap-4">
                      {insightCards.map(card => (
                        <div
                          key={card.label}
                          className="rounded-2xl border border-gray-100 dark:border-gray-800/60 p-4 flex items-start gap-3"
                        >
                          <div className="h-11 w-11 rounded-2xl bg-blue-50 dark:bg-blue-500/10 flex items-center justify-center text-blue-600 dark:text-blue-300">
                            <card.icon className="h-5 w-5" />
                          </div>
                          <div>
                            <p className="text-sm text-gray-500 dark:text-gray-400">{card.label}</p>
                            <p className="text-xl font-semibold text-gray-900 dark:text-white mt-1">{card.value}</p>
                            <p className="text-xs text-gray-500 dark:text-gray-400 mt-1">{card.helper}</p>
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                </div>

                <div className="rounded-3xl bg-white dark:bg-gray-900 shadow-xl ring-1 ring-gray-100/70 dark:ring-gray-800/70 p-6 sm:p-8">
                  <div className="flex items-center justify-between mb-6">
                    <div>
                      <p className="text-sm uppercase tracking-wide text-blue-500 dark:text-blue-300">Tiện ích tư nhân</p>
                      <h3 className="text-2xl font-semibold text-gray-900 dark:text-white">Tiện ích & tiện nghi</h3>
                    </div>
                    <span className="text-sm text-gray-500 dark:text-gray-400">
                      {amenityHighlights.length ? `Tổng hợp từ ${amenityHighlights.length} tiện ích phổ biến` : 'Đang cập nhật'}
                    </span>
                  </div>
                  {amenityHighlights.length ? (
                    <div className="grid sm:grid-cols-2 gap-3">
                      {amenityHighlights.map(amenity => (
                        <div
                          key={amenity.name}
                          className="flex items-center gap-3 rounded-2xl border border-gray-100 dark:border-gray-800/70 p-3"
                        >
                          <div className="h-10 w-10 rounded-2xl bg-blue-50 dark:bg-blue-500/10 flex items-center justify-center text-blue-600 dark:text-blue-300">
                            <Sparkles className="h-4 w-4" />
                          </div>
                          <div>
                            <p className="font-medium text-gray-900 dark:text-white">{amenity.name}</p>
                            <p className="text-xs text-gray-500 dark:text-gray-400">Có trong {amenity.count} phòng</p>
                          </div>
                        </div>
                      ))}
                    </div>
                  ) : (
                    <p className="text-gray-600 dark:text-gray-400">
                      Chưa có dữ liệu tiện ích. Các phòng vẫn được trang bị đầy đủ tiện nghi cơ bản.
                    </p>
                  )}
                </div>
              </div>

              <div className="space-y-6">
                <div className="rounded-3xl bg-white dark:bg-gray-900 shadow-xl ring-1 ring-gray-100/70 dark:ring-gray-800/70 p-6 sm:p-8">
                  <h3 className="text-xl font-semibold text-gray-900 dark:text-white">Liên hệ quản lý</h3>
                  {contactInfo ? (
                    <div className="mt-4 space-y-3 text-sm text-gray-600 dark:text-gray-300">
                      {contactInfo.manager && (
                        <div className="flex items-center gap-2">
                          <ShieldCheck className="h-4 w-4 text-emerald-500" />
                          <span>Quản lý: {contactInfo.manager}</span>
                        </div>
                      )}
                      {contactInfo.phone && (
                        <div className="flex items-center gap-2">
                          <Phone className="h-4 w-4" />
                          <span>{contactInfo.phone}</span>
                        </div>
                      )}
                      {contactInfo.email && (
                        <div className="flex items-center gap-2">
                          <Calendar className="h-4 w-4" />
                          <span>{contactInfo.email}</span>
                        </div>
                      )}
                    </div>
                  ) : (
                    <p className="text-sm text-gray-500 dark:text-gray-400 mt-3">
                      Chưa cập nhật thông tin liên hệ trực tiếp. Vui lòng sử dụng form đặt phòng để được hỗ trợ.
                    </p>
                  )}

                  <div className="mt-6 space-y-2">
                    <a
                      href={contactInfo?.phone ? `tel:${contactInfo.phone}` : '#'}
                      className="w-full bg-blue-600 hover:bg-blue-700 text-white py-3 px-4 rounded-2xl font-medium transition-colors duration-200 flex items-center justify-center gap-2 disabled:opacity-60"
                    >
                      <Phone className="h-4 w-4" />
                      Gọi ngay
                    </a>
                    <button className="w-full border border-gray-200 dark:border-gray-700 text-gray-700 dark:text-gray-200 py-3 px-4 rounded-2xl font-medium hover:bg-gray-50 dark:hover:bg-gray-800 transition-colors duration-200 flex items-center justify-center gap-2">
                      <Calendar className="h-4 w-4" />
                      Đặt lịch tham quan
                    </button>
                  </div>
                </div>

                <div className="rounded-3xl bg-white dark:bg-gray-900 shadow-xl ring-1 ring-gray-100/70 dark:ring-gray-800/70 p-6 sm:p-8 space-y-4">
                  <h3 className="text-xl font-semibold text-gray-900 dark:text-white">Vị trí & an ninh</h3>
                  <div className="space-y-3 text-sm text-gray-600 dark:text-gray-300">
                    <div className="flex items-center gap-3">
                      <MapPin className="h-5 w-5 text-blue-500" />
                      <span>{building.address}</span>
                    </div>
                    <div className="flex items-center gap-3">
                      <ShieldCheck className="h-5 w-5 text-emerald-500" />
                      <span>An ninh 24/7 với kiểm soát ra vào</span>
                    </div>
                    <div className="flex items-center gap-3">
                      <Wifi className="h-5 w-5 text-purple-500" />
                      <span>Hạ tầng internet tốc độ cao</span>
                    </div>
                  </div>
                  <div className="h-48 rounded-2xl bg-gray-100 dark:bg-gray-800 flex items-center justify-center text-gray-500 dark:text-gray-400 text-sm">
                    Bản đồ đang được tích hợp
                  </div>
                  {building.latitude && building.longitude ? (
                    <a
                      href={`https://www.google.com/maps?q=${building.latitude},${building.longitude}`}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="text-sm font-medium text-blue-600 hover:text-blue-700 dark:text-blue-400"
                    >
                      Mở trong Google Maps
                    </a>
                  ) : null}
                </div>
              </div>
            </div>
          </div>
        </section>

        <section className="pb-24">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-6">
            <div className="flex flex-col gap-2 sm:flex-row sm:items-end sm:justify-between">
              <div>
                <p className="text-sm uppercase tracking-wide text-blue-500 dark:text-blue-300">Danh sách phòng</p>
                <h3 className="text-2xl font-semibold text-gray-900 dark:text-white">Chọn phòng phù hợp</h3>
                <p className="text-sm text-gray-500 dark:text-gray-400 mt-1">
                  {roomStats.availableCount} phòng trống · {rooms.length} phòng đang vận hành
                </p>
              </div>
              <div className="inline-flex items-center gap-2 text-sm text-gray-500 dark:text-gray-400">
                <BedDouble className="h-4 w-4" />
                Phòng tiêu chuẩn theo mô hình doanh nghiệp
              </div>
            </div>
            <BuildingRoomsList rooms={rooms} />
          </div>
        </section>
      </div>
    </div>
  )
}

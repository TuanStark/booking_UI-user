'use client'

import { useEffect, useMemo, useState } from 'react'
import Link from 'next/link'
import Image from 'next/image'
import {
  Calendar,
  MapPin,
  DollarSign,
  Loader2,
  Building2,
  ArrowRight,
  AlertCircle,
  ChevronDown,
  ChevronUp,
  Users,
  Bed,
  Bath,
  Square,
  Eye,
} from 'lucide-react'
import { useRequireAuth } from '@/hooks/useAuth'
import { useUser } from '@/contexts/UserContext'
import { BookingService } from '@/services/bookingService'
import { RoomService } from '@/services/roomService'
import { Room } from '@/types'
import { cn } from '@/lib/utils'

type BookingStatus = 'PENDING' | 'CONFIRMED' | 'CHECKED_IN' | 'CANCELLED' | 'COMPLETED'

interface BookingSummary {
  id: string
  roomId?: string
  roomName: string
  buildingName: string
  status: BookingStatus
  moveInDate?: string
  moveOutDate?: string
  price?: number
  createdAt?: string
}

const dateFormatter = new Intl.DateTimeFormat('vi-VN', { dateStyle: 'medium' })
const currencyFormatter = new Intl.NumberFormat('vi-VN', { style: 'currency', currency: 'VND' })

export default function BookingsPage() {
  const { isLoading: authLoading, isAuthenticated } = useRequireAuth()
  const { user, accessToken } = useUser()
  const [bookings, setBookings] = useState<BookingSummary[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    const fetchBookings = async () => {
      if (!accessToken || !isAuthenticated) {
        setBookings([])
        setLoading(false)
        return
      }
      setLoading(true)
      setError(null)
      try {
        const response = await BookingService.getUserBookings(accessToken)
        const normalized = (response || []).map(mapBookingToSummary)
        setBookings(normalized)
      } catch (err: any) {
        console.error(err)
        setError(err?.message || 'Không thể tải danh sách đặt phòng')
      } finally {
        setLoading(false)
      }
    }

    fetchBookings()
  }, [accessToken, isAuthenticated])

  const groupedBookings = useMemo(() => {
    return bookings.reduce(
      (acc, booking) => {
        const key = booking.status
        if (!acc[key]) {
          acc[key] = []
        }
        acc[key].push(booking)
        return acc
      },
      {} as Record<BookingStatus, BookingSummary[]>,
    )
  }, [bookings])

  if (authLoading) {
    return (
      <div className="min-h-[50vh] flex items-center justify-center">
        <Loader2 className="h-10 w-10 text-blue-500 animate-spin" />
      </div>
    )
  }

  if (!isAuthenticated) {
    return null
  }

  return (
    <div className="max-w-6xl mx-auto w-full px-4 md:px-6 pt-6 pb-12 space-y-6">
      <section className="bg-white dark:bg-gray-900 rounded-2xl shadow-md p-5 border border-gray-100 dark:border-gray-800">
        <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
          <div>
            <p className="text-xs uppercase tracking-[0.35em] text-gray-500 dark:text-gray-400">
              Quản lý đặt phòng
            </p>
            <h1 className="text-2xl md:text-3xl font-semibold text-gray-900 dark:text-white">
              Đơn đặt của {user?.name || user?.email}
            </h1>
            <p className="text-gray-600 dark:text-gray-400">
              Theo dõi trạng thái, lịch sử và thông tin chi tiết các phòng đã đặt
            </p>
          </div>
          <Link
            href="/buildings"
            className="inline-flex items-center gap-2 px-4 py-2 rounded-xl bg-blue-500 text-white font-semibold shadow-md hover:bg-blue-600 transition-colors"
          >
            <Building2 className="h-4 w-4" />
            Tiếp tục đặt phòng
          </Link>
        </div>
      </section>

      {error && (
        <div className="rounded-2xl border border-red-200 bg-red-50 dark:border-red-900/40 dark:bg-red-900/20 p-4 flex items-start gap-3 text-red-700 dark:text-red-300">
          <AlertCircle className="h-5 w-5 mt-0.5" />
          <div>
            <p className="font-medium">Không thể tải dữ liệu</p>
            <p className="text-sm opacity-80">{error}</p>
          </div>
        </div>
      )}

      {loading ? (
        <div className="min-h-[40vh] flex items-center justify-center">
          <Loader2 className="h-10 w-10 text-blue-500 animate-spin" />
        </div>
      ) : bookings.length === 0 ? (
        <div className="bg-white dark:bg-gray-900 rounded-2xl shadow-md p-10 text-center border border-gray-100 dark:border-gray-800">
          <Building2 className="h-14 w-14 text-gray-300 dark:text-gray-600 mx-auto mb-4" />
          <h2 className="text-2xl font-semibold text-gray-900 dark:text-white mb-2">
            Chưa có đơn đặt phòng nào
          </h2>
          <p className="text-gray-600 dark:text-gray-400 mb-6">
            Khi bạn đặt phòng, thông tin sẽ hiển thị tại đây để tiện theo dõi.
          </p>
          <Link
            href="/buildings"
            className="inline-flex items-center gap-2 px-4 py-2 rounded-xl bg-gradient-to-r from-blue-500 to-purple-600 text-white font-semibold shadow-lg hover:from-blue-600 hover:to-purple-700 transition-all"
          >
            Khám phá tòa nhà
            <ArrowRight className="h-4 w-4" />
          </Link>
        </div>
      ) : (
        <div className="space-y-6">
          {Object.entries(groupedBookings).map(([status, items]) => (
            <section key={status} className="space-y-4">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm uppercase tracking-widest text-gray-500 dark:text-gray-400">
                    {statusLabel[status as BookingStatus]?.subtitle}
                  </p>
                  <h2 className="text-2xl font-semibold text-gray-900 dark:text-white">
                    {statusLabel[status as BookingStatus]?.title}
                  </h2>
                </div>
                <span className="px-3 py-1 rounded-full text-sm bg-gray-100 dark:bg-gray-800 text-gray-600 dark:text-gray-300">
                  {items.length} đơn
                </span>
              </div>
              <div className="grid gap-4">
                {items.map((booking) => (
                  <BookingCard key={booking.id} booking={booking} />
                ))}
              </div>
            </section>
          ))}
        </div>
      )}
    </div>
  )
}

function BookingCard({ booking }: { booking: BookingSummary }) {
  const statusInfo = statusLabel[booking.status] || statusLabel.PENDING
  const [isExpanded, setIsExpanded] = useState(false)
  const [roomDetail, setRoomDetail] = useState<Room | null>(null)
  const [loadingRoom, setLoadingRoom] = useState(false)
  const [roomError, setRoomError] = useState<string | null>(null)

  const fetchRoomDetail = async () => {
    if (!booking.roomId || roomDetail) return

    setLoadingRoom(true)
    setRoomError(null)
    try {
      const room = await RoomService.getRoomById(booking.roomId)
      setRoomDetail(room)
    } catch (err: any) {
      setRoomError(err?.message || 'Không thể tải thông tin phòng')
    } finally {
      setLoadingRoom(false)
    }
  }

  const handleToggleExpand = () => {
    if (!isExpanded && !roomDetail && booking.roomId) {
      fetchRoomDetail()
    }
    setIsExpanded(!isExpanded)
  }

  return (
    <div className="bg-white dark:bg-gray-900 rounded-2xl shadow-md p-5 border border-gray-100 dark:border-gray-800">
      <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4 mb-4">
        <div className="flex-1">
          <p className="text-[0.65rem] uppercase tracking-[0.35em] text-gray-500 dark:text-gray-400">
            Mã đơn #{booking.id.slice(0, 8)}
          </p>
          <h3 className="text-xl font-semibold text-gray-900 dark:text-white">
            {booking.roomName}
          </h3>
          <p className="text-gray-600 dark:text-gray-400 flex items-center gap-2">
            <MapPin className="h-4 w-4" />
            {booking.buildingName}
          </p>
        </div>
        <div className="flex items-center gap-3">
          <span
            className={cn(
              'inline-flex items-center gap-2 px-4 py-1.5 rounded-full text-sm font-semibold w-fit',
              statusInfo.badgeClass,
            )}
          >
            <statusInfo.icon className="h-4 w-4" />
            {statusInfo.title}
          </span>
          {booking.roomId && (
            <button
              onClick={handleToggleExpand}
              className="inline-flex items-center gap-2 px-3 py-1.5 rounded-xl border border-gray-200 dark:border-gray-700 text-sm font-medium text-gray-700 dark:text-gray-200 hover:bg-gray-50 dark:hover:bg-gray-800 transition-colors"
            >
              {isExpanded ? (
                <>
                  <ChevronUp className="h-4 w-4" />
                  Thu gọn
                </>
              ) : (
                <>
                  <ChevronDown className="h-4 w-4" />
                  Chi tiết phòng
                </>
              )}
            </button>
          )}
        </div>
      </div>

      <div className="grid sm:grid-cols-3 gap-4 text-sm text-gray-600 dark:text-gray-400">
        <BookingMeta label="Ngày nhận phòng" value={formatDate(booking.moveInDate)} />
        <BookingMeta label="Ngày trả phòng" value={formatDate(booking.moveOutDate)} />
        <BookingMeta label="Tổng chi phí" value={formatPrice(booking.price)} />
      </div>

      {isExpanded && booking.roomId && (
        <div className="mt-5 pt-5 border-t border-gray-200 dark:border-gray-700">
          {loadingRoom ? (
            <div className="flex items-center justify-center py-8">
              <Loader2 className="h-6 w-6 text-blue-500 animate-spin" />
            </div>
          ) : roomError ? (
            <div className="rounded-xl border border-red-200 bg-red-50 dark:border-red-900/40 dark:bg-red-900/20 p-4 text-red-700 dark:text-red-300 text-sm">
              {roomError}
            </div>
          ) : roomDetail ? (
            <div className="space-y-5">
              {/* Room Image */}
              {roomDetail.images && roomDetail.images.length > 0 && (
                <div className="relative h-48 rounded-xl overflow-hidden">
                  <Image
                    src={roomDetail.images[0]}
                    alt={roomDetail.roomNumber}
                    fill
                    className="object-cover"
                  />
                </div>
              )}

              {/* Room Description */}
              {roomDetail.description && (
                <p className="text-sm text-gray-600 dark:text-gray-400 leading-relaxed">
                  {roomDetail.description}
                </p>
              )}

              {/* Room Specifications */}
              <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                <div className="p-3 rounded-xl bg-gray-50 dark:bg-gray-800/60 text-center">
                  <Square className="h-5 w-5 text-blue-500 mx-auto mb-2" />
                  <p className="text-xs text-gray-500 dark:text-gray-400 mb-1">Diện tích</p>
                  <p className="text-sm font-semibold text-gray-900 dark:text-white">
                    {roomDetail.size}
                  </p>
                </div>
                <div className="p-3 rounded-xl bg-gray-50 dark:bg-gray-800/60 text-center">
                  <Users className="h-5 w-5 text-green-500 mx-auto mb-2" />
                  <p className="text-xs text-gray-500 dark:text-gray-400 mb-1">Sức chứa</p>
                  <p className="text-sm font-semibold text-gray-900 dark:text-white">
                    {roomDetail.capacity}
                  </p>
                </div>
                <div className="p-3 rounded-xl bg-gray-50 dark:bg-gray-800/60 text-center">
                  <Bed className="h-5 w-5 text-purple-500 mx-auto mb-2" />
                  <p className="text-xs text-gray-500 dark:text-gray-400 mb-1">Giường</p>
                  <p className="text-sm font-semibold text-gray-900 dark:text-white">
                    {roomDetail.beds}
                  </p>
                </div>
                <div className="p-3 rounded-xl bg-gray-50 dark:bg-gray-800/60 text-center">
                  <Bath className="h-5 w-5 text-orange-500 mx-auto mb-2" />
                  <p className="text-xs text-gray-500 dark:text-gray-400 mb-1">Phòng tắm</p>
                  <p className="text-sm font-semibold text-gray-900 dark:text-white">
                    {roomDetail.bathrooms}
                  </p>
                </div>
              </div>

              {/* Amenities */}
              {roomDetail.amenities && roomDetail.amenities.length > 0 && (
                <div>
                  <p className="text-xs uppercase tracking-widest text-gray-500 dark:text-gray-400 mb-3">
                    Tiện nghi
                  </p>
                  <div className="flex flex-wrap gap-2">
                    {roomDetail.amenities.map((amenity, idx) => (
                      <span
                        key={idx}
                        className="px-3 py-1 rounded-full text-xs bg-blue-50 dark:bg-blue-900/30 text-blue-700 dark:text-blue-300"
                      >
                        {amenity}
                      </span>
                    ))}
                  </div>
                </div>
              )}

              {/* View Full Detail Link */}
              <Link
                href={`/rooms/${booking.roomId}`}
                className="inline-flex items-center gap-2 px-4 py-2 rounded-xl bg-gradient-to-r from-blue-500 to-purple-600 text-white text-sm font-semibold hover:from-blue-600 hover:to-purple-700 transition-all shadow-md hover:shadow-lg"
              >
                <Eye className="h-4 w-4" />
                Xem chi tiết đầy đủ
                <ArrowRight className="h-4 w-4" />
              </Link>
            </div>
          ) : null}
        </div>
      )}

      {booking.createdAt && (
        <p className="mt-4 text-xs uppercase tracking-widest text-gray-400">
          Tạo lúc {formatDate(booking.createdAt)}
        </p>
      )}
    </div>
  )
}

function BookingMeta({ label, value }: { label: string; value: string }) {
  return (
    <div className="p-4 rounded-2xl bg-gray-50 dark:bg-gray-800/60">
      <p className="text-xs uppercase tracking-widest text-gray-500 dark:text-gray-400 mb-1">
        {label}
      </p>
      <p className="text-base font-semibold text-gray-900 dark:text-white">{value}</p>
    </div>
  )
}

const statusLabel: Record<
  BookingStatus,
  { title: string; subtitle: string; badgeClass: string; icon: typeof Calendar }
> = {
  PENDING: {
    title: 'Đang xử lý',
    subtitle: 'Chờ xác nhận',
    badgeClass: 'bg-yellow-100 text-yellow-700',
    icon: Calendar,
  },
  CONFIRMED: {
    title: 'Đã xác nhận',
    subtitle: 'Sắp tới',
    badgeClass: 'bg-blue-100 text-blue-700',
    icon: Calendar,
  },
  CHECKED_IN: {
    title: 'Đang sử dụng',
    subtitle: 'Sinh viên đang ở',
    badgeClass: 'bg-emerald-100 text-emerald-700',
    icon: Calendar,
  },
  COMPLETED: {
    title: 'Hoàn tất',
    subtitle: 'Đơn đã kết thúc',
    badgeClass: 'bg-gray-100 text-gray-700',
    icon: Calendar,
  },
  CANCELLED: {
    title: 'Đã hủy',
    subtitle: 'Không còn hiệu lực',
    badgeClass: 'bg-rose-100 text-rose-700',
    icon: Calendar,
  },
}

function mapBookingToSummary(raw: any): BookingSummary {
  return {
    id: String(raw?.id || raw?.bookingId || crypto.randomUUID()),
    roomId: raw?.roomId || raw?.room?.id || undefined,
    roomName: raw?.room?.name || raw?.roomName || raw?.roomNumber || 'Phòng chưa đặt tên',
    buildingName:
      raw?.room?.building?.name || raw?.building?.name || raw?.buildingName || 'Không xác định',
    status: (raw?.status || 'PENDING').toUpperCase() as BookingStatus,
    moveInDate: raw?.moveInDate || raw?.startDate || raw?.checkInDate,
    moveOutDate: raw?.moveOutDate || raw?.endDate || raw?.checkOutDate,
    price: Number(raw?.totalPrice ?? raw?.price ?? 0),
    createdAt: raw?.createdAt || raw?.bookingDate,
  }
}

function formatDate(value?: string) {
  if (!value) return '—'
  const date = new Date(value)
  if (Number.isNaN(date.getTime())) return value
  return dateFormatter.format(date)
}

function formatPrice(value?: number) {
  if (!value) return '—'
  return currencyFormatter.format(value)
}


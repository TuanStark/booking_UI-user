'use client'

import { useEffect, useMemo, useState } from 'react'
import Link from 'next/link'
import {
  Calendar,
  MapPin,
  DollarSign,
  Loader2,
  Building2,
  ArrowRight,
  AlertCircle,
} from 'lucide-react'
import { useRequireAuth } from '@/hooks/useAuth'
import { useUser } from '@/contexts/UserContext'
import { BookingService } from '@/services/bookingService'
import { cn } from '@/lib/utils'

type BookingStatus = 'PENDING' | 'CONFIRMED' | 'CHECKED_IN' | 'CANCELLED' | 'COMPLETED'

interface BookingSummary {
  id: string
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
  return (
    <div className="bg-white dark:bg-gray-900 rounded-2xl shadow-md p-5 border border-gray-100 dark:border-gray-800">
      <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4 mb-4">
        <div>
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
        <span
          className={cn(
            'inline-flex items-center gap-2 px-4 py-1.5 rounded-full text-sm font-semibold w-fit',
            statusInfo.badgeClass,
          )}
        >
          <statusInfo.icon className="h-4 w-4" />
          {statusInfo.title}
        </span>
      </div>

      <div className="grid sm:grid-cols-3 gap-4 text-sm text-gray-600 dark:text-gray-400">
        <BookingMeta label="Ngày nhận phòng" value={formatDate(booking.moveInDate)} />
        <BookingMeta label="Ngày trả phòng" value={formatDate(booking.moveOutDate)} />
        <BookingMeta label="Tổng chi phí" value={formatPrice(booking.price)} />
      </div>

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


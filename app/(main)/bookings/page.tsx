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
  LayoutGrid,
  ClipboardList,
  CheckCircle2,
  Clock,
  XCircle,
  History,
  Smartphone,
  Info,
  Image as ImageIcon,
} from 'lucide-react'
import { useRequireAuth } from '@/hooks/useAuth'
import { useUser } from '@/contexts/UserContext'
import { BookingService } from '@/services/bookingService'
import { RoomService } from '@/services/roomService'
import { Room } from '@/types'
import { cn } from '@/utils/utils'

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
  room?: any
}

const dateFormatter = new Intl.DateTimeFormat('vi-VN', { dateStyle: 'medium' })
const currencyFormatter = new Intl.NumberFormat('vi-VN', {
  style: 'currency',
  currency: 'VND',
  maximumFractionDigits: 0,
})

const TABS: { id: BookingStatus | 'ALL'; label: string; icon: any }[] = [
  { id: 'ALL', label: 'Tất cả', icon: LayoutGrid },
  { id: 'PENDING', label: 'Đang xử lý', icon: Clock },
  { id: 'CONFIRMED', label: 'Đã xác nhận', icon: CheckCircle2 },
  { id: 'CHECKED_IN', label: 'Đang ở', icon: Smartphone },
  { id: 'CANCELLED', label: 'Đã hủy', icon: XCircle },
  { id: 'COMPLETED', label: 'Lịch sử', icon: History },
]

export default function BookingsPage() {
  const { isLoading: authLoading, isAuthenticated } = useRequireAuth()
  const { user, accessToken } = useUser()
  const [bookings, setBookings] = useState<BookingSummary[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [activeTab, setActiveTab] = useState<BookingStatus | 'ALL'>('ALL')

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
        setBookings(normalized.sort((a: any, b: any) =>
          new Date(b.createdAt || 0).getTime() - new Date(a.createdAt || 0).getTime()
        ))
      } catch (err: any) {
        console.error(err)
        setError(err?.message || 'Không thể tải danh sách đặt phòng')
      } finally {
        setLoading(false)
      }
    }

    fetchBookings()
  }, [accessToken, isAuthenticated])

  const filteredBookings = useMemo(() => {
    if (activeTab === 'ALL') return bookings
    return bookings.filter((b) => b.status === activeTab)
  }, [bookings, activeTab])

  const stats = useMemo(() => {
    return {
      total: bookings.length,
      active: bookings.filter(b => ['CONFIRMED', 'CHECKED_IN'].includes(b.status)).length,
      pending: bookings.filter(b => b.status === 'PENDING').length
    }
  }, [bookings])

  if (authLoading) {
    return (
      <div className="min-h-[70vh] flex items-center justify-center">
        <div className="relative">
          <div className="h-24 w-24 rounded-full border-t-4 border-b-4 border-blue-500 animate-spin"></div>
          <Loader2 className="h-10 w-10 text-blue-500 absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2" />
        </div>
      </div>
    )
  }

  if (!isAuthenticated) return null

  return (
    <div className="min-h-screen bg-[#F8FAFC] dark:bg-[#0F172A] pb-24">
      {/* Premium Header */}
      <div className="relative bg-white dark:bg-[#1E293B] border-b border-slate-200 dark:border-slate-800 pt-10 pb-20 overflow-hidden">
        {/* Decorative elements */}
        <div className="absolute top-0 right-0 w-96 h-96 bg-blue-400/10 rounded-full blur-3xl -mr-48 -mt-48"></div>
        <div className="absolute bottom-0 left-0 w-72 h-72 bg-purple-400/10 rounded-full blur-3xl -ml-36 -mb-36"></div>

        <div className="max-w-7xl mx-auto px-4 md:px-6 relative z-10">
          <div className="flex flex-col lg:flex-row lg:items-end justify-between gap-8">
            <div className="space-y-4">
              <nav className="flex items-center gap-2 text-xs font-bold uppercase tracking-widest text-blue-600 dark:text-blue-400">
                <ClipboardList className="h-4 w-4" />
                {/* <span>Dashboard</span>
                <span className="h-1.5 w-1.5 rounded-full bg-slate-300"></span> */}
                <span>My Bookings</span>
              </nav>
              <h1 className="text-4xl md:text-5xl font-extrabold text-slate-900 dark:text-white tracking-tight">
                Xin chào, <span className="text-transparent bg-clip-text bg-gradient-to-r from-blue-600 to-indigo-600 dark:from-blue-400 dark:to-indigo-400">{user?.name || 'User'}</span>
              </h1>
              <p className="text-lg text-slate-600 dark:text-slate-400 max-w-2xl leading-relaxed">
                Bạn đang có <span className="font-bold text-slate-900 dark:text-white">{stats.active} đơn đặt phòng</span> đang hoạt động và {stats.pending} đơn chờ xử lý.
              </p>
            </div>

            <div className="flex flex-wrap gap-4">
              <HeaderStat icon={LayoutGrid} label="Tổng đơn" value={stats.total} color="blue" />
              <HeaderStat icon={CheckCircle2} label="Đang ở" value={stats.active} color="emerald" />
              <HeaderStat icon={Clock} label="Chờ xử lý" value={stats.pending} color="amber" />
            </div>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 md:px-6 -mt-10 relative z-20">
        {/* Error State */}
        {error && (
          <div className="mb-8 p-4 rounded-2xl bg-rose-50 dark:bg-rose-900/20 border border-rose-200 dark:border-rose-800/50 flex items-center gap-4 text-rose-700 dark:text-rose-300 animate-in fade-in slide-in-from-top-4 duration-500">
            <div className="h-10 w-10 rounded-full bg-rose-100 dark:bg-rose-900/40 flex items-center justify-center shrink-0">
              <AlertCircle className="h-6 w-6" />
            </div>
            <div>
              <p className="font-bold">Đã xảy ra lỗi</p>
              <p className="text-sm opacity-90">{error}</p>
            </div>
          </div>
        )}

        {/* Dynamic Tabs Navigation */}
        <div className="flex overflow-x-auto pb-4 gap-2 no-scrollbar mb-8">
          {TABS.map((tab) => {
            const Icon = tab.icon
            const isActive = activeTab === tab.id
            const count = tab.id === 'ALL' ? bookings.length : bookings.filter(b => b.status === tab.id).length

            return (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id)}
                className={cn(
                  "flex items-center gap-2.5 px-6 py-3.5 rounded-2xl font-bold whitespace-nowrap transition-all duration-300 text-sm shadow-sm",
                  isActive
                    ? "bg-slate-900 text-white dark:bg-blue-600 dark:text-white ring-4 ring-slate-900/5 dark:ring-blue-600/20"
                    : "bg-white dark:bg-[#1E293B] text-slate-500 dark:text-slate-400 border border-slate-200 dark:border-slate-800 hover:border-slate-300 dark:hover:border-slate-700"
                )}
              >
                <Icon className={cn("h-5 w-5", isActive ? "text-white" : "text-slate-400")} />
                {tab.label}
                <span className={cn(
                  "px-2 py-0.5 rounded-lg text-xs",
                  isActive ? "bg-white/20 text-white" : "bg-slate-100 dark:bg-slate-800 text-slate-500"
                )}>
                  {count}
                </span>
              </button>
            )
          })}
        </div>

        {/* Content Section */}
        {loading ? (
          <div className="grid gap-6">
            {[1, 2, 3].map(i => (
              <div key={i} className="h-44 rounded-3xl bg-white dark:bg-[#1E293B] animate-pulse border border-slate-200 dark:border-slate-800"></div>
            ))}
          </div>
        ) : filteredBookings.length === 0 ? (
          <div className="bg-white dark:bg-[#1E293B] rounded-[2.5rem] shadow-xl shadow-slate-200/50 dark:shadow-none p-16 text-center border border-slate-100 dark:border-slate-800 max-w-2xl mx-auto">
            <div className="relative inline-block mb-8">
              <div className="h-24 w-24 rounded-full bg-blue-50 dark:bg-blue-900/20 flex items-center justify-center">
                <ClipboardList className="h-12 w-12 text-blue-500" />
              </div>
              <div className="absolute -top-2 -right-2 h-8 w-8 rounded-full bg-white dark:bg-slate-800 flex items-center justify-center shadow-lg">
                <Info className="h-4 w-4 text-slate-400" />
              </div>
            </div>
            <h2 className="text-3xl font-bold text-slate-900 dark:text-white mb-4">
              Không tìm thấy đơn đặt phòng
            </h2>
            <p className="text-slate-500 dark:text-slate-400 mb-10 text-lg">
              Bạn chưa có đơn đặt phòng nào trong danh mục này. Hãy bắt đầu hành trình của bạn bằng cách chọn một phòng ưng ý nhé!
            </p>
            <Link
              href="/buildings"
              className="inline-flex items-center gap-3 px-8 py-4 rounded-2xl bg-gradient-to-r from-blue-600 to-indigo-600 text-white font-bold shadow-xl shadow-blue-500/20 hover:scale-[1.02] active:scale-[0.98] transition-all duration-300"
            >
              Xem danh sách phòng ngay
              <ArrowRight className="h-5 w-5" />
            </Link>
          </div>
        ) : (
          <div className="grid gap-6">
            {filteredBookings.map((booking, index) => (
              <div
                key={booking.id}
                className="animate-in fade-in slide-in-from-bottom-8 duration-500 fill-mode-both"
                style={{ animationDelay: `${index * 100}ms` }}
              >
                <BookingCard booking={booking} />
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  )
}

function HeaderStat({ icon: Icon, label, value, color }: { icon: any; label: string; value: number; color: 'blue' | 'emerald' | 'amber' }) {
  const colors = {
    blue: 'bg-blue-50 dark:bg-blue-900/20 text-blue-600 dark:text-blue-400',
    emerald: 'bg-emerald-50 dark:bg-emerald-900/20 text-emerald-600 dark:text-emerald-400',
    amber: 'bg-amber-50 dark:bg-amber-900/20 text-amber-600 dark:text-amber-400'
  }

  return (
    <div className="bg-white dark:bg-[#1E293B] p-4 pr-10 rounded-[1.5rem] border border-slate-200 dark:border-slate-800 shadow-sm flex items-center gap-4">
      <div className={cn("h-12 w-12 rounded-2xl flex items-center justify-center", colors[color])}>
        <Icon className="h-6 w-6" />
      </div>
      <div>
        <p className="text-xs font-bold text-slate-400 uppercase tracking-widest">{label}</p>
        <p className="text-2xl font-black text-slate-900 dark:text-white">{value}</p>
      </div>
    </div>
  )
}

function BookingCard({ booking }: { booking: BookingSummary & { room?: any } }) {
  const statusInfo = statusLabel[booking.status] || statusLabel.PENDING
  const [isExpanded, setIsExpanded] = useState(false)
  const [roomDetail, setRoomDetail] = useState<Room | null>(booking.room || null)
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
    <div className={cn(
      "group bg-white dark:bg-[#1D283A] rounded-[2rem] border transition-all duration-500 flex flex-col overflow-hidden",
      isExpanded
        ? "border-blue-500/50 dark:border-blue-400/30 ring-4 ring-blue-500/5 dark:ring-blue-400/5"
        : "border-slate-100 dark:border-slate-800 hover:border-slate-300 dark:hover:border-slate-700 shadow-xl shadow-slate-200/30 dark:shadow-none hover:shadow-2xl hover:shadow-slate-300/40 dark:hover:shadow-none"
    )}>
      {/* Card Body */}
      <div className="p-6 md:p-8">
        <div className="flex flex-col xl:flex-row xl:items-center justify-between gap-8">
          <div className="flex flex-col md:flex-row items-start md:items-center gap-6">
            {/* Room Image Shortcut */}
            {booking.room?.images?.[0] ? (
              <div className="h-20 w-20 md:h-24 md:w-24 rounded-2xl overflow-hidden shrink-0 border border-slate-100 dark:border-slate-800">
                <Image src={booking.room.images[0]} alt="" width={100} height={100} className="h-full w-full object-cover transition-transform duration-500 group-hover:scale-110" />
              </div>
            ) : (
              <div className="h-20 w-20 md:h-24 md:w-24 rounded-2xl bg-slate-100 dark:bg-slate-800 flex items-center justify-center shrink-0">
                <Building2 className="h-8 w-8 text-slate-300" />
              </div>
            )}

            <div>
              <div className="flex items-center gap-3 mb-2">
                <span className="text-[0.65rem] font-black uppercase tracking-[0.3em] text-slate-400 bg-slate-100 dark:bg-slate-800 px-2 py-0.5 rounded-md">
                  #{booking.id.slice(0, 8)}
                </span>
                <p className="text-xs font-bold text-slate-400 flex items-center gap-1.5">
                  <Clock className="h-3 w-3" />
                  {booking.createdAt ? `Tạo lúc ${formatDate(booking.createdAt)}` : 'N/A'}
                </p>
              </div>
              <h3 className="text-2xl font-black text-slate-900 dark:text-white group-hover:text-blue-600 dark:group-hover:text-blue-400 transition-colors">
                {booking.roomName}
              </h3>
              <div className="flex items-center gap-4 mt-2">
                <p className="text-slate-500 dark:text-slate-400 flex items-center gap-1.5 font-medium">
                  <MapPin className="h-4 w-4 text-rose-500" />
                  {booking.buildingName}
                </p>
                <div className="h-1 w-1 rounded-full bg-slate-300 dark:bg-slate-700"></div>
                <div className={cn(
                  "flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-bold ring-1 ring-inset",
                  statusInfo.badgeClass
                )}>
                  <statusInfo.icon className="h-3.5 w-3.5" />
                  {statusInfo.title}
                </div>
              </div>
            </div>
          </div>

          <div className="flex flex-col sm:flex-row items-start sm:items-center gap-10 xl:border-l xl:border-slate-100 dark:xl:border-slate-800 xl:pl-10">
            <div className="grid grid-cols-2 gap-8 md:gap-12">
              <div className="space-y-1">
                <p className="text-[0.65rem] font-black uppercase tracking-widest text-slate-400">Nhận phòng</p>
                <p className="text-slate-900 dark:text-white font-black">{formatDate(booking.moveInDate)}</p>
              </div>
              <div className="space-y-1">
                <p className="text-[0.65rem] font-black uppercase tracking-widest text-slate-400">Tổng phí</p>
                <p className="text-blue-600 dark:text-blue-400 font-extrabold text-lg">{formatPrice(booking.price)}</p>
              </div>
            </div>

            <div className="flex gap-3 w-full sm:w-auto">
              {booking.roomId && (
                <button
                  onClick={handleToggleExpand}
                  className={cn(
                    "flex-1 sm:flex-none inline-flex items-center justify-center gap-2.5 px-6 py-4 rounded-2xl font-bold transition-all duration-300 text-sm",
                    isExpanded
                      ? "bg-slate-900 text-white dark:bg-slate-700 dark:text-white"
                      : "bg-slate-50 text-slate-900 dark:bg-slate-800 dark:text-white hover:bg-slate-100 dark:hover:bg-slate-700"
                  )}
                >
                  {isExpanded ? <ChevronUp className="h-5 w-5" /> : <ChevronDown className="h-5 w-5" />}
                  {isExpanded ? 'Thu gọn' : 'Chi tiết'}
                </button>
              )}
              <Link
                href={`/rooms/${booking.roomId}`}
                className="inline-flex items-center justify-center h-12 w-12 rounded-2xl bg-blue-50 dark:bg-blue-900/20 text-blue-600 dark:text-blue-400 hover:bg-blue-600 hover:text-white dark:hover:bg-blue-600 dark:hover:text-white transition-all duration-300"
                title="Xem trang phòng"
              >
                <ArrowRight className="h-5 w-5" />
              </Link>
            </div>
          </div>
        </div>
      </div>

      {/* Expanded Content */}
      {isExpanded && booking.roomId && (
        <div className="px-6 md:px-8 pb-8 pt-2 animate-in slide-in-from-top-4 duration-500">
          <div className="h-px w-full bg-slate-100 dark:bg-slate-800 mb-8"></div>

          {loadingRoom ? (
            <div className="flex flex-col items-center justify-center py-16 gap-4">
              <div className="relative">
                <div className="h-16 w-16 rounded-full border-t-2 border-slate-200 animate-spin"></div>
                <Loader2 className="h-8 w-8 text-blue-500 absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2" />
              </div>
              <p className="text-slate-400 font-bold text-sm tracking-widest uppercase">Đang tải cấu hình phòng...</p>
            </div>
          ) : roomError ? (
            <div className="rounded-2xl bg-rose-50 dark:bg-rose-900/10 p-6 flex items-center gap-4 text-rose-700 dark:text-rose-400 border border-rose-100 dark:border-rose-900/20">
              <AlertCircle className="h-6 w-6" />
              <p className="font-bold">{roomError}</p>
            </div>
          ) : roomDetail ? (
            <div className="grid grid-cols-1 lg:grid-cols-12 gap-10">
              {/* Left Column: Image & Desc */}
              <div className="lg:col-span-5 space-y-6">
                <div className="relative h-64 md:h-72 rounded-[2rem] overflow-hidden group/img border border-slate-100 dark:border-slate-800 shadow-2xl shadow-slate-200/40 dark:shadow-none">
                  {roomDetail.images?.[0] ? (
                    <Image
                      src={roomDetail.images[0]}
                      alt={roomDetail.roomNumber}
                      fill
                      className="object-cover transition-transform duration-700 group-hover/img:scale-110"
                    />
                  ) : (
                    <div className="w-full h-full bg-slate-100 dark:bg-slate-800 flex items-center justify-center">
                      <ImageIcon className="h-16 w-16 text-slate-300" />
                    </div>
                  )}
                  <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent flex items-end p-6">
                    <p className="text-white font-bold text-lg">{roomDetail.type}</p>
                  </div>
                </div>

                <p className="text-slate-600 dark:text-slate-400 leading-relaxed font-medium bg-slate-50 dark:bg-slate-800/40 p-6 rounded-2xl italic">
                  "{roomDetail.description}"
                </p>
              </div>

              {/* Right Column: Key Metrics & Amenities */}
              <div className="lg:col-span-7 space-y-8">
                <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
                  <MetricCard icon={Square} label="Diện tích" value={roomDetail.size} active />
                  <MetricCard icon={Users} label="Sức chứa" value={`${roomDetail.capacity} người`} />
                  <MetricCard icon={Bed} label="Giường" value={roomDetail.beds} />
                  <MetricCard icon={Bath} label="Phòng tắm" value={roomDetail.bathrooms} />
                </div>

                {roomDetail.amenities && roomDetail.amenities.length > 0 && (
                  <div className="space-y-4">
                    <div className="flex items-center gap-2">
                      <LayoutGrid className="h-4 w-4 text-blue-500" />
                      <p className="text-xs font-black uppercase tracking-widest text-slate-400">
                        Hệ sinh thái tiện ích
                      </p>
                    </div>
                    <div className="flex flex-wrap gap-2.5">
                      {roomDetail.amenities.map((amenity, idx) => (
                        <div
                          key={idx}
                          className="flex items-center gap-2 px-4 py-2 rounded-2xl text-xs font-bold bg-white dark:bg-[#243146] text-slate-700 dark:text-slate-300 border border-slate-100 dark:border-slate-800 shadow-sm transition-all hover:border-blue-500/30 hover:shadow-md hover:shadow-blue-500/5"
                        >
                          <div className="h-1.5 w-1.5 rounded-full bg-blue-500"></div>
                          {amenity}
                        </div>
                      ))}
                    </div>
                  </div>
                )}

                <div className="pt-4 flex flex-col sm:flex-row gap-4">
                  <Link
                    href={`/rooms/${booking.roomId}`}
                    className="flex-1 inline-flex items-center justify-center gap-3 px-8 py-4 rounded-[1.25rem] bg-slate-900 dark:bg-white text-white dark:text-slate-900 font-black hover:scale-[1.03] active:scale-[0.97] transition-all shadow-xl shadow-slate-900/10"
                  >
                    <Eye className="h-5 w-5" />
                    Khám phá chi tiết phòng
                  </Link>
                  <button className="flex-1 inline-flex items-center justify-center gap-3 px-8 py-4 rounded-[1.25rem] bg-white dark:bg-slate-800 text-slate-900 dark:text-white border border-slate-200 dark:border-slate-700 font-bold hover:bg-slate-50 dark:hover:bg-slate-700 transition-all">
                    Liên hệ quản lý
                  </button>
                </div>
              </div>
            </div>
          ) : null}
        </div>
      )}
    </div>
  )
}

function MetricCard({ icon: Icon, label, value, active = false }: { icon: any; label: string; value: string; active?: boolean }) {
  return (
    <div className={cn(
      "p-5 rounded-3xl border text-center transition-all duration-300",
      active
        ? "bg-blue-600 dark:bg-blue-600 border-blue-500 text-white shadow-lg shadow-blue-500/20"
        : "bg-slate-50 dark:bg-[#243146] border-slate-100 dark:border-slate-800 text-slate-500 dark:text-slate-400"
    )}>
      <Icon className={cn("h-6 w-6 mx-auto mb-3", active ? "text-white" : "text-blue-500")} />
      <p className={cn("text-[0.6rem] font-black uppercase tracking-widest mb-1", active ? "text-blue-100" : "text-slate-400")}>{label}</p>
      <p className={cn("font-black text-sm", active ? "text-white" : "text-slate-900 dark:text-white")}>{value}</p>
    </div>
  )
}

const statusLabel: Record<
  BookingStatus,
  { title: string; subtitle: string; badgeClass: string; icon: any }
> = {
  PENDING: {
    title: 'Đang xử lý',
    subtitle: 'Chờ xác nhận',
    badgeClass: 'bg-amber-50 dark:bg-amber-900/20 text-amber-600 dark:text-amber-400 ring-amber-500/20',
    icon: Clock,
  },
  CONFIRMED: {
    title: 'Đã xác nhận',
    subtitle: 'Sắp tới',
    badgeClass: 'bg-blue-50 dark:bg-blue-900/20 text-blue-600 dark:text-blue-400 ring-blue-500/20',
    icon: CheckCircle2,
  },
  CHECKED_IN: {
    title: 'Đang sử dụng',
    subtitle: 'Sinh viên đang ở',
    badgeClass: 'bg-emerald-50 dark:bg-emerald-900/20 text-emerald-600 dark:text-emerald-400 ring-emerald-500/20',
    icon: Smartphone,
  },
  COMPLETED: {
    title: 'Hoàn tất',
    subtitle: 'Đơn đã kết thúc',
    badgeClass: 'bg-slate-50 dark:bg-slate-800 text-slate-600 dark:text-slate-400 ring-slate-500/20',
    icon: History,
  },
  CANCELLED: {
    title: 'Đã hủy',
    subtitle: 'Không còn hiệu lực',
    badgeClass: 'bg-rose-50 dark:bg-rose-900/20 text-rose-600 dark:text-rose-400 ring-rose-500/20',
    icon: XCircle,
  },
}

function normalizeRoom(raw: any): Room | null {
  if (!raw) return null
  return {
    ...raw,
    roomNumber: raw.name || raw.roomNumber || '—',
    size: raw.size || (raw.squareMeter ? `${raw.squareMeter}m²` : '—'),
    capacity: String(raw.capacity || '—'),
    beds: String(raw.beds || raw.bedCount || '—'),
    bathrooms: String(raw.bathrooms || raw.bathroomCount || '—'),
    images: Array.isArray(raw.images)
      ? raw.images.map((img: any) => typeof img === 'string' ? img : img.imageUrl)
      : [],
    amenities: Array.isArray(raw.amenities)
      ? raw.amenities.map((a: any) => typeof a === 'string' ? a : a.name)
      : []
  }
}

function mapBookingToSummary(raw: any): BookingSummary & { room?: any } {
  const detail = raw?.details?.[0] || {}
  const room = detail?.room || {}

  return {
    id: String(raw?.id || raw?.bookingId || crypto.randomUUID()),
    roomId: raw?.roomId || room?.id || undefined,
    roomName: room?.name || raw?.roomName || raw?.roomNumber || 'Phòng chưa đặt tên',
    buildingName:
      room?.building?.name || raw?.building?.name || raw?.buildingName || 'Không xác định',
    status: (raw?.status || 'PENDING').toUpperCase() as BookingStatus,
    moveInDate: raw?.startDate || raw?.moveInDate || raw?.checkInDate,
    moveOutDate: raw?.endDate || raw?.moveOutDate || raw?.checkOutDate,
    price: Number(raw?.totalPrice ?? (detail?.price && detail?.time ? detail.price * detail.time : detail?.price || 0)),
    createdAt: raw?.createdAt || raw?.bookingDate,
    room: normalizeRoom(room)
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


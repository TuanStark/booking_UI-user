'use client'

import { useMemo, useState } from 'react'
import {
  addMonths,
  eachDayOfInterval,
  endOfMonth,
  endOfWeek,
  format,
  isSameMonth,
  isToday,
  startOfDay,
  startOfMonth,
  startOfWeek,
} from 'date-fns'
import { vi as viLocale } from 'date-fns/locale'
import { CalendarDays, ChevronLeft, ChevronRight, GanttChartSquare, Loader2 } from 'lucide-react'
import { cn } from '@/utils/utils'
import {
  dayAllowsCheckInPick,
  dayIsFullyBooked,
  dayIsPartiallyBooked,
  dayRemainingSlots,
  EXPIRING_SOON_LEAD_DAYS,
  getExpiringSoonLeaseEndYmd,
  type OccupancySlice,
} from '@/utils/roomOccupancy'
import {
  formatDateInputValue,
  parseLocalDateFromInput,
  startOfTodayLocal,
} from '@/utils/bookingDates'
import { RoomAvailabilityTimeline } from '@/components/rooms/RoomAvailabilityTimeline'

const WEEKDAYS = ['T2', 'T3', 'T4', 'T5', 'T6', 'T7', 'CN']

type ViewTab = 'month' | 'timeline'

export interface RoomAvailabilityCalendarProps {
  occupancySlices: OccupancySlice[]
  /** Số chỗ tối đa của phòng (từ room.capacity) */
  roomCapacity?: number
  isLoading?: boolean
  error?: string | null
  onPickCheckIn: (moveInYmd: string) => void
  canBook?: boolean
}

export function RoomAvailabilityCalendar({
  occupancySlices,
  roomCapacity = 1,
  isLoading = false,
  error = null,
  onPickCheckIn,
  canBook = true,
}: RoomAvailabilityCalendarProps) {
  const cap = Math.max(1, Math.floor(roomCapacity) || 1)
  const [viewMonth, setViewMonth] = useState(() => startOfMonth(new Date()))
  const [tab, setTab] = useState<ViewTab>('month')

  const weeks = useMemo(() => {
    const monthStart = startOfMonth(viewMonth)
    const monthEnd = endOfMonth(viewMonth)
    const gridStart = startOfWeek(monthStart, { weekStartsOn: 1 })
    const gridEnd = endOfWeek(monthEnd, { weekStartsOn: 1 })
    const days = eachDayOfInterval({ start: gridStart, end: gridEnd })
    const rows: { date: Date; inMonth: boolean }[][] = []
    for (let i = 0; i < days.length; i += 7) {
      rows.push(
        days.slice(i, i + 7).map((date) => ({
          date,
          inMonth: isSameMonth(date, viewMonth),
        })),
      )
    }
    return rows
  }, [viewMonth])

  const todayMs = startOfTodayLocal().getTime()

  const expiringLeaseEndYmd = useMemo(
    () => getExpiringSoonLeaseEndYmd(occupancySlices),
    [occupancySlices],
  )
  const expiringLeaseEndLabel = useMemo(() => {
    if (!expiringLeaseEndYmd) return ''
    const d = parseLocalDateFromInput(expiringLeaseEndYmd)
    return d ? format(d, 'dd/MM/yyyy', { locale: viLocale }) : expiringLeaseEndYmd
  }, [expiringLeaseEndYmd])

  const handleDayClick = (date: Date) => {
    if (isLoading) return
    if (!dayAllowsCheckInPick(date, cap, occupancySlices)) return
    onPickCheckIn(formatDateInputValue(date))
  }

  const monthLabel = format(viewMonth, 'LLLL yyyy', { locale: viLocale })

  return (
    <div className="rounded-2xl border border-gray-200 bg-white shadow-sm dark:border-gray-700 dark:bg-gray-800 overflow-hidden">
      {/* Tiêu đề + hướng dẫn (giống layout tham chiếu: text trước, điều hướng bên dưới) */}
      <div className="border-b border-gray-100 dark:border-gray-700 px-4 sm:px-5 py-4 space-y-4">
        <div>
          <h2 className="text-lg font-bold text-gray-900 dark:text-white tracking-tight">
            Lịch khả dụng
          </h2>
          <p className="text-xs sm:text-sm text-gray-500 dark:text-gray-400 mt-1.5 leading-relaxed max-w-2xl">
            <span className="font-medium text-gray-600 dark:text-gray-300">Ô gạch</span> — đã có lượt đặt
            (không hiển thị thông tin cá nhân).{' '}
            <span className="font-medium text-emerald-700 dark:text-emerald-400">Ô xanh / vùng trống trên dòng thời gian</span>{' '}
            — bấm để chọn <span className="font-medium text-gray-700 dark:text-gray-200">ngày nhận phòng</span>; form đặt phòng
            sẽ mở và điền sẵn ngày bắt đầu (tối thiểu 90 ngày lưu trú).{' '}
            <span className="font-medium text-sky-800 dark:text-sky-200">Ô xanh da trời</span> — có thể{' '}
            <span className="font-medium text-gray-700 dark:text-gray-200">đặt trước</span> khi hợp đồng hiện tại sắp kết thúc
            (trong ~{EXPIRING_SOON_LEAD_DAYS} ngày cuối), ngày nhận gần ngày trả dự kiến.
          </p>
        </div>

        {!isLoading && expiringLeaseEndYmd && (
          <div className="rounded-xl border border-sky-200/90 bg-sky-50/95 px-3 py-2.5 text-xs sm:text-sm text-sky-950 dark:border-sky-800/60 dark:bg-sky-950/35 dark:text-sky-100">
            <span className="font-semibold">Đặt trước đang mở:</span> hợp đồng hiện tại dự kiến trả phòng khoảng{' '}
            <span className="tabular-nums font-medium">{expiringLeaseEndLabel}</span>. Bạn có thể chọn ngày nhận trong cửa sổ
            gần ngày đó; đơn có thể ở trạng thái &quot;Đặt trước&quot; cho tới khi phòng sẵn sàng (người đang ở được ưu tiên gia hạn).
          </div>
        )}

        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3">
          <div
            className="inline-flex p-1 rounded-xl bg-gray-100/90 dark:bg-gray-900/60 border border-gray-200/80 dark:border-gray-600"
            role="tablist"
            aria-label="Kiểu xem lịch"
          >
            <button
              type="button"
              role="tab"
              aria-selected={tab === 'month'}
              onClick={() => setTab('month')}
              className={cn(
                'inline-flex items-center gap-1.5 px-3 py-2 rounded-lg text-xs sm:text-sm font-medium transition-all',
                tab === 'month'
                  ? 'bg-white dark:bg-gray-800 text-gray-900 dark:text-white shadow-sm ring-1 ring-gray-200/80 dark:ring-gray-600'
                  : 'text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:hover:text-white',
              )}
            >
              <CalendarDays className="h-4 w-4 shrink-0 opacity-80" />
              Theo tháng
            </button>
            <button
              type="button"
              role="tab"
              aria-selected={tab === 'timeline'}
              onClick={() => setTab('timeline')}
              className={cn(
                'inline-flex items-center gap-1.5 px-3 py-2 rounded-lg text-xs sm:text-sm font-medium transition-all',
                tab === 'timeline'
                  ? 'bg-white dark:bg-gray-800 text-gray-900 dark:text-white shadow-sm ring-1 ring-gray-200/80 dark:ring-gray-600'
                  : 'text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:hover:text-white',
              )}
            >
              <GanttChartSquare className="h-4 w-4 shrink-0 opacity-80" />
              Dòng thời gian
            </button>
          </div>

          {tab === 'month' && (
            <div className="flex items-center justify-center sm:justify-end gap-1 flex-wrap">
              <button
                type="button"
                onClick={() => setViewMonth((m) => startOfMonth(addMonths(m, -1)))}
                className="p-2 rounded-xl border border-gray-200 dark:border-gray-600 hover:bg-gray-50 dark:hover:bg-gray-700 text-gray-700 dark:text-gray-200 transition-colors"
                aria-label="Tháng trước"
              >
                <ChevronLeft className="h-4 w-4" />
              </button>
              <span className="min-w-[10rem] text-center text-sm font-semibold capitalize text-gray-900 dark:text-white px-2">
                {monthLabel}
              </span>
              <button
                type="button"
                onClick={() => setViewMonth((m) => startOfMonth(addMonths(m, 1)))}
                className="p-2 rounded-xl border border-gray-200 dark:border-gray-600 hover:bg-gray-50 dark:hover:bg-gray-700 text-gray-700 dark:text-gray-200 transition-colors"
                aria-label="Tháng sau"
              >
                <ChevronRight className="h-4 w-4" />
              </button>
              <button
                type="button"
                onClick={() => setViewMonth(startOfMonth(new Date()))}
                className="ml-0 sm:ml-1 px-3 py-2 text-xs font-semibold rounded-xl bg-gray-900 text-white dark:bg-gray-100 dark:text-gray-900 hover:opacity-90 transition-opacity"
              >
                Hôm nay
              </button>
            </div>
          )}
        </div>
      </div>

      {error && (
        <p className="text-xs text-amber-800 dark:text-amber-200 px-4 sm:px-5 py-2.5 bg-amber-50 dark:bg-amber-950/35 border-b border-amber-100 dark:border-amber-900/40">
          {error} — lịch có thể không đầy đủ; vui lòng tải lại trang sau.
        </p>
      )}

      <div className="p-3 sm:p-5">
        {isLoading ? (
          <div className="flex flex-col items-center justify-center gap-2 py-20 text-gray-500 dark:text-gray-400 text-sm">
            <Loader2 className="h-8 w-8 animate-spin text-emerald-600 dark:text-emerald-400" />
            Đang tải lịch phòng…
          </div>
        ) : tab === 'timeline' ? (
          <RoomAvailabilityTimeline
            occupancySlices={occupancySlices}
            roomCapacity={cap}
            isLoading={isLoading}
            canBook={canBook}
            onPickCheckIn={onPickCheckIn}
          />
        ) : (
          <div className="overflow-x-auto -mx-1 px-1">
            {/* Một grid 7 cột chung: header + tất cả ô — tránh lệch cột do mỗi hàng grid riêng */}
            <div className="mx-auto w-full min-w-[280px] max-w-md sm:mx-0 sm:max-w-none">
              <div className="grid w-full grid-cols-7 gap-1.5 sm:gap-2">
                {WEEKDAYS.map((d) => (
                  <div
                    key={d}
                    className="min-w-0 pb-1 text-center text-[11px] sm:text-xs font-bold uppercase tracking-wide text-gray-400 dark:text-gray-500"
                  >
                    {d}
                  </div>
                ))}
                {weeks.flatMap((row) =>
                  row.map(({ date, inMonth }) => {
                    const rem = dayRemainingSlots(date, cap, occupancySlices)
                    const full = dayIsFullyBooked(date, cap, occupancySlices)
                    const partial = dayIsPartiallyBooked(date, cap, occupancySlices)
                    const past = startOfDay(date).getTime() < todayMs
                    const allowsPick = dayAllowsCheckInPick(date, cap, occupancySlices)
                    const preBookOnly = full && allowsPick
                    const clickable = !isLoading && inMonth && allowsPick
                    const looksAvailable =
                      clickable && canBook && !full && !partial
                    const looksPreBook = clickable && preBookOnly

                    return (
                      <button
                        key={date.toISOString()}
                        type="button"
                        disabled={!clickable}
                        onClick={() => handleDayClick(date)}
                        title={
                          past
                            ? 'Ngày đã qua'
                            : !inMonth
                              ? ''
                              : !allowsPick
                                ? 'Hết chỗ / không trong cửa sổ đặt trước'
                                : preBookOnly
                                  ? canBook
                                    ? 'Đặt trước — mở form (ngày nhận gần ngày trả hợp đồng hiện tại)'
                                    : 'Đặt trước — mở form đặt phòng'
                                  : canBook
                                    ? `Còn ${rem}/${cap} chỗ — mở form đặt phòng`
                                    : 'Mở form đặt phòng (phòng có thể không còn mở đặt trực tuyến)'
                        }
                        className={cn(
                          'relative flex min-h-0 w-full min-w-0 flex-col items-center justify-center gap-0.5 aspect-square max-h-[3.75rem] rounded-xl text-sm font-semibold transition-all duration-150 sm:max-h-16',
                          !inMonth && 'invisible pointer-events-none select-none',
                          inMonth && allowsPick && !past && 'text-gray-800 dark:text-gray-100',
                          inMonth &&
                            full &&
                            !allowsPick &&
                            'text-gray-500 dark:text-gray-400 cursor-not-allowed shadow-inner bg-[repeating-linear-gradient(135deg,rgb(243_244_246),rgb(243_244_246)_5px,rgb(229_231_235)_5px,rgb(229_231_235)_10px)] dark:bg-[repeating-linear-gradient(135deg,rgb(55_65_81/0.9),rgb(55_65_81/0.9)_5px,rgb(75_85_99/0.9)_5px,rgb(75_85_99/0.9)_10px)]',
                          inMonth &&
                            partial &&
                            !full &&
                            'bg-amber-50/95 dark:bg-amber-950/35 text-amber-950 dark:text-amber-100 ring-1 ring-amber-200/90 dark:ring-amber-800/70 hover:bg-amber-100 dark:hover:bg-amber-900/45',
                          inMonth && past && !full && 'text-gray-300 dark:text-gray-600 cursor-not-allowed bg-gray-50/50 dark:bg-gray-900/20',
                          looksAvailable &&
                            'bg-emerald-50 dark:bg-emerald-950/35 text-emerald-900 dark:text-emerald-100 ring-1 ring-emerald-200/90 dark:ring-emerald-700/80 hover:bg-emerald-100 dark:hover:bg-emerald-900/45 hover:ring-emerald-300 dark:hover:ring-emerald-600 active:scale-[0.97]',
                          looksPreBook &&
                            canBook &&
                            'bg-sky-50 dark:bg-sky-950/40 text-sky-950 dark:text-sky-100 ring-1 ring-sky-300/90 dark:ring-sky-700/80 hover:bg-sky-100 dark:hover:bg-sky-900/45 active:scale-[0.97]',
                          looksPreBook &&
                            !canBook &&
                            'bg-sky-50/90 dark:bg-sky-950/35 text-sky-950 dark:text-sky-100 ring-1 ring-sky-300 dark:ring-sky-700/80 hover:bg-sky-100/90 dark:hover:bg-sky-900/40',
                          clickable &&
                            !canBook &&
                            !looksPreBook &&
                            'bg-amber-50/90 dark:bg-amber-950/30 text-amber-950 dark:text-amber-100 ring-1 ring-amber-200 dark:ring-amber-800/80 hover:bg-amber-100/90 dark:hover:bg-amber-900/40',
                          isToday(date) &&
                            inMonth &&
                            'ring-2 ring-blue-500 ring-offset-1 ring-offset-white dark:ring-offset-gray-800',
                        )}
                      >
                        {inMonth ? (
                          <>
                            <span className="tabular-nums">{format(date, 'd')}</span>
                            {cap > 1 && !past && (
                              <span className="text-[9px] sm:text-[10px] font-bold tabular-nums opacity-80 leading-none">
                                {preBookOnly ? 'đặt trước' : `${rem}/${cap}`}
                              </span>
                            )}
                            {cap <= 1 && !past && preBookOnly && (
                              <span className="text-[8px] sm:text-[9px] font-bold uppercase leading-none opacity-90">
                                trước
                              </span>
                            )}
                          </>
                        ) : null}
                      </button>
                    )
                  }),
                )}
              </div>
            </div>
          </div>
        )}
      </div>

      {tab === 'month' && !isLoading && (
        <div className="flex flex-wrap gap-6 px-4 sm:px-5 py-3 border-t border-gray-100 dark:border-gray-700 text-xs text-gray-600 dark:text-gray-400 bg-gray-50/50 dark:bg-gray-900/20">
          <span className="inline-flex items-center gap-2">
            <span
              className="h-4 w-4 rounded-lg bg-emerald-100 dark:bg-emerald-900/50 ring-2 ring-emerald-300/70 dark:ring-emerald-700 shrink-0"
              aria-hidden
            />
            Còn chỗ (đủ capacity)
          </span>
          <span className="inline-flex items-center gap-2">
            <span
              className="h-4 w-4 rounded-lg shrink-0 bg-amber-100 dark:bg-amber-900/40 ring-1 ring-amber-300 dark:ring-amber-700"
              aria-hidden
            />
            Một phần đã đặt
          </span>
          <span className="inline-flex items-center gap-2">
            <span
              className="h-4 w-4 rounded-lg shrink-0 bg-[repeating-linear-gradient(135deg,rgb(243_244_246),rgb(243_244_246)_3px,rgb(229_231_235)_3px,rgb(229_231_235)_6px)] dark:bg-[repeating-linear-gradient(135deg,rgb(55_65_81),rgb(55_65_81)_3px,rgb(75_85_99)_3px,rgb(75_85_99)_6px)]"
              aria-hidden
            />
            Hết chỗ
          </span>
          <span className="inline-flex items-center gap-2">
            <span
              className="h-4 w-4 rounded-lg shrink-0 bg-sky-100 dark:bg-sky-900/50 ring-1 ring-sky-300 dark:ring-sky-700"
              aria-hidden
            />
            Đặt trước (sắp trả phòng)
          </span>
        </div>
      )}
    </div>
  )
}

'use client'

import { useMemo, useRef, useCallback } from 'react'
import { format } from 'date-fns'
import { vi } from 'date-fns/locale'
import { cn } from '@/utils/utils'
import { dayAllowsCheckInPick, type OccupancySlice } from '@/utils/roomOccupancy'
import {
  computeViewerTimelineRange,
  layoutTimelineSegments,
  monthTickLabels,
  todayMarkerPercent,
  dateFromTimelinePercent,
  formatRangeLabelVi,
} from '@/utils/roomAvailabilityTimeline'
import { formatDateInputValue, startOfTodayLocal } from '@/utils/bookingDates'

const LANE_ROW = 36
const RULER_H = 28

export interface RoomAvailabilityTimelineProps {
  occupancySlices: OccupancySlice[]
  roomCapacity?: number
  isLoading?: boolean
  canBook?: boolean
  onPickCheckIn: (moveInYmd: string) => void
}

export function RoomAvailabilityTimeline({
  occupancySlices,
  roomCapacity = 1,
  isLoading = false,
  canBook = true,
  onPickCheckIn,
}: RoomAvailabilityTimelineProps) {
  const cap = Math.max(1, Math.floor(roomCapacity) || 1)
  const trackRef = useRef<HTMLDivElement>(null)
  const todayMs = startOfTodayLocal().getTime()

  const { range, segments, laneCount, ticks, todayPct } = useMemo(() => {
    const now = new Date()
    const r = computeViewerTimelineRange(occupancySlices, now)
    const layout = layoutTimelineSegments(occupancySlices, r)
    const t = monthTickLabels(r)
    const tp = todayMarkerPercent(now, r)
    return { range: r, ...layout, ticks: t, todayPct: tp }
  }, [occupancySlices])

  const trackHeight = Math.max(LANE_ROW, laneCount * LANE_ROW)

  const handleTrackClick = useCallback(
    (e: React.MouseEvent<HTMLDivElement>) => {
      if (isLoading || !trackRef.current) return
      const rect = trackRef.current.getBoundingClientRect()
      const w = rect.width
      if (w <= 0) return
      const pct = ((e.clientX - rect.left) / w) * 100
      const picked = dateFromTimelinePercent(pct, range)
      const dayStart = picked.getTime()
      if (dayStart < todayMs) return
      if (!dayAllowsCheckInPick(picked, cap, occupancySlices)) return
      onPickCheckIn(formatDateInputValue(picked))
    },
    [isLoading, range, occupancySlices, cap, onPickCheckIn, todayMs],
  )

  const sortedForList = useMemo(() => {
    return [...occupancySlices].sort((a, b) => a.startYmd.localeCompare(b.startYmd))
  }, [occupancySlices])

  const rangeLabel = `${format(new Date(range.startMs), 'dd/MM/yyyy', { locale: vi })} – ${format(new Date(range.endMs), 'dd/MM/yyyy', { locale: vi })}`

  return (
    <div className="space-y-3">
      <p className="text-xs text-gray-500 dark:text-gray-400">
        Khung nhìn:{' '}
        <span className="font-medium text-gray-800 dark:text-gray-200 tabular-nums">{rangeLabel}</span>
      </p>

      <div className="rounded-xl border border-gray-200 dark:border-gray-600 bg-white dark:bg-gray-800/50 overflow-hidden">
        <div
          className="relative border-b border-gray-100 dark:border-gray-700 text-[10px] sm:text-xs text-gray-500 dark:text-gray-400"
          style={{ minHeight: RULER_H }}
        >
          {ticks.map((tick, i) => (
            <span
              key={`${tick.label}-${i}`}
              className="absolute top-1 whitespace-nowrap tabular-nums"
              style={{
                left: `${Math.min(99, Math.max(0, tick.percent))}%`,
                transform: 'translateX(-50%)',
              }}
            >
              {tick.label}
            </span>
          ))}
        </div>

        <div className="relative px-1 pb-1 pt-1">
          <div
            ref={trackRef}
            role="presentation"
            onClick={handleTrackClick}
            className={cn(
              'relative rounded-lg bg-gray-50/80 dark:bg-gray-900/40 min-h-[120px] cursor-crosshair',
              isLoading && 'cursor-wait opacity-80',
              !canBook && !isLoading && 'cursor-pointer opacity-95',
            )}
            style={{ height: Math.max(120, trackHeight + 16) }}
            title={
              !isLoading
                ? canBook
                  ? 'Bấm vào khoảng trống để chọn ngày nhận phòng'
                  : 'Bấm khoảng trống để mở form (phòng có thể không còn mở đặt trực tuyến)'
                : undefined
            }
          >
            {ticks.map((tick, i) => (
              <div
                key={`v-${i}`}
                className="absolute top-0 bottom-0 w-px bg-gray-200/90 dark:bg-gray-600/80 pointer-events-none"
                style={{ left: `${tick.percent}%` }}
              />
            ))}

            {todayPct != null && (
              <div
                className="absolute top-0 bottom-0 w-0.5 bg-rose-500 z-20 pointer-events-none"
                style={{ left: `${todayPct}%` }}
                title="Hôm nay"
              />
            )}

            <div
              className="absolute inset-x-0 top-2 bottom-2 pointer-events-none"
              style={{ marginTop: 0 }}
            >
              {segments.map((seg, idx) => (
                <div
                  key={`${seg.startYmd}-${seg.endYmd}-${idx}`}
                  className="absolute rounded-md bg-sky-600/90 dark:bg-sky-500/85 text-white text-[10px] sm:text-xs font-medium px-1.5 py-0.5 shadow-sm flex items-center overflow-hidden whitespace-nowrap"
                  style={{
                    left: `${seg.leftPct}%`,
                    width: `${seg.widthPct}%`,
                    top: seg.lane * LANE_ROW + 4,
                    height: LANE_ROW - 8,
                    minWidth: 8,
                  }}
                  title={`${seg.units ?? 1} chỗ · ${formatRangeLabelVi(seg.startYmd, seg.endYmd)}`}
                >
                  <span className="truncate">{seg.units ?? 1} chỗ</span>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>

      <div className="flex flex-wrap gap-x-4 gap-y-1 text-[11px] text-gray-600 dark:text-gray-400">
        <span className="inline-flex items-center gap-1.5">
          <span className="h-2 w-2 rounded-full bg-sky-600 shrink-0" />
          Khoảng đã có lượt đặt
        </span>
        <span className="inline-flex items-center gap-1.5">
          <span className="h-2 w-0.5 bg-rose-500 shrink-0 rounded-full" />
          Vạch đỏ: hôm nay
        </span>
        <span className="inline-flex items-center gap-1.5">
          <span className="h-2 w-2 rounded bg-emerald-200 dark:bg-emerald-800 ring ring-emerald-400/50 shrink-0" />
          Bấm vùng trống để chọn nhận phòng
        </span>
      </div>

      {sortedForList.length > 0 && (
        <div className="border-t border-gray-100 dark:border-gray-700 pt-3">
          <p className="text-xs font-semibold text-gray-700 dark:text-gray-300 mb-2">
            Theo thời gian bắt đầu (chỉ hiển thị khoảng ngày)
          </p>
          <ul className="space-y-1.5">
            {sortedForList.map((o) => (
              <li
                key={`${o.startYmd}-${o.endYmd}`}
                className="flex flex-wrap items-center justify-between gap-2 rounded-lg bg-gray-50 dark:bg-gray-800/60 px-3 py-2 text-xs"
              >
                <span className="font-medium text-gray-700 dark:text-gray-300">
                  {o.units ?? 1} chỗ
                </span>
                <span className="tabular-nums text-gray-600 dark:text-gray-400">
                  {formatRangeLabelVi(o.startYmd, o.endYmd)}
                </span>
              </li>
            ))}
          </ul>
        </div>
      )}
    </div>
  )
}

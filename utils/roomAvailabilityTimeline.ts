/**
 * Timeline (Gantt nhẹ) cho lịch khả dụng phòng — chỉ khoảng ngày, không PII.
 */

import {
  addMonths,
  eachMonthOfInterval,
  endOfDay,
  format,
  isValid,
  startOfDay,
  startOfMonth,
} from 'date-fns'
import type { OccupancySlice } from '@/utils/roomOccupancy'
import { parseLocalDateFromInput, formatDateInputValue } from '@/utils/bookingDates'

export interface TimelineRange {
  startMs: number
  endMs: number
}

function spanFromOccupied(o: OccupancySlice): { startMs: number; endMs: number } | null {
  const s = parseLocalDateFromInput(o.startYmd)
  const eDay = parseLocalDateFromInput(o.endYmd)
  if (!s || !eDay) return null
  return { startMs: startOfDay(s).getTime(), endMs: endOfDay(eDay).getTime() }
}

export function computeViewerTimelineRange(
  occupied: OccupancySlice[],
  now = new Date(),
  opts?: { padPastMonths?: number; padFutureMonths?: number },
): TimelineRange {
  const padPast = opts?.padPastMonths ?? 1
  const padFuture = opts?.padFutureMonths ?? 6
  let startMs = startOfDay(addMonths(now, -padPast)).getTime()
  let endMs = endOfDay(addMonths(now, padFuture)).getTime()

  for (const o of occupied) {
    const sp = spanFromOccupied(o)
    if (!sp) continue
    startMs = Math.min(startMs, sp.startMs)
    endMs = Math.max(endMs, sp.endMs)
  }

  return { startMs, endMs }
}

export function barPosition(
  startMs: number,
  endMs: number,
  range: TimelineRange,
): { leftPct: number; widthPct: number } {
  const total = range.endMs - range.startMs
  if (total <= 0) return { leftPct: 0, widthPct: 100 }
  const left = ((startMs - range.startMs) / total) * 100
  const width = ((endMs - startMs) / total) * 100
  const clampedLeft = Math.max(0, Math.min(100, left))
  const maxW = 100 - clampedLeft
  return { leftPct: clampedLeft, widthPct: Math.max(0.35, Math.min(maxW, width)) }
}

export interface OccupiedSegment extends OccupancySlice {
  lane: number
  leftPct: number
  widthPct: number
}

export function layoutTimelineSegments(
  occupied: OccupancySlice[],
  range: TimelineRange,
): { segments: OccupiedSegment[]; laneCount: number } {
  const spans: Array<OccupancySlice & { startMs: number; endMs: number }> = []
  for (const o of occupied) {
    const sp = spanFromOccupied(o)
    if (!sp) continue
    spans.push({ ...o, ...sp })
  }
  spans.sort((a, b) => a.startMs - b.startMs)

  const laneEnds: number[] = []
  const segments: OccupiedSegment[] = []

  for (const s of spans) {
    let lane = -1
    for (let i = 0; i < laneEnds.length; i++) {
      if (laneEnds[i] <= s.startMs) {
        lane = i
        break
      }
    }
    if (lane === -1) {
      lane = laneEnds.length
      laneEnds.push(s.endMs)
    } else {
      laneEnds[lane] = s.endMs
    }
    const { leftPct, widthPct } = barPosition(s.startMs, s.endMs, range)
    segments.push({
      startYmd: s.startYmd,
      endYmd: s.endYmd,
      units: s.units,
      lane,
      leftPct,
      widthPct,
    })
  }

  return {
    segments,
    laneCount: Math.max(1, laneEnds.length),
  }
}

export function todayMarkerPercent(now: Date, range: TimelineRange): number | null {
  const t = startOfDay(now).getTime()
  if (t < range.startMs || t > range.endMs) return null
  const total = range.endMs - range.startMs
  if (total <= 0) return null
  return ((t - range.startMs) / total) * 100
}

export function monthTickLabels(range: TimelineRange): { percent: number; label: string }[] {
  const start = new Date(range.startMs)
  const end = new Date(range.endMs)
  if (!isValid(start) || !isValid(end)) return []
  const total = range.endMs - range.startMs
  if (total <= 0) return []
  const months = eachMonthOfInterval({
    start: startOfMonth(start),
    end: startOfMonth(end),
  })
  return months.map((m) => ({
    percent: ((startOfDay(m).getTime() - range.startMs) / total) * 100,
    label: format(m, 'MM/yyyy'),
  }))
}

/** Map vị trí click (theo % chiều ngang track) → ngày local 00:00 */
export function dateFromTimelinePercent(percent: number, range: TimelineRange): Date {
  const p = Math.max(0, Math.min(100, percent))
  const total = range.endMs - range.startMs
  const ms = range.startMs + (p / 100) * total
  return startOfDay(new Date(ms))
}

export function formatRangeLabelVi(startYmd: string, endYmd: string): string {
  const a = parseLocalDateFromInput(startYmd)
  const b = parseLocalDateFromInput(endYmd)
  if (!a || !b) return `${startYmd} → ${endYmd}`
  return `${format(a, 'dd/MM/yyyy')} → ${format(b, 'dd/MM/yyyy')}`
}

export function toYmd(d: Date): string {
  return formatDateInputValue(d)
}

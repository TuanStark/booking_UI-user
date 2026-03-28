/**
 * Lịch chiếm chỗ theo capacity (KTX nhiều người / phòng).
 * Đồng bộ trạng thái với booking-service: CAPACITY_HOLD_STATUSES.
 */

import { eachDayOfInterval, endOfDay, isValid, startOfDay } from 'date-fns'
import {
  parseLocalDateFromInput,
  formatDateInputValue,
  addCalendarDays,
  BOOKING_MIN_STAY_DAYS,
  startOfTodayLocal,
} from '@/utils/bookingDates'

/** Đồng bộ booking_booking-service CAPACITY_HOLD_STATUSES */
export const CAPACITY_HOLD_STATUSES = new Set([
  'CONFIRMED',
  'ACTIVE',
  'EXPIRING_SOON',
  'QUEUED',
])

/** Mỗi lượt đặt qua app SV: tối đa số chỗ (đồng bộ booking-service create). */
export const MAX_USER_BOOKING_OCCUPANCY_UNITS = 1

/** Đồng bộ booking-service cron: ACTIVE → EXPIRING_SOON khi còn ~30 ngày (RELIST_BEFORE_DAYS). */
export const EXPIRING_SOON_LEAD_DAYS = 30

/**
 * Đồng bộ isPreBookingEligible: ngày nhận so với ngày kết thúc lease EXPIRING_SOON (ngày lịch local).
 * Cho phép tối đa 1 ngày trước và tối đa 7 ngày sau ngày trả của hợp đồng sắp hết.
 */
export const PREBOOK_MOVE_IN_MAX_DAYS_BEFORE_LEASE_END = 1
export const PREBOOK_MOVE_IN_MAX_DAYS_AFTER_LEASE_END = 7

export type OccupiedIntervalYmd = {
  startYmd: string
  endYmd: string
}

/** Một booking chiếm `units` chỗ trong khoảng ngày (theo phòng `roomId` đã lọc khi parse). */
export type OccupancySlice = OccupiedIntervalYmd & {
  units: number
  /** Trạng thái booking (CONFIRMED, ACTIVE, EXPIRING_SOON, QUEUED, …) — dùng cho đặt trước. */
  status?: string
}

function toYmd(d: Date): string {
  return formatDateInputValue(d)
}

function intervalBoundsFromRaw(
  startRaw: unknown,
  endRaw: unknown,
): { startMs: number; endMs: number } | null {
  if (startRaw == null || endRaw == null || String(startRaw) === '' || String(endRaw) === '') return null
  const s = startOfDay(new Date(String(startRaw)))
  const e = endOfDay(new Date(String(endRaw)))
  if (!isValid(s) || !isValid(e) || e.getTime() < s.getTime()) return null
  return { startMs: s.getTime(), endMs: e.getTime() }
}

export function intervalBoundsFromYmd(
  startYmd: string,
  endYmd: string,
): { startMs: number; endMs: number } | null {
  const s = parseLocalDateFromInput(startYmd)
  const eDay = parseLocalDateFromInput(endYmd)
  if (!s || !eDay) return null
  const e = endOfDay(eDay)
  const startMs = startOfDay(s).getTime()
  const endMs = e.getTime()
  if (endMs < startMs) return null
  return { startMs, endMs }
}

function isCancelledStatus(status: unknown): boolean {
  const s = String(status ?? '')
    .toLowerCase()
    .trim()
  return s === 'cancelled' || s === 'canceled'
}

function detailUnitsForRoom(detail: Record<string, unknown>, roomId: string): number {
  if (String(detail.roomId ?? '') !== roomId) return 0
  const u = Math.floor(Number(detail.occupancyUnits ?? 1))
  return Number.isFinite(u) && u >= 1 ? u : 1
}

/**
 * Payload API booking → các slice chiếm chỗ cho một phòng (chỉ trạng thái giữ chỗ).
 */
export function parseApiBookingsToOccupancySlices(
  bookings: unknown[],
  roomId: string,
): OccupancySlice[] {
  if (!Array.isArray(bookings) || !roomId) return []
  const out: OccupancySlice[] = []
  for (const b of bookings) {
    if (!b || typeof b !== 'object') continue
    const row = b as Record<string, unknown>
    if (isCancelledStatus(row.bookingStatus ?? row.status)) continue
    const st = String(row.bookingStatus ?? row.status ?? '')
      .trim()
      .toUpperCase()
    if (!CAPACITY_HOLD_STATUSES.has(st)) continue

    const startRaw =
      row.checkInDate ?? row.checkinDate ?? row.startDate ?? row.start_date
    const endRaw =
      row.checkOutDate ?? row.checkoutDate ?? row.endDate ?? row.end_date

    const bounds = intervalBoundsFromRaw(startRaw, endRaw)
    if (!bounds) continue

    const details = row.details
    let units = 1
    if (Array.isArray(details) && details.length > 0) {
      const sum = details.reduce((acc: number, d: unknown) => {
        if (!d || typeof d !== 'object') return acc
        return acc + detailUnitsForRoom(d as Record<string, unknown>, roomId)
      }, 0)
      if (sum < 1) continue
      units = sum
    }

    out.push({
      startYmd: toYmd(new Date(bounds.startMs)),
      endYmd: toYmd(new Date(bounds.endMs)),
      units,
      status: st,
    })
  }
  return out
}

/** Ngày trả (ymd) của lease đang EXPIRING_SOON — sớm nhất nếu có nhiều slice. */
export function getExpiringSoonLeaseEndYmd(slices: OccupancySlice[]): string | null {
  let minEnd: string | null = null
  for (const s of slices) {
    if (String(s.status ?? '').toUpperCase() !== 'EXPIRING_SOON') continue
    if (!minEnd || s.endYmd.localeCompare(minEnd) < 0) minEnd = s.endYmd
  }
  return minEnd
}

export function isPreBookMoveInWindow(moveInYmd: string, leaseEndYmd: string): boolean {
  const moveIn = parseLocalDateFromInput(moveInYmd)
  const leaseEnd = parseLocalDateFromInput(leaseEndYmd)
  if (!moveIn || !leaseEnd) return false
  const d0 = startOfDay(moveIn).getTime()
  const d1 = startOfDay(leaseEnd).getTime()
  const diffDays = (d0 - d1) / 86400000
  return (
    diffDays >= -PREBOOK_MOVE_IN_MAX_DAYS_BEFORE_LEASE_END &&
    diffDays <= PREBOOK_MOVE_IN_MAX_DAYS_AFTER_LEASE_END
  )
}

/**
 * Cho phép chọn ngày nhận trên lịch: còn chỗ hoặc đặt trước (hợp đồng hiện tại EXPIRING_SOON + ngày trong cửa sổ).
 */
export function dayAllowsCheckInPick(
  date: Date,
  roomCapacity: number,
  slices: OccupancySlice[],
): boolean {
  const cap = Math.max(1, Math.floor(roomCapacity) || 1)
  const dayStart = startOfDay(date).getTime()
  if (dayStart < startOfDay(startOfTodayLocal()).getTime()) return false
  if (dayRemainingSlots(date, cap, slices) >= 1) return true
  const leaseEnd = getExpiringSoonLeaseEndYmd(slices)
  if (!leaseEnd) return false
  return isPreBookMoveInWindow(formatDateInputValue(date), leaseEnd)
}

export function dayUsedUnits(day: Date, slices: OccupancySlice[]): number {
  const d0 = startOfDay(day).getTime()
  const d1 = endOfDay(day).getTime()
  let total = 0
  for (const s of slices) {
    const b = intervalBoundsFromYmd(s.startYmd, s.endYmd)
    if (!b) continue
    if (!(d1 < b.startMs || d0 > b.endMs)) total += s.units
  }
  return total
}

export function dayRemainingSlots(day: Date, roomCapacity: number, slices: OccupancySlice[]): number {
  const cap = Math.max(1, Math.floor(roomCapacity) || 1)
  return Math.max(0, cap - dayUsedUnits(day, slices))
}

/** Hết chỗ (không còn slot) */
export function dayIsFullyBooked(day: Date, roomCapacity: number, slices: OccupancySlice[]): boolean {
  return dayRemainingSlots(day, roomCapacity, slices) <= 0
}

/** Có người nhưng vẫn còn chỗ */
export function dayIsPartiallyBooked(
  day: Date,
  roomCapacity: number,
  slices: OccupancySlice[],
): boolean {
  const cap = Math.max(1, Math.floor(roomCapacity) || 1)
  const used = dayUsedUnits(day, slices)
  return used > 0 && used < cap
}

export function minRemainingSlotsInYmdRange(
  moveInYmd: string,
  moveOutYmd: string,
  roomCapacity: number,
  slices: OccupancySlice[],
): number {
  const start = parseLocalDateFromInput(moveInYmd)
  const end = parseLocalDateFromInput(moveOutYmd)
  if (!start || !end) return 0
  const days = eachDayOfInterval({
    start: startOfDay(start),
    end: startOfDay(end),
  })
  const cap = Math.max(1, Math.floor(roomCapacity) || 1)
  let minRem = cap
  for (const d of days) {
    minRem = Math.min(minRem, dayRemainingSlots(d, cap, slices))
  }
  return minRem
}

export function bookingRangeFitsCapacity(
  moveInYmd: string,
  moveOutYmd: string,
  roomCapacity: number,
  slices: OccupancySlice[],
  requestedUnits: number,
): boolean {
  const req = Math.max(1, Math.floor(requestedUnits) || 1)
  const cap = Math.max(1, Math.floor(roomCapacity) || 1)
  if (req > cap) return false
  const leaseEnd = getExpiringSoonLeaseEndYmd(slices)
  if (leaseEnd && isPreBookMoveInWindow(moveInYmd, leaseEnd)) {
    return true
  }
  return minRemainingSlotsInYmdRange(moveInYmd, moveOutYmd, cap, slices) >= req
}

export function defaultPairFromCheckIn(moveInYmd: string): {
  moveIn: string
  moveOut: string
  duration: number
} {
  const d = parseLocalDateFromInput(moveInYmd)
  if (!d) return { moveIn: '', moveOut: '', duration: 3 }
  const out = addCalendarDays(d, BOOKING_MIN_STAY_DAYS)
  return {
    moveIn: moveInYmd,
    moveOut: formatDateInputValue(out),
    duration: 3,
  }
}

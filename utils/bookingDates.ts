/**
 * Calendar-date helpers for booking flows (local timezone, YYYY-MM-DD inputs).
 * Avoids parsing ISO midnight as UTC which shifts "today" in some locales.
 */

export const BOOKING_MIN_STAY_DAYS = 90

const ISO_DATE = /^\d{4}-\d{2}-\d{2}$/

export function parseLocalDateFromInput(ymd: string): Date | null {
  if (!ISO_DATE.test(ymd)) return null
  const [y, m, d] = ymd.split('-').map(Number)
  const date = new Date(y, m - 1, d)
  if (
    date.getFullYear() !== y ||
    date.getMonth() !== m - 1 ||
    date.getDate() !== d
  ) {
    return null
  }
  return date
}

export function formatDateInputValue(d: Date): string {
  const y = d.getFullYear()
  const m = String(d.getMonth() + 1).padStart(2, '0')
  const day = String(d.getDate()).padStart(2, '0')
  return `${y}-${m}-${day}`
}

export function startOfTodayLocal(): Date {
  const n = new Date()
  return new Date(n.getFullYear(), n.getMonth(), n.getDate())
}

export function addCalendarDays(d: Date, days: number): Date {
  const next = new Date(d.getFullYear(), d.getMonth(), d.getDate())
  next.setDate(next.getDate() + days)
  return next
}

/** Whole calendar days from start (inclusive) to end (exclusive span): end - start. */
export function calendarDaysBetween(start: Date, end: Date): number {
  const a = Date.UTC(start.getFullYear(), start.getMonth(), start.getDate())
  const b = Date.UTC(end.getFullYear(), end.getMonth(), end.getDate())
  return Math.round((b - a) / 86400000)
}

export function getTodayMinInputValue(): string {
  return formatDateInputValue(startOfTodayLocal())
}

/** Earliest valid checkout for a given check-in (check-in + BOOKING_MIN_STAY_DAYS). */
export function getMinMoveOutInputValue(moveInYmd: string): string | null {
  const checkIn = parseLocalDateFromInput(moveInYmd)
  if (!checkIn) return null
  return formatDateInputValue(addCalendarDays(checkIn, BOOKING_MIN_STAY_DAYS))
}

export type BookingDateFieldErrors = Partial<
  Record<'moveInDate' | 'moveOutDate', string>
>

/**
 * Validates booking check-in / check-out.
 * Rules: required, valid calendar dates, check-in not before today, min stay BOOKING_MIN_STAY_DAYS.
 */
export function validateBookingDates(
  moveInYmd: string,
  moveOutYmd: string,
): BookingDateFieldErrors {
  const errors: BookingDateFieldErrors = {}

  if (!moveInYmd.trim()) {
    errors.moveInDate = 'Vui lòng chọn ngày nhận phòng'
    return errors
  }
  if (!moveOutYmd.trim()) {
    errors.moveOutDate = 'Vui lòng chọn ngày trả phòng'
    return errors
  }

  const checkIn = parseLocalDateFromInput(moveInYmd)
  const checkOut = parseLocalDateFromInput(moveOutYmd)

  if (!checkIn) {
    errors.moveInDate = 'Ngày nhận phòng không hợp lệ'
    return errors
  }
  if (!checkOut) {
    errors.moveOutDate = 'Ngày trả phòng không hợp lệ'
    return errors
  }

  const today = startOfTodayLocal()
  if (calendarDaysBetween(checkIn, today) < 0) {
    errors.moveInDate = 'Không thể đặt phòng với ngày nhận trong quá khứ'
  }

  const stayLengthDays = calendarDaysBetween(checkIn, checkOut)

  if (stayLengthDays <= 0) {
    errors.moveOutDate = 'Ngày trả phòng phải sau ngày nhận phòng'
  } else if (stayLengthDays < BOOKING_MIN_STAY_DAYS) {
    errors.moveOutDate = `Thời gian lưu trú tối thiểu ${BOOKING_MIN_STAY_DAYS} ngày (ngày trả phòng phải cách ngày nhận ít nhất ${BOOKING_MIN_STAY_DAYS} ngày)`
  }

  return errors
}

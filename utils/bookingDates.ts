/**
 * Calendar-date helpers for booking flows (local timezone, YYYY-MM-DD inputs).
 * Avoids parsing ISO midnight as UTC which shifts "today" in some locales.
 */

/** Đồng bộ booking-service MIN_RENTAL_MONTHS */
export const MIN_RENTAL_MONTHS = 3

/** Gợi ý UI (~3 tháng lịch); validation chính theo countRentalMonths. */
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

/** Cộng tháng lịch (Jan 31 + 1 tháng → cuối tháng 2). */
export function addCalendarMonths(d: Date, months: number): Date {
  const day = d.getDate()
  const result = new Date(d.getFullYear(), d.getMonth() + months, day)
  if (result.getDate() !== day) {
    return new Date(result.getFullYear(), result.getMonth() + 1, 0)
  }
  return result
}

/**
 * Số tháng thuê (floor) — đồng bộ booking-service calculateMonthsDifference.
 * Ví dụ: 01/02 → 01/05 = 3 tháng; 01/02 → 30/04 có thể < 90 ngày nhưng vẫn 2 tháng.
 */
export function countRentalMonths(start: Date, end: Date): number {
  const years = end.getFullYear() - start.getFullYear()
  const months = end.getMonth() - start.getMonth()
  const dayDiff = end.getDate() - start.getDate()
  let totalMonths = years * 12 + months
  if (dayDiff < 0) totalMonths--
  return totalMonths
}

export function countRentalMonthsFromYmd(
  moveInYmd: string,
  moveOutYmd: string,
): number | null {
  const checkIn = parseLocalDateFromInput(moveInYmd)
  const checkOut = parseLocalDateFromInput(moveOutYmd)
  if (!checkIn || !checkOut) return null
  return countRentalMonths(checkIn, checkOut)
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

/** Ngày trả sớm nhất: check-in + MIN_RENTAL_MONTHS (theo tháng lịch, khớp backend). */
export function getMinMoveOutInputValue(moveInYmd: string): string | null {
  const checkIn = parseLocalDateFromInput(moveInYmd)
  if (!checkIn) return null
  return formatDateInputValue(addCalendarMonths(checkIn, MIN_RENTAL_MONTHS))
}

export type BookingDateFieldErrors = Partial<
  Record<'moveInDate' | 'moveOutDate', string>
>

/**
 * Validates booking check-in / check-out.
 * Rules: required, valid calendar dates, check-in not before today, min stay MIN_RENTAL_MONTHS.
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
  if (calendarDaysBetween(checkIn, today) > 0) {
    errors.moveInDate = 'Không thể đặt phòng với ngày nhận trong quá khứ'
  }

  const stayLengthDays = calendarDaysBetween(checkIn, checkOut)
  const rentalMonths = countRentalMonths(checkIn, checkOut)

  if (stayLengthDays <= 0) {
    errors.moveOutDate = 'Ngày trả phòng phải sau ngày nhận phòng'
  } else if (rentalMonths < MIN_RENTAL_MONTHS) {
    errors.moveOutDate = `Thời gian thuê tối thiểu ${MIN_RENTAL_MONTHS} tháng (ví dụ nhận 01/05 thì trả từ 01/08 trở đi)`
  }

  return errors
}

/** Đồng bộ số tháng đặt cọc từ khoảng ngày đã chọn. */
export function deriveDurationMonthsFromDates(
  moveInYmd: string,
  moveOutYmd: string,
  fallback = MIN_RENTAL_MONTHS,
): number {
  const months = countRentalMonthsFromYmd(moveInYmd, moveOutYmd)
  if (months == null || months < MIN_RENTAL_MONTHS) return fallback
  return months
}

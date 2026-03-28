'use client'

import { useState, useEffect, useMemo } from 'react'
import { format } from 'date-fns'
import { vi as viLocale } from 'date-fns/locale'
import {
  X,
  Calendar,
  User,
  CheckCircle,
  CreditCard,
  Banknote,
  Smartphone
} from 'lucide-react'
import { cn } from '@/utils/utils'
import {
  BOOKING_MIN_STAY_DAYS,
  addCalendarDays,
  formatDateInputValue,
  getMinMoveOutInputValue,
  getTodayMinInputValue,
  parseLocalDateFromInput,
  startOfTodayLocal,
  validateBookingDates,
} from '@/utils/bookingDates'
import {
  bookingRangeFitsCapacity,
  defaultPairFromCheckIn,
  EXPIRING_SOON_LEAD_DAYS,
  getExpiringSoonLeaseEndYmd,
  isPreBookMoveInWindow,
  MAX_USER_BOOKING_OCCUPANCY_UNITS,
  type OccupancySlice,
} from '@/utils/roomOccupancy'
import { Room, BookingFormData } from '@/types'
import { useUser } from '@/contexts/UserContext'

function createEmptyBookingForm(): BookingFormData {
  return {
    fullName: '',
    email: '',
    phone: '',
    studentId: '',
    moveInDate: '',
    moveOutDate: '',
    duration: 3,
    occupancyUnits: 1,
    paymentMethod: 'VIETQR',
    specialRequests: '',
    emergencyContact: '',
    emergencyPhone: '',
    agreeToTerms: false,
    agreeToPrivacy: false,
  }
}

interface BookingModalProps {
  isOpen: boolean
  onClose: () => void
  onSubmit: (data: BookingFormData) => void
  room: Room
  building: any
  /** Khi mở từ lịch khả dụng — điền sẵn bước ngày (tối thiểu 90 ngày) */
  initialMoveInDate?: string | null
  /** Chiếm chỗ theo capacity (đồng bộ rule với backend) */
  occupancySlices?: OccupancySlice[]
  roomCapacity?: number
}

export default function BookingModal({
  isOpen,
  onClose,
  onSubmit,
  room,
  building,
  initialMoveInDate = null,
  occupancySlices = [],
  roomCapacity: roomCapacityProp,
}: BookingModalProps) {
  const { user } = useUser()
  const roomCapacity = Math.max(1, roomCapacityProp ?? room.capacityMax ?? 1)
  const maxUserOccupancy = useMemo(
    () => Math.min(roomCapacity, MAX_USER_BOOKING_OCCUPANCY_UNITS),
    [roomCapacity],
  )
  const expiringLeaseEndYmd = useMemo(
    () => getExpiringSoonLeaseEndYmd(occupancySlices),
    [occupancySlices],
  )
  const expiringLeaseEndLabel = useMemo(() => {
    if (!expiringLeaseEndYmd) return ''
    const d = parseLocalDateFromInput(expiringLeaseEndYmd)
    return d ? format(d, 'dd/MM/yyyy', { locale: viLocale }) : expiringLeaseEndYmd
  }, [expiringLeaseEndYmd])
  const [currentStep, setCurrentStep] = useState(1)
  const [formData, setFormData] = useState<BookingFormData>(() =>
    createEmptyBookingForm(),
  )

  const [errors, setErrors] = useState<Record<string, string>>({})

  const minCheckIn = getTodayMinInputValue()
  const minCheckOut = useMemo(() => {
    return (
      getMinMoveOutInputValue(formData.moveInDate) ??
      formatDateInputValue(
        addCalendarDays(startOfTodayLocal(), BOOKING_MIN_STAY_DAYS),
      )
    )
  }, [formData.moveInDate])

  const moveInIsPreBookWindow = useMemo(
    () =>
      Boolean(
        expiringLeaseEndYmd &&
          formData.moveInDate &&
          isPreBookMoveInWindow(formData.moveInDate, expiringLeaseEndYmd),
      ),
    [expiringLeaseEndYmd, formData.moveInDate],
  )

  useEffect(() => {
    if (!isOpen || !user) return
    setFormData((prev) => ({
      ...prev,
      fullName: prev.fullName || user.name || '',
      email: prev.email || user.email || '',
      phone: prev.phone || user.phone || '',
      studentId: prev.studentId || user.id || '',
    }))
  }, [isOpen, user])

  /** Đóng: xóa form. Mở: nếu có ngày từ lịch thì điền ngay (tránh race giữa hai effect trước đây). */
  useEffect(() => {
    if (!isOpen) {
      setCurrentStep(1)
      setErrors({})
      setFormData(createEmptyBookingForm())
      return
    }
    const ymd = initialMoveInDate?.trim()
    if (!ymd) return
    const p = defaultPairFromCheckIn(ymd)
    setFormData((prev) => ({
      ...prev,
      moveInDate: p.moveIn,
      moveOutDate: p.moveOut,
      duration: p.duration,
    }))
  }, [isOpen, initialMoveInDate])

  useEffect(() => {
    if (!isOpen) return
    setFormData((prev) => ({
      ...prev,
      occupancyUnits: Math.min(
        maxUserOccupancy,
        Math.max(1, Math.floor(prev.occupancyUnits) || 1),
      ),
    }))
  }, [isOpen, maxUserOccupancy])

  const validateStep = (step: number): boolean => {
    const newErrors: Record<string, string> = {}

    if (step === 1) {
      if (!formData.fullName.trim()) newErrors.fullName = 'Vui lòng nhập họ tên'
      if (!formData.email.trim()) newErrors.email = 'Vui lòng nhập email'
      if (!formData.phone.trim()) newErrors.phone = 'Vui lòng nhập số điện thoại'
      if (!formData.studentId.trim()) newErrors.studentId = 'Vui lòng nhập mã sinh viên'
    }

    if (step === 2) {
      Object.assign(
        newErrors,
        validateBookingDates(formData.moveInDate, formData.moveOutDate),
      )
      const units = Math.min(
        maxUserOccupancy,
        Math.max(1, Math.floor(formData.occupancyUnits) || 1),
      )
      if (
        formData.moveInDate &&
        formData.moveOutDate &&
        !bookingRangeFitsCapacity(
          formData.moveInDate,
          formData.moveOutDate,
          roomCapacity,
          occupancySlices,
          units,
        )
      ) {
        newErrors.moveOutDate =
          'Không đủ chỗ trống trong khoảng ngày đã chọn. Vui lòng chỉnh ngày hoặc số chỗ theo lịch phía trên.'
      }
      if (formData.duration && formData.duration < 3) {
        newErrors.duration = 'Thời gian thuê tối thiểu 3 tháng'
      }
    }

    if (step === 3) {
      if (!formData.agreeToTerms) newErrors.agreeToTerms = 'Vui lòng đồng ý với điều khoản'
      if (!formData.agreeToPrivacy) newErrors.agreeToPrivacy = 'Vui lòng đồng ý với chính sách bảo mật'
    }

    setErrors(newErrors)
    return Object.keys(newErrors).length === 0
  }

  const handleNext = () => {
    if (validateStep(currentStep)) {
      setCurrentStep(currentStep + 1)
    }
  }

  const handlePrev = () => {
    setCurrentStep(currentStep - 1)
  }

  const handleSubmit = () => {
    if (!validateStep(3)) return

    const dateErrors = validateBookingDates(
      formData.moveInDate,
      formData.moveOutDate,
    )
    if (Object.keys(dateErrors).length > 0) {
      setErrors((prev) => ({ ...prev, ...dateErrors }))
      setCurrentStep(2)
      return
    }
    const submitUnits = Math.min(
      maxUserOccupancy,
      Math.max(1, Math.floor(formData.occupancyUnits) || 1),
    )
    if (
      !bookingRangeFitsCapacity(
        formData.moveInDate,
        formData.moveOutDate,
        roomCapacity,
        occupancySlices,
        submitUnits,
      )
    ) {
      setErrors((prev) => ({
        ...prev,
        moveOutDate:
          'Không đủ chỗ trống trong khoảng ngày đã chọn. Vui lòng chỉnh theo lịch khả dụng.',
      }))
      setCurrentStep(2)
      return
    }

    onSubmit({ ...formData, occupancyUnits: submitUnits })
  }

  const calculateTotal = () => {
    const u = Math.min(
      maxUserOccupancy,
      Math.max(1, Math.floor(formData.occupancyUnits) || 1),
    )
    return formData.duration * room.price * u
  }

  const calculateDeposit = () => {
    return Math.round(calculateTotal() * 0.3) // 30% deposit
  }

  if (!isOpen) return null

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto">
      <div className="flex min-h-screen items-center justify-center p-4">
        <div className="fixed inset-0 bg-black/50" onClick={onClose}></div>

        <div className="relative bg-white dark:bg-gray-800 rounded-2xl shadow-2xl w-full max-w-4xl max-h-[90vh] overflow-hidden">
          {/* Header */}
          <div className="flex items-center justify-between p-6 border-b border-gray-200 dark:border-gray-700">
            <div>
              <h2 className="text-2xl font-bold text-gray-900 dark:text-white">
                Đặt phòng {room.roomNumber}
              </h2>
              <p className="text-gray-600 dark:text-gray-400">
                {building.name} • {building.address}
              </p>
            </div>
            <button
              onClick={onClose}
              className="p-2 hover:bg-gray-100 dark:hover:bg-gray-700 rounded-lg transition-colors duration-200"
            >
              <X className="h-6 w-6 text-gray-500" />
            </button>
          </div>

          {/* Progress Steps */}
          <div className="px-6 py-4 bg-gray-50 dark:bg-gray-900">
            <div className="flex items-center justify-between">
              {[
                { step: 1, title: 'Thông tin cá nhân', icon: User },
                { step: 2, title: 'Chi tiết đặt phòng', icon: Calendar },
                { step: 3, title: 'Xác nhận & Thanh toán', icon: CheckCircle }
              ].map(({ step, title, icon: Icon }, index) => (
                <div key={step} className="flex items-center">
                  <div className={cn(
                    'flex items-center justify-center w-8 h-8 rounded-full text-sm font-semibold',
                    currentStep >= step
                      ? 'bg-blue-500 text-white'
                      : 'bg-gray-200 dark:bg-gray-700 text-gray-600 dark:text-gray-400'
                  )}>
                    {currentStep > step ? <CheckCircle className="h-4 w-4" /> : <Icon className="h-4 w-4" />}
                  </div>
                  <span className={cn(
                    'ml-2 text-sm font-medium',
                    currentStep >= step
                      ? 'text-blue-600 dark:text-blue-400'
                      : 'text-gray-500 dark:text-gray-400'
                  )}>
                    {title}
                  </span>
                  {index < 3 && (
                    <div className={cn(
                      'w-16 h-0.5 mx-4',
                      currentStep > step
                        ? 'bg-blue-500'
                        : 'bg-gray-200 dark:bg-gray-700'
                    )} />
                  )}
                </div>
              ))}
            </div>
          </div>

          {/* Content */}
          <div className="p-6 max-h-[60vh] overflow-y-auto">
            {/* Step 1: Personal Information */}
            {currentStep === 1 && (
              <div className="space-y-6">
                <h3 className="text-xl font-semibold text-gray-900 dark:text-white mb-4">
                  Thông tin cá nhân
                </h3>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                      Họ và tên *
                    </label>
                    <input
                      type="text"
                      value={formData.fullName}
                      onChange={(e) => setFormData({ ...formData, fullName: e.target.value })}
                      className={cn(
                        'w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent dark:bg-gray-700 dark:text-white',
                        errors.fullName ? 'border-red-500' : 'border-gray-300 dark:border-gray-600'
                      )}
                      placeholder="Nhập họ và tên đầy đủ"
                    />
                    {errors.fullName && (
                      <p className="mt-1 text-sm text-red-600 dark:text-red-400">{errors.fullName}</p>
                    )}
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                      Email *
                    </label>
                    <input
                      type="email"
                      value={formData.email}
                      onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                      className={cn(
                        'w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent dark:bg-gray-700 dark:text-white',
                        errors.email ? 'border-red-500' : 'border-gray-300 dark:border-gray-600'
                      )}
                      placeholder="example@email.com"
                    />
                    {errors.email && (
                      <p className="mt-1 text-sm text-red-600 dark:text-red-400">{errors.email}</p>
                    )}
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                      Số điện thoại *
                    </label>
                    <input
                      type="tel"
                      value={formData.phone}
                      onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                      className={cn(
                        'w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent dark:bg-gray-700 dark:text-white',
                        errors.phone ? 'border-red-500' : 'border-gray-300 dark:border-gray-600'
                      )}
                      placeholder="0123456789"
                    />
                    {errors.phone && (
                      <p className="mt-1 text-sm text-red-600 dark:text-red-400">{errors.phone}</p>
                    )}
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                      Mã sinh viên *
                    </label>
                    <input
                      type="text"
                      value={formData.studentId}
                      onChange={(e) => setFormData({ ...formData, studentId: e.target.value })}
                      className={cn(
                        'w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent dark:bg-gray-700 dark:text-white',
                        errors.studentId ? 'border-red-500' : 'border-gray-300 dark:border-gray-600'
                      )}
                      placeholder="SV123456"
                    />
                    {errors.studentId && (
                      <p className="mt-1 text-sm text-red-600 dark:text-red-400">{errors.studentId}</p>
                    )}
                  </div>
                </div>
              </div>
            )}

            {/* Step 2: Booking Details */}
            {currentStep === 2 && (
              <div className="space-y-6">
                <h3 className="text-xl font-semibold text-gray-900 dark:text-white mb-4">
                  Chi tiết đặt phòng
                </h3>
                <p className="text-sm text-gray-600 dark:text-gray-400 mb-4">
                  Không được chọn ngày nhận trong quá khứ. Thời gian thuê tối thiểu{' '}
                  <span className="font-semibold text-blue-600">3 tháng</span> ({BOOKING_MIN_STAY_DAYS} ngày).
                  {roomCapacity > 1 && (
                    <>
                      {' '}
                      Phòng tối đa <span className="font-semibold">{roomCapacity}</span> chỗ. Mỗi lượt đặt tối đa{' '}
                      <span className="font-semibold">{MAX_USER_BOOKING_OCCUPANCY_UNITS}</span> chỗ (bản thân / đi cùng); giá
                      theo số chỗ đặt.
                    </>
                  )}
                </p>

                {expiringLeaseEndYmd && (
                  <div className="rounded-xl border border-sky-200/90 bg-sky-50/95 px-3 py-2.5 text-sm text-sky-950 dark:border-sky-800/60 dark:bg-sky-950/35 dark:text-sky-100">
                    <p className="font-semibold text-sky-900 dark:text-sky-50">Phòng đang giai đoạn sắp trả (~{EXPIRING_SOON_LEAD_DAYS} ngày cuối hợp đồng)</p>
                    <p className="mt-1 text-xs sm:text-sm opacity-95">
                      Ngày trả dự kiến của hợp đồng hiện tại:{' '}
                      <span className="font-medium tabular-nums">{expiringLeaseEndLabel}</span>. Chọn ngày nhận trong khoảng tối đa 1
                      ngày trước đến 7 ngày sau ngày đó để hệ thống tạo <span className="font-medium">đặt trước</span> (QUEUED).
                      Người đang ở được ưu tiên gia hạn; nếu họ gia hạn, đặt trước có thể bị hủy.
                    </p>
                  </div>
                )}

                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                      Ngày nhận phòng *
                    </label>
                    <input
                      type="date"
                      min={minCheckIn}
                      value={formData.moveInDate}
                      onChange={(e) => {
                        const moveInDate = e.target.value
                        setFormData((prev) => {
                          const minOut = getMinMoveOutInputValue(moveInDate)
                          let moveOutDate = prev.moveOutDate
                          if (minOut && moveOutDate && moveOutDate < minOut) {
                            moveOutDate = ''
                          }
                          return { ...prev, moveInDate, moveOutDate }
                        })
                      }}
                      className={cn(
                        'w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent dark:bg-gray-700 dark:text-white',
                        errors.moveInDate ? 'border-red-500' : 'border-gray-300 dark:border-gray-600'
                      )}
                    />
                    {errors.moveInDate && (
                      <p className="mt-1 text-sm text-red-600 dark:text-red-400">{errors.moveInDate}</p>
                    )}
                    {moveInIsPreBookWindow && (
                      <p className="mt-1 text-xs text-sky-800 dark:text-sky-200">
                        Ngày nhận nằm trong cửa sổ đặt trước — đơn có thể được tạo không cần thanh toán ngay; thanh toán khi tới lượt kích hoạt.
                      </p>
                    )}
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                      Ngày trả phòng *
                    </label>
                    <input
                      type="date"
                      min={minCheckOut}
                      value={formData.moveOutDate}
                      onChange={(e) =>
                        setFormData({ ...formData, moveOutDate: e.target.value })
                      }
                      className={cn(
                        'w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent dark:bg-gray-700 dark:text-white',
                        errors.moveOutDate ? 'border-red-500' : 'border-gray-300 dark:border-gray-600'
                      )}
                    />
                    {errors.moveOutDate && (
                      <p className="mt-1 text-sm text-red-600 dark:text-red-400">{errors.moveOutDate}</p>
                    )}
                  </div>

                  <div className="md:col-span-2">
                    <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                      Đặt cọc (tháng) *
                    </label>
                    <input
                      type="number"
                      min="3"
                      max="24"
                      value={formData.duration}
                      onChange={(e) => setFormData({ ...formData, duration: parseInt(e.target.value) || 3 })}
                      className={cn(
                        'w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent dark:bg-gray-700 dark:text-white',
                        errors.duration ? 'border-red-500' : 'border-gray-300 dark:border-gray-600'
                      )}
                    />
                    <p className="mt-1 text-xs text-gray-500 dark:text-gray-400">
                      Thời gian thuê tối thiểu 3 tháng
                    </p>
                    {errors.duration && (
                      <p className="mt-1 text-sm text-red-600 dark:text-red-400">{errors.duration}</p>
                    )}
                  </div>

                  {maxUserOccupancy > 1 && (
                    <div className="md:col-span-2">
                      <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                        Số chỗ đặt *
                      </label>
                      <select
                        value={formData.occupancyUnits}
                        onChange={(e) =>
                          setFormData({
                            ...formData,
                            occupancyUnits: Math.min(
                              maxUserOccupancy,
                              Math.max(1, parseInt(e.target.value, 10) || 1),
                            ),
                          })
                        }
                        className="w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent dark:bg-gray-700 dark:text-white border-gray-300 dark:border-gray-600"
                      >
                        {Array.from({ length: maxUserOccupancy }, (_, i) => i + 1).map((n) => (
                          <option key={n} value={n}>
                            {n} chỗ
                          </option>
                        ))}
                      </select>
                      <p className="mt-1 text-xs text-gray-500 dark:text-gray-400">
                        Tối đa {MAX_USER_BOOKING_OCCUPANCY_UNITS} chỗ mỗi lượt. Mỗi chỗ = một suất; tổng = giá/tháng × số chỗ ×
                        số tháng.
                      </p>
                    </div>
                  )}
                </div>

                {/* Room Summary */}
                <div className="bg-gray-50 dark:bg-gray-700 rounded-lg p-4">
                  <h4 className="font-semibold text-gray-900 dark:text-white mb-3">Tóm tắt phòng</h4>
                  <div className="space-y-2 text-sm">
                    <div className="flex justify-between">
                      <span className="text-gray-600 dark:text-gray-400">Phòng:</span>
                      <span className="text-gray-900 dark:text-white">{room.roomNumber}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-gray-600 dark:text-gray-400">Loại:</span>
                      <span className="text-gray-900 dark:text-white">{room.type}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-gray-600 dark:text-gray-400">Giá/tháng (mỗi chỗ):</span>
                      <span className="text-gray-900 dark:text-white">{room.price.toLocaleString()}đ</span>
                    </div>
                    {maxUserOccupancy > 1 && (
                      <div className="flex justify-between">
                        <span className="text-gray-600 dark:text-gray-400">Số chỗ:</span>
                        <span className="text-gray-900 dark:text-white">{formData.occupancyUnits}</span>
                      </div>
                    )}
                    <div className="flex justify-between">
                      <span className="text-gray-600 dark:text-gray-400">Thời gian:</span>
                      <span className="text-gray-900 dark:text-white">{formData.duration} tháng</span>
                    </div>
                    <div className="flex justify-between font-semibold border-t border-gray-200 dark:border-gray-600 pt-2">
                      <span className="text-gray-900 dark:text-white">Tổng cộng:</span>
                      <span className="text-green-600 dark:text-green-400">{calculateTotal().toLocaleString()}đ</span>
                    </div>
                  </div>
                </div>
              </div>
            )}

            {/* Step 3: Confirmation & Payment */}
            {currentStep === 3 && (
              <div className="space-y-6">
                <h3 className="text-xl font-semibold text-gray-900 dark:text-white mb-4">
                  Xác nhận & Thanh toán
                </h3>

                {/* Payment Method */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-3">
                    Phương thức thanh toán
                  </label>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <button
                      onClick={() => setFormData({ ...formData, paymentMethod: 'VIETQR' })}
                      className={cn(
                        'p-4 border rounded-lg text-left transition-colors duration-200',
                        formData.paymentMethod === 'VIETQR'
                          ? 'border-blue-500 bg-blue-50 dark:bg-blue-900/20'
                          : 'border-gray-300 dark:border-gray-600 hover:border-gray-400 dark:hover:border-gray-500'
                      )}
                    >
                      <Banknote className="h-6 w-6 text-blue-600 dark:text-blue-400 mb-2" />
                      <div className="font-medium text-gray-900 dark:text-white">VietQR</div>
                      <div className="text-sm text-gray-600 dark:text-gray-400">Quét mã QR ngân hàng</div>
                    </button>

                    <button
                      onClick={() => setFormData({ ...formData, paymentMethod: 'VNPAY' })}
                      className={cn(
                        'p-4 border rounded-lg text-left transition-colors duration-200',
                        formData.paymentMethod === 'VNPAY'
                          ? 'border-blue-500 bg-blue-50 dark:bg-blue-900/20'
                          : 'border-gray-300 dark:border-gray-600 hover:border-gray-400 dark:hover:border-gray-500'
                      )}
                    >
                      <CreditCard className="h-6 w-6 text-blue-600 dark:text-blue-400 mb-2" />
                      <div className="font-medium text-gray-900 dark:text-white">VNPay</div>
                      <div className="text-sm text-gray-600 dark:text-gray-400">Thanh toán qua VNPay</div>
                    </button>

                    <button
                      onClick={() => setFormData({ ...formData, paymentMethod: 'MOMO' })}
                      className={cn(
                        'p-4 border rounded-lg text-left transition-colors duration-200',
                        formData.paymentMethod === 'MOMO'
                          ? 'border-pink-500 bg-pink-50 dark:bg-pink-900/20'
                          : 'border-gray-300 dark:border-gray-600 hover:border-gray-400 dark:hover:border-gray-500'
                      )}
                    >
                      <Smartphone className="h-6 w-6 text-pink-600 dark:text-pink-400 mb-2" />
                      <div className="font-medium text-gray-900 dark:text-white">MoMo</div>
                      <div className="text-sm text-gray-600 dark:text-gray-400">Ví điện tử MoMo</div>
                    </button>

                    <button
                      onClick={() => setFormData({ ...formData, paymentMethod: 'PAYOS' as any })}
                      className={cn(
                        'p-4 border rounded-lg text-left transition-colors duration-200',
                        (formData.paymentMethod as string) === 'PAYOS'
                          ? 'border-green-500 bg-green-50 dark:bg-green-900/20'
                          : 'border-gray-300 dark:border-gray-600 hover:border-gray-400 dark:hover:border-gray-500'
                      )}
                    >
                      <CreditCard className="h-6 w-6 text-green-600 dark:text-green-400 mb-2" />
                      <div className="font-medium text-gray-900 dark:text-white">PayOS</div>
                      <div className="text-sm text-gray-600 dark:text-gray-400">Cổng thanh toán PayOS</div>
                    </button>
                  </div>
                </div>

                {/* Payment Summary */}
                <div className="bg-gray-50 dark:bg-gray-700 rounded-lg p-6">
                  <h4 className="font-semibold text-gray-900 dark:text-white mb-4">Tóm tắt thanh toán</h4>
                  <div className="space-y-3">
                    <div className="flex justify-between">
                      <span className="text-gray-600 dark:text-gray-400">Tiền phòng ({formData.duration} tháng):</span>
                      <span className="text-gray-900 dark:text-white">{calculateTotal().toLocaleString()}đ</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-gray-600 dark:text-gray-400">Tiền cọc (30%):</span>
                      <span className="text-gray-900 dark:text-white">{calculateDeposit().toLocaleString()}đ</span>
                    </div>
                    <div className="flex justify-between font-semibold text-lg border-t border-gray-200 dark:border-gray-600 pt-3">
                      <span className="text-gray-900 dark:text-white">Tổng cộng:</span>
                      <span className="text-green-600 dark:text-green-400">{calculateTotal().toLocaleString()}đ</span>
                    </div>
                  </div>
                </div>

                {/* Special Requests (Optional) */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                    Yêu cầu đặc biệt (Tùy chọn)
                  </label>
                  <textarea
                    value={formData.specialRequests}
                    onChange={(e) => setFormData({ ...formData, specialRequests: e.target.value })}
                    rows={3}
                    className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent dark:bg-gray-700 dark:text-white"
                    placeholder="Nhập yêu cầu đặc biệt (ví dụ: tầng cao, hướng cửa sổ, v.v.)"
                  />
                </div>

                {/* Terms and Conditions */}
                <div className="space-y-4">
                  <div className="flex items-start space-x-3">
                    <input
                      type="checkbox"
                      id="terms"
                      checked={formData.agreeToTerms}
                      onChange={(e) => setFormData({ ...formData, agreeToTerms: e.target.checked })}
                      className="mt-1 h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded"
                    />
                    <label htmlFor="terms" className="text-sm text-gray-600 dark:text-gray-400">
                      Tôi đồng ý với <a href="#" className="text-blue-600 hover:underline">điều khoản và điều kiện</a> của dịch vụ *
                    </label>
                  </div>
                  {errors.agreeToTerms && (
                    <p className="text-sm text-red-600 dark:text-red-400">{errors.agreeToTerms}</p>
                  )}

                  <div className="flex items-start space-x-3">
                    <input
                      type="checkbox"
                      id="privacy"
                      checked={formData.agreeToPrivacy}
                      onChange={(e) => setFormData({ ...formData, agreeToPrivacy: e.target.checked })}
                      className="mt-1 h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded"
                    />
                    <label htmlFor="privacy" className="text-sm text-gray-600 dark:text-gray-400">
                      Tôi đồng ý với <a href="#" className="text-blue-600 hover:underline">chính sách bảo mật</a> *
                    </label>
                  </div>
                  {errors.agreeToPrivacy && (
                    <p className="text-sm text-red-600 dark:text-red-400">{errors.agreeToPrivacy}</p>
                  )}
                </div>
              </div>
            )}
          </div>

          {/* Footer */}
          <div className="flex items-center justify-between p-6 border-t border-gray-200 dark:border-gray-700">
            <button
              onClick={currentStep === 1 ? onClose : handlePrev}
              className="px-6 py-2 text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:hover:text-white transition-colors duration-200"
            >
              {currentStep === 1 ? 'Hủy' : 'Quay lại'}
            </button>

            <div className="flex space-x-3">
              {currentStep < 3 ? (
                <button
                  onClick={handleNext}
                  className="px-6 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600 transition-colors duration-200"
                >
                  Tiếp theo
                </button>
              ) : (
                <button
                  onClick={handleSubmit}
                  className="px-6 py-2 bg-green-500 text-white rounded-lg hover:bg-green-600 transition-colors duration-200"
                >
                  Xác nhận đặt phòng
                </button>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

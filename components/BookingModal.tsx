'use client'

import { useState, useEffect } from 'react'
import { 
  X, 
  Calendar, 
  User, 
  Phone, 
  Mail, 
  MapPin, 
  DollarSign,
  Clock,
  CheckCircle,
  AlertCircle,
  CreditCard,
  Banknote,
  Smartphone
} from 'lucide-react'
import { cn } from '@/lib/utils'
import { Room, BookingFormData } from '@/types'
import { useUser } from '@/contexts/UserContext'

interface BookingModalProps {
  isOpen: boolean
  onClose: () => void
  onSubmit: (data: BookingFormData) => void
  room: Room
  building: any
}

export default function BookingModal({ isOpen, onClose, onSubmit, room, building }: BookingModalProps) {
  const { user } = useUser()
  const [currentStep, setCurrentStep] = useState(1)
  const [formData, setFormData] = useState<BookingFormData>({
    // Personal Info
    fullName: '',
    email: '',
    phone: '',
    studentId: '',
    
    // Booking Details
    moveInDate: '',
    moveOutDate: '',
    duration: 12,
    
    // Payment
    paymentMethod: 'bank_transfer',
    
    // Additional Info
    specialRequests: '',
    emergencyContact: '',
    emergencyPhone: '',
    
    // Terms
    agreeToTerms: false,
    agreeToPrivacy: false
  })

  const [errors, setErrors] = useState<Record<string, string>>({})

  // Pre-fill user information when modal opens
  useEffect(() => {
    if (isOpen && user) {
      setFormData(prev => ({
        ...prev,
        // Pre-fill user info only if fields are empty (preserve user edits during session)
        fullName: prev.fullName || user.name || '',
        email: prev.email || user.email || '',
        phone: prev.phone || user.phone || '',
        // Use user id as studentId if available
        studentId: prev.studentId || user.id || '',
      }))
    }
  }, [isOpen, user])

  // Reset form and step when modal closes
  useEffect(() => {
    if (!isOpen) {
      setCurrentStep(1)
      setErrors({})
      // Reset all form fields to empty
      setFormData({
        fullName: '',
        email: '',
        phone: '',
        studentId: '',
        moveInDate: '',
        moveOutDate: '',
        duration: 12,
        paymentMethod: 'bank_transfer',
        specialRequests: '',
        emergencyContact: '',
        emergencyPhone: '',
        agreeToTerms: false,
        agreeToPrivacy: false,
      })
    }
  }, [isOpen])

  const validateStep = (step: number): boolean => {
    const newErrors: Record<string, string> = {}

    if (step === 1) {
      if (!formData.fullName.trim()) newErrors.fullName = 'Vui lòng nhập họ tên'
      if (!formData.email.trim()) newErrors.email = 'Vui lòng nhập email'
      if (!formData.phone.trim()) newErrors.phone = 'Vui lòng nhập số điện thoại'
      if (!formData.studentId.trim()) newErrors.studentId = 'Vui lòng nhập mã sinh viên'
    }

    if (step === 2) {
      if (!formData.moveInDate) newErrors.moveInDate = 'Vui lòng chọn ngày nhận phòng'
      if (!formData.moveOutDate) newErrors.moveOutDate = 'Vui lòng chọn ngày trả phòng'
      if (formData.duration && formData.duration < 1) newErrors.duration = 'Thời gian thuê phải ít nhất 1 tháng'
    }

    if (step === 3) {
      if (!formData.emergencyContact.trim()) newErrors.emergencyContact = 'Vui lòng nhập người liên hệ khẩn cấp'
      if (!formData.emergencyPhone.trim()) newErrors.emergencyPhone = 'Vui lòng nhập số điện thoại liên hệ khẩn cấp'
    }

    if (step === 4) {
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
    if (validateStep(currentStep)) {
      onSubmit(formData)
    }
  }

  const calculateTotal = () => {
    return formData.duration * room.price
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
                { step: 3, title: 'Thông tin bổ sung', icon: AlertCircle },
                { step: 4, title: 'Xác nhận & Thanh toán', icon: CheckCircle }
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
                
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                      Ngày nhận phòng *
                    </label>
                    <input
                      type="date"
                      value={formData.moveInDate}
                      onChange={(e) => setFormData({ ...formData, moveInDate: e.target.value })}
                      className={cn(
                        'w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent dark:bg-gray-700 dark:text-white',
                        errors.moveInDate ? 'border-red-500' : 'border-gray-300 dark:border-gray-600'
                      )}
                    />
                    {errors.moveInDate && (
                      <p className="mt-1 text-sm text-red-600 dark:text-red-400">{errors.moveInDate}</p>
                    )}
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                      Ngày trả phòng *
                    </label>
                    <input
                      type="date"
                      value={formData.moveOutDate}
                      onChange={(e) => setFormData({ ...formData, moveOutDate: e.target.value })}
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
                      Thời gian thuê (tháng) *
                    </label>
                    <input
                      type="number"
                      min="1"
                      max="24"
                      value={formData.duration}
                      onChange={(e) => setFormData({ ...formData, duration: parseInt(e.target.value) || 1 })}
                      className={cn(
                        'w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent dark:bg-gray-700 dark:text-white',
                        errors.duration ? 'border-red-500' : 'border-gray-300 dark:border-gray-600'
                      )}
                    />
                    {errors.duration && (
                      <p className="mt-1 text-sm text-red-600 dark:text-red-400">{errors.duration}</p>
                    )}
                  </div>
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
                      <span className="text-gray-600 dark:text-gray-400">Giá/tháng:</span>
                      <span className="text-gray-900 dark:text-white">{room.price.toLocaleString()}đ</span>
                    </div>
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

            {/* Step 3: Additional Information */}
            {currentStep === 3 && (
              <div className="space-y-6">
                <h3 className="text-xl font-semibold text-gray-900 dark:text-white mb-4">
                  Thông tin bổ sung
                </h3>
                
                <div className="space-y-6">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                      Người liên hệ khẩn cấp *
                    </label>
                    <input
                      type="text"
                      value={formData.emergencyContact}
                      onChange={(e) => setFormData({ ...formData, emergencyContact: e.target.value })}
                      className={cn(
                        'w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent dark:bg-gray-700 dark:text-white',
                        errors.emergencyContact ? 'border-red-500' : 'border-gray-300 dark:border-gray-600'
                      )}
                      placeholder="Họ tên người liên hệ khẩn cấp"
                    />
                    {errors.emergencyContact && (
                      <p className="mt-1 text-sm text-red-600 dark:text-red-400">{errors.emergencyContact}</p>
                    )}
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                      Số điện thoại liên hệ khẩn cấp *
                    </label>
                    <input
                      type="tel"
                      value={formData.emergencyPhone}
                      onChange={(e) => setFormData({ ...formData, emergencyPhone: e.target.value })}
                      className={cn(
                        'w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent dark:bg-gray-700 dark:text-white',
                        errors.emergencyPhone ? 'border-red-500' : 'border-gray-300 dark:border-gray-600'
                      )}
                      placeholder="0123456789"
                    />
                    {errors.emergencyPhone && (
                      <p className="mt-1 text-sm text-red-600 dark:text-red-400">{errors.emergencyPhone}</p>
                    )}
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                      Yêu cầu đặc biệt
                    </label>
                    <textarea
                      value={formData.specialRequests}
                      onChange={(e) => setFormData({ ...formData, specialRequests: e.target.value })}
                      rows={4}
                      className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent dark:bg-gray-700 dark:text-white"
                      placeholder="Nhập các yêu cầu đặc biệt (nếu có)..."
                    />
                  </div>
                </div>
              </div>
            )}

            {/* Step 4: Confirmation & Payment */}
            {currentStep === 4 && (
              <div className="space-y-6">
                <h3 className="text-xl font-semibold text-gray-900 dark:text-white mb-4">
                  Xác nhận & Thanh toán
                </h3>
                
                {/* Payment Method */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-3">
                    Phương thức thanh toán
                  </label>
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                    <button
                      onClick={() => setFormData({ ...formData, paymentMethod: 'bank_transfer' })}
                      className={cn(
                        'p-4 border rounded-lg text-left transition-colors duration-200',
                        formData.paymentMethod === 'bank_transfer'
                          ? 'border-blue-500 bg-blue-50 dark:bg-blue-900/20'
                          : 'border-gray-300 dark:border-gray-600 hover:border-gray-400 dark:hover:border-gray-500'
                      )}
                    >
                      <Banknote className="h-6 w-6 text-blue-600 dark:text-blue-400 mb-2" />
                      <div className="font-medium text-gray-900 dark:text-white">Chuyển khoản</div>
                      <div className="text-sm text-gray-600 dark:text-gray-400">Thanh toán qua ngân hàng</div>
                    </button>

                    <button
                      onClick={() => setFormData({ ...formData, paymentMethod: 'credit_card' })}
                      className={cn(
                        'p-4 border rounded-lg text-left transition-colors duration-200',
                        formData.paymentMethod === 'credit_card'
                          ? 'border-blue-500 bg-blue-50 dark:bg-blue-900/20'
                          : 'border-gray-300 dark:border-gray-600 hover:border-gray-400 dark:hover:border-gray-500'
                      )}
                    >
                      <CreditCard className="h-6 w-6 text-blue-600 dark:text-blue-400 mb-2" />
                      <div className="font-medium text-gray-900 dark:text-white">Thẻ tín dụng</div>
                      <div className="text-sm text-gray-600 dark:text-gray-400">Visa, Mastercard</div>
                    </button>

                    <button
                      onClick={() => setFormData({ ...formData, paymentMethod: 'momo' })}
                      className={cn(
                        'p-4 border rounded-lg text-left transition-colors duration-200',
                        formData.paymentMethod === 'momo'
                          ? 'border-blue-500 bg-blue-50 dark:bg-blue-900/20'
                          : 'border-gray-300 dark:border-gray-600 hover:border-gray-400 dark:hover:border-gray-500'
                      )}
                    >
                      <Smartphone className="h-6 w-6 text-blue-600 dark:text-blue-400 mb-2" />
                      <div className="font-medium text-gray-900 dark:text-white">MoMo</div>
                      <div className="text-sm text-gray-600 dark:text-gray-400">Ví điện tử</div>
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
              {currentStep < 4 ? (
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

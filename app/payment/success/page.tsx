'use client'

import { useSearchParams, useRouter } from 'next/navigation'
import { CheckCircle, Home, Calendar } from 'lucide-react'
import { Suspense } from 'react'

function PaymentSuccessContent() {
    const searchParams = useSearchParams()
    const router = useRouter()

    const bookingId = searchParams.get('bookingId')
    const paymentId = searchParams.get('paymentId')

    return (
        <div className="min-h-screen bg-gray-50 dark:bg-gray-900 flex items-center justify-center p-4">
            <div className="max-w-md w-full bg-white dark:bg-gray-800 rounded-2xl shadow-xl p-8 text-center">
                <div className="mx-auto w-16 h-16 bg-green-100 dark:bg-green-900/30 rounded-full flex items-center justify-center mb-6">
                    <CheckCircle className="w-10 h-10 text-green-600 dark:text-green-400" />
                </div>

                <h1 className="text-2xl font-bold text-gray-900 dark:text-white mb-2">
                    Thanh toán thành công!
                </h1>

                <p className="text-gray-600 dark:text-gray-400 mb-8">
                    Cảm ơn bạn đã thanh toán. Đơn đặt phòng của bạn đã được xác nhận.
                </p>

                <div className="bg-gray-50 dark:bg-gray-700/50 rounded-xl p-4 mb-8 text-left">
                    <div className="space-y-3">
                        {bookingId && (
                            <div className="flex justify-between">
                                <span className="text-sm text-gray-500 dark:text-gray-400">Mã đặt phòng</span>
                                <span className="text-sm font-medium text-gray-900 dark:text-white">{bookingId}</span>
                            </div>
                        )}
                        {paymentId && (
                            <div className="flex justify-between">
                                <span className="text-sm text-gray-500 dark:text-gray-400">Mã giao dịch</span>
                                <span className="text-sm font-medium text-gray-900 dark:text-white font-mono">
                                    {paymentId.slice(0, 8)}...
                                </span>
                            </div>
                        )}
                        <div className="flex justify-between border-t border-gray-200 dark:border-gray-600 pt-3">
                            <span className="text-sm text-gray-500 dark:text-gray-400">Trạng thái</span>
                            <span className="text-sm font-medium text-green-600 dark:text-green-400">Đã thanh toán</span>
                        </div>
                    </div>
                </div>

                <div className="space-y-3">
                    <button
                        onClick={() => router.push('/dashboard/bookings')}
                        className="w-full flex items-center justify-center px-4 py-3 bg-blue-600 hover:bg-blue-700 text-white rounded-xl font-medium transition-colors"
                    >
                        <Calendar className="w-5 h-5 mr-2" />
                        Xem đặt phòng của tôi
                    </button>

                    <button
                        onClick={() => router.push('/')}
                        className="w-full flex items-center justify-center px-4 py-3 bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 text-gray-700 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-700 rounded-xl font-medium transition-colors"
                    >
                        <Home className="w-5 h-5 mr-2" />
                        Về trang chủ
                    </button>
                </div>
            </div>
        </div>
    )
}

export default function PaymentSuccessPage() {
    return (
        <Suspense fallback={
            <div className="min-h-screen bg-gray-50 dark:bg-gray-900 flex items-center justify-center">
                <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
            </div>
        }>
            <PaymentSuccessContent />
        </Suspense>
    )
}

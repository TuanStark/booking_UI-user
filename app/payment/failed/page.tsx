'use client'

import { useSearchParams, useRouter } from 'next/navigation'
import { XCircle, Home, RefreshCw } from 'lucide-react'
import { Suspense } from 'react'

function PaymentFailedContent() {
    const searchParams = useSearchParams()
    const router = useRouter()

    const message = searchParams.get('message')

    return (
        <div className="min-h-screen bg-gray-50 dark:bg-gray-900 flex items-center justify-center p-4">
            <div className="max-w-md w-full bg-white dark:bg-gray-800 rounded-2xl shadow-xl p-8 text-center">
                <div className="mx-auto w-16 h-16 bg-red-100 dark:bg-red-900/30 rounded-full flex items-center justify-center mb-6">
                    <XCircle className="w-10 h-10 text-red-600 dark:text-red-400" />
                </div>

                <h1 className="text-2xl font-bold text-gray-900 dark:text-white mb-2">
                    Thanh toán thất bại
                </h1>

                <p className="text-gray-600 dark:text-gray-400 mb-8">
                    Rất tiếc, quá trình thanh toán đã gặp sự cố. Vui lòng thử lại.
                </p>

                {message && (
                    <div className="bg-red-50 dark:bg-red-900/10 border border-red-100 dark:border-red-900/30 rounded-xl p-4 mb-8">
                        <p className="text-sm text-red-600 dark:text-red-400">
                            {decodeURIComponent(message)}
                        </p>
                    </div>
                )}

                <div className="space-y-3">
                    <button
                        onClick={() => router.back()}
                        className="w-full flex items-center justify-center px-4 py-3 bg-blue-600 hover:bg-blue-700 text-white rounded-xl font-medium transition-colors"
                    >
                        <RefreshCw className="w-5 h-5 mr-2" />
                        Thử lại
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

export default function PaymentFailedPage() {
    return (
        <Suspense fallback={
            <div className="min-h-screen bg-gray-50 dark:bg-gray-900 flex items-center justify-center">
                <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-red-600"></div>
            </div>
        }>
            <PaymentFailedContent />
        </Suspense>
    )
}

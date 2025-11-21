'use client'

import { useEffect, useState } from 'react'
import { useRouter, useSearchParams } from 'next/navigation'
import { CheckCircle, XCircle, Loader2 } from 'lucide-react'

export default function VNPayReturnPage() {
    const router = useRouter()
    const searchParams = useSearchParams()
    const [status, setStatus] = useState<'loading' | 'success' | 'failed'>('loading')
    const [message, setMessage] = useState('')

    useEffect(() => {
        const verifyPayment = async () => {
            try {
                // Get all query parameters from VNPay callback
                const params: Record<string, string> = {}
                searchParams.forEach((value, key) => {
                    params[key] = value
                })

                console.log('VNPay callback params:', params)

                // Check response code
                const responseCode = params.vnp_ResponseCode

                if (responseCode === '00') {
                    setStatus('success')
                    setMessage('Thanh toán thành công! Đang chuyển hướng...')

                    // Redirect to bookings page after 3 seconds
                    setTimeout(() => {
                        router.push('/bookings')
                    }, 3000)
                } else {
                    setStatus('failed')
                    setMessage(getErrorMessage(responseCode))

                    // Redirect to bookings page after 5 seconds
                    setTimeout(() => {
                        router.push('/bookings')
                    }, 5000)
                }
            } catch (error) {
                console.error('Error verifying payment:', error)
                setStatus('failed')
                setMessage('Có lỗi xảy ra khi xác thực thanh toán')

                setTimeout(() => {
                    router.push('/bookings')
                }, 5000)
            }
        }

        verifyPayment()
    }, [searchParams, router])

    return (
        <div className="min-h-screen flex items-center justify-center bg-gray-50 dark:bg-gray-900 p-4">
            <div className="max-w-md w-full bg-white dark:bg-gray-800 rounded-2xl shadow-xl p-8 text-center">
                {status === 'loading' && (
                    <>
                        <Loader2 className="h-16 w-16 text-blue-500 animate-spin mx-auto mb-4" />
                        <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-2">
                            Đang xác thực thanh toán...
                        </h2>
                        <p className="text-gray-600 dark:text-gray-400">
                            Vui lòng đợi trong giây lát
                        </p>
                    </>
                )}

                {status === 'success' && (
                    <>
                        <div className="bg-green-100 dark:bg-green-900/30 rounded-full p-4 w-20 h-20 mx-auto mb-4 flex items-center justify-center">
                            <CheckCircle className="h-12 w-12 text-green-600 dark:text-green-400" />
                        </div>
                        <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-2">
                            Thanh toán thành công!
                        </h2>
                        <p className="text-gray-600 dark:text-gray-400 mb-4">
                            {message}
                        </p>
                        <div className="bg-green-50 dark:bg-green-900/20 rounded-lg p-4 text-sm text-green-700 dark:text-green-300">
                            Bạn sẽ được chuyển đến trang đặt phòng trong 3 giây...
                        </div>
                    </>
                )}

                {status === 'failed' && (
                    <>
                        <div className="bg-red-100 dark:bg-red-900/30 rounded-full p-4 w-20 h-20 mx-auto mb-4 flex items-center justify-center">
                            <XCircle className="h-12 w-12 text-red-600 dark:text-red-400" />
                        </div>
                        <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-2">
                            Thanh toán thất bại
                        </h2>
                        <p className="text-gray-600 dark:text-gray-400 mb-4">
                            {message}
                        </p>
                        <div className="bg-red-50 dark:bg-red-900/20 rounded-lg p-4 text-sm text-red-700 dark:text-red-300 mb-4">
                            Bạn sẽ được chuyển đến trang đặt phòng trong 5 giây...
                        </div>
                        <button
                            onClick={() => router.push('/bookings')}
                            className="px-6 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600 transition-colors"
                        >
                            Quay lại ngay
                        </button>
                    </>
                )}
            </div>
        </div>
    )
}

function getErrorMessage(code: string): string {
    const errorMessages: Record<string, string> = {
        '07': 'Trừ tiền thành công. Giao dịch bị nghi ngờ (liên quan tới lừa đảo, giao dịch bất thường).',
        '09': 'Thẻ/Tài khoản của khách hàng chưa đăng ký dịch vụ InternetBanking tại ngân hàng.',
        '10': 'Khách hàng xác thực thông tin thẻ/tài khoản không đúng quá 3 lần',
        '11': 'Đã hết hạn chờ thanh toán. Xin quý khách vui lòng thực hiện lại giao dịch.',
        '12': 'Thẻ/Tài khoản của khách hàng bị khóa.',
        '13': 'Quý khách nhập sai mật khẩu xác thực giao dịch (OTP). Xin quý khách vui lòng thực hiện lại giao dịch.',
        '24': 'Khách hàng hủy giao dịch',
        '51': 'Tài khoản của quý khách không đủ số dư để thực hiện giao dịch.',
        '65': 'Tài khoản của Quý khách đã vượt quá hạn mức giao dịch trong ngày.',
        '75': 'Ngân hàng thanh toán đang bảo trì.',
        '79': 'KH nhập sai mật khẩu thanh toán quá số lần quy định. Xin quý khách vui lòng thực hiện lại giao dịch',
        '99': 'Các lỗi khác (lỗi còn lại, không có trong danh sách mã lỗi đã liệt kê)',
    }

    return errorMessages[code] || 'Giao dịch không thành công. Vui lòng thử lại sau.'
}

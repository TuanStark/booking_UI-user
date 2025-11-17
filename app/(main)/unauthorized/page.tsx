'use client'

import Link from 'next/link'
import { Shield, ArrowLeft, Home } from 'lucide-react'

export default function UnauthorizedPage() {
  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900">
      <div className="pt-16 pb-12">
        <div className="max-w-2xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          {/* Icon */}
          <div className="mb-8">
            <div className="w-24 h-24 bg-red-100 dark:bg-red-900/20 rounded-full flex items-center justify-center mx-auto mb-6">
              <Shield className="h-12 w-12 text-red-600 dark:text-red-400" />
            </div>
          </div>

          {/* Content */}
          <div className="space-y-6">
            <h1 className="text-4xl font-bold text-gray-900 dark:text-white">
              Truy Cập Bị Từ Chối
            </h1>
            
            <p className="text-xl text-gray-600 dark:text-gray-400">
              Bạn không có quyền truy cập vào trang này
            </p>
            
            <div className="bg-yellow-50 dark:bg-yellow-900/20 border border-yellow-200 dark:border-yellow-800 rounded-lg p-6">
              <h2 className="text-lg font-semibold text-yellow-800 dark:text-yellow-200 mb-3">
                Có thể bạn đang tìm kiếm:
              </h2>
              <ul className="text-left text-yellow-700 dark:text-yellow-300 space-y-2">
                <li>• Đăng nhập với tài khoản có quyền phù hợp</li>
                <li>• Liên hệ quản trị viên để được cấp quyền</li>
                <li>• Quay lại trang chủ để tiếp tục</li>
              </ul>
            </div>

            {/* Action Buttons */}
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Link
                href="/"
                className="inline-flex items-center px-6 py-3 bg-gradient-to-r from-blue-500 to-purple-600 text-white font-semibold rounded-lg hover:from-blue-600 hover:to-purple-700 transition-all duration-200 shadow-lg hover:shadow-xl"
              >
                <Home className="h-5 w-5 mr-2" />
                Về trang chủ
              </Link>
              
              <Link
                href="/auth/signin"
                className="inline-flex items-center px-6 py-3 border-2 border-gray-300 dark:border-gray-600 text-gray-700 dark:text-gray-300 font-semibold rounded-lg hover:bg-gray-50 dark:hover:bg-gray-700 transition-all duration-200"
              >
                <ArrowLeft className="h-5 w-5 mr-2" />
                Đăng nhập lại
              </Link>
            </div>
          </div>

          {/* Additional Info */}
          <div className="mt-12 bg-white dark:bg-gray-800 rounded-2xl shadow-lg p-8">
            <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">
              Cần hỗ trợ?
            </h3>
            <p className="text-gray-600 dark:text-gray-400 mb-6">
              Nếu bạn tin rằng đây là lỗi hoặc cần hỗ trợ, vui lòng liên hệ với chúng tôi
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Link
                href="/contact"
                className="text-blue-600 dark:text-blue-400 hover:text-blue-500 dark:hover:text-blue-300 font-medium"
              >
                Liên hệ hỗ trợ
              </Link>
              <span className="text-gray-400 hidden sm:block">•</span>
              <Link
                href="/about"
                className="text-blue-600 dark:text-blue-400 hover:text-blue-500 dark:hover:text-blue-300 font-medium"
              >
                Tìm hiểu thêm
              </Link>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

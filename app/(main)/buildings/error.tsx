'use client'

import { useEffect } from 'react'
import { ErrorState } from '@/components/ui/UtilityComponents'
import { Building2 } from 'lucide-react'

interface ErrorProps {
  error: Error & { digest?: string }
  reset: () => void
}

export default function Error({ error, reset }: ErrorProps) {
  useEffect(() => {
    // Log error to error reporting service
    console.error('Buildings page error:', error)
  }, [error])

  return (
    <div className="space-y-8">
      <div className="bg-white dark:bg-gray-800 shadow-sm rounded-3xl">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          <div>
            <h1 className="text-3xl font-bold text-gray-900 dark:text-white">
              Danh sách Tòa nhà
            </h1>
            <p className="mt-2 text-gray-600 dark:text-gray-400">
              Khám phá các tòa nhà ký túc xá có sẵn
            </p>
          </div>
        </div>
      </div>
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pb-8">
        <ErrorState
          title="Không thể tải danh sách tòa nhà"
          message={error.message || 'Đã xảy ra lỗi khi tải dữ liệu. Vui lòng thử lại sau.'}
          onRetry={reset}
          retryText="Thử lại"
        />
      </div>
    </div>
  )
}


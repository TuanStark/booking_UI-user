import { LoadingState } from '@/components/ui/UtilityComponents'

export default function Loading() {
  return (
    <div className="space-y-8">
      <div className="bg-white dark:bg-gray-800 shadow-sm rounded-3xl">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          <div className="animate-pulse">
            <div className="h-8 bg-gray-200 dark:bg-gray-700 rounded w-1/3 mb-2" />
            <div className="h-4 bg-gray-200 dark:bg-gray-700 rounded w-1/2" />
          </div>
        </div>
      </div>
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pb-8">
        <LoadingState message="Đang tải danh sách tòa nhà..." size="lg" />
      </div>
    </div>
  )
}


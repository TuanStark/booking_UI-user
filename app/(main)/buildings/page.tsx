import { Metadata } from 'next'
import { getAllBuildings } from '@/services/buildingService'
import BuildingsView from '@/components/buildings/BuildingsView'

export const metadata: Metadata = {
  title: 'Danh sách Tòa nhà',
  description: 'Khám phá các tòa nhà ký túc xá có sẵn với đầy đủ tiện nghi, vị trí thuận tiện và giá cả hợp lý.',
  keywords: ['ký túc xá', 'tòa nhà', 'đặt phòng', 'sinh viên', 'dormitory'],
  openGraph: {
    title: 'Danh sách Tòa nhà | Hệ thống Đặt phòng Ký túc xá',
    description: 'Khám phá các tòa nhà ký túc xá có sẵn với đầy đủ tiện nghi',
    type: 'website',
  },
}

export const revalidate = 300

interface BuildingsPageProps {
  searchParams: {
    page?: string
    search?: string
    limit?: string
  }
}

export default async function BuildingsPage({ searchParams }: BuildingsPageProps) {
  try {
    const currentPage = Number(searchParams.page) || 1
    const search = searchParams.search || ''
    const limit = Number(searchParams.limit) || 6

    const { items: buildings, meta } = await getAllBuildings({
      page: currentPage,
      limit,
      search,
    })

    return (
      <div className="space-y-8">
        <header className="bg-white dark:bg-gray-800 shadow-sm rounded-3xl">
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
        </header>

        <BuildingsView 
          buildings={buildings} 
          paginationMeta={meta}
          currentPage={currentPage}
        />
      </div>
    )
  } catch (error) {
    throw error
  }
}
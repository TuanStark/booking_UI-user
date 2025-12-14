'use client'

import { useState, useCallback, useMemo } from 'react'
import { Map, Grid, Building2 } from 'lucide-react'
import DormMap from '@/components/DormMap'
import { cn } from '@/lib/utils'
import { Building } from '@/types'
import { PaginationMeta } from '@/types/api'
import BuildingList from '@/components/buildings/BuildingList'
import { EmptyState } from '@/components/ui/UtilityComponents'
import AdvancedPagination from '@/components/AdvancedPagination'

interface BuildingsViewProps {
  buildings: Building[]
  paginationMeta: PaginationMeta & {
    hasNextPage: boolean
    hasPrevPage: boolean
  }
  currentPage: number
}

type ViewMode = 'grid' | 'map'

export default function BuildingsView({ 
  buildings, 
  paginationMeta,
  currentPage 
}: BuildingsViewProps) {
  const [viewMode, setViewMode] = useState<ViewMode>('grid')
  const [selectedBuildingId, setSelectedBuildingId] = useState<string | undefined>()

  const handleBuildingSelect = useCallback((buildingId: string) => {
    setSelectedBuildingId(buildingId)
    
    if (viewMode === 'grid') {
      requestAnimationFrame(() => {
        const element = document.getElementById(`building-${buildingId}`)
        if (element) {
          element.scrollIntoView({ 
            behavior: 'smooth', 
            block: 'center',
            inline: 'nearest'
          })
        }
      })
    }
  }, [viewMode])

  const emptyState = useMemo(
    () => (
      <EmptyState
        icon={<Building2 className="h-16 w-16 text-gray-400" />}
        title="Không tìm thấy tòa nhà"
        message="Hiện tại chưa có tòa nhà nào trong hệ thống"
      />
    ),
    []
  )

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pb-8">
      <div className="flex items-center justify-between mb-6">
        <p className="text-gray-600 dark:text-gray-400" aria-live="polite">
          Tìm thấy <span className="font-semibold text-gray-900 dark:text-white">
            {paginationMeta.total}
          </span> tòa nhà
          {paginationMeta.totalPages > 1 && (
            <span className="ml-2 text-sm text-gray-500 dark:text-gray-400">
              (Trang {currentPage}/{paginationMeta.totalPages})
            </span>
          )}
        </p>

        <div className="flex items-center space-x-2" role="tablist" aria-label="Chế độ xem">
          <button
            type="button"
            onClick={() => setViewMode('grid')}
            role="tab"
            aria-selected={viewMode === 'grid'}
            aria-controls="buildings-grid"
            className={cn(
              'flex items-center px-3 py-2 rounded-lg text-sm font-medium transition-colors duration-200',
              'focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2',
              viewMode === 'grid'
                ? 'bg-blue-500 text-white'
                : 'bg-gray-100 dark:bg-gray-700 text-gray-700 dark:text-gray-300 hover:bg-gray-200 dark:hover:bg-gray-600'
            )}
          >
            <Grid className="h-4 w-4 mr-2" aria-hidden="true" />
            <span>Lưới</span>
          </button>
          <button
            type="button"
            onClick={() => setViewMode('map')}
            role="tab"
            aria-selected={viewMode === 'map'}
            aria-controls="buildings-map"
            className={cn(
              'flex items-center px-3 py-2 rounded-lg text-sm font-medium transition-colors duration-200',
              'focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2',
              viewMode === 'map'
                ? 'bg-blue-500 text-white'
                : 'bg-gray-100 dark:bg-gray-700 text-gray-700 dark:text-gray-300 hover:bg-gray-200 dark:hover:bg-gray-600'
            )}
          >
            <Map className="h-4 w-4 mr-2" aria-hidden="true" />
            <span>Bản đồ</span>
          </button>
        </div>
      </div>

      {viewMode === 'grid' ? (
        <div className="space-y-6" id="buildings-grid" role="tabpanel">
          {buildings.length > 0 ? (
            <>
              <BuildingList
                buildings={buildings}
                selectedBuildingId={selectedBuildingId}
                onBuildingSelect={handleBuildingSelect}
              />
              
              {paginationMeta.totalPages > 1 && (
                <div className="flex justify-center mt-8">
                  <AdvancedPagination
                    currentPage={currentPage}
                    totalPages={paginationMeta.totalPages}
                    basePath="/buildings"
                    showPages={7}
                  />
                </div>
              )}
            </>
          ) : (
            emptyState
          )}
        </div>
      ) : (
        <div 
          className="h-96 lg:h-[600px] rounded-3xl overflow-hidden shadow-lg" 
          id="buildings-map"
          role="tabpanel"
        >
          <DormMap
            dorms={buildings}
            selectedDormId={selectedBuildingId}
            onDormSelect={handleBuildingSelect}
            className="h-full"
          />
        </div>
      )}
    </div>
  )
}


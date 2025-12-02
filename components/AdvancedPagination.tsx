// src/components/common/AdvancedPagination.tsx
import Link from 'next/link'
import { Button } from '@/components/ui/button'
import { ChevronLeft, ChevronRight } from 'lucide-react'

interface AdvancedPaginationProps {
    currentPage: number
    totalPages: number
    basePath?: string
    showPages?: number // số trang hiển thị (mặc định 5)
}

export default function AdvancedPagination({
    currentPage,
    totalPages,
    basePath = '',
    showPages = 5,
}: AdvancedPaginationProps) {
    if (totalPages <= 1) return null

    const createUrl = (page: number) => {
        return page === 1 ? basePath || '/' : `${basePath}?page=${page}`
    }

    const pages: (number | '...')[] = []
    const start = Math.max(1, currentPage - Math.floor(showPages / 2))
    const end = Math.min(totalPages, start + showPages - 1)

    if (start > 1) pages.push(1, '...')
    for (let i = start; i <= end; i++) pages.push(i)
    if (end < totalPages) pages.push('...', totalPages)

    return (
        <div className="flex items-center justify-center gap-2 mt-12 flex-wrap">
            <Button variant="outline" size="icon" disabled={currentPage === 1} asChild={currentPage > 1}>
                {currentPage > 1 ? (
                    <Link href={createUrl(currentPage - 1)}>
                        <ChevronLeft className="w-4 h-4" />
                    </Link>
                ) : (
                    <ChevronLeft className="w-4 h-4" />
                )}
            </Button>

            {pages.map((page, i) =>
                page === '...' ? (
                    <span key={i} className="px-3 text-gray-500">...</span>
                ) : (
                    <Button
                        key={page}
                        variant={page === currentPage ? 'default' : 'outline'}
                        size="icon"
                        asChild
                    >
                        <Link href={createUrl(page as number)}>{page}</Link>
                    </Button>
                )
            )}

            <Button variant="outline" size="icon" disabled={currentPage === totalPages} asChild={currentPage < totalPages}>
                {currentPage < totalPages ? (
                    <Link href={createUrl(currentPage + 1)}>
                        <ChevronRight className="w-4 h-4" />
                    </Link>
                ) : (
                    <ChevronRight className="w-4 h-4" />
                )}
            </Button>
        </div>
    )
}
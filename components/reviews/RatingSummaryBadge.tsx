'use client'

import Link from 'next/link'
import { Star } from 'lucide-react'
import { cn } from '@/lib/utils'
import { StarRating } from './StarRating'

export type RatingSummaryBadgeProps = {
  averageRating: number
  totalReviews: number
  loading?: boolean
  /** full: đủ nhãn; compact: gọn; minimal: badge trên ảnh */
  mode?: 'full' | 'compact' | 'minimal'
  showStarRow?: boolean
  className?: string
  href?: string
  variant?: 'default' | 'onDark'
}

function clampAvg(avg: number, total: number) {
  const a = Number(avg)
  if (!Number.isFinite(a)) return 0
  if (total === 0) return 0
  return Math.min(5, Math.max(0, a))
}

export function RatingSummaryBadge({
  averageRating,
  totalReviews,
  loading,
  mode = 'full',
  showStarRow,
  className,
  href,
  variant = 'default',
}: RatingSummaryBadgeProps) {
  const isDark = variant === 'onDark'
  const avg = clampAvg(averageRating, totalReviews)

  const starSize =
    mode === 'minimal' ? 'h-3 w-3' : mode === 'compact' ? 'h-3.5 w-3.5' : 'h-4 w-4'

  const starIcon = (filled: boolean) => (
    <Star
      className={cn(
        'shrink-0',
        starSize,
        filled
          ? isDark
            ? 'text-yellow-400 fill-yellow-400'
            : 'text-yellow-500 fill-yellow-500'
          : isDark
            ? 'text-white/35'
            : 'text-gray-300 dark:text-gray-600',
      )}
    />
  )

  const scoreClass = cn(
    'font-semibold tabular-nums',
    isDark ? 'text-white' : 'text-gray-900 dark:text-white',
    mode === 'minimal' && 'text-xs',
    mode === 'compact' && 'text-sm',
    mode === 'full' && 'text-base',
  )

  const metaClass = cn(
    isDark ? 'text-white/80' : 'text-gray-600 dark:text-gray-400',
    mode === 'minimal' && 'text-[10px]',
    mode === 'compact' && 'text-xs',
    mode === 'full' && 'text-sm',
  )

  if (loading) {
    return (
      <span className={cn(metaClass, 'animate-pulse', className)}>
        Đang tải đánh giá…
      </span>
    )
  }

  const inner =
    totalReviews === 0 ? (
      <span
        className={cn(
          'inline-flex items-center gap-1.5',
          mode === 'minimal' && 'gap-1',
          className,
        )}
      >
        {starIcon(false)}
        {mode === 'minimal' ? (
          <span className={cn(scoreClass, 'font-normal text-gray-500 dark:text-gray-400')}>
            —
          </span>
        ) : (
          <span className={metaClass}>Chưa có đánh giá</span>
        )}
      </span>
    ) : (
      <span
        className={cn(
          'inline-flex items-center flex-wrap gap-x-2 gap-y-0.5',
          mode === 'minimal' && 'gap-x-1',
          className,
        )}
      >
        {showStarRow ? (
          <StarRating
            rating={avg}
            size={mode === 'full' ? 18 : 14}
            className="shrink-0"
          />
        ) : (
          starIcon(true)
        )}
        <span className={scoreClass}>{avg.toFixed(1)}</span>
        {mode !== 'minimal' && (
          <span className={metaClass}>
            {mode === 'compact'
              ? `(${totalReviews})`
              : `(${totalReviews} đánh giá)`}
          </span>
        )}
        {mode === 'minimal' && (
          <span className={cn(metaClass, 'tabular-nums')}>({totalReviews})</span>
        )}
      </span>
    )

  if (href) {
    return (
      <Link
        href={href}
        scroll
        className={cn(
          'inline-flex items-center rounded-md transition-opacity hover:opacity-90 focus:outline-none focus-visible:ring-2 focus-visible:ring-offset-2',
          isDark ? 'focus-visible:ring-yellow-400 ring-offset-transparent' : 'focus-visible:ring-primary',
        )}
      >
        {inner}
      </Link>
    )
  }

  return inner
}

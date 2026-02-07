import { Star, StarHalf } from 'lucide-react'
import { cn } from '@/lib/utils'

interface StarRatingProps {
    rating: number
    maxRating?: number
    size?: number
    interactive?: boolean
    onChange?: (rating: number) => void
    className?: string
}

export function StarRating({
    rating,
    maxRating = 5,
    size = 16,
    interactive = false,
    onChange,
    className,
}: StarRatingProps) {
    const stars = []

    const currentRating = Math.max(0, Math.min(rating, maxRating))

    for (let i = 1; i <= maxRating; i++) {
        const filled = i <= currentRating
        const half = !filled && i - 0.5 <= currentRating

        stars.push(
            <button
                key={i}
                type="button"
                disabled={!interactive}
                onClick={() => interactive && onChange?.(i)}
                className={cn(
                    'transition-colors focus:outline-none',
                    interactive ? 'cursor-pointer hover:scale-110' : 'cursor-default',
                )}
            >
                <Star
                    size={size}
                    className={cn(
                        filled ? 'fill-yellow-400 text-yellow-400' : 'text-gray-300',
                        half && 'hidden',
                    )}
                />
            </button>
        )
    }

    return <div className={cn('flex items-center gap-0.5', className)}>{stars}</div>
}

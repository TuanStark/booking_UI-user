import { Star } from 'lucide-react'
import { StarRating } from './StarRating'

interface ReviewSummaryProps {
    totalReviews: number
    averageRating: number
    ratingBreakdown?: {
        [key: number]: number
    }
}

export function ReviewSummary({ totalReviews, averageRating, ratingBreakdown }: ReviewSummaryProps) {
    return (
        <div className="flex flex-col md:flex-row gap-8 items-center md:items-start bg-white p-6 rounded-xl border">
            <div className="text-center md:text-left">
                <div className="text-5xl font-bold text-primary">{averageRating.toFixed(1)}</div>
                <div className="flex justify-center md:justify-start my-2">
                    <StarRating rating={averageRating} size={20} />
                </div>
                <div className="text-sm text-muted-foreground">
                    Dựa trên {totalReviews} đánh giá
                </div>
            </div>

            <div className="flex-1 w-full space-y-2">
                {[5, 4, 3, 2, 1].map((star) => {
                    const count = ratingBreakdown?.[star] || 0
                    const percentage = totalReviews > 0 ? (count / totalReviews) * 100 : 0

                    return (
                        <div key={star} className="flex items-center gap-3 text-sm">
                            <div className="w-12 font-medium flex items-center gap-1">
                                {star} <Star className='w-4 h-4 text-yellow-400' />
                            </div>
                            <div className="flex-1 h-2 bg-gray-100 rounded-full overflow-hidden">
                                <div
                                    className="h-full bg-yellow-400 rounded-full"
                                    style={{ width: `${percentage}%` }}
                                />
                            </div>
                            <div className="w-8 text-right text-muted-foreground text-xs">
                                {percentage.toFixed(0)}%
                            </div>
                        </div>
                    )
                })}
            </div>
        </div>
    )
}

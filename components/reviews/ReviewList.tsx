import { useState, useEffect } from 'react'
import { Review, PaginatedReviewsResponse } from '@/types/review'
import { ReviewService } from '@/services/reviewService'
import { ReviewItem } from './ReviewItem'
import { Button } from '@/components/ui/button'
import { Loader2 } from 'lucide-react'
import { useToast } from '@/hooks/use-toast'

interface ReviewListProps {
    roomId: string
    refreshTrigger?: number
}

export function ReviewList({ roomId, refreshTrigger }: ReviewListProps) {
    const [reviews, setReviews] = useState<Review[]>([])
    const [loading, setLoading] = useState(true)
    const [loadingMore, setLoadingMore] = useState(false)
    const [nextCursor, setNextCursor] = useState<string | null>(null)
    const [hasMore, setHasMore] = useState(false)
    const { toast } = useToast()

    const fetchReviews = async (cursor?: string, isLoadMore = false) => {
        try {
            if (isLoadMore) setLoadingMore(true)
            else setLoading(true)

            const response = await ReviewService.getRoomReviews(roomId, 5, cursor)

            const reviewsData = response?.data || []

            if (isLoadMore) {
                setReviews(prev => [...prev, ...reviewsData])
            } else {
                setReviews(reviewsData)
            }

            setNextCursor(response?.nextCursor || null)
            setHasMore(response?.hasMore || false)
        } catch (error) {
            console.error('Failed to fetch reviews:', error)
            toast({
                variant: 'destructive',
                title: 'Error',
                description: 'Failed to load reviews. Please try again.',
            })
        } finally {
            if (isLoadMore) setLoadingMore(false)
            else setLoading(false)
        }
    }

    useEffect(() => {
        fetchReviews()
    }, [roomId, refreshTrigger])

    const handleLoadMore = () => {
        if (nextCursor) {
            fetchReviews(nextCursor, true)
        }
    }

    if (loading) {
        return (
            <div className="flex justify-center py-8">
                <Loader2 className="h-8 w-8 animate-spin text-primary" />
            </div>
        )
    }

    if (!reviews || reviews.length === 0) {
        return (
            <div className="text-center py-8 text-muted-foreground">
                Chưa có đánh giá nào. Hãy là người đầu tiên chia sẻ trải nghiệm của bạn!
            </div>
        )
    }

    return (
        <div className="space-y-6">
            <div className="grid gap-6">
                {reviews.map((review) => (
                    <ReviewItem key={review.id} review={review} />
                ))}
            </div>

            {hasMore && (
                <div className="flex justify-center pt-4">
                    <Button
                        variant="outline"
                        onClick={handleLoadMore}
                        disabled={loadingMore}
                    >
                        {loadingMore && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
                        Xem thêm đánh giá
                    </Button>
                </div>
            )}
        </div>
    )
}

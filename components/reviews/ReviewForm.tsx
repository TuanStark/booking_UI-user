import { useState } from 'react'
import { Button } from '@/components/ui/button'
import { StarRating } from './StarRating'
import { ReviewService } from '@/services/reviewService'
import { useToast } from '@/hooks/use-toast'
import { Loader2 } from 'lucide-react'
import { useUser } from '@/contexts/UserContext'

interface ReviewFormProps {
    roomId: string
    bookingId?: string
    onSuccess?: () => void
}

export function ReviewForm({ roomId, bookingId, onSuccess }: ReviewFormProps) {
    const [rating, setRating] = useState(0)
    const [comment, setComment] = useState('')
    const [submitting, setSubmitting] = useState(false)
    const { toast } = useToast()
    const { isAuthenticated, accessToken: token } = useUser()

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault()

        if (!isAuthenticated || !token) {
            toast({
                variant: 'destructive',
                title: 'Authentication Required',
                description: 'Vui lòng đăng nhập để gửi đánh giá.',
            })
            return
        }

        if (rating === 0) {
            toast({
                variant: 'destructive',
                title: 'Rating Required',
                description: 'Vui lòng chọn một số sao.',
            })
            return
        }

        if (!bookingId) {
            toast({
                variant: 'destructive',
                title: 'Booking Required',
                description: 'Bạn chỉ có thể đánh giá phòng bạn đã đặt.',
            })
            return
        }

        try {
            setSubmitting(true)
            await ReviewService.createReview({
                roomId,
                bookingId,
                ratingOverall: rating,
                comment,
            }, token)

            toast({
                title: 'Success',
                description: 'Đánh giá của bạn đã được gửi!',
            })

            setRating(0)
            setComment('')
            onSuccess?.()
        } catch (error: any) {
            console.error('Submit review error:', error)
            toast({
                variant: 'destructive',
                title: 'Error',
                description: error.message || 'Đánh giá của bạn không thể gửi. Vui lòng thử lại.',
            })
        } finally {
            setSubmitting(false)
        }
    }

    return (
        <form onSubmit={handleSubmit} className="space-y-4 bg-gray-50 p-6 rounded-lg">
            <h3 className="text-lg font-semibold">Viết đánh giá</h3>

            <div className="space-y-2">
                <label className="text-sm font-medium">Đánh giá</label>
                <StarRating
                    rating={rating}
                    size={24}
                    interactive
                    onChange={setRating}
                />
            </div>

            <div className="space-y-2">
                <label htmlFor="comment" className="text-sm font-medium">
                    Bình luận
                </label>
                <textarea
                    id="comment"
                    className="flex min-h-[80px] w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50"
                    placeholder="Chia sẻ trải nghiệm của bạn..."
                    value={comment}
                    onChange={(e) => setComment(e.target.value)}
                    required
                />
            </div>

            <Button type="submit" disabled={submitting}>
                {submitting && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
                Gửi đánh giá
            </Button>
        </form>
    )
}

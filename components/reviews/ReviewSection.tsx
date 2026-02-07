import { useState } from 'react'
import { ReviewList } from './ReviewList'
import { ReviewForm } from './ReviewForm'
import { ReviewSummary } from './ReviewSummary'
import { Button } from '@/components/ui/button'
import { Separator } from '@/components/ui/separator'
import { useUser } from '@/contexts/UserContext'

interface ReviewSectionProps {
    roomId: string
    buildingId?: string
}

export function ReviewSection({ roomId }: ReviewSectionProps) {
    const [showForm, setShowForm] = useState(false)
    const [refreshTrigger, setRefreshTrigger] = useState(0)
    const { isAuthenticated } = useUser()

    const mockStats = {
        totalReviews: 0,
        averageRating: 0,
        ratingBreakdown: { 5: 0, 4: 0, 3: 0, 2: 0, 1: 0 }
    }

    const handleReviewSuccess = () => {
        setShowForm(false)
        setRefreshTrigger(prev => prev + 1)
    }

    return (
        <div className="space-y-8 py-8" id="reviews">
            <div className="flex items-center justify-between">
                <h2 className="text-2xl font-bold">Đánh giá</h2>
                {isAuthenticated && !showForm && (
                    <Button onClick={() => setShowForm(true)}>Viết đánh giá</Button>
                )}
            </div>

            <ReviewSummary
                totalReviews={mockStats.totalReviews}
                averageRating={mockStats.averageRating}
                ratingBreakdown={mockStats.ratingBreakdown}
            />

            {showForm && (
                <div className="animate-in fade-in slide-in-from-top-4 duration-300">
                    <ReviewForm
                        roomId={roomId}
                        bookingId="booking-id-placeholder"
                        onSuccess={handleReviewSuccess}
                    />
                    <div className="flex justify-end mt-2">
                        <Button variant="ghost" size="sm" onClick={() => setShowForm(false)}>Hủy</Button>
                    </div>
                </div>
            )}

            <Separator />

            <ReviewList roomId={roomId} refreshTrigger={refreshTrigger} />
        </div>
    )
}

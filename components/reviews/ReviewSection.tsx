import { useState, useEffect } from 'react'
import { ReviewList } from './ReviewList'
import { ReviewForm } from './ReviewForm'
import { ReviewSummary } from './ReviewSummary'
import { Button } from '@/components/ui/button'
import { Separator } from '@/components/ui/separator'
import { useUser } from '@/contexts/UserContext'
import apiClient from '@/services/apiClient'
import { Loader2 } from 'lucide-react'

interface ReviewSectionProps {
    roomId: string
    buildingId?: string
}

export function ReviewSection({ roomId }: ReviewSectionProps) {
    const [showForm, setShowForm] = useState(false)
    const [refreshTrigger, setRefreshTrigger] = useState(0)
    const [eligibleBookingId, setEligibleBookingId] = useState<string | null>(null)
    const [alreadyReviewed, setAlreadyReviewed] = useState(false)
    const [eligibilityLoading, setEligibilityLoading] = useState(false)
    const [summaryStats, setSummaryStats] = useState<{
        totalReviews: number
        averageRating: number
    }>({ totalReviews: 0, averageRating: 0 })
    const { isAuthenticated, accessToken: token } = useUser()

    useEffect(() => {
        if (!roomId) return
        let cancelled = false
        ;(async () => {
            try {
                const s = await apiClient.getRoomRatingStats(roomId)
                if (cancelled) return
                const total = typeof s?.totalReviews === 'number' ? s.totalReviews : 0
                const avgRaw = s?.avgRating
                const averageRating =
                    avgRaw != null && avgRaw !== ''
                        ? Number(avgRaw)
                        : 0
                setSummaryStats({
                    totalReviews: total,
                    averageRating: Number.isFinite(averageRating) ? averageRating : 0,
                })
            } catch {
                if (!cancelled) setSummaryStats({ totalReviews: 0, averageRating: 0 })
            }
        })()
        return () => {
            cancelled = true
        }
    }, [roomId, refreshTrigger])

    useEffect(() => {
        if (!showForm || !isAuthenticated || !token || !roomId) {
            setEligibleBookingId(null)
            setAlreadyReviewed(false)
            return
        }

        let cancelled = false
        ;(async () => {
            try {
                setEligibilityLoading(true)
                const res = await apiClient.getCheckReviewed(roomId, token)
                const id = res?.bookingId ?? null
                if (!cancelled) {
                    setAlreadyReviewed(res?.alreadyReviewed === true)
                    setEligibleBookingId(typeof id === 'string' && id.length > 0 ? id : null)
                }
            } catch {
                if (!cancelled) {
                    setEligibleBookingId(null)
                    setAlreadyReviewed(false)
                }
            } finally {
                if (!cancelled) setEligibilityLoading(false)
            }
        })()

        return () => {
            cancelled = true
        }
    }, [showForm, isAuthenticated, token, roomId])

    const handleReviewSuccess = () => {
        setShowForm(false)
        setRefreshTrigger(prev => prev + 1)
    }

    const ratingBreakdown = { 5: 0, 4: 0, 3: 0, 2: 0, 1: 0 }

    return (
        <div className="space-y-8 py-8" id="reviews">
            <div className="flex items-center justify-between">
                <h2 className="text-2xl font-bold">Đánh giá</h2>
                {isAuthenticated && !showForm && (
                    <Button onClick={() => setShowForm(true)}>Viết đánh giá</Button>
                )}
            </div>

            <ReviewSummary
                totalReviews={summaryStats.totalReviews}
                averageRating={summaryStats.averageRating}
                ratingBreakdown={ratingBreakdown}
            />

            <ReviewList roomId={roomId} refreshTrigger={refreshTrigger} />

            <Separator />

            {showForm && (
                <div className="animate-in fade-in slide-in-from-top-4 duration-300">
                    {eligibilityLoading ? (
                        <div className="flex items-center gap-2 text-sm text-muted-foreground py-4">
                            <Loader2 className="h-4 w-4 animate-spin" />
                            Đang kiểm tra quyền đánh giá…
                        </div>
                    ) : alreadyReviewed ? (
                        <p className="text-sm text-muted-foreground py-2">
                            Bạn đã gửi đánh giá cho đặt phòng này rồi. Cảm ơn bạn!
                        </p>
                    ) : (
                        <ReviewForm
                            roomId={roomId}
                            bookingId={eligibleBookingId ?? undefined}
                            onSuccess={handleReviewSuccess}
                        />
                    )}
                    <div className="flex justify-end mt-2">
                        <Button variant="ghost" size="sm" onClick={() => setShowForm(false)}>Hủy</Button>
                    </div>
                </div>
            )}
        </div>
    )
}

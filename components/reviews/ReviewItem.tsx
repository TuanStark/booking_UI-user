import { Review } from '@/types/review'
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar'
import { Card, CardContent, CardHeader } from '@/components/ui/card'
import { formatDistanceToNow } from 'date-fns'
import { StarRating } from './StarRating'

interface ReviewItemProps {
    review: Review
}

export function ReviewItem({ review }: ReviewItemProps) {
    return (
        <Card className="border-none shadow-none bg-transparent">
            <CardHeader className="p-0 pb-2 flex flex-row items-start gap-4 space-y-0">
                <Avatar className="h-10 w-10 border">
                    <AvatarImage src={review.user?.avatar || ''} alt={review.user?.name || 'User'} />
                    <AvatarFallback>{review.user?.name?.charAt(0).toUpperCase() || 'U'}</AvatarFallback>
                </Avatar>
                <div className="flex-1">
                    <div className="flex items-center justify-between">
                        <h4 className="font-semibold text-sm">{review.user?.name || 'Anonymous User'}</h4>
                        <span className="text-xs text-muted-foreground">
                            {formatDistanceToNow(new Date(review.createdAt), { addSuffix: true })}
                        </span>
                    </div>
                    <div className="flex items-center gap-2 mt-1">
                        <StarRating rating={review.ratingOverall} size={14} />
                        <span className="text-xs font-medium">{review.ratingOverall}</span>
                    </div>
                </div>
            </CardHeader>
            <CardContent className="p-0 pl-14">
                <p className="text-sm text-gray-700 leading-relaxed">
                    {review.comment}
                </p>
                {/* Optional: Display detailed ratings if available and expanded */}
                {(review.ratingClean || review.ratingLocation || review.ratingService) && (
                    <div className="mt-3 flex gap-4 text-xs text-muted-foreground">
                        {review.ratingClean && <div>Đánh giá sạch sẽ: {review.ratingClean}</div>}
                        {review.ratingLocation && <div>Đánh giá vị trí: {review.ratingLocation}</div>}
                        {review.ratingService && <div>Đánh giá dịch vụ: {review.ratingService}</div>}
                    </div>
                )}
            </CardContent>
        </Card>
    )
}

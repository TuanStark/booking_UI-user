export enum ReviewStatus {
    PENDING = 'PENDING',
    APPROVED = 'APPROVED',
    REJECTED = 'REJECTED',
    HIDDEN = 'HIDDEN',
}

export interface UserSummary {
    id: string;
    name: string;
    avatar?: string | null;
}

export interface Review {
    id: string;
    roomId: string;
    userId: string;
    bookingId: string;
    ratingOverall: number;
    ratingClean?: number | null;
    ratingLocation?: number | null;
    ratingPrice?: number | null;
    ratingService?: number | null;
    comment?: string | null;
    status: ReviewStatus;
    createdAt: string; // ISO date string
    updatedAt: string; // ISO date string
    user?: UserSummary;
}

export interface CreateReviewRequest {
    bookingId: string;
    roomId?: string;
    ratingOverall: number;
    ratingClean?: number;
    ratingLocation?: number;
    ratingPrice?: number;
    ratingService?: number;
    comment?: string;
}

export interface UpdateReviewRequest {
    ratingOverall?: number;
    ratingClean?: number;
    ratingLocation?: number;
    ratingPrice?: number;
    ratingService?: number;
    comment?: string;
}

export interface PaginatedReviewsResponse {
    data: Review[];
    nextCursor: string | null;
    hasMore: boolean;
    total?: number;
}

// src/components/news/NewsGrid.tsx
import NewsCard from './NewsCard'
import type { Post } from '@/types/post'

interface NewsGridProps {
    posts: Post[]
}

export default function NewsGrid({ posts }: NewsGridProps) {
    return (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            {posts.map((post) => (
                <NewsCard key={post.id} post={post} />
            ))}
        </div>
    )
}
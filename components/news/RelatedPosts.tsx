// src/app/(main)/news/[slug]/RelatedPosts.tsx
import Link from 'next/link'
import Image from 'next/image'
import { formatDate } from '@/utils/utils'
import { Post } from '@/types/post'

export default function RelatedPosts({ posts }: { posts: Post[] }) {
    return (
        <div className="space-y-6">
            {posts.map((post) => (
                <Link
                    key={post.id}
                    href={`/news/${post.slug}`}
                    className="flex gap-4 p-4 rounded-xl hover:bg-gray-100 transition-all group"
                >
                    {post.thumbnailUrl ? (
                        <div className="relative w-24 h-24 rounded-lg overflow-hidden flex-shrink-0">
                            <Image
                                src={post.thumbnailUrl}
                                alt={post.title}
                                fill
                                className="object-cover group-hover:scale-105 transition"
                            />
                        </div>
                    ) : (
                        <div className="w-24 h-24 bg-gray-200 rounded-lg border-2 border-dashed" />
                    )}
                    <div className="flex-1">
                        <h4 className="font-medium text-gray-900 group-hover:text-blue-600 line-clamp-2">
                            {post.title}
                        </h4>
                        <time className="text-sm text-gray-500">
                            {formatDate(post.publishedAt)}
                        </time>
                    </div>
                </Link>
            ))}
        </div>
    )
}
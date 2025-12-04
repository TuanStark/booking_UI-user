// src/app/(main)/news/[slug]/page.tsx
import { notFound } from 'next/navigation'
import Image from 'next/image'
import Link from 'next/link'
import { Metadata } from 'next'
import { ChevronRight, Calendar, Tag, ArrowLeft } from 'lucide-react'
import { getPostBySlug, getRelatedPosts } from '@/services/postService'
import { formatDate } from '@/utils/utils'
import RelatedPosts from '@/components/news/RelatedPosts'

type Props = {
    params: { slug: string }
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
    const post = await getPostBySlug(params.slug)

    if (!post) {
        return { title: 'Bài viết không tồn tại' }
    }

    return {
        title: `${post.title} | Tin tức`,
        description: post.summary || post.content.replace(/<[^>]*>/g, '').slice(0, 160),
        openGraph: {
            title: post.title,
            description: post.summary || '',
            images: post.thumbnailUrl ? [{ url: post.thumbnailUrl }] : [],
            type: 'article',
            publishedTime: post.publishedAt,
        },
    }
}

export default async function NewsDetailPage({ params }: Props) {
    const post = await getPostBySlug(params.slug)

    if (!post) notFound()

    const relatedPosts = post.category?.slug
        ? await getRelatedPosts(post.category.slug, post.id)
        : []

    return (
        <>
            {/* Breadcrumb */}
            <div className="flex items-center space-x-2 text-sm text-gray-500 mb-8">
                <Link href="/" className="hover:text-blue-600">Home</Link>
                <ChevronRight className="h-4 w-4" />
                <Link href="/news" className="hover:text-blue-600">Tin tức</Link>
                {post.category && (
                    <>
                        <ChevronRight className="h-4 w-4" />
                        <Link
                            href={`/news?category=${post.category.slug}`}
                            className="hover:text-blue-600"
                        >
                            {post.category.name}
                        </Link>
                    </>
                )}
                <ChevronRight className="h-4 w-4" />
                <span className="text-gray-900 font-medium truncate max-w-xs">
                    {post.title}
                </span>
            </div>

            {/* Main Content */}
            <article>
                <div className="bg-white rounded-2xl shadow-sm overflow-hidden border border-gray-100">
                    {/* Featured Image */}
                    <div className="relative h-64 md:h-96 w-full">
                        <Image
                            src={post.thumbnailUrl || '/placeholder.jpg'}
                            alt={post.title}
                            fill
                            className="object-cover"
                            priority
                        />
                    </div>

                    <div className="p-6 md:p-10">
                        {/* Meta Data */}
                        <div className="flex flex-wrap items-center gap-4 md:gap-6 text-sm text-gray-500 mb-6">
                            <span className="flex items-center text-blue-600 font-semibold bg-blue-50 px-3 py-1 rounded-full">
                                <Tag className="h-4 w-4 mr-2" />
                                {post.category.name}
                            </span>
                            <span className="flex items-center">
                                <Calendar className="h-4 w-4 mr-2" />
                                {formatDate(post.publishedAt)}
                            </span>
                        </div>

                        {/* Title */}
                        <h1 className="text-3xl md:text-4xl font-bold text-gray-900 mb-8 leading-tight">
                            {post.title}
                        </h1>

                        {/* Content */}
                        <div
                            className="prose prose-lg max-w-none text-gray-600 
                                prose-headings:text-gray-900 prose-a:text-blue-600 hover:prose-a:text-blue-700
                                prose-blockquote:border-l-4 prose-blockquote:border-blue-500 prose-blockquote:bg-blue-50
                                prose-img:rounded-xl prose-img:shadow-md"
                            dangerouslySetInnerHTML={{ __html: post.content }}
                        />

                        {/* Back Link */}
                        <div className="mt-12 pt-8 border-t border-gray-100">
                            <Link
                                href="/news"
                                className="inline-flex items-center text-gray-600 hover:text-blue-600 font-medium transition-colors"
                            >
                                <ArrowLeft className="h-4 w-4 mr-2" />
                                Quay lại danh sách
                            </Link>
                        </div>
                    </div>
                </div>

                {/* Related Posts */}
                {relatedPosts.length > 0 && (
                    <div className="mt-12">
                        <h3 className="text-xl font-bold mb-6">Bài viết liên quan</h3>
                        <RelatedPosts posts={relatedPosts} />
                    </div>
                )}
            </article>
        </>
    )
}
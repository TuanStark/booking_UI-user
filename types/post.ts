// src/types/news.ts
export interface Post {
    id: string
    title: string
    slug: string
    summary: string
    thumbnailUrl: string
    status: string
    publishedAt: string
    authorId: string
    categories: CategoriesPost[]
    categoryId: string
    createdAt: string
    updatedAt: string
    content: string
}

export interface CategoriesPost {
    id: string
    name: string
    slug: string
    description: string
    createdAt: string
    updatedAt: string
}

export type NewsSidebarData = {
    categories: CategoriesPost[]
    recentPosts: Post[]
}

export type FeaturedNewsData = {
    featured: Post[]
}
import { BackendApiResponse, PaginatedResponse } from '@/types/api'
import type { NewsSidebarData, CategoriesResponse, RecentPostsResponse, Post, CategoriesPost, FeaturedNewsData } from '@/types/post'

// Wrapper fetch chung (giữ nguyên của bạn, rất tốt)
async function api<T>(endpoint: string, options?: RequestInit): Promise<T> {
  const url = `${process.env.NEXT_PUBLIC_API_BASE_URL}${endpoint}`

  const res = await fetch(url, {
    ...options,
    headers: {
      'Content-Type': 'application/json',
      ...options?.headers,
    },
  })

  if (!res.ok) {
    throw new Error(`API ${endpoint} failed: ${res.status} ${res.statusText}`)
  }
  return res.json()
}

// 2 cách làm – bạn chọn 1 cái phù hợp

// Cách 1: Backend có 1 endpoint tổng hợp (tốt nhất)
export async function getNewsSidebar(): Promise<NewsSidebarData> {
  return api<NewsSidebarData>('/news/sidebar', {
    next: { revalidate: 600, tags: ['news-sidebar'] },
  })
}

// Cách 2: Backend chưa có → bạn tự compose (vẫn chuẩn Senior)
export async function getPostCategories(): Promise<CategoriesPost[]> {
  const response = await api<BackendApiResponse<CategoriesPost[]>>('/post-categories', {
    next: { revalidate: 3600, tags: ['categories'] }, // category ít thay đổi hơn
  })
  return response.data.data;
}

export async function getRecentPosts(): Promise<Post[]> {
  const response = await api<BackendApiResponse<Post[]>>('/posts?status=PUBLISHED&sortOrder=desc&limit=5', {
    next: { revalidate: 600, tags: ['recent-posts'] },
  })
  return response.data.data;
}

// Helper: Gộp lại thành 1 object (dùng trong Server Component)
export async function getNewsSidebarData(): Promise<NewsSidebarData> {
  const [categories, recentPosts] = await Promise.all([
    getPostCategories(),
    getRecentPosts(),
  ])

  return { categories, recentPosts }
}


export async function getAllPosts({
  page = 1,
  limit = 10,
  status = 'PUBLISHED',
  sortBy = 'publishedAt',
  sortOrder = 'desc',
  categorySlug = '',
  search = ''
}: {
  page?: number
  limit?: number
  status?: string
  sortBy?: string
  sortOrder?: 'asc' | 'desc'
  categorySlug?: string
  search?: string
} = {}): Promise<PaginatedResponse<Post[]>> {
  // console.log(`/posts?page=${page}&limit=${limit}&status=${status}&sortBy=${sortBy}&sortOrder=${sortOrder}&categoryId=${categorySlug}&search=${search}`)
  const response = await api<BackendApiResponse<Post[]>>(
    `/posts?page=${page}&limit=${limit}&status=${status}&sortBy=${sortBy}&sortOrder=${sortOrder}&categorySlug=${categorySlug}&search=${search}`,
    {
      next: { revalidate: 600, tags: ['posts', `posts-page-${page}`] },
    }
  )

  const { data, meta } = response.data

  return {
    items: data,
    meta: {
      ...meta,
      page: meta.page || page,
      limit: meta.limit || limit,
      hasNextPage: page < meta.totalPages,
      hasPrevPage: page > 1,
    },
  }
}
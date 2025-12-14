import { BackendApiResponse, PaginatedResponse } from '@/types/api'
import type { NewsSidebarData, Post, CategoriesPost } from '@/types/post'
import { api } from '@/lib/axios'

/**
 * Generic API wrapper using axios
 * Reusable across the entire application
 */
async function apiRequest<T>(endpoint: string, config?: any): Promise<T> {
  return api.get<T>(endpoint, config)
}

export async function getNewsSidebar(): Promise<NewsSidebarData> {
  return apiRequest<NewsSidebarData>('/news/sidebar')
}

export async function getPostCategories(): Promise<CategoriesPost[]> {
  const response = await apiRequest<BackendApiResponse<CategoriesPost[]>>('/post-categories')
  return response.data.data;
}

export async function getRecentPosts(): Promise<Post[]> {
  const response = await apiRequest<BackendApiResponse<Post[]>>('/posts?status=PUBLISHED&sortOrder=desc&limit=5')
  return response.data.data;
}

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
  const response = await apiRequest<BackendApiResponse<Post[]>>(
    `/posts?page=${page}&limit=${limit}&status=${status}&sortBy=${sortBy}&sortOrder=${sortOrder}&categorySlug=${categorySlug}&search=${search}`
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

export async function getPostBySlug(slug: string): Promise<Post | null> {
  try {
    const response = await apiRequest<BackendApiResponse<Post>>(
      `/posts/${encodeURIComponent(slug)}`
    );
    return response.data.data;
  } catch {
    return null;
  }
}


export async function getRelatedPosts(categorySlug: string, excludeId: string): Promise<Post[]> {
  const response = await apiRequest<any>(`/posts/related?categorySlug=${categorySlug}&excludeId=${excludeId}&limit=6`)
  return response.data.data || []
}
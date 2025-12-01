import type { NewsSidebarData, FeaturedNewsData } from '@/types/post'

// Wrapper nhỏ nếu cần thêm auth, logging, retry sau này
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
    throw new Error(`API ${endpoint} failed: ${res.status}`)
  }
  return res.json()
}

// Tất cả logic fetch tập trung ở đây → dễ test, dễ thay đổi
export async function getPostCategories(): Promise<NewsSidebarData> {
  return api<NewsSidebarData>('/post-categories', {
    next: { revalidate: 600 },
  })
}

export async function getPostRecent(): Promise<NewsSidebarData> {
  return api<NewsSidebarData>('/posts?status=PUBLISHED&sortOrder=desc&limit=5', {
    next: { revalidate: 600 },
  })
}


export async function getAllPost(): Promise<FeaturedNewsData> {
  return api<FeaturedNewsData>('/posts?page=1&limit=10&status=PUBLISHED&sortBy=title&sortOrder=desc', {
    next: { revalidate: 600 },
  })
}
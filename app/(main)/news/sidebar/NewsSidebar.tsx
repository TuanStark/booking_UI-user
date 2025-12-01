// src/app/(main)/news/sidebar/NewsSidebar.tsx
import NewsSidebarClient from './NewsSidebarClient'
import NewsSidebarSkeleton from '@/components/news/sidebar/NewsSidebarSkeleton'
import { getPostCategories, getPostRecent } from '@/services/postService'
import { Suspense } from 'react'

export default async function NewsSidebar() {
  const data = await getPostCategories() // ← Chỉ 1 dòng, sạch sẽ

  return <NewsSidebarClient initialData={data} />
}

// Nếu muốn streaming mượt hơn
export function NewsSidebarWithSuspense() {
  return (
    <Suspense fallback={<NewsSidebarSkeleton />}>
      <NewsSidebarContent />
    </Suspense>
  )
}

async function NewsSidebarContent() {
  const data = await getPostCategories()
  return <NewsSidebarClient initialData={data} />
}
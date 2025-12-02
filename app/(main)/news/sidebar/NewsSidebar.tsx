// src/app/(main)/news/sidebar/NewsSidebar.tsx
import NewsSidebarSkeleton from '@/components/news/sidebar/NewsSidebarSkeleton'
import NewsSidebarClient from './NewsSidebarClient'
import { Suspense } from 'react'
import { getNewsSidebarData } from '@/services/postService'

export default async function NewsSidebar() {
  const data = await getNewsSidebarData() // ← Chỉ 1 dòng, rõ ràng, dễ test

  return <NewsSidebarClient initialData={data} />
}

// Với Suspense (nếu muốn streaming mượt)
export function NewsSidebarWithSuspense() {
  return (
    <Suspense fallback={<NewsSidebarSkeleton />}>
      <NewsSidebarContent />
    </Suspense>
  )
}

async function NewsSidebarContent() {
  const data = await getNewsSidebarData()
  return <NewsSidebarClient initialData={data} />
}
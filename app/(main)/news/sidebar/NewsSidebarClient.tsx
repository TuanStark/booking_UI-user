// 'use client'

// import { useState, useTransition } from 'react'
// import Link from 'next/link'
// import Image from 'next/image'
// import { Search } from 'lucide-react'
// import { format } from 'date-fns'
// import type { NewsSidebarData } from './types'

// interface Props {
//   initialData: NewsSidebarData
// }

// export default function NewsSidebarClient({ initialData }: Props) {
//   const [isPending, startTransition] = useTransition()
//   const [activeSlug, setActiveSlug] = useState('all')

//   const { categories, recentPosts } = initialData

//   return (
//     <aside className="space-y-8">
//       {/* Search */}
//       <div className="relative">
//         <input
//           type="text"
//           placeholder="Search articles..."
//           className="w-full pl-10 pr-4 py-3 rounded-xl border border-gray-200 focus:outline-none focus:ring-2 focus:ring-blue-500 transition-all"
//         />
//         <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-5 w-5 text-gray-400 pointer-events-none" />
//       </div>

//       {/* Categories */}
//       <section className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden">
//         <header className="bg-blue-600 p-4">
//           <h3 className="text-white font-bold text-lg">Categories</h3>
//         </header>
//         <nav className="divide-y divide-gray-100">
//           {categories.map((cat) => (
//             <button
//               key={cat.slug}
//               onClick={() => startTransition(() => setActiveSlug(cat.slug))}
//               className={`w-full px-6 py-4 flex items-center justify-between text-left transition-all ${
//                 activeSlug === cat.slug
//                   ? 'bg-blue-50 text-blue-600 font-bold'
//                   : 'text-gray-700 hover:bg-gray-50'
//               }`}
//             >
//               <span>{cat.name}</span>
//               <span className="text-sm font-medium textrikan-500">
//                 {cat.count}
//               </span>
//             </button>
//           ))}
//         </nav>
//       </section>

//       {/* Recent Posts */}
//       <section className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden">
//         <header className="bg-blue-600 p-4">
//           <h3 className="text-white font-bold text-lg">Recent Posts</h3>
//         </header>
//         <div className="p-4 space-y-5">
//           {recentPosts.map((post) => (
//             <Link
//               key={post.id}
//               href={`/news/${post.slug}`}
//               className="flex gap-4 group transition-all hover:translate-x-1"
//             >
//               <div className="relative w-20 h-20 shrink-0 rounded-lg overflow-hidden shadow-md">
//                 {post.featuredImage ? (
//                   <Image
//                     src={post.featuredImage}
//                     alt={post.title}
//                     fill
//                     sizes="80px"
//                     className="object-cover group-hover:scale-110 transition-transform duration-300"
//                     priority={false}
//                   />
//                 ) : (
//                   <div className="bg-gray-200 border-2 border-dashed border-gray-300 w-full h-full" />
//                 )}
//               </div>

//               <div className="flex-1">
//                 <h4 className="font-medium text-gray-900 group-hover:text-blue-600 transition-colors line-clamp-2 text-sm leading-tight">
//                   {post.title}
//                 </h4>
//                 <time className="text-xs text-gray-500 mt-1 block">
//                   {format(new Date(post.publishedAt), 'MMMM d, yyyy')}
//                 </time>
//               </div>
//             </Link>
//           ))}
//         </div>
//       </section>
//     </aside>
//   )
// }
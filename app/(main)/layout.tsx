import { ReactNode } from 'react'
import Navbar from '@/components/Navbar'
import Footer from '@/components/Footer'

interface MainLayoutProps {
  children: ReactNode
}

export default function MainLayout({ children }: MainLayoutProps) {
  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900 flex flex-col">
      <Navbar />
      <main className="flex-1 pb-16">{children}</main>
      <Footer />
    </div>
  )
}


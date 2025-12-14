import { ReactNode } from 'react'
import Navbar from '@/components/Navbar'
import Footer from '@/components/Footer'
import { Metadata } from 'next'

interface MainLayoutProps {
  children: ReactNode
}

export const metadata: Metadata = {
  title: 'Dorm Booking',
  description: 'Hệ thống đặt phòng ký túc xá',
  keywords: ['ký túc xá', 'đặt phòng', 'sinh viên', 'dormitory'],
  authors: [{ name: 'Dorm Booking Team' }],
  viewport: 'width=device-width, initial-scale=1',
  openGraph: {
    title: 'Dorm Booking',
    description: 'Hệ thống đặt phòng ký túc xá',
    type: 'website',
  },
  icons: {
    icon: '/logo.png',
  },
}

export default function MainLayout({ children }: MainLayoutProps) {
  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900 flex flex-col">
      <Navbar />
      <main className="flex-1">{children}</main>
      <Footer />
    </div>
  )
}


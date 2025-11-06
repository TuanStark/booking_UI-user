'use client'

import { useSession, signOut } from 'next-auth/react'
import { User, LogOut, Settings, Building2 } from 'lucide-react'
import Link from 'next/link'

interface AuthStatusProps {
  className?: string
}

export default function AuthStatus({ className = '' }: AuthStatusProps) {
  const { data: session, status } = useSession()

  const handleSignOut = async () => {
    await signOut({ callbackUrl: '/' })
  }

  if (status === 'loading') {
    return (
      <div className={`animate-pulse ${className}`}>
        <div className="w-8 h-8 bg-gray-200 dark:bg-gray-700 rounded-full"></div>
      </div>
    )
  }

  if (!session) {
    return (
      <div className={`flex items-center space-x-3 ${className}`}>
        <Link
          href="/auth/signin"
          className="text-gray-700 dark:text-gray-300 hover:text-blue-600 dark:hover:text-blue-400 px-3 py-2 text-sm font-medium transition-colors duration-200"
        >
          Đăng nhập
        </Link>
        <Link
          href="/auth/signup"
          className="bg-gradient-to-r from-blue-500 to-purple-600 text-white px-4 py-2 rounded-lg text-sm font-medium hover:from-blue-600 hover:to-purple-700 transition-all duration-200 shadow-lg hover:shadow-xl"
        >
          Đăng ký
        </Link>
      </div>
    )
  }

  return (
    <div className={`flex items-center space-x-3 ${className}`}>
      {/* User Info */}
      <div className="flex items-center space-x-2">
        <div className="w-8 h-8 bg-gradient-to-r from-blue-500 to-purple-600 rounded-full flex items-center justify-center">
          <User className="h-4 w-4 text-white" />
        </div>
        <div className="hidden sm:block">
          <div className="text-sm font-medium text-gray-900 dark:text-white">
            {session.user?.name || 'User'}
          </div>
          <div className="text-xs text-gray-500 dark:text-gray-400">
            {session.user?.role === 'admin' ? 'Quản trị viên' : 'Sinh viên'}
          </div>
        </div>
      </div>

      {/* Quick Actions */}
      <div className="hidden md:flex items-center space-x-2">
        <Link
          href="/bookings"
          className="p-2 text-gray-600 dark:text-gray-400 hover:text-blue-600 dark:hover:text-blue-400 hover:bg-gray-100 dark:hover:bg-gray-800 rounded-lg transition-colors duration-200"
          title="Đặt phòng của tôi"
        >
          <Building2 className="h-4 w-4" />
        </Link>
        <Link
          href="/settings"
          className="p-2 text-gray-600 dark:text-gray-400 hover:text-blue-600 dark:hover:text-blue-400 hover:bg-gray-100 dark:hover:bg-gray-800 rounded-lg transition-colors duration-200"
          title="Cài đặt"
        >
          <Settings className="h-4 w-4" />
        </Link>
      </div>

      {/* Sign Out Button */}
      <button
        onClick={handleSignOut}
        className="flex items-center px-3 py-2 text-sm font-medium text-red-600 dark:text-red-400 hover:text-red-700 dark:hover:text-red-300 hover:bg-red-50 dark:hover:bg-red-900/20 rounded-lg transition-colors duration-200"
      >
        <LogOut className="h-4 w-4 mr-1" />
        <span className="hidden sm:inline">Đăng xuất</span>
      </button>
    </div>
  )
}

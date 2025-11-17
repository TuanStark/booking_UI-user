'use client'

import { useEffect, useRef, useState } from 'react'
import { signOut } from 'next-auth/react'
import { User, LogOut, Settings, Building2, ChevronDown } from 'lucide-react'
import Link from 'next/link'
import { cn } from '@/lib/utils'
import { useUser } from '@/contexts/UserContext'

interface AuthStatusProps {
  className?: string
}

export default function AuthStatus({ className = '' }: AuthStatusProps) {
  const { user, isLoading, isAuthenticated } = useUser()
  const [isMenuOpen, setIsMenuOpen] = useState(false)
  const dropdownRef = useRef<HTMLDivElement | null>(null)

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        setIsMenuOpen(false)
      }
    }

    if (isMenuOpen) {
      document.addEventListener('mousedown', handleClickOutside)
    }

    return () => {
      document.removeEventListener('mousedown', handleClickOutside)
    }
  }, [isMenuOpen])

  const handleSignOut = async () => {
    setIsMenuOpen(false)
    await signOut({ callbackUrl: '/' })
  }

  if (isLoading) {
    return (
      <div className={`animate-pulse ${className}`}>
        <div className="w-8 h-8 bg-gray-200 dark:bg-gray-700 rounded-full"></div>
      </div>
    )
  }

  if (!isAuthenticated || !user) {
    return (
      <div className={cn('flex items-center space-x-3', className)}>
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

  const roleField = (user as { role?: string | { name?: string } } | undefined)?.role
  const rawRole = typeof roleField === 'string' ? roleField : roleField?.name
  const userRole =
    rawRole === 'ADMIN' ? 'Quản trị viên' : rawRole === 'MANAGER' ? 'Quản lý tòa nhà' : 'Sinh viên'

  return (
    <div className={cn('relative flex items-center', className)} ref={dropdownRef}>
      <button
        type="button"
        onClick={() => setIsMenuOpen((prev) => !prev)}
        className="flex items-center space-x-3 px-3 py-2 rounded-xl border border-gray-200 dark:border-gray-700 hover:border-blue-400 dark:hover:border-blue-400 hover:bg-gray-50 dark:hover:bg-gray-800 transition-all duration-200"
      >
        <span className="w-9 h-9 bg-gradient-to-r from-blue-500 to-purple-600 rounded-full flex items-center justify-center shadow-md">
          <User className="h-4 w-4 text-white" />
        </span>
        <span className="hidden sm:flex flex-col items-start">
          <span className="text-sm font-semibold text-gray-900 dark:text-white">
            {user.name || user.email || 'User'}
          </span>
          <span className="text-xs text-gray-500 dark:text-gray-400">{userRole}</span>
        </span>
        <ChevronDown
          className={cn(
            'h-4 w-4 text-gray-500 dark:text-gray-400 transition-transform duration-200',
            isMenuOpen ? 'rotate-180' : 'rotate-0'
          )}
        />
      </button>

      {isMenuOpen && (
        <div className="absolute right-0 top-[calc(100%+0.75rem)] w-64 bg-white dark:bg-gray-900 rounded-2xl shadow-2xl border border-gray-100 dark:border-gray-800 overflow-hidden z-50">
          <div className="px-4 py-4 border-b border-gray-100 dark:border-gray-800">
            <p className="text-sm font-semibold text-gray-900 dark:text-white">
              {user.name || user.email || 'User'}
            </p>
            <p className="text-xs text-gray-500 dark:text-gray-400">{user.email}</p>
          </div>
          <div className="py-2">
            <Link
              href="/profile"
              className="flex items-center px-4 py-2 text-sm text-gray-700 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-800 transition-colors duration-200"
              onClick={() => setIsMenuOpen(false)}
            >
              <User className="h-4 w-4 mr-3 text-blue-500" />
              Hồ sơ của tôi
            </Link>
            <Link
              href="/bookings"
              className="flex items-center px-4 py-2 text-sm text-gray-700 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-800 transition-colors duration-200"
              onClick={() => setIsMenuOpen(false)}
            >
              <Building2 className="h-4 w-4 mr-3 text-indigo-500" />
              Đặt phòng của tôi
            </Link>
            {/* <Link
              href="/settings"
              className="flex items-center px-4 py-2 text-sm text-gray-700 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-800 transition-colors duration-200"
              onClick={() => setIsMenuOpen(false)}
            >
              <Settings className="h-4 w-4 mr-3 text-purple-500" />
              Cài đặt tài khoản
            </Link> */}
          </div>
          <button
            onClick={handleSignOut}
            className="w-full text-left px-4 py-3 text-sm font-medium text-red-600 dark:text-red-400 hover:bg-red-50 dark:hover:bg-red-900/20 transition-colors duration-200 flex items-center"
          >
            <LogOut className="h-4 w-4 mr-3" />
            Đăng xuất
          </button>
        </div>
      )}
    </div>
  )
}

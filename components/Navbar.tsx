'use client'

import { useState } from 'react'
import Link from 'next/link'
import { usePathname } from 'next/navigation'
import { signOut } from 'next-auth/react'
import { Menu, X, Sun, Moon, Building2, User, ChevronDown } from 'lucide-react'
import { cn } from '@/utils/utils'
import { NAV_ITEMS } from '../constants'
import AuthStatus from './AuthStatus'
import { useUser } from '@/contexts/UserContext'

export default function Navbar() {
  const [isMenuOpen, setIsMenuOpen] = useState(false)
  const [isUserMenuOpen, setIsUserMenuOpen] = useState(false)
  const [isDarkMode, setIsDarkMode] = useState(false)
  const pathname = usePathname()
  const { user, isAuthenticated } = useUser()

  const toggleDarkMode = () => {
    setIsDarkMode(!isDarkMode)
    document.documentElement.classList.toggle('dark')
  }

  const handleSignOut = async () => {
    setIsUserMenuOpen(false)
    await signOut({ callbackUrl: '/' })
  }

  return (
    <nav className="bg-white dark:bg-gray-900 shadow-lg sticky top-0 z-50 transition-colors duration-200">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-16">
          {/* Logo */}
          <div className="flex-shrink-0">
            <Link href="/" className="flex items-center space-x-2">
              <div className="w-8 h-8 bg-gradient-to-r from-blue-500 to-purple-600 rounded-lg flex items-center justify-center">
                <Building2 className="h-5 w-5 text-white" />
              </div>
              <span className="text-xl font-bold text-gray-900 dark:text-white">
                DormBooking
              </span>
            </Link>
          </div>

          {/* Desktop Menu */}
          <div className="hidden md:block">
            <div className="ml-10 flex items-baseline space-x-8">
              {NAV_ITEMS.map((item) => (
                <Link
                  key={item.name}
                  href={item.href}
                  className={cn(
                    'px-3 py-2 text-sm font-medium transition-colors duration-200',
                    (item.href === '/' ? pathname === '/' : pathname.startsWith(item.href))
                      ? 'text-blue-600 dark:text-blue-400'
                      : 'text-gray-700 dark:text-gray-300 hover:text-blue-600 dark:hover:text-blue-400'
                  )}
                >
                  {item.name}
                </Link>
              ))}
            </div>
          </div>

          {/* Desktop Auth Buttons & Dark Mode */}
          <div className="hidden md:flex items-center space-x-4">
            {/* <button
              onClick={toggleDarkMode}
              className="p-2 rounded-lg text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-800 transition-colors duration-200"
            >
              {isDarkMode ? (
                <Sun className="h-5 w-5" />
              ) : (
                <Moon className="h-5 w-5" />
              )}
            </button> */}

            <AuthStatus />
          </div>

          {/* Mobile menu button */}
          <div className="md:hidden flex items-center space-x-2">
            {/* <button
              onClick={toggleDarkMode}
              className="p-2 rounded-lg text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-800 transition-colors duration-200"
            >
              {isDarkMode ? (
                <Sun className="h-5 w-5" />
              ) : (
                <Moon className="h-5 w-5" />
              )}
            </button> */}
            <button
              onClick={() => {
                const nextState = !isMenuOpen
                setIsMenuOpen(nextState)
                if (!nextState) {
                  setIsUserMenuOpen(false)
                }
              }}
              className="p-2 rounded-lg text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-800 transition-colors duration-200"
            >
              {isMenuOpen ? (
                <X className="h-6 w-6" />
              ) : (
                <Menu className="h-6 w-6" />
              )}
            </button>
          </div>
        </div>

        {/* Mobile Menu */}
        {isMenuOpen && (
          <div className="md:hidden">
            <div className="px-2 pt-2 pb-3 space-y-1 sm:px-3 bg-white dark:bg-gray-900 rounded-lg mt-2 shadow-lg">
              {NAV_ITEMS.map((item) => (
                <Link
                  key={item.name}
                  href={item.href}
                  className={cn(
                    'block px-3 py-2 text-base font-medium transition-colors duration-200',
                    (item.href === '/' ? pathname === '/' : pathname.startsWith(item.href))
                      ? 'text-blue-600 dark:text-blue-400'
                      : 'text-gray-700 dark:text-gray-300 hover:text-blue-600 dark:hover:text-blue-400'
                  )}
                  onClick={() => {
                    setIsMenuOpen(false)
                    setIsUserMenuOpen(false)
                  }}
                >
                  {item.name}
                </Link>
              ))}
              <div className="border-t border-gray-200 dark:border-gray-700 pt-4 mt-4">
                {isAuthenticated ? (
                  <>
                    <button
                      type="button"
                      onClick={() => setIsUserMenuOpen(!isUserMenuOpen)}
                      className="w-full px-3 py-2 mb-2 flex items-center justify-between rounded-lg bg-gray-50 dark:bg-gray-800 text-sm font-medium text-gray-700 dark:text-gray-200 transition-colors duration-200"
                    >
                      <span className="flex items-center space-x-2">
                        <span className="w-8 h-8 bg-gradient-to-r from-blue-500 to-purple-600 rounded-full flex items-center justify-center">
                          <User className="h-4 w-4 text-white" />
                        </span>
                        <span>{user?.name || user?.email || 'User'}</span>
                      </span>
                      <ChevronDown
                        className={cn(
                          'h-4 w-4 transition-transform duration-200',
                          isUserMenuOpen ? 'rotate-180' : 'rotate-0'
                        )}
                      />
                    </button>
                    {isUserMenuOpen && (
                      <>
                        <Link
                          href="/profile"
                          className="text-gray-700 dark:text-gray-300 hover:text-blue-600 dark:hover:text-blue-400 block px-3 py-2 text-base font-medium w-full text-left transition-colors duration-200"
                          onClick={() => {
                            setIsMenuOpen(false)
                            setIsUserMenuOpen(false)
                          }}
                        >
                          Hồ sơ
                        </Link>
                        <Link
                          href="/bookings"
                          className="text-gray-700 dark:text-gray-300 hover:text-blue-600 dark:hover:text-blue-400 block px-3 py-2 text-base font-medium w-full text-left transition-colors duration-200"
                          onClick={() => {
                            setIsMenuOpen(false)
                            setIsUserMenuOpen(false)
                          }}
                        >
                          Đặt phòng của tôi
                        </Link>
                        <button
                          onClick={async () => {
                            setIsMenuOpen(false)
                            setIsUserMenuOpen(false)
                            await handleSignOut()
                          }}
                          className="text-red-600 dark:text-red-400 block px-3 py-2 text-base font-medium w-full text-left transition-colors duration-200"
                        >
                          Đăng xuất
                        </button>
                      </>
                    )}
                  </>
                ) : (
                  <>
                    <Link
                      href="/auth/signin"
                      className="text-gray-700 dark:text-gray-300 hover:text-blue-600 dark:hover:text-blue-400 block px-3 py-2 text-base font-medium w-full text-left transition-colors duration-200"
                      onClick={() => {
                        setIsMenuOpen(false)
                        setIsUserMenuOpen(false)
                      }}
                    >
                      Đăng nhập
                    </Link>
                    <Link
                      href="/auth/signup"
                      className="bg-gradient-to-r from-blue-500 to-purple-600 text-white px-3 py-2 rounded-lg text-base font-medium hover:from-blue-600 hover:to-purple-700 transition-all duration-200 w-full mt-2 block text-center"
                      onClick={() => {
                        setIsMenuOpen(false)
                        setIsUserMenuOpen(false)
                      }}
                    >
                      Đăng ký
                    </Link>
                  </>
                )}
              </div>
            </div>
          </div>
        )}
      </div>
    </nav>
  )
}

'use client'

import { useEffect } from 'react'
import { useRouter } from 'next/navigation'
import { useUser } from '@/contexts/UserContext'

interface UseAuthOptions {
  required?: boolean
  redirectTo?: string
  roles?: string[]
}

const normalizeRole = (role?: string) => role?.toLowerCase() ?? ''

export function useAuth(options: UseAuthOptions = {}) {
  const { user, isAuthenticated, isLoading, refreshUser } = useUser()
  const router = useRouter()
  const { required = false, redirectTo = '/auth/signin', roles = [] } = options

  useEffect(() => {
    if (isLoading) return

    if (required && !isAuthenticated) {
      const callbackUrl = encodeURIComponent(window.location.href)
      router.push(`${redirectTo}?callbackUrl=${callbackUrl}`)
      return
    }

    if (required && isAuthenticated && roles.length > 0) {
      const normalizedRoles = roles.map((role) => role.toLowerCase())
      const userRole = normalizeRole(user?.role)
      if (!normalizedRoles.includes(userRole)) {
        router.push('/unauthorized')
      }
    }
  }, [isAuthenticated, isLoading, required, redirectTo, roles, router, user])

  return {
    user,
    isLoading,
    isAuthenticated,
    refreshUser,
    hasRole: (role: string) => normalizeRole(user?.role) === role.toLowerCase(),
    isAdmin: normalizeRole(user?.role) === 'admin',
    isStudent: normalizeRole(user?.role) === 'student',
  }
}

export function useRequireAuth() {
  return useAuth({ required: true })
}

export function useRequireAdmin() {
  return useAuth({ required: true, roles: ['admin'] })
}

export function useRequireStudent() {
  return useAuth({ required: true, roles: ['student'] })
}

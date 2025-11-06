'use client'

import { useSession } from 'next-auth/react'
import { useRouter } from 'next/navigation'
import { useEffect } from 'react'

interface UseAuthOptions {
  required?: boolean
  redirectTo?: string
  roles?: string[]
}

export function useAuth(options: UseAuthOptions = {}) {
  const { data: session, status } = useSession()
  const router = useRouter()
  const { required = false, redirectTo = '/auth/signin', roles = [] } = options

  useEffect(() => {
    if (status === 'loading') return // Still loading

    // If authentication is required but user is not authenticated
    if (required && !session) {
      const callbackUrl = encodeURIComponent(window.location.href)
      router.push(`${redirectTo}?callbackUrl=${callbackUrl}`)
      return
    }

    // If specific roles are required
    if (required && session && roles.length > 0) {
      const userRole = session.user?.role
      if (!userRole || !roles.includes(userRole)) {
        router.push('/unauthorized')
        return
      }
    }
  }, [session, status, required, redirectTo, roles, router])

  return {
    session,
    user: session?.user,
    isLoading: status === 'loading',
    isAuthenticated: !!session,
    hasRole: (role: string) => session?.user?.role === role,
    isAdmin: session?.user?.role === 'admin',
    isStudent: session?.user?.role === 'student',
  }
}

// Convenience hooks for common use cases
export function useRequireAuth() {
  return useAuth({ required: true })
}

export function useRequireAdmin() {
  return useAuth({ required: true, roles: ['admin'] })
}

export function useRequireStudent() {
  return useAuth({ required: true, roles: ['student'] })
}

'use client'

import { ReactNode } from 'react'
import { useUser } from '@/contexts/UserContext'

interface AuthGuardProps {
  children: ReactNode
  fallback?: ReactNode
  roles?: string[]
  requireAuth?: boolean
}

export default function AuthGuard({
  children,
  fallback = null,
  roles = [],
  requireAuth = true,
}: AuthGuardProps) {
  const { user, isAuthenticated, isLoading } = useUser()

  if (isLoading) {
    return <div className="animate-pulse bg-gray-200 dark:bg-gray-700 rounded-lg h-10 w-full" />
  }

  if (requireAuth && !isAuthenticated) {
    return <>{fallback}</>
  }

  if (roles.length > 0 && isAuthenticated) {
    const normalizedRoles = roles.map((role) => role.toLowerCase())
    const userRole = user?.role?.name?.toLowerCase()
    if (!userRole || !normalizedRoles.includes(userRole)) {
      return <>{fallback}</>
    }
  }

  return <>{children}</>
}

export function RequireAuth({ children, fallback }: { children: ReactNode; fallback?: ReactNode }) {
  return (
    <AuthGuard requireAuth={true} fallback={fallback}>
      {children}
    </AuthGuard>
  )
}

export function RequireAdmin({ children, fallback }: { children: ReactNode; fallback?: ReactNode }) {
  return (
    <AuthGuard requireAuth={true} roles={['admin']} fallback={fallback}>
      {children}
    </AuthGuard>
  )
}

export function RequireStudent({ children, fallback }: { children: ReactNode; fallback?: ReactNode }) {
  return (
    <AuthGuard requireAuth={true} roles={['student']} fallback={fallback}>
      {children}
    </AuthGuard>
  )
}

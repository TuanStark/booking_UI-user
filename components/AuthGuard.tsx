'use client'

import { useSession } from 'next-auth/react'
import { ReactNode } from 'react'

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
  requireAuth = true 
}: AuthGuardProps) {
  const { data: session, status } = useSession()

  // Still loading
  if (status === 'loading') {
    return (
      <div className="animate-pulse bg-gray-200 dark:bg-gray-700 rounded-lg h-10 w-full"></div>
    )
  }

  // Not authenticated and auth is required
  if (requireAuth && !session) {
    return <>{fallback}</>
  }

  // Check roles if specified
  if (roles.length > 0 && session) {
    const userRole = session.user?.role
    if (!userRole || !roles.includes(userRole)) {
      return <>{fallback}</>
    }
  }

  return <>{children}</>
}

// Convenience components
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

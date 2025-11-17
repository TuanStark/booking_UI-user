'use client'

import { createContext, useCallback, useContext, useEffect, useMemo, useRef, useState } from 'react'
import { useSession } from 'next-auth/react'
import { apiClient } from '@/services/apiClient'
import { ApiResponse, UserResponse } from '@/types/api'

interface UserContextValue {
  user: UserResponse | null
  accessToken: string | null
  isLoading: boolean
  isAuthenticated: boolean
  error: string | null
  refreshUser: () => Promise<void>
}

const UserContext = createContext<UserContextValue | undefined>(undefined)

interface UserProviderProps {
  children: React.ReactNode
}

export function UserProvider({ children }: UserProviderProps) {
  const { data: session, status } = useSession()
  const [user, setUser] = useState<UserResponse | null>(null)
  const [isLoading, setIsLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const abortRef = useRef<AbortController | null>(null)

  const accessToken = (session as { accessToken?: string } | null)?.accessToken ?? null

  const fetchUser = useCallback(async () => {
    if (!accessToken) {
      setUser(null)
      setIsLoading(false)
      setError(null)
      return
    }

    abortRef.current?.abort()
    const controller = new AbortController()
    abortRef.current = controller

    setIsLoading(true)
    setError(null)

    try {
      const response = (await apiClient.getProfile(accessToken)) as ApiResponse<UserResponse>
      if (!controller.signal.aborted) {
        setUser(response.data ?? null)
      }
    } catch (err: any) {
      if (!controller.signal.aborted) {
        setUser(null)
        setError(err?.message ?? 'Không thể tải thông tin người dùng')
      }
    } finally {
      if (!controller.signal.aborted) {
        setIsLoading(false)
      }
    }
  }, [accessToken])

  useEffect(() => {
    if (status === 'loading') {
      return
    }
    fetchUser()
    return () => {
      abortRef.current?.abort()
    }
  }, [status, fetchUser])

  const value = useMemo<UserContextValue>(
    () => ({
      user,
      accessToken,
      isLoading,
      isAuthenticated: Boolean(user && accessToken),
      error,
      refreshUser: fetchUser,
    }),
    [user, accessToken, isLoading, error, fetchUser]
  )

  return <UserContext.Provider value={value}>{children}</UserContext.Provider>
}

export function useUser() {
  const context = useContext(UserContext)
  if (!context) {
    throw new Error('useUser must be used within a UserProvider')
  }
  return context
}


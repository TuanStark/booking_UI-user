'use client'

import { SessionProvider } from 'next-auth/react'
import { ReactNode } from 'react'
import { UserProvider } from '@/contexts/UserContext'

interface AuthProviderProps {
  children: ReactNode
}

export default function AuthProvider({ children }: AuthProviderProps) {
  return (
    <SessionProvider>
      <UserProvider>{children}</UserProvider>
    </SessionProvider>
  )
}

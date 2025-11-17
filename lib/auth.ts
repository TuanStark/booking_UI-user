import { NextAuthOptions, User } from 'next-auth'
import CredentialsProvider from 'next-auth/providers/credentials'
import { apiClient } from '@/services/apiClient'
import { ApiResponse, BackendApiResponse, LoginResponse } from '@/types/api'
import { UserResponse } from '@/types/api'

type AuthUser = User & {
  role: string
  token: string
}

export const authOptions: NextAuthOptions = {
  providers: [
    CredentialsProvider({
      name: 'credentials',
      credentials: {
        email: { label: 'Email', type: 'email' },
        password: { label: 'Password', type: 'password' }
      },
      async authorize(credentials): Promise<AuthUser | null> {
        if (!credentials?.email || !credentials?.password) {
          return null
        }

        try {
          const response = await apiClient.login({
            email: credentials.email,
            password: credentials.password,
          }) as ApiResponse<LoginResponse>
          const accessToken = response.data?.data?.accessToken
          const profileResponse = await apiClient.getProfile(accessToken ?? '') as ApiResponse<UserResponse>
          const profile = profileResponse.data
          if (!profile) {
            return null
          }
          return {
            id: profile.id,
            name: profile.name ?? profile.email ?? '',
            email: profile.email ?? '',
            image: null,
            role: profile.role ?? 'USER',
            token: accessToken ?? '',
          }
        } catch (error) {
          console.error('Login error:', error)
          return null
        }
      }
    })
  ],
  session: {
    strategy: 'jwt',
  },
  callbacks: {
    async jwt({ token, user }) {
      console.log('jwt', token, user)
        if (user) {
          const authUser = user as AuthUser
          token.role = authUser.role
          token.accessToken = authUser.token
      }
      return token
    },
    async session({ session, token }) {
      console.log('session', session)
      console.log('token', token)
      if (token) {
        const authUser = session.user as AuthUser
        authUser.id = token.sub || ''
        authUser.name = authUser.name || ''
        authUser.email = authUser.email || ''
        authUser.role = (token.role as string) || 'USER'
        ;(session as any).accessToken = token.accessToken
      }
      return session
    },
  },
  pages: {
    signIn: '/auth/signin',
  },
}
import { NextAuthOptions, User } from 'next-auth'
import CredentialsProvider from 'next-auth/providers/credentials'
import { apiClient } from '@/services/apiClient'
import { ApiResponse, LoginResponse, RoleResponse, UserResponse } from '@/types/api'

interface AuthUser extends User {
  role: string
  roleDetail: RoleResponse | null
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
      async authorize(credentials): Promise<User | null> {
        if (!credentials?.email || !credentials?.password) {
          return null
        }

        try {
          const response = await apiClient.login({
            email: credentials.email,
            password: credentials.password,
          }) as ApiResponse<LoginResponse>
          const accessToken = response.data?.data?.accessToken ?? ''
          const profileResponse = await apiClient.getProfile(accessToken) as ApiResponse<UserResponse>
          const profile = profileResponse.data ?? null
          if (profile) {
            const roleDetail = profile.role ?? null
            const authUser: AuthUser = {
              id: profile.id,
              name: profile.name ?? profile.email ?? '',
              email: profile.email ?? '',
              image: null,
              role: roleDetail?.name ?? 'USER',
              roleDetail,
              token: accessToken,
            }
            return authUser
          }
          return null
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
      if (user) {
        const authUser = user as AuthUser
        token.role = authUser.role
        token.roleDetail = authUser.roleDetail
        token.accessToken = authUser.token
      }
      return token
    },
    async session({ session, token }) {
      if (token) {
        if (!session.user) {
          session.user = {} as AuthUser
        }
        const authUser = session.user as AuthUser
        authUser.id = token.sub || authUser.id || ''
        authUser.name = authUser.name || ''
        authUser.email = authUser.email || ''
        authUser.role = (token.role as string) || authUser.role || 'USER'
        authUser.roleDetail = (token.roleDetail as RoleResponse | null) ?? authUser.roleDetail ?? null
          ; (session as any).accessToken = token.accessToken
      }
      return session
    },
  },
  pages: {
    signIn: '/auth/signin',
  },
}
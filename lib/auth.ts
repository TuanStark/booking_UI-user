import { NextAuthOptions, User } from 'next-auth'
import CredentialsProvider from 'next-auth/providers/credentials'
import { apiClient } from '@/services/apiClient'
import { EmailNotVerifiedError } from '@/lib/errors'
import { LoginResponse, RoleResponse, UserResponse } from '@/types/api'

interface AuthUser extends User {
  role: string
  roleDetail: RoleResponse | null
  token: string
  refreshToken?: string
  rememberMe?: boolean
}

export const authOptions: NextAuthOptions = {
  providers: [
    CredentialsProvider({
      name: 'credentials',
      credentials: {
        email: { label: 'Email', type: 'email' },
        password: { label: 'Password', type: 'password' },
        rememberMe: { label: 'RememberMe', type: 'text' }
      },
      async authorize(credentials): Promise<User | null> {
        if (!credentials?.email || !credentials?.password) {
          return null
        }

        try {
          const response = await apiClient.login({
            email: credentials.email,
            password: credentials.password,
          }) as any;
          
          let accessToken = '';
          let refreshToken = '';
          
          if (response?.data?.accessToken) {
             accessToken = response.data.accessToken;
             refreshToken = response.data.refreshToken || '';
          } else if (response?.data?.data?.accessToken) {
             accessToken = response.data.data.accessToken;
             refreshToken = response.data.data.refreshToken || '';
          } else if (response?.accessToken) {
             accessToken = response.accessToken;
             refreshToken = response.refreshToken || '';
          }
          
          const profileResponse = await apiClient.getProfile(accessToken) as any;
          
          let profile = null;
          if (profileResponse?.data?.data) {
             profile = profileResponse.data.data;
          } else if (profileResponse?.data?.id) {
             profile = profileResponse.data;
          } else if (profileResponse?.id) {
             profile = profileResponse;
          }
          
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
              refreshToken: refreshToken,
              rememberMe: credentials.rememberMe === 'true',
            }
            return authUser
          }
          return null
        } catch (error: any) {
          console.error('[NextAuth] Authorize Error: ', error);
          
          const errData = error?.response?.data?.data || error?.response?.data || error;
          if (
            error instanceof EmailNotVerifiedError || 
            error?.code === 'EMAIL_NOT_VERIFIED' ||
            errData?.code === 'EMAIL_NOT_VERIFIED'
          ) {
            const userId = error?.userId || errData?.userId;
            const email = error?.email || errData?.email;
            throw new Error(JSON.stringify({ code: 'EMAIL_NOT_VERIFIED', userId, email }))
          }
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
        token.refreshToken = authUser.refreshToken
        // Access token expires in 15 minutes on backend, set buffer to 14 minutes
        token.accessTokenExpires = Date.now() + 14 * 60 * 1000
        token.rememberMe = authUser.rememberMe
        return token
      }

      const isTokenExpired = Date.now() > (token.accessTokenExpires as number);
      
      if (!isTokenExpired) {
        return token
      }

      if (!token.rememberMe) {
        return { ...token, error: 'RefreshAccessTokenError' };
      }

      try {
        const url = process.env.NEXT_PUBLIC_API_BASE_URL || 'http://localhost:4000';
        const response = await fetch(`${url}/auth/refresh`, {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            'Cookie': `refresh_token=${token.refreshToken}`
          }
        });

        const refreshedData = await response.json();
        if (!response.ok) throw refreshedData;

        let newRefreshToken = token.refreshToken;
        const setCookieHeader = response.headers.get('set-cookie');
        if (setCookieHeader) {
          const match = setCookieHeader.match(/refresh_token=([^;]+)/);
          if (match) newRefreshToken = match[1];
        }

        return {
          ...token,
          accessToken: refreshedData.accessToken,
          accessTokenExpires: Date.now() + 14 * 60 * 1000, 
          refreshToken: newRefreshToken,
        }
      } catch (error) {
        return { ...token, error: 'RefreshAccessTokenError' }
      }
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
        
        ;(session as any).accessToken = token.accessToken
        ;(session as any).error = token.error
      }
      return session
    },
  },
  pages: {
    signIn: '/auth/signin',
  },
}
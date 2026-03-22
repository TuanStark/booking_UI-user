import { NextAuthOptions, User } from 'next-auth'
import CredentialsProvider from 'next-auth/providers/credentials'
import { apiClient } from '@/services/apiClient'
import { EmailNotVerifiedError } from '@/lib/errors'
import { RoleResponse } from '@/types/api'

interface AuthUser extends User {
  role: string
  roleDetail: RoleResponse | null
  token: string
  refreshToken?: string
  rememberMe?: boolean
}

/**
 * API Gateway (booking_api-gateway) trả body dạng:
 * `{ status, data: <body từ auth-service>, headers }`.
 * Auth-service lại bọc login trong `ResponseData`: `{ data: { accessToken, ... }, statusCode, message }`.
 * Hàm này tìm accessToken/refreshToken sâu trong cây object (không phụ thuộc số lớp bọc).
 */
function extractSessionTokens(raw: unknown): {
  accessToken: string
  refreshToken: string
} {
  let accessToken = ''
  let refreshToken = ''
  const walk = (o: unknown, depth: number) => {
    if (!o || typeof o !== 'object' || depth > 10) return
    const obj = o as Record<string, unknown>
    if (typeof obj.accessToken === 'string' && obj.accessToken.length > 0) {
      accessToken = obj.accessToken
    }
    if (typeof obj.refreshToken === 'string' && obj.refreshToken.length > 0) {
      refreshToken = obj.refreshToken
    }
    for (const v of Object.values(obj)) {
      if (v && typeof v === 'object') walk(v, depth + 1)
    }
  }
  walk(raw, 0)
  return { accessToken, refreshToken }
}

/** Tìm object user (có id + email) trong response đã bọc gateway / ResponseData. */
function extractUserProfile(raw: unknown): Record<string, unknown> | null {
  const walk = (o: unknown, depth: number): Record<string, unknown> | null => {
    if (!o || typeof o !== 'object' || depth > 10) return null
    const obj = o as Record<string, unknown>
    if (
      typeof obj.id === 'string' &&
      typeof obj.email === 'string' &&
      (Object.prototype.hasOwnProperty.call(obj, 'role') ||
        Object.prototype.hasOwnProperty.call(obj, 'roleId'))
    ) {
      return obj
    }
    for (const v of Object.values(obj)) {
      const found = walk(v, depth + 1)
      if (found) return found
    }
    return null
  }
  return walk(raw, 0)
}

/** Gateway bọc JSON refresh: `{ data: { accessToken } }` */
function extractAccessTokenFromRefreshBody(raw: unknown): string {
  const { accessToken } = extractSessionTokens(raw)
  return accessToken
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
          }) as any

          const { accessToken, refreshToken } = extractSessionTokens(response)

          if (!accessToken) {
            console.error(
              '[NextAuth] Login OK nhưng không đọc được accessToken từ body. Kiểm tra gateway + ResponseData.',
              JSON.stringify(response)?.slice(0, 500),
            )
            return null
          }

          const profileResponse = await apiClient.getProfile(accessToken) as any
          const profile = extractUserProfile(profileResponse)

          if (profile) {
            const roleDetail = (profile.role ?? null) as RoleResponse | null
            const authUser: AuthUser = {
              id: profile.id as string,
              name: (profile.name as string) ?? (profile.email as string) ?? '',
              email: (profile.email as string) ?? '',
              image: null,
              role: roleDetail?.name ?? 'USER',
              roleDetail,
              token: accessToken,
              refreshToken: refreshToken,
              rememberMe: credentials.rememberMe === 'true',
            }
            return authUser
          }

          console.error(
            '[NextAuth] getProfile không parse được user (sai cấu trúc response?).',
            JSON.stringify(profileResponse)?.slice(0, 500),
          )
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

        const newAccess = extractAccessTokenFromRefreshBody(refreshedData);
        if (!newAccess) {
          console.error('[NextAuth] Refresh: không tìm thấy accessToken trong body (gateway bọc?).', refreshedData);
          throw new Error('No access token in refresh response');
        }

        return {
          ...token,
          accessToken: newAccess,
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
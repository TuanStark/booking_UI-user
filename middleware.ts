import { withAuth } from 'next-auth/middleware'
import { NextResponse } from 'next/server'

export default withAuth(
  function middleware(req) {
    const { pathname } = req.nextUrl
    const token = req.nextauth.token

    // Routes that require authentication
    const protectedRoutes = [
      '/rooms/[id]',           // Room detail & booking
      '/bookings',             // User bookings
      '/profile',              // User profile
      '/settings',             // User settings
      '/admin',                // Admin panel
    ]

    // Check if the current path matches any protected route
    const isProtectedRoute = protectedRoutes.some(route => {
      if (route.includes('[') && route.includes(']')) {
        // Handle dynamic routes like /rooms/[id]
        const routePattern = route.replace(/\[.*?\]/g, '[^/]+')
        const regex = new RegExp(`^${routePattern}$`)
        return regex.test(pathname)
      }
      return pathname.startsWith(route)
    })

    // If it's a protected route and user is not authenticated
    if (isProtectedRoute && !token) {
      // Redirect to sign in page with callback URL
      const signInUrl = new URL('/auth/signin', req.url)
      signInUrl.searchParams.set('callbackUrl', req.url)
      return NextResponse.redirect(signInUrl)
    }

    // Admin routes require admin role
    if (pathname.startsWith('/admin') && token?.role !== 'admin') {
      return NextResponse.redirect(new URL('/unauthorized', req.url))
    }

    return NextResponse.next()
  },
  {
    callbacks: {
      authorized: ({ token, req }) => {
        const { pathname } = req.nextUrl
        
        // Allow access to auth pages without token
        if (pathname.startsWith('/auth/')) {
          return true
        }

        // Allow access to public pages
        const publicRoutes = [
          '/',
          '/buildings',
          '/buildings/[id]',
          '/about',
          '/contact',
          '/create-sample',
        ]

        const isPublicRoute = publicRoutes.some(route => {
          if (route.includes('[') && route.includes(']')) {
            const routePattern = route.replace(/\[.*?\]/g, '[^/]+')
            const regex = new RegExp(`^${routePattern}$`)
            return regex.test(pathname)
          }
          return pathname.startsWith(route)
        })

        if (isPublicRoute) {
          return true
        }

        // For protected routes, require token
        return !!token
      },
    },
  }
)

export const config = {
  matcher: [
    /*
     * Match all request paths except for the ones starting with:
     * - api (API routes)
     * - _next/static (static files)
     * - _next/image (image optimization files)
     * - favicon.ico (favicon file)
     * - public folder
     */
    '/((?!api|_next/static|_next/image|favicon.ico|public).*)',
  ],
}

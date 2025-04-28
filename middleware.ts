import { NextResponse } from 'next/server'
import type { NextRequest } from 'next/server'

export function middleware(request: NextRequest) {
  const response = NextResponse.next()
  const pathName = request.nextUrl.pathname
  
  // Add CSRF protection headers
  response.headers.set('X-Frame-Options', 'DENY')
  response.headers.set('X-Content-Type-Options', 'nosniff')
  response.headers.set('Referrer-Policy', 'strict-origin-when-cross-origin')
  
  // Set Content-Security-Policy to prevent XSS attacks
  response.headers.set(
    'Content-Security-Policy',
    "default-src 'self'; script-src 'self' 'unsafe-inline' 'unsafe-eval' *.vercel.app vercel.live www.google.com www.gstatic.com *.vercel-scripts.com; style-src 'self' 'unsafe-inline'; img-src 'self' blob: data:; font-src 'self'; connect-src 'self' *.vercel.app vercel.live www.google.com; frame-src 'self' *.youtube.com *.vercel.app vercel.live www.google.com"
  )
  
  // Protect admin routes with basic authentication
  if (pathName.startsWith('/admin')) {
    // Get basic auth credentials
    const basicAuth = request.headers.get('authorization')
    
    // The environment variables ADMIN_USERNAME and ADMIN_PASSWORD should be set with your credentials
    const adminUsername = process.env.ADMIN_USERNAME
    const adminPassword = process.env.ADMIN_PASSWORD
    
    // Prepare the correct auth string
    const expectedAuth = `Basic ${Buffer.from(`${adminUsername}:${adminPassword}`).toString('base64')}`
    
    // If auth is missing or doesn't match, return 401 with WWW-Authenticate header
    if (!basicAuth || basicAuth !== expectedAuth) {
      return new Response('Authentication required', {
        status: 401,
        headers: {
          'WWW-Authenticate': 'Basic realm="Secure Area"'
        }
      })
    }
  }
  
  return response
}

export const config = {
  matcher: [
    // Protect all admin routes
    '/admin/:path*',
    // Apply security headers to all routes
    '/(.*)',
  ],
} 
import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';

export function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl;
  const adminId = request.cookies.get('adminId')?.value;

  // Protected routes that require authentication
  if (pathname.startsWith('/create-post') || pathname.startsWith('/admin/dashboard')) {
    if (!adminId) {
      return NextResponse.redirect(new URL('/admin/login', request.url));
    }
  }

  // Auth routes that should redirect if already logged in
  if ((pathname === '/admin/login' || pathname === '/admin') && adminId) {
    return NextResponse.redirect(new URL('/', request.url));
  }

  return NextResponse.next();
}

export const config = {
  matcher: [
    '/create-post/:path*',
    '/admin/:path*',
    '/admin/dashboard/:path*',
  ],
};
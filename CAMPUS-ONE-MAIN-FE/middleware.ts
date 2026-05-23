import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';

export function middleware(request: NextRequest) {
  const userId = request.cookies.get('user_id')?.value;

  // No cookie → redirect to landing page
  if (!userId) {
    return NextResponse.redirect(new URL('/', request.url));
  }

  return NextResponse.next();
}

// Only protect dashboard & internal pages — never block /, /api/*, or static assets
export const config = {
  matcher: [
    '/dashboard/:path*',
    '/general-settings/:path*',
    '/classes/:path*',
    '/subjects/:path*',
    '/students/:path*',
    '/employees/:path*',
    '/accounts/:path*',
    '/fees/:path*',
    '/salary/:path*',
    '/attendance/:path*',
  ],
};

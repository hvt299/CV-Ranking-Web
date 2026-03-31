import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';

export function middleware(request: NextRequest) {
    const token = request.cookies.get('token')?.value;
    const { pathname } = request.nextUrl;

    const protectedRoutes = ['/', '/jobs', '/candidates', '/analytics'];
    const isProtectedRoute = protectedRoutes.some(route =>
        pathname === route || pathname.startsWith(`${route}/`)
    );

    if (isProtectedRoute && !token) {
        return NextResponse.redirect(new URL('/login', request.url));
    }

    const authRoutes = ['/login', '/register'];
    if (authRoutes.includes(pathname) && token) {
        return NextResponse.redirect(new URL('/', request.url));
    }

    return NextResponse.next();
}

export const config = {
    matcher: ['/((?!api|_next/static|_next/image|favicon.ico).*)'],
};
import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';

export function middleware(request: NextRequest) {
    const token = request.cookies.get('token')?.value;
    const { pathname } = request.nextUrl;

    // Các route cần đăng nhập
    const protectedRoutes = [
        '/dashboard', '/jobs', '/candidates', '/analytics', '/interviews', '/messages', '/settings',
        '/apply', '/my-applications', '/profile'
    ];
    
    const isProtected = protectedRoutes.some(r => pathname === r || pathname.startsWith(`${r}/`));

    // Nếu chưa đăng nhập và truy cập route được bảo vệ -> redirect về login
    if (isProtected && !token) {
        return NextResponse.redirect(new URL('/login', request.url));
    }

    return NextResponse.next();
}

export const config = {
    matcher: ['/((?!api|_next/static|_next/image|favicon.ico).*)'],
};

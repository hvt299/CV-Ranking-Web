import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';

export function middleware(request: NextRequest) {
    const token = request.cookies.get('token')?.value;
    const { pathname } = request.nextUrl;

    // Routes chỉ dành cho HR/Admin
    const hrRoutes = ['/dashboard', '/jobs', '/candidates', '/analytics'];
    const isHrRoute = hrRoutes.some(r => pathname === r || pathname.startsWith(`${r}/`));

    // Routes chỉ dành cho Applicant
    const applicantRoutes = ['/apply', '/my-applications'];
    const isApplicantRoute = applicantRoutes.some(r => pathname === r || pathname.startsWith(`${r}/`));

    // Routes chỉ dành cho Admin
    const adminRoutes = ['/settings'];
    const isAdminRoute = adminRoutes.some(r => pathname === r || pathname.startsWith(`${r}/`));

    const protectedRoutes = [...hrRoutes, ...applicantRoutes, ...adminRoutes];
    const isProtected = protectedRoutes.some(r => pathname === r || pathname.startsWith(`${r}/`));

    if (isProtected && !token) {
        return NextResponse.redirect(new URL('/login', request.url));
    }

    const authRoutes = ['/login', '/register', '/verify', '/forgot-password', '/reset-password'];
    if (authRoutes.includes(pathname) && token) {
        return NextResponse.redirect(new URL('/dashboard', request.url));
    }

    return NextResponse.next();
}

export const config = {
    matcher: ['/((?!api|_next/static|_next/image|favicon.ico).*)'],
};

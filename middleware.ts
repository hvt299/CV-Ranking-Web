import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';
import { UserRole } from '@/types';

function decodeJWT(token: string) {
    try {
        const base64Url = token.split('.')[1];
        const base64 = base64Url.replace(/-/g, '+').replace(/_/g, '/');
        const jsonPayload = decodeURIComponent(atob(base64).split('').map(function (c) {
            return '%' + ('00' + c.charCodeAt(0).toString(16)).slice(-2);
        }).join(''));
        return JSON.parse(jsonPayload);
    } catch (e) {
        return null;
    }
}

export function middleware(request: NextRequest) {
    const token = request.cookies.get('token')?.value;
    const { pathname } = request.nextUrl;

    const authRoutes = ['/login', '/register', '/reset-password', '/forgot-password', '/verify'];
    const adminRoutes = ['/admin'];
    const hrRoutes = ['/dashboard', '/jobs', '/candidates', '/analytics', '/interviews', '/messages', '/settings'];
    const applicantRoutes = ['/overview', '/my-applications', '/profile', '/cv-library', '/self-score', '/notifications'];

    const isAuthRoute = authRoutes.some(r => pathname === r || pathname.startsWith(`${r}?`));
    const isAdminRoute = adminRoutes.some(r => pathname === r || pathname.startsWith(`${r}/`));
    const isHrRoute = hrRoutes.some(r => pathname === r || pathname.startsWith(`${r}/`));
    const isApplicantRoute = applicantRoutes.some(r => pathname === r || pathname.startsWith(`${r}/`));

    const isProtected = isAdminRoute || isHrRoute || isApplicantRoute;

    if (isProtected && !token) {
        return NextResponse.redirect(new URL('/login', request.url));
    }

    if (token) {
        const payload = decodeJWT(token);
        const role = payload?.role || UserRole.APPLICANT;

        if (isAuthRoute) {
            if (role === UserRole.ADMIN) return NextResponse.redirect(new URL('/admin/dashboard', request.url));
            if (role === UserRole.HR_OWNER || role === UserRole.HR_MEMBER) return NextResponse.redirect(new URL('/dashboard', request.url));
            return NextResponse.redirect(new URL('/overview', request.url));
        }

        if (role === UserRole.ADMIN) {
            if (isHrRoute || isApplicantRoute) {
                return NextResponse.redirect(new URL('/admin/dashboard', request.url));
            }
            return NextResponse.next();
        }

        if (role === UserRole.HR_OWNER || role === UserRole.HR_MEMBER) {
            if (isAdminRoute || isApplicantRoute) {
                return NextResponse.redirect(new URL('/dashboard', request.url));
            }
            return NextResponse.next();
        }

        if (role === UserRole.APPLICANT) {
            if (isAdminRoute || isHrRoute) {
                return NextResponse.redirect(new URL('/overview', request.url));
            }
            return NextResponse.next();
        }
    }

    return NextResponse.next();
}

export const config = {
    matcher: ['/((?!api|_next/static|_next/image|favicon.ico).*)'],
};
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

    const isProtected = [
        '/dashboard', '/jobs', '/candidates', '/analytics', '/interviews',
        '/messages', '/settings', '/apply', '/my-applications', '/profile',
        '/help', '/admin'
    ].some(r => pathname === r || pathname.startsWith(`${r}/`));

    if (isProtected && !token) {
        return NextResponse.redirect(new URL('/login', request.url));
    }

    if (token) {
        const payload = decodeJWT(token);
        const role = payload?.role || UserRole.APPLICANT;

        const authRoutes = ['/login', '/register', '/reset-password', '/forgot-password', '/verify'];
        const isTryingToAccessAuthRoute = authRoutes.some(r => pathname === r || pathname.startsWith(`${r}?`));

        if (isTryingToAccessAuthRoute) {
            if (role === UserRole.ADMIN || role === UserRole.HR_OWNER || role === UserRole.HR_MEMBER) {
                return NextResponse.redirect(new URL('/dashboard', request.url));
            } else {
                return NextResponse.redirect(new URL('/apply', request.url));
            }
        }

        if (pathname.startsWith('/admin')) {
            if (role !== UserRole.ADMIN) {
                const fallbackUrl = (role === UserRole.HR_OWNER || role === UserRole.HR_MEMBER) ? '/dashboard' : '/apply';
                return NextResponse.redirect(new URL(fallbackUrl, request.url));
            }
            return NextResponse.next();
        }

        if (role === UserRole.ADMIN) {
            return NextResponse.next();
        }

        const hrOnlyRoutes = ['/dashboard', '/jobs', '/candidates', '/analytics', '/interviews', '/messages', '/settings'];
        const isTryingToAccessHrRoute = hrOnlyRoutes.some(r => pathname === r || pathname.startsWith(`${r}/`));

        if (role === UserRole.APPLICANT && isTryingToAccessHrRoute) {
            return NextResponse.redirect(new URL('/apply', request.url));
        }

        const isHrRole = role === UserRole.HR_OWNER || role === UserRole.HR_MEMBER;
        if (isHrRole && (pathname.startsWith('/apply') || pathname.startsWith('/my-applications'))) {
            return NextResponse.redirect(new URL('/dashboard', request.url));
        }

        return NextResponse.next();
    }

    return NextResponse.next();
}

export const config = {
    matcher: ['/((?!api|_next/static|_next/image|favicon.ico).*)'],
};
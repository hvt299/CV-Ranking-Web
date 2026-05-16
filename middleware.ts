import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';

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

    const isProtected = ['/dashboard', '/jobs', '/candidates', '/analytics', '/interviews', '/messages', '/settings', '/apply', '/my-applications', '/profile', '/help'].some(r => pathname === r || pathname.startsWith(`${r}/`));

    if (isProtected && !token) {
        return NextResponse.redirect(new URL('/login', request.url));
    }

    if (token) {
        const payload = decodeJWT(token);
        const role = payload?.role || 'applicant';

        if (role === 'admin') {
            return NextResponse.next();
        }

        const hrOnlyRoutes = ['/dashboard', '/jobs', '/candidates', '/analytics', '/interviews', '/messages', '/settings'];
        const isTryingToAccessHrRoute = hrOnlyRoutes.some(r => pathname === r || pathname.startsWith(`${r}/`));

        if (role === 'applicant' && isTryingToAccessHrRoute) {
            return NextResponse.redirect(new URL('/apply', request.url));
        }

        if (role === 'hr' && (pathname.startsWith('/apply') || pathname.startsWith('/my-applications'))) {
            return NextResponse.redirect(new URL('/dashboard', request.url));
        }
    }

    return NextResponse.next();
}

export const config = {
    matcher: ['/((?!api|_next/static|_next/image|favicon.ico).*)'],
};

import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';
import { jwtVerify } from 'jose';

// Paths that don't require authentication
const PUBLIC_PATHS = [
    '/login',
    '/api/auth/login',
    '/api/cron',        // Allow cron jobs
    '/api/admin',       // Allow admin operations
    '/api/test',
    '/favicon.ico',
    '/_next',
    '/static',
    '/images'           // Allow public images
];

export async function middleware(request: NextRequest) {
    const { pathname } = request.nextUrl;

    // 1. Check if public path
    const isPublic = PUBLIC_PATHS.some(path => pathname.startsWith(path));
    if (isPublic) {
        // If user is already logged in and tries to access /login, redirect to dashboard
        if (pathname === '/login') {
            const token = request.cookies.get('auth_token')?.value;
            if (token) {
                try {
                    const secret = new TextEncoder().encode(process.env.JWT_SECRET || 'fallback-secret-key-too-short-but-ok-for-dev');
                    await jwtVerify(token, secret);
                    return NextResponse.redirect(new URL('/', request.url));
                } catch (e) {
                    // Token invalid, stay on login
                }
            }
        }
        return NextResponse.next();
    }

    // 2. Protected path: Check for token
    const token = request.cookies.get('auth_token')?.value;

    if (!token) {
        // Redirect to login if no token
        const loginUrl = new URL('/login', request.url);
        // Optional: Add ?from=/current/path
        return NextResponse.redirect(loginUrl);
    }

    // 3. Verify token
    try {
        const secret = new TextEncoder().encode(process.env.JWT_SECRET || 'fallback-secret-key-too-short-but-ok-for-dev');
        await jwtVerify(token, secret);
        // Token is valid, allow access
        return NextResponse.next();
    } catch (error) {
        // Token invalid or expired
        console.error('Middleware auth error:', error);
        return NextResponse.redirect(new URL('/login', request.url));
    }
}

export const config = {
    matcher: [
        /*
         * Match all request paths except for the ones starting with:
         * - _next/static (static files)
         * - _next/image (image optimization files)
         * - favicon.ico (favicon file)
         */
        '/((?!_next/static|_next/image|favicon.ico).*)',
    ],
};

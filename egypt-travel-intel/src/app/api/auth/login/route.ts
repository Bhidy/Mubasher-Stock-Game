import { NextResponse } from 'next/server';
import { SignJWT } from 'jose';

export async function POST(request: Request) {
    try {
        const { email, password } = await request.json();

        const ADMIN_EMAIL = process.env.ADMIN_EMAIL;
        const ADMIN_PASSWORD = process.env.ADMIN_PASSWORD;
        const JWT_SECRET = process.env.JWT_SECRET || 'fallback-secret-key-too-short-but-ok-for-dev';

        // Check credentials (Env vars OR Hardcoded fallback for reliability)
        const isValid =
            (email === ADMIN_EMAIL && password === ADMIN_PASSWORD) ||
            (email === 'mohamedbhidy@gmail.com' && password === 'Atlas@2025');

        if (!isValid) {
            console.error(`Login failed for email: ${email}`); // Debug log
            return NextResponse.json(
                { error: 'Invalid email or password' },
                { status: 401 }
            );
        }

        // Generate JWT
        const secret = new TextEncoder().encode(JWT_SECRET);
        const token = await new SignJWT({ email, role: 'admin' })
            .setProtectedHeader({ alg: 'HS256' })
            .setIssuedAt()
            .setExpirationTime('24h') // Session lasts 24 hours
            .sign(secret);

        // Create response
        const response = NextResponse.json({ success: true });

        // Set secure HTTP-only cookie
        response.cookies.set({
            name: 'auth_token',
            value: token,
            httpOnly: true,
            secure: process.env.NODE_ENV === 'production',
            sameSite: 'lax',
            path: '/',
            maxAge: 60 * 60 * 24 // 24 hours
        });

        return response;

    } catch (error) {
        console.error('Login error:', error);
        return NextResponse.json(
            { error: 'Internal server error' },
            { status: 500 }
        );
    }
}

import { NextRequest, NextResponse } from 'next/server';
import prisma from '@/lib/db';

// POST /api/admin/add-accounts
// Body: { handles: string[] }
export async function POST(request: NextRequest) {
    try {
        const body = await request.json();
        const handles: string[] = body.handles || [];

        if (!handles.length) {
            return NextResponse.json({ error: 'No handles provided' }, { status: 400 });
        }

        const results = {
            added: [] as string[],
            skipped: [] as string[],
            errors: [] as { handle: string; error: string }[]
        };

        for (const handle of handles) {
            const cleanHandle = handle.trim().toLowerCase();
            if (!cleanHandle) continue;

            try {
                // Check if already exists
                const existing = await prisma.account.findUnique({
                    where: { handle: cleanHandle }
                });

                if (existing) {
                    results.skipped.push(cleanHandle);
                    continue;
                }

                // Create new account
                await prisma.account.create({
                    data: {
                        handle: cleanHandle,
                        displayName: cleanHandle,
                        profileUrl: `https://www.instagram.com/${cleanHandle}`,
                        isActive: true
                    }
                });
                results.added.push(cleanHandle);
            } catch (error: any) {
                if (error.code === 'P2002') {
                    results.skipped.push(cleanHandle);
                } else {
                    results.errors.push({ handle: cleanHandle, error: error.message });
                }
            }
        }

        // Get total count
        const totalAccounts = await prisma.account.count({ where: { isActive: true } });

        return NextResponse.json({
            success: true,
            summary: {
                requested: handles.length,
                added: results.added.length,
                skipped: results.skipped.length,
                errors: results.errors.length,
                totalActiveAccounts: totalAccounts
            },
            details: results
        });
    } catch (error: any) {
        console.error('Error adding accounts:', error);
        return NextResponse.json({ error: error.message }, { status: 500 });
    }
}

// GET /api/admin/add-accounts - List all accounts
export async function GET() {
    const accounts = await prisma.account.findMany({
        where: { isActive: true },
        orderBy: { createdAt: 'desc' },
        select: {
            handle: true,
            displayName: true,
            createdAt: true,
            _count: { select: { posts: true } }
        }
    });

    return NextResponse.json({
        total: accounts.length,
        accounts: accounts.map((a: { handle: string; displayName: string | null; createdAt: Date; _count: { posts: number } }) => ({
            handle: a.handle,
            displayName: a.displayName,
            postsCount: a._count.posts,
            createdAt: a.createdAt
        }))
    });
}

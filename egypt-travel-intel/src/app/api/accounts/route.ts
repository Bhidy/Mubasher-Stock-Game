import { NextResponse } from 'next/server';
import prisma from '@/lib/db';
import { runIngestion } from '@/lib/ingestion';

// GET all accounts
export async function GET() {
    try {
        const accounts = await prisma.account.findMany({
            orderBy: { handle: 'asc' },
            include: {
                _count: {
                    select: { posts: true },
                },
            },
        });

        const transformedAccounts = accounts.map(acc => ({
            id: acc.id,
            handle: acc.handle,
            displayName: acc.displayName,
            profileUrl: acc.profileUrl,
            isActive: acc.isActive,
            postsCount: acc._count.posts,
            createdAt: acc.createdAt,
            updatedAt: acc.updatedAt,
        }));

        return NextResponse.json({ accounts: transformedAccounts });
    } catch (error) {
        console.error('Accounts GET error:', error);
        return NextResponse.json(
            { error: 'Failed to fetch accounts' },
            { status: 500 }
        );
    }
}

// POST - Add new account
export async function POST(request: Request) {
    try {
        const body = await request.json();
        const { handle, displayName } = body;

        if (!handle) {
            return NextResponse.json(
                { error: 'Handle is required' },
                { status: 400 }
            );
        }

        // Clean handle (remove @ if present)
        const cleanHandle = handle.replace(/^@/, '').toLowerCase();

        // Check if already exists
        const existing = await prisma.account.findUnique({
            where: { handle: cleanHandle },
        });

        if (existing) {
            return NextResponse.json(
                { error: 'Account already exists' },
                { status: 409 }
            );
        }

        const account = await prisma.account.create({
            data: {
                handle: cleanHandle,
                displayName: displayName || cleanHandle,
                profileUrl: `https://instagram.com/${cleanHandle}`,
                isActive: true,
            },
        });

        // Trigger immediate ingestion to populate data
        try {
            console.log(`🚀 Triggering immediate ingestion for @${cleanHandle}`);
            await runIngestion({
                accountHandles: [cleanHandle],
                postsPerAccount: 100, // Try to fetch as much as possible from first page
            });
        } catch (ingestError) {
            console.error('Immediate ingestion failed:', ingestError);
            // We don't fail the request, just log it. The cron will pick it up later.
        }

        return NextResponse.json({ account }, { status: 201 });
    } catch (error) {
        console.error('Accounts POST error:', error);
        return NextResponse.json(
            { error: 'Failed to create account' },
            { status: 500 }
        );
    }
}

// PATCH - Update account (toggle active status)
export async function PATCH(request: Request) {
    try {
        const body = await request.json();
        const { id, isActive, displayName } = body;

        if (!id) {
            return NextResponse.json(
                { error: 'Account ID is required' },
                { status: 400 }
            );
        }

        const updateData: Record<string, unknown> = {};
        if (typeof isActive === 'boolean') updateData.isActive = isActive;
        if (displayName) updateData.displayName = displayName;

        const account = await prisma.account.update({
            where: { id },
            data: updateData,
        });

        return NextResponse.json({ account });
    } catch (error) {
        console.error('Accounts PATCH error:', error);
        return NextResponse.json(
            { error: 'Failed to update account' },
            { status: 500 }
        );
    }
}

// DELETE - Remove account
export async function DELETE(request: Request) {
    try {
        const { searchParams } = new URL(request.url);
        const id = searchParams.get('id');

        if (!id) {
            return NextResponse.json(
                { error: 'Account ID is required' },
                { status: 400 }
            );
        }

        await prisma.account.delete({
            where: { id },
        });

        return NextResponse.json({ success: true });
    } catch (error) {
        console.error('Accounts DELETE error:', error);
        return NextResponse.json(
            { error: 'Failed to delete account' },
            { status: 500 }
        );
    }
}

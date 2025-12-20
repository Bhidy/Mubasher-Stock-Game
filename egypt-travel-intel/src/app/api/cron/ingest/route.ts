import { NextResponse } from 'next/server';
import { runIngestion } from '@/lib/ingestion';

export const dynamic = 'force-dynamic';
export const maxDuration = 300; // 5 minutes

export async function GET(request: Request) {
    // --- GOO MODE SECURITY GATEKEEPER ---
    // Strictly block any request that doesn't have the Vercel Cron Secret.
    // This kills any "ghost" jobs or unauthorized external triggers.
    const authHeader = request.headers.get('authorization');
    if (process.env.CRON_SECRET && authHeader !== `Bearer ${process.env.CRON_SECRET}`) {
        console.warn('⛔ Unauthorized Cron Attempt Blocked. Missing or invalid secret.');
        return new NextResponse('Unauthorized', { status: 401 });
    }
    // -------------------------------------

    const { searchParams } = new URL(request.url);
    const type = searchParams.get('type') || 'pulse'; // 'pulse' (6h) or 'daily' (24h)

    console.log(`⏰ Cron triggered (Authenticated): Starting ${type} ingestion...`);

    try {
        const result = await runIngestion({
            postsPerAccount: type === 'daily' ? 50 : 20, // Example: deeper scan for daily
            dryRun: false,
            reportType: type as 'pulse' | 'daily'
        });

        // Notes: Email reporting is now automatically handled inside runIngestion

        return NextResponse.json({
            success: true,
            result
        });
    } catch (error) {
        console.error('Cron job failed:', error);
        return NextResponse.json(
            { error: 'Cron job failed', details: error instanceof Error ? error.message : 'Unknown error' },
            { status: 500 }
        );
    }
}

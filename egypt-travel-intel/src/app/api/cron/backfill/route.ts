
import { NextResponse } from 'next/server';
import { runIngestion } from '@/lib/ingestion/ingest';
import { PrismaClient } from '@prisma/client';

export const dynamic = 'force-dynamic';
export const maxDuration = 300; // 5 minutes max

const prisma = new PrismaClient();

export async function GET() {
    console.log('🕵️‍♂️ Starting Snipered Backfill Run...');

    try {
        // 1. Fetch all enabled accounts
        const accounts = await prisma.account.findMany({
            where: { isActive: true },
            select: { handle: true }
        });

        if (accounts.length === 0) {
            return NextResponse.json({ message: 'No accounts to backfill' });
        }

        // 2. Select ONE random account to "Snipe"
        // (In a perfect world we'd track "last_backfilled_at", but random is sufficient for rotation)
        const randomIndex = Math.floor(Math.random() * accounts.length);
        const targetAccount = accounts[randomIndex];

        console.log(`🎯 SNIPER TARGET LOCKED: @${targetAccount.handle}`);

        // 3. Run Deep Ingestion for THIS account only
        // We trick the ingestion engine to only process this one handle by filtering the DB query logic
        // But since runIngestion fetches ALL enabled accounts by default, we'll need to rely on
        // the fact that we can't easily filter strictly inside runIngestion without changing it.
        // 
        // INSTANT GOO MODE FIX: We will modify runIngestion to accept a "targetHandle" filter!
        // For now, we'll run the ingestion but pass a specific flag or just rely on the fact 
        // that we want to be CAREFUL. 

        // Actually, to truly "Snipe", we should update runIngestion to verify.
        // Let's pass a special option "specificHandle".

        const result = await runIngestion({
            postsPerAccount: 50, // Deep scan attempt (2-3 months)
            reportType: 'daily', // Use daily format for detail
            dryRun: false,
            accountHandles: [targetAccount.handle] // Focus fire on this one account
        });

        return NextResponse.json({
            success: true,
            target: targetAccount.handle,
            result
        });

    } catch (error) {
        console.error('❌ Backfill Snipe Failed:', error);
        return NextResponse.json(
            { error: 'Backfill failed', details: error instanceof Error ? error.message : 'Unknown error' },
            { status: 500 }
        );
    }
}

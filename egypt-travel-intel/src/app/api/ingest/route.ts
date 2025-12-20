import { NextResponse } from 'next/server';
import { runIngestion, getLatestIngestionLog } from '@/lib/ingestion';

// POST - Trigger ingestion
export async function POST(request: Request) {
    try {
        const body = await request.json().catch(() => ({}));
        const { accountHandles, postsPerAccount, dryRun } = body;

        console.log('🚀 Starting ingestion run...');

        const result = await runIngestion({
            accountHandles,
            postsPerAccount: postsPerAccount || 20,
            dryRun: dryRun || false,
        });

        console.log('✅ Ingestion complete:', result);

        return NextResponse.json({
            success: result.status !== 'failed',
            result,
        });
    } catch (error) {
        console.error('Ingest POST error:', error);
        return NextResponse.json(
            { error: 'Ingestion failed', details: error instanceof Error ? error.message : 'Unknown error' },
            { status: 500 }
        );
    }
}

// GET - Get latest ingestion status
export async function GET() {
    try {
        const latestLog = await getLatestIngestionLog();

        if (!latestLog) {
            return NextResponse.json({
                hasRun: false,
                message: 'No ingestion runs yet',
            });
        }

        return NextResponse.json({
            hasRun: true,
            latest: {
                id: latestLog.id,
                runAt: latestLog.runAt,
                accountsProcessed: latestLog.accountsProcessed,
                postsCollected: latestLog.postsCollected,
                offersDetected: latestLog.offersDetected,
                errors: latestLog.errors,
                duration: latestLog.duration,
                status: latestLog.status,
            },
        });
    } catch (error) {
        console.error('Ingest GET error:', error);
        return NextResponse.json(
            { error: 'Failed to fetch ingestion status' },
            { status: 500 }
        );
    }
}

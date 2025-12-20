/**
 * Scheduler Status API
 * 
 * Returns the current status of the automated ingestion scheduler.
 */

import { NextResponse } from 'next/server';
import { getSchedulerStatus } from '@/lib/scheduler';

export async function GET() {
    try {
        const status = getSchedulerStatus();

        return NextResponse.json({
            scheduler: {
                status: status.isRunning ? 'running' : 'idle',
                lastRun: status.lastRun,
                nextRun: status.nextRun,
                schedule: status.schedule,
                postsPerAccount: status.postsPerAccount,
            },
            message: status.isRunning
                ? 'Ingestion is currently running...'
                : `Next automatic ingestion at ${status.nextRun?.toLocaleString() || 'not scheduled'}`,
        });
    } catch (error) {
        console.error('Scheduler status error:', error);
        return NextResponse.json(
            { error: 'Failed to get scheduler status' },
            { status: 500 }
        );
    }
}

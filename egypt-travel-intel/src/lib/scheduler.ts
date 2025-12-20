/**
 * Automated Cron Scheduler for Instagram Ingestion
 * 
 * Runs data ingestion automatically on a schedule.
 * Default: Every 4 hours
 */

import cron from 'node-cron';
import { runIngestion } from '@/lib/ingestion';

const SCHEDULE = process.env.INGEST_SCHEDULE || '0 */6 * * *'; // Every 6 hours
const POSTS_PER_ACCOUNT = parseInt(process.env.POSTS_PER_ACCOUNT || '10', 10);

let isRunning = false;
let lastRun: Date | null = null;
let nextRun: Date | null = null;

export function startScheduler() {
    console.log(`📅 Starting automated ingestion scheduler`);
    console.log(`   Schedule: ${SCHEDULE} (every 4 hours by default)`);
    console.log(`   Posts per account: ${POSTS_PER_ACCOUNT}`);

    // Calculate next run time
    updateNextRun();

    const task = cron.schedule(SCHEDULE, async () => {
        if (isRunning) {
            console.log('⏭️ Skipping scheduled run - previous ingestion still running');
            return;
        }

        console.log(`\n🔄 [${new Date().toISOString()}] Starting scheduled ingestion...`);
        isRunning = true;

        try {
            const result = await runIngestion({
                postsPerAccount: POSTS_PER_ACCOUNT,
            });

            lastRun = new Date();
            console.log(`✅ Scheduled ingestion complete: ${result.postsCollected} posts, ${result.offersDetected} offers`);
        } catch (error) {
            console.error('❌ Scheduled ingestion failed:', error);
        } finally {
            isRunning = false;
            updateNextRun();
        }
    });

    console.log(`✅ Scheduler started - next run at: ${nextRun?.toLocaleString() || 'calculating...'}`);

    return task;
}

function updateNextRun() {
    // Calculate next cron execution time
    const now = new Date();
    const hours = now.getHours();
    const nextHour = Math.ceil((hours + 1) / 4) * 4;

    nextRun = new Date(now);
    nextRun.setHours(nextHour % 24, 0, 0, 0);

    if (nextRun <= now) {
        nextRun.setDate(nextRun.getDate() + 1);
    }
}

export function getSchedulerStatus() {
    return {
        isRunning,
        lastRun,
        nextRun,
        schedule: SCHEDULE,
        postsPerAccount: POSTS_PER_ACCOUNT,
    };
}

// Run initial ingestion on startup if database is empty
export async function runInitialIngestionIfNeeded() {
    try {
        // Dynamic import to avoid circular dependencies
        const { PrismaClient } = await import('@prisma/client');
        const prisma = new PrismaClient();

        const postCount = await prisma.rawPost.count();
        await prisma.$disconnect();

        if (postCount === 0) {
            console.log('📥 Database empty - running initial ingestion...');
            isRunning = true;

            const result = await runIngestion({
                postsPerAccount: POSTS_PER_ACCOUNT,
            });

            lastRun = new Date();
            isRunning = false;

            console.log(`✅ Initial ingestion complete: ${result.postsCollected} posts, ${result.offersDetected} offers`);
            return result;
        } else {
            console.log(`📊 Database has ${postCount} posts - skipping initial ingestion`);
        }
    } catch (error) {
        console.error('❌ Initial ingestion check failed:', error);
        isRunning = false;
    }
    return null;
}

import { NextResponse } from 'next/server';
import prisma from '@/lib/db';

export const dynamic = 'force-dynamic';

/**
 * Admin Status Report API
 * GET /api/admin/status
 * 
 * Returns comprehensive status of posts, offers, and ingestion logs
 */
export async function GET() {
    try {
        const now = new Date();
        const eightHoursAgo = new Date(now.getTime() - 8 * 60 * 60 * 1000);
        const twentyFourHoursAgo = new Date(now.getTime() - 24 * 60 * 60 * 1000);

        // Get ingestion logs from last 24 hours
        const recentLogs = await prisma.ingestionLog.findMany({
            where: {
                runAt: { gte: twentyFourHoursAgo }
            },
            orderBy: { runAt: 'desc' },
        });

        // Get total counts
        const [totalPosts, totalOffers, totalAccounts, activeAccounts] = await Promise.all([
            prisma.rawPost.count(),
            prisma.offer.count(),
            prisma.account.count(),
            prisma.account.count({ where: { isActive: true } }),
        ]);

        // Get offers with prices
        const offersWithPrice = await prisma.offer.count({
            where: { priceDetected: { not: null } }
        });

        // Get recent posts (last 8 hours)
        const recentPosts = await prisma.rawPost.count({
            where: { scrapedAt: { gte: eightHoursAgo } }
        });

        // Get recent offers (last 8 hours)
        const recentOffers = await prisma.offer.count({
            where: { createdAt: { gte: eightHoursAgo } }
        });

        // Get top destinations
        const destinations = await prisma.offer.groupBy({
            by: ['destinationDetected'],
            _count: { id: true },
            where: { destinationDetected: { not: null } },
            orderBy: { _count: { id: 'desc' } },
            take: 10,
        });

        // Get posts by account
        const accountStats = await prisma.account.findMany({
            where: { isActive: true },
            select: {
                handle: true,
                displayName: true,
                _count: {
                    select: { posts: true }
                }
            },
            orderBy: { posts: { _count: 'desc' } },
            take: 10,
        });

        // Format logs
        const formattedLogs = recentLogs.map(log => ({
            id: log.id,
            runAt: log.runAt,
            status: log.status,
            accountsProcessed: log.accountsProcessed,
            postsCollected: log.postsCollected,
            offersDetected: log.offersDetected,
            duration: `${Math.round((log.duration || 0) / 1000)}s`,
            errorsCount: JSON.parse(log.errors || '[]').length,
            emailStatus: log.emailStatus,
            emailSentAt: log.emailSentAt,
        }));

        return NextResponse.json({
            timestamp: now.toISOString(),
            period: 'Last 8 hours',

            // Summary Stats
            totals: {
                posts: totalPosts,
                offers: totalOffers,
                accounts: totalAccounts,
                activeAccounts,
                offersWithPrice,
                priceDetectionRate: `${Math.round((offersWithPrice / totalOffers) * 100)}%`,
            },

            // Recent Activity
            recent8h: {
                postsScraped: recentPosts,
                offersCreated: recentOffers,
            },

            // Ingestion Runs (last 24h)
            ingestionRuns: {
                count: recentLogs.length,
                logs: formattedLogs,
                totalPostsCollected: recentLogs.reduce((sum, log) => sum + (log.postsCollected || 0), 0),
                totalOffersDetected: recentLogs.reduce((sum, log) => sum + (log.offersDetected || 0), 0),
            },

            // Top Sources
            topSources: accountStats.map(a => ({
                handle: a.handle,
                name: a.displayName,
                posts: a._count.posts,
            })),

            // Top Destinations
            topDestinations: destinations.map(d => ({
                name: d.destinationDetected,
                count: d._count.id,
            })),
        });
    } catch (error) {
        console.error('Status API error:', error);
        return NextResponse.json({
            error: error instanceof Error ? error.message : 'Unknown error'
        }, { status: 500 });
    }
}

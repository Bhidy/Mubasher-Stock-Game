import { NextResponse } from 'next/server';
import prisma from '@/lib/db';
import { getIngestionStats } from '@/lib/ingestion';

export async function GET(request: Request) {
    try {
        const { searchParams } = new URL(request.url);
        const dateFromStr = searchParams.get('dateFrom');
        let dateFilter: any = {};

        if (dateFromStr) {
            dateFilter = {
                createdAt: {
                    gte: new Date(dateFromStr)
                }
            };
        }

        // Get basic stats (counts need to be filtered too if possible, but ingestionStats is usually total)
        // For Filtered Total Counts, we must run separate queries, we can't rely on getIngestionStats() for filtered totals
        // Enforce active accounts globally
        const activeAccountWhere = { account: { isActive: true } };
        const activeOfferWhere = { rawPost: { account: { isActive: true } } };

        // Get basic stats
        const [totalPosts, totalOffers, activeAccounts, latestLog] = await Promise.all([
            prisma.rawPost.count({
                where: {
                    ...(dateFromStr ? { scrapedAt: { gte: new Date(dateFromStr) } } : {}),
                    ...activeAccountWhere
                }
            }),
            prisma.offer.count({
                where: {
                    ...dateFilter,
                    ...activeOfferWhere
                }
            }),
            prisma.account.count({ where: { isActive: true } }),
            getIngestionStats().then(s => s.lastSync)
        ]);

        const baseWhere = { isOffer: true, ...dateFilter, ...activeOfferWhere };

        // Get destination distribution (ALL destinations)
        const destinationStats = await prisma.offer.groupBy({
            by: ['destinationDetected'],
            where: { ...baseWhere, destinationDetected: { not: null } },
            _count: { id: true },
            orderBy: { _count: { id: 'desc' } },
        });

        // Get offer type distribution
        const offerTypeStats = await prisma.offer.groupBy({
            by: ['offerType'],
            where: { ...baseWhere, offerType: { not: null } },
            _count: { id: true },
            orderBy: { _count: { id: 'desc' } },
        });

        // Get agency leaderboard (by Engagement)
        const agencyStats = await prisma.rawPost.groupBy({
            by: ['accountHandle'],
            where: { ...(dateFromStr ? { scrapedAt: { gte: new Date(dateFromStr) } } : {}), ...activeAccountWhere },
            _count: { id: true },
            _sum: { likesCount: true, commentsCount: true },
            orderBy: {
                _sum: { likesCount: 'desc' }
            },
            take: 10,
        });

        // Get price stats
        const priceStats = await prisma.offer.aggregate({
            where: {
                ...baseWhere,
                priceDetected: { not: null }
            },
            _avg: { priceDetected: true },
            _min: { priceDetected: true },
            _max: { priceDetected: true },
            _count: { priceDetected: true }
        });

        // Get recent logs
        const recentLogs = await prisma.ingestionLog.findMany({
            take: 5,
            orderBy: { runAt: 'desc' }
        });

        return NextResponse.json({
            overview: {
                totalPosts,
                totalOffers,
                activeAccounts,
                activeDestinations: destinationStats.length,
                lastSync: latestLog,
            },
            destinations: destinationStats.map(d => ({
                name: d.destinationDetected || 'Unspecified',
                count: d._count.id,
            })),
            offerTypes: offerTypeStats.map(t => ({
                type: t.offerType || 'general',
                count: t._count.id,
            })),
            agencies: agencyStats.map(a => ({
                handle: a.accountHandle,
                postsCount: a._count.id || 0,
                likes: a._sum.likesCount || 0,
                comments: a._sum.commentsCount || 0
            })),
            pricing: {
                avgPrice: Math.round(priceStats._avg.priceDetected || 0),
                minPrice: priceStats._min.priceDetected,
                maxPrice: priceStats._max.priceDetected,
                offersWithPrice: priceStats._count.priceDetected,
                currency: 'EGP',
            },
            recentLogs: recentLogs.map(log => ({
                id: log.id,
                runAt: log.runAt,
                status: log.status,
                postsCollected: log.postsCollected,
                offersDetected: log.offersDetected,
                duration: log.duration,
                errorsCount: JSON.parse(log.errors || '[]').length,
            })),
        });
    } catch (error) {
        console.error('Stats API error:', error);
        return NextResponse.json(
            { error: 'Failed to fetch stats' },
            { status: 500 }
        );
    }
}

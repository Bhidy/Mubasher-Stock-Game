/**
 * Competitors API
 * 
 * Returns deep analytics per competitor agency.
 */

import { NextResponse } from 'next/server';
import prisma from '@/lib/db';

export async function GET() {
    try {
        // Get all accounts with their stats
        const accounts = await prisma.account.findMany({
            where: { isActive: true },
            include: {
                posts: {
                    include: {
                        offer: true,
                    },
                },
            },
            orderBy: { handle: 'asc' },
        });

        const competitors = accounts.map(account => {
            const offers = account.posts
                .filter(post => post.offer?.isOffer)
                .map(post => post.offer!);

            // Calculate stats
            const pricesWithValues = offers
                .map(o => o.priceDetected)
                .filter((p): p is number => p !== null);

            const avgPrice = pricesWithValues.length > 0
                ? pricesWithValues.reduce((a, b) => a + b, 0) / pricesWithValues.length
                : null;

            // Top destinations
            const destCounts: Record<string, number> = {};
            offers.forEach(o => {
                if (o.destinationDetected) {
                    destCounts[o.destinationDetected] = (destCounts[o.destinationDetected] || 0) + 1;
                }
            });
            const topDestinations = Object.entries(destCounts)
                .map(([name, count]) => ({ name, count }))
                .sort((a, b) => b.count - a.count)
                .slice(0, 5);

            // Top offer types
            const typeCounts: Record<string, number> = {};
            offers.forEach(o => {
                if (o.offerType) {
                    typeCounts[o.offerType] = (typeCounts[o.offerType] || 0) + 1;
                }
            });
            const topOfferTypes = Object.entries(typeCounts)
                .map(([type, count]) => ({ type, count }))
                .sort((a, b) => b.count - a.count)
                .slice(0, 3);

            // Hotels used
            const hotels = [...new Set(
                offers
                    .map(o => o.hotelDetected)
                    .filter((h): h is string => h !== null)
            )];

            // Outbound ratio
            const outboundCount = offers.filter(o => o.destinationType === 'outbound').length;
            const outboundRatio = offers.length > 0 ? outboundCount / offers.length : 0;

            // Recent activity (last 7 days)
            const weekAgo = new Date(Date.now() - 7 * 24 * 60 * 60 * 1000);
            const recentActivity = account.posts.filter(p =>
                new Date(p.scrapedAt) > weekAgo
            ).length;

            return {
                id: account.id,
                isActive: account.isActive,
                handle: account.handle,
                displayName: account.displayName,
                profileUrl: account.profileUrl,
                totalPosts: account.posts.length,
                totalOffers: offers.length,
                avgPrice,
                topDestinations,
                topOfferTypes,
                hotels,
                outboundRatio,
                recentActivity,
                priceRange: {
                    min: pricesWithValues.length > 0 ? Math.min(...pricesWithValues) : null,
                    max: pricesWithValues.length > 0 ? Math.max(...pricesWithValues) : null,
                },
            };
        });

        // Sort by total offers descending
        competitors.sort((a, b) => b.totalOffers - a.totalOffers);

        return NextResponse.json({ competitors });
    } catch (error) {
        console.error('Competitors API error:', error);
        return NextResponse.json(
            { error: 'Failed to fetch competitors' },
            { status: 500 }
        );
    }
}

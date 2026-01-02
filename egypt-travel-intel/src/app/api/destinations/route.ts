/**
 * Destinations API
 * 
 * Returns all destinations with market intelligence.
 */

import { NextResponse } from 'next/server';
import prisma from '@/lib/db';

export async function GET() {
    try {
        const offers = await prisma.offer.findMany({
            where: {
                isOffer: true,
                rawPost: { account: { isActive: true } }
            },
            include: {
                rawPost: {
                    select: {
                        accountHandle: true,
                        scrapedAt: true,
                    },
                },
            },
        });

        // Group by destination
        const destMap: Record<string, {
            type: 'inbound' | 'outbound';
            offers: typeof offers;
        }> = {};

        offers.forEach(offer => {
            if (!offer.destinationDetected) return;

            if (!destMap[offer.destinationDetected]) {
                destMap[offer.destinationDetected] = {
                    type: (offer.destinationType as 'inbound' | 'outbound') || 'inbound',
                    offers: [],
                };
            }
            destMap[offer.destinationDetected].offers.push(offer);
        });

        const weekAgo = new Date(Date.now() - 7 * 24 * 60 * 60 * 1000);
        const twoWeeksAgo = new Date(Date.now() - 14 * 24 * 60 * 60 * 1000);

        const destinations = Object.entries(destMap).map(([name, data]) => {
            const prices = data.offers
                .map(o => o.priceDetected)
                .filter((p): p is number => p !== null);

            // Top agencies
            const agencyCounts: Record<string, number> = {};
            data.offers.forEach(o => {
                const handle = o.rawPost.accountHandle;
                agencyCounts[handle] = (agencyCounts[handle] || 0) + 1;
            });
            const topAgencies = Object.entries(agencyCounts)
                .sort((a, b) => b[1] - a[1])
                .slice(0, 5)
                .map(([handle]) => handle);

            // Top hotels
            const hotels = [...new Set(
                data.offers.map(o => o.hotelDetected).filter((h): h is string => !!h)
            )];

            // Top offer types
            const offerTypes = [...new Set(
                data.offers.map(o => o.offerType).filter((t): t is string => !!t)
            )];

            // Trend calculation
            const recentCount = data.offers.filter(o =>
                new Date(o.rawPost.scrapedAt) > weekAgo
            ).length;
            const previousCount = data.offers.filter(o => {
                const date = new Date(o.rawPost.scrapedAt);
                return date > twoWeeksAgo && date <= weekAgo;
            }).length;

            let trend: 'up' | 'down' | 'stable' = 'stable';
            let trendPercentage = 0;
            if (previousCount > 0) {
                const change = ((recentCount - previousCount) / previousCount) * 100;
                trendPercentage = Math.abs(Math.round(change));
                trend = change > 10 ? 'up' : change < -10 ? 'down' : 'stable';
            } else if (recentCount > 0) {
                trend = 'up';
                trendPercentage = 100;
            }

            return {
                name,
                type: data.type,
                offerCount: data.offers.length,
                avgPrice: prices.length > 0 ? prices.reduce((a, b) => a + b, 0) / prices.length : null,
                minPrice: prices.length > 0 ? Math.min(...prices) : null,
                maxPrice: prices.length > 0 ? Math.max(...prices) : null,
                topAgencies,
                topHotels: hotels.slice(0, 3),
                topOfferTypes: offerTypes.slice(0, 3),
                trend,
                trendPercentage,
            };
        });

        // Sort by offer count
        destinations.sort((a, b) => b.offerCount - a.offerCount);

        return NextResponse.json({ destinations });
    } catch (error) {
        console.error('Destinations API error:', error);
        return NextResponse.json(
            { error: 'Failed to fetch destinations' },
            { status: 500 }
        );
    }
}

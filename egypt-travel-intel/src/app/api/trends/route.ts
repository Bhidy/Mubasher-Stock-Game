/**
 * Trends API
 * 
 * Returns market trends and insights.
 */

import { NextResponse } from 'next/server';
import prisma from '@/lib/db';

export async function GET() {
    try {
        const weekAgo = new Date(Date.now() - 7 * 24 * 60 * 60 * 1000);
        const twoWeeksAgo = new Date(Date.now() - 14 * 24 * 60 * 60 * 1000);

        const offers = await prisma.offer.findMany({
            where: {
                isOffer: true,
                rawPost: { account: { isActive: true } }
            },
            include: {
                rawPost: {
                    select: {
                        scrapedAt: true,
                    },
                },
            },
        });

        // Hot destinations with growth
        const destMap: Record<string, {
            type: 'inbound' | 'outbound';
            current: number;
            previous: number;
            total: number;
        }> = {};

        offers.forEach(offer => {
            if (!offer.destinationDetected) return;
            const dest = offer.destinationDetected;
            if (!destMap[dest]) {
                destMap[dest] = {
                    type: (offer.destinationType as 'inbound' | 'outbound') || 'inbound',
                    current: 0,
                    previous: 0,
                    total: 0,
                };
            }
            destMap[dest].total++;
            const date = new Date(offer.rawPost.scrapedAt);
            if (date > weekAgo) destMap[dest].current++;
            else if (date > twoWeeksAgo) destMap[dest].previous++;
        });

        const hotDestinations = Object.entries(destMap)
            .map(([name, data]) => ({
                name,
                type: data.type,
                offerCount: data.total,
                growth: data.previous > 0
                    ? Math.round(((data.current - data.previous) / data.previous) * 100)
                    : data.current > 0 ? 100 : 0,
            }))
            .sort((a, b) => b.growth - a.growth || b.offerCount - a.offerCount)
            .slice(0, 10);

        // Hot offer types
        const typeMap: Record<string, { current: number; previous: number; total: number }> = {};
        offers.forEach(offer => {
            if (!offer.offerType) return;
            if (!typeMap[offer.offerType]) {
                typeMap[offer.offerType] = { current: 0, previous: 0, total: 0 };
            }
            typeMap[offer.offerType].total++;
            const date = new Date(offer.rawPost.scrapedAt);
            if (date > weekAgo) typeMap[offer.offerType].current++;
            else if (date > twoWeeksAgo) typeMap[offer.offerType].previous++;
        });

        const hotOfferTypes = Object.entries(typeMap)
            .map(([type, data]) => ({
                type,
                count: data.total,
                growth: data.previous > 0
                    ? Math.round(((data.current - data.previous) / data.previous) * 100)
                    : 0,
            }))
            .sort((a, b) => b.count - a.count)
            .slice(0, 8);

        // Hot hotels
        const hotelMap: Record<string, { count: number; destinations: Set<string> }> = {};
        offers.forEach(offer => {
            if (!offer.hotelDetected) return;
            if (!hotelMap[offer.hotelDetected]) {
                hotelMap[offer.hotelDetected] = { count: 0, destinations: new Set() };
            }
            hotelMap[offer.hotelDetected].count++;
            if (offer.destinationDetected) {
                hotelMap[offer.hotelDetected].destinations.add(offer.destinationDetected);
            }
        });

        const hotHotels = Object.entries(hotelMap)
            .map(([name, data]) => ({
                name,
                count: data.count,
                destinations: [...data.destinations].slice(0, 3),
            }))
            .sort((a, b) => b.count - a.count)
            .slice(0, 8);

        // Market insights
        const prices = offers
            .map(o => o.priceDetected)
            .filter((p): p is number => p !== null);

        const avgPrice = prices.length > 0
            ? prices.reduce((a, b) => a + b, 0) / prices.length
            : 0;

        const outboundCount = offers.filter(o => o.destinationType === 'outbound').length;
        const outboundShare = offers.length > 0 ? outboundCount / offers.length : 0;

        // Determine top price range
        const priceRanges = { 'Under 5K': 0, '5K-10K': 0, '10K-20K': 0, '20K+': 0 };
        prices.forEach(p => {
            if (p < 5000) priceRanges['Under 5K']++;
            else if (p < 10000) priceRanges['5K-10K']++;
            else if (p < 20000) priceRanges['10K-20K']++;
            else priceRanges['20K+']++;
        });
        const topPriceRange = Object.entries(priceRanges)
            .sort((a, b) => b[1] - a[1])[0]?.[0] || 'N/A';

        return NextResponse.json({
            hotDestinations,
            hotOfferTypes,
            hotHotels,
            marketInsights: {
                totalOffers: offers.length,
                avgPrice,
                outboundShare,
                topPriceRange,
            },
            weeklyActivity: [], // Could be expanded
        });
    } catch (error) {
        console.error('Trends API error:', error);
        return NextResponse.json(
            { error: 'Failed to fetch trends' },
            { status: 500 }
        );
    }
}

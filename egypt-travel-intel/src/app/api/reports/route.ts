/**
 * Reports API
 * 
 * Generate exportable reports.
 */

import { NextResponse } from 'next/server';
import prisma from '@/lib/db';

export async function GET(request: Request) {
    try {
        const { searchParams } = new URL(request.url);
        const type = searchParams.get('type') || 'market_overview';

        // Fetch all data
        const [offers, accounts, posts] = await Promise.all([
            prisma.offer.findMany({
                where: {
                    isOffer: true,
                    rawPost: { account: { isActive: true } },
                },
                include: {
                    rawPost: {
                        select: {
                            accountHandle: true,
                            postUrl: true,
                            postTimestamp: true,
                        },
                    },
                },
            }),
            prisma.account.findMany({ where: { isActive: true } }),
            prisma.rawPost.count({ where: { account: { isActive: true } } }),
        ]);

        const generatedAt = new Date().toISOString();

        if (type === 'market_overview') {
            // Aggregate stats
            const destinations: Record<string, number> = {};
            const offerTypes: Record<string, number> = {};
            const prices = offers.map(o => o.priceDetected).filter((p): p is number => p !== null);

            offers.forEach(o => {
                if (o.destinationDetected) {
                    destinations[o.destinationDetected] = (destinations[o.destinationDetected] || 0) + 1;
                }
                if (o.offerType) {
                    offerTypes[o.offerType] = (offerTypes[o.offerType] || 0) + 1;
                }
            });

            return NextResponse.json({
                reportType: 'Market Overview',
                generatedAt,
                summary: {
                    totalAgencies: accounts.length,
                    totalPosts: posts,
                    totalOffers: offers.length,
                    averagePrice: prices.length > 0 ? Math.round(prices.reduce((a, b) => a + b, 0) / prices.length) : 0,
                    priceRange: prices.length > 0 ? { min: Math.min(...prices), max: Math.max(...prices) } : null,
                },
                topDestinations: Object.entries(destinations)
                    .sort((a, b) => b[1] - a[1])
                    .slice(0, 10)
                    .map(([name, count]) => ({ name, count })),
                offerTypeDistribution: Object.entries(offerTypes)
                    .sort((a, b) => b[1] - a[1])
                    .map(([type, count]) => ({ type, count })),
                allOffers: offers.map(o => ({
                    agency: o.rawPost.accountHandle,
                    destination: o.destinationDetected,
                    type: o.offerType,
                    price: o.priceDetected,
                    currency: o.currencyDetected,
                    hotel: o.hotelDetected,
                    boardType: o.boardType,
                    duration: o.durationDetected,
                    postUrl: o.rawPost.postUrl,
                })),
            });
        }

        if (type === 'competitor_analysis') {
            const byAgency: Record<string, typeof offers> = {};
            offers.forEach(o => {
                const handle = o.rawPost.accountHandle;
                if (!byAgency[handle]) byAgency[handle] = [];
                byAgency[handle].push(o);
            });

            return NextResponse.json({
                reportType: 'Competitor Analysis',
                generatedAt,
                competitors: Object.entries(byAgency).map(([handle, agencyOffers]) => {
                    const prices = agencyOffers.map(o => o.priceDetected).filter((p): p is number => p !== null);
                    const destinations = [...new Set(agencyOffers.map(o => o.destinationDetected).filter(Boolean))];
                    const hotels = [...new Set(agencyOffers.map(o => o.hotelDetected).filter(Boolean))];

                    return {
                        handle,
                        offerCount: agencyOffers.length,
                        averagePrice: prices.length > 0 ? Math.round(prices.reduce((a, b) => a + b, 0) / prices.length) : null,
                        destinations,
                        hotels,
                        offers: agencyOffers.map(o => ({
                            destination: o.destinationDetected,
                            price: o.priceDetected,
                            type: o.offerType,
                            hotel: o.hotelDetected,
                        })),
                    };
                }).sort((a, b) => b.offerCount - a.offerCount),
            });
        }

        if (type === 'destination_report') {
            const byDest: Record<string, typeof offers> = {};
            offers.forEach(o => {
                if (!o.destinationDetected) return;
                if (!byDest[o.destinationDetected]) byDest[o.destinationDetected] = [];
                byDest[o.destinationDetected].push(o);
            });

            return NextResponse.json({
                reportType: 'Destination Report',
                generatedAt,
                destinations: Object.entries(byDest).map(([name, destOffers]) => {
                    const prices = destOffers.map(o => o.priceDetected).filter((p): p is number => p !== null);
                    const agencies = [...new Set(destOffers.map(o => o.rawPost.accountHandle))];
                    const hotels = [...new Set(destOffers.map(o => o.hotelDetected).filter(Boolean))];

                    return {
                        name,
                        offerCount: destOffers.length,
                        averagePrice: prices.length > 0 ? Math.round(prices.reduce((a, b) => a + b, 0) / prices.length) : null,
                        priceRange: prices.length > 0 ? { min: Math.min(...prices), max: Math.max(...prices) } : null,
                        agencyCount: agencies.length,
                        agencies,
                        hotels,
                    };
                }).sort((a, b) => b.offerCount - a.offerCount),
            });
        }

        if (type === 'price_comparison') {
            const byDest: Record<string, number[]> = {};
            offers.forEach(o => {
                if (!o.destinationDetected || !o.priceDetected) return;
                if (!byDest[o.destinationDetected]) byDest[o.destinationDetected] = [];
                byDest[o.destinationDetected].push(o.priceDetected);
            });

            return NextResponse.json({
                reportType: 'Price Comparison',
                generatedAt,
                pricesByDestination: Object.entries(byDest)
                    .map(([destination, prices]) => ({
                        destination,
                        offerCount: prices.length,
                        minPrice: Math.min(...prices),
                        maxPrice: Math.max(...prices),
                        avgPrice: Math.round(prices.reduce((a, b) => a + b, 0) / prices.length),
                    }))
                    .sort((a, b) => b.offerCount - a.offerCount),
            });
        }

        return NextResponse.json({ error: 'Unknown report type' }, { status: 400 });
    } catch (error) {
        console.error('Reports API error:', error);
        return NextResponse.json(
            { error: 'Failed to generate report' },
            { status: 500 }
        );
    }
}

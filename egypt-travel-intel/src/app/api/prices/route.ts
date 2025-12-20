/**
 * Prices API
 * 
 * Returns price data with week-over-week changes and alerts.
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
                priceDetected: { not: null },
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
            currentPrices: number[];
            previousPrices: number[];
            allPrices: number[];
            offerCount: number;
        }> = {};

        const alerts: Array<{
            id: string;
            destination: string;
            type: 'drop' | 'increase';
            percentage: number;
            agency: string;
            price: number;
            timestamp: string;
        }> = [];

        offers.forEach(offer => {
            if (!offer.destinationDetected || !offer.priceDetected) return;

            const dest = offer.destinationDetected;
            if (!destMap[dest]) {
                destMap[dest] = {
                    type: (offer.destinationType as 'inbound' | 'outbound') || 'inbound',
                    currentPrices: [],
                    previousPrices: [],
                    allPrices: [],
                    offerCount: 0,
                };
            }

            destMap[dest].allPrices.push(offer.priceDetected);
            destMap[dest].offerCount++;

            const scrapedDate = new Date(offer.rawPost.scrapedAt);
            if (scrapedDate > weekAgo) {
                destMap[dest].currentPrices.push(offer.priceDetected);
            } else if (scrapedDate > twoWeeksAgo) {
                destMap[dest].previousPrices.push(offer.priceDetected);
            }
        });

        const prices = Object.entries(destMap).map(([destination, data]) => {
            const currentAvg = data.currentPrices.length > 0
                ? data.currentPrices.reduce((a, b) => a + b, 0) / data.currentPrices.length
                : data.allPrices.reduce((a, b) => a + b, 0) / data.allPrices.length;

            const previousAvg = data.previousPrices.length > 0
                ? data.previousPrices.reduce((a, b) => a + b, 0) / data.previousPrices.length
                : currentAvg;

            const change = currentAvg - previousAvg;
            const changePercent = previousAvg > 0
                ? Math.round(((currentAvg - previousAvg) / previousAvg) * 100)
                : 0;

            // Generate alert for significant changes
            if (Math.abs(changePercent) >= 15) {
                alerts.push({
                    id: `alert-${destination}`,
                    destination,
                    type: changePercent < 0 ? 'drop' : 'increase',
                    percentage: Math.abs(changePercent),
                    agency: 'Market',
                    price: Math.round(currentAvg),
                    timestamp: 'This week',
                });
            }

            return {
                destination,
                type: data.type,
                currentAvg,
                previousAvg,
                change,
                changePercent,
                minPrice: Math.min(...data.allPrices),
                maxPrice: Math.max(...data.allPrices),
                offerCount: data.offerCount,
                priceHistory: [], // Could be expanded with historical data
            };
        });

        // Sort by absolute change percentage
        prices.sort((a, b) => Math.abs(b.changePercent) - Math.abs(a.changePercent));

        return NextResponse.json({ prices, alerts });
    } catch (error) {
        console.error('Prices API error:', error);
        return NextResponse.json(
            { error: 'Failed to fetch prices' },
            { status: 500 }
        );
    }
}

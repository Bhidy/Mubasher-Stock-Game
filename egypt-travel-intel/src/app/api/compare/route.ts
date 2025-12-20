/**
 * Compare API
 * 
 * Compare user's offers against market data.
 */

import { NextResponse } from 'next/server';
import prisma from '@/lib/db';

interface UserOffer {
    id: string;
    destination: string;
    price: number;
}

export async function POST(request: Request) {
    try {
        const body = await request.json();
        const userOffers = body.offers as UserOffer[];

        if (!userOffers || userOffers.length === 0) {
            return NextResponse.json({ comparisons: {} });
        }

        // Fetch all offers for comparison
        const marketOffers = await prisma.offer.findMany({
            where: {
                isOffer: true,
                priceDetected: { not: null },
            },
            select: {
                destinationDetected: true,
                priceDetected: true,
            },
        });

        // Group market offers by destination
        const marketByDest: Record<string, number[]> = {};
        marketOffers.forEach(offer => {
            if (!offer.destinationDetected || !offer.priceDetected) return;
            const dest = offer.destinationDetected.toLowerCase();
            if (!marketByDest[dest]) {
                marketByDest[dest] = [];
            }
            marketByDest[dest].push(offer.priceDetected);
        });

        // Compare each user offer
        const comparisons: Record<string, {
            marketAvg: number;
            marketMin: number;
            marketMax: number;
            position: 'below' | 'average' | 'above';
            percentDiff: number;
            competitorCount: number;
            recommendation: string;
        }> = {};

        userOffers.forEach(userOffer => {
            const destKey = userOffer.destination.toLowerCase();

            // Find matching destination (fuzzy match)
            let matchedPrices: number[] = [];
            Object.entries(marketByDest).forEach(([dest, prices]) => {
                if (dest.includes(destKey) || destKey.includes(dest)) {
                    matchedPrices = [...matchedPrices, ...prices];
                }
            });

            if (matchedPrices.length === 0) {
                // No market data for this destination
                return;
            }

            const marketAvg = matchedPrices.reduce((a, b) => a + b, 0) / matchedPrices.length;
            const marketMin = Math.min(...matchedPrices);
            const marketMax = Math.max(...matchedPrices);

            const percentDiff = Math.round(((userOffer.price - marketAvg) / marketAvg) * 100);

            let position: 'below' | 'average' | 'above';
            let recommendation: string;

            if (percentDiff <= -10) {
                position = 'below';
                recommendation = 'Great competitive pricing! You\'re below market average.';
            } else if (percentDiff >= 10) {
                position = 'above';
                recommendation = 'Consider adding value (extras, upgrades) to justify the premium.';
            } else {
                position = 'average';
                recommendation = 'Your price is aligned with market rates.';
            }

            comparisons[userOffer.id] = {
                marketAvg,
                marketMin,
                marketMax,
                position,
                percentDiff,
                competitorCount: matchedPrices.length,
                recommendation,
            };
        });

        return NextResponse.json({ comparisons });
    } catch (error) {
        console.error('Compare API error:', error);
        return NextResponse.json(
            { error: 'Failed to compare offers' },
            { status: 500 }
        );
    }
}

import { NextResponse } from 'next/server';
import prisma from '@/lib/db';
import { analyzeImageWithGemini } from '@/lib/vision';
import { detectOffer, mergeDetectionWithVision } from '@/lib/ingestion/detector';

export const dynamic = 'force-dynamic';
export const maxDuration = 300; // 5 minutes

/**
 * Backfill Vision Analysis for Existing Posts
 * POST /api/admin/backfill-vision
 * 
 * Analyzes images for posts that don't have price data from caption
 * Uses Gemini Vision AI (FREE) to extract prices, dates, hotels from images
 */
export async function POST(request: Request) {
    const { searchParams } = new URL(request.url);
    const limit = parseInt(searchParams.get('limit') || '50');

    try {
        console.log(`🔄 Starting vision backfill for up to ${limit} offers...`);

        // Find offers without prices that have images
        const offersToAnalyze = await prisma.offer.findMany({
            where: {
                priceDetected: null,
            },
            include: {
                rawPost: {
                    select: {
                        id: true,
                        mediaUrls: true,
                        captionText: true,
                    }
                }
            },
            take: limit,
            orderBy: { createdAt: 'desc' }
        });

        console.log(`📋 Found ${offersToAnalyze.length} offers without prices`);

        let analyzed = 0;
        let pricesFound = 0;
        let errors = 0;

        for (const offer of offersToAnalyze) {
            try {
                const mediaUrls = JSON.parse(offer.rawPost.mediaUrls || '[]');
                const thumbnailUrl = mediaUrls[0];

                if (!thumbnailUrl) {
                    continue;
                }

                console.log(`👁️ Analyzing offer ${offer.id}...`);

                const visionResult = await analyzeImageWithGemini(thumbnailUrl);
                analyzed++;

                if (visionResult.success && visionResult.extracted.prices.length > 0) {
                    const price = visionResult.extracted.prices[0];

                    // Update the offer with vision-extracted data
                    await prisma.offer.update({
                        where: { id: offer.id },
                        data: {
                            priceDetected: price.amount,
                            currencyDetected: price.currency,
                            destinationDetected: visionResult.extracted.destination || offer.destinationDetected,
                            hotelDetected: visionResult.extracted.hotel || offer.hotelDetected,
                            starRating: visionResult.extracted.starRating || offer.starRating,
                            boardType: visionResult.extracted.boardType || offer.boardType,
                            durationDetected: visionResult.extracted.duration
                                ? `${visionResult.extracted.duration.nights}N/${visionResult.extracted.duration.days}D`
                                : offer.durationDetected,
                            bookingContact: visionResult.extracted.phone || visionResult.extracted.whatsapp || offer.bookingContact,
                            // Boost confidence since we found data in image
                            confidenceScore: Math.min((offer.confidenceScore || 0.5) + 0.2, 1.0),
                        }
                    });

                    pricesFound++;
                    console.log(`  ✅ Found: ${price.amount} ${price.currency}`);
                }

                // Rate limit: 1 second between requests to stay under free tier
                await new Promise(resolve => setTimeout(resolve, 1000));

            } catch (err) {
                errors++;
                console.error(`  ❌ Error:`, err);
            }
        }

        return NextResponse.json({
            success: true,
            analyzed,
            pricesFound,
            errors,
            message: `Analyzed ${analyzed} images, found ${pricesFound} new prices`
        });

    } catch (error) {
        console.error('Backfill error:', error);
        return NextResponse.json({
            error: error instanceof Error ? error.message : 'Unknown error'
        }, { status: 500 });
    }
}

export async function GET() {
    // Get stats on offers without prices
    const [withoutPrice, withPrice, total] = await Promise.all([
        prisma.offer.count({ where: { priceDetected: null } }),
        prisma.offer.count({ where: { priceDetected: { not: null } } }),
        prisma.offer.count(),
    ]);

    return NextResponse.json({
        message: 'POST to this endpoint to backfill vision analysis for existing posts',
        stats: {
            total,
            withPrice,
            withoutPrice,
            priceDetectionRate: total > 0 ? `${Math.round((withPrice / total) * 100)}%` : '0%'
        },
        usage: 'POST /api/admin/backfill-vision?limit=50'
    });
}

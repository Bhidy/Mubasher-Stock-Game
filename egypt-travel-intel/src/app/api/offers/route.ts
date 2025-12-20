import { NextResponse } from 'next/server';
import prisma from '@/lib/db';

export async function GET(request: Request) {
    try {
        const { searchParams } = new URL(request.url);

        // Pagination
        const page = parseInt(searchParams.get('page') || '1');
        const limit = parseInt(searchParams.get('limit') || '20');
        const skip = (page - 1) * limit;

        // Filters
        const agency = searchParams.get('agency');
        const destination = searchParams.get('destination');
        const offerType = searchParams.get('offerType');
        const hasPrice = searchParams.get('hasPrice');
        const hasContact = searchParams.get('hasContact');
        const dateFrom = searchParams.get('dateFrom');
        const dateTo = searchParams.get('dateTo');
        const minConfidence = parseFloat(searchParams.get('minConfidence') || '0');

        // Sorting
        const sortBy = searchParams.get('sortBy') || 'createdAt';
        const sortOrder = searchParams.get('sortOrder') || 'desc';

        // Build where clause
        const where: Record<string, unknown> = {
            isOffer: true,
            confidenceScore: { gte: minConfidence },
            rawPost: { account: { isActive: true } },
        };

        if (agency) {
            where.rawPost = { accountHandle: agency };
        }
        if (destination) {
            where.destinationDetected = { contains: destination, mode: 'insensitive' };
        }
        if (offerType) {
            where.offerType = offerType;
        }
        if (hasPrice === 'true') {
            where.priceDetected = { not: null };
        }
        if (hasContact === 'true') {
            where.bookingContact = { not: null };
        }
        if (dateFrom || dateTo) {
            where.createdAt = {};
            if (dateFrom) (where.createdAt as Record<string, Date>).gte = new Date(dateFrom);
            if (dateTo) (where.createdAt as Record<string, Date>).lte = new Date(dateTo);
        }

        // Build orderBy
        const orderBy: any = {}; // Use any to allow nested relation sorting
        if (sortBy === 'price') {
            orderBy.priceDetected = sortOrder;
        } else if (sortBy === 'engagement') {
            orderBy.rawPost = { likesCount: sortOrder };
        } else if (sortBy === 'confidence') {
            orderBy.confidenceScore = sortOrder;
        } else {
            orderBy.createdAt = sortOrder;
        }

        // Execute query
        const [offers, total] = await Promise.all([
            prisma.offer.findMany({
                where,
                include: {
                    rawPost: {
                        select: {
                            accountHandle: true,
                            postUrl: true,
                            postTimestamp: true,
                            mediaUrls: true,
                            likesCount: true,
                            commentsCount: true,
                            captionText: true,
                        },
                    },
                },
                orderBy,
                skip,
                take: limit,
            }),
            prisma.offer.count({ where }),
        ]);

        // Transform response
        const transformedOffers = offers.map(offer => ({
            id: offer.id,
            agency: offer.rawPost.accountHandle,
            destination: offer.destinationDetected,
            destinationType: offer.destinationType, // NEW: inbound/outbound
            offerType: offer.offerType,
            price: offer.priceDetected,
            currency: offer.currencyDetected,
            duration: offer.durationDetected,
            hotel: offer.hotelDetected,   // NEW: hotel chain
            starRating: offer.starRating, // NEW: star rating
            boardType: offer.boardType,   // NEW: meal plan
            bookingContact: offer.bookingContact,
            confidence: offer.confidenceScore,
            keywords: JSON.parse(offer.keywordsDetected || '[]'),
            postUrl: offer.rawPost.postUrl,
            postDate: offer.rawPost.postTimestamp,
            thumbnail: JSON.parse(offer.rawPost.mediaUrls || '[]')[0] || null,
            likes: offer.rawPost.likesCount,
            comments: offer.rawPost.commentsCount,
            caption: offer.rawPost.captionText,
            createdAt: offer.createdAt,
        }));

        return NextResponse.json({
            offers: transformedOffers,
            pagination: {
                page,
                limit,
                total,
                totalPages: Math.ceil(total / limit),
            },
        });
    } catch (error) {
        console.error('Offers API error:', error);
        return NextResponse.json(
            { error: 'Failed to fetch offers' },
            { status: 500 }
        );
    }
}

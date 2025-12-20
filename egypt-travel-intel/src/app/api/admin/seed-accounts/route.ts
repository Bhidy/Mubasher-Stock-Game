import { NextResponse } from 'next/server';
import prisma from '@/lib/db';

const VERIFIED_ACCOUNTS = [
    // Existing 14 (Active)
    { handle: 'travistaegypt', displayName: 'Travista Egypt' },
    { handle: 'paradisegypt', displayName: 'Paradise Egypt' },
    { handle: 'egypttoursportalofficial', displayName: 'Egypt Tours Portal' },
    { handle: 'optiontravel', displayName: 'Option Travel' },
    { handle: 'travelsawa', displayName: 'Travel Sawa' },
    { handle: 'iegypte', displayName: 'iEgypte' },
    { handle: 'vibestravelegypt', displayName: 'Vibes Travel Egypt' },
    { handle: 'e.gypsy', displayName: 'E.Gypsy' },
    { handle: 'puzzlegypt', displayName: 'Puzzle Egypt' },
    { handle: 'magic.carpet.travel', displayName: 'Magic Carpet Travel' },
    { handle: 'egypttailormade', displayName: 'Egypt Tailor Made' },
    { handle: 'atravel.egypt', displayName: 'A Travel Egypt' },
    { handle: 'snefro.travel.egypt', displayName: 'Snefro Travel Egypt' },
    { handle: 'emo_tour_egypt', displayName: 'Emo Tour Egypt' },

    // New 16 (Verified Active)
    { handle: 'abshrq8.tr', displayName: 'Absherq8' },
    { handle: 'alexandriatours', displayName: 'Alexandria Tours' },
    { handle: 'aswan.tours', displayName: 'Aswan Tours' },
    { handle: 'brand_golden_travel', displayName: 'Brand Golden Travel' },
    { handle: 'cairoprivatetours', displayName: 'Cairo Private Tours' },
    { handle: 'cruiseroyaltr', displayName: 'Cruise Royal' },
    { handle: 'dahabtours', displayName: 'Dahab Tours' },
    { handle: 'deltatours.egypt', displayName: 'Delta Tours Egypt' },
    { handle: 'egailatravel', displayName: 'Egaila Travel' },
    { handle: 'egypt_travel_tours_', displayName: 'Egypt Travel Tours' },
    { handle: 'egyptair', displayName: 'EgyptAir' },
    { handle: 'egyptluxurytours', displayName: 'Egypt Luxury Tours' },
    { handle: 'egyptsafaritours', displayName: 'Egypt Safari Tours' },
    { handle: 'egypttoursclub', displayName: 'Egypt Tours Club' },
    { handle: 'memphis.tours', displayName: 'Memphis Tours' },
    { handle: 'ramses_tours', displayName: 'Ramses Tours' },
];

export async function POST() {
    try {
        const validHandles = VERIFIED_ACCOUNTS.map(a => a.handle);
        let created = 0;
        let updated = 0;

        // 1. Upsert ALL verified accounts
        for (const account of VERIFIED_ACCOUNTS) {
            const existing = await prisma.account.findUnique({
                where: { handle: account.handle }
            });

            if (existing) {
                await prisma.account.update({
                    where: { handle: account.handle },
                    data: {
                        displayName: account.displayName,
                        isActive: true
                    }
                });
                updated++;
            } else {
                await prisma.account.create({
                    data: {
                        handle: account.handle,
                        displayName: account.displayName,
                        profileUrl: `https://instagram.com/${account.handle}`,
                        isActive: true,
                    }
                });
                created++;
            }
        }

        // 2. Deactivate accounts NOT in verified list
        const deactivated = await prisma.account.updateMany({
            where: {
                handle: { notIn: validHandles }
            },
            data: { isActive: false }
        });

        return NextResponse.json({
            success: true,
            created,
            updated,
            deactivated: deactivated.count,
            totalActive: VERIFIED_ACCOUNTS.length
        });
    } catch (error) {
        console.error('Seed error:', error);
        return NextResponse.json({
            success: false,
            error: error instanceof Error ? error.message : 'Unknown error'
        }, { status: 500 });
    }
}

export async function GET() {
    return NextResponse.json({
        message: 'POST to this endpoint to seed verified accounts',
        accountCount: VERIFIED_ACCOUNTS.length
    });
}

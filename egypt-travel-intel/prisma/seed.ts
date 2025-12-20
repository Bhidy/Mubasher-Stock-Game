import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

const INITIAL_ACCOUNTS = [
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

async function main() {
    console.log('🌱 Seeding database with initial accounts...');

    const validHandles = INITIAL_ACCOUNTS.map(a => a.handle);

    // 1. Upsert Active Accounts
    for (const account of INITIAL_ACCOUNTS) {
        await prisma.account.upsert({
            where: { handle: account.handle },
            update: {
                displayName: account.displayName,
                isActive: true // Ensure they are active
            },
            create: {
                handle: account.handle,
                displayName: account.displayName,
                profileUrl: `https://instagram.com/${account.handle}`,
                isActive: true,
            },
        });
        console.log(`  ✓ Updated/Created Verified: ${account.handle}`);
    }

    // 2. Deactivate Inactive Accounts (Not in list)
    console.log('🧹 Cleaning up inactive accounts...');
    const result = await prisma.account.updateMany({
        where: {
            handle: { notIn: validHandles }
        },
        data: { isActive: false }
    });

    if (result.count > 0) {
        console.log(`  ⚠️  Deactivated ${result.count} accounts that are no longer verified.`);
    }

    console.log(`\n✅ Seeded & Verified ${INITIAL_ACCOUNTS.length} accounts successfully!`);
}

main()
    .then(async () => {
        await prisma.$disconnect();
    })
    .catch(async (e) => {
        console.error(e);
        await prisma.$disconnect();
        process.exit(1);
    });

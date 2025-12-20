
const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();

const handles = [
    'venecia_travel',
    'voytra',
    'sanatourss',
    'misktravtrips',
    'cruiseroyaltr',
    'theterminal_kw',
    'egailatravel',
    'meirtravelco',
    'jabaltariqkw',
    'jaberalahmad.travelco',
    'ostoratravel_kw',
    'brand_golden_travel',
    'first.classt21',
    'hiltontravelkw',
    'mawasemtravels',
    'mazaya_holiday',
    'absherq8.tr',
    'itravelkw'
];

async function main() {
    console.log('🌱 Seeding new agencies...');

    for (const handle of handles) {
        try {
            const exists = await prisma.account.findUnique({
                where: { handle }
            });

            if (!exists) {
                await prisma.account.create({
                    data: {
                        handle,
                        displayName: handle, // Placeholder until scraped
                        isActive: true
                    }
                });
                console.log(`✅ Added @${handle}`);
            } else {
                console.log(`ℹ️  Skipped @${handle} (Exists)`);
            }
        } catch (e) {
            console.error(`❌ Failed to add @${handle}:`, e.message);
        }
    }
}

main()
    .catch(e => {
        console.error(e);
        process.exit(1);
    })
    .finally(async () => {
        await prisma.$disconnect();
    });

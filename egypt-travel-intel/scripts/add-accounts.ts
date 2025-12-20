import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

const newAccounts = [
    'jawlatours',
    'facttravel',
    'customer.point',
    'kadmartravelegy',
    'travel.boutique.co',
    'travelyallaeg',
    'jazeeraairways',
    'teztouregypt',
    'travimania',
    'vibestravelegypt',
    '4travellers4',
    'highertravel1',
    'flamingo.egypt',
    'travemiatours',
    'apollo.tours.egy',
    'tishoury_tours',
    'puzzlegypt'
];

async function addAccounts() {
    console.log('🚀 Adding new Instagram accounts...\n');

    let added = 0;
    let skipped = 0;

    for (const handle of newAccounts) {
        try {
            await prisma.account.create({
                data: {
                    handle,
                    displayName: handle,
                    profileUrl: `https://www.instagram.com/${handle}`,
                    isActive: true
                }
            });
            console.log(`✅ Added: @${handle}`);
            added++;
        } catch (error: any) {
            if (error.code === 'P2002') {
                console.log(`⏭️  Skipped (already exists): @${handle}`);
                skipped++;
            } else {
                console.error(`❌ Error adding @${handle}:`, error.message);
            }
        }
    }

    console.log(`\n📊 Summary:`);
    console.log(`   Added: ${added}`);
    console.log(`   Skipped: ${skipped}`);
    console.log(`   Total accounts requested: ${newAccounts.length}`);

    // Show total active accounts
    const totalActive = await prisma.account.count({ where: { isActive: true } });
    console.log(`\n🎯 Total active accounts in database: ${totalActive}`);
}

addAccounts()
    .catch(console.error)
    .finally(() => prisma.$disconnect());

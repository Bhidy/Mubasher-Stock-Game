
import { runIngestion } from '../src/lib/ingestion/ingest';
import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

async function main() {
    console.log('🚀 GOO MODE: Waking up new accounts...');

    // 1. Find accounts with 0 posts
    const accounts = await prisma.account.findMany({
        where: {
            isActive: true,
            posts: { none: {} } // find accounts that have NO posts yet
        },
        take: 50 // Do first 50 to stay safe timeframe
    });

    console.log(`found ${accounts.length} dormant accounts. Initializing ingestion...`);

    if (accounts.length === 0) {
        console.log("All accounts already have data!");
        return;
    }

    // 2. Run Ingestion for these specific accounts
    const handles = accounts.map(a => a.handle);

    // Process in chunks of 5 to be polite
    const chunkSize = 5;
    for (let i = 0; i < handles.length; i += chunkSize) {
        const chunk = handles.slice(i, i + chunkSize);
        console.log(`\n📥 Processing Batch [${i + 1}-${Math.min(i + chunkSize, handles.length)}] of ${handles.length}...`);
        console.log(`   - Targets: ${chunk.join(', ')}`);

        await runIngestion({
            accountHandles: chunk,
            postsPerAccount: 12, // Standard initial fetch
            dryRun: false,
            reportType: 'pulse'
        });

        console.log('   💤 Cooling down (5s)...');
        await new Promise(r => setTimeout(r, 5000));
    }

    console.log('\n✅ Batch Population Complete.');
}

main()
    .catch(e => console.error(e))
    .finally(async () => {
        await prisma.$disconnect();
    });

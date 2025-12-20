
import { runIngestion } from '../src/lib/ingestion/ingest';
import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

async function main() {
    console.log('🚀 GOO MODE: Starting 6-Month Historical Backfill...');
    console.log('⚠️  This process performs a DEEP SCAN using GraphQL pagination.');
    console.log('⚠️  It will attempt to fetch up to 100 recent posts per account.');

    // 1. Verify connection
    const count = await prisma.account.count();
    console.log(`📡 Connected to Production DB. Found ${count} tracked accounts.`);

    // 2. Run Ingestion with HIGH LIMIT
    console.log('🔄 Triggering Deep Scraping Engine...');
    const result = await runIngestion({
        postsPerAccount: 100, // Aim for ~100 posts (approx 3-6 months depending on frequency)
        dryRun: false,
        reportType: 'daily'   // Use 'daily' type for reporting
    });

    console.log('\n📊 BACKFILL RESULTS:');
    console.log(`   - Accounts Processed: ${result.accountsProcessed}`);
    console.log(`   - Posts Collected:    ${result.postsCollected}`);
    console.log(`   - Offers Detected:    ${result.offersDetected}`);
    console.log(`   - Status:             ${result.status}`);

    if (result.errors.length > 0) {
        console.log('\n⚠️ Errors encountered:');
        result.errors.forEach(e => console.log('   - ' + e));
    }

    console.log('\n✅ 6-Month Backfill Complete.');
}

main()
    .catch(e => console.error(e))
    .finally(async () => {
        await prisma.$disconnect();
    });

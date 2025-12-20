
import { runIngestion } from '../src/lib/ingestion/ingest';
import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

async function main() {
    console.log('🚀 GOO MODE: Starting Immediate Force-Population...');

    // 1. Verify connection
    const count = await prisma.account.count();
    console.log(`📡 Connected to Production DB. Found ${count} tracked accounts.`);

    // 2. Run Ingestion (Deep scan: 20 posts per account)
    console.log('🔄 Triggering Scraping Engine...');
    const result = await runIngestion({
        postsPerAccount: 20, // Fetch 20 posts per account to ensure data
        dryRun: false,       // SAVE to database
        reportType: 'pulse'
    });

    console.log('\n📊 INGESTION RESULTS:');
    console.log(`   - Accounts Processed: ${result.accountsProcessed}`);
    console.log(`   - Posts Collected:    ${result.postsCollected}`);
    console.log(`   - Offers Detected:    ${result.offersDetected}`);
    console.log(`   - Status:             ${result.status}`);

    if (result.errors.length > 0) {
        console.log('\n⚠️ Errors encountered:');
        result.errors.forEach(e => console.log('   - ' + e));
    }

    console.log('\n✅ Force-Population Complete. Dashboard should now be LIVE.');
}

main()
    .catch(e => console.error(e))
    .finally(async () => {
        await prisma.$disconnect();
    });

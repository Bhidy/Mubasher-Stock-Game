
import { PrismaClient } from '@prisma/client';
import fs from 'fs';
import path from 'path';

const prisma = new PrismaClient();

async function main() {
    console.log('🚑 GOO MODE RESTORE: Recovering 93 Accounts to Production DB...');

    try {
        const filePath = path.join(process.cwd(), 'restored_accounts.txt');
        const fileContent = fs.readFileSync(filePath, 'utf-8');
        const handles = fileContent.split('\n').map(h => h.trim()).filter(h => h.length > 0);

        console.log(`📜 Found ${handles.length} handles to restore.`);

        let restored = 0;
        let skipped = 0;

        for (const handle of handles) {
            try {
                // Upsert: Create if not exists, do nothing if exists
                await prisma.account.upsert({
                    where: { handle },
                    update: {}, // No update needed
                    create: {
                        handle,
                        isActive: true
                    }
                });
                restored++;
                process.stdout.write('.');
            } catch (err) {
                console.error(`❌ Error with ${handle}:`, err);
                skipped++;
            }
        }

        console.log(`\n\n✅ RESTORE COMPLETE.`);
        console.log(`   - Total Processed: ${handles.length}`);
        console.log(`   - Restored/Verified: ${restored}`);
        console.log(`   - Skipped/Errors: ${skipped}`);

    } catch (error) {
        console.error('Fatal Restore Error:', error);
    } finally {
        await prisma.$disconnect();
    }
}

main();


import { PrismaClient } from '@prisma/client';
import dotenv from 'dotenv';

dotenv.config();

const prisma = new PrismaClient();

async function checkErrors() {
    console.log('🔍 Checking latest ingestion logs for errors...');

    const logs = await prisma.ingestionLog.findMany({
        take: 5,
        orderBy: { runAt: 'desc' },
    });

    console.log(`Found ${logs.length} logs.`);

    for (const log of logs) {
        console.log(`\n---------------------------------------------------`);
        console.log(`Run ID: ${log.id}`);
        console.log(`Time: ${log.runAt.toLocaleString()}`);
        console.log(`Status: ${log.status}`);
        console.log(`Duration: ${log.duration}ms`);
        console.log(`Accounts Processed: ${log.accountsProcessed}`);
        console.log(`Errors:`);

        try {
            const errors = JSON.parse(log.errors || '[]');
            if (errors.length === 0) {
                console.log('  (No errors)');
            } else {
                errors.forEach((err: string, i: number) => console.log(`  ${i + 1}. ${err}`));
            }
        } catch (e) {
            console.log(`  (Raw Error String): ${log.errors}`);
        }
    }
}

checkErrors()
    .catch(console.error)
    .finally(() => prisma.$disconnect());

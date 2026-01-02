
import { PrismaClient } from '@prisma/client';
import dotenv from 'dotenv';

dotenv.config();

const prisma = new PrismaClient();

function cleanHandle(handle: string): string | null {
    // If it's already a clean handle (no slashes, no spaces), return it
    if (!handle.includes('/') && !handle.includes('http')) {
        return handle;
    }

    try {
        let urlStr = handle;
        if (!urlStr.startsWith('http')) {
            urlStr = `https://${urlStr}`;
        }
        const url = new URL(urlStr);
        const pathSegments = url.pathname.split('/').filter(s => s.length > 0);

        // Handle https://instagram.com/username
        if (pathSegments.length > 0) {
            return pathSegments[pathSegments.length - 1];
        }
    } catch (e) {
        // Fallback simple split
        const parts = handle.split('/').filter(s => s.length > 0);
        return parts[parts.length - 1];
    }
    return null;
}

async function fixHandles() {
    console.log('🔧 Starting Account Handle Fixer...');

    const accounts = await prisma.account.findMany();
    console.log(`Found ${accounts.length} total accounts.`);

    let fixedCount = 0;
    let deletedCount = 0;
    let errorCount = 0;

    for (const account of accounts) {
        const cleaned = cleanHandle(account.handle);

        if (cleaned && cleaned !== account.handle) {
            console.log(`\nProcessing: ${account.handle} -> ${cleaned}`);

            // Check if clean handle already exists
            const existing = await prisma.account.findUnique({
                where: { handle: cleaned }
            });

            if (existing) {
                console.log(`  ⚠️ Handle ${cleaned} already exists (ID: ${existing.id}).`);
                console.log(`  🗑️ Deleting bad record ${account.id}...`);
                try {
                    // Start transaction to delete related data if any (cascading usually handles this but being safe)
                    // If the bad account has posts, we might lose them, but ingestion failed so likely 0 posts.
                    await prisma.account.delete({ where: { id: account.id } });
                    console.log('  ✅ Deleted.');
                    deletedCount++;
                } catch (err) {
                    console.error('  ❌ Delete failed:', err);
                    errorCount++;
                }
            } else {
                console.log(`  📝 Updating handle...`);
                try {
                    await prisma.account.update({
                        where: { id: account.id },
                        data: { handle: cleaned }
                    });
                    console.log('  ✅ Updated.');
                    fixedCount++;
                } catch (err) {
                    console.error('  ❌ Update failed:', err);
                    errorCount++;
                }
            }
        }
    }

    console.log(`\n🎉 Done! Fixed: ${fixedCount}, Deleted: ${deletedCount}, Errors: ${errorCount}`);
}

fixHandles()
    .catch(console.error)
    .finally(() => prisma.$disconnect());

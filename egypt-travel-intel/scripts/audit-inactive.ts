
import { PrismaClient } from '@prisma/client';
import { scrapeInstagramProfile } from '../src/lib/ingestion/instagram-scraper';

const prisma = new PrismaClient();

// Configuration
const MONTHS_THRESHOLD = 3;
const CUTOFF_DATE = new Date();
CUTOFF_DATE.setMonth(CUTOFF_DATE.getMonth() - MONTHS_THRESHOLD);

interface AccountAudit {
    handle: string;
    status: 'ACTIVE' | 'STALE' | 'DEAD' | 'PRIVATE' | 'ERROR';
    lastPostDate: Date | null;
    lastPostDaysAgo: number | null;
    followerCount: number | null;
    reason?: string;
}

// Sleep helper
const sleep = (ms: number) => new Promise(r => setTimeout(r, ms));

async function main() {
    console.log(`🕵️‍♂️ GOO MODE AUDIT: Checking 93 Accounts against 3-Month Cutoff (${CUTOFF_DATE.toISOString().split('T')[0]})`);

    const accounts = await prisma.account.findMany({
        where: { isActive: true }
    });

    console.log(`📋 Loaded ${accounts.length} accounts to audit.\n`);

    const results: AccountAudit[] = [];

    // Process in batches to manage rate limits
    const BATCH_SIZE = 5;

    for (let i = 0; i < accounts.length; i += BATCH_SIZE) {
        const batch = accounts.slice(i, i + BATCH_SIZE);
        const promises = batch.map(async (account) => {
            try {
                // Random delay before request
                await sleep(Math.random() * 2000);

                // Fetch Profile Only (fastest way)
                // We ask for 1 post just to check the date
                const result = await scrapeInstagramProfile(account.handle, 1);

                if (!result.success || !result.profile) {
                    return {
                        handle: account.handle,
                        status: 'DEAD',
                        lastPostDate: null,
                        lastPostDaysAgo: null,
                        followerCount: null,
                        reason: result.error || 'Not Found / Ban'
                    } as AccountAudit;
                }

                if (result.profile.posts.length === 0) {
                    // Determine if private or just empty
                    // For now, treat as Dead/Empty
                    return {
                        handle: account.handle,
                        status: 'STALE',
                        lastPostDate: null,
                        lastPostDaysAgo: 9999, // Infinite
                        followerCount: result.profile.followersCount,
                        reason: 'No posts visible'
                    } as AccountAudit;
                }

                const latestPost = result.profile.posts[0];
                const postDate = latestPost.timestamp ? new Date(latestPost.timestamp) : new Date(0);
                const daysAgo = Math.floor((new Date().getTime() - postDate.getTime()) / (1000 * 60 * 60 * 24));

                let status: AccountAudit['status'] = 'ACTIVE';
                if (postDate < CUTOFF_DATE) status = 'STALE';

                return {
                    handle: account.handle,
                    status: postDate < CUTOFF_DATE ? 'STALE' : 'ACTIVE',
                    lastPostDate: postDate,
                    lastPostDaysAgo: daysAgo,
                    followerCount: result.profile.followersCount
                } as AccountAudit;

            } catch (err) {
                return {
                    handle: account.handle,
                    status: 'ERROR',
                    lastPostDate: null,
                    lastPostDaysAgo: null,
                    followerCount: null,
                    reason: 'Scrape Exception'
                } as AccountAudit;
            }
        });

        const batchResults = await Promise.all(promises);
        results.push(...batchResults);

        console.log(`✅ Processed ${results.length}/${accounts.length}...`);

        // Cooldown between batches
        if (i + BATCH_SIZE < accounts.length) await sleep(3000);
    }

    // --- GENERATE REPORT ---
    console.log('\n\n===============================================================');
    console.log('📊 ACCOUNT HEALTH REPORT');
    console.log('===============================================================');
    console.log('| Handle | Status | Last Active | Followers | Reason/Age |');
    console.log('| :--- | :--- | :--- | :--- | :--- |');

    const actives = results.filter(r => r.status === 'ACTIVE');
    const stales = results.filter(r => r.status === 'STALE');
    const deads = results.filter(r => r.status === 'DEAD' || r.status === 'ERROR');

    // Print Table Rows
    results.sort((a, b) => (a.lastPostDaysAgo || 99999) - (b.lastPostDaysAgo || 99999));

    results.forEach(r => {
        const dateStr = r.lastPostDate ? r.lastPostDate.toISOString().split('T')[0] : 'N/A';
        const ageStr = r.lastPostDaysAgo !== null ? `${r.lastPostDaysAgo} days ago` : (r.reason || 'Unknown');
        console.log(`| @${r.handle} | **${r.status}** | ${dateStr} | ${r.followerCount || '-'} | ${ageStr} |`);
    });

    console.log('\n\n---------------- SUMMARY ----------------');
    console.log(`✅ ACTIVE: ${actives.length}`);
    console.log(`⚠️  STALE (>3mo): ${stales.length}`);
    console.log(`❌ DEAD/ERROR: ${deads.length}`);
    console.log('-----------------------------------------');
}

main()
    .catch(e => console.error(e))
    .finally(async () => {
        await prisma.$disconnect();
    });

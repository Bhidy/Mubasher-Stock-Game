/**
 * Main Ingestion Pipeline
 * 
 * Orchestrates the scraping, deduplication, detection, and storage of Instagram posts.
 * Uses direct Instagram scraping - no API key required.
 * NOW WITH VISION AI: Extracts prices/dates from images using Gemini (FREE)
 * 
 * 🛡️ GOO MODE SAFE SCRAPING:
 * - Long delays between requests (10-20 seconds)
 * - Exponential backoff on rate limits
 * - Max accounts per run to spread load
 * - Random jitter to appear more human-like
 */

import { PrismaClient } from '@prisma/client';
import { detectOffer, mergeDetectionWithVision } from './detector';
import { scrapeInstagramProfile, transformInstagramPost } from './instagram-scraper';
import { sendIngestionReport } from '@/lib/email';
import { analyzeImageWithGemini } from '@/lib/vision';
import { v4 as uuidv4 } from 'uuid';

const prisma = new PrismaClient();

// Global lock to prevent concurrent runs
let isIngestionRunning = false;

// ============================================================================
// 🛡️ GOO MODE SAFE SCRAPING CONFIGURATION
// ============================================================================
const SAFE_SCRAPING = {
    // Base delay between accounts (10-20 seconds with jitter)
    MIN_DELAY_MS: 10000,      // 10 seconds minimum
    MAX_DELAY_MS: 20000,      // 20 seconds maximum

    // Maximum accounts to scrape per single run (to spread load over time)
    MAX_ACCOUNTS_PER_RUN: 10,

    // Backoff multiplier when we hit rate limits
    BACKOFF_MULTIPLIER: 2,
    MAX_BACKOFF_MS: 120000,   // 2 minutes max backoff

    // Stop scraping if we hit this many consecutive errors
    MAX_CONSECUTIVE_ERRORS: 3,

    // Delay after a 429 error before continuing
    RATE_LIMIT_COOLDOWN_MS: 60000,  // 1 minute cooldown
};

export interface IngestionResult {
    accountsProcessed: number;
    postsCollected: number;
    offersDetected: number;
    errors: string[];
    duration: number;
    status: 'success' | 'partial' | 'failed';
}

export interface IngestionOptions {
    accountHandles?: string[]; // Specific accounts to scrape, or all active if empty
    postsPerAccount?: number;  // Limit posts per account
    dryRun?: boolean;          // Don't save to database
    reportType?: 'pulse' | 'daily'; // Report frequency
    safeMode?: boolean;        // Use extra-safe scraping (default: true)
}

// Rate limiting helper with jitter for human-like behavior
function safeDelay(baseMs: number = SAFE_SCRAPING.MIN_DELAY_MS): Promise<void> {
    const jitter = Math.random() * (SAFE_SCRAPING.MAX_DELAY_MS - SAFE_SCRAPING.MIN_DELAY_MS);
    const totalDelay = baseMs + jitter;
    console.log(`  🛡️ Safe delay: ${Math.round(totalDelay / 1000)}s`);
    return new Promise(resolve => setTimeout(resolve, totalDelay));
}

export async function runIngestion(options: IngestionOptions = {}): Promise<IngestionResult> {
    const startTime = Date.now();
    const result: IngestionResult = {
        accountsProcessed: 0,
        postsCollected: 0,
        offersDetected: 0,
        errors: [],
        duration: 0,
        status: 'success',
    };

    // 0. Concurrency Check
    if (isIngestionRunning) {
        console.warn('⚠️ Ingestion already running. Skipping this trigger.');
        result.errors.push('Ingestion already running');
        result.status = 'failed';
        return result;
    }

    isIngestionRunning = true;

    try {
        // 1. Get active accounts to scrape
        const accounts = await prisma.account.findMany({
            where: {
                isActive: true,
                ...(options.accountHandles?.length ? { handle: { in: options.accountHandles } } : {}),
            },
        });

        if (accounts.length === 0) {
            result.errors.push('No active accounts found to scrape');
            result.status = 'failed';
            result.duration = Date.now() - startTime;
            return result;
        }

        // 🛡️ GOO MODE: Limit accounts per run to spread load
        const safeMode = options.safeMode !== false; // Default to safe mode
        const maxAccounts = safeMode ? SAFE_SCRAPING.MAX_ACCOUNTS_PER_RUN : accounts.length;
        const accountsToProcess = accounts.slice(0, maxAccounts);

        console.log(`📥 Starting ingestion for ${accountsToProcess.length} of ${accounts.length} accounts...`);
        if (safeMode && accounts.length > maxAccounts) {
            console.log(`🛡️ Safe mode: Processing ${maxAccounts} accounts this run. Remaining ${accounts.length - maxAccounts} will be processed in next run.`);
        }

        // Track consecutive errors for circuit breaker
        let consecutiveErrors = 0;
        let currentBackoff = SAFE_SCRAPING.MIN_DELAY_MS;

        // 2. Process each account with safe scraping
        for (let i = 0; i < accountsToProcess.length; i++) {
            const account = accountsToProcess[i];

            // 🛡️ Circuit breaker: Stop if too many consecutive errors
            if (consecutiveErrors >= SAFE_SCRAPING.MAX_CONSECUTIVE_ERRORS) {
                console.log(`🛑 Circuit breaker triggered: ${consecutiveErrors} consecutive errors. Stopping to prevent ban.`);
                result.errors.push(`Stopped after ${consecutiveErrors} consecutive errors to prevent IP ban`);
                break;
            }

            try {
                console.log(`\n📥 [${i + 1}/${accountsToProcess.length}] Scraping @${account.handle}...`);

                // 🛡️ Safe delay between accounts (10-20 seconds with jitter)
                if (i > 0) {
                    await safeDelay(currentBackoff);
                }

                // Scrape posts from Instagram directly
                // Ensure handle is clean (remove URL parts if present)
                const cleanHandle = account.handle.split('/').pop()?.replace(/\?.*$/, '') || account.handle;
                const scrapeResult = await scrapeInstagramProfile(cleanHandle, options.postsPerAccount || 20);

                if (!scrapeResult.success || !scrapeResult.profile) {
                    const errorMsg = scrapeResult.error || 'Failed to scrape';
                    result.errors.push(`@${account.handle}: ${errorMsg}`);
                    console.log(`  ❌ Failed: ${errorMsg}`);

                    // 🛡️ Handle rate limiting (429 errors)
                    if (errorMsg.includes('429') || errorMsg.toLowerCase().includes('rate') || errorMsg.toLowerCase().includes('too many')) {
                        consecutiveErrors++;
                        currentBackoff = Math.min(currentBackoff * SAFE_SCRAPING.BACKOFF_MULTIPLIER, SAFE_SCRAPING.MAX_BACKOFF_MS);
                        console.log(`  🛡️ Rate limit detected! Backing off to ${Math.round(currentBackoff / 1000)}s. Consecutive errors: ${consecutiveErrors}`);

                        // Extra cooldown for rate limits
                        console.log(`  ⏸️ Rate limit cooldown: ${SAFE_SCRAPING.RATE_LIMIT_COOLDOWN_MS / 1000}s`);
                        await new Promise(resolve => setTimeout(resolve, SAFE_SCRAPING.RATE_LIMIT_COOLDOWN_MS));
                    } else {
                        consecutiveErrors++;
                    }
                    continue;
                }

                // Success - reset backoff and error counter
                consecutiveErrors = 0;
                currentBackoff = SAFE_SCRAPING.MIN_DELAY_MS;

                result.accountsProcessed++;
                console.log(`  ✓ Found ${scrapeResult.profile.posts.length} posts`);

                // Update account info
                await prisma.account.update({
                    where: { id: account.id },
                    data: {
                        displayName: scrapeResult.profile.fullName || account.displayName,
                        profileUrl: scrapeResult.profile.profilePicUrl || account.profileUrl,
                    },
                });

                // 3. Process each post
                const postsToProcess = scrapeResult.profile.posts.slice(0, options.postsPerAccount || 50);

                for (const post of postsToProcess) {
                    try {
                        const postData = transformInstagramPost(post, account.handle);

                        // Check for duplicates
                        const existing = await prisma.rawPost.findFirst({
                            where: {
                                accountHandle: account.handle,
                                postId: postData.postId,
                            },
                        });

                        if (existing) {
                            continue; // Skip duplicate silently
                        }

                        if (options.dryRun) {
                            console.log(`  📝 [DRY RUN] Would save: ${postData.postId}`);
                            result.postsCollected++;
                            continue;
                        }

                        // 4. Save raw post
                        const savedPost = await prisma.rawPost.create({
                            data: postData,
                        });

                        result.postsCollected++;

                        // 5. Detect offer from caption
                        const captionDetection = detectOffer(postData.captionText);

                        // 6. NEW: Analyze image with Gemini Vision AI (FREE)
                        let finalDetection = captionDetection;
                        let priceSource = 'caption';

                        // Get thumbnail URL for vision analysis
                        const thumbnailUrl = JSON.parse(postData.mediaUrls || '[]')[0];

                        if (thumbnailUrl) {
                            try {
                                console.log(`  👁️ Analyzing image...`);
                                const visionResult = await analyzeImageWithGemini(thumbnailUrl);

                                if (visionResult.success) {
                                    // Merge vision data with caption detection
                                    const merged = mergeDetectionWithVision(captionDetection, visionResult.extracted);
                                    finalDetection = merged;
                                    priceSource = merged.priceSource;

                                    if (priceSource === 'image') {
                                        console.log(`  📸 Vision extracted: ${merged.priceDetected} ${merged.currencyDetected} (from image)`);
                                    }
                                }
                            } catch (visionError) {
                                // Vision failed - continue with caption only
                                console.log(`  ⚠️ Vision skipped: ${visionError instanceof Error ? visionError.message : 'error'}`);
                            }
                        }

                        // 7. Save offer with merged data
                        if (finalDetection.isOffer) {
                            await prisma.offer.create({
                                data: {
                                    rawPostId: savedPost.id,
                                    isOffer: finalDetection.isOffer,
                                    offerType: finalDetection.offerType,
                                    destinationDetected: finalDetection.destinationDetected,
                                    destinationType: finalDetection.destinationType,
                                    priceDetected: finalDetection.priceDetected,
                                    currencyDetected: finalDetection.currencyDetected,
                                    durationDetected: finalDetection.durationDetected,
                                    hotelDetected: finalDetection.hotelDetected,
                                    starRating: finalDetection.starRating,
                                    boardType: finalDetection.boardType,
                                    bookingContact: finalDetection.bookingContact,
                                    keywordsDetected: JSON.stringify(finalDetection.keywordsDetected),
                                    confidenceScore: finalDetection.confidenceScore,
                                },
                            });
                            result.offersDetected++;
                            const sourceTag = priceSource === 'image' ? '📸' : '📝';
                            console.log(`  🎯 Offer ${sourceTag}: ${finalDetection.offerType || 'general'} - ${finalDetection.destinationDetected || 'Egypt'} - ${finalDetection.priceDetected ? finalDetection.priceDetected + ' ' + finalDetection.currencyDetected : 'price TBD'}`);
                        }
                    } catch (postError) {
                        // Silent fail for individual posts
                        console.error(`  ⚠️ Post error:`, postError);
                    }
                }

                console.log(`  ✅ @${account.handle}: ${postsToProcess.length} posts processed`);

            } catch (accountError) {
                const errMsg = accountError instanceof Error ? accountError.message : 'Unknown account error';
                result.errors.push(`@${account.handle}: ${errMsg}`);
                console.error(`  ❌ @${account.handle} failed:`, errMsg);
            }
        }

        // 6. Determine final status
        if (result.errors.length === 0) {
            result.status = 'success';
        } else if (result.accountsProcessed > 0) {
            result.status = 'partial';
        } else {
            result.status = 'failed';
        }

        // 7. Log the run
        let ingestionLogId: string | null = null;
        if (!options.dryRun) {
            const logEntry = await prisma.ingestionLog.create({
                data: {
                    accountsProcessed: result.accountsProcessed,
                    postsCollected: result.postsCollected,
                    offersDetected: result.offersDetected,
                    errors: JSON.stringify(result.errors),
                    duration: Date.now() - startTime,
                    status: result.status,
                    emailStatus: 'pending' // Initial status
                },
            });
            ingestionLogId = logEntry.id;
        }

        result.duration = Date.now() - startTime;
        console.log(`\n✅ Ingestion complete: ${result.accountsProcessed} accounts, ${result.postsCollected} posts, ${result.offersDetected} offers in ${Math.round(result.duration / 1000)}s`);

        // 8. Send Email Report (if not dry run)
        if (!options.dryRun && ingestionLogId) {
            try {
                // Determine time range based on report type
                const timeThreshold = options.reportType === 'daily'
                    ? new Date(Date.now() - 24 * 60 * 60 * 1000) // Daily: Last 24 hours
                    : new Date(Date.now() - 12 * 60 * 60 * 1000); // Pulse: Last 12 hours (morning to evening)

                // Fetch offers detected in this run (or last 24h for daily)
                const newOffers = await prisma.offer.findMany({
                    where: {
                        createdAt: { gt: timeThreshold },
                        rawPost: { account: { isActive: true } },
                    },
                    include: {
                        rawPost: true,
                    },
                    orderBy: {
                        confidenceScore: 'desc',
                    },
                });

                // Calculate stats for the report
                const destMap = new Map<string, number>();
                const agencyMap = new Map<string, number>();

                newOffers.forEach(o => {
                    const dest = o.destinationDetected || 'Unspecified';
                    const agency = o.rawPost.accountHandle;
                    destMap.set(dest, (destMap.get(dest) || 0) + 1);
                    agencyMap.set(agency, (agencyMap.get(agency) || 0) + 1);
                });

                const topDestinations = Array.from(destMap.entries())
                    .sort((a, b) => b[1] - a[1])
                    .map(([name, count]) => ({ name, count }));

                const topAgencies = Array.from(agencyMap.entries())
                    .sort((a, b) => b[1] - a[1])
                    .map(([handle, count]) => ({ handle, count }));

                const highlights = newOffers.slice(0, 5).map(o => ({
                    agency: o.rawPost.accountHandle,
                    offerType: o.offerType || 'General',
                    destination: o.destinationDetected || 'Unspecified',
                    price: o.priceDetected,
                    currency: o.currencyDetected,
                    confidence: o.confidenceScore || 0,
                    caption: (o.rawPost.captionText || '').substring(0, 100) + '...',
                }));

                // --- GOO MODE: SPAM CIRCUIT BREAKER ---
                // 🛑 Prevents emails from being sent if one was sent recently (e.g. within 4 hours).
                // This protects the user from "15-minute" spam loops regardless of trigger source.
                const MIN_HOURS_BETWEEN_EMAILS = 4;
                const fourHoursAgo = new Date(Date.now() - MIN_HOURS_BETWEEN_EMAILS * 60 * 60 * 1000);

                const recentEmail = await prisma.ingestionLog.findFirst({
                    where: {
                        emailStatus: 'sent',
                        emailSentAt: { gt: fourHoursAgo }
                    }
                });

                if (recentEmail) {
                    console.warn(`🛑 Spam Circuit Breaker: Email already sent recently (at ${recentEmail.emailSentAt}). Skipping this one.`);

                    // Mark this run as 'skipped' so we know why no email went out
                    await prisma.ingestionLog.update({
                        where: { id: ingestionLogId },
                        data: { emailStatus: 'skipped' }
                    });

                    // Exit early - DO NOT SEND
                    return result;
                }
                // ---------------------------------------

                // Go: Send Email and capture result
                const emailResult = await sendIngestionReport({
                    runId: uuidv4(),
                    timestamp: new Date(),
                    type: options.reportType || 'pulse', // Pass report type
                    stats: {
                        accountsScraped: result.accountsProcessed,
                        postsScanned: result.postsCollected,
                        newOffersFound: newOffers.length, // Use fetched offers count
                        yieldRate: result.postsCollected > 0 ? (newOffers.length / result.postsCollected) * 100 : 0,
                        topDestinations: topDestinations.slice(0, 3), // Top 3
                        activeAgencies: topAgencies.length,
                    },
                    highlights,
                    status: result.status,
                });

                // Update Log with Email Status
                if (emailResult) {
                    await prisma.ingestionLog.update({
                        where: { id: ingestionLogId },
                        data: {
                            emailStatus: emailResult.success ? 'sent' : 'failed',
                            emailSentAt: emailResult.success ? new Date() : null,
                            // Append email error to main errors if failed
                            errors: emailResult.success
                                ? undefined
                                : JSON.stringify([...result.errors, `Email Failed: ${emailResult.error}`])
                        }
                    });
                }

            } catch (reportError) {
                console.error('⚠️ Failed to generate/send email report:', reportError);
                // Try to log fatal error
                if (ingestionLogId) {
                    await prisma.ingestionLog.update({
                        where: { id: ingestionLogId },
                        data: {
                            emailStatus: 'failed',
                            errors: JSON.stringify([...result.errors, `Email Fatal Error: ${reportError}`])
                        }
                    });
                }
            }
        }

        return result;
    } catch (error) {
        result.errors.push(error instanceof Error ? error.message : 'Unknown error');
        result.status = 'failed';
        result.duration = Date.now() - startTime;
        return result;
    } finally {
        isIngestionRunning = false;
    }
}

// Get the latest ingestion log
export async function getLatestIngestionLog() {
    return prisma.ingestionLog.findFirst({
        orderBy: { runAt: 'desc' },
    });
}

// Get ingestion stats
export async function getIngestionStats() {
    const [totalPosts, totalOffers, latestLog, accountCount] = await Promise.all([
        prisma.rawPost.count(),
        prisma.offer.count(),
        getLatestIngestionLog(),
        prisma.account.count({ where: { isActive: true } }),
    ]);

    return {
        totalPosts,
        totalOffers,
        activeAccounts: accountCount,
        lastSync: latestLog?.runAt || null,
        lastSyncStatus: latestLog?.status || null,
    };
}

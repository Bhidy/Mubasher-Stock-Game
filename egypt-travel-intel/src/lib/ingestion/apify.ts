/**
 * Apify Instagram Scraper Integration
 * 
 * Uses Apify's Instagram Post Scraper actor to fetch public posts.
 * Supports incremental scraping and per-account isolation.
 */

const APIFY_API_URL = 'https://api.apify.com/v2';
const INSTAGRAM_SCRAPER_ACTOR_ID = 'apify~instagram-post-scraper';

export interface ApifyInstagramPost {
    id: string;
    shortCode: string;
    url: string;
    caption: string | null;
    timestamp: string;
    type: 'Image' | 'Video' | 'Sidecar';
    displayUrl: string;
    images: string[];
    videoUrl?: string;
    hashtags: string[];
    mentions: string[];
    likesCount: number;
    commentsCount: number;
    ownerUsername: string;
    ownerFullName: string;
    ownerId: string;
}

export interface ScrapeResult {
    success: boolean;
    posts: ApifyInstagramPost[];
    error?: string;
}

export async function scrapeInstagramAccount(
    handle: string,
    options: {
        resultsLimit?: number;
        directUrls?: string[];
    } = {}
): Promise<ScrapeResult> {
    const apiToken = process.env.APIFY_API_TOKEN;

    if (!apiToken) {
        return {
            success: false,
            posts: [],
            error: 'APIFY_API_TOKEN not configured',
        };
    }

    try {
        // Start the actor run
        const runResponse = await fetch(
            `${APIFY_API_URL}/acts/${INSTAGRAM_SCRAPER_ACTOR_ID}/runs?token=${apiToken}`,
            {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({
                    directUrls: options.directUrls || [`https://www.instagram.com/${handle}/`],
                    resultsLimit: options.resultsLimit || 20,
                    searchType: 'user',
                    addParentData: false,
                }),
            }
        );

        if (!runResponse.ok) {
            const errorText = await runResponse.text();
            return {
                success: false,
                posts: [],
                error: `Apify API error: ${runResponse.status} - ${errorText}`,
            };
        }

        const runData = await runResponse.json();
        const runId = runData.data.id;

        // Wait for the run to complete (poll status)
        let status = 'RUNNING';
        let attempts = 0;
        const maxAttempts = 60; // 5 minutes max

        while (status === 'RUNNING' && attempts < maxAttempts) {
            await new Promise(resolve => setTimeout(resolve, 5000)); // Wait 5 seconds

            const statusResponse = await fetch(
                `${APIFY_API_URL}/actor-runs/${runId}?token=${apiToken}`
            );

            if (statusResponse.ok) {
                const statusData = await statusResponse.json();
                status = statusData.data.status;
            }

            attempts++;
        }

        if (status !== 'SUCCEEDED') {
            return {
                success: false,
                posts: [],
                error: `Apify run failed with status: ${status}`,
            };
        }

        // Fetch results from the default dataset
        const datasetResponse = await fetch(
            `${APIFY_API_URL}/actor-runs/${runId}/dataset/items?token=${apiToken}`
        );

        if (!datasetResponse.ok) {
            return {
                success: false,
                posts: [],
                error: 'Failed to fetch results from Apify dataset',
            };
        }

        const posts: ApifyInstagramPost[] = await datasetResponse.json();

        return {
            success: true,
            posts,
        };
    } catch (error) {
        return {
            success: false,
            posts: [],
            error: error instanceof Error ? error.message : 'Unknown error',
        };
    }
}

// Transform Apify data to our schema format
export function transformApifyPost(post: ApifyInstagramPost, accountHandle: string) {
    return {
        platform: 'instagram',
        accountHandle,
        postId: post.id || post.shortCode,
        postUrl: post.url,
        postTimestamp: post.timestamp ? new Date(post.timestamp) : null,
        captionText: post.caption,
        mediaType: post.type?.toLowerCase() === 'sidecar' ? 'carousel' : post.type?.toLowerCase() || 'image',
        mediaUrls: post.images?.length ? post.images : [post.displayUrl],
        hashtags: post.hashtags || [],
        mentions: post.mentions || [],
        likesCount: post.likesCount || null,
        commentsCount: post.commentsCount || null,
    };
}

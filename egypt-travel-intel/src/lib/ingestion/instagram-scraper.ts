/**
 * Direct Instagram Public Scraper
 * 
 * Fetches public Instagram profile data using Instagram's web interface.
 * No API key required - scrapes public HTML/JSON endpoints.
 */

export interface InstagramPost {
    id: string;
    shortcode: string;
    url: string;
    caption: string | null;
    timestamp: string | null;
    type: 'image' | 'video' | 'carousel';
    thumbnailUrl: string | null;
    likesCount: number | null;
    commentsCount: number | null;
}

export interface InstagramProfile {
    username: string;
    fullName: string | null;
    biography: string | null;
    followersCount: number | null;
    postsCount: number | null;
    profilePicUrl: string | null;
    posts: InstagramPost[];
}

export interface ScrapeResult {
    success: boolean;
    profile: InstagramProfile | null;
    error?: string;
}

// User agents to rotate
const USER_AGENTS = [
    'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36',
    'Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36',
    'Mozilla/5.0 (Windows NT 10.0; Win64; x64; rv:121.0) Gecko/20100101 Firefox/121.0',
];

function getRandomUserAgent(): string {
    return USER_AGENTS[Math.floor(Math.random() * USER_AGENTS.length)];
}

/**
 * Scrape Instagram profile using the public web endpoint
 */
const GRAPHQL_QUERY_HASH = 'e769aa130647d2354c40ea6a439bfc08'; // User Feed Hash (more reliable for pagination)

// Sleep helper for polite scraping
const sleep = (ms: number) => new Promise(r => setTimeout(r, ms));

export async function scrapeInstagramProfile(username: string, maxPosts: number = 20): Promise<ScrapeResult> {
    try {
        console.log(`🔍 [Scraper] Fetching profile for @${username}...`);

        // 1. Initial Profile Fetch (web_profile_info)
        const url = `https://www.instagram.com/api/v1/users/web_profile_info/?username=${username}`;
        const response = await fetch(url, {
            headers: {
                'User-Agent': getRandomUserAgent(),
                'X-IG-App-ID': '936619743392459',
                'X-Requested-With': 'XMLHttpRequest',
                'Referer': `https://www.instagram.com/${username}/`,
            },
        });

        if (!response.ok) {
            console.warn(`⚠️ Primary endpoint failed for @${username}, falling back to HTML`);
            return await scrapeProfileFromHTML(username);
        }

        const data = await response.json();
        const user = data?.data?.user;

        if (!user) return await scrapeProfileFromHTML(username);

        const activePosts: InstagramPost[] = [];
        const timeline = user.edge_owner_to_timeline_media;
        let edges = timeline?.edges || [];

        // Process initial batch
        activePosts.push(...processEdges(edges));

        // 2. Pagination Loop (Deep Scan)
        let hasNextPage = timeline?.page_info?.has_next_page;
        let endCursor = timeline?.page_info?.end_cursor;
        let userId = user.id;

        while (hasNextPage && activePosts.length < maxPosts) {
            console.log(`⏳ [Scraper] Pagination: Fetching more for @${username} (Current: ${activePosts.length})...`);

            // Random delay to behave like a human (2-5 seconds)
            await sleep(2000 + Math.random() * 3000);

            try {
                const variables = JSON.stringify({
                    id: userId,
                    first: 50, // Try to grab chunks of 50
                    after: endCursor
                });

                const nextUrl = `https://www.instagram.com/graphql/query/?query_hash=${GRAPHQL_QUERY_HASH}&variables=${encodeURIComponent(variables)}`;
                const nextResp = await fetch(nextUrl, {
                    headers: {
                        'User-Agent': getRandomUserAgent(),
                        'X-IG-App-ID': '936619743392459',
                    }
                });

                if (!nextResp.ok) break;

                const nextJson = await nextResp.json();
                const nextTimeline = nextJson?.data?.user?.edge_owner_to_timeline_media;

                if (!nextTimeline) break;

                const newEdges = nextTimeline.edges || [];
                activePosts.push(...processEdges(newEdges));

                hasNextPage = nextTimeline.page_info?.has_next_page;
                endCursor = nextTimeline.page_info?.end_cursor;

            } catch (err) {
                console.error(`❌ Pagination error for @${username}:`, err);
                break;
            }
        }

        return {
            success: true,
            profile: {
                username: user.username,
                fullName: user.full_name || null,
                biography: user.biography || null,
                followersCount: user.edge_followed_by?.count || null,
                postsCount: user.edge_owner_to_timeline_media?.count || null,
                profilePicUrl: user.profile_pic_url_hd || user.profile_pic_url || null,
                posts: activePosts.slice(0, maxPosts), // Trim to requested limit
            },
        };

    } catch (error) {
        console.error(`Error scraping @${username}:`, error);
        return await scrapeProfileFromHTML(username);
    }
}

// Helper to process raw edges into InstagramPost objects
function processEdges(edges: any[]): InstagramPost[] {
    return edges.map(edge => {
        const node = edge.node;
        return {
            id: node.id,
            shortcode: node.shortcode,
            url: `https://www.instagram.com/p/${node.shortcode}/`,
            caption: node.edge_media_to_caption?.edges?.[0]?.node?.text || null,
            timestamp: node.taken_at_timestamp ? new Date(node.taken_at_timestamp * 1000).toISOString() : null,
            type: node.__typename === 'GraphVideo' ? 'video' : node.__typename === 'GraphSidecar' ? 'carousel' : 'image',
            thumbnailUrl: node.thumbnail_src || node.display_url || null,
            likesCount: node.edge_liked_by?.count || null,
            commentsCount: node.edge_media_to_comment?.count || null,
        };
    });
}


/**
 * Fallback: Scrape from HTML page
 */
async function scrapeProfileFromHTML(username: string): Promise<ScrapeResult> {
    try {
        const url = `https://www.instagram.com/${username}/`;

        const response = await fetch(url, {
            headers: {
                'User-Agent': getRandomUserAgent(),
                'Accept': 'text/html,application/xhtml+xml,application/xml;q=0.9,image/avif,image/webp,*/*;q=0.8',
                'Accept-Language': 'en-US,en;q=0.9',
            },
        });

        if (!response.ok) {
            return {
                success: false,
                profile: null,
                error: `HTTP ${response.status}: ${response.statusText}`,
            };
        }

        const html = await response.text();

        // Try to extract shared data JSON
        const sharedDataMatch = html.match(/window\._sharedData\s*=\s*({.+?});/);
        const additionalDataMatch = html.match(/window\.__additionalDataLoaded\s*\([^,]+,\s*({.+?})\);/);

        let userData = null;

        if (sharedDataMatch) {
            try {
                const sharedData = JSON.parse(sharedDataMatch[1]);
                userData = sharedData?.entry_data?.ProfilePage?.[0]?.graphql?.user;
            } catch {
                // JSON parse failed
            }
        }

        if (!userData && additionalDataMatch) {
            try {
                const additionalData = JSON.parse(additionalDataMatch[1]);
                userData = additionalData?.graphql?.user;
            } catch {
                // JSON parse failed
            }
        }

        // If no JSON data found, try regex patterns for basic info
        if (!userData) {
            const fullNameMatch = html.match(/"full_name":"([^"]+)"/);
            const bioMatch = html.match(/"biography":"([^"]+)"/);
            const followersMatch = html.match(/"edge_followed_by":\{"count":(\d+)\}/);

            return {
                success: true,
                profile: {
                    username,
                    fullName: fullNameMatch ? fullNameMatch[1] : null,
                    biography: bioMatch ? bioMatch[1] : null,
                    followersCount: followersMatch ? parseInt(followersMatch[1]) : null,
                    postsCount: null,
                    profilePicUrl: null,
                    posts: [], // Can't extract posts without proper data
                },
            };
        }

        const posts: InstagramPost[] = [];
        const edges = userData.edge_owner_to_timeline_media?.edges || [];

        // UNLOCKED: Process all available posts
        for (const edge of edges) {
            const node = edge.node;
            posts.push({
                id: node.id,
                shortcode: node.shortcode,
                url: `https://www.instagram.com/p/${node.shortcode}/`,
                caption: node.edge_media_to_caption?.edges?.[0]?.node?.text || null,
                timestamp: node.taken_at_timestamp ? new Date(node.taken_at_timestamp * 1000).toISOString() : null,
                type: node.__typename === 'GraphVideo' ? 'video' : node.__typename === 'GraphSidecar' ? 'carousel' : 'image',
                thumbnailUrl: node.thumbnail_src || node.display_url || null,
                likesCount: node.edge_liked_by?.count || null,
                commentsCount: node.edge_media_to_comment?.count || null,
            });
        }

        return {
            success: true,
            profile: {
                username: userData.username,
                fullName: userData.full_name || null,
                biography: userData.biography || null,
                followersCount: userData.edge_followed_by?.count || null,
                postsCount: userData.edge_owner_to_timeline_media?.count || null,
                profilePicUrl: userData.profile_pic_url_hd || userData.profile_pic_url || null,
                posts,
            },
        };
    } catch (error) {
        return {
            success: false,
            profile: null,
            error: error instanceof Error ? error.message : 'Unknown error',
        };
    }
}

/**
 * Transform Instagram post to our schema format
 */
export function transformInstagramPost(post: InstagramPost, accountHandle: string) {
    return {
        platform: 'instagram',
        accountHandle,
        postId: post.id || post.shortcode,
        postUrl: post.url,
        postTimestamp: post.timestamp ? new Date(post.timestamp) : null,
        captionText: post.caption,
        mediaType: post.type,
        mediaUrls: JSON.stringify(post.thumbnailUrl ? [post.thumbnailUrl] : []),
        hashtags: JSON.stringify(extractHashtags(post.caption || '')),
        mentions: JSON.stringify(extractMentions(post.caption || '')),
        likesCount: post.likesCount,
        commentsCount: post.commentsCount,
    };
}

function extractHashtags(text: string): string[] {
    const matches = text.match(/#[\w\u0600-\u06FF]+/g);
    return matches ? matches.map(h => h.slice(1)) : [];
}

function extractMentions(text: string): string[] {
    const matches = text.match(/@[\w.]+/g);
    return matches ? matches.map(m => m.slice(1)) : [];
}

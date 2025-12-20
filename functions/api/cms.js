// Cloudflare Pages Function - CMS API (DIRECT - No Vercel Proxy)
// Connects directly to JSONBlob for persistence

const BLOB_ID = '019b326d-2968-77d3-ae7d-c043fa08d324'; // NEW BLOB - Created 2025-12-18
const BLOB_URL = `https://jsonblob.com/api/jsonBlob/${BLOB_ID}`;

const INITIAL_DATA = {
    lessons: [
        { id: 'l-101', title: 'What is a Stock?', description: 'Concept of ownership.', category: 'basics', difficulty: 'beginner', duration: 5, xpReward: 50, coinReward: 25, isPublished: true, order: 1 },
        { id: 'l-102', title: 'Stock Exchanges', description: 'Where trading happens.', category: 'basics', difficulty: 'beginner', duration: 5, xpReward: 50, coinReward: 25, isPublished: true, order: 2 },
        { id: 'l-103', title: 'Market Orders vs Limit', description: 'Execution types.', category: 'basics', difficulty: 'intermediate', duration: 10, xpReward: 75, coinReward: 35, isPublished: true, order: 3 },
    ],
    challenges: [
        { id: 'c-1', title: 'Early Bird', description: 'Login before 9 AM', type: 'daily', coinReward: 20, xpReward: 10, isActive: true },
        { id: 'c-2', title: 'News Buff', description: 'Read 3 articles', type: 'daily', coinReward: 30, xpReward: 15, isActive: true },
    ],
    achievements: [
        { id: 'a-1', title: 'Newbie', description: 'Registered account', rarity: 'common', xpReward: 10 },
        { id: 'a-2', title: 'First Blood', description: 'First profitable trade', rarity: 'common', xpReward: 50 },
    ],
    shopItems: [
        { id: 's-1', name: 'Bull Avatar', category: 'avatars', price: 500, isAvailable: true },
        { id: 's-2', name: 'Gold Frame', category: 'frames', price: 2000, isAvailable: true },
    ],
    news: [
        { id: 'n-1', title: 'Markets Rally', summary: 'Strong earnings drive gains', isPublished: true },
    ],
    announcements: [
        { id: 'an-1', title: 'Welcome!', message: 'Thanks for joining.', type: 'info', isActive: true },
    ],
    contests: [
        { id: 'co-1', name: 'Daily Sprint', isActive: true },
    ],
    users: [
        { id: 'u-1', name: 'Admin', role: 'admin', status: 'active' },
    ],
    notifications: [
        { id: 'not-1', title: 'Welcome', message: 'Welcome to notifications!', type: 'in-app', target: 'all', status: 'sent', sentAt: new Date().toISOString() },
    ]
};

async function getCMSData() {
    const maxRetries = 3;
    for (let i = 0; i < maxRetries; i++) {
        try {
            // Cache-busting to prevent stale reads
            const res = await fetch(`${BLOB_URL}?t=${Date.now()}`, {
                headers: { 'Cache-Control': 'no-cache, no-store, must-revalidate' }
            });

            // If 404, valid case to return initial data (first time setup)
            if (res.status === 404) return INITIAL_DATA;

            // If other error (500, 502, etc), throw to trigger retry or fail safe
            if (!res.ok) throw new Error(`Blob store returned ${res.status}`);

            const data = await res.json();
            // Validate data structure integrity
            if (!data || typeof data !== 'object') throw new Error('Invalid data format');

            // Logic Removed: Manual seed preferred over risky auto-init

            return data;
        } catch (e) {
            console.warn(`Attempt ${i + 1} failed: ${e.message}`);
            if (i === maxRetries - 1) {
                // CRITICAL: New behavior - Do NOT return INITIAL_DATA on failure. 
                // Creating a new item when read fails would wipe the DB. 
                // Better to fail the request than lose data.
                throw new Error('Persistence unavailable');
            }
            // Wait 500ms before retry
            await new Promise(r => setTimeout(r, 500));
        }
    }
}

async function saveCMSData(data) {
    if (!data) throw new Error('Cannot save empty data');

    const res = await fetch(BLOB_URL, {
        method: 'PUT',
        headers: {
            'Content-Type': 'application/json',
            'Cache-Control': 'no-cache, no-store, must-revalidate',
            'Pragma': 'no-cache',
            'Expires': '0'
        },
        body: JSON.stringify(data)
    });

    if (!res.ok) throw new Error('Blob save failed');
}

const generateId = (prefix) => `${prefix}-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`;

export async function onRequest(context) {
    const { request } = context;
    const url = new URL(request.url);

    // CORS headers
    const corsHeaders = {
        'Access-Control-Allow-Origin': '*',
        'Access-Control-Allow-Methods': 'GET, POST, PUT, DELETE, OPTIONS',
        'Access-Control-Allow-Headers': 'Content-Type',
        'Cache-Control': 'no-store, no-cache, must-revalidate'
    };

    if (request.method === 'OPTIONS') {
        return new Response(null, { status: 204, headers: corsHeaders });
    }

    const entity = url.searchParams.get('entity');
    const id = url.searchParams.get('id');
    const method = request.method;

    const validEntities = ['lessons', 'challenges', 'achievements', 'shopItems', 'news', 'announcements', 'contests', 'dashboard', 'users', 'notifications'];

    if (!validEntities.includes(entity)) {
        return new Response(JSON.stringify({ error: `Invalid entity: ${entity}` }), {
            status: 400,
            headers: { 'Content-Type': 'application/json', ...corsHeaders }
        });
    }

    let cmsData = await getCMSData();

    // Dashboard stats
    if (entity === 'dashboard') {
        return new Response(JSON.stringify({
            stats: {
                totalLessons: cmsData.lessons?.length || 0,
                totalChallenges: cmsData.challenges?.length || 0,
                totalAchievements: cmsData.achievements?.length || 0,
                totalShopItems: cmsData.shopItems?.length || 0,
                totalNews: cmsData.news?.length || 0,
                totalAnnouncements: cmsData.announcements?.length || 0,
                totalContests: cmsData.contests?.length || 0,
                totalUsers: cmsData.users?.length || 0,
                totalNotifications: cmsData.notifications?.length || 0,
            }
        }), { status: 200, headers: { 'Content-Type': 'application/json', ...corsHeaders } });
    }

    const prefixMap = { lessons: 'lesson', challenges: 'chal', achievements: 'ach', shopItems: 'shop', news: 'news', announcements: 'ann', contests: 'contest', users: 'user', notifications: 'not' };

    if (!cmsData[entity]) cmsData[entity] = [];

    let result;

    switch (method) {
        case 'GET':
            result = id ? cmsData[entity].find(i => i.id === id) : cmsData[entity];
            return new Response(JSON.stringify(result || []), { status: 200, headers: { 'Content-Type': 'application/json', ...corsHeaders } });

        case 'POST':
            const newItem = { id: generateId(prefixMap[entity]), ...await request.json(), createdAt: new Date().toISOString() };
            cmsData[entity].push(newItem);
            await saveCMSData(cmsData);

            // Debug: Return metadata to help diagnose persistence issues
            const debugPayload = {
                ...newItem,
                _debug: {
                    totalCount: cmsData[entity].length,
                    persistedAt: new Date().toISOString()
                }
            };
            return new Response(JSON.stringify(debugPayload), {
                status: 201,
                headers: { 'Content-Type': 'application/json', ...corsHeaders }
            });

        case 'PUT':
            if (!id) return new Response(JSON.stringify({ error: 'ID required' }), { status: 400, headers: { 'Content-Type': 'application/json', ...corsHeaders } });
            const idx = cmsData[entity].findIndex(i => i.id === id);
            if (idx === -1) return new Response(JSON.stringify({ error: 'Not found' }), { status: 404, headers: { 'Content-Type': 'application/json', ...corsHeaders } });
            cmsData[entity][idx] = { ...cmsData[entity][idx], ...await request.json(), updatedAt: new Date().toISOString() };
            await saveCMSData(cmsData);
            return new Response(JSON.stringify(cmsData[entity][idx]), { status: 200, headers: { 'Content-Type': 'application/json', ...corsHeaders } });

        case 'DELETE':
            if (!id) return new Response(JSON.stringify({ error: 'ID required' }), { status: 400, headers: { 'Content-Type': 'application/json', ...corsHeaders } });
            const delIdx = cmsData[entity].findIndex(i => i.id === id);
            if (delIdx === -1) return new Response(JSON.stringify({ error: 'Not found' }), { status: 404, headers: { 'Content-Type': 'application/json', ...corsHeaders } });
            const deleted = cmsData[entity].splice(delIdx, 1)[0];
            await saveCMSData(cmsData);
            return new Response(JSON.stringify({ message: 'Deleted', item: deleted }), { status: 200, headers: { 'Content-Type': 'application/json', ...corsHeaders } });

        default:
            return new Response(JSON.stringify({ error: 'Method not allowed' }), { status: 405, headers: { 'Content-Type': 'application/json', ...corsHeaders } });
    }
}

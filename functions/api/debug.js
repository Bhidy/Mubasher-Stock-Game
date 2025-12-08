// Cloudflare Pages Function - Debug API
// Returns environment info for debugging

export async function onRequest(context) {
    const { request, env } = context;

    return new Response(JSON.stringify({
        platform: 'Cloudflare Pages',
        timestamp: new Date().toISOString(),
        url: request.url,
        method: request.method,
        headers: Object.fromEntries(request.headers),
        env_vars: {
            GROQ_API_KEY: env.GROQ_API_KEY ? 'SET' : 'NOT SET'
        }
    }, null, 2), {
        status: 200,
        headers: {
            'Content-Type': 'application/json',
            'Access-Control-Allow-Origin': '*'
        }
    });
}

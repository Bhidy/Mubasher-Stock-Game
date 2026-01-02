export async function onRequest(context) {
    return new Response(JSON.stringify({
        status: "Deployment Working",
        time: new Date().toISOString(),
        env: "Cloudflare"
    }), {
        headers: { 'Content-Type': 'application/json' }
    });
}

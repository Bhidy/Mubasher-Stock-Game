export async function onRequest(context) {
    return new Response(JSON.stringify({ status: "ok", message: "PROFILE DEBUG: Deployment Verified" }), {
        headers: { "Content-Type": "application/json" }
    });
}

export async function onRequest(context) {
    return new Response(JSON.stringify({ status: "ok", message: "Debug successful" }), {
        headers: { "Content-Type": "application/json" }
    });
}

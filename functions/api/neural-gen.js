/**
 * Cloudflare Pages Function: /api/neural-gen
 * "The Turbo Engine"
 * Directly calls Groq with Llama-3.1-8b-instant for sub-2s latency.
 * Eliminates Vercel Proxy timeouts.
 */

export async function onRequestPost({ request, env }) {
    const corsHeaders = {
        'Access-Control-Allow-Origin': '*',
        'Access-Control-Allow-Methods': 'POST, OPTIONS',
        'Access-Control-Allow-Headers': 'Content-Type',
        'Content-Type': 'application/json'
    };

    try {
        const { title, content, targetMarket = 'SA', targetLanguage = 'ar' } = await request.json();

        // 1. Validation
        if (!title || !content) {
            throw new Error('Missing title or content');
        }

        // 2. Fast-Path Prompt (Optimized for 8b model)
        const systemPrompt = `You are a professional financial editor.
Rewrite the following news article for the ${targetMarket} market in ${targetLanguage === 'ar' ? 'Arabic' : 'English'}.
Strictly output ONLY valid JSON.
Format: {"title": "New Title", "content": "Rewritten content...", "summary": "Short summary"}`;

        // 3. Direct Groq Call (No Proxy)
        const apiKey = env.GROQ_API_KEY;
        if (!apiKey) throw new Error('Server Config Error: GROQ_API_KEY missing');

        const groqRes = await fetch('https://api.groq.com/openai/v1/chat/completions', {
            method: 'POST',
            headers: {
                'Authorization': `Bearer ${apiKey}`,
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({
                model: 'llama-3.1-8b-instant', // <--- THE SPEED FIX
                messages: [
                    { role: 'system', content: systemPrompt },
                    { role: 'user', content: `Title: ${title}\nContent: ${content.substring(0, 3000)}` }
                ],
                temperature: 0.3, // Lower temp for reliability
                max_tokens: 1024,
                response_format: { type: "json_object" } // Force JSON
            })
        });

        if (!groqRes.ok) {
            throw new Error(`Groq AI Error: ${groqRes.status}`);
        }

        const groqData = await groqRes.json();
        const aiJson = JSON.parse(groqData.choices[0].message.content);

        // 4. Return Success
        return new Response(JSON.stringify({
            ...aiJson,
            provider: 'Groq-8b-Instant',
            latency: 'Ultra-Fast'
        }), { headers: corsHeaders });

    } catch (error) {
        // 5. Fallback: Return original
        console.error("Neural Gen Error:", error);
        return new Response(JSON.stringify({
            title: "Error: " + error.message,
            content: "Could not regenerate. Please try again.",
            summary: "Error",
            fallback: true
        }), { status: 200, headers: corsHeaders }); // Return 200 with error msg to prevent parsing crash
    }
}

export async function onRequestOptions() {
    return new Response(null, {
        headers: {
            'Access-Control-Allow-Origin': '*',
            'Access-Control-Allow-Methods': 'POST, OPTIONS',
            'Access-Control-Allow-Headers': 'Content-Type'
        }
    });
}

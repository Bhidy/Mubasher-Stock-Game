/**
 * Cloudflare Pages Function: /api/ai-rewrite
 * AI-powered article rewriting using Groq (same as Hero AI chatbot)
 * Proxies to Vercel API which has Groq configured
 */

const VERCEL_CHATBOT_URL = 'https://bhidy.vercel.app/api/chatbot';

// System prompt for article rewriting
const getRewritePrompt = (targetMarket, targetLanguage, tone = 'professional') => `
You are a financial news rewriter for a multi-market trading app.

TASK: Rewrite the provided news article following these STRICT rules:

ACCURACY RULES (CRITICAL):
- All facts, numbers, tickers, company names, and dates must remain 100% accurate
- Preserve all tickers exactly (e.g. 2222.SR, AAPL)
- Preserve all prices, percentages, and quantities exactly
- Never invent or guess new facts or numbers
- Keep any disclaimers, legal text, or risk warnings
- Keep the exact meaning of any quotes
- Do NOT give buy/sell/hold recommendations

LANGUAGE & MARKET TONE:
Target Market: ${targetMarket}
Target Language: ${targetLanguage}
Tone: ${tone}

${targetLanguage === 'ar' ? `
ARABIC RULES:
- ${targetMarket === 'SA' ? 'Use modern Saudi Arabic, professional financial-news tone. Friendly but serious.' : ''}
- ${targetMarket === 'EG' ? 'Use modern Egyptian Arabic for online financial news. Conversational but professional.' : ''}
- For other Arab markets: Use neutral Modern Standard Arabic.
- Make text flow naturally for mobile reading.
` : `
ENGLISH RULES:
- Use clear, neutral business English for global markets
- Short paragraphs and direct sentences
`}

STRUCTURE:
- Strong first paragraph: who, what, where, when
- 2-6 short paragraphs with details and context
- Keep paragraphs short (3-4 sentences max) for mobile

OUTPUT FORMAT:
Return ONLY a JSON object like this:
{"title": "The rewritten title", "content": "The full rewritten article", "summary": "1-2 sentence summary"}

No explanation, no markdown, just the JSON.`;

export async function onRequestPost(context) {
    const corsHeaders = {
        'Access-Control-Allow-Origin': '*',
        'Access-Control-Allow-Methods': 'POST, OPTIONS',
        'Access-Control-Allow-Headers': 'Content-Type',
        'Content-Type': 'application/json'
    };

    try {
        const body = await context.request.json();
        const { title, content, targetMarket = 'SA', targetLanguage = 'ar', tone = 'professional' } = body;

        if (!title || !content) {
            return new Response(JSON.stringify({
                error: 'Missing title or content'
            }), { status: 400, headers: corsHeaders });
        }

        // Create the rewrite prompt
        const systemPrompt = getRewritePrompt(targetMarket, targetLanguage, tone);
        const userMessage = `${systemPrompt}

Please rewrite this article:

TITLE: ${title}

CONTENT:
${content.substring(0, 4000)}`;

        // Call Vercel's Groq-powered chatbot API
        const response = await fetch(VERCEL_CHATBOT_URL, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({
                message: userMessage,
                conversationHistory: []
            })
        });

        if (!response.ok) {
            console.error('Groq API error:', await response.text());
            return handleFallback(title, content, targetMarket, targetLanguage, corsHeaders);
        }

        const data = await response.json();

        if (!data.success || !data.response) {
            return handleFallback(title, content, targetMarket, targetLanguage, corsHeaders);
        }

        // Parse JSON from Groq response
        let result;
        try {
            const jsonMatch = data.response.match(/\{[\s\S]*\}/);
            if (jsonMatch) {
                result = JSON.parse(jsonMatch[0]);
            } else {
                // If no JSON, use the raw response
                result = {
                    title: title,
                    content: data.response,
                    summary: data.response.substring(0, 200) + '...'
                };
            }
        } catch (parseError) {
            result = {
                title: title,
                content: data.response,
                summary: data.response.substring(0, 200) + '...'
            };
        }

        // Add metadata
        result.market = targetMarket;
        result.language = targetLanguage;
        result.tone = tone;
        result.wordCount = (result.content || '').split(/\s+/).length;
        result.readingTime = Math.ceil(result.wordCount / 200) + ' min';
        result.provider = 'Groq';
        result.model = 'llama-3.3-70b-versatile';

        return new Response(JSON.stringify(result), { headers: corsHeaders });

    } catch (error) {
        console.error('AI Rewrite error:', error);
        return new Response(JSON.stringify({
            error: 'Rewrite failed',
            message: error.message
        }), { status: 500, headers: corsHeaders });
    }
}

// Fallback when Groq API fails - uses translation
async function handleFallback(title, content, targetMarket, targetLanguage, corsHeaders) {
    if (targetLanguage === 'ar') {
        try {
            const translateRes = await fetch('https://bhidy.vercel.app/api/translate', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ text: `${title}\n\n${content}`, targetLang: 'ar' })
            });

            if (translateRes.ok) {
                const translateData = await translateRes.json();
                if (translateData.translatedText) {
                    const lines = translateData.translatedText.split('\n');
                    return new Response(JSON.stringify({
                        title: lines[0] || title,
                        content: lines.slice(2).join('\n') || translateData.translatedText,
                        summary: lines.slice(2, 4).join(' ').substring(0, 200),
                        market: targetMarket,
                        language: targetLanguage,
                        tone: 'professional',
                        wordCount: translateData.translatedText.split(/\s+/).length,
                        readingTime: Math.ceil(translateData.translatedText.split(/\s+/).length / 200) + ' min',
                        fallback: true,
                        provider: 'Translation API'
                    }), { headers: corsHeaders });
                }
            }
        } catch (e) {
            console.error('Translation fallback failed:', e);
        }
    }

    // Return original with formatting note
    return new Response(JSON.stringify({
        title: title,
        content: content,
        summary: content.substring(0, 200) + '...',
        market: targetMarket,
        language: targetLanguage,
        wordCount: content.split(/\s+/).length,
        readingTime: Math.ceil(content.split(/\s+/).length / 200) + ' min',
        fallback: true,
        message: 'AI rewrite unavailable. Original content shown.'
    }), { headers: corsHeaders });
}

// Handle CORS preflight
export async function onRequestOptions() {
    return new Response(null, {
        headers: {
            'Access-Control-Allow-Origin': '*',
            'Access-Control-Allow-Methods': 'POST, OPTIONS',
            'Access-Control-Allow-Headers': 'Content-Type'
        }
    });
}

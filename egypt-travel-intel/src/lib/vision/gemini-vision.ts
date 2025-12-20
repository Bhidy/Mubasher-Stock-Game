/**
 * Gemini Vision Service - FREE Image Analysis
 * 
 * Extracts travel offer data from Instagram post images using Google Gemini.
 * FREE: 1,500 requests/day with Google AI Studio key
 */

const GEMINI_API_KEY = process.env.GEMINI_API_KEY;
// Google AI Studio endpoint with Gemini 2.5 Flash (confirmed available)
const GEMINI_MODEL = 'gemini-2.5-flash';
const GEMINI_API_URL = `https://generativelanguage.googleapis.com/v1beta/models/${GEMINI_MODEL}:generateContent`;







export interface ImageAnalysisResult {
    success: boolean;
    rawText: string | null;
    extracted: {
        prices: Array<{ amount: number; currency: string; type: string }>;
        dates: { departure: string | null; return: string | null } | null;
        duration: { nights: number; days: number } | null;
        destination: string | null;
        destinationType: 'inbound' | 'outbound' | null;
        hotel: string | null;
        starRating: string | null;
        boardType: string | null;
        phone: string | null;
        whatsapp: string | null;
        inclusions: string[];
        agency: string | null;
        offerType: string | null;
    };
    confidence: number;
    error?: string;
}

const EXTRACTION_PROMPT = `You are an expert travel offer analyzer specializing in Egyptian travel agencies. 
Analyze this travel promotional image and extract ALL visible information.

Return ONLY valid JSON (no markdown, no explanation) with this exact structure:
{
  "rawText": "all visible text transcribed exactly as shown",
  "prices": [
    { "amount": 27285, "currency": "EGP", "type": "per_person" }
  ],
  "dates": {
    "departure": "28 Dec 2024",
    "return": "1 Jan 2025"
  },
  "duration": {
    "nights": 4,
    "days": 5
  },
  "destination": "Beirut, Lebanon",
  "destinationType": "outbound",
  "hotel": "Hilton Beirut",
  "starRating": "5",
  "boardType": "All Inclusive",
  "phone": "01234567890",
  "whatsapp": "01234567890",
  "inclusions": ["flights", "hotel", "transfers", "breakfast"],
  "agency": "Excel Travel",
  "offerType": "package",
  "confidence": 0.95
}

CRITICAL RULES:
1. Extract ALL prices visible (multiple price tiers if shown)
2. Identify currency: EGP (Egyptian Pound), USD, SAR (Saudi Riyal), AED, EUR
3. Parse Arabic text too: تليفون=phone, سعر=price, ليالي=nights, أيام=days, شامل=inclusive
4. "Per person / للفرد" vs "Per couple / للزوجين" - specify in type
5. Destinations FROM Egypt = "outbound", TO Egypt = "inbound"
6. Look for: شرم الشيخ (Sharm), الغردقة (Hurghada), الأقصر (Luxor), أسوان (Aswan)
7. Hotel names, star ratings (5 نجوم = 5 stars)
8. Board types: All Inclusive, Half Board, BB (Bed & Breakfast), FB (Full Board)
9. Phone/WhatsApp numbers (Egyptian format: 01xxxxxxxxx)
10. If something is NOT visible, use null - NEVER guess
11. Confidence: 0.0-1.0 based on clarity of extraction`;

async function fetchImageAsBase64(imageUrl: string): Promise<string | null> {
    try {
        const response = await fetch(imageUrl);
        if (!response.ok) return null;

        const arrayBuffer = await response.arrayBuffer();
        const base64 = Buffer.from(arrayBuffer).toString('base64');
        return base64;
    } catch (error) {
        console.error('Failed to fetch image:', error);
        return null;
    }
}

export async function analyzeImageWithGemini(imageUrl: string): Promise<ImageAnalysisResult> {
    const emptyResult: ImageAnalysisResult = {
        success: false,
        rawText: null,
        extracted: {
            prices: [],
            dates: null,
            duration: null,
            destination: null,
            destinationType: null,
            hotel: null,
            starRating: null,
            boardType: null,
            phone: null,
            whatsapp: null,
            inclusions: [],
            agency: null,
            offerType: null,
        },
        confidence: 0,
    };

    if (!GEMINI_API_KEY) {
        console.error('❌ GEMINI_API_KEY not configured');
        return { ...emptyResult, error: 'API key not configured' };
    }

    if (!imageUrl) {
        return { ...emptyResult, error: 'No image URL provided' };
    }

    try {
        console.log(`🔍 Analyzing image: ${imageUrl.substring(0, 50)}...`);

        // Fetch and convert image to base64
        const base64Image = await fetchImageAsBase64(imageUrl);
        if (!base64Image) {
            return { ...emptyResult, error: 'Failed to fetch image' };
        }

        // Determine mime type
        const mimeType = imageUrl.includes('.png') ? 'image/png' : 'image/jpeg';

        // Call Gemini API
        const response = await fetch(`${GEMINI_API_URL}?key=${GEMINI_API_KEY}`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({
                contents: [{
                    parts: [
                        { text: EXTRACTION_PROMPT },
                        {
                            inline_data: {
                                mime_type: mimeType,
                                data: base64Image
                            }
                        }
                    ]
                }],
                generationConfig: {
                    temperature: 0.1,
                    topK: 1,
                    topP: 1,
                    maxOutputTokens: 2048,
                }
            }),
        });

        if (!response.ok) {
            const errorText = await response.text();
            console.error('Gemini API error response:', response.status, errorText);
            return { ...emptyResult, error: `API error ${response.status}: ${errorText.substring(0, 200)}` };
        }

        const data = await response.json();

        // Extract the text response
        const textResponse = data.candidates?.[0]?.content?.parts?.[0]?.text;
        if (!textResponse) {
            return { ...emptyResult, error: 'No response from Gemini' };
        }

        // Parse JSON from response (handle potential markdown wrapping)
        let jsonStr = textResponse.trim();
        if (jsonStr.startsWith('```json')) {
            jsonStr = jsonStr.slice(7);
        }
        if (jsonStr.startsWith('```')) {
            jsonStr = jsonStr.slice(3);
        }
        if (jsonStr.endsWith('```')) {
            jsonStr = jsonStr.slice(0, -3);
        }
        jsonStr = jsonStr.trim();

        const parsed = JSON.parse(jsonStr);

        console.log(`✅ Image analyzed: ${parsed.prices?.length || 0} prices, destination: ${parsed.destination || 'unknown'}`);

        return {
            success: true,
            rawText: parsed.rawText || null,
            extracted: {
                prices: parsed.prices || [],
                dates: parsed.dates || null,
                duration: parsed.duration || null,
                destination: parsed.destination || null,
                destinationType: parsed.destinationType || null,
                hotel: parsed.hotel || null,
                starRating: parsed.starRating || null,
                boardType: parsed.boardType || null,
                phone: parsed.phone || null,
                whatsapp: parsed.whatsapp || null,
                inclusions: parsed.inclusions || [],
                agency: parsed.agency || null,
                offerType: parsed.offerType || null,
            },
            confidence: parsed.confidence || 0.5,
        };

    } catch (error) {
        console.error('Image analysis failed:', error);
        return {
            ...emptyResult,
            error: error instanceof Error ? error.message : 'Unknown error'
        };
    }
}

/**
 * Merge image-extracted data with caption-detected data
 * Priority: Image data > Caption data (images are more reliable for prices/dates)
 */
export function mergeExtractionData(
    captionData: Partial<ImageAnalysisResult['extracted']>,
    imageData: ImageAnalysisResult
): ImageAnalysisResult['extracted'] & { priceSource: string; confidence: number } {

    const img = imageData.extracted;

    // For prices, prefer image if available (more accurate typography)
    const prices = img.prices.length > 0 ? img.prices : (captionData.prices || []);
    const priceSource = img.prices.length > 0 ? 'image' : 'caption';

    return {
        prices,
        dates: img.dates || captionData.dates || null,
        duration: img.duration || captionData.duration || null,
        destination: img.destination || captionData.destination || null,
        destinationType: img.destinationType || captionData.destinationType || null,
        hotel: img.hotel || captionData.hotel || null,
        starRating: img.starRating || captionData.starRating || null,
        boardType: img.boardType || captionData.boardType || null,
        phone: img.phone || captionData.phone || null,
        whatsapp: img.whatsapp || captionData.whatsapp || null,
        inclusions: [...new Set([...(img.inclusions || []), ...(captionData.inclusions || [])])],
        agency: img.agency || captionData.agency || null,
        offerType: img.offerType || captionData.offerType || null,
        priceSource,
        confidence: Math.max(imageData.confidence, 0.5),
    };
}

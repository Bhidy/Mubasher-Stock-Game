import { NextResponse } from 'next/server';
import { analyzeImageWithGemini } from '@/lib/vision';

export const dynamic = 'force-dynamic';
export const maxDuration = 60;

/**
 * Test endpoint for Gemini Vision image analysis
 * POST /api/admin/test-vision
 * Body: { imageUrl: "https://..." }
 */
export async function POST(request: Request) {
    try {
        const body = await request.json();
        const { imageUrl } = body;

        if (!imageUrl) {
            return NextResponse.json(
                { error: 'imageUrl is required' },
                { status: 400 }
            );
        }

        console.log('🔍 Testing vision analysis for:', imageUrl);

        const result = await analyzeImageWithGemini(imageUrl);

        return NextResponse.json({
            success: result.success,
            analysis: result,
            timestamp: new Date().toISOString(),
        });
    } catch (error) {
        console.error('Vision test error:', error);
        return NextResponse.json(
            { error: error instanceof Error ? error.message : 'Unknown error' },
            { status: 500 }
        );
    }
}

export async function GET() {
    return NextResponse.json({
        message: 'POST to this endpoint with { imageUrl: "..." } to test vision analysis',
        example: {
            imageUrl: 'https://instagram.com/p/xxx/media/?size=l'
        }
    });
}

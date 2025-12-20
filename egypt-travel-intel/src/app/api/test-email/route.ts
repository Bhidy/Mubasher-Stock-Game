import { NextResponse } from 'next/server';
import { sendIngestionReport } from '@/lib/email';
import { v4 as uuidv4 } from 'uuid';

export const dynamic = 'force-dynamic';

export async function GET() {
    try {
        console.log('📧 Sending immediate test email...');

        await sendIngestionReport({
            runId: 'TEST-' + uuidv4().substring(0, 8),
            timestamp: new Date(),
            type: 'pulse',
            stats: {
                postsScanned: 1240,
                newOffersFound: 85,
                accountsScraped: 93,
                yieldRate: 6.8,
                activeAgencies: 15,
                durationSeconds: 125,
                topDestinations: [
                    { name: 'Sharm El Sheikh', count: 42 },
                    { name: 'Hurghada', count: 28 },
                    { name: 'Dahab', count: 15 }
                ],
            },
            highlights: [
                {
                    agency: 'travistaegypt',
                    offerType: 'package',
                    destination: 'Sharm El Sheikh',
                    price: 15000,
                    currency: 'EGP',
                    confidence: 0.98,
                    caption: 'Amazing summer offer! 4 days 3 nights at Rixos Seagate including flights...'
                },
                {
                    agency: 'bluebus',
                    offerType: 'transport',
                    destination: 'Dahab',
                    price: 450,
                    currency: 'EGP',
                    confidence: 0.95,
                    caption: 'Daily trips to Dahab starting from 450 EGP. Book your seat now!'
                }
            ],
            status: 'success'
        });

        return NextResponse.json({ success: true, message: 'Test email sent' });
    } catch (error) {
        console.error('Test email failed:', error);
        return NextResponse.json({ error: 'Failed to send test email' }, { status: 500 });
    }
}

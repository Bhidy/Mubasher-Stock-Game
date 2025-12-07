export default function handler(req, res) {
    res.status(200).json({
        status: 'online',
        version: '2.0.0-real-data-only',
        deployedAt: '2025-12-07T12:25:00Z',
        timestamp: new Date().toISOString(),
        env: process.env.NODE_ENV || 'production',
        runtime: 'Vercel Serverless Function'
    });
}

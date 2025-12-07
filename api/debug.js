export default function handler(req, res) {
    res.status(200).json({
        status: 'online',
        timestamp: new Date().toISOString(),
        env: process.env.NODE_ENV || 'production',
        runtime: 'Vercel Serverless Function'
    });
}

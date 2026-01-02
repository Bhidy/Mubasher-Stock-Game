export default function handler(req, res) {
    res.status(200).json({
        message: "Deployment Verification",
        timestamp: new Date().toISOString(),
        env: process.env.VERCEL_ENV || 'unknown',
        node: process.version
    });
}

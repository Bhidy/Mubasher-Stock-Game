const express = require('express');
const authMiddleware = require('../middleware/auth');
const db = require('../db');

const router = express.Router();

// Get leaderboard
router.get('/', authMiddleware, async (req, res) => {
    try {
        const { period = 'today' } = req.query;

        let timeFilter = "cr.created_at > NOW() - INTERVAL '1 day'";
        if (period === 'yesterday') {
            timeFilter = "cr.created_at > NOW() - INTERVAL '2 days' AND cr.created_at < NOW() - INTERVAL '1 day'";
        }

        const result = await db.query(`
      SELECT 
        cr.rank,
        cr.gain_percent,
        u.id,
        u.name,
        u.level
      FROM contest_results cr
      JOIN users u ON cr.user_id = u.id
      WHERE ${timeFilter}
      ORDER BY cr.rank ASC
      LIMIT 100
    `);

        // Get user's position
        const userPosition = await db.query(`
      SELECT rank, gain_percent
      FROM contest_results
      WHERE user_id = $1 AND ${timeFilter}
      ORDER BY created_at DESC
      LIMIT 1
    `, [req.userId]);

        res.json({
            leaderboard: result.rows,
            user_position: userPosition.rows[0] || null,
        });
    } catch (error) {
        console.error(error);
        res.status(500).json({ error: 'Server error' });
    }
});

module.exports = router;

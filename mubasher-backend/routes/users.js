const express = require('express');
const authMiddleware = require('../middleware/auth');
const db = require('../db');

const router = express.Router();

// Get user profile
router.get('/profile', authMiddleware, async (req, res) => {
    try {
        const result = await db.query(
            'SELECT id, email, name, coins, level, rank, streak, xp, created_at FROM users WHERE id = $1',
            [req.userId]
        );

        if (result.rows.length === 0) {
            return res.status(404).json({ error: 'User not found' });
        }

        res.json(result.rows[0]);
    } catch (error) {
        console.error(error);
        res.status(500).json({ error: 'Server error' });
    }
});

// Update user profile
router.put('/profile', authMiddleware, async (req, res) => {
    try {
        const { name } = req.body;

        const result = await db.query(
            'UPDATE users SET name = $1 WHERE id = $2 RETURNING id, email, name, coins, level, rank',
            [name, req.userId]
        );

        res.json(result.rows[0]);
    } catch (error) {
        console.error(error);
        res.status(500).json({ error: 'Server error' });
    }
});

// Get user stats
router.get('/stats', authMiddleware, async (req, res) => {
    try {
        const user = await db.query('SELECT * FROM users WHERE id = $1', [req.userId]);
        const picks = await db.query('SELECT COUNT(*) as total_picks FROM picks WHERE user_id = $1', [req.userId]);
        const wins = await db.query('SELECT COUNT(*) as wins FROM contest_results WHERE user_id = $1 AND rank <= 100', [req.userId]);

        res.json({
            user: user.rows[0],
            total_picks: picks.rows[0].total_picks,
            wins: wins.rows[0].wins,
        });
    } catch (error) {
        console.error(error);
        res.status(500).json({ error: 'Server error' });
    }
});

module.exports = router;

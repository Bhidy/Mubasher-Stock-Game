const express = require('express');
const authMiddleware = require('../middleware/auth');
const db = require('../db');

const router = express.Router();

// Create picks for today's contest
router.post('/', authMiddleware, async (req, res) => {
    try {
        const { stock_ids } = req.body; // Array of 3 stock IDs

        if (!stock_ids || stock_ids.length !== 3) {
            return res.status(400).json({ error: 'Must select exactly 3 stocks' });
        }

        // Get current contest
        const contest = await db.query('SELECT * FROM contests WHERE status = $1 ORDER BY created_at DESC LIMIT 1', ['active']);
        if (contest.rows.length === 0) {
            return res.status(404).json({ error: 'No active contest' });
        }

        const contestId = contest.rows[0].id;

        // Check if user already has picks for this contest
        const existing = await db.query('SELECT * FROM picks WHERE user_id = $1 AND contest_id = $2', [req.userId, contestId]);
        if (existing.rows.length > 0) {
            return res.status(400).json({ error: 'Picks already submitted for this contest' });
        }

        // Create picks
        const picks = [];
        for (const stock_id of stock_ids) {
            const result = await db.query(
                'INSERT INTO picks (user_id, contest_id, stock_id) VALUES ($1, $2, $3) RETURNING *',
                [req.userId, contestId, stock_id]
            );
            picks.push(result.rows[0]);
        }

        res.status(201).json({ picks });
    } catch (error) {
        console.error(error);
        res.status(500).json({ error: 'Server error' });
    }
});

// Get user's picks for current contest
router.get('/my-picks', authMiddleware, async (req, res) => {
    try {
        const contest = await db.query('SELECT * FROM contests WHERE status = $1 ORDER BY created_at DESC LIMIT 1', ['active']);
        if (contest.rows.length === 0) {
            return res.json({ picks: [] });
        }

        const result = await db.query(`
      SELECT p.*, s.ticker, s.name, s.current_price, s.change_percent
      FROM picks p
      JOIN stocks s ON p.stock_id = s.id
      WHERE p.user_id = $1 AND p.contest_id = $2
    `, [req.userId, contest.rows[0].id]);

        res.json({ picks: result.rows });
    } catch (error) {
        console.error(error);
        res.status(500).json({ error: 'Server error' });
    }
});

module.exports = router;

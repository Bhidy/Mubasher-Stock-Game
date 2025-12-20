const express = require('express');
const authMiddleware = require('../middleware/auth');
const db = require('../db');

const router = express.Router();

// Get all stocks
router.get('/', async (req, res) => {
    try {
        const result = await db.query('SELECT * FROM stocks ORDER BY ticker ASC');
        res.json(result.rows);
    } catch (error) {
        console.error(error);
        res.status(500).json({ error: 'Server error' });
    }
});

// Get stock by ticker
router.get('/:ticker', async (req, res) => {
    try {
        const result = await db.query('SELECT * FROM stocks WHERE ticker = $1', [req.params.ticker]);

        if (result.rows.length === 0) {
            return res.status(404).json({ error: 'Stock not found' });
        }

        res.json(result.rows[0]);
    } catch (error) {
        console.error(error);
        res.status(500).json({ error: 'Server error' });
    }
});

// Get trending stocks
router.get('/trending/today', async (req, res) => {
    try {
        const result = await db.query(`
      SELECT s.*, COUNT(p.id) as pick_count
      FROM stocks s
      LEFT JOIN picks p ON s.id = p.stock_id AND p.created_at > NOW() - INTERVAL '1 day'
      GROUP BY s.id
      ORDER BY pick_count DESC
      LIMIT 10
    `);
        res.json(result.rows);
    } catch (error) {
        console.error(error);
        res.status(500).json({ error: 'Server error' });
    }
});

module.exports = router;

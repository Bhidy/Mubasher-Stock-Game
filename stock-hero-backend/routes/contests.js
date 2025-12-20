const express = require('express');
const authMiddleware = require('../middleware/auth');
const db = require('../db');

const router = express.Router();

// Get current contest
router.get('/current', authMiddleware, async (req, res) => {
    try {
        const result = await db.query(`
      SELECT * FROM contests 
      WHERE status = 'active' 
      ORDER BY created_at DESC 
      LIMIT 1
    `);

        if (result.rows.length === 0) {
            return res.status(404).json({ error: 'No active contest' });
        }

        res.json(result.rows[0]);
    } catch (error) {
        console.error(error);
        res.status(500).json({ error: 'Server error' });
    }
});

// Get contest results
router.get('/:id/results', authMiddleware, async (req, res) => {
    try {
        const result = await db.query(`
      SELECT cr.*, u.name, u.email
      FROM contest_results cr
      JOIN users u ON cr.user_id = u.id
      WHERE cr.contest_id = $1
      ORDER BY cr.rank ASC
      LIMIT 100
    `, [req.params.id]);

        res.json(result.rows);
    } catch (error) {
        console.error(error);
        res.status(500).json({ error: 'Server error' });
    }
});

module.exports = router;

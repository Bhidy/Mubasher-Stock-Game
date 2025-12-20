const express = require('express');
const authMiddleware = require('../middleware/auth');
const db = require('../db');

const router = express.Router();

// Get community posts
router.get('/posts', authMiddleware, async (req, res) => {
    try {
        const result = await db.query(`
      SELECT 
        p.*,
        u.name as author_name,
        COUNT(DISTINCT l.id) as like_count,
        COUNT(DISTINCT c.id) as comment_count
      FROM posts p
      JOIN users u ON p.user_id = u.id
      LEFT JOIN post_likes l ON p.id = l.post_id
      LEFT JOIN post_comments c ON p.id = c.post_id
      GROUP BY p.id, u.name
      ORDER BY p.created_at DESC
      LIMIT 50
    `);

        res.json(result.rows);
    } catch (error) {
        console.error(error);
        res.status(500).json({ error: 'Server error' });
    }
});

// Create post
router.post('/posts', authMiddleware, async (req, res) => {
    try {
        const { content } = req.body;

        const result = await db.query(
            'INSERT INTO posts (user_id, content) VALUES ($1, $2) RETURNING *',
            [req.userId, content]
        );

        res.status(201).json(result.rows[0]);
    } catch (error) {
        console.error(error);
        res.status(500).json({ error: 'Server error' });
    }
});

// Like post
router.post('/posts/:id/like', authMiddleware, async (req, res) => {
    try {
        const result = await db.query(
            'INSERT INTO post_likes (user_id, post_id) VALUES ($1, $2) ON CONFLICT DO NOTHING RETURNING *',
            [req.userId, req.params.id]
        );

        res.status(201).json({ liked: true });
    } catch (error) {
        console.error(error);
        res.status(500).json({ error: 'Server error' });
    }
});

// Get discussions
router.get('/discussions', authMiddleware, async (req, res) => {
    try {
        const result = await db.query(`
      SELECT 
        d.*,
        u.name as author_name,
        COUNT(dr.id) as reply_count
      FROM discussions d
      JOIN users u ON d.user_id = u.id
      LEFT JOIN discussion_replies dr ON d.id = dr.discussion_id
      GROUP BY d.id, u.name
      ORDER BY d.created_at DESC
      LIMIT 50
    `);

        res.json(result.rows);
    } catch (error) {
        console.error(error);
        res.status(500).json({ error: 'Server error' });
    }
});

module.exports = router;

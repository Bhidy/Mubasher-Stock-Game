const express = require('express');
const authMiddleware = require('../middleware/auth');
const db = require('../db');

const router = express.Router();

// Get all lessons
router.get('/lessons', authMiddleware, async (req, res) => {
    try {
        const result = await db.query(`
      SELECT 
        l.*,
        CASE WHEN ul.completed_at IS NOT NULL THEN true ELSE false END as completed
      FROM lessons l
      LEFT JOIN user_lessons ul ON l.id = ul.lesson_id AND ul.user_id = $1
      ORDER BY l.order_index ASC
    `, [req.userId]);

        res.json(result.rows);
    } catch (error) {
        console.error(error);
        res.status(500).json({ error: 'Server error' });
    }
});

// Complete lesson
router.post('/lessons/:id/complete', authMiddleware, async (req, res) => {
    try {
        const lessonId = req.params.id;

        // Get lesson XP
        const lesson = await db.query('SELECT xp_reward FROM lessons WHERE id = $1', [lessonId]);
        if (lesson.rows.length === 0) {
            return res.status(404).json({ error: 'Lesson not found' });
        }

        const xpReward = lesson.rows[0].xp_reward;

        // Mark lesson as completed
        await db.query(
            'INSERT INTO user_lessons (user_id, lesson_id, completed_at) VALUES ($1, $2, NOW()) ON CONFLICT DO NOTHING',
            [req.userId, lessonId]
        );

        // Award XP to user
        await db.query(
            'UPDATE users SET xp = xp + $1 WHERE id = $2',
            [xpReward, req.userId]
        );

        res.json({ message: 'Lesson completed', xp_earned: xpReward });
    } catch (error) {
        console.error(error);
        res.status(500).json({ error: 'Server error' });
    }
});

// Get user progress
router.get('/progress', authMiddleware, async (req, res) => {
    try {
        const total = await db.query('SELECT COUNT(*) as total FROM lessons');
        const completed = await db.query('SELECT COUNT(*) as completed FROM user_lessons WHERE user_id = $1', [req.userId]);

        res.json({
            total: parseInt(total.rows[0].total),
            completed: parseInt(completed.rows[0].completed),
            progress: Math.round((completed.rows[0].completed / total.rows[0].total) * 100),
        });
    } catch (error) {
        console.error(error);
        res.status(500).json({ error: 'Server error' });
    }
});

module.exports = router;

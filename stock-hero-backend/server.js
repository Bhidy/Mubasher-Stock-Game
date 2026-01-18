const express = require('express');
const cors = require('cors');
const dotenv = require('dotenv');

dotenv.config();

const app = express();
const PORT = process.env.PORT || 3000;

// Middleware
app.use(cors());
app.use(express.json());

// Routes
app.use('/api/auth', require('./routes/auth'));
app.use('/api/users', require('./routes/users'));
app.use('/api/stocks', require('./routes/stocks'));
app.use('/api/contests', require('./routes/contests'));
app.use('/api/picks', require('./routes/picks'));
app.use('/api/leaderboard', require('./routes/leaderboard'));
app.use('/api/community', require('./routes/community'));
app.use('/api/academy', require('./routes/academy'));
app.use('/api/yahoo', require('./routes/yahoo'));
app.use('/api/ingest', require('./routes/ingest')); // NEW: Serverless Ingestion

// NEW: Production Proxies for Full Restoration
app.use('/api/news', require('./routes/news'));
app.use('/api/content', require('./routes/content'));
app.use('/api/translate', require('./routes/translate'));
app.use('/api/ai-rewrite', require('./routes/ai_rewrite'));
app.use('/api/chatbot', require('./routes/ai_rewrite')); // Alias for frontend compatibility
app.use('/api/stock-profile', require('./routes/stock_profile'));
app.use('/api/cms', require('./routes/cms'));
app.use('/api/chart', require('./routes/chart'));
app.use('/api/x-community', require('./routes/x_community'));

// Health check
app.get('/health', (req, res) => {
    res.json({ status: 'ok', message: 'Mubasher Stock Game API is running' });
});

// Error handling middleware
app.use((err, req, res, next) => {
    console.error(err.stack);
    res.status(500).json({ error: 'Something went wrong!' });
});

app.listen(PORT, () => {
    console.log(`🚀 Server running on port ${PORT}`);
});

module.exports = app;

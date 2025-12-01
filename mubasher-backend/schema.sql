-- Create database
CREATE DATABASE mubasher_stock_game;

-- Connect to database
\c mubasher_stock_game;

-- Users table
CREATE TABLE users (
  id SERIAL PRIMARY KEY,
  email VARCHAR(255) UNIQUE NOT NULL,
  password VARCHAR(255) NOT NULL,
  name VARCHAR(255) NOT NULL,
  coins INTEGER DEFAULT 1000,
  level INTEGER DEFAULT 1,
  xp INTEGER DEFAULT 0,
  rank INTEGER DEFAULT 0,
  streak INTEGER DEFAULT 0,
  created_at TIMESTAMP DEFAULT NOW(),
  updated_at TIMESTAMP DEFAULT NOW()
);

-- Stocks table
CREATE TABLE stocks (
  id SERIAL PRIMARY KEY,
  ticker VARCHAR(10) UNIQUE NOT NULL,
  name VARCHAR(255) NOT NULL,
  current_price DECIMAL(10, 2),
  change_percent DECIMAL(5, 2),
  rarity VARCHAR(20) DEFAULT 'common',
  sector VARCHAR(100),
  created_at TIMESTAMP DEFAULT NOW(),
  updated_at TIMESTAMP DEFAULT NOW()
);

-- Contests table
CREATE TABLE contests (
  id SERIAL PRIMARY KEY,
  status VARCHAR(20) DEFAULT 'active',
  prize_pool INTEGER DEFAULT 10000,
  start_time TIMESTAMP DEFAULT NOW(),
  end_time TIMESTAMP,
  created_at TIMESTAMP DEFAULT NOW()
);

-- Picks table
CREATE TABLE picks (
  id SERIAL PRIMARY KEY,
  user_id INTEGER REFERENCES users(id) ON DELETE CASCADE,
  contest_id INTEGER REFERENCES contests(id) ON DELETE CASCADE,
  stock_id INTEGER REFERENCES stocks(id) ON DELETE CASCADE,
  created_at TIMESTAMP DEFAULT NOW(),
  UNIQUE(user_id, contest_id, stock_id)
);

-- Contest results table
CREATE TABLE contest_results (
  id SERIAL PRIMARY KEY,
  user_id INTEGER REFERENCES users(id) ON DELETE CASCADE,
  contest_id INTEGER REFERENCES contests(id) ON DELETE CASCADE,
  rank INTEGER NOT NULL,
  gain_percent DECIMAL(5, 2),
  coins_won INTEGER DEFAULT 0,
  created_at TIMESTAMP DEFAULT NOW()
);

-- Posts table (Community)
CREATE TABLE posts (
  id SERIAL PRIMARY KEY,
  user_id INTEGER REFERENCES users(id) ON DELETE CASCADE,
  content TEXT NOT NULL,
  created_at TIMESTAMP DEFAULT NOW()
);

-- Post likes table
CREATE TABLE post_likes (
  id SERIAL PRIMARY KEY,
  user_id INTEGER REFERENCES users(id) ON DELETE CASCADE,
  post_id INTEGER REFERENCES posts(id) ON DELETE CASCADE,
  created_at TIMESTAMP DEFAULT NOW(),
  UNIQUE(user_id, post_id)
);

-- Post comments table
CREATE TABLE post_comments (
  id SERIAL PRIMARY KEY,
  user_id INTEGER REFERENCES users(id) ON DELETE CASCADE,
  post_id INTEGER REFERENCES posts(id) ON DELETE CASCADE,
  content TEXT NOT NULL,
  created_at TIMESTAMP DEFAULT NOW()
);

-- Discussions table
CREATE TABLE discussions (
  id SERIAL PRIMARY KEY,
  user_id INTEGER REFERENCES users(id) ON DELETE CASCADE,
  title VARCHAR(255) NOT NULL,
  category VARCHAR(50),
  created_at TIMESTAMP DEFAULT NOW()
);

-- Discussion replies table
CREATE TABLE discussion_replies (
  id SERIAL PRIMARY KEY,
  user_id INTEGER REFERENCES users(id) ON DELETE CASCADE,
  discussion_id INTEGER REFERENCES discussions(id) ON DELETE CASCADE,
  content TEXT NOT NULL,
  created_at TIMESTAMP DEFAULT NOW()
);

-- Lessons table (Academy)
CREATE TABLE lessons (
  id SERIAL PRIMARY KEY,
  title VARCHAR(255) NOT NULL,
  description TEXT,
  content TEXT,
  duration VARCHAR(20),
  xp_reward INTEGER DEFAULT 50,
  category VARCHAR(50),
  order_index INTEGER,
  is_locked BOOLEAN DEFAULT false,
  created_at TIMESTAMP DEFAULT NOW()
);

-- User lessons (progress tracking)
CREATE TABLE user_lessons (
  id SERIAL PRIMARY KEY,
  user_id INTEGER REFERENCES users(id) ON DELETE CASCADE,
  lesson_id INTEGER REFERENCES lessons(id) ON DELETE CASCADE,
  completed_at TIMESTAMP,
  UNIQUE(user_id, lesson_id)
);

-- Achievements table
CREATE TABLE achievements (
  id SERIAL PRIMARY KEY,
  title VARCHAR(255) NOT NULL,
  description TEXT,
  icon VARCHAR(50),
  rarity VARCHAR(20),
  created_at TIMESTAMP DEFAULT NOW()
);

-- User achievements
CREATE TABLE user_achievements (
  id SERIAL PRIMARY KEY,
  user_id INTEGER REFERENCES users(id) ON DELETE CASCADE,
  achievement_id INTEGER REFERENCES achievements(id) ON DELETE CASCADE,
  unlocked_at TIMESTAMP DEFAULT NOW(),
  UNIQUE(user_id, achievement_id)
);

-- Insert sample stocks
INSERT INTO stocks (ticker, name, current_price, change_percent, rarity, sector) VALUES
('AAPL', 'Apple Inc.', 189.45, 1.2, 'rare', 'Technology'),
('NVDA', 'NVIDIA Corp.', 875.30, 3.5, 'epic', 'Technology'),
('TSLA', 'Tesla Inc.', 175.20, -2.1, 'legendary', 'Automotive'),
('MSFT', 'Microsoft Corp.', 378.91, 0.8, 'rare', 'Technology'),
('GOOGL', 'Alphabet Inc.', 140.25, 1.5, 'common', 'Technology'),
('AMZN', 'Amazon.com Inc.', 151.94, -0.5, 'common', 'E-commerce'),
('META', 'Meta Platforms', 485.20, 2.3, 'rare', 'Technology'),
('AMD', 'Advanced Micro Devices', 165.80, 1.8, 'rare', 'Technology'),
('NFLX', 'Netflix Inc.', 485.50, -1.2, 'common', 'Entertainment'),
('DIS', 'Walt Disney Co.', 92.15, 0.5, 'common', 'Entertainment');

-- Insert sample lessons
INSERT INTO lessons (title, description, content, duration, xp_reward, category, order_index, is_locked) VALUES
('Stock Market Basics', 'Learn the fundamentals of stock trading', 'Introduction to stocks, markets, and trading...', '10 min', 50, 'Beginner', 1, false),
('Reading Stock Charts', 'Understand price movements and trends', 'How to read candlestick charts, support/resistance...', '15 min', 75, 'Beginner', 2, false),
('Risk Management', 'Protect your portfolio and minimize losses', 'Position sizing, stop losses, diversification...', '12 min', 100, 'Strategy', 3, false),
('Technical Indicators', 'Master RSI, MACD, and moving averages', 'Understanding and using technical indicators...', '20 min', 150, 'Analysis', 4, false),
('Advanced Trading Strategies', 'Learn swing trading and momentum plays', 'Advanced strategies for experienced traders...', '25 min', 200, 'Advanced', 5, true);

-- Create indexes for performance
CREATE INDEX idx_picks_user_contest ON picks(user_id, contest_id);
CREATE INDEX idx_contest_results_contest ON contest_results(contest_id, rank);
CREATE INDEX idx_posts_created ON posts(created_at DESC);
CREATE INDEX idx_stocks_ticker ON stocks(ticker);
CREATE INDEX idx_users_email ON users(email);

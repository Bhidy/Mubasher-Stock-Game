# Mubasher Stock Game - Backend API

A RESTful API for the Mubasher Stock Game mobile app.

## 🚀 Quick Start

### Prerequisites
- Node.js 18+
- PostgreSQL 14+

### Installation

```bash
cd mubasher-backend
npm install
```

### Database Setup

```bash
# Create database and tables
psql -U postgres -f schema.sql

# Or manually:
createdb mubasher_stock_game
psql -U postgres -d mubasher_stock_game -f schema.sql
```

### Environment Setup

```bash
# Copy environment template
cp .env.example .env

# Edit .env with your database credentials
nano .env
```

### Running the Server

```bash
# Development (with auto-reload)
npm run dev

# Production
npm start
```

Server will run on `http://localhost:3000`

## 📚 API Endpoints

### Authentication
- `POST /api/auth/register` - Register new user
- `POST /api/auth/login` - Login user

### Users
- `GET /api/users/profile` - Get user profile (auth required)
- `PUT /api/users/profile` - Update profile (auth required)
- `GET /api/users/stats` - Get user stats (auth required)

### Stocks
- `GET /api/stocks` - Get all stocks
- `GET /api/stocks/:ticker` - Get stock by ticker
- `GET /api/stocks/trending/today` - Get trending stocks

### Contests
- `GET /api/contests/current` - Get current active contest
- `GET /api/contests/:id/results` - Get contest results

### Picks
- `POST /api/picks` - Submit stock picks (auth required)
- `GET /api/picks/my-picks` - Get user's current picks (auth required)

### Leaderboard
- `GET /api/leaderboard?period=today` - Get leaderboard (today/yesterday)

### Community
- `GET /api/community/posts` - Get community posts
- `POST /api/community/posts` - Create post (auth required)
- `POST /api/community/posts/:id/like` - Like post (auth required)
- `GET /api/community/discussions` - Get discussions

### Academy
- `GET /api/academy/lessons` - Get all lessons
- `POST /api/academy/lessons/:id/complete` - Complete lesson (auth required)
- `GET /api/academy/progress` - Get user progress (auth required)

## 🔐 Authentication

All protected endpoints require a JWT token in the Authorization header:

```
Authorization: Bearer <your-jwt-token>
```

## 🗄️ Database Schema

### Tables
- `users` - User accounts
- `stocks` - Available stocks
- `contests` - Daily contests
- `picks` - User stock picks
- `contest_results` - Contest rankings
- `posts` - Community posts
- `post_likes` - Post likes
- `post_comments` - Post comments
- `discussions` - Community discussions
- `discussion_replies` - Discussion replies
- `lessons` - Academy lessons
- `user_lessons` - User lesson progress
- `achievements` - Available achievements
- `user_achievements` - User unlocked achievements

## 🛠️ Tech Stack

- **Runtime**: Node.js
- **Framework**: Express.js
- **Database**: PostgreSQL
- **Authentication**: JWT (jsonwebtoken)
- **Password Hashing**: bcryptjs
- **CORS**: cors middleware

## 📦 Deployment

### Heroku

```bash
# Login to Heroku
heroku login

# Create app
heroku create mubasher-stock-game-api

# Add PostgreSQL
heroku addons:create heroku-postgresql:mini

# Deploy
git push heroku main

# Run migrations
heroku pg:psql < schema.sql
```

### Railway

```bash
# Install Railway CLI
npm install -g @railway/cli

# Login
railway login

# Initialize project
railway init

# Add PostgreSQL
railway add

# Deploy
railway up
```

## 🔧 Environment Variables

Required environment variables:

```
PORT=3000
NODE_ENV=production
DB_USER=your_db_user
DB_HOST=your_db_host
DB_NAME=mubasher_stock_game
DB_PASSWORD=your_db_password
DB_PORT=5432
JWT_SECRET=your-secret-key
ALLOWED_ORIGINS=https://your-app.com
```

## 📝 License

Private project - All rights reserved

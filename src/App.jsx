import React, { useState, createContext, useContext, useEffect } from 'react';
import { BrowserRouter, Routes, Route, Navigate, useLocation } from 'react-router-dom';
import Layout from './components/Layout';
import { PriceProvider } from './context/PriceContext';
import { MarketProvider } from './context/MarketContext';
import { ModeProvider, useMode } from './context/ModeContext';

// Import mode-specific styles
import './styles/mode-themes.css';

// Shared Screens
import Onboarding from './screens/Onboarding';
import CompanyProfile from './screens/CompanyProfile';
import NewsArticle from './screens/NewsArticle';
import NewsFeed from './screens/NewsFeed';
import XCommunity from './screens/XCommunity';
import MarketSummary from './screens/MarketSummary';
import Leaderboard from './screens/Leaderboard';

// Legacy screens (will be migrated)
import Home from './screens/Home';
import Pick from './screens/Pick';
import Live from './screens/Live';
import Rewards from './screens/Rewards';
import Academy from './screens/Academy';
import Community from './screens/Community';
import Invite from './screens/Invite';
import Clans from './screens/Clans';
import DailySpin from './screens/DailySpin';
import LessonDetail from './screens/LessonDetail';
import DiscussionDetail from './screens/DiscussionDetail';
import ClanDetail from './screens/ClanDetail';

// Player Mode Screens
import PlayerHome from './screens/player/PlayerHome';
import PlayerChallenges from './screens/player/PlayerChallenges';
import PlayerAchievements from './screens/player/PlayerAchievements';
import PlayerShop from './screens/player/PlayerShop';

// Investor Mode Screens
import InvestorHome from './screens/investor/InvestorHome';
import InvestorPortfolio from './screens/investor/InvestorPortfolio';
import InvestorWatchlist from './screens/investor/InvestorWatchlist';
import InvestorScreener from './screens/investor/InvestorScreener';
import InvestorCalendar from './screens/investor/InvestorCalendar';
import InvestorAlerts from './screens/investor/InvestorAlerts';
import InvestorNotes from './screens/investor/InvestorNotes';

// CMS Admin Screens
import AdminLayout from './cms/AdminLayout';
import AdminDashboard from './cms/AdminDashboard';
import AdminLessons from './cms/AdminLessons';
import AdminChallenges from './cms/AdminChallenges';
import AdminAchievements from './cms/AdminAchievements';
import AdminShop from './cms/AdminShop';

import profileImg from './assets/profile.jpg';

export const UserContext = createContext();

// Mode-aware route component
function ModeAwareRoutes() {
  const { mode, isPlayerMode } = useMode();
  const location = useLocation();

  // Set data-mode attribute on body for CSS targeting
  useEffect(() => {
    document.body.setAttribute('data-mode', mode);
    return () => document.body.removeAttribute('data-mode');
  }, [mode]);

  return (
    <Routes>
      {/* Onboarding - Always accessible */}
      <Route path="/" element={<Onboarding />} />

      {/* Smart redirect for /home based on mode */}
      <Route path="/home" element={
        <Navigate to={isPlayerMode ? '/player/home' : '/investor/home'} replace />
      } />

      {/* ============================================
                PLAYER MODE ROUTES
                ============================================ */}
      <Route path="/player">
        <Route path="home" element={<PlayerHome />} />
        <Route path="pick" element={<Pick />} />
        <Route path="live" element={<Live />} />
        <Route path="learn" element={<Academy />} />
        <Route path="challenges" element={<PlayerChallenges />} />
        <Route path="achievements" element={<PlayerAchievements />} />
        <Route path="shop" element={<PlayerShop />} />
      </Route>

      {/* ============================================
                INVESTOR MODE ROUTES
                ============================================ */}
      <Route path="/investor">
        <Route path="home" element={<InvestorHome />} />
        <Route path="portfolio" element={<InvestorPortfolio />} />
        <Route path="watchlist" element={<InvestorWatchlist />} />
        <Route path="screener" element={<InvestorScreener />} />
        <Route path="analysis" element={<MarketSummary />} />
        <Route path="calendar" element={<InvestorCalendar />} />
        <Route path="alerts" element={<InvestorAlerts />} />
        <Route path="notes" element={<InvestorNotes />} />
      </Route>

      {/* ============================================
                SHARED ROUTES (Both Modes)
                ============================================ */}
      {/* Market & Data */}
      <Route path="/market" element={<MarketSummary />} />
      <Route path="/company/:symbol" element={<CompanyProfile />} />
      <Route path="/analysis/:symbol" element={<Navigate to="/company/:symbol" replace />} />

      {/* News */}
      <Route path="/news" element={<NewsArticle />} />
      <Route path="/news-feed" element={<NewsFeed />} />

      {/* Social */}
      <Route path="/x-community" element={<XCommunity />} />
      <Route path="/community" element={<Community />} />
      <Route path="/community/discussion/:id" element={<DiscussionDetail />} />

      {/* Competition */}
      <Route path="/leaderboard" element={<Leaderboard />} />
      <Route path="/pick" element={<Pick />} />
      <Route path="/live" element={<Live />} />

      {/* Engagement */}
      <Route path="/rewards" element={<Rewards />} />
      <Route path="/spin" element={<DailySpin />} />
      <Route path="/invite" element={<Invite />} />

      {/* Clans */}
      <Route path="/clans" element={<Clans />} />
      <Route path="/clans/:id" element={<ClanDetail />} />

      {/* Education */}
      <Route path="/academy" element={<Academy />} />
      <Route path="/academy/lesson/:lessonId" element={<LessonDetail />} />

      {/* ============================================
                ADMIN CMS ROUTES
                ============================================ */}
      <Route path="/admin" element={<AdminLayout><AdminDashboard /></AdminLayout>} />
      <Route path="/admin/lessons" element={<AdminLayout><AdminLessons /></AdminLayout>} />
      <Route path="/admin/challenges" element={<AdminLayout><AdminChallenges /></AdminLayout>} />
      <Route path="/admin/achievements" element={<AdminLayout><AdminAchievements /></AdminLayout>} />
      <Route path="/admin/shop" element={<AdminLayout><AdminShop /></AdminLayout>} />

      {/* Catch-all redirect */}
      <Route path="*" element={<Navigate to="/" replace />} />
    </Routes>
  );
}

export default function App() {
  const [user, setUser] = useState({
    name: 'BHIDY',
    avatar: profileImg,
    coins: 1250,
    level: 7,
    levelTitle: 'Market Rookie',
    streak: 3,
    rank: 1247,
    gain: 2.45,
    picks: [], // { ticker, price, change, name }
    isLocked: false,
    hasSeenDailySpin: false, // Track if user has seen daily spin this session
    // New fields for dual-mode
    xp: 750,
    xpToNextLevel: 1000,
    achievements: [],
    // Investor mode fields
    portfolioValue: 125000,
    portfolioChange: 2.35,
    watchlistCount: 12,
    alertsCount: 3,
  });

  const [showChat, setShowChat] = useState(false);

  return (
    <UserContext.Provider value={{ user, setUser, showChat, setShowChat }}>
      <ModeProvider>
        <MarketProvider>
          <PriceProvider>
            <BrowserRouter>
              <Layout>
                <ModeAwareRoutes />
              </Layout>
            </BrowserRouter>
          </PriceProvider>
        </MarketProvider>
      </ModeProvider>
    </UserContext.Provider>
  );
}

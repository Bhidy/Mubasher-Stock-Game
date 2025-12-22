import React, { useState, useEffect } from 'react';
import { BrowserRouter, Routes, Route, Navigate, useLocation } from 'react-router-dom';
import Layout from './components/Layout';
import { PriceProvider } from './context/PriceContext';
import { MarketProvider } from './context/MarketContext';
import { ModeProvider, useMode } from './context/ModeContext';
import { CMSProvider } from './context/CMSContext';
import { ToastProvider } from './components/shared/Toast';
import { UserProvider } from './context/UserContext';

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
import MainSwipeWrapper from './components/Layout/MainSwipeWrapper';

// Auth Screen
import Auth from './screens/Auth';

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
import InvestorAnalysis from './screens/investor/InvestorAnalysis';
import AIReportPage from './screens/investor/AIReportPage';
import InvestorMarkets from './screens/investor/InvestorMarkets';
import InvestorCalendar from './screens/investor/InvestorCalendar';
import InvestorAlerts from './screens/investor/InvestorAlerts';
import InvestorNotes from './screens/investor/InvestorNotes';

// Shared Screens (both modes)
import Profile from './screens/shared/Profile';
import Notifications from './screens/shared/Notifications';

// CMS Admin Screens
import AdminLayout from './cms/AdminLayout';
import AdminDashboard from './cms/AdminDashboard';
import AdminLessons from './cms/AdminLessons';
import AdminChallenges from './cms/AdminChallenges';
import AdminAchievements from './cms/AdminAchievements';
import AdminShop from './cms/AdminShop';
import AdminNews from './cms/AdminNews';
import AdminAnnouncements from './cms/AdminAnnouncements';
import AdminLogin from './cms/AdminLogin';
import AdminContests from './cms/AdminContests';
import UserManagement from './cms/UserManagement';
import AdminSettings from './cms/AdminSettings';
import AdminNotifications from './cms/AdminNotifications';
import AdminNewsFeed from './cms/AdminNewsFeed';
import AdminCompanyProfile from './cms/AdminCompanyProfile';
import AdminMarketProfile from './cms/AdminMarketProfile';
import AdminGlobalMarkets from './cms/AdminGlobalMarkets';
import AdminXCommunity from './cms/AdminXCommunity';
import AdminAIDashboard from './cms/AdminAIDashboard';
import AdminWatchlist from './cms/AdminWatchlist';


// Import RequireAuth component
import RequireAuth from './components/shared/RequireAuth';

// Mode-aware route component
function ModeAwareRoutes() {
  const { mode, isPlayerMode } = useMode();
  const location = useLocation();

  // Set data-mode attribute on body for CSS targeting
  useEffect(() => {
    if (document.body) {
      document.body.setAttribute('data-mode', mode);
    }
    return () => {
      if (document.body) {
        document.body.removeAttribute('data-mode');
      }
    };
  }, [mode]);

  // Signal that app has mounted (for PWA loading screen)
  useEffect(() => {
    window.dispatchEvent(new Event('app-mounted'));
  }, []);

  return (
    <Routes>
      {/* Public Routes */}
      <Route path="/auth" element={<Auth />} />
      <Route path="/onboarding" element={<Onboarding />} />

      {/* Protected Routes - All main app routes require login */}
      <Route element={<RequireAuth />}>
        {/* Default Route - Navigates to appropriate home based on mode */}
        <Route path="/" element={<Navigate to="/home" replace />} />

        {/* Smart redirect for /home based on mode */}
        <Route path="/home" element={
          <Navigate to={isPlayerMode ? '/player/home' : '/investor/home'} replace />
        } />

        {/* PLAYER MODE ROUTES */}
        <Route path="/player">
          <Route path="home" element={<MainSwipeWrapper />} />
          <Route path="pick" element={<MainSwipeWrapper />} />
          <Route path="live" element={<MainSwipeWrapper />} />
          <Route path="learn" element={<MainSwipeWrapper />} />
          <Route path="challenges" element={<PlayerChallenges />} />
          <Route path="achievements" element={<PlayerAchievements />} />
          <Route path="shop" element={<PlayerShop />} />
        </Route>

        {/* INVESTOR MODE ROUTES */}
        <Route path="/investor">
          <Route path="home" element={<MainSwipeWrapper />} />
          <Route path="portfolio" element={<MainSwipeWrapper />} />
          <Route path="watchlist" element={<MainSwipeWrapper />} />
          <Route path="screener" element={<InvestorScreener />} />
          <Route path="analysis" element={<MainSwipeWrapper />} />
          <Route path="ai-report" element={<AIReportPage />} />
          <Route path="markets" element={<InvestorMarkets />} />
          <Route path="calendar" element={<InvestorCalendar />} />
          <Route path="alerts" element={<InvestorAlerts />} />
          <Route path="notes" element={<InvestorNotes />} />
        </Route>

        {/* SHARED ROUTES */}
        <Route path="/market" element={<MainSwipeWrapper />} />
        <Route path="/company/:symbol" element={<CompanyProfile />} />
        <Route path="/analysis/:symbol" element={<Navigate to="/company/:symbol" replace />} />
        <Route path="/news" element={<NewsArticle />} />
        <Route path="/news-feed" element={<NewsFeed />} />
        <Route path="/x-community" element={<XCommunity />} />
        <Route path="/community" element={<MainSwipeWrapper />} />
        <Route path="/community/discussion/:id" element={<DiscussionDetail />} />
        <Route path="/leaderboard" element={<Leaderboard />} />
        <Route path="/pick" element={<Pick />} />
        <Route path="/live" element={<Live />} />
        <Route path="/rewards" element={<Rewards />} />
        <Route path="/spin" element={<DailySpin />} />
        <Route path="/invite" element={<Invite />} />
        <Route path="/clans" element={<Clans />} />
        <Route path="/clans/:id" element={<ClanDetail />} />
        <Route path="/academy" element={<Academy />} />
        <Route path="/academy/lesson/:lessonId" element={<LessonDetail />} />
        <Route path="/profile" element={<Profile />} />
        <Route path="/notifications" element={<Notifications />} />
      </Route>

      {/* Catch-all - redirect to home (which will redirect to auth if needed) */}
      <Route path="*" element={<Navigate to="/" replace />} />
    </Routes >
  );
}

import { NotificationProvider } from './context/NotificationContext';

export default function App() {
  return (
    <UserProvider>
      <ToastProvider>
        <CMSProvider>
          <NotificationProvider>
            <ModeProvider>
              <MarketProvider>
                <PriceProvider>
                  <BrowserRouter>
                    <AppRoutes />
                  </BrowserRouter>
                </PriceProvider>
              </MarketProvider>
            </ModeProvider>
          </NotificationProvider>
        </CMSProvider>
      </ToastProvider>
    </UserProvider>
  );
}

// Separate component to handle routing logic - determines if we show Layout or AdminLayout
function AppRoutes() {
  const location = useLocation();
  const isAdminRoute = location.pathname.startsWith('/admin');
  const isAuthRoute = location.pathname === '/auth';

  // Toggle admin mode class on #root to disable phone frame styling
  useEffect(() => {
    const root = document.getElementById('root');
    if (root) {
      if (isAdminRoute) {
        root.classList.add('admin-mode');
      } else {
        root.classList.remove('admin-mode');
      }
    }
    return () => {
      if (root) {
        root.classList.remove('admin-mode');
      }
    };
  }, [isAdminRoute]);

  return (
    <Routes>
      <Route path="/admin/*" element={<AdminRoutes />} />
      <Route path="*" element={
        // Don't show Layout on Auth page
        isAuthRoute ? (
          <ModeAwareRoutes />
        ) : (
          <Layout>
            <ModeAwareRoutes />
          </Layout>
        )
      } />
    </Routes>
  );
}

// Admin CMS Routes - full desktop view, no phone frame
function AdminRoutes() {
  return (
    <Routes>
      <Route path="login" element={<AdminLogin />} />
      <Route index element={<AdminLayout><AdminDashboard /></AdminLayout>} />
      <Route path="lessons" element={<AdminLayout><AdminLessons /></AdminLayout>} />
      <Route path="challenges" element={<AdminLayout><AdminChallenges /></AdminLayout>} />
      <Route path="achievements" element={<AdminLayout><AdminAchievements /></AdminLayout>} />
      <Route path="shop" element={<AdminLayout><AdminShop /></AdminLayout>} />
      <Route path="news" element={<AdminLayout><AdminNews /></AdminLayout>} />
      <Route path="announcements" element={<AdminLayout><AdminAnnouncements /></AdminLayout>} />
      <Route path="notifications" element={<AdminLayout><AdminNotifications /></AdminLayout>} />
      <Route path="newsfeed" element={<AdminLayout><AdminNewsFeed /></AdminLayout>} />
      <Route path="watchlist" element={<AdminLayout><AdminWatchlist /></AdminLayout>} />
      <Route path="global-markets" element={<AdminLayout><AdminGlobalMarkets /></AdminLayout>} />
      <Route path="x-community" element={<AdminLayout><AdminXCommunity /></AdminLayout>} />
      <Route path="ai-dashboard" element={<AdminLayout><AdminAIDashboard /></AdminLayout>} />
      <Route path="companyprofile" element={<AdminLayout><AdminCompanyProfile /></AdminLayout>} />
      <Route path="marketprofile" element={<AdminLayout><AdminMarketProfile /></AdminLayout>} />
      <Route path="contests" element={<AdminLayout><AdminContests /></AdminLayout>} />
      <Route path="users" element={<AdminLayout><UserManagement /></AdminLayout>} />
      <Route path="settings" element={<AdminLayout><AdminSettings /></AdminLayout>} />
      <Route path="*" element={<Navigate to="login" replace />} />
    </Routes>
  );
}

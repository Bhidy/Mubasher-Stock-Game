import React, { useState, createContext, useContext } from 'react';
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import Layout from './components/Layout';

// Placeholder Screens
import Onboarding from './screens/Onboarding';
import Home from './screens/Home';
import Pick from './screens/Pick';
import Live from './screens/Live';
import Leaderboard from './screens/Leaderboard';
import Rewards from './screens/Rewards';
import Academy from './screens/Academy';
import Community from './screens/Community';
import Invite from './screens/Invite';
import Clans from './screens/Clans';
import DailySpin from './screens/DailySpin';
import CompanyProfile from './screens/CompanyProfile';

import profileImg from './assets/profile.jpg';

export const UserContext = createContext();

export default function App() {
  const [user, setUser] = useState({
    name: 'MOHAMED BHIDY',
    avatar: profileImg,
    coins: 1250,
    level: 7,
    levelTitle: 'Market Rookie',
    streak: 3,
    rank: 1247,
    gain: 2.45,
    picks: [], // { ticker, price, change, name }
    isLocked: false,
  });

  const [showChat, setShowChat] = useState(false);

  return (
    <UserContext.Provider value={{ user, setUser, showChat, setShowChat }}>
      <BrowserRouter>
        <Routes>
          <Route element={<Layout />}>
            <Route path="/" element={<Onboarding />} />
            <Route path="/home" element={<Home />} />
            <Route path="/pick" element={<Pick />} />
            <Route path="/live" element={<Live />} />
            <Route path="/leaderboard" element={<Leaderboard />} />
            <Route path="/rewards" element={<Rewards />} />
            <Route path="/academy" element={<Academy />} />
            <Route path="/community" element={<Community />} />
            <Route path="/invite" element={<Invite />} />
            <Route path="/clans" element={<Clans />} />
            <Route path="/spin" element={<DailySpin />} />
            <Route path="/company/:symbol" element={<CompanyProfile />} />
            <Route path="*" element={<Navigate to="/" replace />} />
          </Route>
        </Routes>
      </BrowserRouter>
    </UserContext.Provider>
  );
}

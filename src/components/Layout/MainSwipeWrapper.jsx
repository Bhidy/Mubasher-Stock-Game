import React, { useMemo, useEffect, useContext } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import SwipeablePages from '../shared/SwipeablePages';
import { useMode } from '../../context/ModeContext';
import { UserContext } from '../../context/UserContext';

// Player Screens
import PlayerHome from '../../screens/player/PlayerHome';
import Pick from '../../screens/Pick';
import Live from '../../screens/Live';
import Academy from '../../screens/Academy';
import Community from '../../screens/Community';

// Investor Screens
import InvestorHome from '../../screens/investor/InvestorHome';
import MarketSummary from '../../screens/MarketSummary';
import InvestorPortfolio from '../../screens/investor/InvestorPortfolio';
import InvestorWatchlist from '../../screens/investor/InvestorWatchlist';
import InvestorAnalysis from '../../screens/investor/InvestorAnalysis';

export default function MainSwipeWrapper() {
    const { isPlayerMode } = useMode();
    const { user } = useContext(UserContext);
    const location = useLocation();
    const navigate = useNavigate();

    const tabs = useMemo(() => {
        if (isPlayerMode) {
            return [
                { path: '/player/home', component: <PlayerHome /> },
                { path: '/player/pick', component: <Pick /> },
                { path: '/player/live', component: <Live /> },
                { path: '/player/learn', component: <Academy /> },
                { path: '/community', component: <Community /> },
            ];
        } else {
            return [
                { path: '/investor/home', component: <InvestorHome /> },
                { path: '/market', component: <MarketSummary /> },
                { path: '/investor/portfolio', component: <InvestorPortfolio /> },
                { path: '/investor/watchlist', component: <InvestorWatchlist /> },
                { path: '/investor/analysis', component: <InvestorAnalysis /> },
            ];
        }
    }, [isPlayerMode]);

    // Find active index based on current path
    // We match if the location includes the path (to handle potential sub-paths if any, though likely exact match is desired)
    // Actually, Layout.jsx does exact match or special logic. Here we need strictly the tab logic.
    const activeIndex = useMemo(() => {
        const index = tabs.findIndex(tab => location.pathname === tab.path);
        // Handle the /home alias
        if (index === -1) {
            if (location.pathname === '/home') return 0;
            // Fallback for /player/home alias?
        }
        return index !== -1 ? index : 0;
    }, [location.pathname, tabs]);

    const handlePageChange = (index) => {
        const targetTab = tabs[index];
        if (targetTab) {
            navigate(targetTab.path);
        }
    };

    // If we are on a route that is NOT in the tabs (but this component is mounted), we default to 0?
    // This component should only be used for the routes defined in tabs.

    return (
        <div style={{ height: '100%', width: '100%' }}>
            <SwipeablePages
                activeIndex={activeIndex}
                onPageChange={handlePageChange}
                disabled={!user.swipeEnabled}
            >
                {tabs.map((tab, i) => (
                    <div key={tab.path} style={{ height: '100%', width: '100%' }}>
                        {tab.component}
                    </div>
                ))}
            </SwipeablePages>
        </div>
    );
}

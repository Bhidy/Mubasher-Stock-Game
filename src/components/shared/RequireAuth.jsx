import React from 'react';
import { Navigate, Outlet } from 'react-router-dom';
import { useUser } from '../../context/UserContext';
import SplashScreen from './SplashScreen';

export default function RequireAuth() {
    const { user, loading } = useUser();

    if (loading) {
        return <SplashScreen />;
    }

    // Check if user is authenticated via Firebase OR in guest mode
    // Note: user object always exists due to local state, so check strict 'isAuthenticated' flag
    // or 'isGuestMode' for guest access.
    if (!user?.isAuthenticated && !user?.isGuestMode) {
        return <Navigate to="/auth" replace />;
    }

    return <Outlet />;
}

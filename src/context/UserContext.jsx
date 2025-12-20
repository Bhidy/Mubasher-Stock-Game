import React, { createContext, useContext, useState, useEffect, useRef, useCallback } from 'react';
import { auth, onAuthStateChanged, signOut } from '../config/firebase';
import {
    getUser,
    createUser,
    updateUser,
    recordLogin,
    upgradeGuestToUser,
    DEFAULT_USER_STATE,
    debouncedUpdateUser
} from '../services/userService';
import { syncUserToCMS } from '../services/cmsUserService';
import profileImg from '../assets/profile.jpg';
import SplashScreen from '../components/shared/SplashScreen';

export const UserContext = createContext();

export function useUser() {
    return useContext(UserContext);
}

// Fields that should NOT be synced to Firestore (UI-only state)
const LOCAL_ONLY_FIELDS = ['isAuthenticated', 'isGuestMode', 'avatar'];

export function UserProvider({ children }) {
    const [user, setUser] = useState(() => {
        // Try to recover state from storage for guest mode
        const saved = localStorage.getItem('appUser');
        if (saved) {
            try {
                const parsed = JSON.parse(saved);
                return {
                    name: 'Guest',
                    ...DEFAULT_USER_STATE,
                    ...parsed,
                    isAuthenticated: false,
                    avatar: profileImg
                };
            } catch (e) {
                console.error('Failed to parse user from storage', e);
            }
        }
        return {
            name: 'Guest',
            ...DEFAULT_USER_STATE,
            isAuthenticated: false,
            avatar: profileImg
        };
    });

    const [loading, setLoading] = useState(true);
    const [showChat, setShowChat] = useState(false);
    const previousUserRef = useRef(null);

    // Load user data from Firestore
    const loadUserFromFirestore = useCallback(async (firebaseUser) => {
        try {
            console.log("🔍 Checking Firestore for user:", firebaseUser.uid);

            // Check if user was in guest mode with progress
            const wasGuest = user?.isGuestMode && (user?.coins !== DEFAULT_USER_STATE.coins || user?.xp > 0);

            let userData;

            if (wasGuest) {
                // Upgrade guest to authenticated user, preserving progress
                console.log("🔄 Upgrading guest to authenticated user...");
                userData = await upgradeGuestToUser(user, firebaseUser);
            } else {
                // Normal flow - check if user exists
                userData = await getUser(firebaseUser.uid);

                if (userData) {
                    // Existing user - record login
                    console.log("✅ Existing user found, loading data...");
                    await recordLogin(firebaseUser.uid);
                } else {
                    // New user - create account
                    console.log("🆕 Creating new user account...");
                    userData = await createUser(firebaseUser);
                }
            }


            // Merge Firestore data with Firebase Auth data
            const finalUserData = {
                ...DEFAULT_USER_STATE,
                ...userData,
                // Always use latest from Firebase Auth
                name: firebaseUser.displayName || userData.displayName || firebaseUser.email?.split('@')[0],
                email: firebaseUser.email,
                emailVerified: firebaseUser.emailVerified,
                photoURL: firebaseUser.photoURL || userData.photoURL,
                uid: firebaseUser.uid,
                provider: firebaseUser.providerData?.[0]?.providerId || 'unknown',
                isAuthenticated: true,
                isGuestMode: false,
                avatar: firebaseUser.photoURL || profileImg
            };

            setUser(finalUserData);

            // Sync user to CMS for admin dashboard
            syncUserToCMS(finalUserData).catch(err =>
                console.warn('CMS sync failed (non-blocking):', err)
            );

            // Clear local storage guest data
            localStorage.removeItem('appUser');

        } catch (error) {
            console.error('Error loading user from Firestore:', error);
            // Fallback to Firebase Auth data only
            setUser(prev => ({
                ...prev,
                name: firebaseUser.displayName || firebaseUser.email?.split('@')[0],
                email: firebaseUser.email,
                photoURL: firebaseUser.photoURL,
                uid: firebaseUser.uid,
                isAuthenticated: true,
                isGuestMode: false,
                avatar: firebaseUser.photoURL || profileImg
            }));
        }
    }, [user?.isGuestMode, user?.coins, user?.xp]);

    // Sync with Firebase Auth
    useEffect(() => {
        const unsubscribe = onAuthStateChanged(auth, async (firebaseUser) => {
            if (firebaseUser) {
                await loadUserFromFirestore(firebaseUser);
            } else {
                console.log("👤 No Firebase User - staying in guest/logged out state");
                // Preserve guest mode if active
                setUser(prev => {
                    if (prev.isGuestMode) {
                        return { ...prev, isAuthenticated: false };
                    }
                    return {
                        name: 'Guest',
                        ...DEFAULT_USER_STATE,
                        isAuthenticated: false,
                        isGuestMode: false,
                        avatar: profileImg
                    };
                });
            }
            setLoading(false);
        });

        // SAFETY: Force splash screen to dismiss after 2s max to prevent hanging
        const safetyTimer = setTimeout(() => {
            setLoading(prev => {
                if (prev) {
                    console.log("⚠️ Splash screen timed out (2s limit), forcing app load");
                    return false;
                }
                return prev;
            });
        }, 2000);

        return () => {
            unsubscribe();
            clearTimeout(safetyTimer);
        };
    }, [loadUserFromFirestore]);

    // Auto-save user changes to Firestore (debounced)
    useEffect(() => {
        // Only save if user is authenticated and data has changed
        if (!user?.isAuthenticated || !user?.uid) return;

        const prevUser = previousUserRef.current;
        previousUserRef.current = user;

        // Skip first render
        if (!prevUser) return;

        // Check if relevant data changed
        const hasChanged = Object.keys(user).some(key => {
            if (LOCAL_ONLY_FIELDS.includes(key)) return false;
            return user[key] !== prevUser[key];
        });

        if (hasChanged) {
            // Filter out local-only fields before saving
            const dataToSave = {};
            Object.keys(user).forEach(key => {
                if (!LOCAL_ONLY_FIELDS.includes(key) && user[key] !== prevUser[key]) {
                    dataToSave[key] = user[key];
                }
            });

            if (Object.keys(dataToSave).length > 0) {
                console.log("💾 Auto-saving user changes:", Object.keys(dataToSave));
                debouncedUpdateUser(user.uid, dataToSave);
            }
        }
    }, [user]);

    // Persist guest data to LocalStorage
    useEffect(() => {
        if (user?.isGuestMode) {
            localStorage.setItem('appUser', JSON.stringify(user));
        }
    }, [user]);

    const logout = async () => {
        try {
            await signOut(auth);
            setUser({
                name: 'Guest',
                ...DEFAULT_USER_STATE,
                isAuthenticated: false,
                isGuestMode: false,
                avatar: profileImg
            });
            localStorage.removeItem('appUser');
            previousUserRef.current = null;
        } catch (error) {
            console.error("Logout failed", error);
        }
    };

    const loginAsGuest = () => {
        setUser(prev => ({
            ...DEFAULT_USER_STATE,
            ...prev,
            name: 'Guest',
            isAuthenticated: false,
            isGuestMode: true,
            avatar: profileImg
        }));
    };

    // Update specific user fields (for game actions)
    const updateUserData = useCallback((updates) => {
        setUser(prev => ({
            ...prev,
            ...updates
        }));
    }, []);

    // Skip splash screen for admin routes
    const isAdminRoute = typeof window !== 'undefined' && window.location.pathname.startsWith('/admin');

    return (
        <UserContext.Provider value={{
            user,
            setUser,
            loading,
            logout,
            loginAsGuest,
            updateUserData,
            showChat,
            setShowChat
        }}>
            {loading && !isAdminRoute ? <SplashScreen /> : children}
        </UserContext.Provider>
    );
}


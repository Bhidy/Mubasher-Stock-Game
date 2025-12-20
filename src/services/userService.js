/**
 * User Service - Centralized user data management with Firestore
 * Handles user creation, retrieval, updates, and persistence
 */

import {
    db,
    doc,
    getDoc,
    setDoc,
    updateDoc,
    serverTimestamp,
    increment,
    deleteDoc
} from '../config/firebase';
import {
    collection,
    query,
    orderBy,
    limit,
    getDocs
} from 'firebase/firestore';

// Default game state for new users
export const DEFAULT_USER_STATE = {
    coins: 1250,
    level: 1,
    levelTitle: 'Newcomer',
    streak: 0,
    rank: 0,
    xp: 0,
    xpToNextLevel: 1000,
    portfolioValue: 100000,
    portfolioChange: 0,
    watchlistCount: 0,
    alertsCount: 0,
    picks: [],
    achievements: [],
    swipeEnabled: false,
    preferredMarket: 'SA',
    language: 'en',
    notifications: true
};

// Timeout wrapper to prevent Firestore operations from hanging indefinitely
const withTimeout = (promise, ms = 8000) => {
    const timeout = new Promise((_, reject) =>
        setTimeout(() => reject(new Error('Firestore operation timeout')), ms)
    );
    return Promise.race([promise, timeout]);
};

/**
 * Create a new user document in Firestore
 * @param {Object} firebaseUser - Firebase Auth user object
 * @param {Object} guestData - Optional guest data to merge
 * @returns {Object} Created user data
 */
export async function createUser(firebaseUser, guestData = null) {
    try {
        const userRef = doc(db, 'users', firebaseUser.uid);

        // Determine the auth provider
        const providerData = firebaseUser.providerData?.[0];
        const provider = providerData?.providerId || 'password';

        // Build user document
        const userData = {
            // Identity
            uid: firebaseUser.uid,
            email: firebaseUser.email || '',
            displayName: firebaseUser.displayName || firebaseUser.email?.split('@')[0] || 'Player',
            photoURL: firebaseUser.photoURL || null,
            provider: provider,

            // Game State - merge guest data if provided, otherwise use defaults
            ...DEFAULT_USER_STATE,
            ...(guestData && {
                coins: guestData.coins || DEFAULT_USER_STATE.coins,
                level: guestData.level || DEFAULT_USER_STATE.level,
                xp: guestData.xp || DEFAULT_USER_STATE.xp,
                picks: guestData.picks || [],
                achievements: guestData.achievements || []
            }),

            // Metadata
            createdAt: serverTimestamp(),
            lastLoginAt: serverTimestamp(),
            lastActiveAt: serverTimestamp(),
            loginCount: 1,
            deviceInfo: navigator.userAgent.substring(0, 200),
            appVersion: import.meta.env.VITE_APP_VERSION || '1.0.0'
        };

        await withTimeout(setDoc(userRef, userData));
        console.log('✅ New user created:', firebaseUser.uid);

        return userData;
    } catch (error) {
        console.error('Error creating user (using fallback):', error.message);
        // Return default user data without persisting to Firestore
        return {
            ...DEFAULT_USER_STATE,
            uid: firebaseUser.uid,
            email: firebaseUser.email || '',
            displayName: firebaseUser.displayName || firebaseUser.email?.split('@')[0] || 'Player',
            photoURL: firebaseUser.photoURL || null,
            provider: 'fallback'
        };
    }
}

/**
 * Get most recent users for global search (limited)
 * @param {number} limitCount - Max number of users to fetch
 * @returns {Array} List of user objects
 */
export async function getAllUsers(limitCount = 50) {
    try {
        const usersRef = collection(db, 'users');
        const q = query(
            usersRef,
            orderBy('createdAt', 'desc'),
            limit(limitCount)
        );

        const snapshot = await getDocs(q);
        return snapshot.docs.map(doc => ({
            id: doc.id,
            ...doc.data()
        }));
    } catch (error) {
        console.error('Error fetching all users:', error);
        return [];
    }
}

/**
 * Get user data from Firestore
 * @param {string} uid - User ID
 * @returns {Object|null} User data or null if not found
 */
export async function getUser(uid) {
    try {
        const userRef = doc(db, 'users', uid);

        // Add timeout to prevent infinite hanging
        const timeoutPromise = new Promise((_, reject) =>
            setTimeout(() => reject(new Error('Firestore timeout')), 8000)
        );

        const userSnap = await Promise.race([
            getDoc(userRef),
            timeoutPromise
        ]);

        if (userSnap.exists()) {
            console.log('✅ User data loaded from Firestore');
            return userSnap.data();
        }
        return null;
    } catch (error) {
        console.error('Error getting user:', error.message);
        // Return null to allow fallback to Firebase Auth data
        return null;
    }
}

/**
 * Update user data in Firestore
 * @param {string} uid - User ID
 * @param {Object} data - Fields to update
 */
export async function updateUser(uid, data) {
    try {
        const userRef = doc(db, 'users', uid);
        await updateDoc(userRef, {
            ...data,
            lastActiveAt: serverTimestamp()
        });
    } catch (error) {
        console.error('Error updating user:', error);
        throw error;
    }
}

/**
 * Record a login event for analytics
 * @param {string} uid - User ID
 */
export async function recordLogin(uid) {
    try {
        const userRef = doc(db, 'users', uid);
        await withTimeout(updateDoc(userRef, {
            lastLoginAt: serverTimestamp(),
            loginCount: increment(1)
        }), 5000); // 5 second timeout for login recording (non-blocking)
    } catch (error) {
        console.error('Error recording login (non-critical):', error.message);
        // Don't throw - this is not critical for app functionality
    }
}

/**
 * Update user's last active timestamp (heartbeat)
 * @param {string} uid - User ID
 */
export async function updateLastActive(uid) {
    try {
        const userRef = doc(db, 'users', uid);
        await updateDoc(userRef, {
            lastActiveAt: serverTimestamp()
        });
    } catch (error) {
        console.error('Error updating last active:', error);
    }
}

/**
 * Upgrade a guest user to a full authenticated user
 * Preserves guest progress and merges with auth data
 * @param {Object} guestData - Guest user's local state
 * @param {Object} firebaseUser - Firebase Auth user object
 * @returns {Object} Merged user data
 */
export async function upgradeGuestToUser(guestData, firebaseUser) {
    // Check if user already exists (returning user)
    const existingUser = await getUser(firebaseUser.uid);

    if (existingUser) {
        // User exists - merge guest progress with existing account
        const mergedData = {
            // Keep higher values
            coins: Math.max(existingUser.coins || 0, guestData?.coins || 0),
            xp: Math.max(existingUser.xp || 0, guestData?.xp || 0),
            level: Math.max(existingUser.level || 1, guestData?.level || 1),
            // Update login
            lastLoginAt: serverTimestamp(),
            loginCount: increment(1)
        };

        await updateUser(firebaseUser.uid, mergedData);
        console.log('🔄 Guest progress merged with existing user');

        return { ...existingUser, ...mergedData };
    } else {
        // Create new user with guest data
        return await createUser(firebaseUser, guestData);
    }
}

/**
 * Delete user account and all associated data
 * @param {string} uid - User ID
 */
export async function deleteUser(uid) {
    try {
        const userRef = doc(db, 'users', uid);
        await deleteDoc(userRef);
        console.log('🗑️ User deleted:', uid);
    } catch (error) {
        console.error('Error deleting user:', error);
        throw error;
    }
}

/**
 * Check if a user exists in Firestore
 * @param {string} uid - User ID
 * @returns {boolean}
 */
export async function userExists(uid) {
    const user = await getUser(uid);
    return user !== null;
}

// Debounce utility for auto-save
let saveTimeout = null;
export function debouncedUpdateUser(uid, data, delay = 2000) {
    if (saveTimeout) {
        clearTimeout(saveTimeout);
    }
    saveTimeout = setTimeout(() => {
        updateUser(uid, data);
        saveTimeout = null;
    }, delay);
}

/**
 * CMS User Service - Syncs authenticated users to backend CMS
 * Stores user data in JSONBlob for admin visibility and analytics
 */

import { getEndpoint } from '../config/api';

const CMS_API_URL = getEndpoint('/api/cms');

/**
 * Sync a user to the CMS backend after authentication
 * @param {Object} userData - User data from Firestore/Firebase Auth
 */
export async function syncUserToCMS(userData) {
    try {
        // Check if user already exists in CMS
        const existingUsers = await fetchCMSUsers();
        const existingUser = existingUsers.find(u => u.uid === userData.uid);

        const cmsUserData = {
            uid: userData.uid,
            email: userData.email || '',
            displayName: userData.displayName || userData.name || 'User',
            photoURL: userData.photoURL || null,
            provider: userData.provider || 'unknown',
            // Game stats
            level: userData.level || 1,
            coins: userData.coins || 0,
            xp: userData.xp || 0,
            rank: userData.rank || 0,
            // Status
            status: 'active',
            role: 'user',
            isVerified: !!userData.email,
            // Preferences
            preferredMarket: userData.preferredMarket || 'SA',
            language: userData.language || 'en',
            // Activity
            lastLoginAt: new Date().toISOString(),
            loginCount: (existingUser?.loginCount || 0) + 1
        };

        if (existingUser) {
            // Update existing user
            await updateCMSUser(existingUser.id, cmsUserData);
            console.log('📤 User synced to CMS (updated):', userData.uid);
        } else {
            // Create new user in CMS
            cmsUserData.createdAt = new Date().toISOString();
            await createCMSUser(cmsUserData);
            console.log('📤 User synced to CMS (created):', userData.uid);
        }

        return true;
    } catch (error) {
        console.error('❌ Failed to sync user to CMS:', error);
        return false;
    }
}

/**
 * Fetch all users from CMS
 */
export async function fetchCMSUsers() {
    try {
        const response = await fetch(`${CMS_API_URL}?entity=users`);
        if (!response.ok) return [];
        return await response.json();
    } catch (error) {
        console.error('Error fetching CMS users:', error);
        return [];
    }
}

/**
 * Create a new user in CMS
 */
async function createCMSUser(userData) {
    const response = await fetch(`${CMS_API_URL}?entity=users`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(userData)
    });

    if (!response.ok) {
        throw new Error('Failed to create CMS user');
    }

    return await response.json();
}

/**
 * Update an existing user in CMS
 */
async function updateCMSUser(id, userData) {
    const response = await fetch(`${CMS_API_URL}?entity=users&id=${id}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(userData)
    });

    if (!response.ok) {
        throw new Error('Failed to update CMS user');
    }

    return await response.json();
}

/**
 * Delete a user from CMS (for account deletion)
 */
export async function deleteCMSUser(uid) {
    try {
        const users = await fetchCMSUsers();
        const user = users.find(u => u.uid === uid);

        if (!user) return false;

        const response = await fetch(`${CMS_API_URL}?entity=users&id=${user.id}`, {
            method: 'DELETE'
        });

        return response.ok;
    } catch (error) {
        console.error('Error deleting CMS user:', error);
        return false;
    }
}

/**
 * Update user stats in CMS (for leaderboards)
 */
export async function updateUserStats(uid, stats) {
    try {
        const users = await fetchCMSUsers();
        const user = users.find(u => u.uid === uid);

        if (!user) return false;

        await updateCMSUser(user.id, stats);
        return true;
    } catch (error) {
        console.error('Error updating user stats:', error);
        return false;
    }
}

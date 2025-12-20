/**
 * Auth Service - Complete authentication utilities
 * Handles password reset, email verification, account deletion, and more
 */

import {
    auth,
    sendPasswordResetEmail,
    sendEmailVerification,
    updateProfile,
    signOut
} from '../config/firebase';
import { deleteUser as deleteFirestoreUser } from './userService';
import { deleteCMSUser } from './cmsUserService';

/**
 * Send password reset email
 * @param {string} email - User's email address
 * @returns {Promise<{success: boolean, message: string}>}
 */
export async function sendPasswordReset(email) {
    try {
        await sendPasswordResetEmail(auth, email);
        console.log('📧 Password reset email sent to:', email);
        return {
            success: true,
            message: 'Password reset email sent! Check your inbox.'
        };
    } catch (error) {
        console.error('Password reset error:', error);

        const errorMessages = {
            'auth/user-not-found': 'No account found with this email.',
            'auth/invalid-email': 'Invalid email address.',
            'auth/too-many-requests': 'Too many requests. Please try again later.',
        };

        return {
            success: false,
            message: errorMessages[error.code] || 'Failed to send reset email. Please try again.'
        };
    }
}

/**
 * Send email verification to current user
 * @returns {Promise<{success: boolean, message: string}>}
 */
export async function sendVerificationEmail() {
    try {
        const user = auth.currentUser;
        if (!user) {
            return { success: false, message: 'No user logged in.' };
        }

        if (user.emailVerified) {
            return { success: true, message: 'Email already verified!' };
        }

        await sendEmailVerification(user);
        console.log('📧 Verification email sent');
        return {
            success: true,
            message: 'Verification email sent! Check your inbox.'
        };
    } catch (error) {
        console.error('Email verification error:', error);

        if (error.code === 'auth/too-many-requests') {
            return {
                success: false,
                message: 'Too many requests. Please wait before trying again.'
            };
        }

        return {
            success: false,
            message: 'Failed to send verification email. Please try again.'
        };
    }
}

/**
 * Update user display name
 * @param {string} displayName - New display name
 * @returns {Promise<{success: boolean, message: string}>}
 */
export async function updateDisplayName(displayName) {
    try {
        const user = auth.currentUser;
        if (!user) {
            return { success: false, message: 'No user logged in.' };
        }

        await updateProfile(user, { displayName });
        console.log('✅ Display name updated');
        return {
            success: true,
            message: 'Display name updated successfully!'
        };
    } catch (error) {
        console.error('Update display name error:', error);
        return {
            success: false,
            message: 'Failed to update display name.'
        };
    }
}

/**
 * Delete user account completely
 * Removes from Firebase Auth, Firestore, and CMS
 * @returns {Promise<{success: boolean, message: string}>}
 */
export async function deleteAccount() {
    try {
        const user = auth.currentUser;
        if (!user) {
            return { success: false, message: 'No user logged in.' };
        }

        const uid = user.uid;

        // 1. Delete from Firestore
        try {
            await deleteFirestoreUser(uid);
        } catch (e) {
            console.warn('Firestore deletion error (may not exist):', e);
        }

        // 2. Delete from CMS
        try {
            await deleteCMSUser(uid);
        } catch (e) {
            console.warn('CMS deletion error (may not exist):', e);
        }

        // 3. Delete from Firebase Auth
        await user.delete();

        console.log('🗑️ Account deleted successfully');
        return {
            success: true,
            message: 'Your account has been deleted.'
        };
    } catch (error) {
        console.error('Account deletion error:', error);

        if (error.code === 'auth/requires-recent-login') {
            return {
                success: false,
                message: 'Please log out and log back in before deleting your account.',
                requiresReauth: true
            };
        }

        return {
            success: false,
            message: 'Failed to delete account. Please contact support.'
        };
    }
}

/**
 * Get current user's auth info
 * @returns {Object} User auth information
 */
export function getCurrentAuthInfo() {
    const user = auth.currentUser;
    if (!user) return null;

    return {
        uid: user.uid,
        email: user.email,
        displayName: user.displayName,
        photoURL: user.photoURL,
        emailVerified: user.emailVerified,
        provider: user.providerData?.[0]?.providerId || 'unknown',
        creationTime: user.metadata?.creationTime,
        lastSignInTime: user.metadata?.lastSignInTime,
        isAnonymous: user.isAnonymous
    };
}

/**
 * Check if user has a password (email/password auth)
 * @returns {boolean}
 */
export function hasPasswordAuth() {
    const user = auth.currentUser;
    if (!user) return false;

    return user.providerData?.some(p => p.providerId === 'password') || false;
}

/**
 * Get linked providers for current user
 * @returns {string[]} Array of provider IDs
 */
export function getLinkedProviders() {
    const user = auth.currentUser;
    if (!user) return [];

    return user.providerData?.map(p => p.providerId) || [];
}

/**
 * Force refresh the current user's auth token
 * Useful after email verification
 */
export async function refreshAuthToken() {
    const user = auth.currentUser;
    if (!user) return false;

    try {
        await user.reload();
        return true;
    } catch (error) {
        console.error('Token refresh error:', error);
        return false;
    }
}

/**
 * Logout the current user
 */
export async function logout() {
    try {
        await signOut(auth);
        return { success: true };
    } catch (error) {
        console.error('Logout error:', error);
        return { success: false, message: 'Logout failed' };
    }
}

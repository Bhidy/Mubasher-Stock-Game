import { Capacitor } from '@capacitor/core';

// Production URL (Cloudflare Pages)
const PROD_URL = 'https://bhidy-app.pages.dev';

/**
 * Returns the base URL for API calls.
 * - On Mobile (Capacitor): Returns the absolute production URL.
 * - On Web (Browser): Returns empty string (relative path) to avoid CORS issues.
 */
export const getApiBaseUrl = () => {
    if (Capacitor.isNativePlatform()) {
        return PROD_URL;
    }
    return ''; // Relative path for web
};

/**
 * Helper to construct full API endpoints
 * @param {string} endpoint - e.g., '/api/cms'
 */
export const getEndpoint = (endpoint) => {
    const base = getApiBaseUrl();
    // Ensure endpoint starts with /
    const path = endpoint.startsWith('/') ? endpoint : `/${endpoint}`;
    return `${base}${path}`;
};

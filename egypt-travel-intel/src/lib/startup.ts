/**
 * Startup script to initialize scheduler and run initial ingestion
 * 
 * This file is imported by the app to set up automated ingestion.
 */

import { startScheduler, runInitialIngestionIfNeeded } from './scheduler';

let initialized = false;

export async function initializeApp() {
    if (initialized) return;
    initialized = true;

    console.log('\n🚀 Egypt Travel Intelligence Platform Starting...\n');

    // Start the scheduler (every 4 hours)
    startScheduler();

    // Run initial ingestion if database is empty
    await runInitialIngestionIfNeeded();

    console.log('\n✅ Platform ready!\n');
}

// Auto-initialize when this module is imported
if (typeof window === 'undefined') {
    // Only run on server side
    initializeApp().catch(console.error);
}

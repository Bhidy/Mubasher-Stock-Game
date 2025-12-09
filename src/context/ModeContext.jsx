import React, { createContext, useContext, useState, useEffect } from 'react';

const ModeContext = createContext();

// Mode configurations with theme settings
export const MODES = {
    player: {
        id: 'player',
        name: 'Player Mode',
        icon: '🎮',
        description: 'Gamified experience for beginners',
        theme: {
            // Primary colors - Vibrant & Playful
            primary: '#8B5CF6',           // Vivid Purple
            primaryLight: '#A78BFA',
            primaryDark: '#7C3AED',
            secondary: '#EC4899',          // Pink
            secondaryLight: '#F472B6',
            accent: '#F59E0B',             // Amber for rewards
            accentGold: '#FBBF24',

            // Background colors - Clean White Base
            background: '#FFFFFF',
            backgroundSecondary: '#FAFAFF',  // Slight purple tint
            backgroundTertiary: '#F3F0FF',
            backgroundCard: '#FFFFFF',

            // Text colors
            textPrimary: '#1F2937',
            textSecondary: '#6B7280',
            textMuted: '#9CA3AF',

            // Status colors
            success: '#10B981',
            successLight: '#D1FAE5',
            warning: '#F59E0B',
            warningLight: '#FEF3C7',
            danger: '#EF4444',
            dangerLight: '#FEE2E2',

            // Gradients
            gradientPrimary: 'linear-gradient(135deg, #8B5CF6 0%, #EC4899 100%)',
            gradientSecondary: 'linear-gradient(135deg, #A78BFA 0%, #F472B6 100%)',
            gradientGold: 'linear-gradient(135deg, #F59E0B 0%, #FBBF24 100%)',
            gradientCard: 'linear-gradient(135deg, #FFFFFF 0%, #FAFAFF 100%)',

            // Shadows
            shadowSm: '0 2px 8px rgba(139, 92, 246, 0.08)',
            shadowMd: '0 4px 16px rgba(139, 92, 246, 0.12)',
            shadowLg: '0 8px 32px rgba(139, 92, 246, 0.16)',

            // Border
            border: '#E9E5FF',
            borderLight: '#F3F0FF',

            // Special
            xpBar: 'linear-gradient(90deg, #8B5CF6 0%, #EC4899 50%, #F59E0B 100%)',
            streakFire: '#F59E0B',
            coinGlow: '#FBBF24',
        },
        features: {
            showXPBar: true,
            showStreaks: true,
            showAchievements: true,
            showCoins: true,
            showDailySpin: true,
            showChallenges: true,
            showLeaderboard: true,
            showClans: true,
            simplifiedCharts: true,
            emojiIndicators: true,
            funAnimations: true,
            tutorialOverlays: true,
            socialFeed: true,
            gamifiedPicks: true,
        }
    },
    investor: {
        id: 'investor',
        name: 'Investor Mode',
        icon: '📈',
        description: 'Professional trading experience',
        theme: {
            // Primary colors - Professional & Trustworthy
            primary: '#0EA5E9',            // Sky Blue
            primaryLight: '#38BDF8',
            primaryDark: '#0284C7',
            secondary: '#10B981',          // Emerald Green
            secondaryLight: '#34D399',
            accent: '#6366F1',             // Indigo
            accentGold: '#F59E0B',         // For gains

            // Background colors - Clean White Base
            background: '#FFFFFF',
            backgroundSecondary: '#F8FAFC',  // Slight blue tint
            backgroundTertiary: '#F0F9FF',
            backgroundCard: '#FFFFFF',

            // Text colors
            textPrimary: '#0F172A',
            textSecondary: '#475569',
            textMuted: '#94A3B8',

            // Status colors
            success: '#10B981',
            successLight: '#D1FAE5',
            warning: '#F59E0B',
            warningLight: '#FEF3C7',
            danger: '#EF4444',
            dangerLight: '#FEE2E2',

            // Gradients
            gradientPrimary: 'linear-gradient(135deg, #0EA5E9 0%, #6366F1 100%)',
            gradientSecondary: 'linear-gradient(135deg, #10B981 0%, #0EA5E9 100%)',
            gradientGold: 'linear-gradient(135deg, #F59E0B 0%, #10B981 100%)',
            gradientCard: 'linear-gradient(135deg, #FFFFFF 0%, #F8FAFC 100%)',

            // Shadows
            shadowSm: '0 1px 4px rgba(15, 23, 42, 0.05)',
            shadowMd: '0 4px 12px rgba(15, 23, 42, 0.08)',
            shadowLg: '0 8px 24px rgba(15, 23, 42, 0.12)',

            // Border
            border: '#E2E8F0',
            borderLight: '#F1F5F9',

            // Special
            profitGreen: '#10B981',
            lossRed: '#EF4444',
            chartLine: '#0EA5E9',
        },
        features: {
            showXPBar: false,
            showStreaks: false,
            showAchievements: false,
            showCoins: false,
            showDailySpin: false,
            showChallenges: false,
            showLeaderboard: true,
            showClans: false,
            simplifiedCharts: false,
            emojiIndicators: false,
            funAnimations: false,
            tutorialOverlays: false,
            socialFeed: false,
            gamifiedPicks: false,
            advancedCharts: true,
            portfolioTracking: true,
            watchlists: true,
            screener: true,
            technicalIndicators: true,
            economicCalendar: true,
            priceAlerts: true,
            researchNotes: true,
        }
    }
};

export function ModeProvider({ children }) {
    // Initialize mode from localStorage or default to 'player'
    const [mode, setModeState] = useState(() => {
        const saved = localStorage.getItem('appMode');
        if (saved && MODES[saved]) {
            return saved;
        }
        return 'player'; // Default to player mode for new users
    });

    const [isTransitioning, setIsTransitioning] = useState(false);

    // Save mode to localStorage whenever it changes
    useEffect(() => {
        localStorage.setItem('appMode', mode);
        applyTheme(MODES[mode].theme);
    }, [mode]);

    // Apply theme CSS variables
    const applyTheme = (theme) => {
        const root = document.documentElement;

        // Set CSS custom properties
        Object.entries(theme).forEach(([key, value]) => {
            const cssVar = `--mode-${key.replace(/([A-Z])/g, '-$1').toLowerCase()}`;
            root.style.setProperty(cssVar, value);
        });

        // Also set common variables
        root.style.setProperty('--primary', theme.primary);
        root.style.setProperty('--primary-light', theme.primaryLight);
        root.style.setProperty('--secondary', theme.secondary);
        root.style.setProperty('--accent', theme.accent);
        root.style.setProperty('--background', theme.background);
        root.style.setProperty('--background-secondary', theme.backgroundSecondary);
        root.style.setProperty('--text-primary', theme.textPrimary);
        root.style.setProperty('--text-secondary', theme.textSecondary);
        root.style.setProperty('--border-color', theme.border);
        root.style.setProperty('--shadow-sm', theme.shadowSm);
        root.style.setProperty('--shadow-md', theme.shadowMd);
        root.style.setProperty('--shadow-lg', theme.shadowLg);
    };

    // Mode switching function with animation
    const switchMode = (newMode) => {
        if (newMode === mode || !MODES[newMode]) return;

        setIsTransitioning(true);

        // Add transition class to body
        document.body.classList.add('mode-transitioning');

        setTimeout(() => {
            setModeState(newMode);

            setTimeout(() => {
                setIsTransitioning(false);
                document.body.classList.remove('mode-transitioning');
            }, 300);
        }, 150);
    };

    // Get current mode config
    const currentMode = MODES[mode];

    // Check if a feature is enabled in current mode
    const hasFeature = (featureName) => {
        return currentMode.features[featureName] ?? false;
    };

    // Get theme value
    const getThemeValue = (key) => {
        return currentMode.theme[key];
    };

    // Check if player mode
    const isPlayerMode = mode === 'player';
    const isInvestorMode = mode === 'investor';

    return (
        <ModeContext.Provider value={{
            mode,
            currentMode,
            switchMode,
            isTransitioning,
            hasFeature,
            getThemeValue,
            isPlayerMode,
            isInvestorMode,
            MODES,
        }}>
            {children}
        </ModeContext.Provider>
    );
}

export function useMode() {
    const context = useContext(ModeContext);
    if (!context) {
        throw new Error('useMode must be used within a ModeProvider');
    }
    return context;
}

// Hook for conditional rendering based on mode
export function useModeFeature(featureName) {
    const { hasFeature } = useMode();
    return hasFeature(featureName);
}

// Hook for getting theme values
export function useModeTheme() {
    const { currentMode } = useMode();
    return currentMode.theme;
}

export default ModeContext;
